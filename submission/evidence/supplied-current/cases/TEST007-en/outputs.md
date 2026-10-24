# TEST007-en: 新机场

Input: Enter a new incident at Linjiang Airport.

Expected: 根据新输入和基线响应

Prohibited: 不得回放固定答案

Fact check: 是否读取新机场数据

Scoring focus: 泛化能力


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 111.89s; app-accounted cost: ¥0.234583.


### EN output

Risk: medium; status: needs_review

#### Rationale

- [fact] A simulated airport coordination report says stand support is temporarily insufficient for the current period, while no official delay or cancellation is confirmed. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] The report is supplied as human-verified and comes from one independent group; the current report set contains only that one usable report. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] Official flight status remains unconfirmed; the report does not identify specific flights, stand counts, cause, or expected duration. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] Historical monthly rows for July 2024 and August 2025 are supplied as anomaly rows with negative deltas from their prior 12-month averages; this is historical context, not a current cause. Sources: OPS-LIN-2024-07, OPS-LIN-2025-08; metrics: OPS-LIN-2024-07:delta, OPS-LIN-2025-08:delta

- [fact] Linjiang is a small airport with low airline business importance in the supplied annual scale. Sources: SCALE-LIN-2025; metrics: 

- [fact] This is a simulation and outputs must be marked accordingly; no personal data is supplied, so drafts use only aggregate operational information. Sources: RULE010, RULE011, REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] Because no official flight status exists, passenger messaging is limited to a clearly marked draft and must direct passengers to official updates. Sources: RULE005, REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [assumption] If the stand constraint persists, turnaround and departure sequencing may come under pressure, but no delay or cancellation outcome is established. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

#### Actions

- first [verify]: Verify with airport coordination and operations the scope, duration, affected stands or flights, and current official flight status; keep the result as information only. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE009; rules: RULE005, RULE009

- follow-1 [monitor]: Monitor stand support and official airport or airline updates for the current simulated period. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009; rules: RULE009

- follow-2 [prepare_information]: Prepare a short internal note listing confirmed facts, unknowns, and items needing operations lead review. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009; rules: RULE009

- follow-3 [prepare_draft]: Prepare passenger and airport coordination drafts only; do not send them or treat them as official notices. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005; rules: RULE005

- follow-4 [prepare_information]: Check that all messages use simulation labels and exclude personal data. Sources: RULE010, RULE011; rules: RULE010, RULE011

#### informationGaps

- Specific affected flights and time window.

- Number of available stands and current occupancy.

- Expected duration and cause of the stand shortage.

- Official airport or airline flight status.

- Current traffic demand and turnaround workload.

- Weather or other operational constraints.

- Passenger impact and service needs.

- Independent confirmation beyond the single supplied report.

#### assumptionsToVerify

- Whether the stand shortage is airport-wide or limited to specific stands or areas.

- The expected duration of the temporary stand constraint.

- Whether any flight has an official delay, cancellation, or restriction status.

- Whether any safety, weather, or other operational constraint contributes to the report.

- Whether the report remains current for the whole simulated period.

- Whether another independent source can confirm the stand situation.

#### escalationConditions

- Official delay, cancellation, or airport restriction status appears.

- The stand shortage persists beyond the current period or appears to expand.

- A second independent source confirms the capacity constraint.

- Any safety concern or passenger welfare issue is reported.

- Source reliability becomes unknown or conflicting information appears.

#### humanDecisions

- Operations lead to confirm the scope and any operational response.

- Whether to authorize a passenger communication after official status is confirmed.

- Whether to escalate if the stand shortage persists or expands.

- Any cancellation, release, dispatch, maintenance, or compensation decision remains with authorized human leads.

#### Possible impacts

- [fact] No official delay or cancellation is confirmed for the current simulated period. Sources: REPORT:PUBLIC-7-en-CAPACITY

- [assumption] Temporary stand shortage may increase stand waiting and turnaround pressure if it continues. Sources: REPORT:PUBLIC-7-en-CAPACITY

- [assumption] Departure sequencing could be affected if the constraint is not resolved, but this is not established. Sources: REPORT:PUBLIC-7-en-CAPACITY

- [unknown] Specific affected flights and passenger volumes are not supplied. Sources: 

- [fact] Low business importance may limit wider network impact from this airport. Sources: SCALE-LIN-2025

#### operations

SIMULATION / 模拟 — DRAFT / 草案. Operations checks, in order: 1) confirm current stand availability and occupancy; 2) identify affected flights or time window; 3) confirm expected duration; 4) check official flight status; 5) report any safety or expanding impact to the operations lead. The simulated airport coordination report says stand support is temporarily insufficient; no official delay or cancellation is confirmed. This is not dispatch or cancellation guidance.

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE009

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案. Request from airport coordination: current available stand count and occupancy; affected flights and time window; expected duration; whether any official delay, cancellation, or restriction is in force; any weather or safety constraint; source and update time for the report. The current simulated report says stand support is temporarily insufficient; official status is unconfirmed.

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009

#### passenger

SIMULATION / 模拟 — DRAFT / 草案. A simulated airport coordination report notes temporary stand support constraints at Linjiang Airport. No official delay or cancellation is confirmed for any flight. Please check official airline and airport channels for your flight status. This draft is not an official notice.

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005


### ZH output

Risk: medium; status: needs_review

#### Rationale

- [fact] 一份模拟的机场协调报告称，当前时段机位保障暂时不足，但未确认任何正式延误或取消。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 该报告按人工核验状态提供，来自一个独立来源组；当前报告集中只有这一份可用报告。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 正式航班状态仍未确认；报告未指明具体航班、机位数量、原因或预计持续时间。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 2024年7月和2025年8月的历史月度记录被列为异常行，较此前12个月平均为负向差值；这是历史背景，不是当前原因。 Sources: OPS-LIN-2024-07, OPS-LIN-2025-08; metrics: OPS-LIN-2024-07:delta, OPS-LIN-2025-08:delta

- [fact] 在提供的年度规模数据中，临江机场为小型机场，航空公司业务重要程度低。 Sources: SCALE-LIN-2025; metrics: 

- [fact] 这是模拟场景，输出必须相应标注；未提供个人数据，因此草案仅使用汇总运行信息。 Sources: RULE010, RULE011, REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 由于没有正式航班状态，旅客信息仅限于明确标注的草案，并必须引导旅客查看官方更新。 Sources: RULE005, REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [assumption] 如果机位限制持续，周转和放行排序可能承压，但尚未确立任何延误或取消结果。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

#### Actions

- first [verify]: 向机场协调和运行部门核实范围、持续时间、受影响机位或航班以及当前正式航班状态；结果仅作为信息使用。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE009; rules: RULE005, RULE009

- follow-1 [monitor]: 监测当前模拟时段的机位保障以及机场或航空公司官方更新。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009; rules: RULE009

- follow-2 [prepare_information]: 准备一份简短内部说明，列出已确认事实、未知信息和需要运营负责人复核的事项。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009; rules: RULE009

- follow-3 [prepare_draft]: 仅准备旅客和机场协调草案；不要发送，也不要将其视为正式通知。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005; rules: RULE005

- follow-4 [prepare_information]: 检查所有信息是否使用模拟标识并排除个人数据。 Sources: RULE010, RULE011; rules: RULE010, RULE011

#### informationGaps

- 具体受影响航班和时间窗口。

- 可用机位数量和当前占用情况。

- 机位不足的预计持续时间和原因。

- 机场或航空公司的正式航班状态。

- 当前流量需求和周转工作量。

- 天气或其他运行限制。

- 旅客影响和服务需求。

- 单一报告之外的独立确认。

#### assumptionsToVerify

- 机位不足是全机场范围，还是仅限特定机位或区域。

- 临时机位限制的预计持续时间。

- 是否有航班已有正式延误、取消或限制状态。

- 是否有安全、天气或其他运行限制促成该报告。

- 该报告是否在整个模拟时段内仍然有效。

- 是否有另一个独立来源可确认机位情况。

#### escalationConditions

- 出现正式延误、取消或机场限制状态。

- 机位不足持续到当前时段之后或似乎扩大。

- 第二个独立来源确认容量限制。

- 报告任何安全问题或旅客服务问题。

- 来源可靠性变得未知或出现相互冲突的信息。

#### humanDecisions

- 由运营负责人确认范围和任何运行响应。

- 在正式状态确认后，是否批准旅客沟通。

- 如果机位不足持续或扩大，是否升级。

- 任何取消、放行、调度、维修或赔付决定仍由获授权的人工负责人作出。

#### Possible impacts

- [fact] 当前模拟时段未确认任何正式延误或取消。 Sources: REPORT:PUBLIC-7-en-CAPACITY

- [assumption] 如果临时机位不足持续，可能增加等待机位和周转压力。 Sources: REPORT:PUBLIC-7-en-CAPACITY

- [assumption] 如果限制未解除，放行排序可能受影响，但目前尚未确立。 Sources: REPORT:PUBLIC-7-en-CAPACITY

- [unknown] 未提供具体受影响航班和旅客量。 Sources: 

- [fact] 较低的业务重要程度可能限制该机场对更大网络的影响。 Sources: SCALE-LIN-2025

#### operations

模拟 / SIMULATION — 草案 / DRAFT。运行检查顺序：1）确认当前机位可用性和占用情况；2）识别受影响航班或时间窗口；3）确认预计持续时间；4）核查正式航班状态；5）向运营负责人报告任何安全或扩大影响。模拟机场协调报告称机位保障暂时不足；未确认任何正式延误或取消。这不是调度或取消指导。

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE009

#### airportCoordination

模拟 / SIMULATION — 草案 / DRAFT。向机场协调请求：当前可用机位数量和占用情况；受影响航班和时间窗口；预计持续时间；是否已有正式延误、取消或限制；任何天气或安全限制；报告来源和更新时间。当前模拟报告称机位保障暂时不足；正式状态未确认。

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009

#### passenger

模拟 / SIMULATION — 草案 / DRAFT。一份模拟机场协调报告提到临江机场存在临时机位保障限制。未确认任何航班的正式延误或取消。请通过航空公司或机场官方渠道查询您的航班状态。本草案不是正式通知。

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Enter a new incident at Linjiang Airport.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
