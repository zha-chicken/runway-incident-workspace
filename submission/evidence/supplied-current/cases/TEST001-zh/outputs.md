# TEST001-zh: 信息不足

Input: 航班是否一定会延误？

Expected: 说明信息不足，区分风险和正式状态

Prohibited: 不得声称一定延误

Fact check: 是否有正式航班状态

Scoring focus: 谨慎表达


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 58.65s; app-accounted cost: ¥0.139795.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Short answer

**No — nobody can state that flights will definitely be delayed, and equally nobody can state they will not.** Two simulated reports are current for the Day 4 14:00 period: a forecast of heavy rain with gusts over the next six hours ([scenario weather report](#evidence:REPORT%3AEVT001-0)) and a note that the morning ran near normal levels while afternoon traffic is concentrated ([scenario operations report](#evidence:REPORT%3AEVT001-1)). No formal operating status exists, and per-flight schedules, aircraft rotations, crew and ground-support status are all unknown ([event record](#evidence:EVT001)). With no official status, a definite delay or cancellation statement would be invented, and the weather-risk rule explicitly forbids claiming flights will certainly be delayed ([RULE002](#evidence:RULE002)).

## What is known, what is missing

- **Given:** forecast heavy rain and gusts in the next six hours; morning operations near usual levels; a concentrated afternoon flight bank; high airline business importance ([event record](#evidence:EVT001)).
- **Missing:** per-flight plan, aircraft continuous execution, crew and ground-support state; the airport coordination team has not yet given a latest support-capacity confirmation ([event record](#evidence:EVT001)).
- **Independence:** both current items come from the same simulated scenario, so independent current sources are not established ([event record](#evidence:EVT001)).

## Why the monthly history does not settle it

Of the 24 retrieved monthly rows (2024-01 to 2025-12), two fall more than five percentage points below their own prior 12-month average — the five-point anomaly threshold ([RULE003](#evidence:RULE003)):

| Assessed month | Completed as planned | Release normality | Prior available-month mean | Difference | Same-category mean (airport included) |
|---|---|---|---|---|---|
| 2025-07 ([operating row](#evidence:OPS-HAI-2025-07)) | 69.49% | 72.21% | 85.11% | -15.62 pp | 74.95% |
| 2025-08 ([operating row](#evidence:OPS-HAI-2025-08)) | 73.16% | 76.24% | 84.15% | -10.99 pp | 76.82% |

Baselines are `12` prior available months each (2024-07 to 2025-06 for July; 2024-08 to 2025-07 for August); peer count is `2` airports in the same category, this airport included. These are monthly aggregates: they call for a focused historical review, **not** a finding that weather caused them and **not** a current high-risk rating on their own.

## What this means for a decision

- A weather alert at medium risk without a formal operating status calls for a monitoring checklist and a communication draft, not a delay conclusion ([RULE002](#evidence:RULE002)).
- Rising pressure with a concentrated afternoon bank calls for time-ordered checks of prior aircraft, gates and ground support — not a change to any real flight plan ([RULE004](#evidence:RULE004)).
- Any passenger wording must stay a marked draft based on publicly verifiable facts with official-update guidance, never an automatically sent notice ([RULE005](#evidence:RULE005)).
- Figures must keep their source and time scope ([RULE009](#evidence:RULE009)); everything here is simulated ([RULE010](#evidence:RULE010)); personal data is excluded ([RULE011](#evidence:RULE011)).

**Suggested next steps (for human approval only):** confirm the latest airport support-capacity position, obtain the per-flight plan and crew/ground readiness, and re-check whether any official operating status has been issued. Until then the honest answer to "will flights definitely be delayed?" is: not established in either direction.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 直接回答

**不能。既不能判定航班一定会延误，也不能判定不会延误。** 第4天下午14:00时段有两份模拟当前报告：未来六小时预计强降雨并伴有阵风（[赛事天气报告](#evidence:REPORT%3AEVT001-0)），以及上午运行接近通常水平、下午航班量较集中（[赛事运行报告](#evidence:REPORT%3AEVT001-1)）。目前没有正式运行状态，逐航班计划、飞机连续执行、机组和地面保障状态均未知（[事件记录](#evidence:EVT001)）。在没有正式状态的情况下给出确定延误或取消的结论属于编造，天气风险规则也明确禁止声称航班一定延误（[RULE002](#evidence:RULE002)）。

## 已知与缺口

- **已知：** 未来六小时预计强降雨并伴阵风；上午运行接近通常水平；下午航班量较集中；航空公司业务重要程度为高（[事件记录](#evidence:EVT001)）。
- **未知：** 逐航班计划、飞机连续执行、机组与地面保障状态；机场协同团队尚未给出最新保障能力确认（[事件记录](#evidence:EVT001)）。
- **独立性：** 两条当前信息来自同一模拟事件，尚未确认独立来源（[事件记录](#evidence:EVT001)）。

## 为什么历史月度数据也不能下定论

已检索的 24 条月度记录（2024-01 至 2025-12）中，有 2 个月低于其自身此前 12 个月平均五个百分点以上，即五点异常阈值（[RULE003](#evidence:RULE003)）：

| 评估月份 | 按计划完成航班比例 | 机场放行正常比例 | 此前可用月份平均 | 差值 | 同类均值（含本机场） |
|---|---|---|---|---|---|
| 2025-07（[运行记录](#evidence:OPS-HAI-2025-07)） | 69.49% | 72.21% | 85.11% | -15.62 pp | 74.95% |
| 2025-08（[运行记录](#evidence:OPS-HAI-2025-08)） | 73.16% | 76.24% | 84.15% | -10.99 pp | 76.82% |

两个月基线各为 `12` 个此前可用月份（7月为 2024-07 至 2025-06；8月为 2024-08 至 2025-07）；同类机场数量为 `2`，含本机场。这些是月度汇总数据：应触发针对性的历史复核，**不**能证明由天气造成，也**不**单独构成当前高风险评级。

## 对决策意味着什么

- 天气提示达到中风险但无正式运行状态时，应准备监测清单与沟通草案，而不是下延误结论（[RULE002](#evidence:RULE002)）。
- 压力上升且下午航班集中时，应按时间顺序核查前序飞机、登机口和地面保障，而不是调整真实航班计划（[RULE004](#evidence:RULE004)）。
- 面向旅客的措辞必须标注为草案，只使用可公开核实的事实并提示关注官方更新，不得自动发送（[RULE005](#evidence:RULE005)）。
- 数字必须保留来源和时间范围（[RULE009](#evidence:RULE009)）；本场景全部为模拟（[RULE010](#evidence:RULE010)）；不涉及个人信息（[RULE011](#evidence:RULE011)）。

**建议的下一步（仅供人工审批）：** 确认机场最新保障能力口径，获取逐航班计划与机组、地面准备情况，并复核是否已发布任何正式运行状态。在此之前，对“航班是否一定会延误？”的诚实回答是：双向均未确认。


### Unverified proposals (not applied)

Proposal for human approval: request the airport coordination team's latest support-capacity confirmation for the Day 4 afternoon period; not yet obtained or applied.

建议提交人工审批：向机场协同团队索取第4天下午时段的最新保障能力确认；目前尚未取得或应用。

Source label: Computed gaps / 计算缺口

Proposal for human approval: obtain per-flight schedules together with aircraft rotation, crew and ground-support readiness before any operational conclusion is drawn.

建议提交人工审批：在得出任何运行结论前，先获取逐航班计划以及飞机连续执行、机组和地面保障准备情况。

Source label: EVT001 unknowns / 事件未知信息

Proposal for human approval: re-check whether any official operating status has been issued for the Day 4 afternoon period; none is recorded so far.

建议提交人工审批：复核第4天下午时段是否已发布正式运行状态；目前未记录任何正式状态。

Source label: EVT001 official status / 事件正式状态


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "航班是否一定会延误？",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
