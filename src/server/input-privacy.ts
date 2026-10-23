import type Database from 'better-sqlite3';
import {createHash,randomUUID} from 'node:crypto';
import {AppError} from '../domain/privacy';
import {findInputPrivacy,privacyReviewPayload,privacyReviewSchema,type InputPrivacyReview,type PrivacyKind} from '../domain/input-privacy';

type ReviewedInput={review:InputPrivacyReview;findingKinds:PrivacyKind[]}|undefined;
export function checkInputPrivacy(scope:string,body:unknown,header:string|null):ReviewedInput {
  const findings=findInputPrivacy(body);
  if(!header){if(findings.length)throw new AppError('PRIVACY_REVIEW_REQUIRED',409);return;}
  if(header.length>12000)throw new AppError('PRIVACY_REVIEW_INVALID');
  let parsed:unknown;try{parsed=JSON.parse(decodeURIComponent(header));}catch{throw new AppError('PRIVACY_REVIEW_INVALID');}
  const result=privacyReviewSchema.safeParse(parsed);
  if(!result.success)throw new AppError('PRIVACY_REVIEW_INVALID');
  const review=result.data,hash=createHash('sha256').update(privacyReviewPayload(scope,body)).digest('hex');
  if(review.inputHash!==hash||findInputPrivacy({reviewerLabel:review.reviewerLabel,reason:review.reason}).length)throw new AppError('PRIVACY_REVIEW_INVALID');
  if(review.resolution==='masked'&&findings.length)throw new AppError('PRIVACY_REVIEW_REQUIRED',409);
  if(review.resolution!=='masked'&&review.findingCount!==findings.length)throw new AppError('PRIVACY_REVIEW_INVALID');
  // Masked requests never transmit the original spans. Their count is reviewer-reported.
  return {review,findingKinds:[...new Set(findings.map(f=>f.kind))]};
}
export function recordInputPrivacy(db:Database.Database,workspaceId:string,incidentId:string,action:string,checked:ReviewedInput) {
  if(!checked)return;
  const {review,findingKinds}=checked;
  db.prepare('INSERT INTO privacy_reviews VALUES(?,?,?,?,?,?)').run(randomUUID(),workspaceId,incidentId,action,JSON.stringify({...review,findingKinds}),new Date().toISOString());
}
