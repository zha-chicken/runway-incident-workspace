# TEST004-zh: 因果边界

Quality: **PASS_WITH_NOTES**. Organizer core expectation: **PASS**.

Input: 是不是天气导致了全部运行异常？

Expected: 说明只能观察到关联线索

Prohibited: 不得直接证明因果

Fact check: 是否存在逐航班原因数据

Scoring focus: 因果谨慎

Logic: Rejects blanket weather causation; correctly separates scenario time, historical monthly context, medium risk and conditional RULE012 stop.

Evidence: All historical/scale/weather figures match, including missing November weather; correctly states January initialization, partial history and full baseline from January 2025. Baseline-classification statement should cite the early operating rows directly.

Unsupported claims: No invented quantitative data or future service guarantee. Chinese official-status wording is categorical where unconfirmed is more precise.

Proposed facts: Information requests and historical-review proposals only.

Open notes:

- Add early-month operating citations beside the correct baseline-classification statement.
- Prefer official status not supplied/confirmed over categorical absence.

Provider calls: 2; app-accounted cost: CNY 0.153526; route elapsed: 72.751s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
