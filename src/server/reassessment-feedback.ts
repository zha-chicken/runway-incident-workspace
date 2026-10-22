import {actionSchema, reviewSchema, type Assessment, type ReviewInput, type Snapshot} from '../domain/types';
import {assertNoPersonalData} from '../domain/privacy';
import {database, ownIncident} from './db';

// Context bounds, not usage quotas. Keep whole records; never truncate a reason or its negation.
export const FEEDBACK_CONTEXT_LIMITS = {reviews: 24, bytes: 48_000} as const;
type ReviewContent = Pick<ReviewInput, 'disposition'|'reason'|'finalAction'|'outcome'|'outcomeStatus'|'nextImprovement'>;
export type ReassessmentFeedbackEntry = {
  reviewId: string; reviewedAt: string; assessmentId: string; assessmentGeneratedAt: string;
  sourceSnapshotId: string; sourceVersion: number; sourceAirportId: string; sourceScenarioPeriod: string;
  applicability: 'current_snapshot'|'prior_snapshot';
  originalRecommendation: Assessment['firstAction']; review: ReviewContent;
};
export type ReassessmentFeedback = {
  currentSnapshotId: string; currentVersion: number;
  latestReviewCount: number; omittedReviewCount: number;
  reviews: ReassessmentFeedbackEntry[];
};
type ReviewRow = {
  id: string; payload: string; created_at: string; assessment_id: string; recommendation_id: string;
  snapshot_id: string; version: number; snapshot_payload: string; assessment_created_at: string; result: string;
};

/** Read only reviews belonging to this workspace/incident, with deterministic latest-review selection. */
export function feedbackForReassessment(workspaceId: string, snapshot: Snapshot): ReassessmentFeedback {
  ownIncident(workspaceId, snapshot.incidentId);
  const rows = database().native.prepare(`
    WITH latest AS (
      SELECT r.*, r.rowid AS review_order,
        ROW_NUMBER() OVER (PARTITION BY r.assessment_id, r.recommendation_id ORDER BY r.created_at DESC, r.rowid DESC) AS position
      FROM reviews r JOIN incidents i ON i.id=r.incident_id
      WHERE i.workspace_id=? AND r.incident_id=?
    )
    SELECT r.id,r.payload,r.created_at,r.assessment_id,r.recommendation_id,
      a.snapshot_id,a.created_at AS assessment_created_at,a.result,
      s.version,s.payload AS snapshot_payload
    FROM latest r
    JOIN assessments a ON a.id=r.assessment_id AND a.incident_id=r.incident_id
    JOIN snapshots s ON s.id=a.snapshot_id AND s.incident_id=r.incident_id
    WHERE r.position=1 AND s.version<=?
    ORDER BY (s.id=?) DESC,r.created_at DESC,r.review_order DESC
  `).all(workspaceId,snapshot.incidentId,snapshot.version,snapshot.id) as ReviewRow[];
  const feedback: ReassessmentFeedback = {
    currentSnapshotId:snapshot.id,currentVersion:snapshot.version,
    latestReviewCount:rows.length,omittedReviewCount:0,reviews:[]
  };
  let bytes=0;
  for (const row of rows) {
    const review=reviewSchema.parse(JSON.parse(row.payload));
    const assessment=JSON.parse(row.result) as Assessment;
    const recommendation=[assessment.firstAction,...assessment.subsequentActions].find(a=>a.id===row.recommendation_id);
    if (!recommendation || review.assessmentId!==row.assessment_id || review.recommendationId!==row.recommendation_id) {
      feedback.omittedReviewCount++; continue;
    }
    const source=JSON.parse(row.snapshot_payload) as Snapshot;
    const entry: ReassessmentFeedbackEntry = {
      reviewId:row.id,reviewedAt:row.created_at,assessmentId:row.assessment_id,assessmentGeneratedAt:row.assessment_created_at,
      sourceSnapshotId:row.snapshot_id,sourceVersion:row.version,sourceAirportId:source.airportId,sourceScenarioPeriod:source.scenarioPeriod,
      applicability:row.snapshot_id===snapshot.id?'current_snapshot':'prior_snapshot',
      originalRecommendation:actionSchema.parse(recommendation),
      review:{disposition:review.disposition,reason:review.reason,finalAction:review.finalAction,
        outcome:review.outcome,outcomeStatus:review.outcomeStatus,nextImprovement:review.nextImprovement}
    };
    const size=Buffer.byteLength(JSON.stringify(entry),'utf8');
    if (feedback.reviews.length>=FEEDBACK_CONTEXT_LIMITS.reviews || bytes+size>FEEDBACK_CONTEXT_LIMITS.bytes) {
      feedback.omittedReviewCount++; continue;
    }
    assertNoPersonalData(entry);
    feedback.reviews.push(entry); bytes+=size;
  }
  return feedback;
}
