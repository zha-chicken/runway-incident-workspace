'use client';

import type {Locale} from '../domain/types';
import {splitMessageNotice} from '../domain/message-markdown';
import {MarkdownProse} from './discussion-answer';
import type {T} from './client';

export function MessageContent({text,evidenceIds,version,locale,t,print=false}:{text:string;evidenceIds:string[];version:number;locale:Locale;t:T;print?:boolean}) {
  const {notice,body}=splitMessageNotice(text);
  return <div className="message-content" lang={locale==='zh'?'zh-CN':'en'}>
    <aside className="discussion-notice" role="note"><em>{notice}</em></aside>
    <MarkdownProse text={body} evidenceIds={evidenceIds} version={version} t={t} preserveText print={print}/>
  </div>;
}
