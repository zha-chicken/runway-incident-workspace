import {beforeEach,afterEach,describe,it,expect} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import recorded from '../evals/development/improvement-before.json';
import {incidentInputSchema,type Assessment,type Locale,type StoredAssessment} from '../src/domain/types';
import {database,closeDatabase,workspaceFor,createIncident,snapshotFor,updateIncident,saveAssessment,saveDiscussion,saveReview,saveDraft,incidentDetail} from '../src/server/db';
import {reserveRun,finishRun} from '../src/server/budget';
import {feedbackForReassessment} from '../src/server/reassessment-feedback';
import {evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {DiscussionView} from '../src/components/discussion';
import {PrintReport} from '../src/components/print-report';
import {messages,errors} from '../src/components/messages';
import type {Detail,T} from '../src/components/client';
const tFor=(locale:Locale):T=>key=>(messages[locale] as Record<string,string>)[key]??key;
const input=()=>({...incidentInputSchema.parse(recorded.input),sourceEventId:null,title:'Original assessment title'});
let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-final-regression-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');});
afterEach(()=>{closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;});
function setup() {
 const workspace=workspaceFor(),id=createIncident(workspace.id,input()),snapshot=snapshotFor(workspace.id,id),result=structuredClone(recorded.result) as Assessment;
 const run=reserveRun({workspaceId:workspace.id,incidentId:id,snapshotId:snapshot.id,action:'assessment',idempotencyKey:'fixture',ipHash:'test',reservedMicro:100,metadata:{}});
 const assessmentId=saveAssessment(workspace.id,snapshot,run.id,result);finishRun(run.id,'completed',100,{});
 return {workspace,id,snapshot,result,assessmentId};
}
describe('workspace retention and removed personal-data filtering',()=>{
 it('preserves all records and the ledger after long inactivity and process reload',()=>{
  const {workspace,id,snapshot,result,assessmentId}=setup();
  const synthetic='Synthetic person@example.test, 13800000000';
  saveReview(workspace.id,id,{assessmentId,recommendationId:result.firstAction.id,disposition:'modified',reviewerLabel:'Synthetic Reviewer',reason:synthetic,revisedRecommendation:synthetic,finalAction:'',outcomeStatus:'pending',outcome:'',nextImprovement:synthetic});
  saveDraft(workspace.id,id,{assessmentId,audience:'operations',locale:'en',text:synthetic,expectedRevision:0});
  saveDiscussion(workspace.id,snapshot,'fixture-chat',synthetic,{answer:{en:synthetic,zh:synthetic},evidenceIds:[],proposedFacts:[],decisionConstraints:evaluatePolicy(snapshot).constraints});
  updateIncident(workspace.id,id,1,{...snapshot,title:'Retained second snapshot'});
  expect(JSON.stringify(feedbackForReassessment(workspace.id,snapshotFor(workspace.id,id)))).toContain(synthetic);
  const tables=['incidents','snapshots','assessments','reviews','drafts','discussions','ai_runs'];
  const dump=()=>Object.fromEntries(tables.map(t=>[t,database().native.prepare(`SELECT * FROM ${t} ORDER BY rowid`).all()]));
  const before=dump();database().native.prepare('UPDATE workspaces SET last_seen=? WHERE id=?').run('2020-01-01T00:00:00.000Z',workspace.id);
  closeDatabase();const resumed=workspaceFor(workspace.token);
  expect(resumed).toEqual(workspace);expect(dump()).toEqual(before);
  expect(incidentDetail(workspace.id,id).snapshot.version).toBe(2);
  expect(workspaceFor().id).not.toBe(workspace.id);
 });
});
describe('failure and print rendering',()=>{
 it.each(['en','zh'] as const)('renders a localized inline failure with restored question and retry in %s',locale=>{
  const detail={discussions:[],history:[],runs:[]} as unknown as Detail,question='Keep this exact question';
  const html=renderToStaticMarkup(React.createElement(DiscussionView,{detail,locale,t:tFor(locale),question,setQuestion:()=>{},onSend:()=>{},onApply:()=>{},asking:null,aiBlocked:false,busy:false,error:errors.PROVIDER_RATE_LIMIT[locale]}));
  expect(html).toContain('id="discussion-error"');expect(html).toContain('role="alert"');expect(html).toContain('aria-describedby="discussion-error"');expect(html).toContain(question);expect(html).toContain(messages[locale].questionRestored);expect(html).toContain(errors.PROVIDER_RATE_LIMIT[locale]);expect(html).toContain(messages[locale].retry);
  expect(html.indexOf('discussion-error')).toBeGreaterThan(html.indexOf('composer card'));
 });
 it('does not show a chat error or retry when no failure exists',()=>{
  const html=renderToStaticMarkup(React.createElement(DiscussionView,{detail:{discussions:[],history:[],runs:[]} as unknown as Detail,locale:'en',t:tFor('en'),question:'Next question',setQuestion:()=>{},onSend:()=>{},onApply:()=>{},asking:null,aiBlocked:false,busy:false}));
  expect(html).not.toContain('discussion-error');expect(html).toContain(messages.en.send);
 });
 it.each(['en','zh'] as const)('prints the assessed snapshot after title, time and official status change (%s)',locale=>{
  const {workspace,id,snapshot,result}=setup();
  updateIncident(workspace.id,id,1,{...snapshot,title:'NEW TITLE MUST NOT LEAK',scenarioPeriod:'Simulation Day 40, 09:00',officialStatus:'normal',officialStatusSourceId:'status',reports:[...snapshot.reports,{...snapshot.reports[0],id:'status',applicablePeriod:'Simulation Day 40, 09:00',reliability:'human_verified',provenanceKind:'team_simulation',sourceEvidenceId:null,reportedAt:'09:00',verificationBasis:'Synthetic status notice'}]});
  const detail={...incidentDetail(workspace.id,id),evidence:evidenceFor(snapshotFor(workspace.id,id)),policy:evaluatePolicy(snapshotFor(workspace.id,id))} as Detail,displayed=detail.assessments[0] as StoredAssessment;
  const render=()=>renderToStaticMarkup(React.createElement(PrintReport,{detail,displayed,isCurrent:false,locale,t:tFor(locale),eventTitle:(_id,fallback)=>fallback,draftText:(_a,audience)=>result.drafts[audience].text[locale]}));
  let html=render();expect(html).toContain(snapshot.title);expect(html).toContain(snapshot.scenarioPeriod);expect(html).toContain(tFor(locale)(snapshot.officialStatus));expect(html).not.toContain('NEW TITLE MUST NOT LEAK');expect(html).not.toContain('Simulation Day 40, 09:00');expect(html).toContain(messages[locale].stale);expect(html).toContain(result.drafts.operations.evidenceIds[0]);
  detail.history=[];html=render();expect(html).toContain(messages[locale].snapshotUnavailable);expect(html).not.toContain('NEW TITLE MUST NOT LEAK');expect(html).not.toContain('Simulation Day 40, 09:00');
 });
});
