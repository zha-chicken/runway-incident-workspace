import {describe,it,expect} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {dataset} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {isOfficialStatusSource} from '../src/domain/official-status';
import {validateInput} from '../src/server/db';
import {buildRequest} from '../src/ai/service';
import {IncidentEditor} from '../src/components/editor';
import {messages} from '../src/components/messages';
import type {IncidentInput,Snapshot} from '../src/domain/types';
function input():IncidentInput {
 const s=structuredClone(dataset.events[0].input);
 return {...s,sourceEventId:null,scenarioPeriod:'Simulation Day 7, 20:10',officialStatus:'normal',officialStatusSourceId:'current',safetyIssue:false,sourceReliabilityUnknown:false,decisionRequest:'Explain the current risk',reports:[{
  ...s.reports[0],id:'current',sourceLabel:'Current verification',provenanceKind:'team_simulation',sourceEvidenceId:null,reliability:'human_verified',reportedAt:'Simulation Day 7, 20:00',applicablePeriod:'20:00',verificationBasis:'Synthetic signed record',signal:'stable'
 }]};
}
describe('current official-status evidence',()=>{
 it.each(['19:40','20:00','20:40'])('accepts a verified source at %s',period=>{
  const s=input();s.reports[0].applicablePeriod=period;expect(validateInput(s).officialStatus).toBe('normal');expect(evaluatePolicy(s).ruleIds).not.toContain('RULE005');
 });
 it.each(['19:39','20:41','Simulation Day 6, 20:10','Ambiguous shift'])('rejects an obsolete or mismatched status source at %s',period=>{
  const s=input();s.reports[0].applicablePeriod=period;expect(()=>validateInput(s)).toThrow('OFFICIAL_STATUS_NEEDS_VERIFIED_SOURCE');
  expect(evaluatePolicy(s).ruleIds).toContain('RULE005');
 });
 it.each(['unverified','conflicted','unusable'] as const)('does not weaken the %s reliability check',reliability=>{
  const s=input();s.reports[0].reliability=reliability;expect(()=>validateInput(s)).toThrow('OFFICIAL_STATUS_NEEDS_VERIFIED_SOURCE');
 });
 it.each(['reportedAt','verificationBasis'] as const)('still requires nonblank %s',field=>{
  const s=input();s.reports[0][field]='  ';expect(()=>validateInput(s)).toThrow('OFFICIAL_STATUS_NEEDS_VERIFIED_SOURCE');
 });
 it('uses applicable period, not creation time; retains exact named-period matches',()=>{
  const s=input();s.reports[0].reportedAt='Simulation Day 6, 18:00';expect(isOfficialStatusSource(s.reports[0],s.scenarioPeriod)).toBe(true);
  s.scenarioPeriod='Evening shift';s.reports[0].applicablePeriod='Evening shift';expect(validateInput(s).officialStatus).toBe('normal');
 });
 it('blocks new requests for legacy invalid status without rewriting the saved snapshot',()=>{
  const s={...input(),id:'snapshot',incidentId:'incident',version:1,createdAt:'2026-10-23'} as Snapshot;s.reports[0].applicablePeriod='Simulation Day 6, 20:00';const before=structuredClone(s);
  for(const action of ['assessment','discussion'] as const)expect(()=>buildRequest(s,action)).toThrow('OFFICIAL_STATUS_NEEDS_VERIFIED_SOURCE');
  expect(s).toEqual(before);s.officialStatus='unconfirmed';expect(()=>buildRequest(s,'assessment')).not.toThrow();
 });
 it('filters editor choices and explains invalid selections without changing input',()=>{
  const s=input();s.reports.push({...s.reports[0],id:'old',sourceLabel:'Old status source',applicablePeriod:'19:39'});s.officialStatusSourceId='old';const before=structuredClone(s);
  const html=renderToStaticMarkup(React.createElement(IncidentEditor,{input:s,setInput:()=>{},airports:dataset.airports,locale:'en',t:k=>(messages.en as Record<string,string>)[k]||k,busy:false,onSave:()=>{}}));
  expect(html).toContain('<option value="current">Current verification</option>');expect(html).not.toContain('<option value="old">');expect(html).toContain(messages.en.officialSourceInvalid);expect(html).toContain('class="primary" disabled=""');expect(s).toEqual(before);
 });
});
describe('conflict time scope',()=>{
 it.each(['19:39','20:41','Simulation Day 6, 20:10'])('retains %s as background without changing current low risk',period=>{
  const s=input();s.reports.push({...s.reports[0],id:'old-conflict',reliability:'conflicted',signal:'conflict',applicablePeriod:period});const before=structuredClone(s);
  const p=evaluatePolicy(s);expect(p.riskLevel).toBe('low');expect(p.ruleIds).not.toContain('RULE001');expect(p.usableReportIds).toEqual(['current']);expect(p.gaps.some(g=>g.en.includes('context only'))).toBe(true);expect(s).toEqual(before);
 });
 it.each(['19:40','20:40'])('retains conflict handling at inclusive boundary %s',period=>{
  const s=input();s.reports.push({...s.reports[0],id:'conflict',reliability:'conflicted',signal:'conflict',applicablePeriod:period});const p=evaluatePolicy(s);expect(p.riskLevel).toBe('unable_to_assess');expect(p.ruleIds).toContain('RULE001');
 });
 it('does not relax incident-level safety or source-uncertainty stops for old reports',()=>{
  const s=input();s.reports[0].applicablePeriod='19:39';s.officialStatus='unconfirmed';s.safetyIssue=true;s.sourceReliabilityUnknown=true;
  expect(evaluatePolicy(s).constraints.actionConclusionsStopped).toBe(true);expect(evaluatePolicy(s).ruleIds).toContain('RULE012');
 });
});
