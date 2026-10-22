import React from 'react';
import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {DiscussionAnswer} from '../src/components/discussion-answer';
import {citationHref, citationId, discussionLinks, splitDiscussionNotice} from '../src/domain/discussion-markdown';
import {validateDiscussion} from '../src/domain/validation';
import {dataset, evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {buildRequest} from '../src/ai/service';
import type {Discussion, Snapshot} from '../src/domain/types';

const input = {...structuredClone(dataset.events[0].input), safetyIssue: true};
const evidence = evidenceFor(input), policy = evaluatePolicy(input);
const reportId = evidence.reportEvidence[0].id;
const render = (text: string, ids = ['RULE012', reportId]) => renderToStaticMarkup(React.createElement(DiscussionAnswer, {text, evidenceIds: ids, version: 1, t: key => key}));
const answer = (): Discussion => ({
  answer: {en: `SIMULATION / 模拟 — DRAFT / 草案.\n\n## Decision boundary\n\nAction conclusions remain stopped. [RULE012](${citationHref('RULE012')})`, zh: `SIMULATION / 模拟 — DRAFT / 草案.\n\n## 决策边界\n\n行动结论仍停止。[RULE012](${citationHref('RULE012')})`},
  evidenceIds: ['RULE012'], proposedFacts: [], decisionConstraints: structuredClone(policy.constraints)
});

describe('discussion Markdown and evidence links', () => {
  it('provides the draft notice when a recovered answer omitted it, without changing the body',()=>{
    const html=render('Check the source before acting.');
    expect(html).toContain('SIMULATION / 模拟 — DRAFT / 草案');
    expect(html).toContain('Check the source before acting.');
  });
  it('renders headings, emphasis, lists and tables, retaining the notice in its own box', () => {
    const html = render('SIMULATION / 模拟 — DRAFT / 草案.\n\n## Main point\n\n**High risk**, *uncertain cause*.\n\n- Verify the report\n- Preserve the scope\n\n| Source | Status |\n| --- | --- |\n| Engineering | Pending |');
    expect(html).toContain('class="discussion-notice"');
    expect(html).toContain('<em>SIMULATION / 模拟 — DRAFT / 草案</em>');
    expect(html).toContain('<h3>Main point</h3>');
    expect(html).toContain('<strong>High risk</strong>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<table>');
  });

  it('renders declared citations as source controls and keeps unknown targets inert', () => {
    const html = render(`[Engineering log](${citationHref(reportId)}) [Unknown](#evidence:RULE999)`);
    expect(html).toContain(`data-evidence-id="${reportId}"`);
    expect(html).toContain('>Engineering log</button>');
    expect(html).toContain('<span>Unknown</span>');
    expect(html).not.toContain('data-evidence-id="RULE999"');
  });

  it.each(['en', 'zh'])('shows one notice while preserving the three draft bodies and evidence (%s)', locale => {
    const notice='SIMULATION / 模拟 — DRAFT / 草案';
    const labels=locale==='en' ? ['Operations draft','Airport coordination draft','Passenger draft'] : ['运行草案','机场协调草案','旅客草案'];
    const bodies=locale==='en'
      ? ['Verify the 20:08 report; completion 78.20%.', 'Release 79.42%; baseline 83.81%; difference -5.61 pp.', 'No confirmed fire. Follow official updates.']
      : ['核查20:08报告；完成率78.20%。', '放行率79.42%；历史基线83.81%；差值-5.61个百分点。', '尚未确认火情。请关注官方更新。'];
    const drafts=labels.map((label,i)=>`${label}: ${i===1?`**${notice}**`:notice}. ${bodies[i]} [RULE012](#evidence:RULE012)`);
    const text=`${notice}.\n\n${drafts.join('\n\n')}`;
    const html=render(text,['RULE012']);
    expect(html.match(/SIMULATION/g)).toHaveLength(1);
    expect(html).toContain(`<aside class="discussion-notice" role="note"><em>${notice}</em></aside>`);
    expect(html.match(/data-evidence-id="RULE012"/g)).toHaveLength(3);
    expect(html.replace(/<[^>]+>/g,'')).toBe(notice+labels.map((label,i)=>`${label}: ${bodies[i]} RULE012`).join('\n'));
    expect(html).not.toContain('<strong></strong>');
    // Stored/source text and its three draft labels are not rewritten.
    expect(text.match(/SIMULATION/g)).toHaveLength(4);
  });

  it('keeps a notice when no header exists and preserves literal code and citation contents', () => {
    const notice='SIMULATION / 模拟 — DRAFT / 草案';
    expect(render(`Operations draft: ${notice}. Verify the report.`)).toContain(notice);
    const html=render(`${notice}.\n\n\`${notice}\`\n\n[${notice}](#evidence:RULE012)\n\n\`\`\`text\n${notice}\n\`\`\``);
    expect(html).toContain(`<code>${notice}</code>`);
    expect(html).toContain(`${notice}</button>`);
    expect(html).toContain(`<pre><code class="language-text">${notice}`);
  });

  it('keeps old prose readable and links exact named sources without matching partial IDs or code', () => {
    const text = `Existing reply: RULE012.\n\n${reportId}\n\nRULE012-extra\n\n\`RULE012\`\n\n[RULE012](#evidence:RULE012)`;
    const html = render(text);
    expect(html.match(/data-evidence-id=/g)).toHaveLength(3);
    expect(html).toContain('RULE012-extra');
    expect(html).toContain('<code>RULE012</code>');
    expect(splitDiscussionNotice(text)).toEqual({notice: null, body: text});
    expect(splitDiscussionNotice('SIMULATION / 模拟 — DRAFT / 草案. Saved reply.').body).toBe('Saved reply.');
  });

  it('highlights exact figures, units, signs, dates and times without changing visible text', () => {
    const text = 'Completion 78.20%; release 79.42%; baseline 83.81%; difference −5.61 pp; peers 79.58%. August 2025: 2025-08, prior 12 months, 3 airports. The 20:00 report is inside ±30 minutes. Historical context does not establish current causation.';
    const html = render(text);
    const visible = (value: string) => value.replace(/<aside class="discussion-notice"[^>]*>[\s\S]*?<\/aside>/g, '').replace(/<[^>]+>/g, '');
    const original = renderToStaticMarkup(React.createElement(Markdown, {children: text}));
    expect(visible(html)).toBe(visible(original));
    for (const value of ['78.20%', '79.42%', '83.81%', '−5.61 pp', '79.58%', '2025-08', '12 months', '3 airports', '20:00', '±30 minutes']) {
      expect(html).toContain(`<span class="data-highlight">${value}</span>`);
    }
    expect(html).not.toContain('<button');
    expect(html).not.toContain('tabindex');
  });

  it('preserves Chinese units and surrounding qualifiers, including negative percentage points', () => {
    const text = '2025-08按计划完成78.20%，放行正常79.42%，此前12个月均值83.81%，差值-5.61个百分点，同类79.58%。20:05已核验；20:08未核验。';
    const html = render(text);
    expect(html.replace(/<aside class="discussion-notice"[^>]*>[\s\S]*?<\/aside>/g, '').replace(/<[^>]+>/g, '')).toBe(text);
    for (const value of ['78.20%', '79.42%', '83.81%', '-5.61个百分点', '79.58%', '12个月', '20:05', '20:08']) {
      expect(html).toContain(`<span class="data-highlight">${value}</span>`);
    }
  });

  it('keeps figures in tables and nested emphasis and distinguishes data from clickable sources', () => {
    const text = '| Measure | Value |\n| --- | --- |\n| Release | **79.42%** |\n| Difference | *-5.61 pp* |\n\n[2025-08 source](#evidence:OPS-BEI-2025-08)';
    const html = render(text, ['OPS-BEI-2025-08']);
    const baseline = renderToStaticMarkup(React.createElement(Markdown, {children: text, remarkPlugins: [remarkGfm]}));
    expect(html.replace(/<aside class="discussion-notice"[^>]*>[\s\S]*?<\/aside>/g, '').replace(/<[^>]+>/g, '')).toBe(baseline.replace(/<[^>]+>/g, ''));
    expect(html).toContain('<strong><span class="data-highlight">79.42%</span></strong>');
    expect(html).toContain('class="inline-citation" data-evidence-id="OPS-BEI-2025-08"');
    expect(html.match(/class="data-highlight"/g)).toHaveLength(2);
  });

  it('accepts model-selected numeric highlights without changing code or identifier contents', () => {
    const html = render('`78.20%` and `-5.61 pp`, `12` months and `3` airports\n\n`OPS-BEI-2025-08:completion` B787\n\n```text\n78.20%\n```\n\n[20:00 log](#evidence:RULE012)');
    expect(html.match(/class="data-highlight"/g)).toHaveLength(4);
    expect(html).toContain('<code>OPS-BEI-2025-08:completion</code>');
    expect(html).toContain('<pre><code class="language-text">78.20%');
    expect(html).toContain('>20:00 log</button>');
  });

  it('does not execute HTML or create external links, images or javascript URLs', () => {
    const html = render('<script>alert(1)</script>\n\n<img src="https://example.test/tracker">\n\n![Picture](https://example.test/tracker) [External](https://example.test/) [Bad](javascript:alert%281%29)');
    expect(html).not.toMatch(/<script|<img|<a\b|href=|src=|javascript:/);
    expect(html).toContain('Picture');
    expect(html).toContain('External');
  });

  it('handles encoded IDs and reference-style Markdown without treating code as a citation', () => {
    const id = 'REPORT:演练 1/(test)';
    expect(citationId(citationHref(id))).toBe(id);
    expect(citationId('#evidence:%GG')).toBeNull();
    expect(citationId('https://example.test/#evidence:RULE012')).toBeNull();
    expect(discussionLinks('[Rule][source]\n\n[source]: #evidence:RULE012\n\n`[fake](#evidence:RULE999)`')).toEqual(['#evidence:RULE012']);
  });

  it('accepts valid bilingual citations and rejects unknown, undeclared, external and metric targets', () => {
    expect(validateDiscussion(answer(), evidence, policy)).toEqual(answer());
    for (const href of ['#evidence:RULE999', citationHref(reportId), '#evidence:OPS-HAI-2025-07%3Acompletion', '#evidence:%GG', 'https://example.test/']) {
      const value = answer();
      value.answer.en = `A claim [source](${href})`;
      expect(() => validateDiscussion(value, evidence, policy)).toThrow('MODEL_OUTPUT_INVALID');
    }
  });

  it('requires an inline citation in both languages and still enforces the original stop constraints', () => {
    const value = answer(); value.answer.zh = '缺少行内引用。';
    expect(() => validateDiscussion(value, evidence, policy)).toThrow('MODEL_OUTPUT_INVALID');
    const unsafe = answer(); unsafe.decisionConstraints.actionConclusionsStopped = false;
    expect(() => validateDiscussion(unsafe, evidence, policy)).toThrow('MODEL_OUTPUT_INVALID');
    const sending = answer(); sending.answer.en += ' The notification was sent.';
    expect(() => validateDiscussion(sending, evidence, policy)).toThrow('MODEL_OUTPUT_INVALID');
  });

  it('limits the new formatting instructions to discussions and preserves the structured response contract', () => {
    const snapshot = {...input, id: 'test-snapshot', incidentId: 'test-incident', version: 1, createdAt: '2026-10-22T12:00:00Z'} as Snapshot;
    const discussion = buildRequest(snapshot, 'discussion', 'Why this risk?');
    const assessment = buildRequest(snapshot, 'assessment');
    expect(discussion.instructions).toContain('Markdown strings INSIDE the existing JSON object');
    expect(discussion.instructions).toContain('#evidence:');
    expect(discussion.instructions).toContain('Readability is presentation, not loss of information');
    expect(discussion.instructions).toContain('release-normality percentage as a separate measure');
    expect(discussion.instructions).toContain('actual baseline month count and date range');
    expect(assessment.instructions).not.toContain('Markdown strings');
    expect(discussion.schemaName).toBe('runway_discussion');
    expect(discussion.maxOutput).toBe(32768);
    expect(JSON.parse(discussion.input).computedPolicy).toEqual(evaluatePolicy(input, 'Why this risk?'));
  });
});
