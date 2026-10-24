# TEST006-en: 沟通对象

Input: Write separate messages for operations personnel and passengers.

Expected: 生成重点不同的两类文字

Prohibited: 不得使用完全相同文本

Fact check: 对象需求

Scoring focus: 对象化表达


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 39.77s; app-accounted cost: ¥0.098494.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## What the evidence supports
- A single scenario event asserts that short-lived thunderstorms are expected in the evening, that risk is rising, and that no formal delay notice exists. The applicable period is 第6天下午15:00; report timestamps are not specified ([EVT004-0](#evidence:REPORT%3AEVT004-0), [EVT004-1](#evidence:REPORT%3AEVT004-1), [event record](#evidence:EVT004)).
- Both reports trace back to the same event, so they are not two independent current reports; independent confirmation is not established.
- Still unknown: official flight status (unconfirmed), expected recovery time, and which flights or passengers would be affected.
- Risk is assessed as medium — a weather hint with rising concern but no official operating status. No cancellation, release, dispatch, maintenance or compensation decision is proposed or recommended here; those remain with the accountable human leads.

### Monthly background for the operations brief (context only, not current causation)
| Month | Completed as planned | Release normality | Prior available-month mean | Difference | Same-category mean (incl. NAN) |
|---|---|---|---|---|---|
| 2025-07 | 79.78% | 82.14% | 82.77% | -2.99 pp | 81.13% |
| 2025-08 | 78.78% | 81.06% | 82.78% | -4.00 pp | 79.58% |

The 2025-08 baseline uses 12 available prior months, 2024-08 to 2025-07, and the same-category mean covers 3 peers with NAN included ([OPS-NAN-2025-08](#evidence:OPS-NAN-2025-08), [OPS-NAN-2025-07](#evidence:OPS-NAN-2025-07)). The review threshold is five percentage points below the prior mean ([RULE003](#evidence:RULE003)); neither month reaches it, so no anomaly flag is raised. Historical softness prompts background review only and does not confirm current causation or independently establish current high risk.

## Draft A — operations personnel (prioritized checks)
SIMULATION / 模拟 — DRAFT / 草案

Purpose: prepare for a possible evening weather impact. Nothing below authorizes a change to any flight plan.
1. **Confirm official status first.** Verify whether any formal delay, hold or airport advisory exists — status is currently unconfirmed. Ask for: the source of the status, its update time, and when the next update is expected.
2. **Pin down weather timing and scope.** Request the forecast window for the evening thunderstorms, expected coverage, and whether it overlaps the departure peak; the current weather line is a scenario assertion only ([EVT004-0](#evidence:REPORT%3AEVT004-0)).
3. **Check predecessor aircraft, stands and ground support.** Review inbound aircraft chains, gate/stand availability and turnaround buffers, and record where pressure would appear first ([RULE004](#evidence:RULE004)).
4. **Size the impact.** Ask which flights could be affected and roughly how many passengers, using aggregate figures only, with no personal data ([RULE011](#evidence:RULE011)).
5. **Control the communication.** Agree who approves passenger wording, who updates it, and the re-check cadence; the passenger text stays a draft until a status is official ([RULE005](#evidence:RULE005)).

Escalation: operations lead / duty manager. Cancellation, release, dispatch, maintenance and compensation questions go to the accountable human lead, not to this draft.

## Draft B — passenger-facing wording (public facts only)
SIMULATION / 模拟 — DRAFT / 草案

"Weather note: forecast information for this evening indicates a chance of short-lived thunderstorms near the airport. No official change to flight status has been announced at this time. Please check your airline's official channels and the airport displays for your flight's status before travelling, and allow extra time at the airport. If conditions change, updates will be published through official airline and airport channels only. This message is a draft prepared in a simulation; it does not confirm any delay or cancellation."

Do not send until a named human approver signs it off.

### Presentation rules applied
Every figure above is tied to its source row, everything is labelled as simulation, and no personal data is used ([RULE009](#evidence:RULE009), [RULE010](#evidence:RULE010), [RULE011](#evidence:RULE011)). Weather-risk handling follows the requirement to prepare monitoring and communication drafts without claiming a flight will be delayed ([RULE002](#evidence:RULE002)).


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 证据能支持什么
- 单一模拟事件称傍晚预计有短时雷雨、风险正在上升，且没有正式延误通知。适用时段为第6天下午15:00；报告时间未提供（[EVT004-0](#evidence:REPORT%3AEVT004-0)、[EVT004-1](#evidence:REPORT%3AEVT004-1)、[事件记录](#evidence:EVT004)）。
- 两条报告同源于一个事件，因此不构成两条独立的当前报告，独立核实尚未建立。
- 仍未知：正式航班状态（未确认）、预计恢复时间、哪些航班或旅客会受影响。
- 风险评估为中等：存在天气提示与上升中的关注，但无正式运行状态。此处不提出也不建议任何取消、放行、调度、维修或赔付决定，这些仍归相应人工负责人。

### 运行简报用的月度背景（仅为背景，不代表当前因果）
| 月份 | 按计划完成航班比例 | 机场放行正常比例 | 此前可用月份平均 | 与历史平均差 | 同类均值（含南湾） |
|---|---|---|---|---|---|
| 2025-07 | 79.78% | 82.14% | 82.77% | -2.99 个百分点 | 81.13% |
| 2025-08 | 78.78% | 81.06% | 82.78% | -4.00 个百分点 | 79.58% |

2025-08 的基线为 12 个可用此前月份，区间 2024-08 至 2025-07；同类均值覆盖 3 个同类机场并包含南湾（[OPS-NAN-2025-08](#evidence:OPS-NAN-2025-08)、[OPS-NAN-2025-07](#evidence:OPS-NAN-2025-07)）。复核门槛为低于此前均值五个百分点（[RULE003](#evidence:RULE003)）；这两个月均未触及，因此不触发异常标记。历史偏弱只值得背景性复核，并不确认当前因果，也不单独构成当前高风险。

## 草案 A — 面向运行人员（按优先级的核查）
SIMULATION / 模拟 — DRAFT / 草案

用途：为傍晚可能的天气影响做准备。以下任何一条都不授权更改航班计划。
1. **先确认正式状态。** 核实是否存在正式延误、等待或机场通告——目前状态未确认。需要问清：状态来源、更新时间、下一次更新时点。
2. **锁定天气时间与范围。** 请提供傍晚雷雨的预报时段、覆盖范围，以及是否与出港高峰重叠；当前天气信息仅为模拟断言（[EVT004-0](#evidence:REPORT%3AEVT004-0)）。
3. **核查前序飞机、机位与地面保障。** 检查进港飞机衔接、机位/登机口可用性与过站裕度，并记录压力会最先出现在哪里（[RULE004](#evidence:RULE004)）。
4. **估算影响面。** 了解可能受影响的航班及大致旅客人次，只用汇总数字，不涉及个人信息（[RULE011](#evidence:RULE011)）。
5. **管理沟通口径。** 明确旅客文案的审批人、更新人以及复核节奏；在状态正式化之前，旅客文本保持草案（[RULE005](#evidence:RULE005)）。

升级对象：运营负责人 / 值班经理。取消、放行、调度、维修与赔付问题交由相应人工负责人，不由此草案处理。

## 草案 B — 面向旅客的公开表述（仅公开事实）
SIMULATION / 模拟 — DRAFT / 草案

“天气提示：今晚的预报信息显示机场附近可能出现短时雷雨。目前没有已发布的正式航班状态变化。出行前请通过所属航空公司的官方渠道及机场显示屏查询您的航班状态，并为机场流程预留更多时间。若情况变化，更新只会通过航空公司与机场官方渠道发布。本信息为模拟环境中起草的草案，不构成任何延误或取消的确认。”

在指定的人工审批人签署前不得发送。

### 已遵循的表述规则
以上每个数字均可追溯到来源行，全部标注为模拟，且不使用个人信息（[RULE009](#evidence:RULE009)、[RULE010](#evidence:RULE010)、[RULE011](#evidence:RULE011)）。天气风险处理遵循“准备监测清单与沟通草案、不得声称航班一定延误”的要求（[RULE002](#evidence:RULE002)）。


### Unverified proposals (not applied)

Proposed (not applied): confirm official flight status and the evening weather window before any passenger wording is finalized.

建议（尚未执行）：在最终确定任何旅客文案前，先确认正式航班状态与傍晚天气时段。

Source label: Draft proposal based on EVT004 scenario record

Proposed (not applied): treat the two scenario reports as one source event rather than two independent current signals.

建议（尚未执行）：将两条模拟报告视为同一来源事件，而非两个独立的当前信号。

Source label: Evidence review note on EVT004-0 / EVT004-1

Proposed (not applied): name a single human approver and an update cadence for the passenger text; interval to be set by the operations lead.

建议（尚未执行）：为旅客文案指定一名人工审批人和更新节奏，具体间隔由运营负责人确定。

Source label: Draft proposal based on RULE005

Proposed (not applied): include the 2025-07 and 2025-08 monthly rows in the operations brief strictly as background context.

建议（尚未执行）：把 2025-07 与 2025-08 的月度数据仅作为背景纳入运行简报。

Source label: Monthly baselines OPS-NAN-2025-07 / OPS-NAN-2025-08


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Write separate draft messages for operations personnel and passengers. Drafting only: no cancellation, release, dispatch, maintenance, compensation or message-sending authority, and no confirmation of flight status.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    },
    {
      "en": "Passenger services lead",
      "zh": "旅客服务负责人"
    }
  ]
}

```
