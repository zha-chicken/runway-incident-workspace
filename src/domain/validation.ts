import {assessmentSchema, discussionSchema, type Assessment, type Discussion, type EvidenceBundle, type IncidentInput, type Policy} from './types';
import {citationId, discussionLinks} from './discussion-markdown';

export function validateAssessment(value: unknown, input: IncidentInput, evidence: EvidenceBundle, policy: Policy): Assessment {
  const result = assessmentSchema.parse(value);
  const errors: string[] = [];
  const refs = new Set([...evidence.records.map(r => r.id), ...evidence.reportEvidence.map(r => r.id)]);
  const metrics = new Map(evidence.metrics.map(m => [m.id, m]));
  if (result.riskLevel !== policy.riskLevel) errors.push('Risk must match the evidence-based policy result.');
  if (result.scope.airportId !== input.airportId || result.scope.scenarioPeriod !== input.scenarioPeriod) errors.push('Scope mismatch.');
  checkConstraints(result.decisionConstraints, policy, errors);
  const citations = [
    ...result.evidenceReferences,
    ...result.rationale.flatMap(c => c.evidenceIds), ...result.possibleImpacts.flatMap(c => c.evidenceIds),
    ...Object.values(result.drafts).flatMap(d => d.evidenceIds),
    ...[result.firstAction, ...result.subsequentActions].flatMap(a => a.evidenceIds)
  ];
  for (const id of citations) if (!refs.has(id)) errors.push(`Unknown evidence reference: ${id}`);
  const knownRules = new Set(evidence.records.filter(r => r.category === 'rule').map(r => r.id));
  for (const id of [...result.ruleIds, ...[result.firstAction, ...result.subsequentActions].flatMap(a => a.ruleIds)]) {
    if (!knownRules.has(id)) errors.push(`Unknown rule: ${id}`);
  }
  for (const id of policy.ruleIds) if (!result.ruleIds.includes(id)) errors.push(`Missing applicable rule: ${id}`);
  for (const claim of [...result.rationale, ...result.possibleImpacts]) {
    if (claim.kind === 'fact' && !claim.evidenceIds.length) errors.push('Facts require evidence.');
    for (const id of claim.metricIds) {
      const metric = metrics.get(id);
      if (!metric || !claim.evidenceIds.includes(metric.evidenceId)) errors.push(`Unsupported metric: ${id}`);
    }
    const flagged = claim.evidenceIds.some(id => evidence.records.find(r => r.id === id)?.qualityFlags.includes('missing_weather'));
    if (flagged && claim.kind === 'fact' && !/missing|unreliable|缺|不可用|不可靠/i.test(JSON.stringify(claim.text))) errors.push('Flagged weather cannot support an ordinary factual weather claim.');
    if (/\d+(?:\.\d+)?\s*(?:%|percentage points|百分点)/i.test(JSON.stringify(claim.text)) && !claim.metricIds.length) errors.push('Numeric rate claims require a metric ID.');
  }
  const actions = [result.firstAction, ...result.subsequentActions];
  const narrative=[
    ...result.rationale.map(c=>c.text),...result.possibleImpacts.map(c=>c.text),
    ...result.assumptionsToVerify,...result.informationGaps,...result.escalationConditions,...result.humanDecisions,
    ...actions.map(a=>a.text),...Object.values(result.drafts).map(d=>d.text)
  ];
  if(internalTerms(JSON.stringify(narrative)))errors.push('Use plain operational language instead of implementation identifiers in narrative text.');
  if (new Set(actions.map(a => a.id)).size !== actions.length) errors.push('Recommendation IDs must be unique.');
  if (policy.constraints.professionalDecisionRequired || policy.constraints.actionConclusionsStopped) {
    if (actions.some(a => !['refer', 'prepare_information'].includes(a.kind))) errors.push('Restricted response permits only referral and information preparation.');
  }
  if (policy.constraints.actionConclusionsStopped && result.outputStatus !== 'stopped') errors.push('Stopped action conclusions must be labeled stopped.');
  const prose = JSON.stringify(result);
  if (input.officialStatus === 'unconfirmed' &&
    /flights (?:are|have been) (?:cancelled|delayed)|已(?:经)?取消(?:全部|晚间|航班)|航班已(?:经)?延误/i.test(prose)) errors.push('Unconfirmed official status asserted.');
  if (/notification (?:has been|was) sent|已(?:经)?(?:向旅客)?发送通知|all delays (?:are|were) caused by weather|全部.*异常.*(?:均由|都是).*天气/i.test(prose)) errors.push('Prohibited sending/causal assertion.');
  if (errors.length) throw new ValidationFailure(errors);
  return result;
}
function checkConstraints(result: Assessment['decisionConstraints'], policy: Policy, errors: string[]) {
  if (result.professionalDecisionRequired !== policy.constraints.professionalDecisionRequired ||
    result.actionConclusionsStopped !== policy.constraints.actionConclusionsStopped ||
    policy.constraints.triggeredRuleIds.some(r => !result.triggeredRuleIds.includes(r))) errors.push('Decision constraints mismatch.');
}
export function validateDiscussion(value: unknown, evidence: EvidenceBundle, policy: Policy): Discussion {
  const result = discussionSchema.parse(value);
  const errors: string[] = [];
  checkConstraints(result.decisionConstraints, policy, errors);
  if(internalTerms(JSON.stringify(result.answer)))errors.push('Use plain operational language instead of implementation identifiers.');
  const refs = new Set([...evidence.records.map(r => r.id), ...evidence.reportEvidence.map(r => r.id)]);
  if (result.evidenceIds.some(id => !refs.has(id))) errors.push('Unknown discussion evidence.');
  for (const locale of ['en', 'zh'] as const) {
    const links = discussionLinks(result.answer[locale]);
    if (result.evidenceIds.length && !links.length) errors.push(`answer.${locale} requires inline evidence citations.`);
    for (const href of links) {
      const id = citationId(href);
      if (!id || !refs.has(id) || !result.evidenceIds.includes(id)) {
        errors.push(`answer.${locale} links must use #evidence: followed by an exact source ID also listed in evidenceIds.`);
      }
    }
  }
  if (/notification (?:has been|was) sent|已(?:经)?(?:向旅客)?发送通知/i.test(JSON.stringify(result.answer))) errors.push('Sending claim prohibited.');
  if (errors.length) throw new ValidationFailure(errors);
  return result;
}
const internalTerms=(text:string)=>/\b(?:computedPolicy|riskLevel|professionalDecisionRequired|actionConclusionsStopped|outputStatus|needs_review)\b/.test(text);
export class ValidationFailure extends Error {
  constructor(public issues: string[]) {super('MODEL_OUTPUT_INVALID');}
}
