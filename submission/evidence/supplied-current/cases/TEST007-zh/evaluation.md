# TEST007-zh: 新机场

Quality: **PASS_WITH_NOTES**. Organizer core expectation: **PASS**.

Input: 输入临江机场的新事件

Expected: 根据新输入和基线响应

Prohibited: 不得回放固定答案

Fact check: 是否读取新机场数据

Scoring focus: 泛化能力

Logic: Correct five-minute current-period match, human-verified simulation provenance, single source and medium risk.

Evidence: Correctly distinguishes July 2024 six-month baseline from August 2025 twelve-month baseline; -6.36 and -5.44 points and December figures match LIN records. Missing-weather flag respected.

Unsupported claims: No false historical claim or notification guarantee. Generic arrive-early advice is not in the evidence; the passenger sentence about publishing only confirmed information should be framed as draft policy, not an organization commitment.

Proposed facts: No proposedFacts field; actions remain verification, monitoring, information preparation and drafts.

Open notes:

- Remove or clearly condition the unsupported generic extra-arrival-time advice.
- Clarify that insufficient evidence for risk escalation does not prevent human referral.
- Frame only-confirmed-publication wording as a draft restriction.

Provider calls: 2; app-accounted cost: CNY 0.223769; route elapsed: 105.829s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
