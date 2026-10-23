'use client';

import {useContext} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {citationId, remarkKnownCitations, remarkDataHighlights, remarkSingleDiscussionNotice, splitDiscussionNotice} from '../domain/discussion-markdown';
import type {T} from './client';
import {Inspect} from './ui';

/** Render prose only. Model links can inspect cited records but cannot navigate or load media. */
export function DiscussionAnswer({text, evidenceIds, version, t}: {text: string; evidenceIds: string[]; version?: number; t: T}) {
  const {notice, body} = splitDiscussionNotice(text);
  return <>
    <aside className="discussion-notice" role="note"><em>{notice || 'SIMULATION / 模拟 — DRAFT / 草案'}</em></aside>
    <MarkdownProse text={body} evidenceIds={evidenceIds} version={version} t={t} removeRepeatedNotice={!!notice}/>
  </>;
}

/** Shared display only: callers keep the original text for editing, copying and export. */
export function MarkdownProse({text, evidenceIds, version, t, removeRepeatedNotice=false, preserveText=false, print=false}: {text:string; evidenceIds:string[]; version?:number; t:T; removeRepeatedNotice?:boolean; preserveText?:boolean; print?:boolean}) {
  const {inspect, describe} = useContext(Inspect);
  const allowed = new Set(evidenceIds);
  return <div className="discussion-markdown">
      <Markdown skipHtml={!preserveText} remarkPlugins={[remarkGfm, [remarkSingleDiscussionNotice, {enabled: removeRepeatedNotice}], [remarkKnownCitations, {evidenceIds}], remarkDataHighlights]}
        allowedElements={['p', 'br', 'span', 'strong', 'em', 'del', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'hr', 'pre', 'code', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', ...(preserveText ? ['input'] : [])]}
        urlTransform={url => preserveText || citationId(url) ? url : ''}
        components={{
          a: ({href, children}) => {
            const id = citationId(href);
            if (!id || !allowed.has(id)) return <span>{children}{preserveText && href && children !== href ? ` [${id || href}]` : ''}</span>;
            if (print) return <span>{children}<span className="print-refs"> [{id}]</span></span>;
            const label = `${t('inspect')}: ${id}${describe(id) ? ` — ${describe(id)}` : ''}`;
            return <button type="button" className="inline-citation" data-evidence-id={id} title={label} aria-label={label} onClick={() => inspect(id, version)}>{children}</button>;
          },
          img: ({alt}) => <span>{alt}</span>,
          input: ({checked}) => <span>{checked ? '[x]' : '[ ]'}</span>,
          h1: ({children}) => <h3>{children}</h3>,
          h2: ({children}) => <h3>{children}</h3>,
          h3: ({children}) => <h3>{children}</h3>,
          h4: ({children}) => <h4>{children}</h4>,
          h5: ({children}) => <h4>{children}</h4>,
          h6: ({children}) => <h4>{children}</h4>,
          table: ({children}) => <div className="discussion-table" tabIndex={print ? undefined : 0} role="region" aria-label={t('refs')}><table>{children}</table></div>
        }}>
        {text}
      </Markdown>
    </div>;
}
