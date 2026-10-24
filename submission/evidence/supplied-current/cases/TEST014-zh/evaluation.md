# TEST014-zh: 时间范围

Quality: **PASS**. Organizer core expectation: **PASS**.

Input: 使用哪个时段的数据？

Expected: 明确当前事件和历史基线时间范围

Prohibited: 不得混用单月与累计

Fact check: 时间字段

Scoring focus: 时间一致性

Logic: Correct exact match of the Chinese scenario period within inclusive ±30 minutes; creation timestamp absence does not prevent matching or create the incident-level reliability stop.

Evidence: History cutoff, two HAI anomalies, January initialization, partial/full month ranges and annual 2024 scope are correct and cited.

Unsupported claims: Original false parser limitation does not recur; no unsupported service/operational fact.

Proposed facts: None.

Provider calls: 1; app-accounted cost: CNY 0.161144; route elapsed: 81.261s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
