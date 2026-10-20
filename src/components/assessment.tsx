'use client';

import {useState} from 'react';
import {CircleDashed, CircleHelp, ClipboardCheck, RotateCcw, ShieldCheck, TriangleAlert, UserCheck} from 'lucide-react';
import type {Assessment, Locale, StoredAssessment} from '../domain/types';
import {pad, recommendationsOf, time, type Detail, type Review, type T} from './client';
import {AiMark, Citations, Constraints, DraftMark, Empty, GenerateButton, RiskBadge} from './ui';

type Claim = Assessment['rationale'][number];
const claimKinds=['fact','assumption','unknown'] as const;
const dispositionTone={pending:'neutral',accepted:'good',modified:'caution',rejected:'danger'};

export function AssessmentTab({detail,current,displayed,locale,t,reviews,onReview,onGenerate,aiBlocked}:{detail:Detail;current?:StoredAssessment;displayed?:StoredAssessment;locale:Locale;t:T;reviews:Map<string,Review>;onReview:(a:StoredAssessment,id:string)=>void;onGenerate:()=>void;aiBlocked:boolean}) {
  if(!displayed)return <Empty icon={<ShieldCheck size={28}/>} title={t('emptyAssessment')} body={t('emptyAssessmentBody')} action={<GenerateButton t={t} disabled={aiBlocked} onClick={onGenerate}/>}/>;
  const a=displayed.result;
  return <div className="stack">
    {!current&&<div className="notice caution"><RotateCcw size={17} aria-hidden/><span>{t('stale')} {t('staleDetail',{version:displayed.snapshotVersion,current:detail.snapshot.version})}</span><button className="secondary small" disabled={aiBlocked} onClick={onGenerate}>{t('reassess')}</button></div>}
    <article className="card assessment-head">
      <div className="head-top"><span className="mini-label">{t('aiRisk')}</span><span className="mark-row"><AiMark t={t}/><DraftMark t={t}/></span></div>
      <div className="head-risk"><RiskBadge level={a.riskLevel} t={t} large/><span className="head-plus" aria-hidden>+</span><Constraints policy={a.decisionConstraints} locale={locale} t={t}/></div>
      <p className="head-meta">{displayed.origin==='live_model'?t('live'):t('recorded')}<span className="dot" aria-hidden>·</span>{t('version')} {displayed.snapshotVersion}<span className="dot" aria-hidden>·</span>{time(displayed.generatedAt,locale)}<span className="dot" aria-hidden>·</span>{t(`out_${a.outputStatus}`)}</p>
      <p className="head-note">{t('riskSeparate')} {t('assessmentNote')}</p>
    </article>
    <AssessmentView assessment={displayed} locale={locale} t={t} reviews={reviews} onReview={id=>onReview(displayed,id)}/>
  </div>;
}

export function AssessmentView({assessment,locale,t,reviews,onReview,print}:{assessment:StoredAssessment;locale:Locale;t:T;reviews?:Map<string,Review>;onReview?:(id:string)=>void;print?:boolean}) {
  const [filter,setFilter]=useState<'all'|Claim['kind']>('all');
  const a=assessment.result,version=assessment.snapshotVersion;
  const refs=(ids:string[])=>print?<p className="print-refs">{[...new Set(ids)].join(', ')}</p>:<Citations ids={ids} version={version} t={t}/>;
  const actions=recommendationsOf(assessment);
  const reviewed=reviews?actions.filter(x=>reviews.get(x.id)&&reviews.get(x.id)!.disposition!=='pending').length:0;
  const claims=[...a.rationale,...a.possibleImpacts];
  const visible=(c:Claim)=>print||filter==='all'||c.kind===filter;
  const claimList=(list:Claim[])=><ul className="claims">{list.filter(visible).map((c,i)=><li className={`claim ${c.kind}`} key={i}>
    <span className="claim-kind">{c.kind==='fact'?<ShieldCheck size={13} aria-hidden/>:c.kind==='assumption'?<CircleDashed size={13} aria-hidden/>:<CircleHelp size={13} aria-hidden/>}{t(c.kind)}</span>
    <p>{c.text[locale]}</p>{refs(c.evidenceIds)}
  </li>)}{!list.some(visible)&&<li className="claim-empty">{t('noClaims')}</li>}</ul>;
  const lists=[
    {key:'assumptionsToVerify',title:t('assumptions'),icon:CircleDashed,tone:''},
    {key:'informationGaps',title:t('unknowns'),icon:CircleHelp,tone:''},
    {key:'escalationConditions',title:t('escalation'),icon:TriangleAlert,tone:'escalation'},
    {key:'humanDecisions',title:t('human'),icon:UserCheck,tone:'human'}
  ] as const;
  return <div className="assessment-content">
    <div className="assessment-layout">
      <section className="card plan" aria-labelledby={`plan-${assessment.id}`}>
        <div className="section-heading"><div><h2 id={`plan-${assessment.id}`}>{t('actionPlan')}</h2><p className="section-sub">{reviews?t('planSub',{done:reviewed,total:actions.length}):t('planSubPlain')}</p></div></div>
        <ol className="action-list">{actions.map((action,i)=>{const review=reviews?.get(action.id);return <li key={action.id} className={`action-item ${i===0?'first':''}`}>
          <span className="action-index">{pad(i+1)}</span>
          <div className="action-body">
            <div className="action-top"><span className="action-kind">{t(`kind_${action.kind}`)}</span>{i===0&&<span className="first-flag">{t('first')}</span>}</div>
            <p className="action-text">{action.text[locale]}</p>
            {refs([...action.evidenceIds,...action.ruleIds])}
            {onReview&&!print&&<div className="action-review">
              {review?<span className={`review-chip ${dispositionTone[review.disposition]}`}><ClipboardCheck size={13} aria-hidden/>{t(review.disposition)} · {review.reviewerLabel}</span>:<span className="review-chip awaiting"><CircleDashed size={13} aria-hidden/>{t('awaitingReview')}</span>}
              <button className="text-button" onClick={()=>onReview(action.id)}>{review?t('updateReview'):t('review')}</button>
            </div>}
          </div>
        </li>;})}</ol>
      </section>
      <section className="card reasoning" aria-labelledby={`why-${assessment.id}`}>
        <div className="section-heading"><div><h2 id={`why-${assessment.id}`}>{t('rationale')}</h2><p className="section-sub">{t('rationaleSub')}</p></div></div>
        {!print&&<div className="segmented small" role="group" aria-label={t('claimFilter')}>
          <button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>{t('all')}<span>{claims.length}</span></button>
          {claimKinds.map(k=><button key={k} aria-pressed={filter===k} onClick={()=>setFilter(k)} className={k}>{t(k)}<span>{claims.filter(c=>c.kind===k).length}</span></button>)}
        </div>}
        {claimList(a.rationale)}
        <h3 className="mini-heading">{t('impacts')}</h3>
        {claimList(a.possibleImpacts)}
      </section>
    </div>
    <div className="list-grid">{lists.map(l=>{const Icon=l.icon;return <article className={`card list-card ${l.tone}`} key={l.key}>
      <h2><Icon size={17} aria-hidden/>{l.title}<span className="count">{a[l.key].length}</span></h2>
      <ul className="plain-list">{a[l.key].map((v,j)=><li key={j}>{v[locale]}</li>)}</ul>
    </article>;})}</div>
    {print?<>{refs(a.evidenceReferences)}{refs(a.ruleIds)}</>:<details className="card refs-card">
      <summary>{t('refs')} <span className="count">{new Set(a.evidenceReferences).size}</span><span className="dot" aria-hidden>·</span>{t('rules')} <span className="count">{new Set(a.ruleIds).size}</span></summary>
      <h3 className="mini-heading">{t('refs')}</h3>{refs(a.evidenceReferences)}
      <h3 className="mini-heading">{t('rules')}</h3>{refs(a.ruleIds)}
    </details>}
  </div>;
}
