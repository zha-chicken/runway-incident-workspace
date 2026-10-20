import {AppError} from '../domain/privacy';
import type {Usage} from '../server/budget';

export type ApiFormat = 'responses' | 'chat_completions';
export type Effort = 'high' | 'max';
export type ModelRequest = {
  instructions: string; input: string; schema: Record<string, unknown>;
  schemaName: string; maxOutput: number; deadlineMs: number;
  apiFormat: ApiFormat; effort: Effort; signal?: AbortSignal;
};
export type ModelResponse = {
  text: string; usage: Usage | null; status: 'completed' | 'incomplete' | 'failed';
  providerId: string | null; model: string | null; fingerprint: string | null;
  terminal: string; latencyMs: number;
};
export function requestBody(r: ModelRequest) {
  if (r.apiFormat === 'responses') return {
    model: 'deepseek-flash', instructions: r.instructions, input: r.input,
    reasoning: {effort: r.effort}, max_output_tokens: r.maxOutput,
    text: {format: {type: 'json_schema', name: r.schemaName, schema: r.schema}},
    stream: false
  };
  return {
    model: 'deepseek-flash', thinking: {type: 'enabled'}, reasoning_effort: r.effort,
    max_tokens: r.maxOutput, response_format: {type: 'json_object'}, stream: false,
    messages: [{role: 'system', content: r.instructions + '\nJSON schema:\n' + JSON.stringify(r.schema)}, {role: 'user', content: r.input}]
  };
}
export function normalizeResponse(raw: Record<string, any>, format: ApiFormat, latencyMs = 0): ModelResponse {
  const usageRaw = raw.usage;
  const usage: Usage | null = usageRaw && Number.isFinite(format === 'responses' ? usageRaw.input_tokens : usageRaw.prompt_tokens) &&
    Number.isFinite(format === 'responses' ? usageRaw.output_tokens : usageRaw.completion_tokens) ? {
      input: format === 'responses' ? usageRaw.input_tokens : usageRaw.prompt_tokens,
      cached: format === 'responses' ? usageRaw.input_tokens_details?.cached_tokens ?? 0 : usageRaw.prompt_cache_hit_tokens ?? 0,
      output: format === 'responses' ? usageRaw.output_tokens : usageRaw.completion_tokens,
      reasoning: format === 'responses' ? usageRaw.output_tokens_details?.reasoning_tokens ?? null : usageRaw.completion_tokens_details?.reasoning_tokens ?? null,
      raw: usageRaw
    } : null;
  if (usage && (usage.input < 0 || usage.cached < 0 || usage.cached > usage.input || usage.output < 0)) throw new AppError('PROVIDER_USAGE_INVALID', 502);
  let text = '', status: ModelResponse['status'] = 'failed', terminal = 'unknown';
  if (format === 'responses') {
    terminal = raw.status || 'unknown';
    const items = Array.isArray(raw.output) ? raw.output : [];
    const forbidden = items.some((item: any) => !['reasoning', 'message'].includes(item.type) ||
      (item.type === 'message' && item.content?.some((p: any) => p.type !== 'output_text')));
    text = items.filter((i: any) => i.type === 'message').flatMap((i: any) => i.content || [])
      .filter((p: any) => p.type === 'output_text').map((p: any) => p.text || '').join('');
    status = terminal === 'completed' && !forbidden && !raw.error ? 'completed' : terminal === 'incomplete' ? 'incomplete' : 'failed';
  } else {
    const choice = raw.choices?.[0];
    terminal = choice?.finish_reason || 'unknown';
    text = typeof choice?.message?.content === 'string' ? choice.message.content : '';
    status = terminal === 'stop' && !choice?.message?.tool_calls?.length && !choice?.message?.refusal ? 'completed' : terminal === 'length' ? 'incomplete' : 'failed';
  }
  return {text, usage, status, terminal, providerId: raw.id || null, model: raw.model || null, fingerprint: raw.system_fingerprint || null, latencyMs};
}
export async function callModel(r: ModelRequest): Promise<ModelResponse> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new AppError('API_KEY_MISSING', 503);
  const started = Date.now();
  const signal = r.signal ? AbortSignal.any([r.signal, AbortSignal.timeout(r.deadlineMs)]) : AbortSignal.timeout(r.deadlineMs);
  // Use the process's normal proxy configuration (Node --use-env-proxy).
  const response = await fetch(`https://api.deepseek.com/${r.apiFormat === 'responses' ? 'responses' : 'chat/completions'}`, {
    method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${key}`},
    body: JSON.stringify(requestBody(r)), signal
  });
  if (!response.ok) throw new AppError(response.status === 401 ? 'PROVIDER_AUTH' : response.status === 429 ? 'PROVIDER_RATE_LIMIT' : 'PROVIDER_HTTP_ERROR', 502);
  const raw = await response.json();
  return normalizeResponse(raw, r.apiFormat, Date.now() - started);
}
