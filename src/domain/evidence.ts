import raw from '../data/competition.json';
import {bi, type Dataset, type EvidenceBundle, type IncidentInput} from './types';

// The repeatable importer validates this generated artifact before writing it.
export const dataset = raw as unknown as Dataset;
export function evidenceFor(incident: IncidentInput): EvidenceBundle {
  const through = incident.historicalThrough;
  const records = dataset.records.filter(r =>
    r.category === 'rule' ||
    (r.airportId === incident.airportId && (
      ['operations', 'weather'].includes(r.category) ? !through || r.period! <= through :
      r.category === 'scale' ? !through || `${r.period}-12` <= through :
      r.category === 'event' && r.id === incident.sourceEventId
    ))
  );
  const monthly = dataset.monthly.filter(m => m.airportId === incident.airportId && (!through || m.period <= through));
  const metrics = monthly.flatMap(m => [
    {id: `${m.evidenceId}:completion`, evidenceId: m.evidenceId, value: m.completion * 100, unit: '%', period: m.period, label: bi('Completed as planned', '按计划完成航班比例')},
    {id: `${m.evidenceId}:release`, evidenceId: m.evidenceId, value: m.releaseNormality * 100, unit: '%', period: m.period, label: bi('Release normality', '机场放行正常比例')},
    {id: `${m.evidenceId}:historical`, evidenceId: m.evidenceId, value: m.historicalMean * 100, unit: '%', period: m.period, label: bi('Prior available-month mean', '此前可用月份平均')},
    {id: `${m.evidenceId}:delta`, evidenceId: m.evidenceId, value: m.deltaPp, unit: 'pp', period: m.period, label: bi('Difference from historical mean', '与历史平均差')},
    {id: `${m.evidenceId}:peers`, evidenceId: m.evidenceId, value: m.peerMean * 100, unit: '%', period: m.period, label: bi('Same-category mean (includes this airport)', '同类均值（包含本机场）')}
  ]);
  return {
    datasetVersion: dataset.version, sourceHash: dataset.sha256, airportId: incident.airportId,
    records, monthly, metrics,
    reportEvidence: incident.reports.map(report => ({id: `REPORT:${report.id}`, report}))
  };
}
export const isAnomaly = (deltaPp: number) => deltaPp <= -5;
