import {isAnomaly} from '../domain/evidence';
import {evaluatePolicy} from '../domain/policy';
import {compareReportPeriod} from '../domain/report-period';
import type {EvidenceBundle, Snapshot} from '../domain/types';
import type {ReassessmentFeedback} from '../server/reassessment-feedback';

/** Derived descriptions of supplied records, not new sources or verified operational facts. */
export function interpretationContext(snapshot: Snapshot, evidence: EvidenceBundle, feedback?: ReassessmentFeedback) {
  const monthly = evidence.monthly;
  const anomalyIds = monthly.filter(row => isAnomaly(row.deltaPp)).map(row => row.evidenceId);
  const periods = monthly.map(row => row.period).sort();
  const unreliable = evaluatePolicy({...snapshot, sourceReliabilityUnknown: true});
  return {
    historical: {
      airportId: evidence.airportId, requestedThrough: snapshot.historicalThrough,
      availableFrom: periods[0] ?? null, availableThrough: periods.at(-1) ?? null,
      rowCount: monthly.length, anomalyCount: anomalyIds.length, anomalyIds,
      rows: monthly.map(row => ({
        evidenceId: row.evidenceId, period: row.period,
        baselineKind: row.priorCount === 0 ? 'initialization' : row.priorCount < 12 ? 'partial_history' : 'full_12_months',
        priorCount: row.priorCount, windowStart: row.windowStart, windowEnd: row.windowEnd,
        isAnomaly: isAnomaly(row.deltaPp)
      }))
    },
    reportPeriods: snapshot.reports.map(report => ({
      evidenceId: `REPORT:${report.id}`, applicablePeriod: report.applicablePeriod,
      scenarioPeriod: snapshot.scenarioPeriod,
      comparison: compareReportPeriod(report.applicablePeriod, snapshot.scenarioPeriod),
      reportedAtSupplied: !!report.reportedAt?.trim()
    })),
    feedbackRecords: {
      availability: feedback ? 'supplied' : 'not_supplied',
      recordedReviewCount: feedback?.latestReviewCount ?? null,
      suppliedReviewCount: feedback?.reviews.length ?? 0,
      omittedReviewCount: feedback?.omittedReviewCount ?? null,
      records: (feedback?.reviews ?? []).map(entry => ({
        reviewId: entry.reviewId, sourceVersion: entry.sourceVersion, applicability: entry.applicability,
        originalRecommendationProvided: true, reasonProvided: !!entry.review.reason.trim(),
        outcomeStatus: entry.review.outcomeStatus
      }))
    },
    // Explicitly conditional: this does not change the current snapshot or its policy.
    hypotheticalIncidentSourceReliabilityUnknown: {
      riskLevel: unreliable.riskLevel,
      actionConclusionsStopped: unreliable.constraints.actionConclusionsStopped,
      triggeredRuleIds: unreliable.constraints.triggeredRuleIds
    }
  };
}
