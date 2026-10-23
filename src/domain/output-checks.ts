import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type {Nodes} from 'mdast';
import type {EvidenceBundle} from './types';
import {citationId} from './discussion-markdown';
import {warning, type ValidationWarning} from './validation-notes';

const parser = unified().use(remarkParse).use(remarkGfm);
const textOf = (node: Nodes): string => {
  if (node.type==='html') return '';
  if (node.type==='image' || node.type==='imageReference') return node.alt ?? '';
  if ('children' in node) return node.children.map(textOf).join(['root','list','listItem','blockquote','table','tableRow'].includes(node.type) ? '\n' : ' ');
  return 'value' in node ? node.value : '';
};
export const plainOutput = (text: string) => textOf(parser.parse(text)).normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/g,'');

const noticePattern = /^(?:SIMULATION(?:\s*\/\s*模拟)?|模拟(?:\s*\/\s*SIMULATION)?)\s*[/—–:：|-]\s*(?:DRAFT(?:\s*\/\s*草案)?|草案(?:\s*\/\s*DRAFT)?)(?![a-z])/iu;

/** Labels are checked in raw output, before the UI consolidates repeated notices. */
export function hasDraftNotice(text: string): boolean {
  return noticePattern.test(plainOutput(text).trimStart());
}

type ProseBlock = {text: string; evidenceIds: string[]};
/** Keep numerical grounding local to a paragraph/list item or a table row, not all cited history. */
export function discussionBlocks(markdown: string): ProseBlock[] {
  const root = parser.parse(markdown), definitions = new Map<string,string>();
  for (const node of root.children) if (node.type === 'definition') definitions.set(node.identifier.toUpperCase(),node.url);
  const refs = (node: Nodes): string[] => {
    const id = node.type === 'link' ? citationId(node.url) : node.type === 'linkReference' ? citationId(definitions.get(node.identifier.toUpperCase())) : null;
    return [...(id ? [id] : []), ...('children' in node ? node.children.flatMap(refs) : [])];
  };
  const blocks: ProseBlock[] = [];
  const walk = (node: Nodes, next?:Nodes) => {
    if (node.type === 'table') {
      const headers = node.children[0].children.map(textOf);
      // A source note directly below a table also grounds its rows; unrelated later prose does not.
      const sourceNote = next?.type==='paragraph' ? refs(next) : [];
      for (const row of node.children.slice(1)) {
        const rowIds = refs(row), ids = rowIds.length ? rowIds : sourceNote, label = textOf(row.children[0]);
        row.children.forEach((cell,index) => blocks.push({text: `${label} ${headers[index] ?? ''}: ${textOf(cell)}`,evidenceIds:ids}));
      }
    } else if (['paragraph','heading','code'].includes(node.type)) blocks.push({text:textOf(node),evidenceIds:refs(node)});
    else if ('children' in node) node.children.forEach((child,index)=>walk(child,node.children[index+1]));
  };
  walk(root);
  return blocks;
}

const ratePattern = /(?<![\w.])([+\-]?\d+(?:\.\d+)?)\s*(%|pp\b|percentage\s+points?\b|percent\b|(?:个)?百分点)/giu;
type Rate = {value:number; unit:'%'|'pp'; index:number; end:number};
function rates(text: string): {text:string; values:Rate[]} {
  const normalized = text.normalize('NFKC').replace(/−/g,'-').replace(/(?:五|five)\s*(?=(?:个)?百分点|percentage\s+points?)/giu,'5');
  return {text:normalized,values:[...normalized.matchAll(ratePattern)].map(m=>({value:Number(m[1]),unit: /%|^percent$/i.test(m[2]) ? '%' : 'pp',index:m.index,end:m.index+m[0].length}))};
}
const metricLabels = [
  ['completion',/completed as planned|completion(?: rate)?|按计划完成(?:航班)?(?:比例)?|完成率/giu],
  ['release',/release(?: normality)?|放行(?:正常)?(?:比例|率)?/giu],
  ['historical',/historical(?: mean| average| baseline)?|prior[^.;。；]{0,35}mean|baseline|此前[^。；]{0,20}平均|历史(?:平均|均值|基线)/giu],
  ['peers',/peers?|same.category(?: mean| average)?|同类(?:别)?(?:平均|均值)?/giu]
] as const;
function metricLabel(prefix: string): string|undefined {
  let nearest = -1, label:string|undefined;
  for (const [key,pattern] of metricLabels) for (const match of prefix.matchAll(pattern)) if (match.index > nearest) {nearest=match.index;label=key;}
  return label;
}

/** Check values AND units against cited metrics; only binary floating-point noise is tolerated. */
export function checkRates(text:string, ids:string[], evidence:EvidenceBundle, path:string, errors:string[], metricIds?:string[], warnings?:ValidationWarning[]) {
  const parsed = rates(plainOutput(text));
  if (!parsed.values.length) return;
  const candidates = evidence.metrics.filter(m=>ids.includes(m.evidenceId) && (!metricIds || metricIds.includes(m.id)));
  const sourceRates = [
    ...evidence.reportEvidence.filter(r=>ids.includes(r.id)).flatMap(r=>rates(r.report.text).values),
    ...evidence.records.filter(r=>ids.includes(r.id) && r.category==='rule').flatMap(r=>Object.values(r.cells).flatMap(v=>typeof v==='string' ? rates(v).values : []))
  ];
  let previousEnd=0;
  for (const value of parsed.values) {
    const prefix=parsed.text.slice(previousEnd,value.index), suffix=parsed.text.slice(value.end,value.end+45);
    const label=value.unit==='%' ? metricLabel(prefix) : 'delta';
    const negativeMagnitude=value.unit==='pp' && value.value>=0 && (/below|lower|drop|declin|decreas|低于|下降|降低|减少/i.test(prefix.slice(-65)+' '+suffix) || /低\s*$/u.test(prefix));
    const expected=value.value*(negativeMagnitude ? -1 : 1);
    const tolerance=1e-6; // 78.2 equals 78.20; 78 or 78.3 must not replace the supplied 78.20.
    const matches=candidates.some(m=>m.unit===value.unit && (!label || m.id.endsWith(':'+label)) && Math.abs(m.value-expected)<tolerance);
    const sourceMatch=sourceRates.some(r=>r.unit===value.unit && Math.abs(r.value-value.value)<tolerance);
    if (!matches && !sourceMatch) {
      const message = `${value.value}${value.unit} is not supported by its cited sources, metric type, unit, and precision.`;
      // A value found in the supplied evidence may have an ambiguous label or a misplaced
      // citation. It is reviewable, not verified. Never accept a novel number this way.
      const supplied = evidence.metrics.some(m => m.unit === value.unit && Math.abs(m.value - expected) < tolerance) ||
        [...evidence.reportEvidence.flatMap(r => rates(r.report.text).values),
         ...evidence.records.filter(r => r.category === 'rule').flatMap(r => Object.values(r.cells).flatMap(v => typeof v === 'string' ? rates(v).values : []))]
          .some(r => r.unit === value.unit && Math.abs(r.value - value.value) < tolerance);
      // An explicit metric label and available cited column establish a concrete mismatch.
      const explicitLabel = /(?:completed as planned|completion rate|release normality|historical (?:mean|average)|same.category (?:mean|average)|完成率|按计划完成航班比例|放行正常率|机场放行正常比例|历史均值|历史平均|同类均值)(?:\s*[:：]|\s+(?:is|was|of|equals)|为|是)\s*$/iu.test(prefix);
      const contradiction = explicitLabel && candidates.some(m => label && m.id.endsWith(':' + label) && m.unit === value.unit);
      if (warnings && supplied && !contradiction) warnings.push(warning('citation', path, message, text));
      else errors.push(`${path}: ${message}`);
    }
    previousEnd=value.end;
  }
}

// Only false message-sending claims are checked in prose. Operational directives,
// weather causation, safety decisions, and official-status wording are not phrase-filtered.
// Structured policy constraints and privacy checks remain separate and unchanged.
const sendingClaim = /\b(?:notifications?|notices?|messages?)\s+(?:has been|have been|was|were)\s+sent\b|已(?:经)?(?:向旅客)?发送(?:了)?(?:通知|消息)/giu;
function qualified(prefix:string, suffix:string):boolean {
  // Negation attaches to this claim; a later sentence cannot borrow an earlier negation.
  if (/(?:\b(?:do not|don't|does not|cannot|can't|must not|should not|never|not permitted to|not authorized to|no)\s+(?:(?:automatically|immediately|actually|yet|recommend|authorize|to)\s+)*|(?:不得|不能|不可|不要|不应|禁止|无法|未获准|不会|不|尚未|未|没有)(?:自动|立即|直接|擅自|建议|批准|决定)*)$/iu.test(prefix)) return true;
  if (/(?:whether|if)\s+(?:(?:it is (?:appropriate|safe|permitted) to|we (?:may|can|should)|to)\s+)?$/iu.test(prefix) && /ask|check|confirm|verify|decid|professional|lead|询问|核查|确认/i.test(prefix)) return true;
  if (/(?:是否|能否)(?:可以|能够|应当|需要)?$/u.test(prefix)) return true;
  // Naming a decision that belongs to a human does not make that decision.
  return /^(?:\s*(?:is|are|remains?|requires?|must be|belongs?)\s+[^.;。；]{0,45}(?:professional|human|authorized|review)|(?:的)?(?:决定|问题|权限)[^。；]{0,20}(?:专业|人工|负责人))/iu.test(suffix);
}
/** Only explicit directives/assertions are fatal. Descriptive or otherwise ambiguous
 * matches remain review notes; this is intentionally not a semantic safety proof. */
function explicitInstruction(prefix:string):boolean {
  return /^\s*(?:(?:please|immediately|now|then|also|you must|you should|we must|we should)\s+)*$/iu.test(prefix) ||
    /^(?:we|i|operations|the operations lead|the crew)\s+will\s*$/iu.test(prefix.trim()) ||
    /^(?:我们|机组|运行负责人)?(?:将|决定|已决定)\s*$/u.test(prefix.trim()) ||
    /(?:\b(?:ask|tell|instruct)\b[^;。；]{0,80}\bto\s*|\bbut\s*|\b(?:must|should|shall)\s*)$/iu.test(prefix) ||
    /^\s*(?:if|when)\b[^;。；]{0,120},\s*$/iu.test(prefix) ||
    /^\s*(?:请|立即|现在|马上|必须|应当|建议|先|再|然后|批准|允许|可以|应)*$/u.test(prefix) ||
    /(?:请[^，。；！？]{0,24}|必须|应当|建议|批准|允许)\s*$/u.test(prefix);
}
export function checkProse(text:string, _restricted:boolean, _unconfirmed:boolean, path:string, errors:string[], warnings?:ValidationWarning[]) {
  const checks:[RegExp,string][]=[[sendingClaim,'claims a notification was sent']];
  for (const rawClause of plainOutput(text).split(/[;；。!?！？\n]|(?<!\d)\.(?!\d)/u)) {
    const clause = rawClause.trim().replace(noticePattern, '').trim();
    for (const [pattern,reason] of checks) for (const match of clause.matchAll(pattern)) {
      const prefix = clause.slice(0,match.index), suffix = clause.slice(match.index+match[0].length);
      if (qualified(prefix, suffix)) continue;
      const definite = explicitInstruction(prefix) || /^(?:the\s+|all\s+|全部|所有)?$/iu.test(prefix.trim());
      if (warnings && !definite) warnings.push(warning('wording', path, reason + '.', clause.trim()));
      else errors.push(`${path}: ${reason}.`);
    }
  }
}
