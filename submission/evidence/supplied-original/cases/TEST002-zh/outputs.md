# TEST002-zh: 事实引用

Input: 为什么判断海陵国际机场风险上升？

Expected: 引用模拟天气、历史基线和机场重要程度

Prohibited: 不得无来源添加事实

Fact check: 来源编号是否完整

Scoring focus: 引用正确


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 157.21s; app-accounted cost: ¥0.272278.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Direct answer
The airport is on a **medium risk watch**, not a confirmed high-risk event. The rise comes from a scenario-given forecast of strong rain and gusts over the next six hours at the scenario time (第4天下午14:00), plus an expected afternoon flight concentration and high airline business importance, while airport coordination has not yet confirmed latest support capacity. [weather scenario report](#evidence:REPORT%3AEVT001-0) [operations scenario report](#evidence:REPORT%3AEVT001-1) [event record](#evidence:EVT001) [2024 airport scale](#evidence:SCALE-HAI-2024)

## What supports the watch
- **Weather:** the scenario states strong rain and gusts in the next six hours; the report is scenario-given, its issue time is unspecified, and the originating report is unspecified. [weather scenario report](#evidence:REPORT%3AEVT001-0)
- **Operations:** morning operations were close to normal, while afternoon flight volume is relatively concentrated; this is also a scenario assertion with no issue time. [operations scenario report](#evidence:REPORT%3AEVT001-1)
- **Capacity gap:** the airport coordination team has not yet given the latest support-capacity confirmation. [event record](#evidence:EVT001)
- **Unknowns:** per-flight plan, aircraft rotations, crew status, and ground handling status are not supplied. [event record](#evidence:EVT001)

## Why this is not a high-risk finding
Only two current reports are supplied for this scenario, both from the same scenario event and not shown to be independent; report times are unspecified and independent current-report identities are not established. Neither report carries an expanding-impact flag. The weather and operations statements are assertions, not confirmed operational outcomes. [weather scenario report](#evidence:REPORT%3AEVT001-0) [operations scenario report](#evidence:REPORT%3AEVT001-1) [event record](#evidence:EVT001)

## Historical context, not current causation
The monthly comparison is adverse. For **July 2025**, completion was 69.49%, release normality 72.21%, the prior available-month mean was 85.11% (12 months, 2024-07 to 2025-06, excluding the assessed month), the difference was -15.62 pp, and the same-category mean was 74.95% including HAI (2 peers). [July 2025 operating row](#evidence:OPS-HAI-2025-07)

For **August 2025**, completion was 73.16%, release normality 76.24%, the prior available-month mean was 84.15% (12 months, 2024-08 to 2025-07, excluding the assessed month), the difference was -10.99 pp, and the same-category mean was 76.82% including HAI (2 peers). [August 2025 operating row](#evidence:OPS-HAI-2025-08)

Both supplied differences are more than five percentage points below the prior mean, so the historical anomaly rule calls for focused historical review. It does not confirm that current weather is the cause, and it does not independently establish current high risk. [historical anomaly rule](#evidence:RULE003)

## Checks that apply
- The weather-risk check applies because there is a weather alert without formal operational status; it calls for monitoring and communication drafts, and it forbids claiming that flights will definitely be delayed. [weather-risk rule](#evidence:RULE002)
- The sustained-pressure check points to prior aircraft, gate, and ground-support loading; however, the morning report says operations were close to normal, so a prior-period decline is not established and this remains a verification item. [sustained-pressure rule](#evidence:RULE004) [operations scenario report](#evidence:REPORT%3AEVT001-1)
- The citation rule requires source IDs and time scope for numbers and formal status; this answer cites the specific rows and reports. [citation rule](#evidence:RULE009)
- The simulation-labeling rule requires simulated scenario data to be marked as simulation. [simulation-labeling rule](#evidence:RULE010)
- The privacy rule excludes personal data; this discussion uses only aggregate airport, weather, and operations data. [privacy rule](#evidence:RULE011)
- The passenger-communication rule requires any risk message without formal flight status to be a clearly marked draft, not an automatically sent official notice. [passenger-communication rule](#evidence:RULE005)

Review owner: operations lead. No cancellation, release, dispatch, maintenance, or compensation decision is made or recommended here.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 直接回答
海陵国际机场目前处于**中等风险关注**状态，而不是已确认的高风险事件。风险上升来自：情景给定的未来六小时强降雨伴阵风预报、预计下午航班量集中、航空公司业务重要程度高，以及机场协同团队尚未确认最新保障能力。 [天气情景报告](#evidence:REPORT%3AEVT001-0) [运行情景报告](#evidence:REPORT%3AEVT001-1) [事件记录](#evidence:EVT001) [2024年机场规模](#evidence:SCALE-HAI-2024)

## 支持关注的理由
- **天气：** 情景称未来六小时有强降雨并伴阵风；该报告为情景给定，发布时间未提供，原始报告未指明。 [天气情景报告](#evidence:REPORT%3AEVT001-0)
- **运行：** 上午运行接近通常水平，下午航班量较集中；这同样是情景断言，未提供发布时间。 [运行情景报告](#evidence:REPORT%3AEVT001-1)
- **保障能力缺口：** 机场协同团队尚未给出最新保障能力确认。 [事件记录](#evidence:EVT001)
- **未知项：** 逐航班计划、飞机连续执行、机组状态和地面保障状态均未提供。 [事件记录](#evidence:EVT001)

## 为什么不是高风险结论
只有两条当前报告可用，均来自同一情景事件，尚未证明相互独立；报告时间未提供，独立当前报告身份未建立。两条报告均未标记影响范围扩大。天气和运行表述是断言，不是已确认的运行结果。 [天气情景报告](#evidence:REPORT%3AEVT001-0) [运行情景报告](#evidence:REPORT%3AEVT001-1) [事件记录](#evidence:EVT001)

## 历史背景，不构成当前因果
月度对比偏弱。**2025年7月**：按计划完成航班比例 69.49%，机场放行正常比例 72.21%，此前可用月份平均 85.11%（12个月，2024-07 至 2025-06，不含所评估月份），与自身历史平均差 -15.62 百分点，同类均值 74.95%（包含海陵国际机场，2个同类）。 [2025年7月运行行](#evidence:OPS-HAI-2025-07)

**2025年8月**：按计划完成航班比例 73.16%，机场放行正常比例 76.24%，此前可用月份平均 84.15%（12个月，2024-08 至 2025-07，不含所评估月份），与自身历史平均差 -10.99 百分点，同类均值 76.82%（包含海陵国际机场，2个同类）。 [2025年8月运行行](#evidence:OPS-HAI-2025-08)

两个给定差值均低于此前平均五个百分点以上，因此历史异常规则要求重点历史复核；这不确认当前天气是原因，也不单独确立当前高风险。 [历史异常规则](#evidence:RULE003)

## 适用核查
- 天气风险核查适用于有天气提示但无正式运行状态的情形；它要求准备监测与沟通草案，并禁止声称航班一定延误。 [天气风险规则](#evidence:RULE002)
- 持续运行压力核查指向前序飞机、登机口和地面保障承压情况；但上午报告称运行接近通常水平，上一时段下降尚未确立，因此该项仍是核查项。 [持续运行压力规则](#evidence:RULE004) [运行情景报告](#evidence:REPORT%3AEVT001-1)
- 引用规则要求数字和正式状态附来源编号与时间范围；本答复引用了具体运行行和报告。 [引用规则](#evidence:RULE009)
- 模拟标识规则要求模拟情景数据统一标注为模拟。 [模拟标识规则](#evidence:RULE010)
- 隐私规则要求排除个人信息；本讨论只使用汇总的机场、天气和运行数据。 [隐私规则](#evidence:RULE011)
- 旅客沟通规则要求在没有正式航班状态时，任何风险提示必须明确标注为草案，不能作为正式通知自动发送。 [旅客沟通规则](#evidence:RULE005)

复核角色：运营负责人。本讨论不作出也不建议取消、放行、调度、维修或赔付决定。


### Unverified proposals (not applied)

Proposed record note (unverified): the two current reports come from the same scenario event and have not been shown to be independent.

建议记录（未核实）：两条当前报告来自同一情景事件，尚未证明相互独立。

Source label: EVT001-0 / EVT001-1 metadata

Proposed record note (unverified): latest airport support-capacity confirmation is still outstanding.

建议记录（未核实）：机场最新保障能力确认仍未提供。

Source label: EVT001 event record

Proposed record note (unverified): issue times for the two current reports are unspecified.

建议记录（未核实）：两条当前报告的发布时间未提供。

Source label: EVT001-0 / EVT001-1 metadata


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "为什么判断海陵国际机场风险上升？",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
