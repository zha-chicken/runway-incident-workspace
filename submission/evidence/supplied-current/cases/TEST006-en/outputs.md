# TEST006-en: 沟通对象

Input: Write separate messages for operations personnel and passengers.

Expected: 生成重点不同的两类文字

Prohibited: 不得使用完全相同文本

Fact check: 对象需求

Scoring focus: 对象化表达


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 74.28s; app-accounted cost: ¥0.154381.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

I can prepare two separate draft messages. Neither is approved for sending, and official flight status is unconfirmed. The supplied current facts are limited to: short thunderstorms are expected in the evening, and risk is rising without an official delay notice; report creation times and independent source identities are not established [weather scenario](#evidence:REPORT%3AEVT004-0) [operations scenario](#evidence:REPORT%3AEVT004-1).

### Operations personnel — draft
**SIMULATION / 模拟 — DRAFT / 草案**

**Purpose:** prioritized checks before any passenger message is approved.
1. Confirm official flight status and any official delay or cancellation notice, including source and update time; do not treat scenario text as a formal status. [RULE009](#evidence:RULE009) [RULE005](#evidence:RULE005)
2. Verify the weather window and airport or airline advisories; check ground handling, gate and stand availability, security queues, transfer bags, crew duty and aircraft rotation, and next-wave concentration. [RULE002](#evidence:RULE002) [RULE004](#evidence:RULE004)
3. Identify affected passenger groups only in aggregate; exclude personal data from drafts. [RULE011](#evidence:RULE011)
4. Prepare passenger message variants but do not send; route to the operations lead and passenger service lead for approval. [RULE005](#evidence:RULE005)
5. Record what is still unknown: formal flight status, expected recovery time, and specific affected passengers. [EVT004](#evidence:EVT004)

**Constraints:** do not promise delay, cancellation or recovery time; do not put internal speculation in passenger text; label all drafts. [RULE002](#evidence:RULE002) [RULE010](#evidence:RULE010)

### Passenger message — draft
**SIMULATION / 模拟 — DRAFT / 草案**

Short thunderstorms are expected this evening. We have not received a confirmed official delay or cancellation notice for your flight at this time. Please check the airline's and airport's official channels for your flight status and boarding or gate information before you travel. Weather can change, and we cannot confirm any delay, cancellation or recovery time. This is a draft notice, not a sent message.

Source notes: current reports are competition-scenario assertions; they are not independent and some report times are unspecified [weather scenario](#evidence:REPORT%3AEVT004-0) [operations scenario](#evidence:REPORT%3AEVT004-1). This item is preparation only; human review is required before any passenger communication. [RULE005](#evidence:RULE005)


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

可以分别准备两份草案。两份均未获准发送，正式航班状态尚未确认。现有当前信息仅为：预计傍晚有短时雷雨，风险正在上升但没有正式延误通知；报告创建时间未提供，独立来源身份未确认 [天气情景](#evidence:REPORT%3AEVT004-0) [运行情景](#evidence:REPORT%3AEVT004-1)。

### 运行人员 — 草案
**SIMULATION / 模拟 — DRAFT / 草案**

**目的：** 在任何旅客信息获批前，按优先级核查。
1. 确认正式航班状态及任何正式延误或取消通知，包括来源和更新时间；不要把情景文本当作正式状态。[RULE009](#evidence:RULE009) [RULE005](#evidence:RULE005)
2. 核实天气时段及机场或航空公司通告；检查地面保障、登机口和机位可用性、安检队列、中转行李、机组值勤和飞机周转，以及后续航班集中程度。[RULE002](#evidence:RULE002) [RULE004](#evidence:RULE004)
3. 仅以汇总方式识别受影响旅客群体；草案中排除个人信息。[RULE011](#evidence:RULE011)
4. 准备旅客信息版本，但不得发送；提交运营负责人和旅客服务负责人审批。[RULE005](#evidence:RULE005)
5. 记录仍未知项：正式航班状态、预计恢复时间、具体受影响旅客。[EVT004](#evidence:EVT004)

**限制：** 不得承诺延误、取消或恢复时间；旅客文本不得包含内部推测；所有草案须标注。[RULE002](#evidence:RULE002) [RULE010](#evidence:RULE010)

### 旅客信息 — 草案
**SIMULATION / 模拟 — DRAFT / 草案**

预计今晚有短时雷雨。目前我们尚未收到您的航班有正式延误或取消的确切通知。出行前请通过航空公司和机场的官方渠道查看航班状态及登机口信息。天气可能变化，我们无法确认任何延误、取消或恢复时间。本信息为草案，并非已发送通知。

来源说明：当前报告为赛事模拟断言，不构成独立来源，部分报告时间未提供 [天气情景](#evidence:REPORT%3AEVT004-0) [运行情景](#evidence:REPORT%3AEVT004-1)。本项仅为准备事项，任何旅客沟通均须人工审核。[RULE005](#evidence:RULE005)


### Unverified proposals (not applied)

Operations could confirm official flight status, source, and update time before the passenger draft is approved.

在旅客草案获批前，运行人员可确认正式航班状态、来源和更新时间。

Source label: Draft proposal — not applied

The passenger draft could be limited to public facts and official-channel guidance.

旅客草案可仅使用可公开事实和官方渠道指引。

Source label: Draft proposal — not applied


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Write separate messages for operations personnel and passengers.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
