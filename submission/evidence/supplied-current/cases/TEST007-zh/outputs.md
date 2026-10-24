# TEST007-zh: 新机场

Input: 输入临江机场的新事件

Expected: 根据新输入和基线响应

Prohibited: 不得回放固定答案

Fact check: 是否读取新机场数据

Scoring focus: 泛化能力


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 105.83s; app-accounted cost: ¥0.223769.


### EN output

Risk: medium; status: needs_review

#### Rationale

- [fact] The current scenario report states that simulated stand/apron support is temporarily insufficient for this period and that no formal delay or cancellation has been confirmed. Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] That report is timed at Simulation Day 31, 15:55, five minutes before the 16:00 scenario period, so it falls inside the ±30-minute window and is the only report eligible for this scenario. Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] The report is recorded as human-verified against the scenario log by an evaluator (fictional, not a real operational verification), comes from a single independence group (synthetic-airport-team), and is not flagged as expanding in impact; there is no second independent source. Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] The historical baseline covers 24 monthly rows from 2024-01 to 2025-12 with two flagged anomalous months: 2024-07 at -6.36 percentage points against its prior six-month mean, and 2025-08 at -5.44 percentage points against its prior twelve-month mean. These call for focused historical review, not a current high-risk rating or weather attribution. Sources: OPS-LIN-2024-07, OPS-LIN-2025-08; metrics: OPS-LIN-2024-07:delta, OPS-LIN-2024-07:historical, OPS-LIN-2025-08:delta, OPS-LIN-2025-08:historical

- [fact] The latest available month, 2025-12, shows completed-as-planned at 82.70% and release normality at 86.23%; these are monthly historical figures and say nothing about conditions in the current scenario period. Sources: OPS-LIN-2025-12; metrics: OPS-LIN-2025-12:completion, OPS-LIN-2025-12:release

- [fact] The airport is classed as a small airport with low airline business importance, which supports a contained internal review rather than broad escalation. Sources: SCALE-LIN-2025; metrics: 

- [fact] The 2025-11 weather row carries a missing-data flag, so its populated values cannot be used as weather evidence. Sources: WX-LIN-2025-11; metrics: 

- [unknown] Which flights are affected, how many stands are unavailable, the cause and the expected duration are all unknown; the official flight status remains unconfirmed. Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] The applicable rules require sourcing of every figure, clear simulation labelling, no personal data, and passenger messaging only as a draft that is never sent automatically; no rule currently stops the analysis or requires a professional operational decision. Sources: RULE009, RULE010, RULE011, RULE005; metrics: 

#### Actions

- first [verify]: Check the reported stand shortfall with airport coordination: which stands are unavailable, since when, expected end time, and which flights are affected; record the source and time of each answer. This is a verification step only, not an operational decision. Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE009; rules: RULE009, RULE005

- follow-1 [monitor]: Monitor for a second, independent source or an official status change; a single human-verified simulation report is not enough for escalation. Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE008; rules: RULE008, RULE009

- follow-2 [prepare_draft]: Prepare (not send) an operations checklist draft prioritising stands, turnaround sequencing and ground handling capacity, clearly marked as simulation and draft. Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE010; rules: RULE010, RULE005

- follow-3 [prepare_draft]: Prepare (not send) a passenger information draft that gives only public facts, states uncertainty, and points to official updates; no delay or cancellation wording. Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE005; rules: RULE005, RULE010

- follow-4 [prepare_information]: Compile the two flagged historical months (2024-07, 2025-08) with their baseline windows for a focused review of whether past dips relate to stand capacity; do not treat them as causes. Sources: OPS-LIN-2024-07, OPS-LIN-2025-08; rules: RULE003, RULE009

#### informationGaps

- List of affected flights, aircraft and stand assignments for the scenario period.

- Official flight status confirmation from the responsible operational authority.

- Cause and expected recovery time of the stand shortfall.

- Current-period weather and airport capacity figures; only historical monthly data is supplied.

- Whether the source reports will be updated and by whom, since the only report is a single team simulation.

#### assumptionsToVerify

- The number and location of unavailable stands, and since when they have been unavailable.

- The expected duration of the shortfall and whether it covers the 16:00 period peak.

- Which flights and rotations are actually affected, as reported by the airline's own operations.

- Whether any other factor (weather, runway works, staffing) contributes; current weather conditions are not in the evidence.

#### escalationConditions

- An official flight status change (delay, diversion or cancellation) is confirmed by the responsible authority.

- A second independent source reports the same stand shortfall, or the impact is reported as expanding beyond this airport's apron.

- Source reliability for the incident can no longer be judged, or any safety-related issue appears; then action conclusions stop and the case goes to the operations lead.

#### humanDecisions

- Whether to issue any passenger notice, and its wording, given no confirmed flight status.

- Whether stand reallocation or schedule adjustment is needed; such decisions stay with the responsible operational managers.

- Approval of the prepared operations and passenger drafts before any use.

#### Possible impacts

- [assumption] If the reported stand shortage continues, ground handling and turnaround for some flights could slow, creating knock-on congestion later in the period. This is an assumption to be checked, not a confirmed outcome. Sources: REPORT:PUBLIC-7-zh-CAPACITY

- [fact] No formal delay or cancellation is confirmed, so any passenger-facing wording must stay with official updates rather than announcing disruption. Sources: REPORT:PUBLIC-7-zh-CAPACITY

- [assumption] The report is limited to stand capacity at this airport and carries no expanding-impact flag, so the scope assumed here is local apron pressure only. Sources: REPORT:PUBLIC-7-zh-CAPACITY

- [fact] Past monthly dips (2024-07 and 2025-08) show the airport has had weaker months before, but they neither explain nor predict this event. Sources: OPS-LIN-2024-07, OPS-LIN-2025-08

#### operations

SIMULATION / 模拟 — DRAFT / 草案. For the 16:00 simulated period, an airport coordination report says stand support is temporarily insufficient; no formal delay or cancellation is confirmed. Checks in priority order: 1) confirm which stands are unavailable, since when and until when; 2) confirm which flights and turnarounds are affected using the airline's own records; 3) confirm ground handling and tow/pushback resources for the period; 4) agree a single point of contact with airport coordination and log every update with its time. Do not treat this draft as an operational instruction.

Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE010, RULE005

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案. Request from airport coordination, for the 16:00 simulated period: the list of unavailable stands and their apron zones; the start time and expected recovery time of the shortfall; the cause as officially recorded; the flights and turnarounds the airport considers affected; and the frequency of further updates. Please confirm whether this is limited to stand capacity or also touches other ground services. No operational action is being requested from this draft.

Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE009, RULE010

#### passenger

SIMULATION / 模拟 — DRAFT / 草案. This is a simulated exercise, not a real flight notice. Airport coordination has reported temporary pressure on stand capacity at the airport. No delay or cancellation has been confirmed. Please check the official airline channels and airport displays for the status of your specific flight, and allow extra time at the airport. We will only publish confirmed information.

Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE005, RULE010


### ZH output

Risk: medium; status: needs_review

#### Rationale

- [fact] 当前情景报告称，本次模拟时段停机位保障暂时不足，且尚无正式延误或取消确认。 Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] 该报告时间为模拟第31日15:55，比16:00的情景时段早五分钟，落在前后30分钟窗口内，是本情景唯一符合条件的报告。 Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] 该报告由评测复核人对照情景日志核实（属虚构复核，并非真实运行核实），仅来自一个独立来源组（synthetic-airport-team），且未标记影响扩大；没有第二个独立来源。 Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] 历史基线覆盖2024-01至2025-12共24条月度记录，其中两个月被标记为异常：2024-07相对其此前六个月平均差为-6.36个百分点，2025-08相对其此前十二个月平均差为-5.44个百分点。这需要有针对性的历史复核，而非当前高风险判定或天气归因。 Sources: OPS-LIN-2024-07, OPS-LIN-2025-08; metrics: OPS-LIN-2024-07:delta, OPS-LIN-2024-07:historical, OPS-LIN-2025-08:delta, OPS-LIN-2025-08:historical

- [fact] 最新可用月份2025-12的按计划完成航班比例为82.70%，机场放行正常比例为86.23%；这属于月度历史数据，不能说明当前情景时段的状况。 Sources: OPS-LIN-2025-12; metrics: OPS-LIN-2025-12:completion, OPS-LIN-2025-12:release

- [fact] 该机场为小型机场，航空公司业务重要程度为低，这支持收敛的内部复核而非大范围升级。 Sources: SCALE-LIN-2025; metrics: 

- [fact] 2025-11天气记录带有数据缺失标记，其已填数值不能用作天气证据。 Sources: WX-LIN-2025-11; metrics: 

- [unknown] 受影响航班、不可用停机位数量、原因和预计持续时间均未知；正式航班状态仍未确认。 Sources: REPORT:PUBLIC-7-zh-CAPACITY; metrics: 

- [fact] 适用规则要求所有数字标明来源、统一标注模拟、不得涉及个人信息，旅客信息只能作为草案生成且不得自动发送；目前没有规则要求停止分析或触发专业运行决定。 Sources: RULE009, RULE010, RULE011, RULE005; metrics: 

#### Actions

- first [verify]: 向机场协调核实报告所述停机位不足：哪些机位不可用、从何时起、预计何时恢复、影响哪些航班；记录每个答复的来源和时间。此步骤仅为核实，不构成运行决定。 Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE009; rules: RULE009, RULE005

- follow-1 [monitor]: 监测是否出现第二个独立来源或正式状态变化；仅一份经人工复核的模拟报告不足以升级。 Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE008; rules: RULE008, RULE009

- follow-2 [prepare_draft]: 起草（不发送）运行核查清单草案，优先关注机位、过站排序和地面保障能力，并明确标注模拟与草案。 Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE010; rules: RULE010, RULE005

- follow-3 [prepare_draft]: 起草（不发送）旅客信息草案，仅陈述公开事实、说明不确定性并引导查看官方更新；不得出现延误或取消表述。 Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE005; rules: RULE005, RULE010

- follow-4 [prepare_information]: 整理两个被标记的历史月份（2024-07、2025-08）及其基线窗口，用于复核过往下滑是否与停机位保障相关；不得将其视为原因。 Sources: OPS-LIN-2024-07, OPS-LIN-2025-08; rules: RULE003, RULE009

#### informationGaps

- 情景时段内受影响航班、航空器及停机位分配清单。

- 来自主管运行单位的正式航班状态确认。

- 停机位保障不足的原因和预计恢复时间。

- 当前时段的天气和机场容量数据；目前仅提供历史月度数据。

- 来源报告是否会更新、由谁更新，因为目前唯一报告为单一团队模拟。

#### assumptionsToVerify

- 不可用停机位的数量和位置，以及从何时起不可用。

- 保障不足的预计持续时间，以及是否覆盖16:00时段的运行高峰。

- 实际受影响的具体航班和过站，以航空公司自身运行信息为准。

- 是否有其他因素（天气、跑道施工、人员）叠加；现有证据中没有当前天气实况。

#### escalationConditions

- 主管单位确认正式航班状态变化（延误、备降或取消）。

- 出现第二个独立来源报告同一停机位不足，或报告影响扩大到该机场机坪之外。

- 无法判断事件来源可靠性，或出现任何安全相关问题；此时停止行动结论并移交运营负责人。

#### humanDecisions

- 在无正式航班状态的情况下，是否发布旅客通知及其措辞。

- 是否需要调整机位分配或航班计划；此类决定由相应运行负责人作出。

- 在任何使用前批准已准备的运行与旅客草案。

#### Possible impacts

- [assumption] 若报告所述停机位不足持续，部分航班的地面保障和过站可能变慢，在该时段后段形成连锁拥堵。这是待核查的假设，不是已确认结果。 Sources: REPORT:PUBLIC-7-zh-CAPACITY

- [fact] 尚无正式延误或取消确认，因此面向旅客的表述必须依托官方更新，不得宣布运行中断。 Sources: REPORT:PUBLIC-7-zh-CAPACITY

- [assumption] 报告仅限于该机场的停机位保障，且未标记影响扩大，因此此处假定范围仅为本地机坪压力。 Sources: REPORT:PUBLIC-7-zh-CAPACITY

- [fact] 过去的月度下滑（2024-07和2025-08）说明该机场此前有过较弱月份，但既不能解释也不能预测本次事件。 Sources: OPS-LIN-2024-07, OPS-LIN-2025-08

#### operations

模拟 / SIMULATION — 草案 / DRAFT。就16:00模拟时段，机场协调报告称停机位保障暂时不足；尚无正式延误或取消确认。按优先顺序核查：1）确认哪些机位不可用、从何时起、预计到何时；2）以航空公司自身记录确认受影响航班和过站；3）确认该时段地面保障及推出资源；4）与机场协调确定唯一联络点，并对每次更新记录时间。本草案不得视为运行指令。

Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE010, RULE005

#### airportCoordination

模拟 / SIMULATION — 草案 / DRAFT。请机场协调就16:00模拟时段提供：不可用机位清单及其所在机坪区域；保障不足的起始时间和预计恢复时间；有正式记录的原因；机场认为受影响的航班和过站；以及后续更新频率。请确认该情况是否仅限停机位保障，还是也涉及其他地面服务。本草案不请求任何运行行动。

Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE009, RULE010

#### passenger

模拟 / SIMULATION — 草案 / DRAFT。这是一次模拟演练，不是真实航班通知。机场协调报告称机场停机位保障存在暂时压力。目前没有确认的延误或取消。请通过航空公司官方渠道和机场显示屏查询您所乘航班的具体状态，并为到达机场预留更多时间。我们只发布已确认的信息。

Sources: REPORT:PUBLIC-7-zh-CAPACITY, RULE005, RULE010


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "输入临江机场的新事件",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
