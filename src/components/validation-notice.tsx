'use client';

import {TriangleAlert} from 'lucide-react';
import type {Locale} from '../domain/types';
import type {OutputValidation, ValidationWarning} from '../domain/validation-notes';

const labels: Record<string, [string, string]> = {
  actions:['Recommendation','建议'], rationale:['Reasoning','判断依据'], possibleImpacts:['Possible impact','可能影响'],
  drafts:['Message draft','消息草案'], operations:['Operations','运行'], airportCoordination:['Airport coordination','机场协调'], passenger:['Passengers','旅客'],
  humanDecisions:['Human decision','人工决策'], informationGaps:['Missing information','信息缺口'], assumptionsToVerify:['Assumption','待核实假设'],
  escalationConditions:['Escalation condition','升级条件'], answer:['Answer','回答'], proposedFacts:['Proposed fact','建议补充的信息'], assessment:['Assessment','评估']
};
function location(w:ValidationWarning, locale:Locale) {
  return w.path.split('.').map(part => labels[part]?.[locale==='zh'?1:0] ?? (/^\d+$/.test(part)?String(Number(part)+1):part==='zh'?'中文':part==='en'?'English':part)).join(' · ');
}
const reasons = {
  wording: ['Wording may imply an operational instruction. Review its meaning before using it.', '措辞可能被理解为运行指令，使用前请人工核查其含义。'],
  citation: ['The figure or citation needs review. Do not treat this passage as verified.', '数值或引用需要核查，请勿将该段内容视为已验证。'],
  presentation: ['Presentation needs review. This output remains a simulation draft.', '表述或标注需要检查。本输出仍为模拟草案。']
};
export function ValidationNotice({validation,locale,expanded=false}:{validation?:OutputValidation;locale:Locale;expanded?:boolean}) {
  if(!validation?.warnings.length)return null;
  return <aside className="validation-notice" role="note" aria-label={locale==='zh'?'需要复核':'Review needed'}>
    <details open={expanded}>
      <summary><TriangleAlert size={18} aria-hidden/><strong>{locale==='zh'?'回答可用，部分内容需要复核':'Answer available with review notes'}</strong><span>{validation.warnings.length}</span></summary>
      <p>{locale==='zh'?'修复后仍有以下疑点。必需的结构和规则一致性检查已通过，但这不代表所有陈述已验证。':'These questions remain after repair. Required structure and policy-consistency checks passed; this does not verify every statement.'}</p>
      <ul>{validation.warnings.map((w,i)=><li key={i}>
        <strong>{location(w,locale)}</strong><p>{reasons[w.code][locale==='zh'?1:0]}</p>
        {w.excerpt&&<blockquote>{w.excerpt}</blockquote>}
        <details><summary>{locale==='zh'?'检查详情':'Check details'}</summary><p>{w.message}</p></details>
      </li>)}</ul>
    </details>
  </aside>;
}
