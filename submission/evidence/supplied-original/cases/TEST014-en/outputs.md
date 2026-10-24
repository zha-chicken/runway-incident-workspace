# TEST014-en: 时间范围

Input: Which time period of data is being used?

Expected: 明确当前事件和历史基线时间范围

Prohibited: 不得混用单月与累计

Fact check: 时间字段

Scoring focus: 时间一致性


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 82.07s; app-accounted cost: ¥0.165518.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Direct answer

The case uses **three time layers**. The current scenario period is **第4天下午14:00**; the supplied monthly operations and weather history runs **2024-01 through 2025-08**; the annual scale is **2024 only**. In the monthly baseline, **2025-08 is the assessed month**, and its historical mean excludes that month. No later monthly records are supplied. [scenario weather report](#evidence:REPORT%3AEVT001-0) [scenario operations note](#evidence:REPORT%3AEVT001-1) [2025-08 operations row](#evidence:OPS-HAI-2025-08) [2025-08 weather row](#evidence:WX-HAI-2025-08)

### Current scenario window
- Both current reports apply to **第4天下午14:00**: a six-hour forecast of strong rain with gusts, and a note that morning operations were near normal while afternoon traffic is concentrated [scenario weather report](#evidence:REPORT%3AEVT001-0) [scenario operations note](#evidence:REPORT%3AEVT001-1). Neither report has an exact reported time, and both trace to the same scenario event EVT001; they are not two independent current reports [scenario event record](#evidence:EVT001) [citation rule](#evidence:RULE009).
- The scenario time is not today's calendar date. Official operating status is still unconfirmed; this answer does not infer delay or cancellation [scenario event record](#evidence:EVT001).

### Monthly operating baseline
- Monthly operations cover **2024-01 through 2025-08** [2024-01 operations row](#evidence:OPS-HAI-2024-01) [2025-08 operations row](#evidence:OPS-HAI-2025-08). For the **2025-08** row, the prior available-month mean uses **12** months, **2024-08 through 2025-07**, excluding 2025-08; peer count is **2** including HAI [2025-08 operations row](#evidence:OPS-HAI-2025-08).

| Assessed month | Completed as planned | Release normality | Prior available-month mean | Difference from historical mean | Same-category mean (includes HAI) | Baseline months and range | Peer count |
|---|---:|---:|---:|---:|---:|---|---:|
| 2025-08 [row](#evidence:OPS-HAI-2025-08) | `73.16%` | `76.24%` | `84.15%` | `-10.99` pp | `76.82%` | 12 months: 2024-08 to 2025-07 | 2 (includes HAI) |
| 2025-07 [row](#evidence:OPS-HAI-2025-07) | `69.49%` | `72.21%` | `85.11%` | `-15.62` pp | `74.95%` | 12 months: 2024-07 to 2025-06 | 2 (includes HAI) |

- These monthly gaps are historical-review signals; a gap of more than five percentage points calls for focused review under the anomaly rule, but it does not confirm current causation or independently establish a current high-risk event [anomaly rule](#evidence:RULE003) [2025-08 operations row](#evidence:OPS-HAI-2025-08) [2025-07 operations row](#evidence:OPS-HAI-2025-07).
- The first monthly row, **2024-01**, is initialization only with **0** prior months, so it is not a multi-month baseline [2024-01 operations row](#evidence:OPS-HAI-2024-01).

### Weather and scale
- Monthly weather covers **2024-01 through 2025-08** and is historical monthly context, not the current six-hour forecast [2024-01 weather row](#evidence:WX-HAI-2024-01) [2025-08 weather row](#evidence:WX-HAI-2025-08).
- Annual scale is **2024 only**: passenger throughput **4,276 万人次** and aircraft movements **65,209**; it is not a current-period input [2024 scale row](#evidence:SCALE-HAI-2024).

### Rules affecting this answer
- Source and time-scope citation check [citation rule](#evidence:RULE009); simulation labeling [simulation-label rule](#evidence:RULE010); privacy and exclusion of personal data [privacy rule](#evidence:RULE011); weather-risk preparation [weather-risk rule](#evidence:RULE002); sustained-pressure review sequence [sustained-pressure rule](#evidence:RULE004); passenger communication only as a draft [passenger-draft rule](#evidence:RULE005).
- The supported risk assessment is **medium**. This is a data-scope answer; it does not make or recommend cancellation, release, dispatch, maintenance, compensation, or message-sending decisions.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 直接回答

本案例使用**三层时间范围**。当前情景时间为**第4天下午14:00**；提供的月度运行与天气历史为**2024-01至2025-08**；年度规模仅**2024年**。月度基线中，**2025-08是评估月**，其历史均值不包含该月。未提供更晚的月度记录。[情景天气报告](#evidence:REPORT%3AEVT001-0) [情景运行说明](#evidence:REPORT%3AEVT001-1) [2025-08运行行](#evidence:OPS-HAI-2025-08) [2025-08天气行](#evidence:WX-HAI-2025-08)

### 当前情景窗口
- 两份当前报告都适用于**第4天下午14:00**：一份是未来六小时强降雨伴阵风，另一份是上午运行接近通常水平、下午航班量较集中 [情景天气报告](#evidence:REPORT%3AEVT001-0) [情景运行说明](#evidence:REPORT%3AEVT001-1)。两份均未提供精确报告时间，且均来自同一情景事件 EVT001，不能视为两份相互独立的当前报告 [情景事件记录](#evidence:EVT001) [引用规则](#evidence:RULE009)。
- 情景时间不是今天的日历日期。正式运行状态仍未确认；这里不推断延误或取消 [情景事件记录](#evidence:EVT001)。

### 月度运行基线
- 月度运行记录覆盖**2024-01至2025-08** [2024-01运行行](#evidence:OPS-HAI-2024-01) [2025-08运行行](#evidence:OPS-HAI-2025-08)。对**2025-08**这一行，此前可用月份均值为**12**个月，即**2024-08至2025-07**，不包含2025-08；同类机场数为**2**，包含海陵机场 [2025-08运行行](#evidence:OPS-HAI-2025-08)。

| 评估月 | 按计划完成航班比例 | 机场放行正常比例 | 此前可用月份平均 | 与自身平均差 | 同类均值（含本机场） | 基线月份数及范围 | 同类机场数 |
|---|---:|---:|---:|---:|---:|---|---:|
| 2025-08 [行](#evidence:OPS-HAI-2025-08) | `73.16%` | `76.24%` | `84.15%` | `-10.99` 百分点 | `76.82%` | 12个月：2024-08至2025-07 | 2（含海陵） |
| 2025-07 [行](#evidence:OPS-HAI-2025-07) | `69.49%` | `72.21%` | `85.11%` | `-15.62` 百分点 | `74.95%` | 12个月：2024-07至2025-06 | 2（含海陵） |

- 这些月度差距是历史复核信号；差距超过五个百分点时，适用的异常规则要求重点复核，但不能确认当前事件的因果，也不能单独把当前事件定为高风险 [异常规则](#evidence:RULE003) [2025-08运行行](#evidence:OPS-HAI-2025-08) [2025-07运行行](#evidence:OPS-HAI-2025-07)。
- 第一条月度记录**2024-01**仅为初始化，此前可用月份为**0**，因此不是多月基线 [2024-01运行行](#evidence:OPS-HAI-2024-01)。

### 天气与规模
- 月度天气覆盖**2024-01至2025-08**，是历史月度背景，不是当前六小时预报 [2024-01天气行](#evidence:WX-HAI-2024-01) [2025-08天气行](#evidence:WX-HAI-2025-08)。
- 年度规模仅**2024年**：旅客吞吐量**4,276万人次**、飞机起降**65,209架次**；不是当前时段输入 [2024年规模行](#evidence:SCALE-HAI-2024)。

### 影响本答复的规则
- 来源与时间范围引用核查 [引用规则](#evidence:RULE009)；模拟标识 [模拟标识规则](#evidence:RULE010)；隐私与个人信息排除 [隐私规则](#evidence:RULE011)；天气风险准备 [天气风险规则](#evidence:RULE002)；持续运行压力核查顺序 [持续压力规则](#evidence:RULE004)；旅客沟通仅限草案 [旅客草案规则](#evidence:RULE005)。
- 支持的风险评估为**中等**。这是数据范围回答；不作也不建议取消、放行、调度、维修、赔付或发送消息等决定。


### Unverified proposals (not applied)


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Which time period of data is being used?",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
