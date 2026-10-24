# TEST007-en: 新机场

Input: Enter a new incident at Linjiang Airport.

Expected: 根据新输入和基线响应

Prohibited: 不得回放固定答案

Fact check: 是否读取新机场数据

Scoring focus: 泛化能力


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 128.97s; app-accounted cost: ¥0.250185.


### EN output

Risk: medium; status: needs_review

#### Rationale

- [fact] One applicable current report states that stand support is temporarily insufficient in this simulation, with no official delay or cancellation confirmed. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] The report is a human-verified synthetic airport-team report from one independent group; it is not two independent current reports and is not real operational verification. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] Official flight status is unconfirmed and no official status source is provided. Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] Historical monthly operations contain a deviation beyond the review threshold; this is a focused historical-review signal, separate from the current stand report. Sources: OPS-LIN-2025-08, RULE003; metrics: OPS-LIN-2025-08:delta

- [unknown] Whether the historical monthly deviation relates to the current stand constraint is unknown; causation is not established. Sources: OPS-LIN-2025-08, REPORT:PUBLIC-7-en-CAPACITY; metrics: OPS-LIN-2025-08:delta

- [fact] The 2025-11 monthly weather record is flagged as missing; its populated weather cells cannot be used for attribution. Sources: WX-LIN-2025-11; metrics: 

- [fact] Annual scale records list low airline business importance; this affects prioritization context, not the current capacity assessment. Sources: SCALE-LIN-2025; metrics: 

- [fact] All outputs must be labeled as simulation and draft, and no personal data is needed for this assessment. Sources: RULE010, RULE011; metrics: 

- [unknown] Specific affected flights, stand groups, exact operational duration, and any official status source are unknown and require verification. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE001; metrics: 

#### Actions

- first [verify]: Verify with airport coordination the scope of the stand-support constraint, its applicable period, and whether any official flight status has changed. Sources: REPORT:PUBLIC-7-en-CAPACITY; rules: RULE001, RULE009

- follow-1 [prepare_information]: Prepare a scoped information request listing stand groups, terminal area, time window, and official-status point of contact; do not request or include passenger data. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE011; rules: RULE009, RULE010, RULE011

- follow-2 [monitor]: Monitor official airport and airline updates for any confirmed status change; do not infer delay or cancellation from the stand report alone. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005; rules: RULE005, RULE009

- follow-3 [prepare_draft]: Prepare separate operations, airport coordination, and passenger drafts, all marked simulation and draft, and route them for human review before any use. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE010; rules: RULE005, RULE010

#### informationGaps

- Affected flights and operators.

- Constrained stand groups or terminal areas and applicable duration.

- Official status source and update time.

- Whether the stand constraint is stable, improving, or expanding.

- A second independent current report, if available.

- Any safety-related stand issue; none is reported in the current report but it must be verified.

#### assumptionsToVerify

- The stand constraint is temporary and limited to specific stand groups or terminal areas.

- No official flight status change has been published for the affected period.

- The report applies to the current simulated period and no second independent current report exists.

- The historical monthly deviation is unrelated to the current stand event until reviewed.

#### escalationConditions

- An official delay, cancellation, or other formal flight status is confirmed.

- The stand constraint expands, persists beyond the stated review period, or affects a broader terminal scope.

- A second independent reliable current report confirms the constraint.

- Official status sources conflict or a safety-related stand issue is reported.

#### humanDecisions

- Operations lead decides whether any operational response or escalation is needed after verification.

- Airport coordination confirms the stand constraint scope and update point.

- Passenger service lead approves any public-facing wording before use.

- No cancellation, release, dispatch, maintenance, compensation, or message sending is executed from this draft.

#### Possible impacts

- [assumption] If the stand-support constraint persists, turnaround sequencing may require additional coordination; this is a contingency, not a confirmed flight outcome. Sources: REPORT:PUBLIC-7-en-CAPACITY

- [fact] Because official status is unconfirmed, passenger messaging must stay public-facing and point to official updates. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005

- [unknown] The affected flight list, terminal scope, and duration are not in the report. Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE001

- [assumption] Low annual business importance may influence prioritization, but it does not substitute for current capacity verification. Sources: SCALE-LIN-2025

- [fact] Missing 2025-11 weather data prevents weather-based attribution for that month. Sources: WX-LIN-2025-11

#### operations

SIMULATION / 模拟 — DRAFT / 草案. Prioritized checks: 1) Confirm the stand-support constraint scope and expected review time with airport coordination. 2) Verify whether any flight has an official status change; if none is confirmed, do not state delay or cancellation. 3) Identify affected stand groups and turnarounds only from coordination information. 4) Keep all passenger and public messages limited to verified facts and label them draft.

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案. Information request to airport coordination: please confirm (a) which stand groups or terminal areas are constrained; (b) the applicable period and expected review time; (c) whether any airline has published official flight status; (d) the scope of flights affected, without passenger details; (e) the coordination point for updates. We will not treat this as confirmation of delay or cancellation.

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009, RULE010, RULE011

#### passenger

SIMULATION / 模拟 — DRAFT / 草案. Public information: A simulation report notes temporary stand-support constraints at Linjiang Airport. No official delay or cancellation is confirmed. Specific flight impacts are unknown. Please check official airline or airport updates for your flight; this draft is not a final notice.

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE010


### ZH output

Risk: medium; status: needs_review

#### Rationale

- [fact] 一份适用的当前报告指出，本模拟中机位保障暂时不足，未确认任何正式延误或取消。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 该报告是来自一个独立组的经人工核验的模拟机场团队报告；它不是两份独立的当前报告，也不是真实运行核验。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 正式航班状态未确认，也未提供正式状态来源。 Sources: REPORT:PUBLIC-7-en-CAPACITY; metrics: 

- [fact] 历史月度运行数据中存在超过复核阈值的偏差；这是需要重点进行历史复核的信号，与当前机位报告分开处理。 Sources: OPS-LIN-2025-08, RULE003; metrics: OPS-LIN-2025-08:delta

- [unknown] 历史月度偏差是否与当前机位限制有关尚不清楚；因果关系未确立。 Sources: OPS-LIN-2025-08, REPORT:PUBLIC-7-en-CAPACITY; metrics: OPS-LIN-2025-08:delta

- [fact] 2025-11 月度天气记录被标记为缺失；其已填写的天气单元格不能用于归因。 Sources: WX-LIN-2025-11; metrics: 

- [fact] 年度规模记录显示航空公司业务重要程度为低；这影响优先级背景，但不改变当前容量评估。 Sources: SCALE-LIN-2025; metrics: 

- [fact] 所有输出必须标注为模拟和草案，本次评估不需要个人数据。 Sources: RULE010, RULE011; metrics: 

- [unknown] 具体受影响航班、机位组、确切运行持续时间和任何正式状态来源均未知，需要核查。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE001; metrics: 

#### Actions

- first [verify]: 向机场协调核实机位保障限制的范围、适用时段以及是否有任何正式航班状态变更。 Sources: REPORT:PUBLIC-7-en-CAPACITY; rules: RULE001, RULE009

- follow-1 [prepare_information]: 准备一份范围明确的信息请求，列明机位组、航站楼区域、时间窗口和正式状态联络点；不要索取或包含旅客数据。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE011; rules: RULE009, RULE010, RULE011

- follow-2 [monitor]: 监测机场和航空公司的正式更新，以发现任何已确认的状态变更；不要仅凭机位报告推断延误或取消。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005; rules: RULE005, RULE009

- follow-3 [prepare_draft]: 分别准备运行、机场协调和旅客草案，均标注模拟和草案，并在任何使用前提交人工审核。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE010; rules: RULE005, RULE010

#### informationGaps

- 受影响航班及运营人。

- 受限机位组或航站楼区域及适用持续时间。

- 正式状态来源和更新时间。

- 机位限制是稳定、改善还是扩大。

- 是否有第二份独立当前报告。

- 是否存在与机位有关的安全问题；当前报告未报告，但必须核实。

#### assumptionsToVerify

- 机位限制是暂时的，并限于特定机位组或航站楼区域。

- 受影响时段尚未发布任何正式航班状态变更。

- 该报告适用于当前模拟时段，且不存在第二份独立当前报告。

- 在复核前，历史月度偏差与当前机位事件无关。

#### escalationConditions

- 确认出现正式延误、取消或其他正式航班状态。

- 机位限制扩大、超出所述复核时段持续存在，或影响更大航站楼范围。

- 第二份独立可靠的当前报告确认该限制。

- 正式状态来源冲突，或报告与机位有关的安全问题。

#### humanDecisions

- 运营负责人在核查后决定是否需要任何运行响应或升级。

- 机场协调确认机位限制范围和更新联络点。

- 旅客服务负责人在使用前批准任何面向公众的措辞。

- 本草案不执行任何取消、放行、调度、维修、赔付或消息发送。

#### Possible impacts

- [assumption] 如果机位保障限制持续，周转排序可能需要额外协调；这是应急预案，不是已确认的航班结果。 Sources: REPORT:PUBLIC-7-en-CAPACITY

- [fact] 由于正式状态未确认，旅客信息必须保持面向公众并引导查看正式更新。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005

- [unknown] 报告中未包含受影响航班清单、航站楼范围和持续时间。 Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE001

- [assumption] 年度业务重要程度低可能影响优先级，但不能替代当前容量核查。 Sources: SCALE-LIN-2025

- [fact] 2025-11 天气数据缺失，无法为该月进行基于天气的归因。 Sources: WX-LIN-2025-11

#### operations

SIMULATION / 模拟 — DRAFT / 草案。优先核查：1）向机场协调确认机位保障限制范围和预计复核时间。2）核实是否有航班出现正式状态变更；若未确认，不得表述为延误或取消。3）仅依据协调信息识别受影响机位组和周转情况。4）所有旅客和公众信息仅限于已核实事实，并标注为草案。

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案。致机场协调的信息请求：请确认（a）哪些机位组或航站楼区域受限；（b）适用时段和预计复核时间；（c）是否有航空公司发布正式航班状态；（d）受影响航班范围，不含旅客详细信息；（e）更新联络点。我们不会将此视为延误或取消的确认。

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE009, RULE010, RULE011

#### passenger

SIMULATION / 模拟 — DRAFT / 草案。公众信息：一份模拟报告提到临江机场存在暂时性机位保障限制。未确认任何正式延误或取消。具体航班影响未知。请查看航空公司或机场的正式更新以了解您的航班；本草案不是最终通知。

Sources: REPORT:PUBLIC-7-en-CAPACITY, RULE005, RULE010


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "New incident at Linjiang Airport: verify stand-support constraint and official status; no operational execution.",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
