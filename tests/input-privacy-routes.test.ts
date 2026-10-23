import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {NextRequest} from 'next/server';
import {GET,POST} from '../src/app/api/[...path]/route';
import {closeDatabase,database,workspaceFor,createIncident,snapshotFor,saveAssessment,saveDiscussion} from '../src/server/db';
import {incidentInputSchema,type Assessment,type Discussion} from '../src/domain/types';
import {evaluatePolicy} from '../src/domain/policy';
import {findInputPrivacy,maskInputPrivacy,privacyReviewPayload,PRIVACY_DETECTOR_VERSION,type InputPrivacyReview} from '../src/domain/input-privacy';
import * as provider from '../src/ai/provider';
import recorded from '../evals/development/improvement-before.json';
let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-input-review-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');process.env.DEEPSEEK_API_KEY='unit-test-only';});
afterEach(()=>{vi.restoreAllMocks();closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;delete process.env.DEEPSEEK_API_KEY;});
const input=()=>incidentInputSchema.parse(recorded.input);
const makeReview=(path:string,body:unknown,resolution:InputPrivacyReview['resolution']='false_positive',count=findInputPrivacy(body).length):InputPrivacyReview=>({detectorVersion:PRIVACY_DETECTOR_VERSION,inputHash:createHash('sha256').update(privacyReviewPayload(path,body)).digest('hex'),resolution,reviewerLabel:'Reviewer A',reason:'Synthetic demonstration reviewed.',findingCount:count});
async function req(path:string,cookie:string,body?:unknown,review?:unknown){
 const request=new NextRequest('http://localhost:3000/api/'+path,{method:body===undefined?'GET':'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie,'Content-Type':'application/json',...(review?{'X-Input-Privacy-Review':encodeURIComponent(JSON.stringify(review))}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const response=await (body===undefined?GET:POST)(request,{params:Promise.resolve({path:path.split('/')})});return {status:response.status,body:await response.json()};
}
function setup(){const w=workspaceFor(),id=createIncident(w.id,input());return {w,id,cookie:'runway-session='+w.token};}
const rows=()=>database().native.prepare('SELECT * FROM privacy_reviews').all();
describe('privacy decisions at API input boundaries',()=>{
 it('blocks undecided input without persistence or detected-value echoes',async()=>{
  const {cookie}=setup(),body={...input(),knownInformation:'Email person@example.test'};
  const before=database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get(),r=await req('incidents',cookie,body);
  expect(r).toEqual({status:409,body:{error:'PRIVACY_REVIEW_REQUIRED'}});expect(rows()).toEqual([]);expect(database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get()).toEqual(before);
 });
 it('records a false positive without duplicating detected values in the log',async()=>{
  const resolution='false_positive' as const;
  const {cookie}=setup(),body={...input(),knownInformation:'Synthetic phone 13800000000 and person@example.test'};
  const decision={...makeReview('incidents',body,resolution),reason:'已复核虚构测试信息'};
  const created=await req('incidents',cookie,body,decision);expect(created.status).toBe(200);
  const detail=await req('incidents/'+created.body.id,cookie);expect(detail.body.snapshot.knownInformation).toBe(body.knownInformation);
  const log=detail.body.privacyReviews;expect(log).toHaveLength(1);expect(log[0]).toMatchObject({...decision,action:'create_incident'});expect(JSON.stringify(log)).not.toContain('13800000000');expect(JSON.stringify(log)).not.toContain('person@example.test');
  const exported=await req('incidents/'+created.body.id+'/export',cookie);expect(exported.body.privacyReviews).toEqual(log);
 });
 it.each([true,false])('rejects old Human Approval requests without saving when consent=%s',async overrideConfirmed=>{
  const {cookie}=setup(),body={...input(),knownInformation:'Email person@example.test'},before=database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get();
  const result=await req('incidents',cookie,body,{...makeReview('incidents',body),resolution:'human_approved',overrideConfirmed});
  expect(result).toEqual({status:400,body:{error:'PRIVACY_REVIEW_INVALID'}});expect(rows()).toEqual([]);expect(database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get()).toEqual(before);
 });
 it('keeps historical approval records readable without accepting them as new decisions',async()=>{
  const {cookie,id,w}=setup(),legacy={...makeReview('incidents',input(),'false_positive',1),resolution:'human_approved',overrideConfirmed:true,findingKinds:['email']};
  database().native.prepare('INSERT INTO privacy_reviews VALUES(?,?,?,?,?,?)').run(randomUUID(),w.id,id,'create_incident',JSON.stringify(legacy),'2026-10-23T12:00:00.000Z');
  const before=rows(),detail=await req('incidents/'+id,cookie),exported=await req('incidents/'+id+'/export',cookie);
  expect(detail.body.privacyReviews[0]).toMatchObject(legacy);expect(exported.body.privacyReviews).toEqual(detail.body.privacyReviews);expect(rows()).toEqual(before);
 });
 it('stores only masked values after masking approval',async()=>{
  const {cookie}=setup(),raw={...input(),knownInformation:'Contact person@example.test; pressure 3000 PSI at 20:08.'},body=maskInputPrivacy(raw);
  const result=await req('incidents',cookie,body,makeReview('incidents',body,'masked',findInputPrivacy(raw).length));expect(result.status).toBe(200);
  const detail=await req('incidents/'+result.body.id,cookie);expect(detail.body.snapshot.knownInformation).toBe('Contact [EMAIL REDACTED]; pressure 3000 PSI at 20:08.');expect(detail.body.privacyReviews[0].resolution).toBe('masked');expect(JSON.stringify(detail.body)).not.toContain('person@example.test');
 });
 it('requires a new decision when text changes and preserves earlier snapshots',async()=>{
  const {cookie,id}=setup(),path='incidents/'+id,body={expectedVersion:1,input:{...input(),knownInformation:'Contact person@example.test'}},decision=makeReview(path,body);
  const changed={...body,input:{...body.input,knownInformation:'Contact other@example.test'}};
  expect((await req(path,cookie,changed,decision)).body.error).toBe('PRIVACY_REVIEW_INVALID');expect(rows()).toHaveLength(0);
  expect((await req(path,cookie,body,decision)).status).toBe(200);expect(rows()).toHaveLength(1);
  const detail=await req(path,cookie);expect(detail.body.history).toHaveLength(2);expect(detail.body.history[1].input.knownInformation).toBe(input().knownInformation);
  expect((await req(path,cookie,body,decision)).body.error).toBe('VERSION_CONFLICT');expect(rows()).toHaveLength(1);
 });
 it('rolls back data and audit together when input validation or audit storage fails',async()=>{
  const {cookie}=setup(),body={...input(),knownInformation:'person@example.test',airportId:'MISSING'};
  expect((await req('incidents',cookie,body,makeReview('incidents',body))).body.error).toBe('UNKNOWN_AIRPORT');expect(rows()).toHaveLength(0);
  body.airportId=input().airportId;const before=database().native.prepare('SELECT COUNT(*) AS n FROM incidents').get();
  database().native.exec("CREATE TRIGGER test_privacy_failure BEFORE INSERT ON privacy_reviews BEGIN SELECT RAISE(ABORT,'synthetic audit failure'); END");
  expect((await req('incidents',cookie,body,makeReview('incidents',body))).status).toBe(500);expect(database().native.prepare('SELECT COUNT(*) AS n FROM incidents').get()).toEqual(before);
 });
 it('does not expose or accept another workspace’s review data',async()=>{
  const {cookie,id}=setup(),other=workspaceFor(),body={expectedVersion:1,input:{...input(),knownInformation:'person@example.test'}},path='incidents/'+id;
  expect((await req(path,'runway-session='+other.token,body,makeReview(path,body))).status).toBe(404);expect(rows()).toHaveLength(0);
  expect((await req(path,cookie,body,makeReview(path,body))).status).toBe(200);
  expect((await req(path+'/export','runway-session='+other.token)).status).toBe(404);
 });
 it('reviews chat input before any provider call or usage reservation',async()=>{
  const {cookie,id,w}=setup(),snapshot=snapshotFor(w.id,id),path='incidents/'+id+'/discuss',body={question:'Review person@example.test',expectedVersion:1,idempotencyKey:randomUUID()};
  const reply:Discussion={answer:{en:'SIMULATION / 模拟 — DRAFT / 草案. Review the source. [RULE011](#evidence:RULE011)',zh:'SIMULATION / 模拟 — DRAFT / 草案. 请核查来源。[RULE011](#evidence:RULE011)'},evidenceIds:['RULE011'],proposedFacts:[],decisionConstraints:evaluatePolicy(snapshot,body.question).constraints};
  const mock=vi.spyOn(provider,'callModel').mockResolvedValue({text:JSON.stringify(reply),status:'completed',terminal:'completed',usage:{input:100,cached:0,output:50,reasoning:10,raw:{}},providerId:'mock',model:'synthetic',fingerprint:null,latencyMs:1});
  expect((await req(path,cookie,body)).body.error).toBe('PRIVACY_REVIEW_REQUIRED');expect((await req(`incidents/${id}/generate`,cookie,body)).body.error).toBe('PRIVACY_REVIEW_REQUIRED');expect(mock).not.toHaveBeenCalled();expect(database().native.prepare('SELECT * FROM ai_runs').all()).toEqual([]);
  for(const route of [path,`incidents/${id}/generate`])expect((await req(route,cookie,body,{...makeReview(route,body),resolution:'human_approved',overrideConfirmed:true})).body.error).toBe('PRIVACY_REVIEW_INVALID');
  expect(mock).not.toHaveBeenCalled();expect(database().native.prepare('SELECT * FROM ai_runs').all()).toEqual([]);expect(rows()).toEqual([]);
  expect((await req(path,cookie,body,makeReview(path,body))).status).toBe(200);expect(mock).toHaveBeenCalledTimes(1);expect(JSON.parse(mock.mock.calls[0][0].input).question).toBe(body.question);
  expect((await req('incidents/'+id,cookie)).body.privacyReviews[0].action).toBe('discussion');
 });
 it('requires review for feedback and edited messages',async()=>{
  const {cookie,id,w}=setup(),s=snapshotFor(w.id,id),a=saveAssessment(w.id,s,'fixture',recorded.result as Assessment);
  const values=[{path:`incidents/${id}/reviews`,body:{assessmentId:a,recommendationId:recorded.result.firstAction.id,disposition:'modified',reviewerLabel:'Reviewer A',reason:'Synthetic email person@example.test',revisedRecommendation:'Check source',finalAction:'',outcome:'',outcomeStatus:'pending',nextImprovement:''}},
   {path:`incidents/${id}/drafts`,body:{assessmentId:a,audience:'operations',locale:'en',text:'Synthetic email person@example.test',expectedRevision:0}}];
  for(const {path,body} of values){expect((await req(path,cookie,body)).body.error).toBe('PRIVACY_REVIEW_REQUIRED');expect((await req(path,cookie,body,makeReview(path,body))).status).toBe(200);}
  expect((await req('incidents/'+id,cookie)).body.privacyReviews).toHaveLength(2);
 });
 it('reviews a proposed fact on application and permits only its exact masked form',async()=>{
  const {cookie,id,w}=setup(),s=snapshotFor(w.id,id),proposal={sourceLabel:'Synthetic report',text:{en:'Contact person@example.test',zh:'邮箱 person@example.test'}};
  const d=saveDiscussion(w.id,s,'fixture','Synthetic proposal',{answer:{en:'Draft',zh:'草案'},evidenceIds:[],proposedFacts:[proposal],decisionConstraints:evaluatePolicy(s).constraints});
  const path=`incidents/${id}/apply`,body={discussionId:d,index:0,expectedVersion:1,proposal};
  expect((await req(path,cookie,body)).body.error).toBe('PRIVACY_REVIEW_REQUIRED');
  const invented={...body,proposal:{...proposal,text:{en:'Invented operational clearance',zh:'捏造放行'}}};expect((await req(path,cookie,invented)).body.error).toBe('INVALID_INPUT');
  const masked=maskInputPrivacy(body);expect((await req(path,cookie,masked,makeReview(path,masked,'masked',findInputPrivacy(body).length))).status).toBe(200);
  const detail=await req('incidents/'+id,cookie),report=detail.body.snapshot.reports.at(-1);expect(report.text).toContain('[EMAIL REDACTED]');expect(report.text).not.toContain('person@example.test');expect(report.reliability).toBe('unverified');expect(report.signal).toBe('context');expect(detail.body.privacyReviews[0].action).toBe('apply_proposal');
 });
 it('adds the audit table to a version-one database without changing existing incidents',()=>{
  const {w,id}=setup(),before=snapshotFor(w.id,id),db=database().native;db.exec('DROP TABLE privacy_reviews; PRAGMA user_version=1;');closeDatabase();
  expect(snapshotFor(w.id,id)).toEqual(before);expect(database().native.pragma('user_version',{simple:true})).toBe(2);expect(rows()).toEqual([]);
 });
});
