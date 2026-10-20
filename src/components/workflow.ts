import type {StoredAssessment} from '../domain/types';
import {currentAssessment, recommendationsOf, type Detail, type Review} from './client';

export type AirportStage = 'loading' | 'preflight' | 'analyzing' | 'ready';

/** A discussion never takes over the airport's analysis screen. */
export function airportStage(detail: Detail | null, localAction?: 'generate' | 'discuss'): AirportStage {
  if (!detail) return 'loading';
  if (localAction === 'generate' || detail.runs.some(run => run.status === 'running' && run.action === 'assessment')) return 'analyzing';
  return currentAssessment(detail) ? 'ready' : 'preflight';
}

/** Resume in priority order, counting only decisions for this assessment. */
export function nextDecision(assessment: StoredAssessment, reviews: Map<string, Review>): number {
  return recommendationsOf(assessment).findIndex(action => {
    const review = reviews.get(action.id);
    return !review || review.assessmentId !== assessment.id || review.disposition === 'pending';
  });
}
