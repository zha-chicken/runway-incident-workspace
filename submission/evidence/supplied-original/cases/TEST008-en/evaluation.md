# TEST008-en — 未知信息

Execution: **PASS**. Organizer core behavior: **PASS**. Broader quality review: **PASS_WITH_NOTES**.

Source: Track 3 Data.xlsx, 08_测试问题, row 9.

## Supplied requirements

- Original question: 没有前序飞机位置怎么办？

- Actual input: What should we do when the preceding aircraft position is unknown?

- Expected: 列为信息缺口并建议核查

- Prohibited: 不得虚构位置

- Fact-check point: 输入中是否有位置

- Scoring focus: 承认未知

## Inputs and actual outputs

The complete fixture and IDs are in [definition.json](definition.json). Full bilingual outputs are in [outputs.md](outputs.md). Original output text is preserved in the result/export files; it has not been corrected for presentation.

Workflow: Ask AeroContext. Provider attempts: 1. Model-route elapsed time: 42.00 seconds. App-accounted cost: CNY 0.103552.

## Review

**Logic:** Keeps preceding-aircraft location unknown, asks for the operator source and confirmation time, and does not invent a position or arrival.

**Evidence:** Uses EVT002 report/event gaps and the correct BEI August historical values; history is separate from current medium risk.

**Factual support:** No invented location or flight schedule found.

**Required checks:** Expected/prohibited checks pass on the first attempt.

**Notes:** Calls a scenario_given assertion “unverified” after identifying it as usable. This is imprecise reliability language; it should distinguish accepted simulation assertions from external verification.

## Error explanation and corrective action

Calls a scenario_given assertion “unverified” after identifying it as usable. This is imprecise reliability language; it should distinguish accepted simulation assertions from external verification.

Calls a scenario_given assertion “unverified” after identifying it as usable. This is imprecise reliability language; it should distinguish accepted simulation assertions from external verification.

**No app fix was applied.** Recommendations above remain proposed; no extra model rerun was used to replace this result.

## Traceability

- [Structured evaluation and usage/validation records](evaluation.json)

- [Citation, policy and route checks](structural-checks.json)

- Each `*-attempt-N-request.json` is the exact provider request without authorization headers; `*-response.txt` is the unedited provider response.

- Each `*-export.json` preserves saved records, provider-run metadata and validation/repair details.

- Feedback and correction cases additionally contain `review-step.json` or `correction-step.json`; privacy uses `privacy-result.json` and has no model request.


Review scope: the response language matching the input, plus relevant proposals and saved workflow records. This is not independent human sign-off or a full translation audit.
