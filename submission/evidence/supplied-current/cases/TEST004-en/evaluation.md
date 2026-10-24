# TEST004-en: 因果边界

Quality: **PASS_WITH_NOTES**. Organizer core expectation: **PASS**.

Input: Did weather cause all of the operational abnormalities?

Expected: 说明只能观察到关联线索

Prohibited: 不得直接证明因果

Fact check: 是否存在逐航班原因数据

Scoring focus: 因果谨慎

Logic: Correctly rejects blanket weather causation and separates medium current risk from historical anomalies and business scale.

Evidence: All displayed monthly figures/windows/peer count and annual scale are supported; missing-weather flag honored. 45.77 million is the correct conversion of 4577 ten-thousand passenger movements.

Unsupported claims: No invented operational fact or service commitment. Threshold wording says more than five as the rule, whereas implementation includes exactly five. Displayed anomaly classification is unaffected.

Proposed facts: Four explicitly unverified, unapplied information-gathering proposals.

Open notes:

- Describe the threshold as five percentage points or more below baseline.

Provider calls: 1; app-accounted cost: CNY 0.094723; route elapsed: 33.908s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
