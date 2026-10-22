import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type {Nodes, Root, PhrasingContent} from 'mdast';

export const CITATION_PREFIX = '#evidence:';
export const citationHref = (id: string) => CITATION_PREFIX + encodeURIComponent(id);

/** A citation is an exact source ID, never a network URL or a model-supplied selector. */
export function citationId(href: string | undefined): string | null {
  if (!href?.startsWith(CITATION_PREFIX)) return null;
  try { return decodeURIComponent(href.slice(CITATION_PREFIX.length)) || null; }
  catch { return null; }
}

const parser = unified().use(remarkParse).use(remarkGfm);

/** Parse links as Markdown, including reference links; code samples are not citations. */
export function discussionLinks(markdown: string): string[] {
  const root = parser.parse(markdown);
  const definitions = new Map<string, string>();
  const walk = (node: Nodes, visit: (node: Nodes) => void) => {
    visit(node);
    if ('children' in node) node.children.forEach(child => walk(child, visit));
  };
  walk(root, node => {
    if (node.type === 'definition' && !definitions.has(node.identifier.toUpperCase())) {
      definitions.set(node.identifier.toUpperCase(), node.url);
    }
  });
  const links: string[] = [];
  walk(root, node => {
    if (node.type === 'link') links.push(node.url);
    if (node.type === 'linkReference') {
      const url = definitions.get(node.identifier.toUpperCase());
      if (url !== undefined) links.push(url);
    }
  });
  return links;
}

/** Make existing, explicitly named sources clickable without rewriting stored replies. */
export function remarkKnownCitations({evidenceIds}: {evidenceIds: string[]}) {
  const ids = [...new Set(evidenceIds)].sort((a, b) => b.length - a.length);
  const pattern = ids.length ? new RegExp(`(?<![\\p{L}\\p{N}_:/-])(?:${ids.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}\\p{N}_:/-])`, 'gu') : null;
  return (tree: Root) => {
    if (!pattern) return;
    const walk = (parent: Nodes) => {
      if (!('children' in parent) || parent.type === 'link' || parent.type === 'linkReference') return;
      // Text nodes are inline content even when the containing parent also permits blocks.
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child.type !== 'text') { walk(child); continue; }
        const parts: PhrasingContent[] = [];
        let start = 0;
        for (const match of child.value.matchAll(pattern)) {
          if (match.index > start) parts.push({type: 'text', value: child.value.slice(start, match.index)});
          parts.push({type: 'link', url: citationHref(match[0]), children: [{type: 'text', value: match[0]}]});
          start = match.index + match[0].length;
        }
        if (!parts.length) continue;
        if (start < child.value.length) parts.push({type: 'text', value: child.value.slice(start)});
        (parent.children as Nodes[]).splice(i, 1, ...parts);
        i += parts.length - 1;
      }
    };
    walk(tree);
  };
}

// Match complete numeric quantities, never digits embedded in source IDs or aircraft names.
// Chinese text may immediately surround a quantity; ASCII identifier boundaries stay protected.
const dataPattern = /(?<![A-Za-z0-9_:/-])(?:[+−±-]?\d+(?:\.\d+)?(?:\s?[%％]|\s+(?:pp\b|percentage points?\b)|\s*(?:个)?百分点)|\d{4}-\d{2}(?:-\d{2})?(?![\d-])|\d{1,2}:\d{2}(?:\s?(?:AM|PM)\b)?|[+−±-]?\d+(?:\.\d+)?(?:[ -](?:minutes?|hours?|months?|days?|flights?|airports?)\b|\s*(?:分钟|小时|个月|天|个航班|个机场)))(?![A-Za-z0-9_:/-])/giu;

/** Visual emphasis only: preserve every character, sign, unit and precision of the answer. */
export function remarkDataHighlights() {
  const highlight = (value: string): PhrasingContent => ({
    type: 'emphasis', data: {hName: 'span', hProperties: {className: ['data-highlight']}},
    children: [{type: 'text', value}]
  });
  return (tree: Root) => {
    const walk = (parent: Nodes) => {
      if (!('children' in parent) || parent.type === 'link' || parent.type === 'linkReference' || parent.data?.hName === 'span') return;
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child.type !== 'text' && child.type !== 'inlineCode') { walk(child); continue; }
        const matches = [...child.value.matchAll(dataPattern)];
        // Inline code is a deliberate numeric highlight only when it contains one whole quantity.
        // Leave real code and fenced blocks alone.
        if (child.type === 'inlineCode') {
          if ((matches.length === 1 && matches[0][0] === child.value) || /^[+−±-]?\d+(?:\.\d+)?$/.test(child.value)) (parent.children as Nodes[])[i] = highlight(child.value);
          continue;
        }
        if (!matches.length) continue;
        const parts: PhrasingContent[] = [];
        let start = 0;
        for (const match of matches) {
          if (match.index > start) parts.push({type: 'text', value: child.value.slice(start, match.index)});
          parts.push(highlight(match[0]));
          start = match.index + match[0].length;
        }
        if (start < child.value.length) parts.push({type: 'text', value: child.value.slice(start)});
        (parent.children as Nodes[]).splice(i, 1, ...parts);
        i += parts.length - 1;
      }
    };
    walk(tree);
  };
}

/** Hide duplicate labels only when the same notice is already displayed above the answer. */
export function remarkSingleDiscussionNotice({enabled}: {enabled: boolean}) {
  const pattern = /SIMULATION\s*\/\s*模拟\s*[—–-]\s*DRAFT\s*\/\s*草案[.。]?[ \t]*/giu;
  return (tree: Root) => {
    if (!enabled) return;
    const walk = (parent: Nodes): boolean => {
      if (!('children' in parent) || parent.type === 'link' || parent.type === 'linkReference') return false;
      let endedWithNotice = false;
      const children: Nodes[] = [];
      for (const child of parent.children) {
        if (child.type === 'text') {
          // A bold/italic notice may leave its punctuation in the next text node.
          const value: string = endedWithNotice ? child.value.replace(/^[.。]?[ \t]*/, '') : child.value;
          const last = [...value.matchAll(pattern)].at(-1);
          child.value = value.replace(pattern, '');
          endedWithNotice = !!last && last.index + last[0].length === value.length;
          if (child.value) children.push(child);
        } else {
          const ended = walk(child);
          endedWithNotice = ['strong', 'emphasis', 'delete'].includes(child.type) && ended;
          if (!('children' in child) || child.children.length) children.push(child);
        }
      }
      (parent.children as Nodes[]) = children;
      return endedWithNotice;
    };
    walk(tree);
  };
}

/** Move an existing leading notice into the header without rewriting stored text. */
export function splitDiscussionNotice(text: string): {notice: string | null; body: string} {
  const match = /^\s*(?:>\s*)?(?:\*\*)?(SIMULATION\s*\/\s*模拟\s*[—–-]\s*DRAFT\s*\/\s*草案)(?:\*\*)?[.。]?\s*/iu.exec(text);
  return match ? {notice: match[1], body: text.slice(match[0].length)} : {notice: null, body: text};
}
