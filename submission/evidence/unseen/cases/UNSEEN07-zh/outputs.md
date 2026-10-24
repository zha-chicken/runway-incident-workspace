# UNSEEN07-zh: Narrow official flight-status scope

Input: 评估情况，并准备仅包含已确认信息的旅客草案。

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

HTTP status: 200; error: None; provider attempts: 1; elapsed: 58.81s; app-accounted cost: ¥0.126186.


### EN output

Risk: medium; status: needs_review

#### Rationale

- [fact] The verified simulated report states that SIM-271 is delayed in the current scenario period and that no new departure time has been issued; it does not cover other flights, compensation, rebooking or connections. Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] The report period 16:55 is within 30 minutes of the scenario period 17:00 and is treated as current; only one independent report group is available. Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] The supported risk is medium because a current verified delay exists, but it is described as limited to one flight group and not expanding; the missing departure-time and downstream details keep it from being low or fully resolved. Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] Monthly history through 2025-12 is baseline context, not evidence of this current delay: the latest row shows completion 85.92% and release normality 90.03%, with a +2.23 pp difference from its prior 12-month mean and peer mean 82.35%. Sources: OPS-XING-2025-12; metrics: OPS-XING-2025-12:completion, OPS-XING-2025-12:release, OPS-XING-2025-12:historical, OPS-XING-2025-12:delta, OPS-XING-2025-12:peers

- [fact] RULE009 requires source IDs and time ranges when formal status or numbers are used, so the drafts cite the report and avoid unsourced figures. Sources: RULE009; metrics: 

- [fact] RULE010 requires simulated events and figures to be labelled as simulation, and RULE011 requires personal data to be excluded; the drafts use only the simulated flight status and no personal data. Sources: RULE010, RULE011; metrics: 

- [fact] RULE004 calls for checking prior aircraft, gates and ground support if delay pressure continues; the operations draft lists those as checks, not as confirmed impacts. Sources: RULE004; metrics: 

- [unknown] No evidence establishes an updated departure time, other affected flights, compensation, rebooking, connections, or airport-wide constraints. Sources: REPORT:U07-OFFICIAL; metrics: 

#### Actions

- first [prepare_draft]: Prepare the passenger draft using only the confirmed delay and the absence of a new departure time; mark it SIMULATION / 模拟 and DRAFT / 草案 and hold it for human review before any use. Sources: REPORT:U07-OFFICIAL, RULE009, RULE010, RULE011; rules: RULE009, RULE010, RULE011

- follow-1 [verify]: Have the operations lead verify with the airline or airport operations desk whether SIM-271 remains delayed and whether any new departure time has been issued; record the source and time. Sources: REPORT:U07-OFFICIAL, RULE009, RULE004; rules: RULE009, RULE004

- follow-2 [prepare_information]: Prepare a scoped airport-coordination request covering SIM-271 stand/gate status, ground handling, any other affected flights, and the next official update time. Sources: REPORT:U07-OFFICIAL, RULE004, RULE009; rules: RULE004, RULE009

- follow-3 [monitor]: Monitor official updates and revise the passenger draft only if an official source changes the confirmed facts. Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

- follow-4 [refer]: Refer to the operations lead if any safety issue, source conflict, expanding impact or unknown source reliability appears. Sources: REPORT:U07-OFFICIAL; rules: RULE004

#### informationGaps

- Current departure time or expected departure window for SIM-271.

- Whether any other flights are affected by the same event.

- Stand, gate and ground-handling status for SIM-271.

- Downstream aircraft rotation and crew implications, if any.

- Whether compensation, rebooking or connection support is covered by an official notice.

- Next official update time and channel.

- Any airport-wide weather, capacity or safety constraint.

- Whether the official status remains delayed at the scenario time.

#### assumptionsToVerify

- Only SIM-271 is affected in the current scenario period.

- No new departure time exists beyond what the verified report states.

- Stand, gate and ground-handling status for SIM-271 is unchanged or will be confirmed separately.

- Compensation, rebooking and connections are not covered by another official notice.

- The next official update time and source can be confirmed with operations or airport coordination.

- No airport-wide operational constraint applies beyond the reported single-flight delay.

#### escalationConditions

- The official status changes to cancelled, diverted or otherwise materially different from delayed.

- Any other flight is confirmed affected or the impact is described as expanding.

- The source becomes conflicting, unverifiable or reliability is recorded as unknown.

- A safety issue or airport-wide operational constraint is reported.

- No official update is available after the current scenario period while the delay continues.

#### humanDecisions

- Approve whether the passenger draft may be used after the official status and any new departure time are verified.

- Approve sending the airport-coordination information request and its scope.

- Decide whether to escalate to the operations lead if any escalation condition occurs.

- Decide whether the passenger draft should be updated if an official update changes the confirmed facts.

#### Possible impacts

- [fact] Passengers on SIM-271 face uncertainty because the verified report gives no new departure time. Sources: REPORT:U07-OFFICIAL

- [unknown] Other flights, compensation, rebooking and connections remain unconfirmed; they should not be described to passengers as available or unavailable. Sources: REPORT:U07-OFFICIAL

- [assumption] If the delay persists, prior aircraft, gate and ground-support checks may be needed; this is a check item, not a confirmed downstream impact. Sources: RULE004

- [fact] Passenger messaging must remain a draft and direct people to official updates because the confirmed facts are limited to the delay and the absence of a new departure time. Sources: REPORT:U07-OFFICIAL, RULE009, RULE010

#### operations

SIMULATION / 模拟 — DRAFT / 草案. Operations note: the verified simulated report says SIM-271 is delayed in the current scenario period and no new departure time has been issued; it does not cover other flights, compensation, rebooking or connections. Prioritized checks: (1) confirm the current official status and any new departure time; (2) list any other flights actually affected rather than assuming; (3) if the delay persists, check prior aircraft, gate and ground-support pressure and the update cadence; (4) hold passenger messaging until the facts above are confirmed. This draft is not authority to cancel, release, dispatch, maintain or compensate.

Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案. To airport coordination: for the limited scope of SIM-271 in the current scenario period, please confirm (a) whether the official status remains delayed, (b) whether a new departure time has been issued, (c) stand, gate and ground-handling status relevant to this flight, (d) whether any other flights are affected by the same event, and (e) the next official update time and channel. The verified simulated report confirms only the delay and no new departure time; it does not confirm other flights, compensation, rebooking or connections. Please cite the source and time for each item.

Sources: REPORT:U07-OFFICIAL, RULE009, RULE004

#### passenger

SIMULATION / 模拟 — DRAFT / 草案. A verified simulated airline notice says flight SIM-271 is delayed for the current scenario period. No new departure time has been published yet. The notice does not cover other flights, compensation, rebooking or connections. Please check official airline and airport channels for the latest status before travelling. This is a draft, not a final passenger notice.

Sources: REPORT:U07-OFFICIAL, RULE009, RULE010


### ZH output

Risk: medium; status: needs_review

#### Rationale

- [fact] 经核实的模拟通报称，SIM-271在本情景时段延误，尚未发布新的起飞时间；通报未涉及其他航班、赔付、改签或接驳安排。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] 报告时段16:55与本情景时段17:00相差在30分钟内，按当前报告处理；目前只有一个独立报告组。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] 支持的风险为中等，因为当前存在经核实的延误，但通报描述限于一个航班组且影响未扩大；缺少新起飞时间和后续细节，因此不能视为低风险或已完全澄清。 Sources: REPORT:U07-OFFICIAL; metrics: 

- [fact] 截至2025-12的月度历史是基线背景，不是本次当前延误的证据：最新一行显示按计划完成航班比例85.92%、机场放行正常比例90.03%，较此前12个月平均差为+2.23个百分点，同类均值为82.35%。 Sources: OPS-XING-2025-12; metrics: OPS-XING-2025-12:completion, OPS-XING-2025-12:release, OPS-XING-2025-12:historical, OPS-XING-2025-12:delta, OPS-XING-2025-12:peers

- [fact] RULE009要求在输出正式状态或数字时列出来源编号和时间范围，因此草案引用该报告并避免无来源数字。 Sources: RULE009; metrics: 

- [fact] RULE010要求模拟事件和数值统一标注为模拟，RULE011要求排除个人信息；草案仅使用模拟航班状态，不含个人信息。 Sources: RULE010, RULE011; metrics: 

- [fact] RULE004要求在延误压力持续时核查前序飞机、登机口和地面保障；运行草案将其列为核查事项，而不是已确认影响。 Sources: RULE004; metrics: 

- [unknown] 没有证据确认新的起飞时间、其他受影响航班、赔付、改签、接驳或机场范围限制。 Sources: REPORT:U07-OFFICIAL; metrics: 

#### Actions

- first [prepare_draft]: 仅使用已确认的延误和尚未发布新起飞时间的信息准备旅客草案；标注SIMULATION / 模拟和DRAFT / 草案，并在任何使用前交由人工审核。 Sources: REPORT:U07-OFFICIAL, RULE009, RULE010, RULE011; rules: RULE009, RULE010, RULE011

- follow-1 [verify]: 请运营负责人向航司或机场运行部门核实SIM-271是否仍延误，以及是否已发布新的起飞时间；记录来源和时间。 Sources: REPORT:U07-OFFICIAL, RULE009, RULE004; rules: RULE009, RULE004

- follow-2 [prepare_information]: 准备一份范围明确的机场协调信息请求，涵盖SIM-271机位/登机口状态、地面保障、是否有其他受影响航班，以及下一次官方更新时间。 Sources: REPORT:U07-OFFICIAL, RULE004, RULE009; rules: RULE004, RULE009

- follow-3 [monitor]: 监测官方更新；仅在官方来源改变已确认事实时修改旅客草案。 Sources: REPORT:U07-OFFICIAL, RULE009; rules: RULE009

- follow-4 [refer]: 如出现安全问题、来源冲突、影响扩大或来源可靠性未知，转交运营负责人。 Sources: REPORT:U07-OFFICIAL; rules: RULE004

#### informationGaps

- SIM-271当前起飞时间或预计起飞窗口。

- 同一事件是否影响其他航班。

- SIM-271的机位、登机口和地面保障状态。

- 后续飞机周转和机组影响（如有）。

- 赔付、改签或接驳支持是否由官方通报涵盖。

- 下一次官方更新时间及渠道。

- 是否存在机场范围天气、容量或安全限制。

- 情景时段官方状态是否仍为延误。

#### assumptionsToVerify

- 当前情景时段仅SIM-271受影响。

- 除经核实通报所述内容外，没有新的起飞时间。

- SIM-271的机位、登机口和地面保障状态未变化，或将通过其他渠道确认。

- 赔付、改签和接驳安排未被其他官方通报涵盖。

- 下一次官方更新时间及来源可通过运行或机场协调确认。

- 除已报告的单航班延误外，没有机场范围的运行限制。

#### escalationConditions

- 官方状态变为取消、备降或其他与延误有实质不同的状态。

- 确认其他航班受影响，或影响被描述为扩大。

- 来源出现冲突、无法核实，或来源可靠性被记录为未知。

- 报告出现安全问题或机场范围运行限制。

- 当前情景时段后延误持续但仍无官方更新。

#### humanDecisions

- 在核实官方状态和任何新起飞时间后，批准旅客草案是否可以使用。

- 批准发送机场协调信息请求及其范围。

- 如出现任何升级条件，决定是否转交运营负责人。

- 如官方更新改变已确认事实，决定是否更新旅客草案。

#### Possible impacts

- [fact] 由于经核实通报未给出新的起飞时间，SIM-271旅客面临不确定性。 Sources: REPORT:U07-OFFICIAL

- [unknown] 其他航班、赔付、改签和接驳仍未确认；不应向旅客描述为已提供或未提供。 Sources: REPORT:U07-OFFICIAL

- [assumption] 如果延误持续，可能需要核查前序飞机、登机口和地面保障；这是核查项，不是已确认的后续影响。 Sources: RULE004

- [fact] 旅客信息必须保持为草案，并引导旅客查看官方更新，因为已确认事实仅限于延误和尚未发布新起飞时间。 Sources: REPORT:U07-OFFICIAL, RULE009, RULE010

#### operations

SIMULATION / 模拟 — DRAFT / 草案。运行提示：经核实的模拟通报称，SIM-271在本情景时段延误，尚未发布新的起飞时间；通报未涉及其他航班、赔付、改签或接驳安排。优先核查：(1) 确认当前官方状态及是否有新起飞时间；(2) 列出实际受影响的其他航班，不要假设；(3) 如延误持续，核查前序飞机、登机口和地面保障压力及更新节奏；(4) 在上述事实确认前暂缓旅客信息。本草案不是取消、放行、调度、维修或赔付的授权。

Sources: REPORT:U07-OFFICIAL, RULE004, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案。致机场协调：就当前情景时段SIM-271的有限范围，请确认：(a) 官方状态是否仍为延误；(b) 是否已发布新的起飞时间；(c) 与该航班相关的机位、登机口和地面保障状态；(d) 同一事件是否影响其他航班；(e) 下一次官方更新时间及渠道。经核实的模拟通报仅确认延误且无新起飞时间，未确认其他航班、赔付、改签或接驳安排。请对每项注明来源和时间。

Sources: REPORT:U07-OFFICIAL, RULE009, RULE004

#### passenger

SIMULATION / 模拟 — DRAFT / 草案。经核实的模拟航司通报称，SIM-271航班在本情景时段延误。目前尚未发布新的起飞时间。该通报未涉及其他航班、赔付、改签或接驳安排。出行前请查看航司和机场官方渠道的最新状态。本信息为草案，不是最终旅客通知。

Sources: REPORT:U07-OFFICIAL, RULE009, RULE010


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Assess the situation and prepare a passenger draft limited to confirmed information; do not execute or recommend operational decisions.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
