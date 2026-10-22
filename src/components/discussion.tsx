'use client';

import {ValidationNotice} from './validation-notice';

import {useEffect, useRef} from 'react';
import {ArrowRight, Check, ChevronDown, CircleDashed, LoaderCircle} from 'lucide-react';
import type {Locale} from '../domain/types';
import {inputAtSnapshot, time, type Detail, type DiscussionRow, type T} from './client';
import {AeroContextMark, AiMark, Citations, Constraints, Elapsed} from './ui';
import {DiscussionAnswer} from './discussion-answer';

/** A question in flight: known locally after sending, or only as a running run after a reload. */
export type Asking = {question:string|null;since:string};

export function DiscussionView({detail,locale,t,question,setQuestion,onSend,onApply,onCancel,asking,aiBlocked,busy}:{detail:Detail;locale:Locale;t:T;question:string;setQuestion:(q:string)=>void;onSend:()=>void;onApply:(entry:DiscussionRow,index:number)=>void;onCancel?:()=>void;asking:Asking|null;aiBlocked:boolean;busy:boolean}) {
  const entries=[...detail.discussions].reverse();
  const versionOf=(snapshotId:string)=>detail.history.find(s=>s.id===snapshotId)?.version;
  const suggestions=[t('suggestWhy'),t('suggestVerify'),t('suggestChange')];
  const thread=useRef<HTMLOListElement>(null),seen=useRef(entries.length);
  // Keep the newest activity in view: the pending question when sent, the answer when it arrives.
  useEffect(()=>{if(asking)thread.current?.querySelector('.exchange.pending')?.scrollIntoView({behavior:'smooth',block:'center'});},[asking]);
  useEffect(()=>{
    if(entries.length>seen.current)thread.current?.querySelector('.exchange:last-of-type .msg.ai')?.scrollIntoView({behavior:'smooth',block:'start'});
    seen.current=entries.length;
  },[entries.length]);
  return <div className="discussion">
    <ol className="thread" ref={thread}>{entries.map(entry=>{const v=versionOf(entry.snapshot_id),r=entry.response;return <li key={entry.id} className="exchange">
      <div className="msg user">
        <span className="msg-meta">{t('you')}<span className="dot" aria-hidden>·</span>{time(entry.created_at,locale)}{v&&<><span className="dot" aria-hidden>·</span>{t('version')} {v}</>}</span>
        <p>{entry.question}</p>
      </div>
      <div className="msg ai">
        <span className="msg-meta"><span className="ai-avatar" aria-hidden><AeroContextMark/></span>{t('assistant')}<AiMark t={t}/></span>
        <div className="msg-body">
          <ValidationNotice validation={entry.validation} locale={locale}/>
          <DiscussionAnswer text={r.answer[locale]} evidenceIds={r.evidenceIds} version={v} t={t}/>
          <Constraints policy={r.decisionConstraints} input={inputAtSnapshot(detail,entry.snapshot_id)} request={entry.question} locale={locale} t={t}/>
          <Citations ids={r.evidenceIds} version={v} t={t}/>
          {r.proposedFacts.length>0&&<details className="proposals">
            <summary><CircleDashed size={14} aria-hidden/><span>{t('proposals')}</span><span className="count">{r.proposedFacts.length}</span><ChevronDown size={14} className="proposal-chevron" aria-hidden/></summary>
            <p className="proposal-hint">{t('proposalHint')}</p>
            {r.proposedFacts.map((fact,index)=>{const outdated=entry.snapshot_id!==detail.snapshot.id&&!entry.applied_snapshot_id;return <div key={index} className="proposal">
              <div className="proposal-copy">
                <div className="proposal-meta"><span className="tag caution">{t('unverified')}</span><span className="proposal-source">{fact.sourceLabel}</span></div>
                <p>{fact.text[locale]}</p>
              </div>
              <div className="proposal-actions">
                {outdated&&<span className="section-sub">{t('proposalOutdated')}</span>}
                <button className="secondary small" disabled={busy||aiBlocked||!!entry.applied_snapshot_id||entry.snapshot_id!==detail.snapshot.id} onClick={()=>onApply(entry,index)}>{entry.applied_snapshot_id?<><Check size={13} aria-hidden/>{t('applied')}</>:<>{t('apply')}<ArrowRight size={13} aria-hidden/></>}</button>
              </div>
            </div>;})}
          </details>}
        </div>
      </div>
    </li>;})}
    {asking&&<li className="exchange pending">
      {asking.question&&<div className="msg user"><span className="msg-meta">{t('you')}<span className="dot" aria-hidden>·</span>{t('justNow')}</span><p>{asking.question}</p></div>}
      <div className="msg ai thinking" role="status" aria-live="polite">
        <span className="msg-meta"><span className="ai-avatar" aria-hidden><AeroContextMark/></span>{t('assistant')}<span className="typing" aria-hidden><i/><i/><i/></span></span>
        <div className="msg-body">
          <p className="thinking-title">{asking.question?t('thinkingTitle'):t('thinkingResumed')}</p>
          <span className="skeleton" aria-hidden/><span className="skeleton short" aria-hidden/>
          <div className="thinking-foot"><Elapsed since={asking.since} label={t('elapsed')}/><span>{t('thinkingHint')}</span>{onCancel&&<button type="button" className="secondary small" onClick={onCancel}>{t('cancelRun')}</button>}</div>
        </div>
      </div>
    </li>}
    </ol>
    <form className={`composer card ${asking?'is-waiting':''}`} onSubmit={e=>{e.preventDefault();onSend();}}>
      <label className="composer-label" htmlFor="question">{t('ask')}</label>
      {entries.length===0&&!asking&&<p className="section-sub">{t('noDiscussion')}</p>}
      <div className="suggestions">{suggestions.map(s=><button type="button" key={s} className="chip" disabled={!!asking} onClick={()=>setQuestion(s)}>{s}</button>)}</div>
      <textarea id="question" value={question} maxLength={6000} disabled={!!asking} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)&&question.trim()&&!aiBlocked){e.preventDefault();onSend();}}} placeholder={asking?t('waitingAnswer'):t('askPlaceholder')} rows={3} required/>
      <div className="composer-foot">
        <span className={`section-sub ${aiBlocked&&!asking?'busy-note':''}`}>{asking?t('thinkingHint'):aiBlocked&&detail.runs.some(r=>r.status==='running')?t('composerBusy'):t('discussionNote')}</span>
        <button className="primary" disabled={aiBlocked||!question.trim()}>{asking?<><LoaderCircle size={15} className="spin" aria-hidden/>{t('waitingAnswer')}</>:<>{t('send')}<ArrowRight size={15} aria-hidden/></>}</button>
      </div>
    </form>
  </div>;
}
