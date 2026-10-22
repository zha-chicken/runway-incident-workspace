import {z} from 'zod';
import type {OutputValidation} from './validation-notes';

export const bilingual = z.object({en: z.string().min(1), zh: z.string().min(1)});
export type Bilingual = z.infer<typeof bilingual>;
export type Locale = 'en' | 'zh';
export const bi = (en: string, zh: string): Bilingual => ({en, zh});
export const riskSchema = z.enum(['low', 'medium', 'high', 'unable_to_assess']);
export type Risk = z.infer<typeof riskSchema>;
export const reliabilitySchema = z.enum(['scenario_given', 'human_verified', 'unverified', 'conflicted', 'unusable']);
export const signalSchema = z.enum(['stable', 'weather', 'operations', 'capacity', 'conflict', 'context']);
export const reportSchema = z.object({
  id: z.string().min(1).max(120),
  text: z.string().min(1).max(6000),
  sourceLabel: z.string().min(1).max(200),
  originReportId: z.string().max(120).nullable(),
  reportedAt: z.string().max(100).nullable(),
  applicablePeriod: z.string().min(1).max(200),
  reliability: reliabilitySchema,
  independenceGroup: z.string().max(120).nullable(),
  verificationBasis: z.string().max(1000).nullable(),
  signal: signalSchema,
  expandingImpact: z.boolean(),
  provenanceKind: z.enum(['competition', 'team_simulation']),
  sourceEvidenceId: z.string().nullable()
});
export type Report = z.infer<typeof reportSchema>;
export const incidentInputSchema = z.object({
  title: z.string().min(1).max(140),
  airportId: z.string().min(1).max(80),
  scenarioPeriod: z.string().min(1).max(200),
  historicalThrough: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
  businessImportance: z.enum(['low', 'medium', 'high']),
  knownInformation: z.string().max(6000),
  unknowns: z.string().max(6000),
  safetyIssue: z.boolean(),
  sourceReliabilityUnknown: z.boolean(),
  decisionRequest: z.string().max(2000),
  officialStatus: z.enum(['unconfirmed', 'normal', 'delayed', 'cancelled']),
  officialStatusSourceId: z.string().nullable(),
  reports: z.array(reportSchema).max(24),
  sourceEventId: z.string().nullable()
});
export type IncidentInput = z.infer<typeof incidentInputSchema>;
export type Snapshot = IncidentInput & {id: string; incidentId: string; version: number; createdAt: string};

export const constraintsSchema = z.object({
  professionalDecisionRequired: z.boolean(),
  actionConclusionsStopped: z.boolean(),
  triggeredRuleIds: z.array(z.string()),
  decisionScope: z.string(),
  reviewerRoles: z.array(bilingual)
});
export type DecisionConstraints = z.infer<typeof constraintsSchema>;
const claimSchema = z.object({
  text: bilingual, kind: z.enum(['fact', 'assumption', 'unknown']),
  evidenceIds: z.array(z.string()), metricIds: z.array(z.string())
});
export const actionSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['verify', 'monitor', 'prepare_draft', 'refer', 'prepare_information']),
  text: bilingual, evidenceIds: z.array(z.string()), ruleIds: z.array(z.string())
});
const draftSchema = z.object({text: bilingual, evidenceIds: z.array(z.string())});
export const assessmentSchema = z.object({
  riskLevel: riskSchema,
  scope: z.object({airportId: z.string(), scenarioPeriod: z.string()}),
  rationale: z.array(claimSchema).min(1).max(12),
  possibleImpacts: z.array(claimSchema).max(10),
  assumptionsToVerify: z.array(bilingual).max(12),
  informationGaps: z.array(bilingual).max(15),
  firstAction: actionSchema,
  subsequentActions: z.array(actionSchema).max(10),
  escalationConditions: z.array(bilingual).min(1).max(10),
  humanDecisions: z.array(bilingual).min(1).max(10),
  drafts: z.object({operations: draftSchema, airportCoordination: draftSchema, passenger: draftSchema}),
  evidenceReferences: z.array(z.string()),
  ruleIds: z.array(z.string()).min(1),
  decisionConstraints: constraintsSchema,
  outputStatus: z.enum(['draft', 'needs_review', 'stopped'])
});
export type Assessment = z.infer<typeof assessmentSchema>;
export type StoredAssessment = {
  id: string; incidentId: string; snapshotId: string; snapshotVersion: number;
  generatedAt: string; runId: string; result: Assessment; origin: 'live_model' | 'recorded_example';
  validation?: OutputValidation;
};
export const discussionSchema = z.object({
  answer: bilingual,
  evidenceIds: z.array(z.string()),
  proposedFacts: z.array(z.object({text: bilingual, sourceLabel: z.string()})).max(5),
  decisionConstraints: constraintsSchema
});
export type Discussion = z.infer<typeof discussionSchema>;
export const reviewSchema = z.object({
  assessmentId: z.string(), recommendationId: z.string(),
  disposition: z.enum(['pending', 'accepted', 'modified', 'rejected']),
  reason: z.string().max(4000),
  finalAction: z.string().max(4000),
  outcome: z.string().max(4000),
  outcomeStatus: z.enum(['pending', 'simulated_observed']),
  nextImprovement: z.string().max(4000),
  reviewerLabel: z.string().min(1).max(80)
}).refine(r => !['modified', 'rejected'].includes(r.disposition) || r.reason.trim().length > 0, {
  message: 'A modification or rejection needs a reason.', path: ['reason']
});
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SourceRecord = {
  id: string; sheet: string; row: number; cells: Record<string, string | number | null>;
  category: 'operations' | 'weather' | 'scale' | 'event' | 'rule' | 'reference';
  airportId: string | null; period: string | null; sourceFamilyId: string | null;
  simulation: true; qualityFlags: string[];
};
export type Monthly = {
  evidenceId: string; airportId: string; category: string; period: string;
  completion: number; releaseNormality: number; peerMean: number; historicalMean: number;
  deltaPp: number; priorCount: number; windowStart: string | null; windowEnd: string | null;
  peerCount: number;
};
export type Dataset = {
  version: string; sha256: string; sourceFile: string; importedAt: string;
  airports: {id: string; name: Bilingual; category: string}[];
  records: SourceRecord[]; monthly: Monthly[];
  events: {id: string; title: Bilingual; input: IncidentInput}[];
  audit: {sheets: number; counts: Record<string, number>; anomalies: string[]; missingWeather: string[]};
};
export type EvidenceBundle = {
  datasetVersion: string; sourceHash: string; airportId: string;
  records: SourceRecord[]; monthly: Monthly[];
  reportEvidence: {id: string; report: Report}[];
  metrics: {id: string; evidenceId: string; value: number; unit: string; period: string; label: Bilingual}[];
};
export type Policy = {
  riskLevel: Risk; constraints: DecisionConstraints; ruleIds: string[];
  usableReportIds: string[]; independentGroups: string[]; gaps: Bilingual[];
};
