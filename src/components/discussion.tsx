'use client';

import {ArrowRight, Bot, Check, CircleDashed, MessageSquare} from 'lucide-react';
import type {Locale} from '../domain/types';
import {time, type Detail, type DiscussionRow, type T} from './client';
import {AiMark, Citations, Constraints} from './ui';

export function DiscussionView({detail,locale,t,question,setQuestion,onSend,onApply,aiBlocked,busy}:{detail:Detail;locale:Locale;t:T;question:string;setQuestion:(q:string)=>void;onSend:()=>void;onApply:(entry:DiscussionRow,index:number)=>void;aiBlocked:boolean;busy:boolean}) {
  const entries=[...detail.discussions].reverse();
  const versionOf=(snapshotId:string)=>detail.history.find(s=>s.id===snapshotId)?.version;
  const suggestions=[t('suggestWhy'),t('suggestVerify'),t('suggestChange')];
  return <div className="discussion">
    {entries.length===0&&<div className="discussion-intro"><span className="empty-icon small"><MessageSquare size={22}/></span><div><h2>{t('ask')}</h2><p>{t('noDiscussion')}</p></div></div>}
    <ol className="thread">{entries.map(entry=>{const v=versionOf(entry.snapshot_id),r=entry.response;return <li key={entry.id} className="exchange">
      <div className="msg user">
        <span className="msg-meta">{t('you')}<span className="dot" aria-hidden>·</span>{time(entry.created_at,locale)}{v&&<><span className="dot" aria-hidden>·</span>{t('version')} {v}</>}</span>
        <p>{entry.question}</p>
      </div>
      <div className="msg ai">
        <span className="msg-meta"><Bot size={14} aria-hidden/>{t('assistant')}<AiMark t={t}/></span>
        <p className="draft-prose">{r.answer[locale]}</p>
        <Constraints policy={r.decisionConstraints} locale={locale} t={t}/>
        <Citations ids={r.evidenceIds} version={v} t={t}/>
        {r.proposedFacts.length>0&&<div className="proposals">
          <h3><CircleDashed size={15} aria-hidden/>{t('proposals')}</h3>
          <p className="section-sub">{t('proposalHint')}</p>
          {r.proposedFacts.map((fact,index)=>{const outdated=entry.snapshot_id!==detail.snapshot.id&&!entry.applied_snapshot_id;return <div key={index} className="proposal">
            <div><span className="tag caution">{t('unverified')}</span><span className="proposal-source">{fact.sourceLabel}</span></div>
            <p>{fact.text[locale]}</p>
            <div className="proposal-actions">
              {outdated&&<span className="section-sub">{t('proposalOutdated')}</span>}
              <button className={entry.applied_snapshot_id?'secondary small':'primary small'} disabled={busy||aiBlocked||!!entry.applied_snapshot_id||entry.snapshot_id!==detail.snapshot.id} onClick={()=>onApply(entry,index)}>{entry.applied_snapshot_id?<><Check size={14} aria-hidden/>{t('applied')}</>:<>{t('apply')}<ArrowRight size={14} aria-hidden/></>}</button>
            </div>
          </div>;})}
        </div>}
      </div>
    </li>;})}</ol>
    <form className="composer card" onSubmit={e=>{e.preventDefault();onSend();}}>
      <label className="composer-label" htmlFor="question">{t('ask')}</label>
      <div className="suggestions">{suggestions.map(s=><button type="button" key={s} className="chip" onClick={()=>setQuestion(s)}>{s}</button>)}</div>
      <textarea id="question" value={question} maxLength={6000} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)&&question.trim()&&!aiBlocked){e.preventDefault();onSend();}}} placeholder={t('askPlaceholder')} rows={3} required/>
      <div className="composer-foot"><span className="section-sub">{t('discussionNote')}</span><button className="primary" disabled={aiBlocked||!question.trim()}>{t('send')}<ArrowRight size={15} aria-hidden/></button></div>
    </form>
  </div>;
}
