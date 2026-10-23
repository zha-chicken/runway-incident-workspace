export const MESSAGE_NOTICE = 'SIMULATION / 模拟 — DRAFT / 草案';

// Move only a leading label, never matching wording inside a claim, citation or code.
// Accept the existing English, Chinese and bilingual labels, optionally emphasized.
const leadingNotice = /^\s*(?:>\s*)?(?:#{1,6}\s+)?(\*\*|__|\*|_)?((?:SIMULATION(?:\s*\/\s*模拟)?|模拟(?:\s*\/\s*SIMULATION)?)\s*[/—–:：|-]\s*(?:DRAFT(?:\s*\/\s*草案)?|草案(?:\s*\/\s*DRAFT)?)(?![a-z]))[.。]?\1[.。]?(?:[ \t]+[—–-][ \t]+)?(?:[ \t]*\r?\n)?[ \t]*/iu;

/** The source remains untouched; only the rendered leading label changes location. */
export function splitMessageNotice(text: string): {notice: string; body: string} {
  const match = leadingNotice.exec(text);
  return match ? {notice: match[2], body: text.slice(match[0].length)} : {notice: MESSAGE_NOTICE, body: text};
}
