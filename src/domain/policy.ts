import {bi, type IncidentInput, type Policy} from './types';
import {isCurrentReportPeriod} from './report-period';

export const professionalRequest = (text: string) =>
  /cancel|cancellation|dispatch|maintenance|compensat|flight release|clear.*take.?off|取消|放行|调度|维修|赔付|赔偿/i.test(text);
export const sendRequest = (text: string) => /send.*(passenger|notification)|publish.*notice|发送.*(旅客|通知)|向旅客发送|正式发布/i.test(text);
export const sourceStopRequest = (text: string) => /cannot (verify|establish).*source|source reliability.*(unknown|cannot)|来源可靠性无法判断|无法判断来源可靠性/i.test(text);

export function evaluatePolicy(input: IncidentInput, request = input.decisionRequest): Policy {
  const professional = professionalRequest(request);
  const stop = input.safetyIssue || input.sourceReliabilityUnknown || sourceStopRequest(request);
  const usable = input.sourceReliabilityUnknown ? [] : input.reports.filter(r =>
    (r.reliability === 'scenario_given' || r.reliability === 'human_verified') &&
    isCurrentReportPeriod(r.applicablePeriod, input.scenarioPeriod) &&
    (r.reliability !== 'human_verified' || !!r.verificationBasis?.trim()) &&
    r.signal !== 'context' && r.signal !== 'conflict'
  );
  const active = usable.filter(r => ['weather', 'operations', 'capacity'].includes(r.signal));
  const independent = active.filter(r => r.independenceGroup && r.originReportId && r.verificationBasis &&
    r.reportedAt && isCurrentReportPeriod(r.applicablePeriod, input.scenarioPeriod));
  const groups = [...new Set(independent.map(r => r.independenceGroup!))];
  const origins = new Set(independent.map(r => r.originReportId));
  const signals = new Set(independent.map(r => r.signal));
  const conflicted = input.reports.some(r => r.reliability === 'conflicted' || r.signal === 'conflict');
  const riskLevel = active.length
    ? groups.length >= 2 && origins.size >= 2 && signals.size >= 2 && active.some(r => r.expandingImpact) ? 'high' : 'medium'
    : usable.some(r => r.signal === 'stable') && !conflicted ? 'low' : 'unable_to_assess';
  const ruleIds = ['RULE009', 'RULE010', 'RULE011'];
  const gaps = [];
  if (input.unknowns) gaps.push(bi('Scenario unknowns require verification; see the incident record.', '事件中的未知信息需要核查，请参阅事件记录。'));
  if (conflicted || riskLevel === 'unable_to_assess') ruleIds.push('RULE001');
  if (active.some(r => r.signal === 'weather') && input.officialStatus === 'unconfirmed') ruleIds.push('RULE002');
  if (active.some(r => r.signal === 'operations')) ruleIds.push('RULE004');
  if (input.officialStatus === 'unconfirmed' || sendRequest(request)) ruleIds.push('RULE005');
  if (professional) ruleIds.push('RULE007');
  if (riskLevel === 'high') ruleIds.push('RULE008');
  if (stop) ruleIds.push('RULE012');
  if (!groups.length) gaps.push(bi('Independent current report identities are not established.', '尚未确认当前报告的独立来源身份。'));
  if (input.reports.some(r => !r.reportedAt)) gaps.push(bi('Some report timestamps are unspecified.', '部分报告时间未提供。'));
  if (input.reports.some(r => !isCurrentReportPeriod(r.applicablePeriod, input.scenarioPeriod))) gaps.push(bi('Some report periods fall outside the ±30-minute window or cannot be matched to the scenario period; those reports are context only.', '部分报告的适用时间超出场景时间前后30分钟，或无法与场景时段匹配；这些报告仅作为背景。'));
  return {
    riskLevel, ruleIds, usableReportIds: usable.map(r => r.id), independentGroups: groups, gaps,
    constraints: {
      professionalDecisionRequired: professional, actionConclusionsStopped: stop,
      triggeredRuleIds: ruleIds.filter(r => r === 'RULE007' || r === 'RULE012'),
      decisionScope: request || input.scenarioPeriod,
      reviewerRoles: professional
        ? [bi('Relevant operations, dispatch, maintenance, or compensation professional', '相应运行、调度、维修或赔付专业负责人'), ...(stop ? [bi('Operations lead', '运营负责人')] : [])]
        : [bi('Operations lead', '运营负责人')]
    }
  };
}
