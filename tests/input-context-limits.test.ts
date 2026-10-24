import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createTranslator} from 'next-intl';
import {NextRequest} from 'next/server';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {INCIDENT_TEXT_LIMITS,REPORT_TEXT_LIMITS,MAX_REPORTS,MAX_REQUEST_BYTES,jsonBytes,incidentSaveBody,incidentInputOverLimit} from '../src/domain/input-limits';
import {incidentInputSchema,assessmentSchema,type Report,type Discussion} from '../src/domain/types';
import {IncidentEditor} from '../src/components/editor';
import {FeedbackContextNotice,recordedFeedbackSummary} from '../src/components/context-notice';
import {DiscussionView} from '../src/components/discussion';
import {api,type T,type Run,type Detail} from '../src/components/client';
import {messages} from '../src/components/messages';
import {evaluatePolicy} from '../src/domain/policy';
import {dataset} from '../src/domain/evidence';
import {GET,POST} from '../src/app/api/[...path]/route';
import {closeDatabase,database,workspaceFor,createIncident,snapshotFor,saveAssessment,saveReview,saveDiscussion,updateIncident} from '../src/server/db';
import {feedbackForReassessment,summarizeFeedback} from '../src/server/reassessment-feedback';
import {generate,buildRequest} from '../src/ai/service';
import * as provider from '../src/ai/provider';
import recorded from '../evals/development/improvement-before.json';

const base=()=>({...structuredClone(dataset.events[0].input),sourceEventId:null,reports:[] as Report[]});
const report=(id='r'):Report=>({id,text:'Synthetic report',sourceLabel:'Exercise source',applicablePeriod:'Day 7, 14:00',reportedAt:null,originReportId:null,independenceGroup:null,verificationBasis:null,reliability:'unverified',signal:'context',expandingImpact:false,provenanceKind:'team_simulation',sourceEvidenceId:null});
const t=(locale:'en'|'zh')=>createTranslator({locale,messages:messages[locale]}) as T;
let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-context-limits-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;delete process.env.DEEPSEEK_API_KEY;});

describe('input boundaries and retained content',()=>{
  it.each(Object.entries(INCIDENT_TEXT_LIMITS))('keeps the existing incident boundary for %s', (key,limit)=>{
    const at={...base(),[key]:'字'.repeat(limit)},over={...at,[key]:'字'.repeat(limit+1)};
    expect(incidentInputSchema.safeParse(at).success).toBe(true);expect(incidentInputOverLimit(at)).toBe(false);
    expect(incidentInputSchema.safeParse(over).success).toBe(false);expect(incidentInputOverLimit(over)).toBe(true);
  });
  it.each(Object.entries(REPORT_TEXT_LIMITS))('keeps the existing report boundary for %s',(key,limit)=>{
    const at={...base(),reports:[{...report(),[key]:'x'.repeat(limit)}]};
    const over={...at,reports:[{...at.reports[0],[key]:'x'.repeat(limit+1)}]};
    expect(incidentInputSchema.safeParse(at).success).toBe(true);expect(incidentInputOverLimit(at)).toBe(false);
    expect(incidentInputSchema.safeParse(over).success).toBe(false);expect(incidentInputOverLimit(over)).toBe(true);
  });
  it('counts UTF-8 JSON, escapes and the update envelope without altering text',()=>{
    const input={...base(),knownInformation:'中文 🛫 "quote"\n\\'};
    for(const version of [undefined,1,999]){
      const body=incidentSaveBody(input,version);
      expect(jsonBytes(body)).toBe(Buffer.byteLength(JSON.stringify(body),'utf8'));
      expect(version===undefined?body:(body as {input:unknown}).input).toBe(input);
    }
    expect(jsonBytes(incidentSaveBody(input,1))).toBeGreaterThan(jsonBytes(input));
  });
  it('detects a multilingual aggregate overflow even when every field is individually valid',()=>{
    const input={...base(),reports:Array.from({length:12},(_,i)=>({...report(`r${i}`),text:'核'.repeat(6000)}))};
    expect(incidentInputSchema.safeParse(input).success).toBe(true);
    expect(incidentInputOverLimit(input)).toBe(false);expect(jsonBytes(input)).toBeGreaterThan(MAX_REQUEST_BYTES);
  });
  it.each(['en','zh'] as const)('keeps oversized text visible and blocks saving in %s',locale=>{
    const input={...base(),reports:[{...report(),text:'核'.repeat(6001)}]};
    const before=JSON.stringify(input);
    const html=renderToStaticMarkup(React.createElement(IncidentEditor,{input,setInput:()=>{},airports:dataset.airports,locale,t:t(locale),busy:false,onSave:()=>{}}));
    expect(html).toContain(input.reports[0].text);expect(html).toContain('aria-invalid="true"');
    expect(html).toMatch(/class="primary" disabled=""/);expect(html).toContain(t(locale)('inputFieldsTooLong'));
    expect(JSON.stringify(input)).toBe(before);
  });
  it.each(['en','zh'] as const)('shows report capacity and aggregate size in %s',locale=>{
    const input={...base(),reports:Array.from({length:MAX_REPORTS},(_,i)=>report(`r${i}`))};
    const render=()=>renderToStaticMarkup(React.createElement(IncidentEditor,{input,setInput:()=>{},airports:dataset.airports,locale,t:t(locale),busy:false,onSave:()=>{},expectedVersion:4}));
    expect(render()).toMatch(/class="secondary add-report" disabled=""/);
    expect(render()).toContain(t(locale)('inputRequestSize',{count:jsonBytes(incidentSaveBody(input,4)),limit:MAX_REQUEST_BYTES}));
    input.reports.forEach(r=>r.text='核'.repeat(6000));
    expect(render()).toContain(t(locale)('inputRequestTooLarge'));expect(render()).toMatch(/class="primary" disabled=""/);
    input.reports.push(report('extra'));expect(incidentInputSchema.safeParse(input).success).toBe(false);
  });
  it('blocks oversized client requests before fetch, permits the exact boundary and retains the caller input',async()=>{
    const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({ok:true})});vi.stubGlobal('fetch',fetch);
    const body={text:'x'.repeat(MAX_REQUEST_BYTES-jsonBytes({text:''}))};
    expect(jsonBytes(body)).toBe(MAX_REQUEST_BYTES);await api('test',body);expect(fetch).toHaveBeenCalledTimes(1);
    body.text+='x';const before=body.text;
    await expect(api('test',body)).rejects.toThrow('REQUEST_TOO_LARGE');expect(fetch).toHaveBeenCalledTimes(1);expect(body.text).toBe(before);
  });
});

async function request(path:string,token:string,body?:unknown) {
  const req=new NextRequest(`http://localhost:3000/api/${path}`,{method:body===undefined?'GET':'POST',headers:{cookie:`runway-session=${token}`,origin:'http://localhost:3000','Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const response=await (body===undefined?GET:POST)(req,{params:Promise.resolve({path:path.split('/')})});
  return {status:response.status,body:await response.json()};
}
describe('server boundaries and context disclosure',()=>{
  it('preserves server request-size enforcement at the exact boundary and on bypassed oversized input',async()=>{
    const w=workspaceFor(),input={...base(),padding:''};
    input.padding='x'.repeat(MAX_REQUEST_BYTES-jsonBytes(input));expect(jsonBytes(input)).toBe(MAX_REQUEST_BYTES);
    expect((await request('incidents',w.token,input)).status).toBe(200);
    const count=database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get();input.padding+='x';
    expect(await request('incidents',w.token,input)).toMatchObject({status:413,body:{error:'REQUEST_TOO_LARGE'}});
    expect(database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get()).toEqual(count);
  });
  it('returns exact feedback inclusion/omission counts from canonical selection without changing stored reviews',async()=>{
    const w=workspaceFor(),id=createIncident(w.id,incidentInputSchema.parse(recorded.input)),snapshot=snapshotFor(w.id,id);
    expect((await request(`incidents/${id}`,w.token)).body.feedbackContext).toEqual({included:0,total:0,omitted:0});
    for(let i=0;i<26;i++){
      const assessmentId=saveAssessment(w.id,snapshot,`fixture-${i}`,assessmentSchema.parse(recorded.result));
      saveReview(w.id,id,{assessmentId,recommendationId:'first',disposition:'rejected',reason:`Review ${i}`,finalAction:'',outcome:'',outcomeStatus:'pending',nextImprovement:'',reviewerLabel:'Reviewer'});
    }
    const before=database().native.prepare('SELECT * FROM reviews ORDER BY id').all();
    const expected=summarizeFeedback(feedbackForReassessment(w.id,snapshot));expect(expected).toEqual({included:24,total:26,omitted:2});
    expect((await request(`incidents/${id}`,w.token)).body.feedbackContext).toEqual(expected);
    expect((await request(`incidents/${id}/export`,w.token)).body.feedbackContext).toEqual(expected);
    const other=workspaceFor();expect((await request(`incidents/${id}`,other.token)).status).toBe(404);
    expect(database().native.prepare('SELECT * FROM reviews ORDER BY id').all()).toEqual(before);
  });
  it('reports byte-limited omissions without truncating a large Chinese review',async()=>{
    const w=workspaceFor(),id=createIncident(w.id,incidentInputSchema.parse(recorded.input)),snapshot=snapshotFor(w.id,id);
    const assessmentId=saveAssessment(w.id,snapshot,'large-fixture',assessmentSchema.parse(recorded.result));
    const text='核'.repeat(4000);
    saveReview(w.id,id,{assessmentId,recommendationId:'first',disposition:'rejected',reason:text,finalAction:text,outcome:text,outcomeStatus:'pending',nextImprovement:text,reviewerLabel:'Reviewer'});
    const result=await request(`incidents/${id}`,w.token);
    expect(result.body.feedbackContext).toEqual({included:0,total:1,omitted:1});expect(result.body.reviews[0].reason).toBe(text);
  });
  it('still sends only the latest six current-version exchanges and the same evidence/instructions',async()=>{
    process.env.DEEPSEEK_API_KEY='test-only';const w=workspaceFor(),id=createIncident(w.id,base()),old=snapshotFor(w.id,id);
    const reply={answer:{en:'Synthetic',zh:'模拟'},evidenceIds:[],proposedFacts:[],decisionConstraints:evaluatePolicy(snapshotFor(w.id,id)).constraints} satisfies Discussion;
    saveDiscussion(w.id,old,'fixture','Old version question',reply);updateIncident(w.id,id,1,{...base(),title:'New version'});
    const snapshot=snapshotFor(w.id,id);
    for(let i=0;i<8;i++){
      const discussionId=saveDiscussion(w.id,snapshot,'fixture',`Question ${i}`,reply);
      database().native.prepare('UPDATE discussions SET created_at=? WHERE id=?').run(`2026-10-24T10:00:0${i}Z`,discussionId);
    }
    const mock=vi.spyOn(provider,'callModel').mockRejectedValue(new Error('Stop before any provider call'));
    await expect(generate({workspaceId:w.id,incidentId:id,expectedVersion:2,action:'discussion',question:'Why?',idempotencyKey:'context-test',ipHash:'test'})).rejects.toThrow('PROVIDER_UNAVAILABLE');
    const sent=mock.mock.calls[0][0],expected=buildRequest(snapshot,'discussion','Why?',Array.from({length:6},(_,i)=>({question:`Question ${i+2}`,response:reply})));
    expect(sent.input).toBe(expected.input);expect(sent.instructions).toBe(expected.instructions);expect(sent.schema).toEqual(expected.schema);
    expect(database().native.prepare('SELECT COUNT(*) AS n FROM discussions WHERE incident_id=?').get(id)).toEqual({n:9});
  });
});

describe('bilingual model-context notices',()=>{
  it.each(['en','zh'] as const)('explains omissions and past versus upcoming context in %s',locale=>{
    const summary={included:24,total:26,omitted:2};
    for(const used of [false,true]){
      const html=renderToStaticMarkup(React.createElement(FeedbackContextNotice,{summary,t:t(locale),used}));
      expect(html).toContain(t(locale)(used?'feedbackContextUsed':'feedbackContextTitle'));
      expect(html.replaceAll('&amp;','&')).toContain(t(locale)('feedbackContextOmitted',{count:2}));expect(html).toContain('role="status"');
    }
    const empty=renderToStaticMarkup(React.createElement(FeedbackContextNotice,{summary:{included:0,total:0,omitted:0},t:t(locale)}));
    expect(empty).not.toContain('role="status"');
  });
  it.each(['en','zh'] as const)('shows the chat-version/history limit beside the question in %s',locale=>{
    const detail={discussions:[],history:[],runs:[]} as unknown as Detail;
    const html=renderToStaticMarkup(React.createElement(DiscussionView,{detail,locale,t:t(locale),question:'',setQuestion:()=>{},onSend:()=>{},onApply:()=>{},asking:null,aiBlocked:false,busy:false}));
    expect(html).toContain(t(locale)('discussionContext',{limit:6}));expect(html).toContain('aria-describedby="discussion-context"');
  });
  it('uses the completed run counts for a past assessment and tolerates old runs without metadata',()=>{
    const run={metadata:{humanFeedback:{reviewIds:['one'],latestReviewCount:2,omittedReviewCount:1}}} satisfies Pick<Run,'metadata'>;
    expect(recordedFeedbackSummary(run)).toEqual({included:1,total:2,omitted:1});
    expect(recordedFeedbackSummary({metadata:{}} satisfies Pick<Run,'metadata'>)).toBeUndefined();
    expect(recordedFeedbackSummary({metadata:{humanFeedback:{reviewIds:[],latestReviewCount:2,omittedReviewCount:0}}} satisfies Pick<Run,'metadata'>)).toBeUndefined();
  });
});
