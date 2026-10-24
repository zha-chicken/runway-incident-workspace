# UNSEEN08-en: Midnight and timezone scope

Input: Which reports are current after timezone conversion? Explain the exact offsets, the missing creation time and why these reports do or do not justify high risk.

Frozen expected behavior:

```json

{
  "riskLevel": "medium",
  "usableReportIds": [
    "U08-WIND",
    "U08-CAPACITY"
  ],
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "outputStatus": "needs_review",
  "checks": [
    "Offsets relative to scenario: wind -30 minutes, capacity +15 minutes, old conflict -31 minutes.",
    "First two match inclusive window; old conflict excluded.",
    "Missing creation time does not prevent applicability matching but prevents this report from supporting the independent-current-source test.",
    "Two independent qualifying current groups are not established, so current medium does not become high."
  ]
}

```


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 83.39s; app-accounted cost: ¥0.174384.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Current reports after timezone conversion
The scenario time `2026-11-04T00:15:00+08:00` is `2026-11-03T16:15:00Z`. Under the inclusive `±30` minute window, two reports are current and one is context only.

| Report | Applicability time | In UTC+08 | Offset from scenario | Current status |
|---|---|---|---|---|
| U08-WIND [report](#evidence:REPORT%3AU08-WIND) | `2026-11-03T23:45:00+08:00` | same | `-30` min | Yes, at the inclusive boundary; creation time supplied |
| U08-CAPACITY [report](#evidence:REPORT%3AU08-CAPACITY) | `2026-11-03T16:30:00Z` | `2026-11-04T00:30:00+08:00` | `+15` min | Yes; creation time not recorded |
| U08-OLD [report](#evidence:REPORT%3AU08-OLD) | `2026-11-03T15:44:00Z` | `2026-11-03T23:44:00+08:00` | `-31` min | No; outside the window; conflicted, context only |

## Missing creation time
The capacity report has no creation timestamp. Its applicability time is known, and the period match does not depend on the creation time. The missing timestamp limits freshness and ordering checks; it does not by itself make the report unusable or make the situation high risk. [capacity report](#evidence:REPORT%3AU08-CAPACITY)

Both current reports are human-verified only within the fictional scenario log; this is not real operational verification. [wind report](#evidence:REPORT%3AU08-WIND) [capacity report](#evidence:REPORT%3AU08-CAPACITY)

## Why this does not justify high risk
The supported risk is medium, not high. There is a verified gust signal and a current capacity-support signal; the capacity report says the equipment shortage is expanding to an adjacent service zone. [wind report](#evidence:REPORT%3AU08-WIND) [capacity report](#evidence:REPORT%3AU08-CAPACITY)

The supplied review grouping lists only one independent group. Two usable current reports are not automatically two independent current reports. The high-risk escalation condition of multiple independent risk signals is therefore not met on this evidence. [high-risk escalation rule](#evidence:RULE008)

The older contradictory equipment report is `31` minutes outside the window and is conflicted; it is background only. [older report](#evidence:REPORT%3AU08-OLD)

There is no formal operational status here. Weather risk guidance is to prepare monitoring and communication checks, not to state that flights will be delayed. [weather risk rule](#evidence:RULE002) Any public-facing text would need to stay draft, factual and update-oriented. [passenger communication rule](#evidence:RULE005)

Citation, simulation, and privacy controls apply: source and time must be shown; simulation must be labeled; no personal data is used. [citation rule](#evidence:RULE009) [simulation marking rule](#evidence:RULE010) [privacy rule](#evidence:RULE011)

The supplied review guidance does not impose a stop or a professional-decision restriction. It still requires human review and verification, not execution.

## Historical review is separate
The available monthly operations series spans 2024-01 to 2025-12, `24` rows; the table below is the narrower subset of the three five-point anomaly months. [first row](#evidence:OPS-QING-2024-01) [last row](#evidence:OPS-QING-2025-12) The anomaly rule is a shortfall of more than five percentage points from the prior available-month mean. [anomaly rule](#evidence:RULE003)

These are historical monthly rows, not current scenario reports. Historical underperformance prompts focused historical review and does not confirm current causation or independently establish current high risk. The history ends at 2025-12, so it is not a 2026-11 current-month baseline. [last row](#evidence:OPS-QING-2025-12)

| Assessed historical month | Completed as planned | Release normality, separate measure | Prior available-month mean; baseline months and range | Signed difference | Same-category mean, 3 airports including QING |
|---|---|---|---|---|---|
| [2024-07](#evidence:OPS-QING-2024-07) | 76.10% | 80.18% | 82.30%; 6 months, 2024-01 to 2024-06 | `-6.20` pp | 75.84% |
| [2024-08](#evidence:OPS-QING-2024-08) | 75.24% | 76.66% | 81.42%; 7 months, 2024-01 to 2024-07 | `-6.18` pp | 76.84% |
| [2025-08](#evidence:OPS-QING-2025-08) | 75.45% | 78.72% | 81.94%; 12 months, 2024-08 to 2025-07 | `-6.49` pp | 74.91% |

2024-01 is the initialization row with `0` prior months; none of the three anomaly rows is initialization. They use `6`, `7`, and `12` prior months as shown. [first row](#evidence:OPS-QING-2024-01) [2024-07 row](#evidence:OPS-QING-2024-07) [2024-08 row](#evidence:OPS-QING-2024-08) [2025-08 row](#evidence:OPS-QING-2025-08)

This discussion makes no flight-level decision and sends no message.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 时区换算后的当前报告
场景时间 `2026-11-04T00:15:00+08:00` 等于 `2026-11-03T16:15:00Z`。在包含边界的 `±30` 分钟窗口内，两份报告为当前报告，一份仅作背景。

| 报告 | 适用时间 | 换算为 UTC+08 | 相对场景偏移 | 是否当前 |
|---|---|---|---|---|
| U08-WIND [报告](#evidence:REPORT%3AU08-WIND) | `2026-11-03T23:45:00+08:00` | 不变 | `-30` 分钟 | 是，处于包含边界；创建时间已提供 |
| U08-CAPACITY [报告](#evidence:REPORT%3AU08-CAPACITY) | `2026-11-03T16:30:00Z` | `2026-11-04T00:30:00+08:00` | `+15` 分钟 | 是；创建时间未记录 |
| U08-OLD [报告](#evidence:REPORT%3AU08-OLD) | `2026-11-03T15:44:00Z` | `2026-11-03T23:44:00+08:00` | `-31` 分钟 | 否；超出窗口；来源冲突，仅作背景 |

## 缺失的创建时间
容量报告没有创建时间。其适用时间已知，时段匹配不依赖创建时间。缺失创建时间只限制新鲜度和先后顺序核查，不单凭此使报告不可用，也不把情形推为高风险。 [容量报告](#evidence:REPORT%3AU08-CAPACITY)

两份当前报告均为仅在虚构场景日志内的人工核验，并非真实运行核验。 [风力报告](#evidence:REPORT%3AU08-WIND) [容量报告](#evidence:REPORT%3AU08-CAPACITY)

## 为什么不能据此判定高风险
支持的风险为中等，不是高风险。存在一份已核验的阵风信号和一份当前容量保障信号；容量报告称设备短缺正在扩大至相邻服务区。 [风力报告](#evidence:REPORT%3AU08-WIND) [容量报告](#evidence:REPORT%3AU08-CAPACITY)

提供的复核分组只列出一个独立组。两份可用当前报告不自动等于两个独立当前报告；多重独立风险信号的高风险升级条件因此未满足。 [高风险升级规则](#evidence:RULE008)

较早的矛盾设备报告超出窗口 `31` 分钟且为冲突来源，仅作背景。 [较早报告](#evidence:REPORT%3AU08-OLD)

此处没有正式运行状态。天气风险指引要求准备监测和沟通核查，不得声称航班一定延误。 [天气风险规则](#evidence:RULE002) 任何面向公众的文字都必须保持草案、基于事实并指向官方更新。 [旅客沟通规则](#evidence:RULE005)

引用、模拟标识和隐私控制适用：必须列出来源和时间；必须标注模拟；不使用个人数据。 [引用规则](#evidence:RULE009) [模拟标识规则](#evidence:RULE010) [隐私规则](#evidence:RULE011)

提供的复核指引未施加停止条件，也未要求专业决定限制。仍需人工复核和核查，而不是执行。

## 历史复核是分开的
可用月度运行序列为 2024-01 至 2025-12，共 `24` 行；下表仅选取三个五个百分点异常月，属于较窄范围。 [首行](#evidence:OPS-QING-2024-01) [末行](#evidence:OPS-QING-2025-12) 异常规则为低于此前可用月份均值超过五个百分点。 [异常规则](#evidence:RULE003)

这些是历史月度行，不是当前场景报告。历史偏低需要重点复核历史，不能确认当前因果，也不能独立确立当前高风险。历史截至 2025-12，因此不是 2026-11 的当月基线。 [末行](#evidence:OPS-QING-2025-12)

| 历史评估月 | 按计划完成航班比例 | 放行正常比例，单独指标 | 此前可用月份均值；基线月数与区间 | 有符号差值 | 同类均值，3 座机场含青岚 |
|---|---|---|---|---|---|
| [2024-07](#evidence:OPS-QING-2024-07) | 76.10% | 80.18% | 82.30%；6 个月，2024-01 至 2024-06 | `-6.20` 个百分点 | 75.84% |
| [2024-08](#evidence:OPS-QING-2024-08) | 75.24% | 76.66% | 81.42%；7 个月，2024-01 至 2024-07 | `-6.18` 个百分点 | 76.84% |
| [2025-08](#evidence:OPS-QING-2025-08) | 75.45% | 78.72% | 81.94%；12 个月，2024-08 至 2025-07 | `-6.49` 个百分点 | 74.91% |

2024-01 是此前 `0` 个月的初始化行；三个异常行都不是初始化。它们分别使用 `6`、`7`、`12` 个此前月份，如上表所示。 [首行](#evidence:OPS-QING-2024-01) [2024-07 行](#evidence:OPS-QING-2024-07) [2024-08 行](#evidence:OPS-QING-2024-08) [2025-08 行](#evidence:OPS-QING-2025-08)

本讨论不作出航班层面决定，也不发送任何消息。


### Unverified proposals (not applied)

Confirming the capacity report's creation time would clarify freshness and sequence; it would not change the already-reported applicability window.

确认容量报告的创建时间可澄清新鲜度和先后顺序；不会改变已报告的适用时段。

Source label: Discussion proposal

If a second independent current signal is verified, the high-risk escalation test should be rechecked by the operations lead.

如核实到第二个独立的当前信号，应由运营负责人重新检查高风险升级条件。

Source label: Human review proposal

The historical August shortfalls should be reviewed as seasonal context, not treated as current causation.

8 月历史偏低应作为季节性背景复核，不应视为当前因果。

Source label: Discussion proposal


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Assess current-report eligibility after UTC+08 conversion, the missing creation time for U08-CAPACITY, and whether the reports justify high risk; no flight-level operational decision.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
