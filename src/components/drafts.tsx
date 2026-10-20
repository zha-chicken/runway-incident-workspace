'use client';

import {useState} from 'react';
import {Building2, Check, Copy, FileText, Languages, Pencil, Radar, RotateCcw, UsersRound} from 'lucide-react';
import type {Locale, StoredAssessment} from '../domain/types';
import {audiences, type Audience, type Detail, type T} from './client';
import {AiMark, Citations, DraftMark, Empty, SimMark} from './ui';

const audienceIcons={operations:Radar,airportCoordination:Building2,passenger:UsersRound};

export function DraftsView({detail,current,displayed,locale,t,draftText,onEdit}:{detail:Detail;current?:StoredAssessment;displayed?:StoredAssessment;locale:Locale;t:T;draftText:(a:StoredAssessment,audience:Audience,lang?:Locale)=>string;onEdit:(a:StoredAssessment,audience:Audience,lang:Locale)=>void}) {
  const [view,setView]=useState<Audience|'all'>('operations'),[compare,setCompare]=useState(false);
  if(!displayed)return <Empty icon={<FileText size={28}/>} title={t('noDrafts')} body={t('noDraftsBody')}/>;
  const shown=view==='all'?audiences:[view];
  return <div className="stack">
    <div className="notice"><FileText size={17} aria-hidden/><span>{t('draftHint')} {t('draftPublish')}</span></div>
    {!current&&<div className="notice caution"><RotateCcw size={17} aria-hidden/>{t('stale')}</div>}
    <div className="draft-toolbar">
      <div className="segmented" role="group" aria-label={t('audience')}>
        {audiences.map(a=>{const Icon=audienceIcons[a];return <button key={a} aria-pressed={view===a} onClick={()=>setView(a)}><Icon size={14} aria-hidden/>{t(a)}</button>;})}
        <button aria-pressed={view==='all'} onClick={()=>setView('all')}>{t('allAudiences')}</button>
      </div>
      {view!=='all'&&<label className="switch"><input type="checkbox" checked={compare} onChange={e=>setCompare(e.target.checked)}/><span className="switch-track" aria-hidden/><Languages size={15} aria-hidden/>{t('compareLanguages')}</label>}
    </div>
    <div className={`draft-grid ${view==='all'?'three':''}`}>{shown.map(audience=>{
      const revisions=detail.drafts.filter(d=>d.assessment_id===displayed.id&&d.audience===audience),latest=revisions[0];
      const langs:Locale[]=compare&&view!=='all'?['en','zh']:[locale];
      const Icon=audienceIcons[audience];
      return <article key={audience} className={`draft-sheet ${audience}`}>
        <header className="draft-head">
          <div className="draft-title"><span className="draft-icon"><Icon size={17} aria-hidden/></span><div><span className="mini-label">{t('to')}</span><h2>{t(audience)}</h2></div></div>
          <div className="mark-row"><SimMark t={t} compact/><DraftMark t={t}/></div>
        </header>
        <p className="draft-purpose">{t(`purpose_${audience}`)}</p>
        {audience==='passenger'&&<p className="draft-warning">{t('passengerWarning')}</p>}
        <div className={`draft-langs ${langs.length>1?'two':''}`}>{langs.map(lang=>{
          const flag=latest&&latest.locale!==lang?'translation':latest?'edited':'original';
          return <div key={lang} className="draft-lang">
            <div className="draft-meta">
              {langs.length>1&&<span className="lang-label">{lang==='zh'?'中文':'English'}</span>}
              {flag==='translation'?<span className="tag caution">{t('needsTranslation')}</span>:flag==='edited'?<span className="tag good">{t('edited')} · {t('revision')} {latest!.revision}</span>:<AiMark t={t}/>}
            </div>
            <p className="draft-prose" lang={lang==='zh'?'zh-CN':'en'}>{draftText(displayed,audience,lang)}</p>
            <div className="draft-actions"><CopyButton text={draftText(displayed,audience,lang)} t={t}/><button className="secondary small" onClick={()=>onEdit(displayed,audience,lang)}><Pencil size={13} aria-hidden/>{t('edit')}</button></div>
          </div>;
        })}</div>
        <footer className="draft-foot"><span className="mini-label">{t('evidenceTrail')}</span><Citations ids={displayed.result.drafts[audience].evidenceIds} version={displayed.snapshotVersion} t={t}/></footer>
      </article>;
    })}</div>
  </div>;
}

function CopyButton({text,t}:{text:string;t:T}) {
  const [copied,setCopied]=useState(false);
  return <button className="secondary small" onClick={()=>{void navigator.clipboard?.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1800);});}}>{copied?<Check size={13} aria-hidden/>:<Copy size={13} aria-hidden/>}<span aria-live="polite">{copied?t('copied'):t('copy')}</span></button>;
}
