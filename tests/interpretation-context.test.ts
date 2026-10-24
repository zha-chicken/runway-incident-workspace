import {describe, expect, it} from 'vitest';
import {dataset, evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {compareReportPeriod, isCurrentReportPeriod} from '../src/domain/report-period';
import {buildRequest, PROMPT_VERSION, DISCUSSION_PROMPT_VERSION} from '../src/ai/service';
import {interpretationContext} from '../src/ai/interpretation-context';
import type {Snapshot} from '../src/domain/types';
import type {ReassessmentFeedback} from '../src/server/reassessment-feedback';

const snapshot = (airportId = 'YUN'): Snapshot => ({
  ...structuredClone(dataset.events.find(e => e.input.airportId === airportId)!.input),
  id: 'snapshot', incidentId: 'incident', version: 2, createdAt: '2026-10-24T00:00:00Z'
});
const context = (s = snapshot(), feedback?: ReassessmentFeedback) => interpretationContext(s, evidenceFor(s), feedback);
function feedback(): ReassessmentFeedback {
  return {currentSnapshotId: 'snapshot', currentVersion: 2, latestReviewCount: 3, omittedReviewCount: 1, reviews: [
    {reviewId: 'current-review', reviewedAt: '2026-10-24T00:00:00Z', assessmentId: 'assessment', assessmentGeneratedAt: '2026-10-23T23:00:00Z',
      sourceSnapshotId: 'snapshot', sourceVersion: 2, sourceAirportId: 'YUN', sourceScenarioPeriod: 'Day 6, 10:00', applicability: 'current_snapshot',
      originalRecommendation: {id: 'first', kind: 'verify', text: {en: 'Verify the sources.', zh: '核查来源。'}, evidenceIds: ['EVT003'], ruleIds: ['RULE001']},
      review: {disposition: 'rejected', reason: 'First request one consolidated confirmation; no action has occurred.', revisedRecommendation: 'Request the source update time first.', finalAction: '', outcome: '', outcomeStatus: 'pending', nextImprovement: 'Preserve this reason.'}},
    {reviewId: 'older-review', reviewedAt: '2026-10-23T22:00:00Z', assessmentId: 'older-assessment', assessmentGeneratedAt: '2026-10-23T21:00:00Z',
      sourceSnapshotId: 'old-snapshot', sourceVersion: 1, sourceAirportId: 'YUN', sourceScenarioPeriod: 'Day 5, 10:00', applicability: 'prior_snapshot',
      originalRecommendation: {id: 'first', kind: 'verify', text: {en: 'Check the report.', zh: '核查报告。'}, evidenceIds: ['EVT003'], ruleIds: ['RULE001']},
      review: {disposition: 'accepted', reason: '', finalAction: '', outcome: 'Reviewer reported an improvement.', outcomeStatus: 'simulated_observed', nextImprovement: ''}}
  ]};
}

describe('historical interpretation is scoped to the supplied records', () => {
  it('distinguishes first-month initialization, six-month history and a full baseline', () => {
    const rows = context().historical.rows;
    expect(rows.find(r => r.period === '2024-01')).toMatchObject({baselineKind: 'initialization', priorCount: 0, windowStart: null, windowEnd: null});
    expect(rows.find(r => r.period === '2024-07')).toMatchObject({baselineKind: 'partial_history', priorCount: 6, windowStart: '2024-01', windowEnd: '2024-06', isAnomaly: true});
    expect(rows.find(r => r.period === '2025-07')).toMatchObject({baselineKind: 'full_12_months', priorCount: 12, windowStart: '2024-07', windowEnd: '2025-06'});
  });
  it('includes all three YUN anomalies and does not borrow another airport', () => {
    expect(context().historical).toMatchObject({airportId: 'YUN', anomalyCount: 3, anomalyIds: ['OPS-YUN-2024-07', 'OPS-YUN-2025-07', 'OPS-YUN-2025-08']});
    expect(context(snapshot('HAI')).historical.anomalyIds).toEqual(['OPS-HAI-2025-07', 'OPS-HAI-2025-08']);
  });
  it('does not include future anomalies beyond the chosen cutoff', () => {
    const s = {...snapshot(), historicalThrough: '2025-07'};
    expect(context(s).historical).toMatchObject({availableFrom: '2024-01', availableThrough: '2025-07', rowCount: 19, anomalyCount: 2, anomalyIds: ['OPS-YUN-2024-07', 'OPS-YUN-2025-07']});
  });
  it('handles an empty historical scope without manufacturing a baseline', () => {
    const h = context({...snapshot(), historicalThrough: '2023-12'}).historical;
    expect(h).toMatchObject({availableFrom: null, availableThrough: null, rowCount: 0, anomalyCount: 0, rows: [], anomalyIds: []});
  });
  it('reuses the inclusive anomaly threshold for boundary values', () => {
    const s = snapshot(), e = evidenceFor(s);
    e.monthly = e.monthly.slice(0, 3).map((r, i) => ({...r, deltaPp: [-5, -4.999, -5.001][i]}));
    expect(interpretationContext(s, e).historical.rows.map(r => r.isAnomaly)).toEqual([true, false, true]);
    expect(interpretationContext(s, e).historical.anomalyCount).toBe(2);
  });
});

describe('period explanations use the actual matcher', () => {
  it.each([
    ['第4天下午14:00', '第4天下午14:00', true, 'exact_text', true, 0],
    ['第4天下午13:30', '第4天下午14:00', true, 'within_window', true, -30],
    ['第4天下午14:30', '第4天下午14:00', true, 'within_window', true, 30],
    ['第4天下午14:31', '第4天下午14:00', false, 'outside_window', true, 31],
    ['第4天下午2:05', 'Simulation Day 4, 14:00', true, 'within_window', true, 5],
    [' Evening shift ', 'Evening shift', true, 'exact_text', false, null],
    ['Evening shift', 'Morning shift', false, 'unparseable', false, null],
    ['2026-10-24T20:05+08:00', '2026-10-24T12:10Z', true, 'within_window', true, -5],
    ['2026-10-24 20:05', '2026-10-24T20:10+08:00', false, 'incompatible_scope', true, null],
    ['Day 4, 14:00', 'Day 5, 14:00', false, 'outside_window', true, -1440]
  ] as const)('explains %s against %s', (report, scenario, matches, basis, reportParseable, offsetMinutes) => {
    expect(compareReportPeriod(report, scenario)).toMatchObject({matches, basis, reportParseable, offsetMinutes, windowMinutes: 30});
    expect(isCurrentReportPeriod(report, scenario)).toBe(matches);
  });
  it('does not make missing creation time prevent a current applicable-period match', () => {
    const s = snapshot('HAI');
    s.reports[0].reportedAt = null; s.reports[0].applicablePeriod = '第4天下午13:45';
    expect(context(s).reportPeriods[0]).toMatchObject({reportedAtSupplied: false, comparison: {matches: true, basis: 'within_window', reportParseable: true}});
    expect(evaluatePolicy(s).usableReportIds).toContain(s.reports[0].id);
  });
});

describe('review presence and operational evidence remain distinct', () => {
  it('does not claim absent records when feedback was not supplied', () => {
    expect(context().feedbackRecords).toEqual({availability: 'not_supplied', recordedReviewCount: null, suppliedReviewCount: 0, omittedReviewCount: null, records: []});
  });
  it('distinguishes present reasons, prior-version records, omissions and pending outcomes', () => {
    const f = feedback(), before = structuredClone(f), body = JSON.parse(buildRequest(snapshot(), 'assessment', '', [], f).input);
    expect(body.humanFeedback).toEqual(before);
    expect(body.interpretationContext.feedbackRecords).toMatchObject({availability: 'supplied', recordedReviewCount: 3, suppliedReviewCount: 2, omittedReviewCount: 1, records: [
      {reviewId: 'current-review', reasonProvided: true, originalRecommendationProvided: true, applicability: 'current_snapshot', outcomeStatus: 'pending'},
      {reviewId: 'older-review', reasonProvided: false, originalRecommendationProvided: true, applicability: 'prior_snapshot', outcomeStatus: 'simulated_observed'}
    ]});
    expect(f).toEqual(before);
  });
  it('does not transmit saved feedback through the discussion context', () => {
    const r = JSON.parse(buildRequest(snapshot(), 'discussion', 'Why?', [], feedback()).input);
    expect(r.humanFeedback).toBeUndefined();
    expect(r.interpretationContext.feedbackRecords.availability).toBe('not_supplied');
    expect(JSON.stringify(r)).not.toContain('current-review');
  });
  it('does not change current risk or evidence while describing the conditional reliability stop', () => {
    const s = snapshot('HAI'), before = structuredClone(s), e = evidenceFor(s), policy = evaluatePolicy(s), r = JSON.parse(buildRequest(s, 'assessment', '', [], feedback()).input);
    expect(r.snapshot).toEqual(before); expect(r.evidence).toEqual(e); expect(r.computedPolicy).toEqual(policy);
    expect(policy.riskLevel).toBe('medium'); expect(policy.constraints.actionConclusionsStopped).toBe(false);
    expect(r.interpretationContext.hypotheticalIncidentSourceReliabilityUnknown).toMatchObject({riskLevel: 'unable_to_assess', actionConclusionsStopped: true, triggeredRuleIds: ['RULE012']});
    expect(s).toEqual(before);
  });
  it('preserves safety stops and supplied values without adding summary IDs to citation enums', () => {
    const s = {...snapshot('HAI'), safetyIssue: true};
    const a = buildRequest(s, 'assessment'), withFeedback = buildRequest(s, 'assessment', '', [], feedback());
    const body = JSON.parse(a.input);
    expect(body.computedPolicy.constraints.actionConclusionsStopped).toBe(true);
    expect(body.evidence).toEqual(evidenceFor(s)); expect(withFeedback.schema).toEqual(a.schema);
    expect(JSON.stringify(a.schema)).not.toContain('baselineKind');
    expect(a.instructions).not.toContain('EVT005 has no actual prior model output');
    expect(PROMPT_VERSION).toBe('runway-2026-10-24-grounded-context-v1');
    expect(DISCUSSION_PROMPT_VERSION).toBe('runway-discussion-2026-10-24-grounded-context-v1');
  });
});
