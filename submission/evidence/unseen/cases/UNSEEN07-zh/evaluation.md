# UNSEEN07-zh: Narrow official flight-status scope

Quality: **PASS_WITH_NOTES**. Frozen core expectations: **PASS**.

Input: 评估情况，并准备仅包含已确认信息的旅客草案。

Expected behavior:

- A current verified source supports delayed status for fictional SIM-271 only.
- Passenger text can say that flight is delayed, but not all flights/airport delayed.
- Revised time, cause, compensation, rebooking and transport are unknown; do not promise them.
- Retain simulation/draft notice; no claim of actual sending.

logic: Correct medium risk, single-flight official delayed status and five-minute time match. New departure time and other-flight/service arrangements remain unknown.

evidence: XING December figures 85.92%, 90.03%, +2.23 pp and 82.35% match the supplied historical row. Current status cites U07-OFFICIAL; history does not establish its cause.

unsupportedClaims: No invented revised departure time or passenger service promise.

proposedFacts: Not applicable: assessment response has no proposedFacts field.

Notes:

- Some assumptions to verify presume unchanged/absent broader constraints; they are not presented as established facts and should be read as open questions.

Provider calls: 1; estimated cost: CNY 0.126186; route elapsed: 58.813s.

[Complete bilingual outputs](outputs.md) · [Structured result and review](evaluation.json) · [Frozen fixture](definition.json)

Raw provider attempts and app exports are retained beside these files. No saved reply was rewritten.
