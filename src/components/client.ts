import type {InputPrivacyReview,PrivacyReviewRecord} from '../domain/input-privacy';
import type {Assessment, Dataset, Discussion, EvidenceBundle, IncidentInput, Locale, Policy, ReviewInput, Snapshot, StoredAssessment} from '../domain/types';
import type {OutputValidation} from '../domain/validation-notes';
import {sourceStopRequest} from '../domain/policy';

export type IncidentSummary = {id:string;version:number;title:string;sourceEventId:string|null;airportId:string;scenarioPeriod:string;riskLevel:Assessment['riskLevel']|null};
export type Bootstrap = {incidents:IncidentSummary[];airports:Dataset['airports'];events:Dataset['events'];apiConfigured:boolean;apiFormat:string;effort:string;budget:{used:number;limit:number|null;remaining:number|null};dataset:{version:string;sha256:string}};
export type DraftRow = {id:string;assessment_id:string;audience:Audience;locale:Locale;text:string;revision:number;created_at:string};
export type DiscussionRow = {validation?:OutputValidation;id:string;question:string;response:Discussion;snapshot_id:string;applied_snapshot_id:string|null;created_at:string};
export type Run = {id:string;status:string;action:string;error_code:string|null;cost_micro:number|null;reserved_micro:number;created_at:string;metadata:Record<string,unknown>};
export type Review = ReviewInput&{id:string;reviewedAt:string};
export type Detail = {incident:{id:string;version:number;current_assessment_id:string|null};snapshot:Snapshot;assessments:StoredAssessment[];evidence:EvidenceBundle;policy:Policy;history:{id:string;version:number;createdAt:string;input:IncidentInput}[];reviews:Review[];drafts:DraftRow[];discussions:DiscussionRow[];runs:Run[];privacyReviews?:PrivacyReviewRecord[]};
export type Tab = 'overview'|'evidence'|'assessment'|'drafts'|'discussion'|'history';
export type Audience = keyof Assessment['drafts'];
export type T = (key:string,values?:Record<string,string|number>)=>string;
export const tabs:Tab[] = ['overview','evidence','assessment','drafts','discussion','history'];
export const audiences = ['operations','airportCoordination','passenger'] as const;

/** A previous version's assessment is history, not the current incident's risk. */
export const currentAssessment = (detail:Detail) => detail.assessments.find(a =>
  a.id===detail.incident.current_assessment_id && a.snapshotVersion===detail.snapshot.version);

/** Historical output must explain its own snapshot, never today's incident flags. */
export const inputAtSnapshot = (detail:Detail,snapshotId:string):IncidentInput|undefined =>
  detail.snapshot.id===snapshotId ? detail.snapshot : detail.history.find(s=>s.id===snapshotId)?.input;

/** Explain the existing stop predicates without changing or reclassifying the saved result. */
export function stopReasonKeys(policy:Policy['constraints'],input?:IncidentInput,request?:string):string[] {
  if(!policy.actionConclusionsStopped)return [];
  const reasons:string[]=[];
  if(input?.safetyIssue)reasons.push('stopReasonSafety');
  if(input?.sourceReliabilityUnknown)reasons.push('stopReasonReliability');
  if(input&&sourceStopRequest(request||input.decisionRequest))reasons.push('stopReasonRequest');
  return reasons.length ? reasons : ['stopReasonUnavailable'];
}

export async function api<R>(path:string,body?:unknown,privacyReview?:InputPrivacyReview):Promise<R> {
  const response=await fetch(`/api/${path}`,body===undefined?{cache:'no-store'}:{method:'POST',headers:{'Content-Type':'application/json',...(privacyReview?{'X-Input-Privacy-Review':encodeURIComponent(JSON.stringify(privacyReview))}:{})},body:JSON.stringify(body)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error || 'INTERNAL_ERROR');
  return result as R;
}
export function inputOf(snapshot:Snapshot):IncidentInput {
  const {id,incidentId,version,createdAt,...input}=snapshot;
  void id;void incidentId;void version;void createdAt;
  return input;
}
export const time = (value:string,locale:Locale)=>new Date(value).toLocaleString(locale==='zh'?'zh-CN':'en-GB',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
export const pct = (value:number)=>(value*100).toFixed(2)+'%';
export const pad = (n:number)=>String(n).padStart(2,'0');
/** Mirrors domain/evidence without bundling the workbook into the browser. */
export const isAnomaly = (deltaPp:number)=>deltaPp<=-5;

/** Every recommendation in an assessment, in the order the model proposed them. */
export const recommendationsOf = (a:StoredAssessment)=>[a.result.firstAction,...a.result.subsequentActions];
/** The newest review per recommendation; reviews arrive newest first. */
export function latestReviews(reviews:Review[],assessmentId:string) {
  const latest=new Map<string,Review>();
  for(const r of reviews)if(r.assessmentId===assessmentId&&!latest.has(r.recommendationId))latest.set(r.recommendationId,r);
  return latest;
}
/** Long generated identifiers stay inspectable but are shortened for reading. */
export function citationLabel(id:string) {
  const [prefix,rest]=id.includes(':')?[id.slice(0,id.indexOf(':')),id.slice(id.indexOf(':')+1)]:['',id];
  const short=/^[0-9a-f]{8}-/.test(rest)?rest.slice(0,8):rest;
  return prefix?`${prefix} · ${short}`:short;
}
export function citationKind(id:string):'report'|'rule'|'operations'|'weather'|'scale'|'event'|'other' {
  if(id.startsWith('REPORT:'))return 'report';
  if(id.startsWith('RULE'))return 'rule';
  if(id.startsWith('OPS-'))return 'operations';
  if(id.startsWith('WX-'))return 'weather';
  if(id.startsWith('SCALE-'))return 'scale';
  if(id.startsWith('EVT'))return 'event';
  return 'other';
}
