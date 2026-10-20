'use client';

import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {BookOpen, Building2, ChartLine, CircleHelp, ClipboardCheck, CloudSun, FileText, Flag, Hash, Info, OctagonX, TriangleAlert, X} from 'lucide-react';
import type {Assessment, Locale, Policy} from '../domain/types';
import {citationKind, citationLabel, type T} from './client';

export const FormError = createContext('');
/** Lets any citation open its source record without threading callbacks through every view. */
export const Inspect = createContext<{inspect:(id:string,version?:number)=>void;describe:(id:string)=>string|undefined}>({inspect:()=>{},describe:()=>undefined});

/** The product name is the same in both languages; sentences use t('assistant') instead. */
export function BrandName({stacked}:{stacked?:boolean}) {
  return <span className={`brand-name ${stacked?'stacked':''}`}><span lang="zh-CN" className="brand-zh">航衡</span><span className="brand-dot" aria-hidden>·</span><span lang="en" className="brand-en">AeroContext</span></span>;
}

/** A ticking m:ss counter for work that is still running. */
export function Elapsed({since,label,className='elapsed'}:{since:string;label:string;className?:string}) {
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const seconds=Math.max(0,Math.floor((now-Date.parse(since))/1000));
  return <span className={className} aria-label={label}>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</span>;
}

export function Field({label,hint,children}:{label:string;hint?:string;children:ReactNode}) {
  return <label className="field"><span className="field-label">{label}</span>{children}{hint&&<span className="field-hint">{hint}</span>}</label>;
}
export function Modal({open,onClose,title,description,t,wide,sheet,drawer,children}:{open:boolean;onClose:()=>void;title:string;description?:string;t:T;wide?:boolean;sheet?:boolean;drawer?:boolean;children:ReactNode}) {
  const error=useContext(FormError);
  return <Dialog.Root open={open} onOpenChange={v=>{if(!v)onClose();}}><Dialog.Portal>
    <Dialog.Overlay className="modal-overlay"/>
    <Dialog.Content {...(description?{}:{'aria-describedby':undefined})} className={`modal ${wide?'wide':''} ${sheet?'sheet':''} ${drawer?'drawer':''}`}>
      <div className="modal-header"><div><Dialog.Title>{title}</Dialog.Title>{description&&<Dialog.Description className="modal-description">{description}</Dialog.Description>}</div><Dialog.Close className="icon-button" aria-label={t('close')}><X size={18}/></Dialog.Close></div>
      {error&&<div className="notice error" role="alert">{error}</div>}
      <div className="modal-body">{children}</div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}

/** Lucide has no square alert; this matches its stroke style for the high-risk mark. */
function SquareAlert({size=24,className}:{size?:number;className?:string}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
}
const riskIcons={low:TriangleAlert,medium:TriangleAlert,high:SquareAlert,unable_to_assess:Info};
/** One mark per risk level, shared by the rail and every risk badge; unassessed incidents keep a plain dot. */
export function RiskIcon({level,size=14}:{level:Assessment['riskLevel']|null|undefined;size?:number}) {
  if(!level)return <span className="risk-lamp" aria-hidden/>;
  const Icon=riskIcons[level];
  return <Icon size={size} className={`risk-icon ${level}`} aria-hidden/>;
}
export function RiskBadge({level,t,large}:{level:Assessment['riskLevel']|null|undefined;t:T;large?:boolean}) {
  return <span className={`risk-badge ${level||'none'} ${large?'large':''}`}><RiskIcon level={level} size={large?18:13}/>{level?t(`risk_${level}`):t('unassessed')}</span>;
}

/** Airfield-sign styling marks anything simulated or not yet approved. */
export function SimMark({t,compact}:{t:T;compact?:boolean}) {return <span className={`sim-mark ${compact?'compact':''}`}>{t('simulation')}</span>;}
export function DraftMark({t}:{t:T}) {return <span className="draft-mark">{t('draft')}</span>;}
export function AiMark({t}:{t:T}) {return <span className="ai-mark">{t('aiGenerated')}</span>;}

const kindIcons={report:FileText,rule:BookOpen,operations:ChartLine,weather:CloudSun,scale:Building2,event:Flag,other:Hash};
export function Citations({ids,version,t}:{ids:string[];version?:number;t:T}) {
  const {inspect,describe}=useContext(Inspect);
  const unique=[...new Set(ids)];
  if(!unique.length)return null;
  return <div className="citations">{unique.map(id=>{
    const Icon=kindIcons[citationKind(id)],detail=describe(id);
    return <button type="button" key={id} className={`citation ${citationKind(id)}`} onClick={()=>inspect(id,version)} title={`${t('inspect')}: ${id}${detail?` — ${detail}`:''}`}>
      <Icon size={12} aria-hidden/><span>{citationLabel(id)}</span><span className="sr-only"> — {t('inspect')}</span>
    </button>;
  })}</div>;
}

export function Constraints({policy,locale,t}:{policy:Policy['constraints'];locale:Locale;t:T}) {
  const state=policy.actionConclusionsStopped?'stopped':policy.professionalDecisionRequired?'professional':'review';
  const Icon=state==='stopped'?OctagonX:state==='professional'?CircleHelp:ClipboardCheck;
  return <div className={`constraint ${state}`}>
    <Icon size={18} aria-hidden/>
    <div><strong>{state==='stopped'?t('stopped'):state==='professional'?t('professional'):t('humanReview')}</strong>
      {policy.reviewerRoles.length>0&&<span>{t('reviewers')}: {policy.reviewerRoles.map(v=>v[locale]).join(' · ')}</span>}
    </div>
  </div>;
}

export function Empty({icon,title,body,action}:{icon:ReactNode;title:string;body:string;action?:ReactNode}) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><h2>{title}</h2><p>{body}</p>{action}</div>;
}
