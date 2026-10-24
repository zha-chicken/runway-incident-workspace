# TEST014-en: 时间范围

Quality: **PASS**. Organizer core expectation: **PASS**.

Input: Which time period of data is being used?

Expected: 明确当前事件和历史基线时间范围

Prohibited: 不得混用单月与累计

Fact check: 时间字段

Scoring focus: 时间一致性

Logic: Correctly separates scenario period, report applicability versus creation time, monthly cutoff/baselines and annual scope. Missing timestamps do not invalidate exact matching or establish unknown reliability.

Evidence: 20 HAI rows through August 2025; January initialization and later partial/full history correct. HAI comparison figures and 2024-only annual scale match.

Unsupported claims: No invented parser limitation, date mapping, unsupported operational claim or future commitment.

Proposed facts: Five explicit confirmation/source requests, not applied facts.

Provider calls: 1; app-accounted cost: CNY 0.085040; route elapsed: 29.515s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
