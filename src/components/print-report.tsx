import type {Locale, StoredAssessment} from '../domain/types';
import {inputAtSnapshot, type Audience, type Detail, type T} from './client';
import {AssessmentView} from './assessment';
import {Constraints} from './ui';
import {MessageContent} from './message-content';

export function PrintReport({detail,displayed,isCurrent,locale,t,eventTitle,draftText}:{detail:Detail;displayed:StoredAssessment;isCurrent:boolean;locale:Locale;t:T;eventTitle:(id:string|null,fallback:string)=>string;draftText:(a:StoredAssessment,audience:Audience)=>string}) {
  const snapshot=inputAtSnapshot(detail,displayed.snapshotId);
  return <div className="print-report">
    <p className="print-flag">{t('simulation')} · {t('draft')} · {t('aiGenerated')}</p>
    <h1>{t('brand')} · {snapshot?eventTitle(snapshot.sourceEventId,snapshot.title):t('snapshotUnavailable')}</h1>
    <p>{snapshot?.scenarioPeriod||displayed.result.scope.scenarioPeriod} · {t('version')} {displayed.snapshotVersion} · {t(`risk_${displayed.result.riskLevel}`)} · {t('official')}: {snapshot?t(snapshot.officialStatus):t('snapshotUnavailable')}</p>
    <p>{t('draftHint')}</p>{!isCurrent&&<p>{t('stale')}</p>}
    <Constraints policy={displayed.result.decisionConstraints} input={snapshot} locale={locale} t={t}/>
    <AssessmentView assessment={displayed} locale={locale} t={t} print/>
    {(['operations','airportCoordination','passenger'] as const).map(a=><section key={a} className="print-draft"><h2>{t(a)} · {t('draft')}</h2><MessageContent text={draftText(displayed,a)} evidenceIds={displayed.result.drafts[a].evidenceIds} version={displayed.snapshotVersion} locale={locale} t={t} print/><p className="print-refs">{displayed.result.drafts[a].evidenceIds.join(', ')}</p></section>)}
    <h2>{t('reviewLog')}</h2>{detail.reviews.map(r=><p key={r.id}>{r.reviewedAt} · {r.reviewerLabel} · {r.recommendationId} · {t(r.disposition)} · {r.reason} · {t('modifiedAction')}: {r.revisedRecommendation||t('notApplicable')} · {t('finalAction')}: {r.finalAction||t('notApplicable')} · {t(r.outcomeStatus)}: {r.outcome||t('pending')} · {t('improvement')}: {r.nextImprovement||t('notApplicable')}</p>)}
    <p className="print-refs">{t('sourceHash')}: {detail.evidence.sourceHash}</p>
  </div>;
}
