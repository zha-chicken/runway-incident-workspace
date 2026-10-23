'use client';

import {Check, Lock, Plus, Trash2} from 'lucide-react';
import type {Dataset, IncidentInput, Locale, Report, ReviewInput} from '../domain/types';
import type {T} from './client';
import {Field} from './ui';

export function IncidentEditor({input,setInput,airports,locale,t,busy,onSave}:{input:IncidentInput;setInput:(i:IncidentInput)=>void;airports:Dataset['airports'];locale:Locale;t:T;busy:boolean;onSave:()=>void}) {
  const patch=(value:Partial<IncidentInput>)=>setInput({...input,...value});
  const reportPatch=(index:number,value:Partial<Report>)=>patch({reports:input.reports.map((r,i)=>i===index?{...r,...value}:r)});
  return <form className="form-stack editor" onSubmit={e=>{e.preventDefault();onSave();}}>
    <fieldset className="form-section"><legend>{t('sectionScenario')}</legend>
      <Field label={t('title')}><input value={input.title} required maxLength={140} onChange={e=>patch({title:e.target.value,sourceEventId:null})}/></Field>
      <div className="form-grid">
        <Field label={t('airport')} hint={t('airportChangeHint')}><select value={input.airportId} onChange={e=>patch({airportId:e.target.value,sourceEventId:null,reports:[],officialStatus:'unconfirmed',officialStatusSourceId:null})}>{airports.map(a=><option key={a.id} value={a.id}>{a.id} · {a.name[locale]}</option>)}</select></Field>
        <Field label={t('period')}><input value={input.scenarioPeriod} required onChange={e=>patch({scenarioPeriod:e.target.value})}/></Field>
        <Field label={t('importance')}><select value={input.businessImportance} onChange={e=>patch({businessImportance:e.target.value as IncidentInput['businessImportance']})}>{['low','medium','high'].map(v=><option key={v} value={v}>{t(v)}</option>)}</select></Field>
        <Field label={t('historicalThrough')} hint={t('historicalHelp')}><input type="month" min="2024-01" max="2025-12" value={input.historicalThrough||''} onChange={e=>patch({historicalThrough:e.target.value||null})}/></Field>
      </div>
    </fieldset>
    <fieldset className="form-section"><legend>{t('sectionSituation')}</legend>
      <Field label={t('known')}><textarea rows={3} maxLength={6000} value={input.knownInformation} onChange={e=>patch({knownInformation:e.target.value})}/></Field>
      <Field label={t('unknowns')}><textarea rows={3} maxLength={6000} value={input.unknowns} onChange={e=>patch({unknowns:e.target.value})}/></Field>
    </fieldset>
    <fieldset className="form-section"><legend>{t('reports')}</legend>
      <p className="field-hint">{t('reportsEditorHint')}</p>
      {input.reports.map((r,index)=>r.provenanceKind==='competition'?<div className="edit-report locked" key={r.id}>
        <div className="edit-report-head"><strong>{r.sourceLabel}</strong><span className="tag outline"><Lock size={11} aria-hidden/>{t('competitionReport')}</span></div>
        <p>{r.text}</p><p className="field-hint">{t('immutableHint')}</p>
      </div>:<div className="edit-report" key={r.id} role="group" aria-label={`${t('source')} ${index+1}`}>
        <div className="edit-report-head"><strong>{t('source')} {index+1}</strong><span className="code muted">{r.id.slice(0,8)}</span><button type="button" className="text-button danger" onClick={()=>patch({reports:input.reports.filter((_,i)=>i!==index)})}><Trash2 size={13} aria-hidden/>{t('remove')}</button></div>
        <Field label={t('reportText')}><textarea required rows={3} value={r.text} onChange={e=>reportPatch(index,{text:e.target.value})}/></Field>
        <div className="form-grid">
          {(['sourceLabel','applicablePeriod','reportedAt','originReportId','independenceGroup','verificationBasis'] as const).map(key=><Field key={key} label={t(({sourceLabel:'sourceLabel',applicablePeriod:'reportScope',reportedAt:'reportedAt',originReportId:'originId',independenceGroup:'independence',verificationBasis:'verification'})[key])}><input required={['sourceLabel','applicablePeriod'].includes(key)} value={r[key]||''} onChange={e=>reportPatch(index,{[key]:e.target.value||(['sourceLabel','applicablePeriod'].includes(key)?'':null)})}/></Field>)}
          <Field label={t('reliability')}><select value={r.reliability} onChange={e=>reportPatch(index,{reliability:e.target.value as Report['reliability']})}>{['unverified','human_verified','conflicted','unusable'].map(v=><option key={v} value={v}>{t(v)}</option>)}</select></Field>
          <Field label={t('signal')}><select value={r.signal} onChange={e=>reportPatch(index,{signal:e.target.value as Report['signal']})}>{['context','stable','weather','operations','capacity','conflict'].map(v=><option key={v} value={v}>{t(`signal_${v}`)}</option>)}</select></Field>
        </div>
        <label className="checkbox"><input type="checkbox" checked={r.expandingImpact} onChange={e=>reportPatch(index,{expandingImpact:e.target.checked})}/>{t('expanding')}</label>
      </div>)}
      <button type="button" className="secondary add-report" onClick={()=>patch({reports:[...input.reports,{id:crypto.randomUUID(),text:'',sourceLabel:'Team simulated report',originReportId:null,reportedAt:null,applicablePeriod:input.scenarioPeriod,reliability:'unverified',independenceGroup:null,verificationBasis:null,signal:'context',expandingImpact:false,provenanceKind:'team_simulation',sourceEvidenceId:null}]})}><Plus size={15} aria-hidden/>{t('addReport')}</button>
    </fieldset>
    <fieldset className="form-section"><legend>{t('sectionDecision')}</legend>
      <Field label={t('decisionRequest')} hint={t('decisionRequestHint')}><input value={input.decisionRequest} maxLength={2000} onChange={e=>patch({decisionRequest:e.target.value})}/></Field>
      <label className="checkbox"><input type="checkbox" checked={input.safetyIssue} onChange={e=>patch({safetyIssue:e.target.checked})}/>{t('safetyIssue')}</label>
      <label className="checkbox"><input type="checkbox" checked={input.sourceReliabilityUnknown} onChange={e=>patch({sourceReliabilityUnknown:e.target.checked})}/>{t('sourceUnknown')}</label>
      <div className="form-grid">
        <Field label={t('official')} hint={t('officialHint')}><select value={input.officialStatus} onChange={e=>patch({officialStatus:e.target.value as IncidentInput['officialStatus']})}>{['unconfirmed','normal','delayed','cancelled'].map(v=><option value={v} key={v}>{t(v)}</option>)}</select></Field>
        {input.officialStatus!=='unconfirmed'&&<Field label={t('officialSource')}><select required value={input.officialStatusSourceId||''} onChange={e=>patch({officialStatusSourceId:e.target.value||null})}><option value="">{t('notApplicable')}</option>{input.reports.filter(r=>r.reliability==='human_verified'&&r.reportedAt&&r.verificationBasis).map(r=><option key={r.id} value={r.id}>{r.sourceLabel}</option>)}</select></Field>}
      </div>
    </fieldset>
    <div className="modal-actions sticky"><span className="help">{t('versionNote')}</span><button className="primary" disabled={busy}>{busy?t('saving'):t('save')}<Check size={15} aria-hidden/></button></div>
  </form>;
}

const dispositions=['accepted','modified','rejected','pending'] as const;
export function ReviewForm({review,recommendation,setReview,t,busy,onSave,mode='decision',submitLabel,onCancel}:{review:ReviewInput;recommendation:string;setReview:(r:ReviewInput)=>void;t:T;busy:boolean;onSave:()=>void;mode?:'decision'|'outcome';submitLabel?:string;onCancel?:()=>void}) {
  const needsReason=['modified','rejected'].includes(review.disposition);
  return <form className="form-stack" onSubmit={e=>{e.preventDefault();if(!busy)onSave();}}>
    <p className="mini-label">{t(mode==='decision'?'feedbackStageOne':'feedbackStageTwo')}</p>
    <p className="field-hint">{t(mode==='decision'?'decisionOnlyHint':'outcomeLaterHint')}</p>
    {recommendation&&<div className="review-target"><span className="mini-label">{t('recommendation')}</span><blockquote>{recommendation}</blockquote></div>}
    <fieldset disabled={busy} className="feedback-fields form-stack">
      {mode==='decision'?<>
        <fieldset className="disposition"><legend className="field-label">{t('decision')}</legend>
          <div className="disposition-options">{dispositions.map(v=><label key={v} className={`disposition-option ${v}`}><input type="radio" name="disposition" value={v} checked={review.disposition===v} onChange={()=>setReview({...review,disposition:v})}/><span>{t(v)}</span></label>)}</div>
        </fieldset>
        <Field label={needsReason?t('reason'):t('reasonOptional')} hint={needsReason?t('reasonRequired'):undefined}><textarea rows={2} maxLength={4000} value={review.reason} required={needsReason} onChange={e=>setReview({...review,reason:e.target.value})}/></Field>
        {(review.disposition==='modified'||!!review.revisedRecommendation)&&<Field label={t('modifiedAction')} hint={t('proposalOnlyHint')}><textarea rows={2} maxLength={4000} value={review.revisedRecommendation??''} onChange={e=>setReview({...review,revisedRecommendation:e.target.value})}/></Field>}
      </>:<>
        <p className="review-chip">{t('decision')}: {t(review.disposition)}</p>
        {review.revisedRecommendation&&<div className="read-field"><h3>{t('modifiedAction')}</h3><p>{review.revisedRecommendation}</p></div>}
        <Field label={t('finalAction')} hint={t('actualActionHint')}><textarea rows={3} maxLength={4000} value={review.finalAction} onChange={e=>setReview({...review,finalAction:e.target.value})}/></Field>
        {review.revisedRecommendation===undefined&&review.disposition==='modified'&&review.finalAction&&<p className="field-hint">{t('legacyActionHint')}</p>}
        <Field label={t('outcomeStatus')}><select value={review.outcomeStatus} onChange={e=>setReview({...review,outcomeStatus:e.target.value as ReviewInput['outcomeStatus']})}><option value="pending">{t('pending')}</option><option value="simulated_observed">{t('simulated_observed')}</option></select></Field>
        <Field label={t('outcome')} hint={t('outcomeHint')}><textarea rows={3} maxLength={4000} required={review.outcomeStatus==='simulated_observed'} value={review.outcome} onChange={e=>setReview({...review,outcome:e.target.value})}/></Field>
        <Field label={t('improvement')}><textarea rows={2} maxLength={4000} value={review.nextImprovement} onChange={e=>setReview({...review,nextImprovement:e.target.value})}/></Field>
      </>}
      <Field label={t('reviewer')}><input value={review.reviewerLabel} required maxLength={80} onChange={e=>setReview({...review,reviewerLabel:e.target.value})}/></Field>
    </fieldset>
    <div className="modal-actions"><span className="help">{t('reviewRecorded')}</span>{onCancel&&<button type="button" className="secondary" disabled={busy} onClick={onCancel}>{t('cancel')}</button>}<button className="primary" disabled={busy}>{busy?t('saving'):submitLabel||t(mode==='decision'?'saveReview':'saveOutcome')}</button></div>
  </form>;
}
