'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {AlertTriangle,ShieldCheck} from 'lucide-react';
import {findInputPrivacy,maskInputPrivacy,privacyReviewPayload,PRIVACY_DETECTOR_VERSION,type InputPrivacyReview,type PrivacyFinding} from '../domain/input-privacy';
import {api,type T} from './client';
import {Field,FormError,Modal} from './ui';

export class PrivacyReviewCancelled extends Error {constructor(){super('PRIVACY_REVIEW_CANCELLED');}}
export type PreparedInput<T>={body:T;review?:InputPrivacyReview};
type Pending={scope:string;body:unknown;findings:PrivacyFinding[];resolve:(choice:Choice|null)=>void};
type Choice={resolution:InputPrivacyReview['resolution'];reviewerLabel:string;reason:string};
export function useInputPrivacy(t:T) {
  const [pending,setPending]=useState<Pending|null>(null),active=useRef<Pending|null>(null);
  const finish=useCallback((choice:Choice|null)=>{const previous=active.current;active.current=null;setPending(null);previous?.resolve(choice);},[]);
  useEffect(()=>()=>{active.current?.resolve(null);active.current=null;},[]);
  const prepare=useCallback(async<T,>(scope:string,input:T):Promise<PreparedInput<T>>=>{
    // Snapshot the exact submission. Nothing is sent or persisted while this review is open.
    const body=JSON.parse(JSON.stringify(input)) as T,findings=findInputPrivacy(body);
    if(!findings.length)return {body};
    if(active.current)throw new PrivacyReviewCancelled();
    const choice=await new Promise<Choice|null>(resolve=>{const next={scope,body,findings,resolve};active.current=next;setPending(next);});
    if(!choice)throw new PrivacyReviewCancelled();
    const submitted=choice.resolution==='masked'?maskInputPrivacy(body):body;
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(privacyReviewPayload(scope,submitted)));
    const inputHash=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
    return {body:submitted,review:{...choice,inputHash,detectorVersion:PRIVACY_DETECTOR_VERSION,findingCount:findings.length}};
  },[]);
  const submit=async<R,TBody=unknown>(scope:string,body:TBody,onMask?:(value:TBody)=>void):Promise<R>=>{
    const prepared=await prepare(scope,body);
    if(prepared.review?.resolution==='masked')onMask?.(prepared.body);
    return api<R>(scope,prepared.body,prepared.review);
  };
  return {prepare,submit,dialog:<FormError.Provider value=""><Modal open={!!pending} onClose={()=>finish(null)} title={t('privacyTitle')} description={t('privacyDescription')} t={t} wide>{pending&&<PrivacyReviewForm body={pending.body} findings={pending.findings} t={t} onResolve={finish}/>}</Modal></FormError.Provider>};
}
export function PrivacyReviewForm({body,findings,t,onResolve}:{body:unknown;findings:PrivacyFinding[];t:T;onResolve:(choice:Choice|null)=>void}) {
  const [mode,setMode]=useState<Choice['resolution']|null>(null),[reviewerLabel,setReviewer]=useState(''),[reason,setReason]=useState('');
  const metadataContainsPrivateText=findInputPrivacy({reviewerLabel,reason}).length>0;
  const groups=[...new Set(findings.map(f=>JSON.stringify(f.path)))].map(key=>{
    const hits=findings.filter(f=>JSON.stringify(f.path)===key),path=hits[0].path;
    const value=path.reduce<unknown>((v,k)=>(v as Record<string,unknown>)[k],body) as string;
    const fields=path.filter(k=>typeof k==='string').map(k=>t(`privacyField_${k}`)===`privacyField_${k}`?k:t(`privacyField_${k}`));
    const reportIndex=path.find(k=>typeof k==='number');
    return {key,label:fields.join(' › ')+(typeof reportIndex==='number'?` (${reportIndex+1})`:''),value,hits};
  });
  const valid=mode==='masked'||!!(mode==='false_positive'&&reviewerLabel.trim()&&reason.trim().length>=3&&!metadataContainsPrivateText);
  return <div className="form-stack privacy-review">
    <div className="notice caution" role="alert"><AlertTriangle size={18} aria-hidden/><div><strong>{t('privacyFound',{count:findings.length})}</strong><p>{t('privacyPaused')}</p></div></div>
    <p className="field-hint">{t('privacyLimit')}</p>
    <p className="field-hint">{t('privacyPolicyHint')}</p>
    <div className="privacy-findings">{groups.map(group=><section key={group.key}><h3>{group.label}</h3><p className="privacy-kinds">{[...new Set(group.hits.map(f=>t(`privacyKind_${f.kind}`)))].join(' · ')}</p><p className="privacy-preview">{group.hits.reduce<{nodes:React.ReactNode[];end:number}>((acc,hit,i)=>({nodes:[...acc.nodes,group.value.slice(acc.end,hit.start),<mark key={i}>{hit.value}</mark>],end:hit.end}),{nodes:[],end:0}).nodes}{group.value.slice(group.hits.at(-1)!.end)}</p></section>)}</div>
    <div className="button-row privacy-options" role="group" aria-label={t('privacyChoose')}>
      <button type="button" className={mode==='false_positive'?'primary':'secondary'} aria-pressed={mode==='false_positive'} onClick={()=>setMode('false_positive')}>{t('privacyFalsePositive')}</button>
      <button type="button" className={mode==='masked'?'primary':'secondary'} aria-pressed={mode==='masked'} onClick={()=>setMode('masked')}>{t('privacyMask')}</button>
    </div>
    {mode==='masked'?<section className="privacy-masked"><h3>{t('privacyMaskPreview')}</h3><p className="field-hint">{t('privacyMaskHint')}</p>{groups.map(group=><div key={group.key}><strong>{group.label}</strong><p className="privacy-preview">{maskInputPrivacy(group.value)}</p></div>)}</section>:mode&&<>
      <p className="field-hint">{t('privacyFalsePositiveHint')}</p>
      <Field label={t('privacyReviewer')} hint={t('privacyReviewerHint')}><input value={reviewerLabel} maxLength={80} onChange={e=>setReviewer(e.target.value)}/></Field>
      <Field label={t('privacyReason')} hint={t('privacyReasonHint')}><textarea value={reason} rows={3} maxLength={500} onChange={e=>setReason(e.target.value)}/></Field>
      {metadataContainsPrivateText&&<p className="notice error" role="alert">{t('privacyMetadataWarning')}</p>}
    </>}
    <div className="modal-actions"><button type="button" className="secondary" onClick={()=>onResolve(null)}>{t('privacyBack')}</button>{mode&&<button type="button" className="primary" disabled={!valid} onClick={()=>onResolve(mode==='masked'?{resolution:'masked',reviewerLabel:'Current user',reason:'Detected input spans masked before submission.'}:{resolution:mode,reviewerLabel:reviewerLabel.trim(),reason:reason.trim()})}><ShieldCheck size={16} aria-hidden/>{t(mode==='masked'?'privacyUseMasked':'privacyContinue')}</button>}</div>
  </div>;
}
