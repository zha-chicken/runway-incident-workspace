import type {ReviewInput, StoredAssessment} from '../domain/types';
import {recommendationsOf, type Review} from './client';

/** Edit a new revision of the latest review; never reset fields hidden by this stage. */
export function feedbackDraft(assessmentId:string, recommendationId:string, previous:Review|undefined, reviewer:string, disposition?:ReviewInput['disposition']):ReviewInput {
  const existing=previous?.assessmentId===assessmentId&&previous.recommendationId===recommendationId?previous:undefined;
  return {
    assessmentId,recommendationId,disposition:disposition??existing?.disposition??'pending',
    reason:existing?.reason??'',finalAction:existing?.finalAction??'',outcome:existing?.outcome??'',
    outcomeStatus:existing?.outcomeStatus??'pending',nextImprovement:existing?.nextImprovement??'',
    reviewerLabel:existing?.reviewerLabel??reviewer,
    ...(existing?.revisedRecommendation!==undefined?{revisedRecommendation:existing.revisedRecommendation}:{})
  };
}

/** Deferring a decision advances to an unseen card, then exits rather than looping on Pending. */
export function nextAfterReview(assessment:StoredAssessment, reviews:Map<string,Review>, saved:ReviewInput):number {
  const actions=recommendationsOf(assessment);
  const unseen=actions.findIndex(a=>reviews.get(a.id)?.assessmentId!==assessment.id);
  if(unseen>=0)return unseen;
  if(saved.disposition==='pending')return -1;
  return actions.findIndex(a=>reviews.get(a.id)?.disposition==='pending');
}
