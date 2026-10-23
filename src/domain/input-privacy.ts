import {z} from 'zod';

export const PRIVACY_DETECTOR_VERSION='input-privacy-v1';
export const privacyKinds=['phone','email','identity','passport','person_name','bank_account'] as const;
export type PrivacyKind=typeof privacyKinds[number];
export type PrivacyFinding={path:(string|number)[];kind:PrivacyKind;start:number;end:number;value:string};
export const privacyReviewSchema=z.object({
  detectorVersion:z.literal(PRIVACY_DETECTOR_VERSION),
  inputHash:z.string().regex(/^[a-f0-9]{64}$/),
  resolution:z.enum(['false_positive','masked']),
  reviewerLabel:z.string().trim().min(1).max(80),
  reason:z.string().trim().min(3).max(500),
  // Older clients sent false for the remaining choices. An override is never accepted.
  overrideConfirmed:z.literal(false).optional(),
  findingCount:z.number().int().min(1).max(20000)
});
export type InputPrivacyReview=z.infer<typeof privacyReviewSchema>;
// Historical approvals remain readable; they are not valid new submissions.
export type PrivacyReviewRecord=Omit<InputPrivacyReview,'resolution'|'overrideConfirmed'>&{id:string;action:string;reviewedAt:string;findingKinds:PrivacyKind[];resolution:InputPrivacyReview['resolution']|'human_approved';overrideConfirmed?:boolean};

/** Pattern hints for human review, not identity recognition or a guarantee that all private data is found. */
export function findPrivateText(text:string):Omit<PrivacyFinding,'path'>[] {
  const candidates:Omit<PrivacyFinding,'path'>[]=[];
  const add=(kind:PrivacyKind,pattern:RegExp,valueGroup=0)=>{
    for(const match of text.matchAll(pattern)){
      const value=match[valueGroup];
      if(!value||/^(?:unknown|none|not available|not provided|n\/a|匿名|未知|未提供)$/i.test(value.trim()))continue;
      const start=match.index+(valueGroup?match[0].lastIndexOf(value):0);
      candidates.push({kind,start,end:start+value.length,value});
    }
  };
  add('email',/(?<![\w.+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\w-])/gi);
  add('identity',/(?<![\dA-Za-z])\d{17}[\dXx](?![\dA-Za-z])/g);
  add('phone',/(?<![\dA-Za-z])(?:\+?86[ -]?)?1[3-9](?:[ -]?\d){9}(?![\dA-Za-z])/g);
  add('phone',/(?<![\w])\+\d(?:[ ().-]*\d){6,14}(?!\d)/g);
  add('phone',/(?:phone|mobile|telephone|tel|手机号?|电话|联系电话)\s*[:：]\s*(\+?\d(?:[ ().-]*\d){6,14})(?!\d)/gi,1);
  add('passport',/(?:passport(?:\s*(?:number|no\.?))?|护照(?:号码|号)?)\s*[:：]\s*([A-Z0-9]{5,18})(?![A-Z0-9])/gi,1);
  add('bank_account',/(?:bank\s*account(?:\s*(?:number|no\.?))?|银行卡号?|银行账号)\s*[:：]\s*(\d(?:[ -]?\d){11,21})(?!\d)/gi,1);
  add('person_name',/(?:passenger\s*name|employee\s*name|staff\s*name|旅客姓名|乘客姓名|员工姓名|工作人员姓名|姓名)\s*[:：]\s*([\p{L}][\p{L} .·'’-]{0,78}[\p{L}])/giu,1);
  // Prefer a complete span over a nested phone-like substring in an identity number.
  const sorted=candidates.sort((a,b)=>a.start-b.start||b.end-a.end),result:typeof candidates=[];
  for(const hit of sorted)if(!result.some(old=>hit.start<old.end&&hit.end>old.start))result.push(hit);
  return result;
}
export function findInputPrivacy(value:unknown):PrivacyFinding[] {
  const findings:PrivacyFinding[]=[];
  const visit=(current:unknown,path:(string|number)[])=>{
    if(typeof current==='string')findings.push(...findPrivateText(current).map(hit=>({...hit,path})));
    else if(Array.isArray(current))current.forEach((item,i)=>visit(item,[...path,i]));
    else if(current&&typeof current==='object')for(const [key,item] of Object.entries(current))visit(item,[...path,key]);
  };
  visit(value,[]);return findings;
}
export function maskInputPrivacy<T>(value:T):T {
  const visit=(current:unknown):unknown=>{
    if(typeof current==='string'){
      let masked=current;
      for(const hit of findPrivateText(current).reverse())masked=masked.slice(0,hit.start)+`[${hit.kind.toUpperCase()} REDACTED]`+masked.slice(hit.end);
      return masked;
    }
    if(Array.isArray(current))return current.map(visit);
    if(current&&typeof current==='object')return Object.fromEntries(Object.entries(current).map(([key,item])=>[key,visit(item)]));
    return current;
  };
  return visit(value) as T;
}
/** Both ends bind the review to the exact submitted content and route, independent of key ordering. */
export function privacyReviewPayload(scope:string,input:unknown):string {
  const sort=(v:unknown):unknown=>Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,item])=>[k,sort(item)])):v;
  return JSON.stringify({scope,input:sort(input)});
}
