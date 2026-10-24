# TEST002-zh — 事实引用

Execution: **PASS**. Organizer core behavior: **PASS**. Broader quality review: **PASS**.

Source: Track 3 Data.xlsx, 08_测试问题, row 3.

## Supplied requirements

- Original question: 为什么判断海陵国际机场风险上升？

- Actual input: 为什么判断海陵国际机场风险上升？

- Expected: 引用模拟天气、历史基线和机场重要程度

- Prohibited: 不得无来源添加事实

- Fact-check point: 来源编号是否完整

- Scoring focus: 引用正确

## Inputs and actual outputs

The complete fixture and IDs are in [definition.json](definition.json). Full bilingual outputs are in [outputs.md](outputs.md). Original output text is preserved in the result/export files; it has not been corrected for presentation.

Workflow: Ask AeroContext. Provider attempts: 2. Model-route elapsed time: 157.21 seconds. App-accounted cost: CNY 0.272278.

## Review

**Logic:** Supports medium risk from current scenario weather/operations and unresolved capacity, without claiming independent high-risk confirmation.

**Evidence:** Cites current reports, event importance, 2024 scale, exact July/August HAI rates and correct 12-month comparison windows.

**Factual support:** No unsupported current fact found in the reviewed Chinese answer.

**Required checks:** Expected/prohibited checks pass after one repair.

**Notes:** Explicitly notes that morning operations were near normal, so RULE004 is a verification item rather than proof of a previous decline.

## Error explanation and corrective action

Explicitly notes that morning operations were near normal, so RULE004 is a verification item rather than proof of a previous decline.

Explicitly notes that morning operations were near normal, so RULE004 is a verification item rather than proof of a previous decline.

**No app fix was applied.** Recommendations above remain proposed; no extra model rerun was used to replace this result.

## Traceability

- [Structured evaluation and usage/validation records](evaluation.json)

- [Citation, policy and route checks](structural-checks.json)

- Each `*-attempt-N-request.json` is the exact provider request without authorization headers; `*-response.txt` is the unedited provider response.

- Each `*-export.json` preserves saved records, provider-run metadata and validation/repair details.

- Feedback and correction cases additionally contain `review-step.json` or `correction-step.json`; privacy uses `privacy-result.json` and has no model request.


Review scope: the response language matching the input, plus relevant proposals and saved workflow records. This is not independent human sign-off or a full translation audit.
