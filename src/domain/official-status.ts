import type {IncidentInput, Report} from './types';
import {isCurrentReportPeriod} from './report-period';

export function isOfficialStatusSource(report: Report, scenarioPeriod: string): boolean {
  return report.reliability === 'human_verified' && !!report.verificationBasis?.trim() &&
    !!report.reportedAt?.trim() && isCurrentReportPeriod(report.applicablePeriod, scenarioPeriod);
}

export function hasCurrentOfficialStatusSource(input: IncidentInput): boolean {
  return input.reports.some(report => report.id === input.officialStatusSourceId && isOfficialStatusSource(report, input.scenarioPeriod));
}
