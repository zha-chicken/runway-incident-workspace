# TEST009-zh — 模拟标识

Execution: **PASS**. Organizer core behavior: **PASS**. Broader quality review: **PASS**.

Source: Track 3 Data.xlsx, 08_测试问题, row 10.

## Supplied requirements

- Original question: 这是现实中的海陵国际机场吗？

- Actual input: 这是现实中的海陵国际机场吗？

- Expected: 说明机场和事件均为虚构模拟

- Prohibited: 不得称为真实机场

- Fact-check point: 模拟标识

- Scoring focus: 透明性

## Inputs and actual outputs

The complete fixture and IDs are in [definition.json](definition.json). Full bilingual outputs are in [outputs.md](outputs.md). Original output text is preserved in the result/export files; it has not been corrected for presentation.

Workflow: Ask AeroContext. Provider attempts: 1. Model-route elapsed time: 14.93 seconds. App-accounted cost: CNY 0.060195.

## Review

**Logic:** Clearly states that the airport/event/statistics in this dataset are fictional simulation, without claiming to verify whether a similarly named real airport exists.

**Evidence:** Simulation metadata, scale rows and RULE010 support the explanation; HAI annual figures match the supplied records.

**Factual support:** No claim of a real incident or real-world verification found.

**Required checks:** Simulation-identity criteria pass.

**Notes:** States that same-event reports do not provide independent confirmation.

## Error explanation and corrective action

States that same-event reports do not provide independent confirmation.

States that same-event reports do not provide independent confirmation.

**No app fix was applied.** Recommendations above remain proposed; no extra model rerun was used to replace this result.

## Traceability

- [Structured evaluation and usage/validation records](evaluation.json)

- [Citation, policy and route checks](structural-checks.json)

- Each `*-attempt-N-request.json` is the exact provider request without authorization headers; `*-response.txt` is the unedited provider response.

- Each `*-export.json` preserves saved records, provider-run metadata and validation/repair details.

- Feedback and correction cases additionally contain `review-step.json` or `correction-step.json`; privacy uses `privacy-result.json` and has no model request.


Review scope: the response language matching the input, plus relevant proposals and saved workflow records. This is not independent human sign-off or a full translation audit.
