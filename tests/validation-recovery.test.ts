import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import recorded from '../evals/development/improvement-before.json';
import {incidentInputSchema,type Assessment,type Discussion} from '../src/domain/types';
import {evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {inspectAssessment,inspectDiscussion,ValidationFailure} from '../src/domain/validation';
import {ValidationNotice} from '../src/components/validation-notice';
import {warningsForPath} from '../src/domain/validation-notes';
import {generate,buildRequest} from '../src/ai/service';
import * as provider from '../src/ai/provider';
import {closeDatabase,workspaceFor,createIncident,incidentDetail,snapshotFor,database} from '../src/server/db';
const notice='SIMULATION / 模拟 — DRAFT / 草案';
function context(stopped=false) {
 const input=incidentInputSchema.parse(recorded.input); input.safetyIssue=stopped;
 const policy=evaluatePolicy(input),evidence=evidenceFor(input),result=structuredClone(recorded.result) as Assessment;
 result.rationale=result.rationale.filter(c=>!c.text.en.includes('computedPolicy'));
 result.riskLevel=policy.riskLevel;result.decisionConstraints=structuredClone(policy.constraints);result.outputStatus=stopped?'stopped':'needs_review';
 result.ruleIds=[...new Set([...result.ruleIds,...policy.ruleIds])];
 if(stopped)for(const a of [result.firstAction,...result.subsequentActions])a.kind='prepare_information';
 return {input,policy,evidence,result};
}
const inspect=(c:ReturnType<typeof context>)=>inspectAssessment(c.result,c.input,c.evidence,c.policy);
const soft=()=>{const c=context();c.result.rationale=[{kind:'fact',text:{en:'Review threshold: 5 percentage points.',zh:'复核阈值为五个百分点。'},evidenceIds:['OPS-LIN-2025-08'],metricIds:[]}];return c;};
const response=(value:unknown)=>({text:typeof value==='string'?value:JSON.stringify(value),status:'completed' as const,terminal:'completed',usage:{input:100,cached:0,output:50,reasoning:10,raw:{}},providerId:'test-only',model:'deepseek-flash',fingerprint:null,latencyMs:1});
let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-recovery-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');process.env.DEEPSEEK_API_KEY='unit-test-only';});
afterEach(()=>{vi.restoreAllMocks();closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;delete process.env.DEEPSEEK_API_KEY;});
const setup=(stopped=false)=>{const c=context(stopped),w=workspaceFor(),id=createIncident(w.id,c.input);return {c,args:{workspaceId:w.id,incidentId:id,expectedVersion:1,action:'assessment' as const,idempotencyKey:'first',ipHash:'test'}};};

describe('blocking errors versus review notes',()=>{
 it('fixes Chinese negation without changing or weakening stop flags',()=>{
  const c=context(true);c.result.humanDecisions=[{en:'This system does not send messages.',zh:'本系统不发送消息。'}];
  expect(inspect(c).warnings).toEqual([]);expect(inspect(c).result.decisionConstraints.actionConclusionsStopped).toBe(true);
 });
 it('preserves the complete response and known figures when citation placement needs review',()=>{
  const c=soft(),before=structuredClone(c.result),checked=inspect(c);
  expect(checked.result).toEqual(before);expect(c.result).toEqual(before);
  expect(checked.warnings.map(w=>w.code)).toEqual(['citation','citation']);
  expect(checked.warnings[0].excerpt).toContain('5 percentage points');
 });
 it('retains ambiguous message-sending review notes without claiming they are verified',()=>{
  const c=context(true);c.result.firstAction.text={en:'The record says the notification has been sent.',zh:'记录称已发送通知。'};
  const checked=inspect(c);expect(checked.warnings.map(w=>w.code)).toEqual(['wording','wording']);
  expect(warningsForPath({version:'2026-10-23-recovery-v1',status:'review_required',warnings:checked.warnings},'actions.0')).toHaveLength(2);
 });
 it.each(['Notification has been sent.','Messages were sent.','已发送通知。'])('still blocks false sending claims: %s',text=>{
  const c=context(true);c.result.firstAction.text={en:text,zh:text};expect(()=>inspect(c)).toThrow(ValidationFailure);
 });
 it('does not borrow negation from another sentence',()=>{
  const c=context(true);c.result.firstAction.text={en:'No notification has been sent; the notification has been sent.',zh:'未发送通知；已发送通知。'};expect(()=>inspect(c)).toThrow(ValidationFailure);
 });
 it('blocks a concrete mislabeled metric, even if the value exists elsewhere',()=>{
  const c=context(),row='OPS-LIN-2025-08',completion=c.evidence.metrics.find(m=>m.id===row+':completion')!;
  c.result.rationale=[{kind:'fact',text:{en:`Release normality: ${completion.value}%.`,zh:`机场放行正常比例：${completion.value}%。`},evidenceIds:[row],metricIds:[row+':completion',row+':release']}];
  expect(()=>inspect(c)).toThrow(ValidationFailure);
 });
 it('keeps local numeric citations as review notes when the value exists in the supplied evidence',()=>{
  const c=context(true),row='OPS-LIN-2025-08',m=c.evidence.metrics.find(m=>m.id===row+':completion')!;
  const d:Discussion={answer:{en:`${notice}\n\nCompletion: ${m.value}%.\n\n[Source](#evidence:${row})`,zh:`${notice}\n\n完成率：${m.value}%。\n\n[来源](#evidence:${row})`},evidenceIds:[row],proposedFacts:[],decisionConstraints:c.policy.constraints};
  const checked=inspectDiscussion(d,c.evidence,c.policy,c.input);expect(checked.warnings).toHaveLength(2);expect(checked.result).toEqual(d);
  d.answer.en=d.answer.en.replace(`${m.value}%`,'999.99%');expect(()=>inspectDiscussion(d,c.evidence,c.policy,c.input)).toThrow(ValidationFailure);
 });
 it('never trusts model-supplied validation diagnostics',()=>{
  const c=context(),checked=inspectAssessment({...c.result,validation:{status:'passed',warnings:[]}},c.input,c.evidence,c.policy);
  expect(checked.result).not.toHaveProperty('validation');
 });
});

describe('actual generation path with an isolated database and mocked provider',()=>{
 it('repairs warning-only output once, then persists review notes through reload and export data',async()=>{
  const {args}=setup(),result=soft().result;
  const mock=vi.spyOn(provider,'callModel').mockResolvedValue(response(result));await generate(args);
  expect(mock).toHaveBeenCalledTimes(2);let d=incidentDetail(args.workspaceId,args.incidentId);
  expect(d.assessments[0].result).toEqual(result);expect(d.assessments[0].validation?.status).toBe('review_required');
  expect(d.assessments[0].validation?.warnings).toHaveLength(2);expect(d.runs[0].metadata.validation.status).toBe('review_required');
  closeDatabase();d=incidentDetail(args.workspaceId,args.incidentId);expect(d.assessments[0].validation?.warnings).toHaveLength(2);
  expect(JSON.stringify(d)).toContain('5 percentage points');await generate(args);expect(mock).toHaveBeenCalledTimes(2);
 });

 it.each([
  '本输出不决定也不建议维修放行、拖曳/航空器移动或旅客下机',
  '维修放行、拖曳或航空器移动、旅客下机分别属于维修控制、运营负责人会同机坪控制与维修、运营负责人会同客舱安全与旅客服务的专业判断范围'
 ])('saves the observed Chinese false-positive wording on the first attempt: %s',async text=>{
  const {args,c}=setup(true),d:Discussion={answer:{en:notice+' Refer decisions to qualified professionals. [RULE012](#evidence:RULE012)',zh:notice+' '+text+' [RULE012](#evidence:RULE012)'},evidenceIds:['RULE012'],proposedFacts:[],decisionConstraints:c.policy.constraints};
  const mock=vi.spyOn(provider,'callModel').mockResolvedValue(response(d));
  await generate({...args,action:'discussion',question:'Check the incident'});
  const detail=incidentDetail(args.workspaceId,args.incidentId);
  expect(mock).toHaveBeenCalledTimes(1);expect(detail.discussions[0].response).toEqual(d);
  expect(detail.discussions[0].validation).toMatchObject({status:'passed',warnings:[]});
  expect(detail.discussions[0].response.decisionConstraints.actionConclusionsStopped).toBe(true);
 });
 it('saves only warnings from the accepted attempt, and drops resolved warnings',async()=>{
  const {args,c}=setup();const mock=vi.spyOn(provider,'callModel').mockResolvedValueOnce(response(soft().result)).mockResolvedValueOnce(response(c.result));await generate(args);
  expect(mock).toHaveBeenCalledTimes(2);const d=incidentDetail(args.workspaceId,args.incidentId);
  expect(d.assessments[0].validation).toMatchObject({status:'passed',warnings:[]});expect(d.runs[0].metadata.attempts[0].validationWarnings).toHaveLength(2);
 });
 it('allows warning-only recovery after an initially malformed JSON response',async()=>{
  const {args}=setup();const mock=vi.spyOn(provider,'callModel').mockResolvedValueOnce(response('{')).mockResolvedValueOnce(response(soft().result));await generate(args);
  expect(mock).toHaveBeenCalledTimes(2);expect(incidentDetail(args.workspaceId,args.incidentId).assessments[0].validation?.status).toBe('review_required');
 });
 const blockingCases:[string,(a:Assessment)=>void][]=[
  ['wrong airport',a=>a.scope.airportId='OTHER'],['wrong period',a=>a.scope.scenarioPeriod='another period'],
  ['wrong risk',a=>a.riskLevel='low'],['disabled stop',a=>a.decisionConstraints.actionConclusionsStopped=false],
  ['invented trigger',a=>a.decisionConstraints.triggeredRuleIds.push('RULE999')],['missing rule',a=>a.ruleIds=[]],
  ['unknown citation',a=>a.evidenceReferences.push('MADE-UP')],['unknown metric',a=>a.rationale[0].metricIds.push('MADE-UP')],
  ['forbidden action type',a=>a.firstAction.kind='verify'],['false status',a=>a.outputStatus='needs_review'],
  ['false sending claim',a=>a.firstAction.text.en='Notification has been sent.'],
  ['invented number',a=>a.rationale[0].text.en='Completed as planned: 999.99%.'],
  ['duplicate actions',a=>a.subsequentActions[0].id=a.firstAction.id],
 ];
 it.each(blockingCases)('does not relax %s on the second attempt; preserves the old assessment',async(_name,mutate)=>{
  const {args,c}=setup(true),bad=structuredClone(c.result);mutate(bad);
  const warning=structuredClone(c.result);warning.humanDecisions[0].en='The record says the notification has been sent.';
  const mock=vi.spyOn(provider,'callModel').mockResolvedValueOnce(response(c.result)).mockResolvedValueOnce(response(warning)).mockResolvedValueOnce(response(bad));
  await generate(args);const before=incidentDetail(args.workspaceId,args.incidentId).incident.current_assessment_id;
  await expect(generate({...args,idempotencyKey:'second'})).rejects.toThrow('MODEL_OUTPUT_INVALID');
  const d=incidentDetail(args.workspaceId,args.incidentId);expect(d.incident.current_assessment_id).toBe(before);expect(d.assessments).toHaveLength(1);expect(mock).toHaveBeenCalledTimes(3);
 });
 it.each(['{','{"riskLevel":"medium"}'])('never saves malformed or incomplete retry JSON: %s',async bad=>{
  const {args}=setup();vi.spyOn(provider,'callModel').mockResolvedValueOnce(response(soft().result)).mockResolvedValueOnce(response(bad));
  await expect(generate(args)).rejects.toThrow('MODEL_OUTPUT_INVALID');expect(incidentDetail(args.workspaceId,args.incidentId).assessments).toHaveLength(0);
 });
 it.each(['13800000000','110101199001011234','person@example.test','passport: TESTONLY','passenger name: TEST PERSON'])('does not apply the removed personal-data detector to model output: %s',async text=>{
  const {args,c}=setup();c.result.humanDecisions[0].en=text;
  const mock=vi.spyOn(provider,'callModel').mockResolvedValue(response(c.result));await generate(args);
  expect(incidentDetail(args.workspaceId,args.incidentId).assessments[0].result.humanDecisions[0].en).toBe(text);expect(mock).toHaveBeenCalledTimes(1);
 });
 it('passes synthetic contact text in a question to the mocked provider without privacy filtering',async()=>{
  const {args,c}=setup(),question='Review contact person@example.test and 13800000000';
  const d:Discussion={answer:{en:notice+' Review the supplied source. [RULE011](#evidence:RULE011)',zh:notice+' 请核查所给来源。 [RULE011](#evidence:RULE011)'},evidenceIds:['RULE011'],proposedFacts:[],decisionConstraints:evaluatePolicy(c.input,question).constraints};
  const mock=vi.spyOn(provider,'callModel').mockResolvedValue(response(d));
  await generate({...args,action:'discussion',question});
  expect(mock).toHaveBeenCalledTimes(1);expect(JSON.parse(mock.mock.calls[0][0].input).question).toBe(question);
  expect(database().native.prepare('SELECT question FROM discussions WHERE incident_id=?').get(args.incidentId)).toEqual({question});
 });
 it('applies warning recovery to discussion and proposed facts without overwriting assessments',async()=>{
  const {args,c}=setup(),d:Discussion={answer:{en:notice+' The record says the notification has been sent. [RULE007](#evidence:RULE007)',zh:notice+' 记录称已发送通知。 [RULE007](#evidence:RULE007)'},evidenceIds:['RULE007'],proposedFacts:[{sourceLabel:'Proposed check',text:{en:'The record says the notification has been sent.',zh:'记录称已发送通知。'}}],decisionConstraints:evaluatePolicy(c.input,'Check the incident').constraints};
  vi.spyOn(provider,'callModel').mockResolvedValue(response(d));await generate({...args,action:'discussion',question:'Check the incident'});
  const detail=incidentDetail(args.workspaceId,args.incidentId);expect(detail.discussions[0].validation.status).toBe('review_required');expect(detail.discussions[0].response).toEqual(d);expect(detail.assessments).toHaveLength(0);
 });
 it('rolls back the result if saving its review notes fails, without another provider call',async()=>{
  const {args,c}=setup();const mock=vi.spyOn(provider,'callModel').mockResolvedValueOnce(response(c.result)).mockResolvedValue(response(soft().result));
  await generate(args);const before=incidentDetail(args.workspaceId,args.incidentId).incident.current_assessment_id;
  database().native.exec("CREATE TRIGGER test_note_failure BEFORE UPDATE ON ai_runs WHEN NEW.status='completed' BEGIN SELECT RAISE(ABORT,'test storage failure'); END");
  await expect(generate({...args,idempotencyKey:'storage-failure'})).rejects.toThrow();
  const detail=incidentDetail(args.workspaceId,args.incidentId);expect(detail.assessments).toHaveLength(1);expect(detail.incident.current_assessment_id).toBe(before);expect(mock).toHaveBeenCalledTimes(3);
 });
 it('keeps recovery settings out of the provider schema and instructions',()=>{
  const {args}=setup(),snapshot=snapshotFor(args.workspaceId,args.incidentId),request=buildRequest(snapshot,'assessment');
  expect(JSON.stringify(request.schema)).not.toContain('validationWarnings');expect(request.instructions).not.toContain('review_required');
 });
});

describe('visible diagnostics',()=>{
 it.each(['en','zh'] as const)('renders specific review notes and original excerpts in %s',locale=>{
  const html=renderToStaticMarkup(React.createElement(ValidationNotice,{locale,expanded:true,validation:{version:'2026-10-23-recovery-v1',status:'review_required',warnings:inspect(soft()).warnings}}));
  expect(html).toContain('role="note"');expect(html).toContain('5 percentage points');expect(html).toContain(locale==='en'?'Reasoning':'判断依据');expect(html).not.toContain('MODEL_OUTPUT_INVALID');
 });
});
