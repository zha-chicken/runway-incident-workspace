import React from 'react';
import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {inputAtSnapshot, stopReasonKeys, type Detail, type T} from '../src/components/client';
import {Constraints} from '../src/components/ui';
import {DiscussionView} from '../src/components/discussion';
import {messages} from '../src/components/messages';
import {dataset} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import type {IncidentInput, Locale} from '../src/domain/types';

const seed = ():IncidentInput => ({...structuredClone(dataset.events[0].input), safetyIssue:false, sourceReliabilityUnknown:false, decisionRequest:'Explain the risk.'});
const tFor = (locale:Locale):T => key => (messages[locale] as Record<string,string>)[key] ?? key;

describe('stop explanations', () => {
  it('explains each existing stop trigger, including combined flags, in both languages', () => {
    for(const safetyIssue of [false,true])for(const sourceReliabilityUnknown of [false,true])for(const request of ['Explain the risk.','I cannot verify the source.']) {
      const input={...seed(),safetyIssue,sourceReliabilityUnknown};
      const policy=evaluatePolicy(input,request).constraints;
      const keys=stopReasonKeys(policy,input,request);
      expect(keys.includes('stopReasonSafety')).toBe(safetyIssue);
      expect(keys.includes('stopReasonReliability')).toBe(sourceReliabilityUnknown);
      expect(keys.includes('stopReasonRequest')).toBe(request.startsWith('I cannot'));
      expect(keys.length>0).toBe(policy.actionConclusionsStopped);
      for(const locale of ['en','zh'] as const) {
        const html=renderToStaticMarkup(React.createElement(Constraints,{policy,input,request,locale,t:tFor(locale)}));
        for(const key of keys)expect(html).toContain(tFor(locale)(key));
        expect(html.includes('constraint-reason')).toBe(policy.actionConclusionsStopped);
        if(policy.actionConclusionsStopped)expect(html).toContain('(RULE012)');
      }
    }
  });

  it('does not mistake an unverified report or professional referral for a source-reliability stop', () => {
    const input=seed();
    input.reports[0].reliability='unverified';
    const policy=evaluatePolicy(input,'Cancel the flight').constraints;
    expect(policy.professionalDecisionRequired).toBe(true);
    expect(stopReasonKeys(policy,input,'Cancel the flight')).toEqual([]);
    input.safetyIssue=true;
    expect(stopReasonKeys(evaluatePolicy(input).constraints,input)).toEqual(['stopReasonSafety']);
  });

  it('uses the discussion question instead of the incident decision request', () => {
    const input={...seed(),decisionRequest:'I cannot verify the source.'};
    expect(stopReasonKeys(evaluatePolicy(input).constraints,input)).toEqual(['stopReasonRequest']);
    const question='Explain the risk.';
    const safetyInput={...input,safetyIssue:true};
    expect(stopReasonKeys(evaluatePolicy(safetyInput,question).constraints,safetyInput,question)).toEqual(['stopReasonSafety']);
  });

  it('renders saved replies using their matching snapshot, even after the incident flags change', () => {
    const old={...seed(),safetyIssue:true};
    const current={...seed(),sourceReliabilityUnknown:true,id:'s2',incidentId:'i1',version:2,createdAt:'2026-10-22'};
    const detail={snapshot:current,history:[{id:'s1',version:1,createdAt:'2026-10-21',input:old}],runs:[],discussions:[{
      id:'d1',question:'Explain the risk.',snapshot_id:'s1',applied_snapshot_id:null,created_at:'2026-10-21T20:00:00Z',
      response:{answer:{en:'Saved answer.',zh:'已保存的回答。'},evidenceIds:['RULE012'],proposedFacts:[],decisionConstraints:evaluatePolicy(old).constraints}
    }]} as unknown as Detail;
    const html=renderToStaticMarkup(React.createElement(DiscussionView,{detail,locale:'en',t:tFor('en'),question:'',setQuestion:()=>{},onSend:()=>{},onApply:()=>{},asking:null,aiBlocked:false,busy:false}));
    expect(html).toContain(messages.en.stopReasonSafety);
    expect(html).not.toContain(messages.en.stopReasonReliability);
    expect(inputAtSnapshot(detail,'s2')).toBe(current);
    expect(inputAtSnapshot(detail,'missing')).toBeUndefined();
    expect(stopReasonKeys(evaluatePolicy(old).constraints,inputAtSnapshot(detail,'missing'))).toEqual(['stopReasonUnavailable']);
  });
});
