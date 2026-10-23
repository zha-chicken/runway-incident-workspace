'use client';

import {ValidationNotice} from './validation-notice';
import {warningsForPath} from '../domain/validation-notes';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, Check, ChevronDown, CircleDashed, Clock, FileText, LoaderCircle, MessageSquare, Paperclip, Pencil, Plane, Play, Plus, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert, Upload, X} from 'lucide-react';
import type {Locale, ReviewInput, StoredAssessment} from '../domain/types';
import {isAnomaly, recommendationsOf, type Bootstrap, type Detail, type Review, type T, type Tab} from './client';
import {AeroContextMark, AiMark, BrandName, Citations, DraftMark, Elapsed, Empty, RiskBadge, SimMark, constraintOf} from './ui';
import {EvidenceStats, EvidenceView} from './evidence';
import {ReportList} from './overview';
import {Claims, MustList, mustKnowLists} from './assessment';
import {nextDecision, type AirportStage} from './workflow';
import {feedbackDraft, nextAfterReview} from './feedback';
import {ReviewForm} from './editor';

const decisionIcons={accepted:Check,modified:Pencil,rejected:X,pending:CircleDashed};
const decidedIn=(reviews:Map<string,Review>,id:string)=>{const r=reviews.get(id);return r&&r.disposition!=='pending'?r:undefined;};
const sourceCounts=(detail:Detail,t:T)=>({reports:t('reportCount',{count:detail.snapshot.reports.length}),months:t('monthCount',{count:detail.evidence.monthly.length})});

export function WorkspaceHome({boot, locale, t, active, controls, onChoose, onNew, onReset}: {
  boot:Bootstrap; locale:Locale; t:T; active:string[]; controls:ReactNode; onChoose:(id:string)=>void; onNew:()=>void; onReset:()=>void;
}) {
  const analyzed=boot.incidents.filter(i=>i.riskLevel).length;
  return <div className="home">
    <header className="home-bar">
      <div className="home-brand"><span className="brand-tile"><AeroContextMark size={19}/></span><BrandName/></div>
      <div className="home-controls"><SimMark t={t}/>{controls}</div>
    </header>
    <section className="home-hero">
      <div><p className="mini-label">{t('tagline')}</p><h1>{t('chooseIncident')}</h1></div>
      <button className="secondary" onClick={onNew}><Plus size={16} aria-hidden/>{t('newIncident')}</button>
    </section>
    {boot.incidents.length?<>
      <p className="home-counts">{t('homeCounts',{total:boot.incidents.length,analyzed,waiting:boot.incidents.length-analyzed})}</p>
      <div className="board">
        <div className="board-head" aria-hidden><span>{t('airport')}</span><span>{t('incident')}</span><span>{t('period')}</span><span>{t('status')}</span><span/></div>
        <ul>{boot.incidents.map(incident=>{
          const airport=boot.airports.find(a=>a.id===incident.airportId);
          const title=boot.events.find(e=>e.id===incident.sourceEventId)?.title[locale]||incident.title;
          return <li key={incident.id}><button className="board-row" onClick={()=>onChoose(incident.id)}>
            <span className="board-airport"><span className="code-tag">{incident.airportId}</span><span className="board-name">{airport?.name[locale]}</span></span>
            <span className="board-title">{title}</span>
            <span className="board-time">{incident.scenarioPeriod}</span>
            <span className="board-status">{active.includes(incident.id)?<span className="analyzing-label"><LoaderCircle size={14} className="spin" aria-hidden/>{t('analysisInProgress')}</span>:<RiskBadge level={incident.riskLevel} t={t}/>}</span>
            <ArrowRight size={18} className="board-arrow" aria-hidden/>
          </button></li>;
        })}</ul>
      </div>
    </>:<Empty icon={<Plane size={28}/>} title={t('newIncident')} body={t('newIncidentHint')} action={<button className="primary" onClick={onNew}><Plus size={16} aria-hidden/>{t('newIncident')}</button>}/>}
    <footer className="home-foot"><span>{t('simulationNote')}</span><button className="text-button" onClick={onReset}>{t('reset')}</button></footer>
  </div>;
}

type Step = {key:string;state:'done'|'now'|'todo';note?:string};
/** Airport identity plus where this incident stands in read → analyze → decide → share. */
export function AirportHeader({detail, airportName, title, stage, decided, total, t, onHome}: {
  detail:Detail; airportName:string; title:string; stage:AirportStage; decided:number; total:number; t:T; onHome:()=>void;
}) {
  const s=detail.snapshot,open=total-decided;
  const steps:Step[]=[
    {key:'read',state:stage==='preflight'?'now':'done'},
    {key:'analyze',state:stage==='analyzing'?'now':stage==='preflight'?'todo':'done'},
    {key:'decide',state:stage!=='ready'?'todo':open>0?'now':'done',note:stage==='ready'?t('decidedCount',{done:decided,total}):undefined},
    {key:'share',state:stage==='ready'&&open===0?'now':'todo'}
  ];
  return <header className="airport-header">
    <nav className="crumbs" aria-label={t('breadcrumb')}><button type="button" onClick={onHome}>{t('allIncidents')}</button><span aria-hidden>/</span><span aria-current="page">{s.airportId}</span></nav>
    <div className="airport-title">
      <span className="code-tag large">{s.airportId}</span>
      <div><h1>{title}</h1><p className="airport-meta"><span>{airportName}</span><span className="dot" aria-hidden>·</span><span>{s.scenarioPeriod}</span><span className="dot" aria-hidden>·</span><span>{t('version')} {s.version}</span></p></div>
    </div>
    <ol className="tracker" aria-label={t('workflow')}>{steps.map((step,i)=><li key={step.key} className={`track ${step.state}`} aria-current={step.state==='now'?'step':undefined}>
      <span className="track-marker">{step.state==='done'?<Check size={14} aria-hidden/>:i+1}</span>
      <span className="track-text"><span className="track-label">{t(`track_${step.key}`)}</span>{step.note&&<span className="track-note">{step.note}</span>}</span>
    </li>)}</ol>
  </header>;
}

export function ViewHeader({airport, title, sub, t, onBack, actions}: {airport:string; title:string; sub:string; t:T; onBack:()=>void; actions?:ReactNode}) {
  return <header className="view-header">
    <button type="button" className="back" onClick={onBack}><ArrowLeft size={16} aria-hidden/>{t('backToAirport',{airport})}</button>
    <div className="view-title"><div><h1>{title}</h1><p>{sub}</p></div>{actions&&<div className="button-row">{actions}</div>}</div>
  </header>;
}

export function Preflight({detail, t, locale, blocked, apiConfigured, onStart, onEdit}: {
  detail:Detail; t:T; locale:Locale; blocked:boolean; apiConfigured:boolean; onStart:()=>void; onEdit:()=>void;
}) {
  const s=detail.snapshot,previous=detail.assessments[0];
  return <div className="preflight">
    <aside className="start-panel inverse" aria-labelledby="start-title">
      <span className="mini-label">{t('nextLabel')}</span>
      <h2 id="start-title">{t('preflightTitle')}</h2>
      <p>{t('preflightBody',sourceCounts(detail,t))}</p>
      {previous&&<p className="start-note"><TriangleAlert size={15} aria-hidden/>{t('preflightStale',{version:previous.snapshotVersion,current:s.version})}</p>}
      {!apiConfigured&&<p className="start-note"><TriangleAlert size={15} aria-hidden/>{t('next_key_title')}. {t('next_key_body')}</p>}
      <button className="primary large block" onClick={onStart} disabled={blocked}><Play size={16} fill="currentColor" aria-hidden/>{t('startAnalysis')}</button>
      <ul className="start-facts"><li><Clock size={14} aria-hidden/>{t('preflightTime')}</li><li><ShieldCheck size={14} aria-hidden/>{t('preflightSafe')}</li></ul>
    </aside>
    <div className="preflight-main">
      <article className="card">
        <header className="card-head"><h2><FileText size={19} aria-hidden/>{t('tab_overview')}</h2><button className="secondary small" onClick={onEdit}><Pencil size={13} aria-hidden/>{t('editIncident')}</button></header>
        <div className="read-field"><h3>{t('happening')}</h3><p className="lead">{s.knownInformation||t('notApplicable')}</p></div>
        <div className="read-field unknown"><h3>{t('notKnown')}</h3><p>{s.unknowns||t('notApplicable')}</p></div>
        {s.decisionRequest&&<div className="decision-request"><h3>{t('decisionRequest')}</h3><p>{s.decisionRequest}</p></div>}
        <dl className="fact-row">
          <div><dt>{t('importance')}</dt><dd>{t(s.businessImportance)}</dd></div>
          <div><dt>{t('official')}</dt><dd>{t(s.officialStatus)}</dd></div>
          <div><dt>{t('historicalThrough')}</dt><dd className={s.historicalThrough?'code':''}>{s.historicalThrough||t('allHistory')}</dd></div>
        </dl>
        {(s.safetyIssue||s.sourceReliabilityUnknown)&&<div className="flag-row">
          {s.safetyIssue&&<span className="flag danger"><TriangleAlert size={14} aria-hidden/>{t('safetyIssue')}</span>}
          {s.sourceReliabilityUnknown&&<span className="flag caution"><TriangleAlert size={14} aria-hidden/>{t('sourceUnknown')}</span>}
        </div>}
      </article>
      <article className="card">
        <header className="card-head"><h2><Paperclip size={19} aria-hidden/>{t('tab_evidence')}</h2></header>
        <h3 className="mini-heading">{t('reports')}</h3>
        <ReportList detail={detail} t={t}/>
        <h3 className="mini-heading">{t('airportHistory')}</h3>
        <EvidenceStats evidence={detail.evidence} t={t}/>
        <details className="disclosure"><summary>{t('moreEvidence')}<ChevronDown size={16} aria-hidden/></summary>
          <EvidenceView evidence={detail.evidence} historicalThrough={s.historicalThrough} locale={locale} t={t} stats={false}/>
        </details>
      </article>
    </div>
  </div>;
}

/** Describes the work without claiming progress the server does not report. */
export function AnalysisProgress({detail, since, t, onCancel, busy}: {detail:Detail; since:string; t:T; onCancel?:()=>void; busy:boolean}) {
  const airport=detail.snapshot.airportId,counts=sourceCounts(detail,t);
  return <section className="analysis" aria-labelledby="analysis-title" aria-busy="true">
    <div className="route" aria-hidden><span className="code-tag">{airport}</span><span className="route-line"><Plane size={20} className="route-plane"/></span><span className="route-end"><Scale size={16}/></span></div>
    <div className="analysis-head"><h2 id="analysis-title" role="status">{t('analyzingAirport',{airport})}</h2><Elapsed since={since} label={t('elapsed')} className="analysis-clock"/></div>
    <p className="analysis-note">{t('analysisWait')}</p>
    <h3 className="mini-heading">{t('analysisDoing')}</h3>
    <ul className="analysis-steps">{[t('step_reports',counts),t('step_history',counts),t('step_rules'),t('step_drafts')].map(step=><li key={step}>{step}</li>)}</ul>
    {onCancel&&<div className="analysis-foot"><button className="secondary" disabled={busy} onClick={onCancel}><X size={15} aria-hidden/>{t('cancelRun')}</button></div>}
  </section>;
}

/** After analysis: the decision is the one dark card; every other section says what it holds. */
export function AirportHub({detail, assessment, reviews, locale, t, answering, onOpen}: {
  detail:Detail; assessment:StoredAssessment; reviews:Map<string,Review>; locale:Locale; t:T; answering:boolean; onOpen:(tab:Tab)=>void;
}) {
  const a=assessment.result,actions=recommendationsOf(assessment);
  const decided=actions.filter(x=>decidedIn(reviews,x.id)).length,next=nextDecision(assessment,reviews);
  const {label,Icon}=constraintOf(a.decisionConstraints);
  const monthly=detail.evidence.monthly,counts=sourceCounts(detail,t);
  const tiles:{tab:Tab;icon:typeof FileText;summary:string;note:string}[]=[
    {tab:'overview',icon:FileText,summary:detail.snapshot.knownInformation||t('notApplicable'),note:`${t('version')} ${detail.snapshot.version} · ${t(detail.snapshot.officialStatus)}`},
    {tab:'evidence',icon:Paperclip,summary:`${counts.reports} · ${counts.months}`,note:t('focusedCount',{count:monthly.filter(r=>isAnomaly(r.deltaPp)).length})},
    {tab:'drafts',icon:MessageSquare,summary:t('msgsSummary'),note:`${t('draftCount',{count:3})} · ${t('draft')}`},
    {tab:'discussion',icon:Sparkles,summary:answering?t('answering'):t('threadCount',{count:detail.discussions.length}),note:t('askHint')},
    {tab:'history',icon:Upload,summary:t('reviewCount',{count:detail.reviews.length}),note:t('recordHint')}
  ];
  return <nav className="hub" aria-label={t('incidentMenu')}>
    <button className="hub-hero inverse" onClick={()=>onOpen('assessment')}>
      <span className="hub-hero-top"><span className="hub-label"><Scale size={17} aria-hidden/>{t('tab_assessment')}</span><span className="mark-row"><AiMark t={t}/><DraftMark t={t}/></span></span>
      <span className="hub-risk"><RiskBadge level={a.riskLevel} t={t} large/><span className="hub-constraint"><Icon size={16} aria-hidden/>{t(label)}</span></span>
      <span className="hub-next">{next>=0?<><span className="mini-label">{t('nextUp')} · {t('decisionPosition',{current:next+1,total:actions.length})}</span><span className="hub-next-text">{actions[next].text[locale]}</span></>:<><span className="mini-label">{t('next_done_title')}</span><span className="hub-next-text">{t('next_done_body')}</span></>}</span>
      <span className="hub-progress"><span className="progress"><span style={{width:`${actions.length?decided/actions.length*100:0}%`}}/></span><span>{t('decidedCount',{done:decided,total:actions.length})}</span></span>
      <span className="hub-cta">{next<0?t('reviewDecisions'):decided?t('continueDeciding'):t('next_decide_cta')}<ArrowRight size={17} aria-hidden/></span>
    </button>
    {tiles.map(tile=><button key={tile.tab} className="hub-tile" onClick={()=>onOpen(tile.tab)}>
      <span className="hub-tile-top"><tile.icon size={20} strokeWidth={1.7} aria-hidden/>{tile.tab==='drafts'&&next<0&&<span className="next-badge">{t('nextLabel')}</span>}{tile.tab==='discussion'&&answering&&<LoaderCircle size={16} className="spin" aria-hidden/>}</span>
      <span className="hub-tile-title">{t(`tab_${tile.tab}`)}</span>
      <span className="hub-tile-summary">{tile.summary}</span>
      <span className="hub-tile-note">{tile.note}</span>
      <ArrowRight size={16} className="hub-arrow" aria-hidden/>
    </button>)}
  </nav>;
}

export function ReanalysisBanner({t,blocked,onConfirm,onModify,onOutcomes}:{t:T;blocked:boolean;onConfirm:()=>void;onModify:()=>void;onOutcomes?:()=>void}) {
  const heading=useRef<HTMLHeadingElement>(null),banner=useRef<HTMLElement>(null);
  useEffect(()=>{heading.current?.focus({preventScroll:true});banner.current?.scrollIntoView({block:'nearest'});},[]);
  return <section ref={banner} className="reanalysis-banner" aria-labelledby="reanalysis-title">
    <RotateCcw size={20} aria-hidden/>
    <div className="reanalysis-copy">
      <h2 id="reanalysis-title" ref={heading} tabIndex={-1}>{t('reanalysisTitle')}</h2>
      <p>{t('reanalysisBody')}</p>
      <div className="button-row">
        <button className="primary" disabled={blocked} onClick={onConfirm}>{t('reanalysisYes')}<ArrowRight size={15} aria-hidden/></button>
        <button className="secondary" onClick={onModify}>{t('reanalysisModify')}</button>
        {onOutcomes&&<button className="secondary" onClick={onOutcomes}>{t('recordOutcomes')}</button>}
      </div>
    </div>
  </section>;
}

export function DecisionFlow({assessment, reviews, locale, t, reviewer, onSave, onExit, onOutcome}: {
  assessment:StoredAssessment; reviews:Map<string,Review>; locale:Locale; t:T; reviewer:string; onSave:(input:ReviewInput)=>Promise<void>; onExit:()=>void; onOutcome?:(id:string)=>void;
}) {
  const actions=recommendationsOf(assessment),a=assessment.result;
  const [index,setIndex]=useState(()=>Math.max(0,nextDecision(assessment,reviews)));
  const [draft,setDraft]=useState<ReviewInput|null>(null);
  const [saving,setSaving]=useState(false),[error,setError]=useState('');
  const mounted=useRef(true),savingRef=useRef(false),heading=useRef<HTMLHeadingElement>(null),card=useRef<HTMLElement>(null),moved=useRef(false);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const action=actions[index],review=reviews.get(action.id);
  const actionWarnings=warningsForPath(assessment.validation,`actions.${index}`);
  const decided=actions.filter(x=>decidedIn(reviews,x.id)).length;
  const {label,Icon:ConstraintIcon}=constraintOf(a.decisionConstraints);
  const move=(to:number)=>{moved.current=true;setIndex(to);setDraft(null);setError('');};
  useEffect(()=>{
    heading.current?.focus({preventScroll:true});
    // On phones the list sits above the card; bring the next recommendation back into view.
    if(moved.current)card.current?.scrollIntoView({block:'nearest',behavior:'smooth'});
  },[index]);
  function choose(disposition:ReviewInput['disposition']) {
    setDraft(feedbackDraft(assessment.id,action.id,review,reviewer,disposition));setError('');
  }
  async function save() {
    if(savingRef.current||!draft||!draft.reviewerLabel.trim()||(['modified','rejected'].includes(draft.disposition)&&!draft.reason.trim()))return;
    savingRef.current=true;setSaving(true);setError('');
    const input={...draft,reason:draft.reason.trim(),reviewerLabel:draft.reviewerLabel.trim()};
    try {
      await onSave(input);
      if(!mounted.current)return;
      const updated=new Map(reviews);updated.set(action.id,{...input,id:'saved',reviewedAt:new Date().toISOString()});
      const next=nextAfterReview(assessment,updated,input);
      if(next<0)onExit();else move(next);
    } catch {if(mounted.current)setError(t('decisionSaveFailed'));}
    finally {savingRef.current=false;if(mounted.current)setSaving(false);}
  }
  const Recorded=review?decisionIcons[review.disposition]:null;
  return <div className="decide">
    <aside className="decide-side">
      <div className="decide-summary">
        <RiskBadge level={a.riskLevel} t={t}/>
        <span className="decide-constraint"><ConstraintIcon size={15} aria-hidden/>{t(label)}</span>
        {a.decisionConstraints.reviewerRoles.length>0&&<span className="decide-reviewers">{t('reviewers')}: {a.decisionConstraints.reviewerRoles.map(v=>v[locale]).join(' · ')}</span>}
      </div>
      <div className="decide-list-head"><span className="mini-label">{t('recommendations')}</span><span>{t('decidedCount',{done:decided,total:actions.length})}</span></div>
      <span className="progress" aria-hidden><span style={{width:`${decided/actions.length*100}%`}}/></span>
      <ol className="decide-list" aria-label={t('decisionProgress')}>{actions.map((item,i)=>{
        const saved=reviews.get(item.id),done=decidedIn(reviews,item.id),DoneIcon=saved?decisionIcons[saved.disposition]:null;
        return <li key={item.id}><button className={`decide-item ${i===index?'current':''} ${done?'complete':''}`} disabled={saving} aria-current={i===index?'step':undefined} onClick={()=>move(i)}>
          <span className="decide-num">{DoneIcon?<DoneIcon size={13} aria-hidden/>:i+1}</span>
          <span className="decide-item-body"><span className="decide-item-kind">{t(`kind_${item.kind}`)} · {saved?t(saved.disposition):t('open')}</span><span className="decide-item-text">{item.text[locale]}</span></span>
        </button></li>;
      })}</ol>
    </aside>
    <div className="decide-main">
      <article className="decision-card" ref={card}>
        <div className="decision-top"><span className="decision-position">{t('decisionPosition',{current:index+1,total:actions.length})}</span><span className="action-kind">{t(`kind_${action.kind}`)}</span>{index===0&&<span className="first-flag">{t('first')}</span>}<AiMark t={t}/></div>
        <ValidationNotice validation={assessment.validation&&{...assessment.validation,warnings:actionWarnings}} locale={locale} expanded/>
        <h2 ref={heading} tabIndex={-1} className="decision-text">{action.text[locale]}</h2>
        {action.evidenceIds.length+action.ruleIds.length>0&&<div className="based-on"><span className="mini-label">{t('basedOn')}</span><Citations ids={[...action.evidenceIds,...action.ruleIds]} version={assessment.snapshotVersion} t={t}/></div>}
        {review&&Recorded&&<p className="decision-recorded"><Recorded size={15} aria-hidden/><span><strong>{t(review.disposition)}</strong> · {review.reviewerLabel}{review.reason&&<> — {review.reason}</>}</span></p>}
        {review&&onOutcome&&<button className="text-button" disabled={saving} onClick={()=>onOutcome(action.id)}>{t('recordOutcome')}</button>}
        {draft?<ReviewForm review={draft} recommendation="" setReview={setDraft} t={t} busy={saving} mode="decision" submitLabel={t(draft.disposition==='pending'?'savePendingAndContinue':'saveAndContinue')} onSave={()=>void save()} onCancel={()=>setDraft(null)}/>:<>
          <p className="field-hint">{t('decisionOnlyHint')}</p>
          <div className="decision-choices" role="group" aria-label={t('decision')}>
            <button className="primary" disabled={saving} onClick={()=>choose('accepted')}><Check size={17} aria-hidden/>{actionWarnings.length?(locale==='zh'?'复核后接受':'Accept after review'):t('accept')}</button>
            <button className="secondary" disabled={saving} onClick={()=>choose('modified')}><Pencil size={15} aria-hidden/>{t('modify')}</button>
            <button className="secondary" disabled={saving} onClick={()=>choose('rejected')}><X size={15} aria-hidden/>{t('reject')}</button>
            <button className="secondary" disabled={saving} onClick={()=>choose('pending')}><CircleDashed size={15} aria-hidden/>{t('pending')}</button>
          </div>
        </>}
        {error&&<p role="alert" className="decision-error">{error}</p>}
      </article>
      <section className="must-grid" aria-label={t('mustKnow')}>{mustKnowLists.map(l=><MustList key={l.key} title={t(l.title)} icon={<l.icon size={16} aria-hidden/>} tone={l.tone} items={a[l.key]} locale={locale} t={t}/>)}</section>
      <details className="card why"><summary><span>{t('rationale')}</span><span className="count">{a.rationale.length+a.possibleImpacts.length}</span><ChevronDown size={16} aria-hidden/></summary>
        <p className="section-sub">{t('rationaleSub')}</p>
        <Claims claims={a.rationale} version={assessment.snapshotVersion} locale={locale} t={t}/>
        {a.possibleImpacts.length>0&&<><h3 className="mini-heading">{t('impacts')}</h3><Claims claims={a.possibleImpacts} version={assessment.snapshotVersion} locale={locale} t={t}/></>}
      </details>
    </div>
  </div>;
}
