'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowRight, Check, ChevronDown, FileText, LoaderCircle, MessageSquare, Paperclip, Pencil, Plane, Play, Plus, Scale, Sparkles, Upload, X} from 'lucide-react';
import type {Locale, ReviewInput, StoredAssessment} from '../domain/types';
import {recommendationsOf, tabs, type Bootstrap, type Detail, type Review, type T, type Tab} from './client';
import {AeroContextMark, Citations, Constraints, Elapsed, Field, RiskBadge} from './ui';
import {EvidenceView} from './evidence';
import {nextDecision} from './workflow';

const hubIcons = {overview:FileText, evidence:Paperclip, assessment:Scale, drafts:MessageSquare, discussion:Sparkles, history:Upload};

export function WorkspaceHome({boot, locale, t, active, onChoose, onNew}: {
  boot:Bootstrap; locale:Locale; t:T; active:string[]; onChoose:(id:string)=>void; onNew:()=>void;
}) {
  return <div className="workspace-home">
    <div className="home-brand"><AeroContextMark size={30}/><strong>AeroContext</strong></div>
    <header className="home-heading"><div><h1>{t('yourWorkspace')}</h1><p>{t('chooseAirport')}</p></div><button className="secondary" onClick={onNew}><Plus size={16}/>{t('newIncident')}</button></header>
    <div className="airport-grid">{boot.incidents.map(incident => {
      const airport=boot.airports.find(a=>a.id===incident.airportId);
      const title=boot.events.find(e=>e.id===incident.sourceEventId)?.title[locale]||incident.title;
      return <button className="airport-tile" key={incident.id} onClick={()=>onChoose(incident.id)}>
        <span className="airport-tile-top"><Plane size={23} strokeWidth={1.5}/><ArrowRight size={18} className="airport-enter"/></span>
        <strong className="airport-tile-code">{incident.airportId}</strong>
        <span className="airport-tile-name">{airport?.name[locale]}</span>
        <span className="airport-tile-incident">{title}</span>
        <span className="airport-tile-status">{active.includes(incident.id)?<span className="analyzing-label"><LoaderCircle size={14} className="spin"/>{t('analysisInProgress')}</span>:<RiskBadge level={incident.riskLevel} t={t}/>}</span>
      </button>;
    })}</div>
    {!boot.incidents.length&&<button className="secondary" onClick={onNew}><Plus size={16}/>{t('newIncident')}</button>}
  </div>;
}

export function AirportHub({t, onOpen}: {t:T; onOpen:(tab:Tab)=>void}) {
  return <nav className="airport-hub" aria-label={t('airportMenu')}>{tabs.map(tab=>{
    const Icon=hubIcons[tab];
    return <button key={tab} className={`hub-tile ${tab==='assessment'?'decision-tile':''}`} onClick={()=>onOpen(tab)}>
      <Icon size={34} strokeWidth={1.35} aria-hidden/><span>{t(`tab_${tab}`)}</span>
    </button>;
  })}</nav>;
}

export function Preflight({detail, title, t, locale, blocked, onStart, onEdit}: {
  detail:Detail; title:string; t:T; locale:Locale; blocked:boolean; onStart:()=>void; onEdit:()=>void;
}) {
  return <div className="preflight">
    <button className="primary start-analysis" onClick={onStart} disabled={blocked}><Play size={17} fill="currentColor" aria-hidden/>{t('startAnalysis')}</button>
    <article className="card preflight-situation">
      <h1><FileText size={22} strokeWidth={1.5} aria-hidden/>{t('tab_overview')}</h1>
      <p className="preflight-title">{title}</p>
      <p className="preflight-prose">{detail.snapshot.knownInformation||t('notApplicable')}</p>
      <details className="preflight-more"><summary>{t('situationDetails')}<ChevronDown size={15}/></summary>
        <div className="stack"><p className="muted">{detail.snapshot.scenarioPeriod}</p><div><h3>{t('notKnown')}</h3><p>{detail.snapshot.unknowns||t('notApplicable')}</p></div>
          {detail.snapshot.decisionRequest&&<div><h3>{t('decisionRequest')}</h3><p>{detail.snapshot.decisionRequest}</p></div>}
          <button className="secondary small" onClick={onEdit}><Pencil size={14}/>{t('editIncident')}</button>
        </div>
      </details>
    </article>
    <article className="card preflight-evidence">
      <h2><Paperclip size={22} strokeWidth={1.5} aria-hidden/>{t('tab_evidence')}</h2>
      <div className="preflight-sources">{detail.snapshot.reports.map(report=><div className="preflight-source" key={report.id}>
        <FileText size={17} aria-hidden/><div><strong>{report.sourceLabel}</strong><Citations ids={[`REPORT:${report.id}`]} t={t}/></div>
      </div>)}</div>
      {!detail.snapshot.reports.length&&<p className="muted">{t('noReports')}</p>}
      <details className="preflight-more"><summary><span>{t('historicalEvidence')}</span><ChevronDown size={15}/></summary>
        <EvidenceView evidence={detail.evidence} historicalThrough={detail.snapshot.historicalThrough} locale={locale} t={t}/>
      </details>
    </article>
  </div>;
}

export function AnalysisProgress({airport, since, t, onCancel, busy}: {airport:string; since:string; t:T; onCancel?:()=>void; busy:boolean}) {
  return <section className="analysis-focus" aria-labelledby="analysis-title" aria-busy="true">
    <LoaderCircle className="analysis-spinner spin" size={100} strokeWidth={1.5} aria-hidden/>
    <h1 id="analysis-title" role="status">{t('analyzingAirport',{airport})}</h1>
    <Elapsed since={since} label={t('elapsed')} className="analysis-clock"/>
    {onCancel&&<button className="text-button cancel-analysis" disabled={busy} onClick={onCancel}>{t('cancelRun')}</button>}
  </section>;
}

export function DecisionFlow({assessment, reviews, locale, t, reviewer, onSave, onExit}: {
  assessment:StoredAssessment; reviews:Map<string,Review>; locale:Locale; t:T; reviewer:string; onSave:(input:ReviewInput)=>Promise<void>; onExit:()=>void;
}) {
  const actions=recommendationsOf(assessment);
  const [index,setIndex]=useState(()=>Math.max(0,nextDecision(assessment,reviews)));
  const [choice,setChoice]=useState<'modified'|'rejected'|null>(null);
  const [reason,setReason]=useState(''),[finalAction,setFinalAction]=useState(''),[alias,setAlias]=useState(reviewer);
  const [saving,setSaving]=useState(false),[error,setError]=useState('');
  const mounted=useRef(true),savingRef=useRef(false),heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const action=actions[index],review=reviews.get(action.id);
  const move=(to:number)=>{setIndex(to);setChoice(null);setReason('');setFinalAction('');setError('');};
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[index]);
  async function save(disposition:'accepted'|'modified'|'rejected') {
    if(savingRef.current||!alias.trim()||(disposition!=='accepted'&&!reason.trim()))return;
    savingRef.current=true;setSaving(true);setError('');
    const input:ReviewInput={assessmentId:assessment.id,recommendationId:action.id,disposition,reason:disposition==='accepted'?'':reason.trim(),finalAction:disposition==='modified'?finalAction.trim():'',outcome:'',outcomeStatus:'pending',nextImprovement:'',reviewerLabel:alias.trim()};
    try {
      await onSave(input);
      if(!mounted.current)return;
      const updated=new Map(reviews);updated.set(action.id,{...input,id:'saved',reviewedAt:new Date().toISOString()});
      const next=nextDecision(assessment,updated);
      if(next<0)onExit();else move(next);
    } catch {if(mounted.current)setError(t('decisionSaveFailed'));}
    finally {savingRef.current=false;if(mounted.current)setSaving(false);}
  }
  return <section className="decision-flow">
    <p className="decision-position">{t('decisionPosition',{current:index+1,total:actions.length})}</p>
    <article className="decision-card">
      <div className="decision-card-heading"><h1 ref={heading} tabIndex={-1}>{t(`kind_${action.kind}`)}</h1>{review&&review.disposition!=='pending'&&<span className="tag">{t(review.disposition)}</span>}</div>
      <p className="decision-prose">{action.text[locale]}</p>
      <details className="decision-support"><summary><Paperclip size={16}/>{t('supportingEvidence')}</summary>
        <Citations ids={[...action.evidenceIds,...action.ruleIds]} version={assessment.snapshotVersion} t={t}/>
        <Constraints policy={assessment.result.decisionConstraints} locale={locale} t={t}/>
        <h2>{t('rationale')}</h2><ul className="plain-list">{assessment.result.rationale.map((claim,i)=><li key={i}><span className="tag">{t(claim.kind)}</span> {claim.text[locale]}<Citations ids={claim.evidenceIds} version={assessment.snapshotVersion} t={t}/></li>)}</ul>
        <h2>{t('onlyPerson')}</h2><ul className="plain-list">{assessment.result.humanDecisions.map((item,i)=><li key={i}>{item[locale]}</li>)}</ul>
      </details>
      {choice?<form className="decision-edit form-stack" onSubmit={e=>{e.preventDefault();void save(choice);}}>
        <Field label={t('reason')}><textarea autoFocus required rows={2} maxLength={4000} value={reason} onChange={e=>setReason(e.target.value)}/></Field>
        {choice==='modified'&&<Field label={t('modifiedAction')}><textarea rows={2} maxLength={4000} value={finalAction} onChange={e=>setFinalAction(e.target.value)}/></Field>}
        <Field label={t('reviewer')}><input required maxLength={80} value={alias} onChange={e=>setAlias(e.target.value)}/></Field>
        <div className="button-row"><button className="secondary" type="button" disabled={saving} onClick={()=>setChoice(null)}>{t('cancel')}</button><button className="primary" disabled={saving}>{saving?t('saving'):t('saveAndContinue')}<ArrowRight size={15}/></button></div>
      </form>:<>
        <div className="decision-choices">
          <button className="decision-accept" disabled={saving||!alias.trim()} onClick={()=>void save('accepted')}><Check size={17}/>{saving?t('saving'):t('accept')}</button>
          <button className="secondary" disabled={saving} onClick={()=>setChoice('modified')}><Pencil size={15}/>{t('modify')}</button>
          <button className="decision-reject" disabled={saving} onClick={()=>setChoice('rejected')}><X size={17}/>{t('reject')}</button>
        </div>
        <details className="reviewer-choice"><summary>{t('reviewingAs',{reviewer:alias})}</summary><Field label={t('reviewer')}><input maxLength={80} value={alias} onChange={e=>setAlias(e.target.value)}/></Field></details>
      </>}
      {error&&<p role="alert" className="decision-error">{error}</p>}
    </article>
    <nav className="decision-progress" aria-label={t('decisionProgress')}>{actions.map((item,i)=>{
      const done=reviews.get(item.id)?.disposition&&reviews.get(item.id)?.disposition!=='pending';
      return <button key={item.id} className={`${i===index?'current':''} ${done?'complete':''}`} disabled={saving} aria-current={i===index?'step':undefined} aria-label={`${t('decisionPosition',{current:i+1,total:actions.length})}${done?` · ${t('saved')}`:''}`} onClick={()=>move(i)}>{done?<Check size={14}/>:i+1}</button>;
    })}</nav>
  </section>;
}
