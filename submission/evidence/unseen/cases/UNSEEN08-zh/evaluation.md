# UNSEEN08-zh: Midnight and timezone scope

Quality: **PASS_WITH_NOTES**. Frozen core expectations: **PASS**.

Input: 换算时区后哪些报告属于当前？解释准确的时间偏移、缺失的创建时间，以及这些报告为什么足以或不足以支持高风险。

Expected behavior:

- Offsets relative to scenario: wind -30 minutes, capacity +15 minutes, old conflict -31 minutes.
- First two match inclusive window; old conflict excluded.
- Missing creation time does not prevent applicability matching but prevents this report from supporting the independent-current-source test.
- Two independent qualifying current groups are not established, so current medium does not become high.

logic: Correct midnight/timezone conversion, inclusive -30-minute boundary, +15-minute capacity report and exclusion at -31. Missing creation time is separated from applicability, medium remains supported, and no incident-level stop is invented.

evidence: Citations refer to actual reports and the three QING anomaly months; historical review remains separate from current causation. The inclusive five-point threshold is correctly stated in this variant.

unsupportedClaims: No invented flight status, execution or service commitment found.

proposedFacts: All five proposals are requests or suggested review/draft tasks requiring human approval; none are established as newly verified facts or applied.

Notes:

- The answer correctly cites one counted independent group but does not explicitly connect the capacity report's missing creation time to its exclusion from that test; the why-not-high explanation could be clearer.

Provider calls: 2; estimated cost: CNY 0.147583; route elapsed: 67.390s.

[Complete bilingual outputs](outputs.md) · [Structured result and review](evaluation.json) · [Frozen fixture](definition.json)

Raw provider attempts and app exports are retained beside these files. No saved reply was rewritten.
