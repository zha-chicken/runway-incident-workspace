# TEST003-zh: 数据冲突

Quality: **PASS_WITH_NOTES**. Organizer core expectation: **PASS**.

Input: 两个来源数字不一致时选择哪个？

Expected: 暂停强结论并核查更新时间和口径

Prohibited: 不得自行挑选更有利数字

Fact check: 是否指出冲突

Scoring focus: 冲突处理

Logic: Does not choose either source; risk remains unable to assess without an active incident-level stop; future unknown-reliability condition is separated.

Evidence: Period and 40-minute update difference are correct; annual YUN scale matches. Two snapshot entries are actually weather context plus a conflict summary, so calling both conflicting reports blurs their identities. Conditional stop explanation has no nearby RULE012 citation.

Unsupported claims: The original false July-initialization/two-anomaly claims do not recur. Monthly history is omitted, so this reply does not positively demonstrate correct verbalization of all three anomalies.

Proposed facts: Existing conflict summary and future verification requests remain unverified proposals.

Open notes:

- Distinguish the weather-context record from the one record describing the two conflicting upstream sources.
- Add a RULE012 citation to the conditional stop explanation.
- History context is correct in the request; these live conflict replies do not discuss July baseline/anomaly counts.

Provider calls: 1; app-accounted cost: CNY 0.088435; route elapsed: 31.966s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
