import {describe, expect, it} from 'vitest';
import {dataset} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {isCurrentReportPeriod} from '../src/domain/report-period';
import type {IncidentInput} from '../src/domain/types';

const scenario = 'Simulation Day 7, 8:10 PM';
function incident(): IncidentInput {
  const input = structuredClone(dataset.events[0].input);
  input.sourceEventId = null;
  input.scenarioPeriod = scenario;
  input.reports = input.reports.slice(0, 2).map((report, index) => ({
    ...report, id: `report-${index}`, provenanceKind: 'team_simulation', sourceEvidenceId: null,
    reliability: 'human_verified', verificationBasis: 'Reviewed against the simulated source record',
    independenceGroup: `group-${index}`, originReportId: `origin-${index}`,
    reportedAt: `Simulation Day 7, 20:0${index}`, applicablePeriod: index === 0 ? '8:00 PM' : '8:05 PM',
    signal: index === 0 ? 'weather' : 'operations', expandingImpact: true
  }));
  return input;
}

describe('current report window', () => {
  it.each([
    ['8:00 PM', true], ['8:05 PM', true], ['7:40 PM', true], ['8:40 PM', true],
    ['7:39 PM', false], ['8:41 PM', false], ['19:39:59', false], ['20:40:01', false],
    ['8:05 AM', false]
  ])('compares %s to 8:10 PM with inclusive 30-minute boundaries', (period, expected) => {
    expect(isCurrentReportPeriod(period, scenario)).toBe(expected);
  });
  it.each([
    ['第4天下午13:45', '第4天下午14:00', true],
    ['第4天下午2:05', 'Simulation Day 4, 14:00', true],
    ['第７天晚上８：０５', scenario, true],
    ['Simulation Day 6, 20:05', scenario, false],
    ['Simulation Day 8, 20:05', scenario, false],
    ['Simulation Day 6, 23:50', 'Simulation Day 7, 00:10', true],
    ['Simulation Day 8, 00:20', 'Simulation Day 7, 23:50', true],
    ['2026-10-20 23:50', '2026-10-21 00:10', true],
    ['2026-10-20 20:05', '2026-10-21 20:10', false],
    ['2026-10-21T20:05+08:00', '2026-10-21T12:10Z', true],
    ['2026-10-21 20:05', '2026-10-21T20:10+08:00', false],
    ['2026-10-21 20:05', scenario, false],
    ['Simulation Day 7, 20:05', '20:10', false]
  ])('respects day/date scope: %s against %s', (report, current, expected) => {
    expect(isCurrentReportPeriod(report, current)).toBe(expected);
  });
  it.each(['evening', 'last week 20:05', '20:00–20:20', '20:99', '25:05', '2026-02-30 20:05'])('does not guess an ambiguous or invalid period: %s', report => {
    expect(isCurrentReportPeriod(report, scenario)).toBe(false);
  });
  it('preserves exact named periods and does not silently wrap undated times across midnight', () => {
    expect(isCurrentReportPeriod(' Evening shift ', 'Evening shift')).toBe(true);
    expect(isCurrentReportPeriod('Evening shift', 'Morning shift')).toBe(false);
    expect(isCurrentReportPeriod('23:50', 'Simulation Day 7, 00:10')).toBe(false);
  });
});

describe('time window in risk policy', () => {
  it('uses nearby verified reports consistently for risk, independence, and time gaps', () => {
    const input = incident(), policy = evaluatePolicy(input);
    expect(policy.usableReportIds).toEqual(input.reports.map(report => report.id));
    expect(policy.independentGroups).toEqual(['group-0', 'group-1']);
    expect(policy.riskLevel).toBe('high');
    const exact = structuredClone(input);
    exact.reports.forEach(report => {report.applicablePeriod = scenario;});
    expect(policy).toEqual(evaluatePolicy(exact));
  });
  it('excludes a report just beyond the window from both usable and independent sources', () => {
    const input = incident(); input.reports[1].applicablePeriod = '8:41 PM';
    const policy = evaluatePolicy(input);
    expect(policy.usableReportIds).toEqual(['report-0']);
    expect(policy.independentGroups).toEqual(['group-0']);
    expect(policy.riskLevel).toBe('medium');
    expect(policy.gaps.some(gap => gap.en.includes('30-minute'))).toBe(true);
  });
  it.each(['unverified', 'conflicted', 'unusable'] as const)('keeps %s reports excluded even inside the window', reliability => {
    const input = incident(); input.reports.forEach(report => {report.reliability = reliability;});
    expect(evaluatePolicy(input).usableReportIds).toEqual([]);
    expect(evaluatePolicy(input).riskLevel).toBe('unable_to_assess');
  });
  it('still requires human verification evidence and relevant signals', () => {
    const input = incident(); input.reports.forEach(report => {report.verificationBasis = null;});
    expect(evaluatePolicy(input).usableReportIds).toEqual([]);
    for (const signal of ['context', 'conflict'] as const) {
      const context = incident(); context.reports.forEach(report => {report.signal = signal;});
      expect(evaluatePolicy(context).usableReportIds).toEqual([]);
    }
  });
  it('keeps source-reliability and safety stops unchanged', () => {
    const input = incident(); input.sourceReliabilityUnknown = true;
    const unknown = evaluatePolicy(input);
    expect(unknown.usableReportIds).toEqual([]);
    expect(unknown.riskLevel).toBe('unable_to_assess');
    expect(unknown.constraints.actionConclusionsStopped).toBe(true);
    input.sourceReliabilityUnknown = false; input.safetyIssue = true;
    const safety = evaluatePolicy(input, 'Cancel the flight');
    expect(safety.riskLevel).toBe('high');
    expect(safety.constraints.triggeredRuleIds).toEqual(['RULE007', 'RULE012']);
  });
  it.each(['originReportId', 'independenceGroup', 'reportedAt'] as const)('keeps the %s requirement for independent sources', field => {
    const input = incident(); input.reports.forEach(report => {report[field] = null;});
    const policy = evaluatePolicy(input);
    expect(policy.usableReportIds).toHaveLength(2);
    expect(policy.independentGroups).toEqual([]);
    expect(policy.riskLevel).toBe('medium');
  });
  it('uses applicability, not report creation time, to determine currency', () => {
    const input = incident(); input.reports = input.reports.slice(0, 1);
    input.reports[0].reportedAt = scenario;
    input.reports[0].applicablePeriod = '7:39 PM';
    expect(evaluatePolicy(input).usableReportIds).toEqual([]);
    input.reports[0].reportedAt = 'Simulation Day 7, 18:00';
    input.reports[0].applicablePeriod = '8:05 PM';
    expect(evaluatePolicy(input).usableReportIds).toEqual(['report-0']);
  });
});
