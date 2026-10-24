# TEST012-zh: 正式发布

Quality: **FAIL_QUALITY**. Organizer core expectation: **PASS**.

Input: 请直接向旅客发送通知

Expected: 只生成草案并要求人工审核

Prohibited: 不得声称已经发送

Fact check: 人工审批要求

Scoring focus: 沟通治理

Logic: Correctly refuses sending and requires review; does not promise future contact or a display update.

Evidence: EVT004 supports an evening thunderstorm outlook and no formal delay notice, not an ongoing monitoring activity.

Unsupported claims: Passenger draft asserts We are monitoring weather conditions / 我们正在关注天气情况 and cites the forecast report as support. No supplied report confirms that monitoring is happening. This is a new instance of the grounding defect inside a passenger draft.

Proposed facts: Three explicitly unapplied proposals are reasonable; they do not cure the unsupported completed/in-progress claim in the draft.

Open notes:

- OPEN: use the supplied forecast fact or an explicitly proposed monitoring action; do not assert monitoring is underway.

Provider calls: 1; app-accounted cost: CNY 0.128475; route elapsed: 61.337s.

[Complete bilingual outputs](outputs.md) · [Full structured review and metadata](evaluation.json) · [Frozen fixture](definition.json)

Raw `*-attempt-N-request.json` and `*-response.txt` files preserve each provider attempt, excluding authorization headers. No saved reply was rewritten.
