'use client';

import {ValidationNotice} from './validation-notice';

import {useState} from 'react';
import {Check, CircleDashed, CircleHelp, ClipboardCheck, Pencil, ShieldCheck, TriangleAlert, UserCheck, X} from 'lucide-react';
import type {Assessment, Bilingual, Locale, ReviewInput, StoredAssessment} from '../domain/types';
import {pad, recommendationsOf, type Review, type T} from './client';
import {Citations} from './ui';

type Claim = Assessment['rationale'][number];
type Decide = (id:string,disposition?:ReviewInput['disposition'])=>void;
const claimKinds=['fact','assumption','unknown'] as const;
const dispositionTone={pending:'neutral',accepted:'good',modified:'caution',rejected:'danger'};
const choices=[{value:'accepted',label:'accept',icon:Check},{value:'modified',label:'modify',icon:Pencil},{value:'rejected',label:'reject',icon:X}] as const;

/** What a reviewer must know before deciding, most binding first. */
export const mustKnowLists=[
  {key:'humanDecisions',title:'onlyPerson',icon:UserCheck,tone:'human'},
  {key:'escalationConditions',title:'escalateIf',icon:TriangleAlert,tone:'escalation'},
  {key:'informationGaps',title:'stillUnknown',icon:CircleHelp,tone:''},
  {key:'assumptionsToVerify',title:'assumptions',icon:CircleDashed,tone:''}
] as const;

export function AssessmentView({assessment,locale,t,reviews,onReview,print}:{assessment:StoredAssessment;locale:Locale;t:T;reviews?:Map<string,Review>;onReview?:Decide;print?:boolean}) {
  const [filter,setFilter]=useState<'all'|Claim['kind']>('all');
  const a=assessment.result,version=assessment.snapshotVersion;
  const refs=(ids:string[])=>print?<p className="print-refs">{[...new Set(ids)].join(', ')}</p>:<Citations ids={ids} version={version} t={t}/>;
  const actions=recommendationsOf(assessment);
  const decidedOf=(id:string)=>{const r=reviews?.get(id);return r&&r.disposition!=='pending'?r:undefined;};
  const decided=actions.filter(x=>decidedOf(x.id)).length;
  const claims=[...a.rationale,...a.possibleImpacts];
  const visible=(c:Claim)=>print||filter==='all'||c.kind===filter;
  const deciding=!!onReview&&!print;
  return <div className="assessment-content">
    <ValidationNotice validation={assessment.validation} locale={locale} expanded={print}/>
    <div className="decide-layout">
      <section className="card plan" aria-labelledby={`plan-${assessment.id}`}>
        <div className="section-heading"><div><h2 id={`plan-${assessment.id}`}>{deciding?t('decideTitle'):t('actionPlan')}</h2><p className="section-sub">{deciding?t('decideSub',{done:decided,total:actions.length}):t('planSubPlain')}</p></div></div>
        {deciding&&<span className="progress" aria-hidden><span style={{width:`${actions.length?decided/actions.length*100:0}%`}}/></span>}
        <ol className="action-list">{actions.map((action,i)=>{const review=reviews?.get(action.id),done=decidedOf(action.id);return <li key={action.id} className={`action-item ${i===0?'first':''} ${deciding&&!done?'undecided':''} ${done?'decided':''}`}>
          <span className="action-index">{done?<Check size={14} aria-label={t(done.disposition)}/>:pad(i+1)}</span>
          <div className="action-body">
            <div className="action-top"><span className="action-kind">{t(`kind_${action.kind}`)}</span>{i===0&&<span className="first-flag">{t('first')}</span>}</div>
            <p className="action-text">{action.text[locale]}</p>
            {refs([...action.evidenceIds,...action.ruleIds])}
            {deciding&&<div className="decision-row">
              {done?<>
                <span className={`review-chip ${dispositionTone[done.disposition]}`}><ClipboardCheck size={13} aria-hidden/>{t(done.disposition)} · {done.reviewerLabel}</span>
                <button className="text-button" onClick={()=>onReview!(action.id,done.disposition)}>{t('change')}</button>
              </>:<>
                <span className="decision-prompt">{review?`${t('pending')} · ${review.reviewerLabel}`:t('awaitingReview')}</span>
                <div className="decision-buttons" role="group" aria-label={t('decision')}>{choices.map(c=>{const Icon=c.icon;return <button key={c.value} className={`decide-btn ${c.value}`} onClick={()=>onReview!(action.id,c.value)}><Icon size={14} aria-hidden/>{t(c.label)}</button>;})}</div>
              </>}
            </div>}
          </div>
        </li>;})}</ol>
      </section>
      <aside className="must-know" aria-label={t('mustKnow')}>
        <span className="mini-label">{t('mustKnow')}</span>
        {mustKnowLists.map(l=><MustList key={l.key} title={t(l.title)} icon={<l.icon size={16} aria-hidden/>} tone={l.tone} items={a[l.key]} locale={locale} t={t} print={print}/>)}
      </aside>
    </div>
    <section className="card reasoning" aria-labelledby={`why-${assessment.id}`}>
      <div className="section-heading"><div><h2 id={`why-${assessment.id}`}>{t('rationale')}</h2><p className="section-sub">{t('rationaleSub')}</p></div>
        {!print&&<ClaimFilter claims={claims} filter={filter} setFilter={setFilter} t={t}/>}
      </div>
      <div className="claim-columns">
        <div><Claims claims={a.rationale.filter(visible)} version={version} locale={locale} t={t} print={print}/></div>
        <div><h3 className="mini-heading">{t('impacts')}</h3><Claims claims={a.possibleImpacts.filter(visible)} version={version} locale={locale} t={t} print={print}/></div>
      </div>
    </section>
    {print?<>{refs(a.evidenceReferences)}{refs(a.ruleIds)}</>:<details className="card refs-card">
      <summary>{t('refs')} <span className="count">{new Set(a.evidenceReferences).size}</span><span className="dot" aria-hidden>·</span>{t('rules')} <span className="count">{new Set(a.ruleIds).size}</span></summary>
      <h3 className="mini-heading">{t('refs')}</h3>{refs(a.evidenceReferences)}
      <h3 className="mini-heading">{t('rules')}</h3>{refs(a.ruleIds)}
    </details>}
  </div>;
}

export function ClaimFilter({claims,filter,setFilter,t}:{claims:Claim[];filter:'all'|Claim['kind'];setFilter:(f:'all'|Claim['kind'])=>void;t:T}) {
  return <div className="segmented small" role="group" aria-label={t('claimFilter')}>
    <button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>{t('all')}<span>{claims.length}</span></button>
    {claimKinds.map(k=><button key={k} aria-pressed={filter===k} onClick={()=>setFilter(k)} className={k}>{t(k)}<span>{claims.filter(c=>c.kind===k).length}</span></button>)}
  </div>;
}

/** Statements marked as fact, assumption or unknown, each with its sources. */
export function Claims({claims,version,locale,t,print}:{claims:Claim[];version:number;locale:Locale;t:T;print?:boolean}) {
  return <ul className="claims">{claims.map((c,i)=><li className={`claim ${c.kind}`} key={i}>
    <span className="claim-kind">{c.kind==='fact'?<ShieldCheck size={13} aria-hidden/>:c.kind==='assumption'?<CircleDashed size={13} aria-hidden/>:<CircleHelp size={13} aria-hidden/>}{t(c.kind)}</span>
    <p>{c.text[locale]}</p>{print?<p className="print-refs">{[...new Set(c.evidenceIds)].join(', ')}</p>:<Citations ids={c.evidenceIds} version={version} t={t}/>}
  </li>)}{!claims.length&&<li className="claim-empty">{t('noClaims')}</li>}</ul>;
}

/** Long lists stay scannable: the first three items show until the reader asks for more. */
export function MustList({title,icon,tone,items,locale,t,print}:{title:string;icon:React.ReactNode;tone:string;items:Bilingual[];locale:Locale;t:T;print?:boolean}) {
  const [all,setAll]=useState(false);
  const shown=all||print?items:items.slice(0,3);
  return <article className={`card list-card ${tone}`}>
    <h2>{icon}{title}<span className="count">{items.length}</span></h2>
    <ul className="plain-list">{shown.map((v,j)=><li key={j}>{v[locale]}</li>)}</ul>
    {items.length>3&&!print&&<button className="text-button more" onClick={()=>setAll(!all)} aria-expanded={all}>{all?t('showLess'):t('showAll',{count:items.length})}</button>}
  </article>;
}
