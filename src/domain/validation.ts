import {assessmentSchema, discussionSchema, type Assessment, type Discussion, type EvidenceBundle, type IncidentInput, type Policy} from './types';
import {citationId, discussionLinks} from './discussion-markdown';
import {checkProse, checkRates, discussionBlocks, hasDraftNotice} from './output-checks';
import {warning, warningIssue, type ValidationWarning} from './validation-notes';

export function inspectAssessment(value: unknown, input: IncidentInput, evidence: EvidenceBundle, policy: Policy) {
  const result = assessmentSchema.parse(value);
  const errors: string[] = [], warnings: ValidationWarning[] = [];
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
  }
  const actions = [result.firstAction, ...result.subsequentActions];
  const restricted = policy.constraints.professionalDecisionRequired || policy.constraints.actionConclusionsStopped;
  const fields = [
    ...result.rationale.map((c,i)=>({path:`rationale.${i}`,text:c.text,ids:c.evidenceIds,metrics:c.metricIds})),
    ...result.possibleImpacts.map((c,i)=>({path:`possibleImpacts.${i}`,text:c.text,ids:c.evidenceIds,metrics:c.metricIds})),
    ...actions.map((a,i)=>({path:`actions.${i}`,text:a.text,ids:a.evidenceIds,metrics:undefined})),
    ...Object.entries(result.drafts).map(([audience,d])=>({path:`drafts.${audience}`,text:d.text,ids:d.evidenceIds,metrics:undefined})),
    ...(['assumptionsToVerify','informationGaps','escalationConditions','humanDecisions'] as const).flatMap(key=>result[key].map((text,i)=>({path:`${key}.${i}`,text,ids:result.evidenceReferences,metrics:undefined})))
  ];
  for (const field of fields) for (const locale of ['en','zh'] as const) {
    const path=`${field.path}.${locale}`;
    checkProse(field.text[locale],restricted,input.officialStatus==='unconfirmed',path,errors,warnings);
    checkRates(field.text[locale],field.ids,evidence,path,errors,field.metrics,warnings);
  }
  for (const [audience,draft] of Object.entries(result.drafts)) for (const locale of ['en','zh'] as const) {
    if (!hasDraftNotice(draft.text[locale])) warnings.push(warning('presentation', `drafts.${audience}.${locale}`, 'Draft notice needs review; this output remains a simulation draft.', draft.text[locale]));
  }
  const narrative=[
    ...result.rationale.map(c=>c.text),...result.possibleImpacts.map(c=>c.text),
    ...result.assumptionsToVerify,...result.informationGaps,...result.escalationConditions,...result.humanDecisions,
    ...actions.map(a=>a.text),...Object.values(result.drafts).map(d=>d.text)
  ];
  if(internalTerms(JSON.stringify(narrative)))warnings.push(warning('presentation', 'assessment', 'Use plain operational language instead of implementation identifiers in narrative text.', ''));
  if (new Set(actions.map(a => a.id)).size !== actions.length) errors.push('Recommendation IDs must be unique.');
  if (restricted) {
    if (actions.some(a => !['refer', 'prepare_information'].includes(a.kind))) errors.push('Restricted response permits only referral and information preparation.');
  }
  if (policy.constraints.actionConclusionsStopped && result.outputStatus !== 'stopped') errors.push('Stopped action conclusions must be labeled stopped.');
  if (!policy.constraints.actionConclusionsStopped && result.outputStatus !== 'needs_review') errors.push('An assessment without a stop must remain labeled needs_review.');
  if (errors.length) throw new ValidationFailure(errors, warnings);
  return {result, warnings: uniqueWarnings(warnings)};
}
function checkConstraints(result: Assessment['decisionConstraints'], policy: Policy, errors: string[]) {
  if (result.professionalDecisionRequired !== policy.constraints.professionalDecisionRequired ||
    result.actionConclusionsStopped !== policy.constraints.actionConclusionsStopped ||
    policy.constraints.triggeredRuleIds.some(r => !result.triggeredRuleIds.includes(r)) ||
    result.triggeredRuleIds.some(r => !policy.constraints.triggeredRuleIds.includes(r))) errors.push('Decision constraints mismatch.');
}
export function inspectDiscussion(value: unknown, evidence: EvidenceBundle, policy: Policy, input?: IncidentInput) {
  const result = discussionSchema.parse(value);
  const errors: string[] = [], warnings: ValidationWarning[] = [];
  checkConstraints(result.decisionConstraints, policy, errors);
  if(internalTerms(JSON.stringify(result.answer)))warnings.push(warning('presentation', 'answer', 'Use plain operational language instead of implementation identifiers.', ''));
  const refs = new Set([...evidence.records.map(r => r.id), ...evidence.reportEvidence.map(r => r.id)]);
  if (result.evidenceIds.some(id => !refs.has(id))) errors.push('Unknown discussion evidence.');
  const restricted=policy.constraints.professionalDecisionRequired || policy.constraints.actionConclusionsStopped;
  for (const locale of ['en', 'zh'] as const) {
    if (!hasDraftNotice(result.answer[locale])) warnings.push(warning('presentation', `answer.${locale}`, 'Draft notice needs review; this output remains a simulation draft.', result.answer[locale]));
    checkProse(result.answer[locale],restricted,input?.officialStatus==='unconfirmed',`answer.${locale}`,errors,warnings);
    for (const block of discussionBlocks(result.answer[locale])) checkRates(block.text,block.evidenceIds,evidence,`answer.${locale}`,errors,undefined,warnings);
    const links = discussionLinks(result.answer[locale]);
    if (result.evidenceIds.length && !links.length) warnings.push(warning('citation', `answer.${locale}`, 'Inline evidence citations need review.', result.answer[locale]));
    for (const href of links) {
      const id = citationId(href);
      if (!id || !refs.has(id) || !result.evidenceIds.includes(id)) {
        errors.push(`answer.${locale} links must use #evidence: followed by an exact source ID also listed in evidenceIds.`);
      }
    }
  }
  for (const [index,fact] of result.proposedFacts.entries()) for (const locale of ['en','zh'] as const) {
    checkProse(fact.text[locale],restricted,input?.officialStatus==='unconfirmed',`proposedFacts.${index}.${locale}`,errors,warnings);
    checkRates(fact.text[locale],result.evidenceIds,evidence,`proposedFacts.${index}.${locale}`,errors,undefined,warnings);
  }
  if (errors.length) throw new ValidationFailure(errors, warnings);
  return {result, warnings: uniqueWarnings(warnings)};
}
const internalTerms=(text:string)=>/\b(?:computedPolicy|riskLevel|professionalDecisionRequired|actionConclusionsStopped|outputStatus|needs_review)\b/.test(text);
const uniqueWarnings = (warnings: ValidationWarning[]) => [...new Map(warnings.map(w => [warningIssue(w), w])).values()];

/** Strict inspection remains available for development/evaluation. Runtime recovery uses
 * inspect* and only accepts review notes after its one repair attempt. */
export function validateAssessment(value: unknown, input: IncidentInput, evidence: EvidenceBundle, policy: Policy): Assessment {
  const checked = inspectAssessment(value, input, evidence, policy);
  if (checked.warnings.length) throw new ValidationFailure([], checked.warnings);
  return checked.result;
}
export function validateDiscussion(value: unknown, evidence: EvidenceBundle, policy: Policy, input?: IncidentInput): Discussion {
  const checked = inspectDiscussion(value, evidence, policy, input);
  if (checked.warnings.length) throw new ValidationFailure([], checked.warnings);
  return checked.result;
}
export class ValidationFailure extends Error {
  issues: string[];
  warnings: ValidationWarning[];
  constructor(public blockingIssues: string[], warnings: ValidationWarning[] = []) {
    super('MODEL_OUTPUT_INVALID');
    this.warnings = uniqueWarnings(warnings);
    this.issues = [...new Set([...blockingIssues, ...this.warnings.map(warningIssue)])].slice(0,40);
  }
}
