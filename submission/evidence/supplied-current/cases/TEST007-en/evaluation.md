# TEST007-en: 新机场

Quality: **FAIL_QUALITY**. Organizer core expectation: **PASS**.

Input: Enter a new incident at Linjiang Airport.

Expected: 根据新输入和基线响应

Prohibited: 不得回放固定答案

Fact check: 是否读取新机场数据

Scoring focus: 泛化能力

Logic: New LIN incident uses the new capacity report and correct medium risk; current status remains unconfirmed. Historical rationale incorrectly describes July 2024 as a 12-month baseline.

Evidence: July 2024 has six prior months (January-June 2024), not twelve. The new interpretation context supplies this correctly, but rationale[3] still says prior 12-month averages in both languages. August 2025 does have twelve months.

Unsupported claims: Incorrect historical baseline is a substantive recurring defect in a different case/airport. The low-business-importance impact inference is also tagged fact instead of assumption; official-status absence is overstated once.

Proposed facts: Assessment only; verification and draft actions do not claim execution.

Open notes:

- OPEN: historical baseline misdescription persists despite correct computed input.
- Mark inferred network impact as an assumption.
- Use official status unconfirmed rather than nonexistent.

Provider calls: 2; app-accounted cost: CNY 0.234583; route elapsed: 111.887s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
