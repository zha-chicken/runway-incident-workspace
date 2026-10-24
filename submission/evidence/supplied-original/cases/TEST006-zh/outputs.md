# TEST006-zh: 沟通对象

Input: 分别写给运营人员和旅客

Expected: 生成重点不同的两类文字

Prohibited: 不得使用完全相同文本

Fact check: 对象需求

Scoring focus: 对象化表达


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 35.19s; app-accounted cost: ¥0.089167.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

Two separate drafts follow. Both rest on one scenario event, and neither may be sent or treated as a flight status.

## Basis for both drafts

- At `第6天下午15:00` the scenario records a forecast of short-lived thunderstorms in the evening ([scenario weather statement](#evidence:REPORT%3AEVT004-0)) and a statement that risk is rising with no formal delay notice ([scenario operations statement](#evidence:REPORT%3AEVT004-1)).
- Both statements come from the same event, so they are **not two independent current reports**; report timestamps are unspecified and official flight status is unconfirmed ([EVT004](#evidence:EVT004)).
- Risk is assessed as medium with no stop condition; preparing draft text is allowed, but publishing, sending, or any schedule action is not ([weather-risk rule](#evidence:RULE002), [passenger-communication rule](#evidence:RULE005)).

## Draft A — Operations team: prioritized checks

SIMULATION / 模拟 — DRAFT / 草案

1. **Weather validity.** Confirm whether the “short-lived evening thunderstorm” outlook is still current, its expected time window, and the source update time — the scenario supplies no timestamp ([scenario weather statement](#evidence:REPORT%3AEVT004-0)).
2. **Formal status.** Confirm whether any official status change exists; the only operating statement says risk is rising with no formal delay notice, so treat status as unconfirmed ([scenario operations statement](#evidence:REPORT%3AEVT004-1)).
3. **Pressure points in time order.** Preceding aircraft → stands and gates → ground support capacity → downstream bank concentration, in that sequence ([sustained-pressure rule](#evidence:RULE004)).
4. **Gaps to close before any wording is finalised:** formal flight status, expected recovery time, and which flights or passenger groups would actually be affected ([EVT004](#evidence:EVT004)).
5. **Presentation controls.** Keep every item labelled simulated, cite source and time range for each number, and use aggregated counts only — no personal data ([simulation-labelling rule](#evidence:RULE010), [privacy rule](#evidence:RULE011), [citation rule](#evidence:RULE009)).
6. **Boundary.** This draft contains no cancellation, release, dispatch, maintenance, or compensation position; those remain with the accountable duty managers.

## Draft B — Passenger message (public-facing)

SIMULATION / 模拟 — DRAFT / 草案

> **Weather outlook — South Bay (Nanwan) Airport**
>
> Thunderstorms are possible this evening at the airport. **No formal flight status change has been issued at this time**, and we cannot yet confirm whether any specific flight will be affected.
>
> Please check your airline's official app, website, and airport displays for the latest status before travelling. Information circulating outside official channels may be inaccurate.
>
> This text is a simulation draft for exercise purposes and is not an official notice.

Passenger-side rules applied: public facts only, uncertainty stated, no delay or cancellation claimed, no contact links or recovery times invented ([passenger-communication rule](#evidence:RULE005), [citation rule](#evidence:RULE009)).

## Historical context (not a current signal)

Monthly baselines in this dataset run `2024-01` through `2025-12`. The scenario does not name an assessed month, so **no month-specific comparison applies to this incident**. For scale only, the sharpest recent shortfall on record is `2025-08`: completed as planned `78.78%`, release normality `81.06%` (a separate measure), prior available-month mean `82.78%` over `12` months (`2024-08` to `2025-07`), difference `-4.00` percentage points, same-category mean `79.58%` across `3` airports including this one ([OPS-NAN-2025-08](#evidence:OPS-NAN-2025-08)). That gap sits below the five-point review trigger, so it does not confirm current causation or independently establish current high risk ([anomaly rule](#evidence:RULE003)).

## What remains unestablished

No formal flight status, expected recovery time, affected-flight list, independent second source, or report timestamps. Any of these arriving would change what can be said, not the fact that human approval is required.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

以下为两份独立草案。两者都基于同一模拟事件，均不得发送，也不得当作航班状态使用。

## 两份草案的共同依据

- 场景时间 `第6天下午15:00` 记录：预计傍晚有短时雷雨（[场景天气陈述](#evidence:REPORT%3AEVT004-0)），以及风险正在上升但没有正式延误通知（[场景运行陈述](#evidence:REPORT%3AEVT004-1)）。
- 两条陈述来自同一事件，因此**不构成两份独立的当前报告**；报告时间未提供，正式航班状态未确认（[EVT004](#evidence:EVT004)）。
- 风险评估为中等，且未触发停止条件；可以准备草案文字，但不得发布、发送或作出任何航班计划动作（[天气风险规则](#evidence:RULE002)、[旅客沟通规则](#evidence:RULE005)）。

## 草案 A —— 给运营人员：按优先级的核查清单

SIMULATION / 模拟 — DRAFT / 草案

1. **天气有效性。** 核实“傍晚短时雷雨”提示是否仍然有效、预计时间窗以及来源更新时间——场景未提供任何时间戳（[场景天气陈述](#evidence:REPORT%3AEVT004-0)）。
2. **正式状态。** 核实是否已有官方状态变更；唯一运行陈述为风险上升且无正式延误通知，因此状态按未确认处理（[场景运行陈述](#evidence:REPORT%3AEVT004-1)）。
3. **按时间顺序梳理承压点。** 前序飞机 → 机位与登机口 → 地面保障能力 → 后续航班集中程度（[持续压力规则](#evidence:RULE004)）。
4. **定稿前需补齐的信息缺口：** 正式航班状态、预计恢复时间、实际可能受影响的航班或旅客群体（[EVT004](#evidence:EVT004)）。
5. **表述控制。** 全部标注为模拟，每个数字标注来源与时间范围，仅使用汇总口径，不含个人信息（[模拟标识规则](#evidence:RULE010)、[隐私规则](#evidence:RULE011)、[引用规则](#evidence:RULE009)）。
6. **边界。** 本草案不含取消、放行、调度、维修或赔付结论；这些仍由相应值班负责人决定。

## 草案 B —— 给旅客的公开信息

SIMULATION / 模拟 — DRAFT / 草案

> **南湾机场天气提示**
>
> 本场傍晚可能出现雷雨。**目前尚未发布任何正式航班状态变更**，我们也无法确认具体航班是否会受到影响。
>
> 出行前请以航空公司官方 App、官网及机场显示屏发布的信息为准。非官方渠道流传的信息可能不准确。
>
> 本文字为演练用模拟草案，不是正式通知。

旅客侧适用规则：仅陈述可公开事实、明确不确定性、不声称延误或取消、不编造联系方式或恢复时间（[旅客沟通规则](#evidence:RULE005)、[引用规则](#evidence:RULE009)）。

## 历史背景（非当前信号）

本数据集月度基线覆盖 `2024-01` 至 `2025-12`。场景未指明被评估月份，因此**本次事件不适用任何按月对比**。仅作规模参考，记录中近期最明显的回落是 `2025-08`：按计划完成航班比例 `78.78%`，机场放行正常比例 `81.06%`（另一项独立指标），此前可用月份平均 `82.78%`（`12` 个月，`2024-08` 至 `2025-07`），与历史平均差 `-4.00` 个百分点，同类均值 `79.58%`（`3` 家机场，含本场）（[OPS-NAN-2025-08](#evidence:OPS-NAN-2025-08)）。该差距低于五个百分点复核阈值，因此不能确认当前因果关系，也不能独立构成当前高风险（[异常波动规则](#evidence:RULE003)）。

## 仍未确立的信息

正式航班状态、预计恢复时间、受影响航班清单、独立第二来源、报告时间戳均缺失。任一信息到位会改变可以表述的内容，但不会改变需要人工审批这一要求。


### Unverified proposals (not applied)

Proposal (not confirmed): ask the duty meteorological contact whether the evening short-thunderstorm outlook is still current and what time window it covers; the scenario supplies no timestamp.

建议（未确认）：向值班气象联系人核实傍晚短时雷雨提示是否仍有效及其覆盖时间窗；场景未提供时间戳。

Source label: Derived from scenario report EVT004-0 gap

Proposal (not confirmed): ask airline operations control whether any formal flight status change has been issued; the scenario records none.

建议（未确认）：向航空公司运行控制核实是否已发布正式航班状态变更；场景未记录任何变更。

Source label: Derived from scenario report EVT004-1 gap

Proposal (not confirmed): prepare an aggregated list of flights and passenger counts that would need messaging only if a formal status change is issued; such a list is not available in the current information.

建议（未确认）：先准备一份汇总口径的航班与旅客数量清单，仅在正式状态变更发布时才用于沟通；当前信息中并无此清单。

Source label: Derived from EVT004 unknowns


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Separate drafts: prioritized checks for operations staff, and public-facing wording for passengers",
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
