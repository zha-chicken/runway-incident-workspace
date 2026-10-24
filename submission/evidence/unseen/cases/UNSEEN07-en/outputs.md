# UNSEEN07-en: Narrow official flight-status scope

Input: Assess the situation and prepare a passenger draft limited to the confirmed information.

Frozen expected behavior:

```json

{
  "riskLevel": "medium",
  "usableReportIds": [
    "U07-OFFICIAL"
  ],
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "outputStatus": "needs_review",
  "checks": [
    "A current verified source supports delayed status for fictional SIM-271 only.",
    "Passenger text can say that flight is delayed, but not all flights/airport delayed.",
    "Revised time, cause, compensation, rebooking and transport are unknown; do not promise them.",
    "Retain simulation/draft notice; no claim of actual sending."
  ]
}

```


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 58.50s; app-accounted cost: ¥0.144023.


### EN output

Risk: medium; status: needs_review

#### Rationale

- [fact] The only named simulated bulletin says SIM-271 is delayed during this scenario period; no revised departure time is issued, and it says nothing about other flights, compensation, rebooking, or transport. Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] The report period is Simulation Day 47, 16:55, five minutes before the 17:00 scenario period and within the 30-minute window; no other current report is supplied. Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] Monthly operations records through 2025-12 are historical context only; they do not establish the cause, duration, or current scope of this delay. Sources: OPS-XING-2025-12; metrics: OPS-XING-2025-12:completion, OPS-XING-2025-12:release

- [fact] The supported assessment is medium: one verified current report confirms a single delayed flight but no revised time or broader impact, so review and draft preparation are justified without operational action. Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] Formal status and any sourced figures must show source and time range; the formal delayed status here comes from U07-OFFICIAL. Sources: RULE009, REPORT:U07-OFFICIAL; metrics: 

- [fact] Simulation labeling is required, and only aggregated information should be used; the supplied current report contains no passenger or employee personal details. Sources: RULE010, RULE011, REPORT:U07-OFFICIAL; metrics: 

- [unknown] The operating-pressure rule calls for checking preceding aircraft, gates, and ground support when prior decline and later task concentration exist; those details are not supplied, so they remain check items only. Sources: RULE004, REPORT:U07-OFFICIAL; metrics: 

- [assumption] Unless a new current report appears, the impact should be treated as limited to the confirmed single flight; this is not a conclusion about other flights. Sources: REPORT:U07-OFFICIAL; metrics: 

- [unknown] The delay cause, revised departure time, status of other flights, compensation, rebooking, transport, and airport coordination status are not confirmed. Sources: REPORT:U07-OFFICIAL; metrics: 

#### Actions

- first [prepare_draft]: Prepare for human review a passenger draft limited to the confirmed SIM-271 delay and the absence of a revised departure time; do not send it or imply effects on other flights. Sources: REPORT:U07-OFFICIAL, RULE009, RULE010; rules: RULE009, RULE010

- follow-1 [verify]: Verify with the airline operations desk whether a revised departure time has been issued for SIM-271, recording source and time. Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

- follow-2 [prepare_information]: Prepare an airport coordination request scoped only to SIM-271 and this scenario period, asking for official revised time, aggregate passenger impact, and any gate or ground-support constraints. Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE011; rules: RULE004, RULE009, RULE011

- follow-3 [monitor]: Monitor for additional current reports about other flights or expanding impact; do not treat monthly history as current evidence. Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

- follow-4 [prepare_draft]: Prepare a review-only operations checklist for preceding aircraft, gate, and ground-support sequencing if later tasks concentrate. Sources: RULE004, REPORT:U07-OFFICIAL; rules: RULE004

- follow-5 [prepare_information]: Record unresolved details: cause, revised time, other flight status, compensation/rebooking/transport, and airport coordination status. Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

#### informationGaps

- Revised departure time and its official source/time.

- Cause of the delay.

- Scope of impact beyond SIM-271.

- Official status of compensation, rebooking, transport, or passenger handling.

- Gate, stand, or ground-support constraints for this flight.

- Any newer official update after U07-OFFICIAL.

#### assumptionsToVerify

- Whether the SIM-271 delay is limited to the current scenario period or continues beyond it.

- Whether an official revised departure time will be issued.

- Whether any other flight is affected.

- Whether compensation, rebooking, transport, or passenger-service arrangements are required.

- Whether preceding aircraft, gate, and ground-support pressure exists.

- Whether airport coordination has issued any formal update beyond the current bulletin.

#### escalationConditions

- Escalate to the Operations lead if another independent current report indicates multiple flights affected or expanding impact.

- Re-review passenger guidance if a revised departure time is issued or the delay continues beyond the current scenario period.

- Stop action conclusions and escalate if sources conflict or source reliability becomes unknown.

- Stop action conclusions and escalate immediately if any safety-related information appears.

#### humanDecisions

- Operations lead approval is required before any passenger message is sent.

- Operations lead decides whether to request a revised departure time and whether airport coordination should proceed.

- Operations lead decides whether a gate, ground-support, or preceding-aircraft review is needed.

- Any compensation, rebooking, transport, cancellation, dispatch, or maintenance decision is outside this assessment and must go to the authorized team.

#### Possible impacts

- [assumption] Passengers may lack a confirmable revised departure time and need to check official airline updates. Sources: REPORT:U07-OFFICIAL

- [unknown] Whether other flights are affected is unknown; the current bulletin mentions only SIM-271. Sources: REPORT:U07-OFFICIAL

- [assumption] If the delay persists, onward connections or rebooking needs may increase, but this is not confirmed. Sources: REPORT:U07-OFFICIAL

- [unknown] Compensation, rebooking, or transport arrangements are not established by the supplied report. Sources: REPORT:U07-OFFICIAL

- [unknown] Pressure on preceding aircraft, gates, or ground support is not known and would require separate operational verification. Sources: RULE004, REPORT:U07-OFFICIAL

#### operations

SIMULATION / 模拟 — DRAFT / 草案. For operations review: the confirmed current report is that SIM-271 is delayed in this scenario period; no revised departure time or information on other flights, compensation, rebooking, or transport is provided. Prioritized checks: (1) obtain any official revised departure time and record source/time; (2) check whether any other flight is covered by a current report; (3) check preceding aircraft, gate, and ground-support sequence if later tasks concentrate; (4) keep passenger messaging limited to confirmed facts. Do not send or change flight plans from this draft.

Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案. For airport coordination review, request information scoped only to SIM-271 and this scenario period: (1) whether a revised departure time has been issued and its official source/time; (2) aggregate affected-passenger status if officially available, with no personal data; (3) any official gate, stand, or ground-support constraints for this flight; (4) whether any other flight is covered by an official current report. Please reply with official references and timestamps; monthly history is not current status.

Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE011

#### passenger

SIMULATION / 模拟 — DRAFT / 草案. Official information available: flight SIM-271 is delayed in this scenario period. A revised departure time has not been issued in the confirmed bulletin. Information about other flights, compensation, rebooking, or transport is not confirmed. Please check the airline's official channels for updates and any revised departure time. We cannot confirm further details at this time.

Sources: REPORT:U07-OFFICIAL, RULE009, RULE010


### ZH output

Risk: medium; status: needs_review

#### Rationale

- [fact] 唯一具名的模拟通报称，SIM-271 在本情景时段延误；未发布修改后的起飞时间，也未提及其他航班、补偿、改签或交通安排。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] 该报告适用时段为第47模拟日16:55，与17:00情景时段相差5分钟，处于前后30分钟窗口内；未提供其他当前报告。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] 截至2025-12的月度运行记录只是历史背景，不能证明本次延误的原因、持续时间或当前影响范围。 Sources: OPS-XING-2025-12; metrics: OPS-XING-2025-12:completion, OPS-XING-2025-12:release

- [fact] 支持的风险评估为中等：一份经核实的当前报告确认单个航班延误，但未给出修改后时间或更广影响，因此可进行复核和草案准备，但不作运行处置。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] 正式状态和有来源的数字必须列明来源与时间范围；此处正式延误状态来自 U07-OFFICIAL。 Sources: RULE009, REPORT:U07-OFFICIAL; metrics: 

- [fact] 必须标注“模拟”，并只使用汇总信息；所提供当前通报未包含旅客或员工个人信息。 Sources: RULE010, RULE011, REPORT:U07-OFFICIAL; metrics: 

- [unknown] 运行压力规则要求在存在上一时段下降且后续任务集中时核查前序飞机、登机口和地面保障；这些细节尚未提供，只能列为核查项。 Sources: RULE004, REPORT:U07-OFFICIAL; metrics: 

- [assumption] 在没有新增当前报告前，影响范围先按已确认的单个航班理解；这不是对其他航班的结论。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [unknown] 延误原因、修改后起飞时间、其他航班状态、补偿、改签、交通安排以及机场协调状态均未确认。 Sources: REPORT:U07-OFFICIAL; metrics: 

#### Actions

- first [prepare_draft]: 仅供人工复核，准备一份旅客草案，仅写明已确认的 SIM-271 延误以及尚未发布修改后起飞时间；不得发送，也不得暗示其他航班受影响。 Sources: REPORT:U07-OFFICIAL, RULE009, RULE010; rules: RULE009, RULE010

- follow-1 [verify]: 向航空公司运行部门核实 SIM-271 是否已发布修改后起飞时间，并记录来源和时间。 Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

- follow-2 [prepare_information]: 准备仅限 SIM-271 和本情景时段的机场协调询问，索取正式修改时间、汇总旅客影响以及任何登机口或地面保障限制。 Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE011; rules: RULE004, RULE009, RULE011

- follow-3 [monitor]: 监测是否有关于其他航班或影响扩大的新增当前报告；不得把月度历史当作当前证据。 Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

- follow-4 [prepare_draft]: 准备仅供复核的运行检查清单，以便后续任务集中时核查前序飞机、登机口和地面保障顺序。 Sources: RULE004, REPORT:U07-OFFICIAL; rules: RULE004

- follow-5 [prepare_information]: 记录未解决事项：原因、修改后时间、其他航班状态、补偿/改签/交通以及机场协调状态。 Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

#### informationGaps

- 修改后起飞时间及其官方来源/时间。

- 延误原因。

- SIM-271 之外的影响范围。

- 补偿、改签、交通或旅客处置的正式状态。

- 该航班的登机口、机位或地面保障限制。

- U07-OFFICIAL 之后是否有更新的官方信息。

#### assumptionsToVerify

- SIM-271 延误是否仅限当前情景时段，还是会持续到之后。

- 是否会发布正式的修改后起飞时间。

- 是否有其他航班受影响。

- 是否需要补偿、改签、交通或旅客服务安排。

- 前序飞机、登机口和地面保障是否存在压力。

- 机场协调是否已发布当前通报之外的正式更新。

#### escalationConditions

- 如另一份独立当前报告显示多个航班受影响或影响扩大，升级至运营负责人。

- 如发布修改后起飞时间，或延误持续超过当前情景时段，重新复核旅客提示。

- 如来源冲突或来源可靠性变为未知，应停止行动结论并升级。

- 如出现任何安全相关信息，应立即停止行动结论并升级。

#### humanDecisions

- 任何旅客信息发送前须由运营负责人批准。

- 由运营负责人决定是否索取修改后起飞时间，以及是否推进机场协调。

- 由运营负责人决定是否需要复核登机口、地面保障或前序飞机。

- 任何补偿、改签、交通、取消、放行或维修决定均不在本评估范围内，必须提交授权团队。

#### Possible impacts

- [assumption] 旅客可能缺少可确认的修改后起飞时间，需要查看航空公司官方更新。 Sources: REPORT:U07-OFFICIAL

- [unknown] 是否有其他航班受影响未知；当前通报只提到 SIM-271。 Sources: REPORT:U07-OFFICIAL

- [assumption] 若延误持续，后续衔接或改签需求可能增加，但尚未确认。 Sources: REPORT:U07-OFFICIAL

- [unknown] 所提供通报未确认补偿、改签或交通安排。 Sources: REPORT:U07-OFFICIAL

- [unknown] 前序飞机、登机口或地面保障是否承压未知，需要另行运行核查。 Sources: RULE004, REPORT:U07-OFFICIAL

#### operations

SIMULATION / 模拟 — DRAFT / 草案。供运行复核：已确认的当前报告是 SIM-271 在本情景时段延误；未提供修改后起飞时间，也未提及其他航班、补偿、改签或交通安排。优先核查：(1) 获取任何正式修改后起飞时间并记录来源/时间；(2) 检查是否有其他航班被当前报告覆盖；(3) 若后续任务集中，核查前序飞机、登机口和地面保障顺序；(4) 旅客信息仅限已确认事实。不得根据本草案发送信息或更改航班计划。

Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案。供机场协调复核，仅就 SIM-271 和本情景时段询问：(1) 是否已发布修改后起飞时间及其正式来源/时间；(2) 如官方可提供，受影响旅客的汇总状态，不得包含个人信息；(3) 该航班是否有正式登机口、机位或地面保障限制；(4) 是否有其他航班被正式当前报告覆盖。请附正式来源和时间戳回复；月度历史不是当前状态。

Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE011

#### passenger

SIMULATION / 模拟 — DRAFT / 草案。现有官方信息：SIM-271 航班在本情景时段延误。已确认通报中尚未发布修改后起飞时间。其他航班、补偿、改签或交通安排的信息均未确认。请通过航空公司官方渠道查看更新和任何修改后起飞时间。目前无法确认更多细节。

Sources: REPORT:U07-OFFICIAL, RULE009, RULE010


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Assess the situation and prepare a passenger draft limited to confirmed information; no sending, schedule change, compensation, or operational decision is authorized.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
