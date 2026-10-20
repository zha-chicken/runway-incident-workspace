'use client';

import {Fragment, useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import {ArrowRight, Check, CircleAlert, ClipboardCheck, FileText, Gauge, History, KeyRound, ListChecks, LoaderCircle, Menu, MessageSquare, Plane, Plus, RotateCcw, Search, ShieldCheck, SlidersHorizontal, X} from 'lucide-react';
import type {EvidenceBundle, IncidentInput, Locale, ReviewInput, StoredAssessment} from '../domain/types';
import {messages, errors} from './messages';
import {api, inputOf, latestReviews, pad, recommendationsOf, tabs, type Audience, type Bootstrap, type Detail, type DiscussionRow, type T, type Tab} from './client';
import {AiMark, BrandName, Constraints, DraftMark, Field, FormError, Inspect, Modal, RiskBadge, RiskLamp, SimMark} from './ui';
import {OverviewView} from './overview';
import {EvidenceView, SourceView} from './evidence';
import {AssessmentTab, AssessmentView} from './assessment';
import {DraftsView} from './drafts';
import {DiscussionView} from './discussion';
import {HistoryView} from './history';
import {IncidentEditor, ReviewForm} from './editor';

const icons={overview:ClipboardCheck,evidence:Search,assessment:ShieldCheck,drafts:FileText,discussion:MessageSquare,history:History};
/** The numbered path through an incident; the remaining tabs are tools. */
const stepTabs:Tab[]=['overview','evidence','assessment','drafts'];
type DraftEdit = {audience:Audience;text:string;revision:number;locale:Locale;assessmentId:string};
type Next = {key:'key'|'assess'|'stale'|'decide'|'done';tab:Tab;title:string;body:string;cta?:string;onCta?:()=>void;ctaDisabled?:boolean;alt?:{label:string;onClick?:()=>void;href?:string}};
const savedReviewer=()=>{try{return localStorage.getItem('runway-reviewer')||'Reviewer A';}catch{return 'Reviewer A';}};

export default function Workspace() {
  const [locale,setLocale]=useState<Locale>('en');
  useEffect(()=>{if(localStorage.getItem('runway-locale')==='zh')setLocale('zh');},[]);
  useEffect(()=>{document.documentElement.lang=locale==='zh'?'zh-CN':'en';localStorage.setItem('runway-locale',locale);},[locale]);
  return <NextIntlClientProvider locale={locale} timeZone="Asia/Shanghai" messages={messages[locale]}><WorkspaceContent locale={locale} setLocale={setLocale}/></NextIntlClientProvider>;
}

function WorkspaceContent({locale,setLocale}:{locale:Locale;setLocale:(l:Locale)=>void}) {
  const t=useTranslations() as T;
  const [boot,setBoot]=useState<Bootstrap|null>(null),[detail,setDetail]=useState<Detail|null>(null);
  const [selected,setSelected]=useState(''),[tab,setTab]=useState<Tab>('overview'),[error,setError]=useState('');
  const [editor,setEditor]=useState<IncidentInput|null>(null),[isNew,setIsNew]=useState(false),[busy,setBusy]=useState(false);
  const [generating,setGenerating]=useState<string|null>(null),[question,setQuestion]=useState(''),[source,setSource]=useState<{id:string;bundle:EvidenceBundle}|null>(null);
  const [review,setReview]=useState<{input:ReviewInput;text:string}|null>(null),[draftEdit,setDraftEdit]=useState<DraftEdit|null>(null);
  const [resetOpen,setResetOpen]=useState(false),[navOpen,setNavOpen]=useState(false);
  const selection=useRef(''),initialRequest=useRef<Promise<Bootstrap>|null>(null);
  const refreshBoot=useCallback(async()=>{const b=await api<Bootstrap>('workspace');setBoot(b);return b;},[]);
  const load=useCallback(async(id:string)=>{
    const d=await api<Detail>(`incidents/${id}`);
    if(selection.current===id)setDetail(d);
    return d;
  },[]);
  const choose=useCallback((id:string)=>{selection.current=id;sessionStorage.setItem('runway-selected',id);setSelected(id);setDetail(null);setError('');void load(id).catch(e=>setError(e.message));},[load]);
  useEffect(()=>{initialRequest.current??=refreshBoot();void initialRequest.current.then(b=>{const saved=sessionStorage.getItem('runway-selected');const id=b.incidents.find(i=>i.id===saved)?.id||b.incidents[0]?.id;if(id)choose(id);}).catch(e=>setError(e.message));},[choose,refreshBoot]);
  const running=detail?.runs.find(r=>r.status==='running');
  useEffect(()=>{
    if(!selected || !(generating||running))return;
    const timer=setInterval(()=>{void load(selected).catch(()=>{});},2500);
    return()=>clearInterval(timer);
  },[generating,running?.id,selected,load]);
  const work=async(fn:()=>Promise<void>)=>{setBusy(true);setError('');try{await fn();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const current=detail?.assessments.find(a=>a.id===detail.incident.current_assessment_id);
  const displayed=current || detail?.assessments[0];
  const airport=boot?.airports.find(a=>a.id===detail?.snapshot.airportId);
  const eventTitle=(sourceEventId:string|null,fallback:string)=>sourceEventId?boot?.events.find(e=>e.id===sourceEventId)?.title[locale]||fallback:fallback;
  const title=detail?eventTitle(detail.snapshot.sourceEventId,detail.snapshot.title):'';
  const refresh=async(id=selected)=>{await Promise.all([load(id),refreshBoot()]);};
  const aiBlocked=!!generating||!!running||!boot?.apiConfigured;
  async function generate(id=selected,version=detail?.snapshot.version,action:'generate'|'discuss'='generate') {
    if(!version)return;
    setGenerating(new Date().toISOString());setError('');
    if(action==='generate')setTab('assessment');
    try {
      await api(`incidents/${id}/${action}`,{expectedVersion:version,idempotencyKey:crypto.randomUUID(),...(action==='discuss'?{question}: {})});
      if(action==='discuss')setQuestion('');
    } catch(e) {setError((e as Error).message);}
    finally{setGenerating(null);await refresh(id).catch(()=>{});}
  }
  const inspectSource=useCallback(async(id:string,version?:number)=>{
    if(!detail)return;
    const v=version??detail.snapshot.version;
    try{const bundle=v===detail.snapshot.version?detail.evidence:await api<EvidenceBundle>(`incidents/${selected}/sources?version=${v}`);setSource({id,bundle});}
    catch(e){setError((e as Error).message);}
  },[detail,selected]);
  const describe=useCallback((id:string)=>{
    const record=detail?.evidence.records.find(r=>r.id===id);
    if(record?.category==='rule')return String(record.cells['规则主题']??'');
    return detail?.evidence.reportEvidence.find(r=>r.id===id)?.report.sourceLabel;
  },[detail]);
  const newIncident=()=>{
    setNavOpen(false);setIsNew(true);
    setEditor({title:t('untitled'),airportId:airport?.id || 'HAI',scenarioPeriod:locale==='zh'?'模拟第7天 14:00':'Simulation Day 7, 14:00',historicalThrough:null,businessImportance:'medium',knownInformation:'',unknowns:'',safetyIssue:false,sourceReliabilityUnknown:false,decisionRequest:'',officialStatus:'unconfirmed',officialStatusSourceId:null,reports:[],sourceEventId:null});
  };
  const editIncident=()=>{if(detail){setIsNew(false);setEditor(inputOf(detail.snapshot));}};
  const reviewAction=(assessment:StoredAssessment,recommendationId:string,disposition:ReviewInput['disposition']='pending')=>{
    const recommendation=recommendationsOf(assessment).find(r=>r.id===recommendationId);
    setReview({text:recommendation?.text[locale]||recommendationId,input:{assessmentId:assessment.id,recommendationId,disposition,reason:'',finalAction:'',outcome:'',outcomeStatus:'pending',nextImprovement:'',reviewerLabel:savedReviewer()}});
  };
  function draftText(a:StoredAssessment,audience:Audience,lang:Locale=locale) {
    return detail?.drafts.find(d=>d.assessment_id===a.id&&d.audience===audience&&d.locale===lang)?.text || a.result.drafts[audience].text[lang];
  }
  const editDraft=(a:StoredAssessment,audience:Audience,lang:Locale)=>{
    const latest=detail?.drafts.find(d=>d.assessment_id===a.id&&d.audience===audience);
    setDraftEdit({audience,locale:lang,assessmentId:a.id,text:draftText(a,audience,lang),revision:latest?.revision||0});
  };
  const applyProposal=(entry:DiscussionRow,index:number)=>void work(async()=>{
    if(!detail)return;
    const next=await api<{version:number}>(`incidents/${selected}/apply`,{discussionId:entry.id,index,expectedVersion:detail.snapshot.version});
    await refresh();await generate(selected,next.version);
  });
  const errorText=error?(errors[error]?.[locale]||`${t('error')} (${error})`):'';

  if(!boot)return <div className="startup"><span className="brand-mark large"><Plane size={26}/></span><h1><BrandName/></h1><p role="status">{error?(errors[error]?.[locale] || t('error')):t('loading')}</p>{error?<button className="secondary" onClick={()=>location.reload()}>{t('retry')}</button>:<LoaderCircle className="spin" size={20} aria-hidden/>}</div>;

  const reviewMap=displayed?latestReviews(detail?.reviews||[],displayed.id):new Map();
  const recommendationCount=displayed?recommendationsOf(displayed).length:0;
  const reviewedCount=[...reviewMap.values()].filter(r=>r.disposition!=='pending').length;
  const undecided=recommendationCount-reviewedCount;
  const startDeciding=()=>{setTab('assessment');setTimeout(()=>document.querySelector('.action-item.undecided')?.scrollIntoView({behavior:'smooth',block:'center'}),80);};
  // One recommended next action at a time keeps the page's single primary button meaningful.
  const next:Next|null=!detail?null:
    !displayed?(boot.apiConfigured
      ?{key:'assess',tab:'assessment',title:t('next_assess_title'),body:t('next_assess_body'),cta:t('generate'),onCta:()=>void generate(),ctaDisabled:aiBlocked,alt:{label:t('next_assess_alt'),onClick:()=>setTab('overview')}}
      :{key:'key',tab:'overview',title:t('next_key_title'),body:t('next_key_body')}):
    !current?{key:'stale',tab:'assessment',title:t('next_stale_title'),body:t('staleDetail',{version:displayed.snapshotVersion,current:detail.snapshot.version}),cta:t('reassess'),onCta:()=>void generate(),ctaDisabled:aiBlocked}:
    undecided>0?{key:'decide',tab:'assessment',title:t('next_decide_title'),body:t('next_decide_body',{remaining:undecided,total:recommendationCount}),cta:t('next_decide_cta'),onCta:startDeciding}:
    {key:'done',tab:'drafts',title:t('next_done_title'),body:t('next_done_body'),cta:t('next_done_cta'),onCta:()=>setTab('drafts'),alt:{label:t('export'),href:`/api/incidents/${selected}/export`}};
  const stepStatus:Record<Tab,string>=detail?{
    overview:t('reportCount',{count:detail.snapshot.reports.length}),
    evidence:t('monthCount',{count:detail.evidence.monthly.length}),
    assessment:current?t('decidedCount',{done:reviewedCount,total:recommendationCount}):displayed?t('outOfDate'):t('notRun'),
    drafts:displayed?t('draftCount',{count:3}):t('notRun'),
    discussion:t('threadCount',{count:detail.discussions.length}),
    history:t('reviewCount',{count:detail.reviews.length})
  }:{overview:'',evidence:'',assessment:'',drafts:'',discussion:'',history:''};
  const rail=<Rail boot={boot} t={t} selected={selected} eventTitle={eventTitle}
    onChoose={id=>{choose(id);setTab('overview');setNavOpen(false);}} onNew={newIncident} onReset={()=>{setNavOpen(false);setResetOpen(true);}}/>;

  return <FormError.Provider value={errorText}><Inspect.Provider value={{inspect:(id,v)=>void inspectSource(id,v),describe}}><div className="app-shell">
    <a className="skip-link" href="#main">{t('skip')}</a>
    <aside className="rail desktop-rail" aria-label={t('incidents')}>{rail}</aside>
    <div className="main-column">
      <div className="topline">
        <button className="icon-button menu-button" onClick={()=>setNavOpen(true)} aria-label={t('incidents')}><Menu size={20}/></button>
        <a href="/" className="mobile-brand"><span className="brand-mark"><Plane size={16}/></span><BrandName stacked/></a>
        <nav className="breadcrumb" aria-label={t('breadcrumb')}><span>{t('incidents')}</span>{detail&&<><span aria-hidden>/</span><span className="code">{detail.snapshot.airportId}</span><span aria-hidden>/</span><span className="breadcrumb-title">{title}</span></>}</nav>
        <div className="topline-right"><SimMark t={t} compact/><div className="language" role="group" aria-label={t('language')}><button aria-pressed={locale==='en'} onClick={()=>setLocale('en')} lang="en">EN</button><button aria-pressed={locale==='zh'} onClick={()=>setLocale('zh')} lang="zh-CN">中文</button></div></div>
      </div>
      <main id="main" className="main">
        {error&&<div className="notice error" role="alert"><CircleAlert size={17} aria-hidden/><span>{errorText}</span><button className="icon-button" onClick={()=>setError('')} aria-label={t('close')}><X size={16}/></button></div>}
        {!boot.apiConfigured&&<div className="notice"><CircleAlert size={17} aria-hidden/>{t('keyMissing')}</div>}
        {!detail?<div className="loading"><LoaderCircle className="spin" size={22}/>{t('loading')}</div>:<>
          <header className="incident-header">
            <div className="incident-heading">
              <div className="incident-title">
                <p className="eyebrow"><span className="airport-code">{detail.snapshot.airportId}</span>{airport?.name[locale]}<span className="dot" aria-hidden>·</span>{detail.snapshot.sourceEventId?`${t('suppliedEvent')} ${detail.snapshot.sourceEventId}`:t('teamScenario')}</p>
                <h1>{title}</h1>
                <p className="incident-sub"><span>{detail.snapshot.scenarioPeriod}</span><span className="dot" aria-hidden>·</span><span>{t('version')} {detail.snapshot.version}</span></p>
              </div>
              <div className="heading-actions"><button className="secondary" onClick={editIncident}><SlidersHorizontal size={15} aria-hidden/>{t('editIncident')}</button></div>
            </div>
          </header>
          {(generating||running)?<RunPanel t={t} since={running?.created_at||generating||new Date().toISOString()} onCancel={running?()=>void work(async()=>{await api(`runs/${running.id}/cancel`,{});await refresh();}):undefined}/>:next&&<NextStep next={next} t={t}/>}
          <dl className="glance" aria-label={t('glance')}>
            <div className="glance-cell"><dt>{t('glance_risk')}</dt><dd><RiskBadge level={current?current.result.riskLevel:detail.policy.riskLevel} t={t}/></dd><dd className="glance-note">{current?t('glance_risk_ai',{version:current.snapshotVersion}):displayed?t('glance_risk_stale'):t('glance_risk_rules')}</dd></div>
            <div className="glance-cell"><dt>{t('glance_who')}</dt><dd><strong>{detail.policy.constraints.reviewerRoles.map(r=>r[locale]).join(' · ')}</strong></dd><dd className={`glance-note ${detail.policy.constraints.actionConclusionsStopped?'danger':detail.policy.constraints.professionalDecisionRequired?'warn':''}`}>{detail.policy.constraints.actionConclusionsStopped?t('stopped'):detail.policy.constraints.professionalDecisionRequired?t('professional'):t('glance_who_note')}</dd></div>
            <div className="glance-cell"><dt>{t('glance_status')}</dt><dd><strong>{t(detail.snapshot.officialStatus)}</strong></dd><dd className={`glance-note ${detail.snapshot.officialStatus==='unconfirmed'?'warn':''}`}>{detail.snapshot.officialStatus==='unconfirmed'?t('glance_status_unconfirmed'):t('glance_status_set')}</dd></div>
            <div className="glance-cell"><dt>{t('glance_decisions')}</dt><dd><strong>{displayed?`${reviewedCount} / ${recommendationCount}`:'—'}</strong>{displayed&&<span className="mini-meter" aria-hidden><span style={{width:`${recommendationCount?reviewedCount/recommendationCount*100:0}%`}}/></span>}</dd><dd className="glance-note">{!displayed?t('awaitingAssessment'):reviewedCount===0?t('glance_decisions_none'):undecided>0?t('glance_decisions_some',{remaining:undecided}):t('glance_decisions_all')}</dd></div>
          </dl>
          <div className="stepper" role="tablist" aria-label={t('workflow')}>{tabs.map(key=>{const n=stepTabs.indexOf(key),Icon=icons[key],done=key==='assessment'&&!!current&&undecided===0,isNext=next?.tab===key&&tab!==key;return <Fragment key={key}>
            {key==='discussion'&&<span className="stepper-divider" aria-hidden/>}
            <button id={`tab-${key}`} aria-controls={`panel-${key}`} role="tab" aria-selected={tab===key} tabIndex={tab===key?0:-1} className={`step ${n<0?'tool':''} ${done?'done':''}`}
              onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(tabs.indexOf(key)+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[i]);document.getElementById(`tab-${tabs[i]}`)?.focus();}}}
              onClick={()=>setTab(key)}>
              <span className="step-marker" aria-hidden>{n<0?<Icon size={15}/>:done?<Check size={14}/>:n+1}</span>
              <span className="step-text"><span className="step-label">{t(`tab_${key}`)}</span><span className="step-status">{stepStatus[key]}</span></span>
              {isNext&&<span className="next-pill">{t('nextLabel')}</span>}
            </button>
          </Fragment>;})}</div>
          <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="tab-panel" tabIndex={-1}>
            {tab==='overview'&&<OverviewView detail={detail} t={t} locale={locale} onEdit={editIncident}/>}
            {tab==='evidence'&&<EvidenceView evidence={detail.evidence} historicalThrough={detail.snapshot.historicalThrough} locale={locale} t={t}/>}
            {tab==='assessment'&&<AssessmentTab detail={detail} current={current} displayed={displayed} locale={locale} t={t} reviews={reviewMap} onReview={reviewAction} onGenerate={()=>void generate()} aiBlocked={aiBlocked}/>}
            {tab==='drafts'&&<DraftsView detail={detail} current={current} displayed={displayed} locale={locale} t={t} draftText={draftText} onEdit={editDraft}/>}
            {tab==='discussion'&&<DiscussionView detail={detail} locale={locale} t={t} question={question} setQuestion={setQuestion} onSend={()=>void generate(selected,detail.snapshot.version,'discuss')} onApply={applyProposal} aiBlocked={aiBlocked} busy={busy}/>}
            {tab==='history'&&<HistoryView detail={detail} selected={selected} locale={locale} t={t} onReview={reviewAction}/>}
          </section>
          <footer className="main-footer"><span><ShieldCheck size={14} aria-hidden/>{t('simulationNote')}</span><span>{t('noSending')}</span></footer>
          {displayed&&<div className="print-report">
            <p className="print-flag">{t('simulation')} · {t('draft')} · {t('aiGenerated')}</p>
            <h1>{t('brand')} · {title}</h1>
            <p>{detail.snapshot.scenarioPeriod} · {t('version')} {displayed.snapshotVersion} · {t(`risk_${displayed.result.riskLevel}`)} · {t('official')}: {t(detail.snapshot.officialStatus)}</p>
            <p>{t('draftHint')}</p>{!current&&<p>{t('stale')}</p>}
            <Constraints policy={displayed.result.decisionConstraints} locale={locale} t={t}/>
            <AssessmentView assessment={displayed} locale={locale} t={t} print/>
            {(['operations','airportCoordination','passenger'] as const).map(a=><section key={a} className="print-draft"><h2>{t(a)} · {t('draft')}</h2><p className="draft-prose">{draftText(displayed,a)}</p><p className="print-refs">{displayed.result.drafts[a].evidenceIds.join(', ')}</p></section>)}
            <h2>{t('reviewLog')}</h2>{detail.reviews.map(r=><p key={r.id}>{r.reviewedAt} · {r.reviewerLabel} · {r.recommendationId} · {t(r.disposition)} · {r.reason} · {r.finalAction} · {r.outcome||t('pending')}</p>)}
            <p className="print-refs">{t('sourceHash')}: {detail.evidence.sourceHash}</p>
          </div>}
        </>}
      </main>
    </div>
    <Modal open={navOpen} onClose={()=>setNavOpen(false)} title={t('incidents')} t={t} drawer>{rail}</Modal>
    <Modal open={!!editor} onClose={()=>setEditor(null)} title={isNew?t('newIncident'):t('editIncident')} description={isNew?t('newIncidentHint'):t('editHint')} t={t} wide>{editor&&<IncidentEditor input={editor} setInput={setEditor} airports={boot.airports} locale={locale} t={t} busy={busy} onSave={()=>void work(async()=>{if(isNew){const created=await api<{id:string}>('incidents',editor);await refreshBoot();choose(created.id);setTab('overview');}else if(detail){await api(`incidents/${selected}`,{expectedVersion:detail.snapshot.version,input:editor});await refresh();}setEditor(null);})}/>}</Modal>
    <Modal open={!!source} onClose={()=>setSource(null)} title={t('original')} description={t('originalHint')} t={t} sheet>{source&&detail&&<SourceView id={source.id} evidence={source.bundle} locale={locale} t={t}/>}</Modal>
    <Modal open={!!review} onClose={()=>setReview(null)} title={t('decisionTitle')} description={t('reviewHint')} t={t}>{review&&<ReviewForm review={review.input} recommendation={review.text} setReview={input=>setReview({...review,input})} t={t} busy={busy} onSave={()=>void work(async()=>{await api(`incidents/${selected}/reviews`,review.input);try{localStorage.setItem('runway-reviewer',review.input.reviewerLabel);}catch{}setReview(null);await refresh();})}/>}</Modal>
    <Modal open={!!draftEdit} onClose={()=>setDraftEdit(null)} title={draftEdit?`${t(draftEdit.audience)} · ${draftEdit.locale==='zh'?'中文':'English'}`:t('drafts')} description={t('draftHint')} t={t} wide>{draftEdit&&<form className="form-stack" onSubmit={e=>{e.preventDefault();void work(async()=>{await api(`incidents/${selected}/drafts`,{assessmentId:draftEdit.assessmentId,audience:draftEdit.audience,locale:draftEdit.locale,text:draftEdit.text,expectedRevision:draftEdit.revision});setDraftEdit(null);await refresh();});}}>
      <div className="mark-row"><SimMark t={t}/><DraftMark t={t}/><AiMark t={t}/></div>
      <Field label={t('draftText')} hint={t('translationReview')}><textarea rows={14} required value={draftEdit.text} lang={draftEdit.locale==='zh'?'zh-CN':'en'} onChange={e=>setDraftEdit({...draftEdit,text:e.target.value})}/></Field>
      <div className="modal-actions"><button type="button" className="secondary" onClick={()=>setDraftEdit(null)}>{t('cancel')}</button><button className="primary" disabled={busy}>{busy?t('saving'):t('saveDraft')}</button></div>
    </form>}</Modal>
    <Modal open={resetOpen} onClose={()=>setResetOpen(false)} title={t('reset')} t={t}><p>{t('resetConfirm')}</p><div className="modal-actions"><button className="secondary" onClick={()=>setResetOpen(false)}>{t('cancel')}</button><button className="primary danger" disabled={busy} onClick={()=>void work(async()=>{await api('workspace/reset',{});const b=await refreshBoot();choose(b.incidents[0].id);setResetOpen(false);setTab('overview');})}><RotateCcw size={15} aria-hidden/>{t('confirmReset')}</button></div></Modal>
  </div></Inspect.Provider></FormError.Provider>;
}

function Rail({boot,t,selected,eventTitle,onChoose,onNew,onReset}:{boot:Bootstrap;t:T;selected:string;eventTitle:(id:string|null,fallback:string)=>string;onChoose:(id:string)=>void;onNew:()=>void;onReset:()=>void}) {
  const total=boot.budget.used+boot.budget.remaining,share=total>0?boot.budget.remaining/total:0;
  const list=useRef<HTMLElement>(null);
  useEffect(()=>{list.current?.querySelector('.active')?.scrollIntoView({block:'nearest'});},[selected,boot.incidents.length]);
  return <div className="rail-inner">
    <a href="/" className="brand"><span className="brand-mark"><Plane size={18}/></span><span><strong><BrandName/></strong><span>{t('tagline')}</span></span></a>
    <div className="rail-sim"><SimMark t={t} compact/><span>{t('simShort')}</span></div>
    <div className="rail-heading"><span>{t('incidents')}</span><span className="count">{pad(boot.incidents.length)}</span></div>
    <button className="rail-new" onClick={onNew}><Plus size={15} aria-hidden/>{t('newIncident')}</button>
    <nav className="incident-list" ref={list} aria-label={t('incidents')}>{boot.incidents.map(i=><button key={i.id} className={`incident-item ${i.id===selected?'active':''}`} onClick={()=>onChoose(i.id)} aria-current={i.id===selected?'page':undefined}>
      <span className="incident-code">{i.airportId}</span>
      <span className="incident-body"><strong>{eventTitle(i.sourceEventId,i.title)}</strong><span className="incident-meta"><RiskLamp level={i.riskLevel}/>{i.riskLevel?t(`risk_${i.riskLevel}`):t('unassessed')}<span aria-hidden>·</span>{t('versionShort')}{i.version}</span></span>
    </button>)}</nav>
    <div className="rail-footer">
      <div className="budget"><span className="budget-label"><Gauge size={14} aria-hidden/>{t('budget')}</span><strong>¥{Number(boot.budget.remaining ?? 0).toFixed(2)} <span>{t('remaining')}</span></strong>
        <span className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(share*100)} aria-label={t('budget')}><span style={{width:`${Math.max(0,Math.min(1,share))*100}%`}}/></span>
        <span className="budget-total">{t('budgetOf',{total:total.toFixed(2)})}</span></div>
      <button className="rail-link" onClick={onReset}><RotateCcw size={13} aria-hidden/>{t('reset')}</button>
    </div>
  </div>;
}

const nextIcons:Record<Next['key'],ReactNode>={key:<KeyRound size={20}/>,assess:<ShieldCheck size={20}/>,stale:<RotateCcw size={20}/>,decide:<ListChecks size={20}/>,done:<Check size={20}/>};
function NextStep({next,t}:{next:Next;t:T}) {
  return <section className={`next-step is-${next.key}`} aria-labelledby="next-step-title">
    <span className="next-icon" aria-hidden>{nextIcons[next.key]}</span>
    <div className="next-text"><span className="next-label">{t('nextLabel')}</span><h2 id="next-step-title">{next.title}</h2><p>{next.body}</p></div>
    {(next.cta||next.alt)&&<div className="next-actions">
      {next.alt&&(next.alt.href?<a className="text-button" href={next.alt.href}>{next.alt.label}</a>:<button className="text-button" onClick={next.alt.onClick}>{next.alt.label}</button>)}
      {next.cta&&<button className="primary large" disabled={next.ctaDisabled} onClick={next.onCta}>{next.cta}<ArrowRight size={16} aria-hidden/></button>}
    </div>}
  </section>;
}

function RunPanel({t,since,onCancel}:{t:T;since:string;onCancel?:()=>void}) {
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const seconds=Math.max(0,Math.floor((now-Date.parse(since))/1000));
  return <div className="run-panel" role="status"><span className="run-pulse" aria-hidden><span/></span><div><strong>{t('generating')}</strong><p>{t('generateHint')}</p></div><span className="run-elapsed" aria-label={t('elapsed')}>{Math.floor(seconds/60)}:{pad(seconds%60)}</span>{onCancel&&<button className="secondary small" onClick={onCancel}>{t('cancelRun')}</button>}</div>;
}

