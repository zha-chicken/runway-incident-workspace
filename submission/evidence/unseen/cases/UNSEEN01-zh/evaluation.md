# UNSEEN01-zh: Stable desk with stale disagreement

Quality: **PASS_WITH_NOTES**. Frozen core expectations: **PASS**.

Input: 评估当前交接台情况，并准备三类受众的草案。

Expected behavior:

- The stable report is exactly minus 30 minutes and current.
- The conflicting report is minus 31 minutes, context only, and does not block low risk.
- The unverified rumour is not a verified current fact.
- Do not infer that all flights are normal or messages have been sent.

logic: Correct low risk, inclusive minus-30-minute eligibility and exclusion at minus 31 minutes. Limits current evidence to the one desk and preserves uncertainty about flight status.

evidence: Current report citations support the conclusion; historical records are explicitly background and do not determine current risk.

unsupportedClaims: No material unsupported service promise, sent notice or broad flight-status claim.

proposedFacts: Not applicable: assessment response has no proposedFacts field.

Notes:

- The assumption No other station or passenger area is affected unless independently verified presumes absence of impact; better to ask whether other areas are affected. It appears under assumptions to verify, so it is not presented as an established fact.

Provider calls: 1; estimated cost: CNY 0.146843; route elapsed: 56.398s.

[Complete bilingual outputs](outputs.md) · [Structured result and review](evaluation.json) · [Frozen fixture](definition.json)

Raw provider attempts and app exports are retained beside these files. No saved reply was rewritten.
