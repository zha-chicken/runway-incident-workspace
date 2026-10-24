# D05 — Synthetic feedback demonstrations / 模拟评审反馈示例

**SIMULATION / 模拟 — SYNTHETIC REVIEWER RECORDS / 模拟评审记录**

These five examples were created from zero at the user’s request. Reviewer identities, decisions, reasons and later exercise outcomes are synthetic. No existing user feedback was reused. They are not participant research or independent human/professional validation. The initial bilingual assessment is an actual DeepSeek response. Production API route handlers saved the records in an isolated database; this package does not evaluate browser usability.

本材料从零创建，未复用已有用户反馈。评审身份、决定、理由及模拟结果均为演示数据，不代表真实参与者或航空专业人士的意见。初评来自真实模型调用；重新评估因校验失败未保存，不得将本例描述为成功的完整闭环。

**Important result: the five review examples and two later outcome revisions were saved. Reassessment failed after the existing single repair and did not create a new assessment. Its raw replies, validation issues and retained original assessment are preserved. A successful new rejection → saved reassessment remains open.**

Incident: `98c49269-fb85-482a-a8ee-54a31208a73d`. Original saved assessment: high risk at Simulation Day 61, 16:00. New snapshot: 17:00; policy computes low risk from newer fictional reports. That computed policy is not a saved model reassessment. Official flight status stays unconfirmed.

## Demonstration coverage

| Decision | What it demonstrates | Later outcome |
|---|---|---|
| Accepted / 接受 | Decision recorded separately from execution. | One later simulated observation; another outcome remains pending. |
| Modified / 修改 | Complete replacement proposal, original text and reason retained. | Actual action blank; outcome pending. |
| Rejected / 拒绝 | Earlier escalation challenged using newer evidence, not reviewer preference alone. | Attempted reassessment failed; original assessment retained. |
| Pending / 待定 | No implied approval, action or success. | Actual action blank; outcome pending. |

## New fictional case

At 16:00, a gust-risk report and a baggage-cart shortage expanding from one to two support zones justify high risk. At 17:00, new exercise reports describe stable weather and adequate carts in both formerly affected zones. The earlier reports remain as unusable history outside the ±30-minute window. The synthetic reviewer rejects reusing the old high-risk escalation unchanged; the original recommendation was reasonable for the earlier evidence. Reassessment was requested using the new reports and all five review records. No aircraft release, flight-status confirmation or sent message is claimed.

## Records / 反馈记录

### Example 1: accepted / `first`

**Original model recommendation / 原始模型建议**

Verify both current reports with support control and meteorology: confirm the two affected support zones, cart shortfall size, start time, recovery estimate, gust timing, and whether any official flight status or operational warning exists.

向保障控制和气象部门核实两份当前报告：确认受影响的两个保障区、拖斗缺口数量、开始时间、预计恢复时间、阵风时段，以及是否存在正式航班状态或运行警告。

Evidence: REPORT:D05-WIND-INITIAL, REPORT:D05-SUPPORT-INITIAL

| Required field / 必需字段 | Saved value / 已保存内容 |
|---|---|
| 事件编号 | 98c49269-fb85-482a-a8ee-54a31208a73d |
| 建议编号 | first |
| 人工处理结果 | accepted |
| 修改或拒绝原因 | SYNTHETIC REVIEW: Accept the source-and-time verification objective. New 16:55/17:00 exercise handover reports are available; checking their scope and provenance is appropriate. Acceptance is not confirmation of execution or permission for flight operations. |
| 最终采取的行动 | SYNTHETIC EXERCISE FOLLOW-UP: the simulated reviewer compared D05-SUPPORT-CLEAR and D05-WEATHER-CLEAR, recorded their applicable times and scope, and retained the earlier reports as unusable history. No real airport was contacted or operation performed. |
| 事后结果 | SIMULATED OBSERVATION: the authored exercise reports describe adequate carts in both previously affected zones and stable weather at 17:00. Official flight status remains unconfirmed. This is a fictional exercise outcome, not measured field performance. |
| 下次改进建议 | SYNTHETIC REVIEW: Separate applicability, verification basis and official-status uncertainty. Record any later action explicitly. |
| 复核人 | SYNTHETIC-D05 reviewer role |
| 复核日期 | 2026-10-24T01:59:38.646Z |

Outcome status: `simulated_observed`. Original assessment `2b9a4eb6-dd62-4749-91ad-799e9b49fe86` / snapshot 1. Review revision `e89d7e3b-eae8-4207-90e5-5ea74b76c7d1`. Review date is the actual application save time; the incident’s day/time is fictional.

### Example 2: modified / `follow-1`

**Original model recommendation / 原始模型建议**

Monitor at short intervals for expansion beyond two support zones, changes in gust reports, and any official status change; log source and time for each update.

短间隔监测保障区是否扩大到两个以上、阵风报告是否变化，以及正式状态是否变化；记录每次更新的来源和时间。

Evidence: REPORT:D05-WIND-INITIAL, REPORT:D05-SUPPORT-INITIAL

| Required field / 必需字段 | Saved value / 已保存内容 |
|---|---|
| 事件编号 | 98c49269-fb85-482a-a8ee-54a31208a73d |
| 建议编号 | follow-1 |
| 人工处理结果 | modified |
| 修改或拒绝原因 | SYNTHETIC REVIEW: Short intervals has no assigned owner or approved cadence. Replace it with an owner-and-trigger checklist rather than inventing a fixed interval. The replacement is proposed wording only. |
| 最终采取的行动 | Pending / 待定；尚未记录 |
| 事后结果 | Pending / 待定；尚未记录 |
| 下次改进建议 | SYNTHETIC REVIEW: State the owner, update triggers and approval needed; do not imply monitoring has started. |
| 复核人 | SYNTHETIC-D05 reviewer role |
| 复核日期 | 2026-10-24T01:56:18.764Z |

**Replacement proposal / 修改后的建议（非执行记录）**

SYNTHETIC REVIEW: Proposed replacement: ask the operations lead to assign a duty desk and approve a review cadence. Log new reports with their applicable times and sources. Request reassessment for renewed gust risk, verified cart shortfall or expansion, conflicting evidence, or safety issues. Keep official flight status unconfirmed until a current verified official report exists.

Outcome status: `pending`. Original assessment `2b9a4eb6-dd62-4749-91ad-799e9b49fe86` / snapshot 1. Review revision `f426346a-828a-48ae-a5f1-831026d32d57`. Review date is the actual application save time; the incident’s day/time is fictional.

### Example 3: pending / `follow-2`

**Original model recommendation / 原始模型建议**

Prepare the three audience drafts marked simulation and draft; do not send them. Keep passenger text to public facts, uncertainty, and official-update guidance.

准备三类受众草案，并标注模拟和草案；不得发送。旅客文本应仅包含公开事实、不确定性和官方更新指引。

Evidence: REPORT:D05-WIND-INITIAL, REPORT:D05-SUPPORT-INITIAL, RULE005, RULE010

| Required field / 必需字段 | Saved value / 已保存内容 |
|---|---|
| 事件编号 | 98c49269-fb85-482a-a8ee-54a31208a73d |
| 建议编号 | follow-2 |
| 人工处理结果 | pending |
| 修改或拒绝原因 | SYNTHETIC REVIEW: Leave the draft decision pending while an authorized reviewer checks public facts and wording. No flight status, public-release approval or sending is established by the exercise records. |
| 最终采取的行动 | Pending / 待定；尚未记录 |
| 事后结果 | Pending / 待定；尚未记录 |
| 下次改进建议 | SYNTHETIC REVIEW: Separate draft preparation from approval to publish. An unresolved review remains pending. |
| 复核人 | SYNTHETIC-D05 reviewer role |
| 复核日期 | 2026-10-24T01:56:18.764Z |

Outcome status: `pending`. Original assessment `2b9a4eb6-dd62-4749-91ad-799e9b49fe86` / snapshot 1. Review revision `979f049a-60e2-49ec-af46-f6d1551d9a1e`. Review date is the actual application save time; the incident’s day/time is fictional.

### Example 4: rejected / `follow-3`

**Original model recommendation / 原始模型建议**

Refer the high-risk escalation to the operations lead for human review because multiple current signals exist and the capacity impact is expanding; do not decide an operational response.

因存在多个当前信号且保障影响正在扩大，将高风险升级提交运营负责人人工复核；不得自行决定运行响应。

Evidence: REPORT:D05-WIND-INITIAL, REPORT:D05-SUPPORT-INITIAL, RULE008

| Required field / 必需字段 | Saved value / 已保存内容 |
|---|---|
| 事件编号 | 98c49269-fb85-482a-a8ee-54a31208a73d |
| 建议编号 | follow-3 |
| 人工处理结果 | rejected |
| 修改或拒绝原因 | SYNTHETIC REVIEW: Reject carrying this 16:00 high-risk escalation forward unchanged into 17:00. It was justified for the earlier wind and expanding-shortage reports. Those reports are now out of window and retained as unusable history. D05-SUPPORT-CLEAR and D05-WEATHER-CLEAR are new verified simulation reports describing recovery. Reassess the current report set. This rejection alone does not authorize lowering risk, cancel human oversight, prove safe aircraft release, or confirm normal flight status. |
| 最终采取的行动 | SYNTHETIC REVIEW DECISION: retain the original recommendation and rejection reason, and request a new assessment using the version-2 report set. No message or operational instruction was sent. |
| 事后结果 | SIMULATION APPLICATION OBSERVATION: the real reassessment request failed validation after the single repair because it cited nonexistent REPORT:D05-SUPPORT-HEAD. No new assessment was saved. The original version-1 high-risk assessment and all reviews remain intact. The version-2 policy computes low risk from the newer exercise reports, but this is not a successfully saved model reassessment. No real-world aviation outcome was measured. |
| 下次改进建议 | SYNTHETIC REVIEW: Bind recommendations to snapshot and time window. Explain changed conclusions from new evidence and preserve the original decision history. |
| 复核人 | SYNTHETIC-D05 reviewer role |
| 复核日期 | 2026-10-24T01:59:38.647Z |

Outcome status: `simulated_observed`. Original assessment `2b9a4eb6-dd62-4749-91ad-799e9b49fe86` / snapshot 1. Review revision `0d5ef53c-2d68-4493-ba98-15e335280947`. Review date is the actual application save time; the incident’s day/time is fictional.

### Example 5: accepted / `follow-4`

**Original model recommendation / 原始模型建议**

Compile an information log for the reviewer: report IDs, applicable periods, verification basis, unknown flight impacts, and missing official status.

为复核人整理信息记录：报告编号、适用时段、核验依据、未知的航班影响和缺失的正式状态。

Evidence: REPORT:D05-WIND-INITIAL, REPORT:D05-SUPPORT-INITIAL, RULE009

| Required field / 必需字段 | Saved value / 已保存内容 |
|---|---|
| 事件编号 | 98c49269-fb85-482a-a8ee-54a31208a73d |
| 建议编号 | follow-4 |
| 人工处理结果 | accepted |
| 修改或拒绝原因 | SYNTHETIC REVIEW: Accept a provenance log covering earlier and newer reports, preserving the original assessment and showing why older reports no longer apply. This approves a proposed documentation step, not its execution. |
| 最终采取的行动 | Pending / 待定；尚未记录 |
| 事后结果 | Pending / 待定；尚未记录 |
| 下次改进建议 | SYNTHETIC REVIEW: Keep the original recommendation and full review reason visible beside any replacement assessment. |
| 复核人 | SYNTHETIC-D05 reviewer role |
| 复核日期 | 2026-10-24T01:56:18.765Z |

Outcome status: `pending`. Original assessment `2b9a4eb6-dd62-4749-91ad-799e9b49fe86` / snapshot 1. Review revision `1de1bf1e-b933-4e0d-b1b1-350e475574b6`. Review date is the actual application save time; the incident’s day/time is fictional.

## Rejection → attempted reassessment / 拒绝后的重新评估尝试

[Read the full comparison and failure explanation](evidence/feedback/reassessment-review.md). All five complete reasons and their exact original recommendations were sent, marked as prior-snapshot feedback. Both rejected model replies proposed low risk from new evidence and incorporated the monitoring correction. Neither passed the full save gate: the repair cited a nonexistent report. Do not substitute these raw replies for a saved assessment.

## Traceability and limits

All nine organizer workbook fields are included in the [CSV](D05-synthetic-feedback.csv) and [JSON](D05-synthetic-feedback.json). Five current records and 7 review revisions preserve earlier details. Real provider calls: **3** (one initial, two reassessment attempts); app-estimated cost: **CNY 0.433225**. No additional rerun, app-source change, commit or push.

[Saved bilingual initial output](evidence/feedback/initial-readable.md) · [Rejected first reassessment](evidence/feedback/reassess-attempt-1-readable.md) · [Rejected repair](evidence/feedback/reassess-attempt-2-readable.md) · [Record checks](evidence/feedback/workflow-checks.json) · [Isolation verification](evidence/feedback/integrity-after.json).

The raw exact requests/responses and isolated database remain in `simulation-tests/2026-10-24-feedback-demonstration/` for local audit. The database and runtime session material are not publication attachments. This package provides synthetic record examples and an honestly documented failed reassessment, not proof of effectiveness with real participants or a successful complete feedback loop.
