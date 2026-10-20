'use client';

import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import {ArrowLeft, CircleAlert, Home, LoaderCircle, Menu, Plane, Plus, RotateCcw, X} from 'lucide-react';
import type {EvidenceBundle, IncidentInput, Locale, ReviewInput, StoredAssessment} from '../domain/types';
import {messages, errors} from './messages';
import {api, currentAssessment, inputOf, latestReviews, recommendationsOf, type Audience, type Bootstrap, type Detail, type DiscussionRow, type T, type Tab} from './client';
import {AeroContextMark, AiMark, BrandName, Constraints, DraftMark, Field, FormError, Inspect, Modal, RiskIcon} from './ui';
import {OverviewView} from './overview';
import {EvidenceView, SourceView} from './evidence';
import {AssessmentView} from './assessment';
import {AirportHub, AnalysisProgress, DecisionFlow, Preflight, WorkspaceHome} from './guided-workflow';
import {airportStage} from './workflow';
import {DraftsView} from './drafts';
import {DiscussionView} from './discussion';
import {HistoryView} from './history';
import {IncidentEditor, ReviewForm} from './editor';

type DraftEdit = {audience:Audience;text:string;revision:number;locale:Locale;assessmentId:string};
type LocalRequest = {since:string;action:'generate'|'discuss';question:string};
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
  const [selected,setSelected]=useState(''),[tab,setTab]=useState<Tab|null>(null),[error,setError]=useState('');
  const [editor,setEditor]=useState<IncidentInput|null>(null),[isNew,setIsNew]=useState(false),[busy,setBusy]=useState(false);
  const [requests,setRequests]=useState<Record<string,LocalRequest>>({}),[questions,setQuestions]=useState<Record<string,string>>({}),[source,setSource]=useState<{id:string;bundle:EvidenceBundle}|null>(null);
  const [requestErrors,setRequestErrors]=useState<Record<string,string>>({});
  const [review,setReview]=useState<{input:ReviewInput;text:string}|null>(null),[draftEdit,setDraftEdit]=useState<DraftEdit|null>(null);
  const [resetOpen,setResetOpen]=useState(false),[navOpen,setNavOpen]=useState(false);
  const selection=useRef(''),initialRequest=useRef<Promise<Bootstrap>|null>(null);
  const loadSequence=useRef<Record<string,number>>({});
  const inFlight=useRef(new Set<string>());
  const localRequest=requests[selected],question=questions[selected]||'';
  const setQuestion=(value:string)=>setQuestions(previous=>({...previous,[selected]:value}));
  const refreshBoot=useCallback(async()=>{const b=await api<Bootstrap>('workspace');setBoot(b);return b;},[]);
  const load=useCallback(async(id:string)=>{
    const sequence=(loadSequence.current[id]||0)+1;
    loadSequence.current[id]=sequence;
    const d=await api<Detail>(`incidents/${id}`);
    if(selection.current===id&&loadSequence.current[id]===sequence)setDetail(d);
    return d;
  },[]);
  const choose=useCallback((id:string)=>{selection.current=id;setSelected(id);setDetail(null);setTab(null);setError('');setNavOpen(false);window.scrollTo({top:0});void load(id).catch(e=>{if(selection.current===id)setError(e.message);});},[load]);
  const goHome=()=>{selection.current='';setSelected('');setDetail(null);setTab(null);setError('');setNavOpen(false);window.scrollTo({top:0});void refreshBoot().catch(e=>setError(e.message));};
  useEffect(()=>{initialRequest.current??=refreshBoot();void initialRequest.current.catch(e=>setError(e.message));},[refreshBoot]);
  const running=detail?.runs.find(r=>r.status==='running');
  useEffect(()=>{
    if(!selected || !(localRequest||running))return;
    const timer=setInterval(()=>{void load(selected).catch(()=>{});},2500);
    return()=>clearInterval(timer);
  },[localRequest,running?.id,selected,load]);
  const work=async(fn:()=>Promise<void>)=>{setBusy(true);setError('');try{await fn();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const current=detail?currentAssessment(detail):undefined;
  const displayed=current || detail?.assessments[0];
  const airport=boot?.airports.find(a=>a.id===detail?.snapshot.airportId);
  const eventTitle=(sourceEventId:string|null,fallback:string)=>sourceEventId?boot?.events.find(e=>e.id===sourceEventId)?.title[locale]||fallback:fallback;
  const title=detail?eventTitle(detail.snapshot.sourceEventId,detail.snapshot.title):'';
  const refresh=async(id=selected)=>{await Promise.all([load(id),refreshBoot()]);};
  const aiBlocked=!!localRequest||!!running||!boot?.apiConfigured;
  async function generate(id=selected,version=detail?.snapshot.version,action:'generate'|'discuss'='generate') {
    if(!version||inFlight.current.has(id)||(id===selected&&running))return;
    const since=new Date().toISOString(),asked=action==='discuss'?question:'';
    inFlight.current.add(id);
    setRequests(previous=>({...previous,[id]:{since,action,question:asked}}));setError('');
    setRequestErrors(previous=>({...previous,[id]:''}));
    if(action==='generate'&&selection.current===id)setTab(null);
    // A sent question moves into the thread at once; it returns to the box if the request fails.
    if(action==='discuss')setQuestions(previous=>({...previous,[id]:''}));
    try {
      await api(`incidents/${id}/${action}`,{expectedVersion:version,idempotencyKey:crypto.randomUUID(),...(action==='discuss'?{question:asked}: {})});
    } catch(e) {
      setRequestErrors(previous=>({...previous,[id]:(e as Error).message}));
      if(action==='discuss')setQuestions(previous=>({...previous,[id]:asked}));
    } finally {
      await refresh(id).catch(()=>{});
      inFlight.current.delete(id);
      setRequests(previous=>{const next={...previous};delete next[id];return next;});
    }
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
  const visibleError=error||requestErrors[selected];
  const errorText=visibleError?(errors[visibleError]?.[locale]||`${t('error')} (${visibleError})`):'';

  if(!boot)return <div className="startup"><span className="brand-mark large"><Plane size={26}/></span><h1><BrandName/></h1><p role="status">{error?(errors[error]?.[locale] || t('error')):t('loading')}</p>{error?<button className="secondary" onClick={()=>location.reload()}>{t('retry')}</button>:<LoaderCircle className="spin" size={20} aria-hidden/>}</div>;

  const reviewMap=current?latestReviews(detail?.reviews||[],current.id):new Map();
  const discussing=localRequest?.action==='discuss'?{question:localRequest.question,since:localRequest.since}:(running?.action==='discussion'?{question:null,since:running.created_at}:null);
  const cancelRun=running?()=>void work(async()=>{await api(`runs/${running.id}/cancel`,{});await refresh();}):undefined;
  const stage=airportStage(detail,localRequest?.action);
  const language=<div className="language" role="group" aria-label={t('language')}><button aria-pressed={locale==='en'} onClick={()=>setLocale('en')} lang="en">EN</button><button aria-pressed={locale==='zh'} onClick={()=>setLocale('zh')} lang="zh-CN">中文</button></div>;
  const rail=<Rail boot={boot} t={t} selected={selected} eventTitle={eventTitle} onChoose={choose} onHome={goHome} language={language}
    onNew={newIncident} onReset={()=>{setNavOpen(false);setResetOpen(true);}}/>;
  const openView=(next:Tab|null)=>{setTab(next);window.scrollTo({top:0});};

  return <FormError.Provider value={errorText}><Inspect.Provider value={{inspect:(id,v)=>void inspectSource(id,v),describe}}><div className={`app-shell guided-shell ${!selected?'home-shell':''}`}>
    <a className="skip-link" href="#main">{t('skip')}</a>
    {selected&&<aside className="rail desktop-rail" aria-label={t('incidents')}>{rail}</aside>}
    <div className="main-column">
      {!selected?<div className="home-language">{language}</div>:<div className="guided-mobile-top">
        <button className="icon-button" onClick={()=>setNavOpen(true)} aria-label={t('incidents')}><Menu size={20}/></button>
        <span className="mobile-airport"><Plane size={16}/>{detail?.snapshot.airportId||t('loading')}</span>{language}
      </div>}
      <main id="main" className={`main guided-main ${selected?`stage-${stage}`:''} ${stage==='ready'&&!tab?'showing-hub':''}`}>
        {visibleError&&<div className="notice error" role="alert"><CircleAlert size={17} aria-hidden/><span>{errorText}</span><button className="icon-button" onClick={()=>{setError('');setRequestErrors(previous=>({...previous,[selected]:''}));}} aria-label={t('close')}><X size={16}/></button></div>}
        {!selected?<WorkspaceHome boot={boot} locale={locale} t={t} active={Object.entries(requests).filter(([,request])=>request.action==='generate').map(([id])=>id)} onChoose={choose} onNew={newIncident}/>:
        !detail?<div className="loading"><LoaderCircle className="spin" size={22}/>{t('loading')}</div>:<>
          {stage==='analyzing'?<AnalysisProgress airport={detail.snapshot.airportId} since={running?.created_at||localRequest!.since} t={t} onCancel={cancelRun} busy={busy}/>:
          stage==='preflight'?<>
            {!boot.apiConfigured&&<div className="notice"><CircleAlert size={17}/>{t('next_key_body')}</div>}
            <Preflight detail={detail} title={title} locale={locale} t={t} blocked={aiBlocked} onStart={()=>void generate()} onEdit={editIncident}/>
          </>:!tab?<AirportHub t={t} onOpen={openView}/>:<>
            <header className="view-header"><button className="secondary back-airport" onClick={()=>openView(null)}><ArrowLeft size={16}/>{t('backToAirport',{airport:detail.snapshot.airportId})}</button>
              {tab!=='assessment'&&<h1>{t(`tab_${tab}`)}</h1>}
            </header>
            <section className="guided-view" key={`${selected}-${tab}`} aria-label={t(`tab_${tab}`)}>
              {tab==='overview'&&<><div className="situation-toolbar"><span>{title}</span><button className="secondary small" disabled={aiBlocked} onClick={()=>void generate()}><RotateCcw size={14}/>{t('startNewAnalysis')}</button></div><OverviewView detail={detail} t={t} locale={locale} onEdit={editIncident}/></>}
              {tab==='evidence'&&<EvidenceView evidence={detail.evidence} historicalThrough={detail.snapshot.historicalThrough} locale={locale} t={t}/>}
              {tab==='assessment'&&current&&<DecisionFlow key={current.id} assessment={current} reviews={reviewMap} locale={locale} t={t} reviewer={savedReviewer()} onExit={()=>openView(null)} onSave={async input=>{
                const id=selected;await api(`incidents/${id}/reviews`,input);try{localStorage.setItem('runway-reviewer',input.reviewerLabel);}catch{}await refresh(id).catch(e=>setError(e.message));
              }}/>}
              {tab==='drafts'&&<DraftsView detail={detail} current={current} displayed={displayed} locale={locale} t={t} draftText={draftText} onEdit={editDraft}/>}
              {tab==='discussion'&&<DiscussionView detail={detail} locale={locale} t={t} question={question} setQuestion={setQuestion} onSend={()=>void generate(selected,detail.snapshot.version,'discuss')} onApply={applyProposal} asking={discussing} onCancel={running?.action==='discussion'?cancelRun:undefined} aiBlocked={aiBlocked} busy={busy}/>}
              {tab==='history'&&<HistoryView detail={detail} selected={selected} locale={locale} t={t} onReview={reviewAction}/>}
            </section>
          </>}
          {displayed&&<div className="print-report">
            <p className="print-flag">{t('draft')} · {t('aiGenerated')}</p>
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
    <Modal open={!!editor} onClose={()=>setEditor(null)} title={isNew?t('newIncident'):t('editIncident')} description={isNew?t('newIncidentHint'):t('editHint')} t={t} wide>{editor&&<IncidentEditor input={editor} setInput={setEditor} airports={boot.airports} locale={locale} t={t} busy={busy} onSave={()=>void work(async()=>{if(isNew){const created=await api<{id:string}>('incidents',editor);await refreshBoot();choose(created.id);}else if(detail){await api(`incidents/${selected}`,{expectedVersion:detail.snapshot.version,input:editor});await refresh();}setEditor(null);})}/>}</Modal>
    <Modal open={!!source} onClose={()=>setSource(null)} title={t('original')} description={t('originalHint')} t={t} sheet>{source&&detail&&<SourceView id={source.id} evidence={source.bundle} locale={locale} t={t}/>}</Modal>
    <Modal open={!!review} onClose={()=>setReview(null)} title={t('decisionTitle')} description={t('reviewHint')} t={t}>{review&&<ReviewForm review={review.input} recommendation={review.text} setReview={input=>setReview({...review,input})} t={t} busy={busy} onSave={()=>void work(async()=>{await api(`incidents/${selected}/reviews`,review.input);try{localStorage.setItem('runway-reviewer',review.input.reviewerLabel);}catch{}setReview(null);await refresh();})}/>}</Modal>
    <Modal open={!!draftEdit} onClose={()=>setDraftEdit(null)} title={draftEdit?`${t(draftEdit.audience)} · ${draftEdit.locale==='zh'?'中文':'English'}`:t('drafts')} description={t('draftHint')} t={t} wide>{draftEdit&&<form className="form-stack" onSubmit={e=>{e.preventDefault();void work(async()=>{await api(`incidents/${selected}/drafts`,{assessmentId:draftEdit.assessmentId,audience:draftEdit.audience,locale:draftEdit.locale,text:draftEdit.text,expectedRevision:draftEdit.revision});setDraftEdit(null);await refresh();});}}>
      <div className="mark-row"><DraftMark t={t}/><AiMark t={t}/></div>
      <Field label={t('draftText')} hint={t('translationReview')}><textarea rows={14} required value={draftEdit.text} lang={draftEdit.locale==='zh'?'zh-CN':'en'} onChange={e=>setDraftEdit({...draftEdit,text:e.target.value})}/></Field>
      <div className="modal-actions"><button type="button" className="secondary" onClick={()=>setDraftEdit(null)}>{t('cancel')}</button><button className="primary" disabled={busy}>{busy?t('saving'):t('saveDraft')}</button></div>
    </form>}</Modal>
    <Modal open={resetOpen} onClose={()=>setResetOpen(false)} title={t('reset')} t={t}><p>{t('resetConfirm')}</p><div className="modal-actions"><button className="secondary" onClick={()=>setResetOpen(false)}>{t('cancel')}</button><button className="primary danger" disabled={busy} onClick={()=>void work(async()=>{await api('workspace/reset',{});await refreshBoot();goHome();setResetOpen(false);})}><RotateCcw size={15} aria-hidden/>{t('confirmReset')}</button></div></Modal>
  </div></Inspect.Provider></FormError.Provider>;
}

function Rail({boot,t,selected,eventTitle,onChoose,onHome,onNew,onReset,language}:{boot:Bootstrap;t:T;selected:string;eventTitle:(id:string|null,fallback:string)=>string;onChoose:(id:string)=>void;onHome:()=>void;onNew:()=>void;onReset:()=>void;language:ReactNode}) {
  return <div className="rail-inner guided-rail">
    <button className="brand guided-brand" onClick={onHome}><AeroContextMark size={28}/><strong>AeroContext</strong></button>
    <button className="rail-workspace" onClick={onHome}><Home size={18}/>{t('workspace')}</button>
    <nav className="incident-list" aria-label={t('incidents')}>{boot.incidents.map(i=><button key={i.id} className={`airport-nav ${i.id===selected?'active':''}`} onClick={()=>onChoose(i.id)} aria-current={i.id===selected?'page':undefined} title={eventTitle(i.sourceEventId,i.title)}>
      <Plane size={18} strokeWidth={1.5} aria-hidden/><span>{i.airportId}</span><RiskIcon level={i.riskLevel} size={12}/>
      {boot.incidents.filter(other=>other.airportId===i.airportId).length>1&&<small>{eventTitle(i.sourceEventId,i.title)}</small>}
    </button>)}</nav>
    <div className="rail-footer">
      <div className="rail-language">{language}</div>
      <button className="rail-link" onClick={onNew}><Plus size={15}/>{t('newIncident')}</button>
      <button className="rail-link" onClick={onReset}><RotateCcw size={13}/>{t('reset')}</button>
    </div>
  </div>;
}
