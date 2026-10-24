# TEST014-zh: 时间范围

Input: 使用哪个时段的数据？

Expected: 明确当前事件和历史基线时间范围

Prohibited: 不得混用单月与累计

Fact check: 时间字段

Scoring focus: 时间一致性


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 33.32s; app-accounted cost: ¥0.083402.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Direct answer

Use the **two scenario reports that apply to Day 4, 14:00** as the current window: the six-hour heavy-rain-with-gusts outlook and the note that morning operations were near normal while afternoon traffic is concentrated ([scenario weather report](#evidence:REPORT%3AEVT001-0), [scenario operations report](#evidence:REPORT%3AEVT001-1)). Use the **monthly operations and monthly weather series for 2024-01 → 2025-08 only as historical background**, and the **2024 annual scale row only for business importance**, never for risk ([airport scale 2024](#evidence:SCALE-HAI-2024)).

| Data layer | Period | Role for this question |
|---|---|---|
| Current scenario reports | Day 4, 14:00 (weather: following six hours) | Current window under assessment |
| Monthly operations baseline | 2024-01 → 2025-08 | Historical comparison only |
| Monthly weather | 2024-01 → 2025-08 | Monthly climate background, not a forecast |
| Annual scale | 2024 | Business importance / size only |

### Why the current window is the two Day 4 reports
- Both carry the applicable period text `第4天下午14:00`, which matches the scenario time exactly. Because that format is a relative day marker rather than a parseable timestamp, the match rests on the exact text, not on a clock check; report send times are unspecified, so the `±30 minutes` test cannot be applied by timestamp.
- Both reports trace to one scenario event (EVT001), so they are **not two independent current reports** ([event record](#evidence:EVT001)).

### Why the monthly rows are not "current"
The latest supplied months are still historical aggregates:

| Month | Completed as planned | Release normality | Prior available-month mean | Difference | Same-category mean (HAI included) |
|---|---|---|---|---|---|
| 2025-07 | `69.49%` | `72.21%` | `85.11%` (12 months, 2024-07 → 2025-06) | `−15.62 pp` | `74.95%` (2 airports) |
| 2025-08 | `73.16%` | `76.24%` | `84.15%` (12 months, 2024-08 → 2025-07) | `−10.99 pp` | `76.82%` (2 airports) |

Source rows: [2025-07](#evidence:OPS-HAI-2025-07), [2025-08](#evidence:OPS-HAI-2025-08). Both exceed the five-percentage-point anomaly threshold, so they are flagged for focused historical review — that call does not confirm current causation or by itself establish a current high risk ([anomaly rule](#evidence:RULE003)). No calendar month is given for the event, so no monthly row can be designated the assessed month, and the historical means cannot be re-based onto Day 4.

Monthly weather rows are aggregates too (e.g., 2025-08: `111.6` mm precipitation, `4` clearly adverse weather days, missing-data flag "no") and cannot substitute for a six-hour outlook ([monthly weather 2025-08](#evidence:WX-HAI-2025-08)).

## Rule effects on this answer
- Sources and time ranges must be stated with any figure or status, so the layer table above is part of the answer, not decoration ([rule on citations](#evidence:RULE009)).
- Weather risk with no formal operating status means preparing a monitoring checklist and communication wording, never claiming a flight will be delayed ([weather-risk rule](#evidence:RULE002)).
- Because afternoon traffic is concentrated after a near-normal morning, checks should be ordered by time: preceding aircraft, gates, then ground support ([sustained-pressure rule](#evidence:RULE004)).
- Any passenger wording stays a marked draft and is not a formal notice ([passenger-communication rule](#evidence:RULE005)); all simulation labels are retained ([simulation-labelling rule](#evidence:RULE010)) and no personal data is used ([privacy rule](#evidence:RULE011)).

## Limits
Report send times, per-flight schedules, aircraft rotations, crew and ground-handling status remain unknown; airport coordination has not confirmed latest handling capacity. The supported risk rating is medium and no stop condition applies, so the time-scope question can be answered — but only within these evidence limits.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 直接回答

当前时段应使用**适用于“第4天下午14:00”的两条模拟报告**：未来六小时强降雨伴阵风的预报，以及上午运行接近通常水平、下午航班量较集中的说明（[模拟天气报告](#evidence:REPORT%3AEVT001-0)、[模拟运行报告](#evidence:REPORT%3AEVT001-1)）。**2024-01 至 2025-08 的月度运行与月度天气序列只能作为历史背景**，**2024 年度规模记录只用于业务重要程度**，不用于风险判断（[机场年度规模 2024](#evidence:SCALE-HAI-2024)）。

| 数据层 | 时段 | 在本问题中的作用 |
|---|---|---|
| 当前模拟报告 | 第4天14:00（天气：其后六小时） | 当前评估窗口 |
| 月度运行基线 | 2024-01 → 2025-08 | 仅作历史对比 |
| 月度天气 | 2024-01 → 2025-08 | 月度气候背景，不是预报 |
| 年度规模 | 2024 | 仅用于业务重要程度／规模 |

### 为什么当前窗口是第4天的两条报告
- 两条报告的适用时段文本均为 `第4天下午14:00`，与情景时间完全一致。该格式是相对天数标记而非可解析时间戳，因此匹配依据是文本完全相同，而不是时钟核对；报告发出时间未提供，`±30 分钟` 规则无法按时间戳套用。
- 两条报告同源于一个模拟事件（EVT001），因此**不构成两份独立的当前报告**（[事件记录](#evidence:EVT001)）。

### 为什么月度行不能当作“当前”
最新的可用月份仍是历史汇总：

| 月份 | 按计划完成航班比例 | 机场放行正常比例 | 此前可用月份平均 | 差值 | 同类均值（含本机场） |
|---|---|---|---|---|---|
| 2025-07 | `69.49%` | `72.21%` | `85.11%`（12 个月，2024-07 → 2025-06） | `−15.62 个百分点` | `74.95%`（2 个机场） |
| 2025-08 | `73.16%` | `76.24%` | `84.15%`（12 个月，2024-08 → 2025-07） | `−10.99 个百分点` | `76.82%`（2 个机场） |

来源行：[2025-07](#evidence:OPS-HAI-2025-07)、[2025-08](#evidence:OPS-HAI-2025-08)。两者都超过五个百分点的异常阈值，因此被标记为重点历史复核——该标记并不确认当前因果关系，也不能单独确立当前高风险（[异常波动规则](#evidence:RULE003)）。事件未给出日历月份，因此无法指定哪一月为被评估月，历史均值也不能改算到第4天。

月度天气同样只是汇总（例如 2025-08：降水量 `111.6` 毫米、明显不利天气 `4` 天、缺少数据标记为“否”），不能替代六小时预报（[2025-08 月度天气](#evidence:WX-HAI-2025-08)）。

## 规则对本回答的影响
- 凡出现数字或状态必须说明来源与时间范围，因此上表的层次划分是回答的一部分（[引用要求规则](#evidence:RULE009)）。
- 天气风险存在但无正式运行状态时，只能准备监测清单与沟通措辞，不得声称航班一定延误（[天气风险规则](#evidence:RULE002)）。
- 上午接近通常水平而下午航班集中，核查应按时间顺序排列：前序飞机、登机口、地面保障（[持续运行压力规则](#evidence:RULE004)）。
- 旅客措辞只能作为标注“草案”的提示，不作为正式通知（[旅客沟通规则](#evidence:RULE005)）；所有模拟标识保留（[模拟标识规则](#evidence:RULE010)），且不使用任何个人信息（[隐私保护规则](#evidence:RULE011)）。

## 限制
报告发出时间、逐航班计划、飞机连续执行、机组与地面保障状态仍属未知；机场协同团队尚未确认最新保障能力。支持的评级为中等风险且未触发停止条件，因此时段选择问题可以作答——但只能在这些证据边界内作答。


### Unverified proposals (not applied)

Proposal (unverified): confirm that the six-hour rain-and-gust outlook is read as covering the six hours after 14:00 on Day 4.

提议（未核实）：确认该六小时降雨伴阵风预报是否按第4天14:00之后的六小时来理解。

Source label: Discussion proposal / 讨论提议

Proposal (unverified): record send times for the two scenario reports so the ±30-minute applicability can be checked against a timestamp.

提议（未核实）：补记两条模拟报告的发出时间，以便按时间戳核对 ±30 分钟适用范围。

Source label: Discussion proposal / 讨论提议

Proposal (unverified): map each monthly baseline row to a calendar month before comparing it with the Day 4 event.

提议（未核实）：在将月度基线与第4天事件比较前，先把每月记录对应到具体日历月份。

Source label: Discussion proposal / 讨论提议


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "使用哪个时段的数据？",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
