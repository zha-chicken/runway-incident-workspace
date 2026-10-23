import React from 'react';
import {describe,expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {MessageContent} from '../src/components/message-content';
import {DraftsView} from '../src/components/drafts';
import {MESSAGE_NOTICE,splitMessageNotice} from '../src/domain/message-markdown';
import {hasDraftNotice} from '../src/domain/output-checks';
import {assessmentSchema,type Locale,type StoredAssessment} from '../src/domain/types';
import type {Detail} from '../src/components/client';
import recorded from '../evals/development/improvement-before.json';

const ids=['RULE012','OPS-BEI-2025-08','REPORT:maintenance'];
const render=(text:string,locale:Locale='en',print=false)=>renderToStaticMarkup(React.createElement(MessageContent,{text,evidenceIds:ids,version:4,locale,t:key=>key,print}));
const bodyHtml=(html:string)=>html.replace(/<aside[^>]*>[\s\S]*?<\/aside>/g,'');
const visible=(html:string)=>html.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

describe('Messages Markdown presentation',()=>{
  it.each([
    MESSAGE_NOTICE,
    'SIMULATION / DRAFT',
    '模拟 / 草案',
    '模拟 / SIMULATION — 草案 / DRAFT',
    `**${MESSAGE_NOTICE}.**`,
    `_${MESSAGE_NOTICE}_`,
    `> **${MESSAGE_NOTICE}**`,
    `## ${MESSAGE_NOTICE}`
  ])('moves the leading notice to its own box: %s',notice=>{
    const text=`${notice}.\n\nCheck 20:08; cause remains unconfirmed. RULE012`;
    const html=render(text);
    expect(html.match(/class="discussion-notice"/g)).toHaveLength(1);
    expect(bodyHtml(html)).not.toMatch(/SIMULATION|草案|DRAFT/);
    expect(visible(bodyHtml(html))).toBe('Check 20:08; cause remains unconfirmed. RULE012');
    expect(hasDraftNotice(text)).toBe(true);
    expect(text).toBe(`${notice}.\n\nCheck 20:08; cause remains unconfirmed. RULE012`);
  });

  it('moves an existing dash-separated label without consuming a signed figure',()=>{
    expect(splitMessageNotice('SIMULATION / DRAFT — Proposed checks.').body).toBe('Proposed checks.');
    expect(splitMessageNotice('模拟 / 草案 — -5.61个百分点，仍待核验。').body).toBe('-5.61个百分点，仍待核验。');
    expect(splitMessageNotice('SIMULATION / DRAFT -5.61 pp remains historical.').body).toBe('-5.61 pp remains historical.');
  });

  it.each(['en','zh'] as const)('preserves quantities, qualifications, ordered steps and citation text (%s)',locale=>{
    const body=locale==='en'
      ? '## Current picture\n\n**Unverified** at 20:08; no confirmed fire. B787. [Maintenance](#evidence:REPORT%3Amaintenance)\n\n3. Verify 2 flights and 12 months of context. RULE012\n4. Difference -5.61 pp is historical, not current causation.\n\n| Measure | 2025-08 |\n| --- | --- |\n| Completion | 78.20% |\n| Release | 79.42% |\n| Baseline | 83.81% |\n\nOPS-BEI-2025-08'
      : '## 当前情况\n\n20:08**未核验**；尚未确认火情。B787。[机务](#evidence:REPORT%3Amaintenance)\n\n3. 核查2个航班及此前12个月的背景。RULE012\n4. 差值-5.61个百分点属于历史背景，不能证明当前原因。\n\n| 指标 | 2025-08 |\n| --- | --- |\n| 完成率 | 78.20% |\n| 放行率 | 79.42% |\n| 基线 | 83.81% |\n\nOPS-BEI-2025-08';
    const text=`${MESSAGE_NOTICE}\n\n${body}`,html=render(text,locale);
    const baseline=renderToStaticMarkup(React.createElement(Markdown,{children:body,remarkPlugins:[remarkGfm]}));
    expect(visible(bodyHtml(html))).toBe(visible(baseline));
    expect(html).toContain('<ol start="3">');
    expect(html).toContain('<table>');
    expect(html).toContain('<h3>');
    for(const id of ids)expect(html).toContain(`data-evidence-id="${id}"`);
    for(const value of ['78.20%','79.42%','83.81%','20:08'])expect(html).toContain(`<span class="data-highlight">${value}</span>`);
    expect(html).toContain(`lang="${locale==='zh'?'zh-CN':'en'}"`);
  });

  it('keeps ordinary prose, line breaks, code and notices mentioned inside a claim',()=>{
    const text=`No leading label.\nKeep this line.\n\nThe label ${MESSAGE_NOTICE} belongs to the draft.\n\n\`RULE012\` and \`78.20%\`.\n\n\`\`\`text\nRULE012: 78.20%\n\`\`\``;
    const html=render(text);
    expect(splitMessageNotice(text)).toEqual({notice:MESSAGE_NOTICE,body:text});
    expect(html).toContain('No leading label.\nKeep this line.');
    expect(bodyHtml(html)).toContain(`The label ${MESSAGE_NOTICE} belongs to the draft.`);
    expect(html).toContain('<code>RULE012</code>');
    expect(html).toContain('<pre><code class="language-text">RULE012: 78.20%');
  });

  it('does not strip ordinary words beginning like a label',()=>{
    for(const text of ['SIMULATION / DRAFTing guidance.','Simulated report remains unverified.','A SIMULATION / DRAFT label is required.'])expect(splitMessageNotice(text).body).toBe(text);
  });

  it('keeps text and unknown citation IDs visible without enabling HTML, links or remote media',()=>{
    const html=render('<stand>Gate A</stand>\n\n<script>alert(1)</script>\n\n[Unknown](#evidence:RULE999) [Reference](https://example.test/) ![Diagram](https://example.test/image)\n\n- [x] Report received\n- [ ] Verification pending');
    expect(html).not.toMatch(/<script|<stand|<img|<a\b|<input|href=|src=/);
    for(const text of ['&lt;stand&gt;Gate A&lt;/stand&gt;','alert(1)','RULE999','Reference','https://example.test/','Diagram','[x]','[ ]'])expect(html).toContain(text);
    expect(html).not.toContain('data-evidence-id="RULE999"');
  });

  it('prints the same content with source IDs instead of interactive citation controls',()=>{
    const text=`${MESSAGE_NOTICE}\n\n## Checks\n\n- 78.20% completion, cause unconfirmed. [Monthly row](#evidence:OPS-BEI-2025-08)\n- Verify the source. RULE012`;
    const html=render(text,'en',true);
    expect(html).not.toContain('<button');
    expect(html).toContain('Monthly row<span class="print-refs"> [OPS-BEI-2025-08]</span>');
    expect(html).toContain('<h3>Checks</h3>');
    expect(html).toContain('cause unconfirmed.');
    expect(html).toContain('class="discussion-notice"');
  });

  it('renders the selected human revision with its assessment citations without rewriting the assessment or revision',()=>{
    const result=assessmentSchema.parse(recorded.result);
    result.drafts.operations.evidenceIds=ids;
    const assessment={id:'assessment',snapshotVersion:4,result} as StoredAssessment;
    const revised=`${MESSAGE_NOTICE}\n\n## Reviewed checks\n\n- Keep 78.20% and -5.61 pp distinct. RULE012`;
    const detail={drafts:[{assessment_id:'assessment',audience:'operations',locale:'en',text:revised,revision:2}]} as Detail;
    const original=JSON.stringify({assessment,detail});
    const html=renderToStaticMarkup(React.createElement(DraftsView,{detail,current:assessment,displayed:assessment,locale:'en',t:key=>key,draftText:()=>revised,onEdit:()=>{}}));
    expect(html).toContain('<h3>Reviewed checks</h3>');
    expect(html).toContain('edited');
    expect(html).toContain('evidenceTrail');
    for(const id of ids)expect(html).toContain(id);
    expect(JSON.stringify({assessment,detail})).toBe(original);
  });
});
