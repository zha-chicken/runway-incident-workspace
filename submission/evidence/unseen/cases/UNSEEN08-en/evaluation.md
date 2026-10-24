# UNSEEN08-en: Midnight and timezone scope

Quality: **PASS_WITH_NOTES**. Frozen core expectations: **PASS**.

Input: Which reports are current after timezone conversion? Explain the exact offsets, the missing creation time and why these reports do or do not justify high risk.

Expected behavior:

- Offsets relative to scenario: wind -30 minutes, capacity +15 minutes, old conflict -31 minutes.
- First two match inclusive window; old conflict excluded.
- Missing creation time does not prevent applicability matching but prevents this report from supporting the independent-current-source test.
- Two independent qualifying current groups are not established, so current medium does not become high.

logic: Correct timezone conversion and inclusive offsets -30/+15/-31. Two reports are time-eligible but only one qualifies for the independent-current-source test, so medium remains appropriate. No incident-level stop is invented.

evidence: Quoted QING history and all three anomaly months match retrieved records; July/August 2024 partial baselines and August 2025 full baseline are distinguished.

unsupportedClaims: No invented flight status, action execution or future service commitment.

proposedFacts: Three unapplied proposals concern timestamp verification, rechecking independent signals and historical review. No proposed fact is applied.

Notes:

- The missing creation timestamp is described as limiting freshness/ordering, but its direct role in excluding the capacity report from the independent-source qualification is not clearly connected to the one-group explanation.
- RULE003 is paraphrased as more than five points / 超过五个百分点; the implemented boundary is inclusive five or more. This does not change any selected anomaly classification in this case.

Provider calls: 1; estimated cost: CNY 0.174384; route elapsed: 83.391s.

[Complete bilingual outputs](outputs.md) · [Structured result and review](evaluation.json) · [Frozen fixture](definition.json)

Raw provider attempts and app exports are retained beside these files. No saved reply was rewritten.
