// Bound model context, not stored history or how often someone may use the app.
export const DISCUSSION_HISTORY_LIMIT = 6;
export const FEEDBACK_CONTEXT_LIMITS = {reviews:24,bytes:48_000} as const;
export type FeedbackContextSummary = {included:number;total:number;omitted:number};
