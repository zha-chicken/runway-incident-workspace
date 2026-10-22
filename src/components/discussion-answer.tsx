'use client';

import {useContext} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {citationId, remarkKnownCitations, remarkDataHighlights, remarkSingleDiscussionNotice, splitDiscussionNotice} from '../domain/discussion-markdown';
import type {T} from './client';
import {Inspect} from './ui';

/** Render prose only. Model links can inspect cited records but cannot navigate or load media. */
export function DiscussionAnswer({text, evidenceIds, version, t}: {text: string; evidenceIds: string[]; version?: number; t: T}) {
  const {inspect, describe} = useContext(Inspect);
  const {notice, body} = splitDiscussionNotice(text);
  const allowed = new Set(evidenceIds);
  return <>
    <aside className="discussion-notice" role="note"><em>{notice || 'SIMULATION / 模拟 — DRAFT / 草案'}</em></aside>
    <div className="discussion-markdown">
      <Markdown skipHtml remarkPlugins={[remarkGfm, [remarkSingleDiscussionNotice, {enabled: !!notice}], [remarkKnownCitations, {evidenceIds}], remarkDataHighlights]}
        allowedElements={['p', 'br', 'span', 'strong', 'em', 'del', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'hr', 'pre', 'code', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td']}
        urlTransform={url => citationId(url) ? url : ''}
        components={{
          a: ({href, children}) => {
            const id = citationId(href);
            if (!id || !allowed.has(id)) return <span>{children}</span>;
            const label = `${t('inspect')}: ${id}${describe(id) ? ` — ${describe(id)}` : ''}`;
            return <button type="button" className="inline-citation" data-evidence-id={id} title={label} aria-label={label} onClick={() => inspect(id, version)}>{children}</button>;
          },
          img: ({alt}) => <span>{alt}</span>,
          h1: ({children}) => <h3>{children}</h3>,
          h2: ({children}) => <h3>{children}</h3>,
          h3: ({children}) => <h3>{children}</h3>,
          h4: ({children}) => <h4>{children}</h4>,
          h5: ({children}) => <h4>{children}</h4>,
          h6: ({children}) => <h4>{children}</h4>,
          table: ({children}) => <div className="discussion-table" tabIndex={0} role="region" aria-label={t('refs')}><table>{children}</table></div>
        }}>
        {body}
      </Markdown>
    </div>
  </>;
}
