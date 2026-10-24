# TEST014-zh: 时间范围

Input: 使用哪个时段的数据？

Expected: 明确当前事件和历史基线时间范围

Prohibited: 不得混用单月与累计

Fact check: 时间字段

Scoring focus: 时间一致性


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 81.26s; app-accounted cost: ¥0.161144.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Direct answer

Use the period that matches the decision question.

- **Current operating picture:** use the two supplied current reports with applicable period exactly `第4天下午14:00` — the forecast of strong rain and gusts for the next six hours, and the note that morning operations were near normal while the afternoon flight bank is more concentrated [weather report](#evidence:REPORT%3AEVT001-0), [operations report](#evidence:REPORT%3AEVT001-1). Both match by exact text with `0` minute offset, inside the inclusive `30`-minute window. Report creation times are not supplied; that alone does not prevent the period match or by itself meet the separate unknown-source stop condition [RULE012](#evidence:RULE012). Both reports are scenario-given; a period match does not by itself establish reliability, independence or authority [weather report](#evidence:REPORT%3AEVT001-0), [operations report](#evidence:REPORT%3AEVT001-1). They also do not establish independent current-source identity [EVT001](#evidence:EVT001).
- **Historical review:** use the monthly operating rows by their stated month. They are not current reports. Through the supplied cutoff of `2025-08`, the five-point anomaly months are `2025-07` and `2025-08`; the anomaly count is `2` [July 2025 baseline](#evidence:OPS-HAI-2025-07), [August 2025 baseline](#evidence:OPS-HAI-2025-08).
- **Annual scale:** use `2024` annual scale only as background on airport size and business importance, not as a current-period signal [2024 airport scale](#evidence:SCALE-HAI-2024).

## Historical comparison

| Assessed month | Completed as planned | Release normality (separate measure) | Prior available-month mean | Difference | Same-category mean, includes HAI | Baseline window, excluding assessed month |
|---|---:|---:|---:|---:|---:|---|
| `2025-07` | `69.49%` | `72.21%` | `85.11%` | `-15.62 pp` | `74.95%` | 12 prior months, `2024-07`–`2025-06` |
| `2025-08` | `73.16%` | `76.24%` | `84.15%` | `-10.99 pp` | `76.82%` | 12 prior months, `2024-08`–`2025-07` |

Values are from the monthly operating rows [July 2025](#evidence:OPS-HAI-2025-07), [August 2025](#evidence:OPS-HAI-2025-08). The same-category peer count is `2`, including HAI. The five-point anomaly threshold is the supplied rule [RULE003](#evidence:RULE003). Baseline type: `2024-01` is initialization with `0` prior months; `2024-02`–`2024-12` are partial-history months, not initialization; `2025-01` onward uses `12` prior months [January 2024 baseline](#evidence:OPS-HAI-2024-01), [February 2024 baseline](#evidence:OPS-HAI-2024-02), [January 2025 baseline](#evidence:OPS-HAI-2025-01). These historical shortfalls call for focused historical review; they do not confirm current causation or independently make the current period high risk.

## Current picture and limits

For the current period, the supported risk is medium: strong rain and gusts are forecast for the next six hours, and the afternoon flight bank is more concentrated, while the airport coordination team has not yet provided a latest support-capacity confirmation [EVT001](#evidence:EVT001). Unknowns remain the per-flight plan, aircraft rotation, crew and ground-support status [EVT001](#evidence:EVT001). The event is marked pending, not a confirmed formal operating status [EVT001](#evidence:EVT001).

Also apply the supplied rules on sourcing, simulation labeling, privacy, weather-risk checks, sustained-pressure checks and passenger communication: [RULE009](#evidence:RULE009), [RULE010](#evidence:RULE010), [RULE011](#evidence:RULE011), [RULE002](#evidence:RULE002), [RULE004](#evidence:RULE004), [RULE005](#evidence:RULE005).

**Review owner:** Operations lead.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 直接回答

按要回答的问题选择时段数据。

- **当前运行画面：** 使用适用时段正好为 `第4天下午14:00` 的两条当前报告——未来六小时预计强降雨并伴有阵风，以及上午运行接近通常水平、下午航班量较集中的说明 [天气报告](#evidence:REPORT%3AEVT001-0)，[运行报告](#evidence:REPORT%3AEVT001-1)。两条都按文本完全匹配，偏移 `0` 分钟，在包含前后各 `30` 分钟的时间窗内。报告创建时间未提供；仅缺创建时间不阻止时段匹配，也不单独满足另一个“来源可靠性未知”的停止条件 [RULE012](#evidence:RULE012)。两条都是赛事给定报告；时段匹配本身不确认可靠性、独立性或权限 [天气报告](#evidence:REPORT%3AEVT001-0)，[运行报告](#evidence:REPORT%3AEVT001-1)。它们也不确立独立的当前来源身份 [EVT001](#evidence:EVT001)。
- **历史复核：** 按月份使用月度运行行，不用作当前报告。到提供的 `2025-08` 截止月为止，五点异常月份是 `2025-07` 和 `2025-08`；异常数量为 `2` [2025年7月基线](#evidence:OPS-HAI-2025-07)，[2025年8月基线](#evidence:OPS-HAI-2025-08)。
- **年度规模：** `2024` 年规模只作为机场体量和业务重要程度的背景，不是当前时段信号 [2024年机场规模](#evidence:SCALE-HAI-2024)。

## 历史对比

| 评估月份 | 按计划完成航班比例 | 机场放行正常比例（单独指标） | 此前可用月份平均 | 差值 | 同类机场平均（包含本机场） | 排除评估月后的基线窗口 |
|---|---:|---:|---:|---:|---:|---|
| `2025-07` | `69.49%` | `72.21%` | `85.11%` | `-15.62 pp` | `74.95%` | 前 `12` 个月，`2024-07`–`2025-06` |
| `2025-08` | `73.16%` | `76.24%` | `84.15%` | `-10.99 pp` | `76.82%` | 前 `12` 个月，`2024-08`–`2025-07` |

数值来自月度运行行 [2025年7月](#evidence:OPS-HAI-2025-07)，[2025年8月](#evidence:OPS-HAI-2025-08)。同类机场数量为 `2`，包含海陵机场。五点异常阈值见提供的规则 [RULE003](#evidence:RULE003)。基线类型：`2024-01` 是初始月份，此前可用月份为 `0`；`2024-02`–`2024-12` 是部分历史月份，不是初始化；`2025-01` 起使用前 `12` 个月 [2024年1月基线](#evidence:OPS-HAI-2024-01)，[2024年2月基线](#evidence:OPS-HAI-2024-02)，[2025年1月基线](#evidence:OPS-HAI-2025-01)。这些历史偏低需要重点历史复核；它们不确认当前因果，也不单独把当前时段定为高风险。

## 当前情况与限制

当前时段的支持风险为中等：未来六小时预计强降雨并伴有阵风，下午航班量较集中，而机场协同团队尚未给出最新保障能力确认 [EVT001](#evidence:EVT001)。未知信息仍是逐航班计划、飞机连续执行、机组和地面保障状态 [EVT001](#evidence:EVT001)。事件状态为待处理，不是已确认的正式运行状态 [EVT001](#evidence:EVT001)。

同时遵循提供的引用、模拟标识、隐私、天气风险核查、持续压力核查和旅客沟通规则：[RULE009](#evidence:RULE009)，[RULE010](#evidence:RULE010)，[RULE011](#evidence:RULE011)，[RULE002](#evidence:RULE002)，[RULE004](#evidence:RULE004)，[RULE005](#evidence:RULE005)。

**复核负责人：** 运营负责人。


### Unverified proposals (not applied)


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
