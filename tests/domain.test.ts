import {describe, expect, it} from 'vitest';
import {dataset, evidenceFor, isAnomaly} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {assertNoPersonalData} from '../src/domain/privacy';
import {normalizeResponse, requestBody, type ModelRequest} from '../src/ai/provider';
import {estimateTokens, reserveFor, usageCost} from '../src/server/budget';
import type {IncidentInput} from '../src/domain/types';

const seed = () => structuredClone(dataset.events[0].input);
describe('competition evidence', () => {
  it('imports exact dimensions, anomalies, flags, and no manufactured event numbers', () => {
    expect(dataset.monthly).toHaveLength(192);
    expect(dataset.audit.anomalies).toHaveLength(12);
    expect(dataset.audit.missingWeather).toHaveLength(4);
    const july = dataset.monthly.find(m => m.evidenceId === 'OPS-HAI-2025-07')!;
    expect([july.completion, july.historicalMean, july.deltaPp]).toEqual([.6949, .8511, -15.62]);
    const missing = dataset.records.find(r => r.id === 'WX-HAI-2025-11')!;
    expect(missing.qualityFlags).toContain('missing_weather');
    expect(missing.cells['降水量（毫米）']).not.toBeNull();
  });
  it('uses preceding history and labels initialization', () => {
    const first = dataset.monthly.find(m => m.airportId === 'HAI' && m.period === '2024-01')!;
    expect(first.priorCount).toBe(0); expect(first.windowStart).toBeNull();
    expect(first.historicalMean).toBe(first.completion);
    const next = dataset.monthly.find(m => m.airportId === 'HAI' && m.period === '2024-02')!;
    expect(next.priorCount).toBe(1); expect(next.windowEnd).toBe('2024-01');
    expect(next.peerCount).toBe(2);
    expect(isAnomaly(-5)).toBe(true); expect(isAnomaly(-4.999)).toBe(false);
  });
  it('restricts new-airport retrieval and excludes later dated evidence', () => {
    const i = seed(); i.airportId = 'LIN'; i.sourceEventId = null; i.historicalThrough = '2025-06';
    const e = evidenceFor(i);
    expect(e.monthly.every(m => m.airportId === 'LIN' && m.period <= '2025-06')).toBe(true);
    expect(e.records.filter(r => r.airportId).every(r => r.airportId === 'LIN')).toBe(true);
    expect(e.records.some(r => r.id === 'WX-LIN-2025-11')).toBe(false);
  });
});
describe('risk and authority are independent', () => {
  it.each(['Cancel all evening flights', '请自动取消晚间航班'])('preserves medium under RULE007: %s', request => {
    const i = seed(); const p = evaluatePolicy(i, request);
    expect(p.riskLevel).toBe('medium');
    expect(p.constraints.professionalDecisionRequired).toBe(true);
    expect(p.constraints.actionConclusionsStopped).toBe(false);
    expect(p.ruleIds).toContain('RULE007');
  });
  it('loses a rating when its evidence becomes unreliable', () => {
    const i = seed(); i.sourceReliabilityUnknown = true;
    const p = evaluatePolicy(i);
    expect(p.riskLevel).toBe('unable_to_assess');
    expect(p.constraints.actionConclusionsStopped).toBe(true);
  });
  it('stops actions for a safety issue without forcing unsupported reclassification', () => {
    const i = seed(); i.safetyIssue = true;
    const p = evaluatePolicy(i);
    expect(p.riskLevel).toBe('medium');
    expect(p.constraints.actionConclusionsStopped).toBe(true);
  });
  it('preserves both restrictions when they coexist', () => {
    const i = seed(); i.sourceReliabilityUnknown = true;
    const p = evaluatePolicy(i, 'Cancel the flight');
    expect(p.riskLevel).toBe('unable_to_assess');
    expect(p.constraints.triggeredRuleIds).toEqual(['RULE007', 'RULE012']);
  });
  it('requires independent origins, current scope and distinct signals for high', () => {
    const i = seed();
    i.reports = i.reports.map((r, n) => ({...r, independenceGroup: `group-${n}`, originReportId: 'same-report', reportedAt: 'Day 4 13:50', verificationBasis: 'Simulation review', expandingImpact: true}));
    expect(evaluatePolicy(i).riskLevel).toBe('medium');
    i.reports[1].originReportId = 'another-report';
    expect(evaluatePolicy(i).riskLevel).toBe('high');
    i.reports[1].applicablePeriod = 'Different day';
    expect(evaluatePolicy(i).riskLevel).toBe('medium');
  });
  it('does not treat absent evidence as low or reproduce a described prior high output', () => {
    const i = seed(); i.reports = [];
    expect(evaluatePolicy(i).riskLevel).toBe('unable_to_assess');
    expect(evaluatePolicy(dataset.events[4].input).riskLevel).toBe('medium');
    expect(evaluatePolicy(dataset.events[2].input).riskLevel).toBe('unable_to_assess');
  });
  it('never uses out-of-period reports or unverified assertions as current evidence', () => {
    const i=seed();
    i.reports=i.reports.map(r=>({...r,applicablePeriod:'A different day'}));
    expect(evaluatePolicy(i).riskLevel).toBe('unable_to_assess');
    i.reports=i.reports.map(r=>({...r,applicablePeriod:i.scenarioPeriod,reliability:'human_verified',verificationBasis:null}));
    expect(evaluatePolicy(i).riskLevel).toBe('unable_to_assess');
  });
});
describe('provider boundaries and accounting', () => {
  it('maps effort and output limits independently of the total context cap', () => {
    const r = {instructions:'policy',input:'facts',schema:{type:'object'},schemaName:'assessment',maxOutput:65536,deadlineMs:300000,apiFormat:'responses',effort:'high'} as ModelRequest;
    expect(requestBody(r)).toMatchObject({max_output_tokens:65536,reasoning:{effort:'high'}});
    expect(requestBody({...r,apiFormat:'chat_completions'})).toMatchObject({max_tokens:65536,reasoning_effort:'high'});
    expect(() => reserveFor(500000,65536)).toThrow('CONTEXT_LIMIT');
    expect(estimateTokens('汉字')).toBeGreaterThan('汉字'.length);
  });
  it('ignores reasoning text and requires terminal completion', () => {
    const body = {status:'completed',output:[{type:'reasoning',content:[{type:'reasoning_text',text:'private'}]}, {type:'message',content:[{type:'output_text',text:'{"ok":true}'}]}],usage:{input_tokens:100,output_tokens:20,input_tokens_details:{cached_tokens:40},output_tokens_details:{reasoning_tokens:10}}};
    const r = normalizeResponse(body,'responses');
    expect(r.text).toBe('{"ok":true}'); expect(r.status).toBe('completed');
    expect(usageCost(r.usage!)).toBe(282);
    expect(normalizeResponse({...body,status:'incomplete'},'responses').status).toBe('incomplete');
    expect(normalizeResponse({...body,output:[{type:'function_call'}]},'responses').status).toBe('failed');
    expect(normalizeResponse({choices:[{finish_reason:'length',message:{content:'{}'}}]},'chat_completions').status).toBe('incomplete');
  });
  it('rejects personal data without putting it into the error', () => {
    const text = '旅客姓名：示例，手机号 13800000000';
    expect(() => assertNoPersonalData(text)).toThrow('PERSONAL_DATA_REJECTED');
    try {assertNoPersonalData(text);} catch (e) {expect(String(e)).not.toContain('13800000000');}
  });
});
