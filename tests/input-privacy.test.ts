import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {dataset} from '../src/domain/evidence';
import {findPrivateText,findInputPrivacy,maskInputPrivacy,privacyReviewPayload,PRIVACY_DETECTOR_VERSION,type InputPrivacyReview} from '../src/domain/input-privacy';
import {checkInputPrivacy} from '../src/server/input-privacy';
import {PrivacyReviewForm} from '../src/components/input-privacy';
import {messages} from '../src/components/messages';
import type {T} from '../src/components/client';
function review(body:unknown,scope='incidents',resolution:InputPrivacyReview['resolution']='false_positive'):InputPrivacyReview {
 return {detectorVersion:PRIVACY_DETECTOR_VERSION,inputHash:createHash('sha256').update(privacyReviewPayload(scope,body)).digest('hex'),resolution,reviewerLabel:'Reviewer A',reason:'Synthetic test record reviewed.',findingCount:findInputPrivacy(body).length};
}
const header=(r:unknown)=>encodeURIComponent(JSON.stringify(r));
describe('input privacy detection and masking',()=>{
 it.each([
  ['手机号：13800000000','phone'],['电话：138 0000 0000','phone'],['+86 138-0000-0000','phone'],['Phone: +1 (202) 555-0123','phone'],
  ['person@example.test','email'],['身份证：110101199001011234','identity'],['passport: E12345678','passport'],
  ['Contact demo@example.invalid. Pressure 3000 PSI.','email'],['联系人：demo@example.invalid。','email'],
  ['旅客姓名：张三，已抵达。','person_name'],['Passenger name: Alice Smith, cabin report pending.','person_name'],['银行卡号：6222 0000 1111 2222','bank_account']
 ])('detects potential private data in %s', (text,kind)=>{
  expect(findPrivateText(text).map(f=>f.kind)).toContain(kind);expect(findPrivateText(maskInputPrivacy(text))).toEqual([]);
 });
 it.each(['B787; flight MU5101; work order WO-PEK-20261020-88; 3000 PSI','20:10; 78.2%; -5.61 pp; 83.81%; 2026-10-23','OPS-BEI-2025-08; RULE011; REPORT:3209ff99-2111-4c50-89ca-da0bc937ad34','Passenger name: unknown; 姓名：未知','[PHONE REDACTED]; [PERSON_NAME REDACTED]'])('leaves operational data and placeholders intact: %s',text=>{
  expect(findPrivateText(text)).toEqual([]);expect(maskInputPrivacy(text)).toBe(text);
 });
 it('does not flag supplied competition event inputs',()=>{
  expect(dataset.events.flatMap(e=>findInputPrivacy(e.input))).toEqual([]);
 });
 it('keeps sentence punctuation when masking an email',()=>{
  expect(maskInputPrivacy('Contact demo@example.invalid. Pressure 3000 PSI at 14:05; completion 78.2%.')).toBe('Contact [EMAIL REDACTED]. Pressure 3000 PSI at 14:05; completion 78.2%.');
 });
 it('masks only identified spans, preserving numbers, citations, keys, arrays and flags',()=>{
  const value={title:'Sample',reports:[{text:'旅客姓名：张三，电话：138 0000 0000。Pressure 3000 PSI at 20:08, 78.2%. [RULE009](#evidence:RULE009)',reliability:'unverified',expandingImpact:false}],reason:'Email person@example.test',expectedVersion:4};
  const before=structuredClone(value),masked=maskInputPrivacy(value);
  expect(masked.reports[0].text).toBe('旅客姓名：[PERSON_NAME REDACTED]，电话：[PHONE REDACTED]。Pressure 3000 PSI at 20:08, 78.2%. [RULE009](#evidence:RULE009)');
  expect(masked.reports[0].reliability).toBe('unverified');expect(masked.reports[0].expandingImpact).toBe(false);expect(masked.expectedVersion).toBe(4);expect(value).toEqual(before);expect(findInputPrivacy(masked)).toEqual([]);
 });
 it('binds decisions to text and route but not object key order',()=>{
  expect(privacyReviewPayload('incidents',{a:'one',b:2})).toBe(privacyReviewPayload('incidents',{b:2,a:'one'}));
  expect(privacyReviewPayload('incidents',{a:'one'})).not.toBe(privacyReviewPayload('incidents',{a:'two'}));
  expect(privacyReviewPayload('incidents/a/drafts',{})).not.toBe(privacyReviewPayload('incidents/b/drafts',{}));
 });
});
describe('server input-review enforcement',()=>{
 const body={question:'Contact person@example.test'};
 it('blocks undecided input without echoing detected values',()=>{
  try{checkInputPrivacy('incidents',body,null);throw new Error('expected rejection');}catch(error){expect((error as Error).message).toBe('PRIVACY_REVIEW_REQUIRED');expect(String(error)).not.toContain('person@example.test');}
 });
 it('accepts a recorded false positive and preserves the exact input',()=>{
  const resolution='false_positive' as const;
  const before=structuredClone(body),checked=checkInputPrivacy('incidents',body,header(review(body,'incidents',resolution)));
  expect(checked?.review.resolution).toBe(resolution);expect(checked?.findingKinds).toEqual(['email']);expect(body).toEqual(before);expect(JSON.stringify(checked)).not.toContain('person@example.test');
 });
 it.each([true,false])('rejects the removed human approval resolution with consent=%s',overrideConfirmed=>{
  expect(()=>checkInputPrivacy('incidents',body,header({...review(body),resolution:'human_approved',overrideConfirmed}))).toThrow('PRIVACY_REVIEW_INVALID');
 });
 it.each(['false_positive','masked'] as const)('rejects an override flag even with the remaining %s resolution',resolution=>{
  const submitted=resolution==='masked'?maskInputPrivacy(body):body;
  expect(()=>checkInputPrivacy('incidents',submitted,header({...review(submitted,'incidents',resolution),findingCount:1,overrideConfirmed:true}))).toThrow('PRIVACY_REVIEW_INVALID');
 });
 it('accepts the old false flag for a legitimate false-positive review',()=>{
  expect(checkInputPrivacy('incidents',body,header({...review(body),overrideConfirmed:false}))?.review.resolution).toBe('false_positive');
 });
 it('accepts masked input but never accepts a masking claim with detected text remaining',()=>{
  const masked=maskInputPrivacy(body),decision={...review(masked,'incidents','masked'),findingCount:1};
  expect(checkInputPrivacy('incidents',masked,header(decision))?.review.resolution).toBe('masked');
  expect(()=>checkInputPrivacy('incidents',body,header({...review(body,'incidents','masked'),findingCount:1}))).toThrow('PRIVACY_REVIEW_REQUIRED');
 });
 it.each(['input','route','empty_reason','private_reason','stale_detector','wrong_count'])('rejects invalid review: %s',change=>{
  const r=review(body);let value=body,scope='incidents';
  if(change==='input')value={question:'New contact other@example.test'};
  if(change==='route')scope='incidents/other';
  if(change==='empty_reason')r.reason='';
  if(change==='private_reason')r.reason='Contact person@example.test';
  if(change==='stale_detector')(r as {detectorVersion:string}).detectorVersion='old';
  if(change==='wrong_count')r.findingCount=20;
  expect(()=>checkInputPrivacy(scope,value,header(r))).toThrow('PRIVACY_REVIEW_INVALID');
 });
 it('supports Chinese review reasons through an ASCII-safe HTTP header',()=>{
  const r={...review(body),reviewerLabel:'复核人A',reason:'这是已授权的虚构测试数据'};expect(checkInputPrivacy('incidents',body,header(r))?.review.reason).toBe(r.reason);
 });
 it.each(['%broken','not-json','x'.repeat(12001)])('rejects malformed review metadata',raw=>{expect(()=>checkInputPrivacy('incidents',body,raw)).toThrow('PRIVACY_REVIEW_INVALID');});
 it('does not require review for clean new input',()=>{expect(checkInputPrivacy('incidents',{question:'Compare 78.2% with 83.81% at 20:08.'},null)).toBeUndefined();});
});
describe('privacy review interface',()=>{
 it.each(['en','zh'] as const)('shows only masking and false-positive choices with highlighted findings in %s',locale=>{
  const body={knownInformation:'Synthetic contact person@example.test'},t:T=(key,values)=>{let text=(messages[locale] as Record<string,string>)[key]??key;for(const [k,v] of Object.entries(values||{}))text=text.replace('{'+k+'}',String(v));return text;};
  const html=renderToStaticMarkup(React.createElement(PrivacyReviewForm,{body,findings:findInputPrivacy(body),t,onResolve:()=>{}}));
  for(const key of ['privacyFalsePositive','privacyMask','privacyPaused','privacyBack','privacyPolicyHint'] as const)expect(html).toContain(messages[locale][key]);expect(html).toContain('<mark>person@example.test</mark>');expect(html).toContain('role="alert"');expect(html).not.toContain('Human Approval');expect(html).not.toContain('人工批准');expect(html).not.toContain('checkbox');
 });
});
