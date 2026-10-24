# TEST002-en: 事实引用

Input: Why is the risk at Hailing International Airport rising?

Expected: 引用模拟天气、历史基线和机场重要程度

Prohibited: 不得无来源添加事实

Fact check: 来源编号是否完整

Scoring focus: 引用正确


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 85.83s; app-accounted cost: ¥0.168346.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Direct answer
The simulated risk is rising because a short-fuse weather forecast is meeting a concentrated afternoon traffic pattern while ground-capacity status remains unconfirmed. The supported assessment is **medium risk**, not high risk; no stop condition or professional-decision restriction is triggered.

- **Current weather trigger:** For the scenario period day 4, 14:00, the next six hours are forecast to have strong rainfall with gusts. The applicable period is supplied, but the report time and origin are unspecified. [scenario weather report](#evidence:REPORT%3AEVT001-0)
- **Exposure:** Morning operations are described as close to usual levels, but afternoon flight volume is concentrated. This is one scenario event with two assertions, not two independent current reports. [scenario operations report](#evidence:REPORT%3AEVT001-1) [event record](#evidence:EVT001)
- **Known and unknown:** Known inputs are limited to forecast weather, historical monthly baselines and airport scale; per-flight plans, aircraft rotations, crew and ground-support status are unknown. The airport coordination team has not yet confirmed latest capacity, and official operational status is unconfirmed. [event record](#evidence:EVT001)
- **Operational significance:** The event record marks airline business importance as high. Under the weather-risk rule, a medium/high weather indication without a formal operational status calls for checks of airport support, prior operations and later flight concentration, plus a monitoring checklist and communication draft; it does not allow a claim that flights will certainly be delayed. [weather-risk rule](#evidence:RULE002) [sustained-pressure rule](#evidence:RULE004)
- **Historical context:** The latest supplied monthly baseline, 2025-08, is below its prior 12-month mean by more than five percentage points. That triggers focused historical review, not proof that current weather is causing current disruption and not an independent current high-risk finding. [2025-08 baseline](#evidence:OPS-HAI-2025-08) [anomaly rule](#evidence:RULE003)

### Historical comparison (simulated monthly baseline)
| Month | Completed as planned | Release normality | Prior available-month mean | Difference | Same-category mean (includes HAI) | Prior baseline |
|---|---:|---:|---:|---:|---:|---|
| 2025-07 [baseline](#evidence:OPS-HAI-2025-07) | 69.49% | 72.21% | 85.11% | -15.62 pp | 74.95% | 12 months, 2024-07 to 2025-06 |
| 2025-08 [baseline](#evidence:OPS-HAI-2025-08) | 73.16% | 76.24% | 84.15% | -10.99 pp | 76.82% | 12 months, 2024-08 to 2025-07 |

Peer count is 2 for each row, including HAI. The latest assessed month is 2025-08; its prior baseline excludes 2025-08. The 2025-07 row also shows a negative difference, but it is historical context, not a causation finding. [2025-07 baseline](#evidence:OPS-HAI-2025-07) [2025-08 baseline](#evidence:OPS-HAI-2025-08)

## What this means
The supported explanation is **forecast weather + afternoon traffic concentration + unverified ground capacity + recent weak monthly baselines**. The historical weakness supports a focused review under the five-point anomaly rule, but it does not confirm causation or by itself establish current high risk. [anomaly rule](#evidence:RULE003)

## Relevant constraints
- Any number or formal status must have a source and time scope. [citation rule](#evidence:RULE009)
- Simulated events and values must be labelled as simulation. [simulation-labelling rule](#evidence:RULE010)
- Personal data is excluded; use aggregate information only. [privacy rule](#evidence:RULE011)
- Because there is risk without an official flight status, passenger messaging must be a draft based on public facts and update time, not an automatically sent notice. [passenger-communication rule](#evidence:RULE005)

### Suggested verification before any operational position
1. Confirm airport capacity, gate/stand availability, and ground-support status with airport coordination.
2. Obtain the per-flight schedule, aircraft rotations, crew status, and expected afternoon peak.
3. Check prior aircraft and ground-support pressure in sequence, as required for a sustained-pressure review.
4. Re-check the official status source and timestamp before any external communication.

No cancellation, release, dispatch, maintenance, compensation, or message-sending action is made or recommended here.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 直接回答
模拟中的风险上升，是因为短时天气预报与下午航班集中叠加，而地面保障能力仍未确认。受支持的评估是**中等风险**，不是高风险；没有触发停止条件，也没有触发需要专业负责人决断的限制。

- **当前天气触发：** 在情景时间第4天下午14:00，未来六小时预计强降雨并伴有阵风。适用时段已给出，但报告时间和来源未说明。[情景天气报告](#evidence:REPORT%3AEVT001-0)
- **暴露度：** 上午运行接近通常水平，但下午航班量较集中。这是同一个情景事件中的两条描述，不应视为两个相互独立的当前报告。[情景运行报告](#evidence:REPORT%3AEVT001-1) [事件记录](#evidence:EVT001)
- **已知与未知：** 已知信息仅限天气预报、历史月度基线和机场规模；逐航班计划、飞机连续执行、机组和地面保障状态未知。机场协同团队尚未确认最新保障能力，正式运行状态也未确认。[事件记录](#evidence:EVT001)
- **运行意义：** 事件记录将航空公司业务重要程度标为高。按天气风险规则，天气提示达到中高风险但尚无正式运行状态时，应核查机场保障、前序运行和后续航班集中程度，并准备监测清单和沟通草案；不得声称航班一定延误。[天气风险规则](#evidence:RULE002) [持续压力规则](#evidence:RULE004)
- **历史背景：** 最新提供的月度基线2025-08比此前12个月均值低超过五个百分点。这应触发重点历史复核，但不能证明当前天气正在造成当前扰动，也不能单独构成当前高风险结论。[2025-08 基线](#evidence:OPS-HAI-2025-08) [异常波动规则](#evidence:RULE003)

### 历史对比（模拟月度基线）
| 月份 | 按计划完成航班比例 | 机场放行正常比例 | 此前可用月份平均 | 差值 | 同类均值（包含本机场） | 此前基线 |
|---|---:|---:|---:|---:|---:|---|
| 2025-07 [基线](#evidence:OPS-HAI-2025-07) | 69.49% | 72.21% | 85.11% | -15.62 个百分点 | 74.95% | 12个月，2024-07至2025-06 |
| 2025-08 [基线](#evidence:OPS-HAI-2025-08) | 73.16% | 76.24% | 84.15% | -10.99 个百分点 | 76.82% | 12个月，2024-08至2025-07 |

每行同类机场数量为2，包含海陵国际机场。最新被评估月份为2025-08；其此前基线不含2025-08。2025-07同样呈负向差值，但这是历史背景，不是因果结论。[2025-07 基线](#evidence:OPS-HAI-2025-07) [2025-08 基线](#evidence:OPS-HAI-2025-08)

## 这意味着什么
受支持的解释是**预报天气 + 下午流量集中 + 地面保障能力未核实 + 近期月度基线偏弱**。历史偏弱支持按五个百分点异常阈值做重点复核，但不确认因果，也不单独建立当前高风险。[异常波动规则](#evidence:RULE003)

## 相关约束
- 任何数字或正式状态都要有来源和时间范围。[引用规则](#evidence:RULE009)
- 模拟事件和模拟数值必须标注为模拟。[模拟标识规则](#evidence:RULE010)
- 不包含旅客或员工个人信息，只使用汇总信息。[隐私保护规则](#evidence:RULE011)
- 存在风险但无正式航班状态时，旅客提示只能作为基于公开事实和更新时间的草案，不能自动作为正式通知发送。[旅客沟通规则](#evidence:RULE005)

### 在形成任何运行立场前的核查建议
1. 与机场协同确认最新保障能力、登机口/机位可用性和地面保障状态。
2. 取得逐航班计划、飞机连续执行、机组状态和下午高峰预期。
3. 按时间顺序核查前序飞机和地面保障承压情况，用于持续运行压力复核。
4. 在任何对外沟通前，重新核对正式状态来源及更新时间。

此处不作出也不建议实际取消、放行、调度、维修、赔付或消息发送动作。


### Unverified proposals (not applied)

Proposed check: confirm whether airport coordination can provide the latest capacity, gate/stand availability and ground-support status; this is not yet confirmed.

建议核查：确认机场协同能否提供最新保障能力、登机口/机位可用性和地面保障状态；目前尚未确认。

Source label: Unverified proposal / 未核实建议

Proposed check: obtain the per-flight schedule, aircraft rotations, crew status and ground-support status, which are listed as unknown.

建议核查：取得逐航班计划、飞机连续执行、机组状态和地面保障状态；这些目前列为未知。

Source label: Unverified proposal / 未核实建议

Proposed check: confirm the official airport/airline operational status and its source timestamp; current status is unconfirmed.

建议核查：确认机场/航空公司的正式运行状态及其来源更新时间；当前状态未确认。

Source label: Unverified proposal / 未核实建议

Proposed review: examine the 2025-07 and 2025-08 monthly underperformance against the five-point anomaly threshold; this is historical review only.

建议复核：按五个百分点异常阈值检查2025-07和2025-08的月度偏低表现；这仅属历史复核。

Source label: Simulated monthly baseline / 模拟月度基线

Proposed communication: prepare a passenger-facing draft based only on public facts and official-update guidance; do not claim delay or cancellation.

建议沟通：仅依据公开事实和官方更新指引准备旅客提示草案；不得声称延误或取消。

Source label: Passenger-communication rule / 旅客沟通规则


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Why is the risk at Hailing International Airport rising?",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
