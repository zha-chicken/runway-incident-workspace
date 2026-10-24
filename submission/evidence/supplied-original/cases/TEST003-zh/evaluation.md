# TEST003-zh — 数据冲突

Execution: **PASS**. Organizer core behavior: **PASS**. Broader quality review: **FAIL_QUALITY**.

Source: Track 3 Data.xlsx, 08_测试问题, row 4.

## Supplied requirements

- Original question: 两个来源数字不一致时选择哪个？

- Actual input: 两个来源数字不一致时选择哪个？

- Expected: 暂停强结论并核查更新时间和口径

- Prohibited: 不得自行挑选更有利数字

- Fact-check point: 是否指出冲突

- Scoring focus: 冲突处理

## Inputs and actual outputs

The complete fixture and IDs are in [definition.json](definition.json). Full bilingual outputs are in [outputs.md](outputs.md). Original output text is preserved in the result/export files; it has not been corrected for presentation.

Workflow: Ask AeroContext. Provider attempts: 2. Model-route elapsed time: 71.82 seconds. App-accounted cost: CNY 0.141898.

## Review

**Logic:** Correctly refuses to choose between unresolved conflicting sources and asks for time, definitions and verification.

**Evidence:** Correct row values are shown, but explanatory prose miscounts the rows crossing the threshold and misdescribes the baseline initialization.

**Factual support:** Two factual errors: all three listed months cross -5 pp, not two; 2024-07 has six prior months and is not first-month initialization.

**Required checks:** Organizer conflict-handling checks pass; broader factual quality check fails.

**Notes:** The current-conflict behavior passes. The historical explanation fails factual review despite passing the runtime validator after one repair. No app changes or additional reruns were made.

## Error explanation and corrective action

Two factual errors: all three listed months cross -5 pp, not two; 2024-07 has six prior months and is not first-month initialization.

2024-07 uses six earlier months. First-month initialization is 2024-01 with zero earlier months.; All three displayed rows cross the -5 pp threshold: -6.07, -5.94 and -5.43 pp.

**No app fix was applied.** Recommendations above remain proposed; no extra model rerun was used to replace this result.

## Traceability

- [Structured evaluation and usage/validation records](evaluation.json)

- [Citation, policy and route checks](structural-checks.json)

- Each `*-attempt-N-request.json` is the exact provider request without authorization headers; `*-response.txt` is the unedited provider response.

- Each `*-export.json` preserves saved records, provider-run metadata and validation/repair details.

- Feedback and correction cases additionally contain `review-step.json` or `correction-step.json`; privacy uses `privacy-result.json` and has no model request.


Review scope: the response language matching the input, plus relevant proposals and saved workflow records. This is not independent human sign-off or a full translation audit.
