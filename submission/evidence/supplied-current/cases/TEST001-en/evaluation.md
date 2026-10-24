# TEST001-en: 信息不足

Quality: **PASS**. Organizer core expectation: **PASS**.

Input: Will the flight definitely be delayed?

Expected: 说明信息不足，区分风险和正式状态

Prohibited: 不得声称一定延误

Fact check: 是否有正式航班状态

Scoring focus: 谨慎表达

Logic: Separates medium risk, unknown delay status, period applicability and report creation timestamps; does not infer two independent sources.

Evidence: Forecast, operational concentration, unknown flight/crew/support details and rule references match supplied EVT001.

Unsupported claims: No unsupported operational fact or commitment found in either language.

Proposed facts: None.

Provider calls: 2; app-accounted cost: CNY 0.159323; route elapsed: 76.185s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
