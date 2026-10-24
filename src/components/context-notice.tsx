'use client';

import {FEEDBACK_CONTEXT_LIMITS,type FeedbackContextSummary} from '../domain/context-limits';
import type {Run,T} from './client';

export function recordedFeedbackSummary(run?:Pick<Run,'metadata'>):FeedbackContextSummary|undefined {
  const value=run?.metadata.humanFeedback;
  if(!value||typeof value!=='object')return;
  const {reviewIds,latestReviewCount:total,omittedReviewCount:omitted}=value as Record<string,unknown>;
  if(!Array.isArray(reviewIds)||typeof total!=='number'||typeof omitted!=='number'||!Number.isInteger(total)||!Number.isInteger(omitted)||omitted<0||total!==reviewIds.length+omitted)return;
  return {included:reviewIds.length,total,omitted};
}

export function FeedbackContextNotice({summary,t,used=false}:{summary?:FeedbackContextSummary;t:T;used?:boolean}) {
  return <aside className={`context-notice ${summary?.omitted?'has-omissions':''}`} aria-label={t(used?'feedbackContextUsed':'feedbackContextTitle')}>
    <strong>{t(used?'feedbackContextUsed':'feedbackContextTitle')}</strong>
    {!used&&<p>{t('feedbackContextLimits',{reviews:FEEDBACK_CONTEXT_LIMITS.reviews,bytes:FEEDBACK_CONTEXT_LIMITS.bytes})}</p>}
    {summary&&<p>{t(used?'feedbackContextIncludedPast':'feedbackContextIncluded',summary)}</p>}
    {!!summary?.omitted&&<p role="status">{t('feedbackContextOmitted',{count:summary.omitted})}</p>}
  </aside>;
}
