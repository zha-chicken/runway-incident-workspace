'use client';

import {ClipboardCheck} from 'lucide-react';
import type {Locale, ReviewInput, StoredAssessment} from '../domain/types';
import {latestReviews, recommendationsOf, time, type Detail, type T} from './client';
import {AssessmentView} from './assessment';
import {Empty, RiskBadge} from './ui';
import {errors} from './messages';

const dispositionTone={pending:'neutral',accepted:'good',modified:'caution',rejected:'danger'};
const runStatuses=['running','completed','failed','cancelled','interrupted'];

export function HistoryView({detail,locale,t,onReview}:{detail:Detail;locale:Locale;t:T;onReview:(a:StoredAssessment,id:string,disposition?:ReviewInput['disposition'],mode?:'decision'|'outcome')=>void}) {
  const recommendation=(assessmentId:string,id:string)=>{const a=detail.assessments.find(x=>x.id===assessmentId);return {a,text:a&&recommendationsOf(a).find(r=>r.id===id)?.text[locale]};};
  const followUps=detail.assessments.flatMap(a=>[...latestReviews(detail.reviews,a.id).values()].map(review=>({assessment:a,review})));
  return <div className="stack">
    <section className="card feedback-followup" aria-labelledby="followup-title">
      <p className="mini-label">{t('feedbackStageTwo')}</p>
      <h2 id="followup-title">{t('recordOutcomes')}</h2>
      <p className="section-sub">{t('outcomeLaterHint')}</p>
      {!followUps.length?<p>{t('reviewBeforeOutcome')}</p>:<ul className="followup-list">{followUps.map(({assessment:a,review:r})=><li key={r.id}>
        <div className="review-top"><span className={`review-chip ${dispositionTone[r.disposition]}`}>{t(r.disposition)}</span><span>{t('version')} {a.snapshotVersion}</span><span>{t('outcomeStatus')}: {t(r.outcomeStatus)}</span></div>
        <p>{recommendation(a.id,r.recommendationId).text}</p>
        {r.outcome&&<p className="muted">{r.outcome}</p>}
        <div className="button-row"><button className="secondary small" onClick={()=>onReview(a,r.recommendationId,undefined,'outcome')}>{t('recordOutcome')}</button><button className="text-button" onClick={()=>onReview(a,r.recommendationId)}>{t('editDecision')}</button></div>
      </li>)}</ul>}
    </section>
    <article className="card">
      <div className="section-heading"><div><h2>{t('reviewLog')}</h2><p className="section-sub">{t('reviewLogSub')}</p></div></div>
      {!detail.reviews.length?<Empty icon={<ClipboardCheck size={24}/>} title={t('noReviews')} body={t('noReviewsBody')}/>:<ol className="review-list">{detail.reviews.map(r=>{const {a,text}=recommendation(r.assessmentId,r.recommendationId);return <li className="review-card" key={r.id}>
        <div className="review-top"><span className={`review-chip ${dispositionTone[r.disposition]}`}>{t(r.disposition)}</span><strong>{r.reviewerLabel}</strong><span className="muted">{time(r.reviewedAt,locale)}</span>{a&&<span className="muted">{t('version')} {a.snapshotVersion}</span>}</div>
        <blockquote className="review-quote">{text||`${r.assessmentId} / ${r.recommendationId}`}</blockquote>
        <dl className="review-values">{(['reason','revisedRecommendation','finalAction','outcome','outcomeStatus','nextImprovement'] as const).map(key=><div key={key}><dt>{t(key==='nextImprovement'?'improvement':key==='revisedRecommendation'?'modifiedAction':key)}</dt><dd>{key==='outcomeStatus'?t(r[key]):r[key]||t('pending')}</dd></div>)}</dl>
      </li>;})}</ol>}
    </article>
    <article className="card">
      <div className="section-heading"><div><h2>{t('snapshotHistory')}</h2><p className="section-sub">{t('snapshotSub')}</p></div></div>
      <ol className="timeline">{detail.history.map(s=>{const assessments=detail.assessments.filter(a=>a.snapshotId===s.id);return <li key={s.id} className={`timeline-item ${s.version===detail.snapshot.version?'current':''}`}>
        <span className="timeline-node" aria-hidden/>
        <details>
          <summary><strong>{t('version')} {s.version}</strong><span className="muted">{time(s.createdAt,locale)}</span>{s.version===detail.snapshot.version&&<span className="tag good">{t('currentVersion')}</span>}<span className="timeline-risks">{assessments.map(a=><RiskBadge key={a.id} level={a.result.riskLevel} t={t}/>)}{!assessments.length&&<span className="muted">{t('notRun')}</span>}</span></summary>
          <div className="timeline-body">
            <dl className="review-values"><div><dt>{t('known')}</dt><dd>{s.input.knownInformation||t('notApplicable')}</dd></div><div><dt>{t('unknowns')}</dt><dd>{s.input.unknowns||t('notApplicable')}</dd></div><div><dt>{t('reports')}</dt><dd>{s.input.reports.length}</dd></div></dl>
            {assessments.map(a=><div key={a.id} className="prior-assessment"><h3 className="mini-heading">{t(`risk_${a.result.riskLevel}`)} · {time(a.generatedAt,locale)}</h3><AssessmentView assessment={a} locale={locale} t={t} reviews={latestReviews(detail.reviews,a.id)} onReview={(id,d)=>onReview(a,id,d)}/></div>)}
            <details className="raw"><summary>{t('snapshotJson')}</summary><pre>{JSON.stringify(s.input,null,2)}</pre></details>
          </div>
        </details>
      </li>;})}</ol>
    </article>
    <article className="card">
      <div className="section-heading"><div><h2>{t('runLog')}</h2><p className="section-sub">{t('runLogSub')}</p></div></div>
      {!detail.runs.length?<p className="muted">{t('noRuns')}</p>:<div className="table-scroll"><table className="runs">
        <thead><tr><th scope="col">{t('action')}</th><th scope="col">{t('status')}</th><th scope="col">{t('time')}</th><th scope="col">{t('cost')}</th><th scope="col">{t('details')}</th></tr></thead>
        <tbody>{detail.runs.map(r=><tr key={r.id}>
          <th scope="row">{r.action==='assessment'?t('assessment'):t('discussion')}</th>
          <td><span className={`tag ${r.status==='completed'?'good':r.status==='running'?'neutral':'danger'}`}>{runStatuses.includes(r.status)?t(`run_${r.status}`):r.status}</span></td>
          <td>{time(r.created_at,locale)}</td>
          <td className="code">¥{((r.cost_micro??r.reserved_micro)/1e6).toFixed(4)}</td>
          <td>{r.error_code&&<p className="run-error">{errors[r.error_code]?.[locale]||r.error_code}</p>}<details className="raw"><summary>{t('metadata')}</summary><pre>{JSON.stringify(r.metadata,null,2)}</pre></details></td>
        </tr>)}</tbody>
      </table></div>}
    </article>
  </div>;
}
