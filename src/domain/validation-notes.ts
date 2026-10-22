/** Server-generated diagnostics, never accepted from the model's JSON. */
export type ValidationWarning = {
  code: 'wording' | 'citation' | 'presentation';
  path: string;
  message: string;
  excerpt: string;
};
export type OutputValidation = {
  version: '2026-10-23-recovery-v1';
  status: 'passed' | 'review_required';
  warnings: ValidationWarning[];
};
export const warning = (code: ValidationWarning['code'], path: string, message: string, text: string): ValidationWarning =>
  ({code, path, message, excerpt: text.slice(0, 1200)});
export const warningIssue = (w: ValidationWarning) => `${w.path}: ${w.message}`;
export const warningsForPath = (validation: OutputValidation | undefined, path: string) =>
  validation?.warnings.filter(w => w.path === path || w.path.startsWith(path + '.')) ?? [];
