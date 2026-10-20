'use client';

import {createContext, useContext, type ReactNode} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {BookOpen, Building2, ChartLine, CircleHelp, ClipboardCheck, CloudSun, FileText, Flag, Hash, OctagonAlert, OctagonX, ShieldCheck, TriangleAlert, X} from 'lucide-react';
import type {Assessment, Locale, Policy} from '../domain/types';
import {citationKind, citationLabel, type T} from './client';

export const FormError = createContext('');
/** Lets any citation open its source record without threading callbacks through every view. */
export const Inspect = createContext<{inspect:(id:string,version?:number)=>void;describe:(id:string)=>string|undefined}>({inspect:()=>{},describe:()=>undefined});

/** The product name is the same in both languages; sentences use t('assistant') instead. */
export function BrandName({stacked}:{stacked?:boolean}) {
  return <span className={`brand-name ${stacked?'stacked':''}`}><span lang="zh-CN" className="brand-zh">航衡</span><span className="brand-dot" aria-hidden>·</span><span lang="en" className="brand-en">AeroContext</span></span>;
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

const riskIcons={low:ShieldCheck,medium:TriangleAlert,high:OctagonAlert,unable_to_assess:CircleHelp};
export function RiskBadge({level,t,large}:{level:Assessment['riskLevel']|null|undefined;t:T;large?:boolean}) {
  const Icon=level?riskIcons[level]:null;
  return <span className={`risk-badge ${level||'none'} ${large?'large':''}`}>{Icon?<Icon size={large?18:13} aria-hidden/>:<span className="risk-lamp" aria-hidden/>}{level?t(`risk_${level}`):t('unassessed')}</span>;
}
export function RiskLamp({level}:{level:Assessment['riskLevel']|null|undefined}) {return <span className={`risk-lamp ${level||'none'}`} aria-hidden/>;}

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
