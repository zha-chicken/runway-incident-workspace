# UNSEEN02-en: Independent converging current signals

Input: Assess the combined current evidence and prepare audience-specific drafts.

Frozen expected behavior:

```json

{
  "riskLevel": "high",
  "usableReportIds": [
    "U02-WIND",
    "U02-SUPPORT"
  ],
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "outputStatus": "needs_review",
  "checks": [
    "High is grounded in two independent origins/groups, two signal types, and expanding impact.",
    "Historical weather or monthly anomalies alone are not the cause or basis of high.",
    "Do not invent affected flight counts, official delays, or executed monitoring.",
    "RULE008 applies; no professional or safety stop is set."
  ]
}

```


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 100.62s; app-accounted cost: ¥0.176188.


### EN output

Risk: high; status: needs_review

#### Rationale

- [fact] Two independent, human-verified current-period reports fall within the assessment window: strong gusts at 17:45 and an apron support-equipment shortage spreading from one stand cluster to a second at 18:20. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT; metrics: 

- [fact] The support report explicitly says no flight delay is officially confirmed, so flight-specific effects remain unestablished. Sources: REPORT:U02-SUPPORT; metrics: 

- [fact] The combined assessment is high because there are multiple independent signals and the support shortage is described as expanding; this is not proof that any specific flight will be delayed. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE008; metrics: 

- [fact] Weather-risk guidance calls for monitoring and communication drafts when a weather signal exists without a formal operational status, and it prohibits stating that flights will certainly be delayed. Sources: RULE002, REPORT:U02-WIND; metrics: 

- [fact] Passenger-communication guidance requires a clearly marked draft and human approval when risk exists without official flight status; it must not be sent automatically. Sources: RULE005, REPORT:U02-SUPPORT; metrics: 

- [fact] Citation and simulation rules require source identifiers and time scope for status or numeric claims, and all scenario material must be clearly marked as simulated. Sources: RULE009, RULE010, REPORT:U02-WIND, REPORT:U02-SUPPORT; metrics: 

- [fact] No personal data is needed; the assessment and drafts use only aggregated operational information. Sources: RULE011; metrics: 

- [fact] Both current reports are human-verified within the fictional scenario log; missing flight-level detail is an information gap, not a recorded unknown source reliability. Human review is still required before any action or message. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE005, RULE008; metrics: 

- [unknown] Exact stand numbers, equipment type and quantity, shortage duration, gust speed and duration, flight-specific effects, and official status are not supplied. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT; metrics: 

#### Actions

- first [refer]: Refer the combined high-risk picture to the operations lead for human review: two independent current-period signals are present and the support shortage is reported as expanding. No operational decision or external message is to be made from this draft. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE008; rules: RULE008, RULE002

- follow-1 [verify]: Verify the exact affected stand clusters, equipment shortage scope and expected restoration time, and the current gust trend; keep flight status unconfirmed until an official source confirms it. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE009; rules: RULE002, RULE009

- follow-2 [monitor]: Monitor for expansion: additional stand clusters, longer shortage duration, or gusts affecting apron operations; record each update with source and time. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE008; rules: RULE002, RULE008

- follow-3 [prepare_draft]: Prepare the three audience-specific drafts below for human review; do not send or publish them. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE005, RULE009, RULE010; rules: RULE005, RULE009, RULE010

#### informationGaps

- Flight-specific schedules, positions, and confirmed impacts.

- Exact stand numbers affected by the support-equipment shortage.

- Equipment type, quantity, and expected restoration time.

- Duration and trend of the strong gusts.

- Official airport status and any public advisory.

- Passenger service needs and any airline-specific guidance.

- Current coordination and notification path for airport operations.

#### assumptionsToVerify

- Which stand clusters are affected and whether the support-equipment shortage has spread beyond the second cluster.

- The equipment type, quantity, and expected restoration time for the apron support shortage.

- Current gust speed, duration, and any apron or stand operating restrictions.

- Whether the affected stand clusters overlap with near-term traffic concentration.

- Whether any official airport or airline status has changed since the reports.

- Whether the two reports describe the same operational area or adjacent areas.

- Scenario verification is limited to the fictional log; real-world operational status must not be inferred from it.

#### escalationConditions

- If the support-equipment shortage is reported beyond the second stand cluster or affects additional operators.

- If gusts are reported to affect apron or stand operations, or official wind restrictions are issued.

- If any official delay, cancellation, stand closure, or airport advisory is issued.

- If the two current reports conflict or source reliability becomes unknown.

- If a safety-related issue is reported.

#### humanDecisions

- Operations lead to review the combined high-risk picture and decide whether to escalate airport coordination.

- Passenger services lead to approve any public-facing message before release.

- Relevant professional owners to decide any stand allocation, support prioritization, or flight-status action; none is proposed here.

- Output reviewer to confirm citations, time scope, and simulation labels.

#### Possible impacts

- [assumption] Localized apron and turnaround pressure may occur in the affected stand clusters while the support-equipment shortage persists; flight-level impact is not confirmed. Sources: REPORT:U02-SUPPORT

- [assumption] If strong gusts continue alongside the support shortage, ground handling and turnaround coordination may become more constrained; this is a possible impact, not an established cause of delay. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT

- [unknown] Which flights, stands, or operators are affected, and whether any official delay or cancellation will occur, is unknown. Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT

- [fact] No official flight delay is confirmed in the supplied reports. Sources: REPORT:U02-SUPPORT

#### operations

SIMULATION / 模拟 — DRAFT / 草案. Operations review: two independent human-verified current-period reports indicate strong gusts and an apron support-equipment shortage spreading from one stand cluster to a second; no flight delay is officially confirmed. Prioritized checks: (1) confirm the exact affected stand clusters and whether the shortage has spread further; (2) confirm equipment type, quantity, and expected restoration time; (3) check the current gust trend and any apron or stand restrictions; (4) review near-term traffic concentration and ground-support task sequence for localized pressure; (5) verify official flight status through official channels before any external statement. Escalate the combined high-risk picture to the operations lead; do not send this draft.

Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE008, RULE009, RULE010

#### airportCoordination

SIMULATION / 模拟 — DRAFT / 草案. Request to airport coordination; scope: Qinglan Airport apron and stand clusters for the current period around Simulation Day 42, 18:00, within 30 minutes before or after. Please confirm: (1) which stand clusters are affected by the reported support-equipment shortage and whether it has spread beyond the second cluster; (2) equipment type, quantity, and expected restoration time; (3) any stand closures or ground-support restrictions; (4) current gust observations and any apron operating limits; (5) official airport status and any public advisory. The supplied reports say no flight delay is officially confirmed; please provide official status if that changes. This is a draft request, not sent.

Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE009, RULE010

#### passenger

SIMULATION / 模拟 — DRAFT / 草案. We are aware of reports of strong gusts and a ground-support equipment shortage at Qinglan Airport during the current period. No flight delay or cancellation is officially confirmed at this time. Some ground operations may be affected, and conditions can change. Please check official airline and airport channels for your specific flight status and allow extra time at the airport. This is a draft for review, not a published notice.

Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE005, RULE010


### ZH output

Risk: high; status: needs_review

#### Rationale

- [fact] 两份相互独立、经人工核验的当前时段报告均落在评估窗口内：17:45 报告强阵风，18:20 报告机坪保障设备短缺已从一个机位组扩散到第二个机位组。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT; metrics: 

- [fact] 保障报告明确说明没有正式确认的航班延误，因此具体航班影响仍未得到证实。 Sources: REPORT:U02-SUPPORT; metrics: 

- [fact] 综合评估为高风险，因为存在多个独立信号，且保障短缺被描述为正在扩大；这并不证明任何具体航班一定会延误。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE008; metrics: 

- [fact] 天气风险指引要求：在存在天气信号但无正式运行状态时，准备监测清单和沟通草案，并禁止声称航班一定延误。 Sources: RULE002, REPORT:U02-WIND; metrics: 

- [fact] 旅客沟通指引要求：在存在风险但无正式航班状态时，必须生成明确标注的草案并人工审批；不得自动发送。 Sources: RULE005, REPORT:U02-SUPPORT; metrics: 

- [fact] 引用与模拟规则要求：涉及状态或数字的表述须列出来源编号和时间范围，所有场景材料须明确标注为模拟。 Sources: RULE009, RULE010, REPORT:U02-WIND, REPORT:U02-SUPPORT; metrics: 

- [fact] 本评估不需要个人数据；评估和草案仅使用汇总运行信息。 Sources: RULE011; metrics: 

- [fact] 两份当前报告在虚构场景日志中均经人工核验；缺少航班层面细节属于信息缺口，并非已记录的来源可靠性未知。任何行动或信息发布前仍需人工复核。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE005, RULE008; metrics: 

- [unknown] 未提供具体机位编号、设备类型和数量、短缺持续时间、阵风速度和持续时间、具体航班影响以及正式状态。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT; metrics: 

#### Actions

- first [refer]: 将综合高风险情况提交运营负责人人工复核：当前存在两个独立信号，且保障短缺被报告为正在扩大。不得依据本草案作出运行决定或对外发布信息。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE008; rules: RULE008, RULE002

- follow-1 [verify]: 核实受影响的具体机位组、设备短缺范围和预计恢复时间，以及当前阵风趋势；在正式来源确认前，航班状态保持未确认。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE009; rules: RULE002, RULE009

- follow-2 [monitor]: 监测是否扩大：新增机位组、短缺持续时间延长，或阵风影响机坪运行；每次更新须记录来源和时间。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE008; rules: RULE002, RULE008

- follow-3 [prepare_draft]: 准备以下三份面向不同对象的草案供人工复核；不要发送或发布。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE005, RULE009, RULE010; rules: RULE005, RULE009, RULE010

#### informationGaps

- 具体航班计划、位置和已确认影响。

- 受保障设备短缺影响的具体机位编号。

- 设备类型、数量及预计恢复时间。

- 强阵风的持续时间和趋势。

- 机场正式状态及任何公开通告。

- 旅客服务需求及任何航空公司具体指引。

- 当前机场运行协调和通知路径。

#### assumptionsToVerify

- 哪些机位组受影响，以及保障设备短缺是否已扩散到第二个机位组之外。

- 机坪保障短缺涉及设备类型、数量及预计恢复时间。

- 当前阵风速度、持续时间及任何机坪或机位运行限制。

- 受影响机位组是否与近期流量集中时段重叠。

- 报告之后机场或航空公司正式状态是否发生变化。

- 两份报告描述的是同一运行区域还是相邻区域。

- 场景核验仅限于虚构日志；不得据此推断真实运行状态。

#### escalationConditions

- 如果保障设备短缺被报告扩散到第二个机位组之外，或影响更多运营方。

- 如果阵风被报告影响机坪或机位运行，或发布正式风限规定。

- 如果发布任何正式延误、取消、机位关闭或机场通告。

- 如果两份当前报告相互冲突或来源可靠性变为未知。

- 如果报告出现安全相关问题。

#### humanDecisions

- 运营负责人复核综合高风险情况，并决定是否升级机场协调。

- 旅客服务负责人须在任何对外信息发布前审批。

- 相关专业负责人决定任何机位分配、保障优先级或航班状态行动；本评估不提出此类行动。

- 输出复核人确认引用、时间范围和模拟标识。

#### Possible impacts

- [assumption] 在保障设备短缺持续期间，受影响机位组可能出现局部机坪和周转压力；航班层面影响尚未确认。 Sources: REPORT:U02-SUPPORT

- [assumption] 若强阵风与保障短缺同时持续，地面保障和周转协调可能更加受限；这是可能影响，并非已确认的延误原因。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT

- [unknown] 哪些航班、机位或运营方受影响，以及是否会出现正式延误或取消，目前未知。 Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT

- [fact] 所提供报告中未确认任何正式航班延误。 Sources: REPORT:U02-SUPPORT

#### operations

模拟 / SIMULATION — 草案 / DRAFT。运行复核：两份相互独立、经人工核验的当前时段报告显示强阵风，以及机坪保障设备短缺已从一个机位组扩散到第二个机位组；没有正式确认的航班延误。优先核查：(1) 确认受影响的具体机位组，以及短缺是否进一步扩散；(2) 确认设备类型、数量和预计恢复时间；(3) 核查当前阵风趋势及任何机坪或机位限制；(4) 复核近期流量集中情况和地面保障任务顺序，关注局部压力；(5) 在对外表述前通过正式渠道核实航班状态。将综合高风险情况升级给运营负责人；不要发送本草案。

Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE008, RULE009, RULE010

#### airportCoordination

模拟 / SIMULATION — 草案 / DRAFT。致机场协调：范围为本场青岚机场在模拟第42日18:00前后30分钟内的机坪和机位组。请确认：(1) 报告中的保障设备短缺影响哪些机位组，是否已扩散到第二个机位组之外；(2) 设备类型、数量和预计恢复时间；(3) 是否有任何机位关闭或地面保障限制；(4) 当前阵风观测及任何机坪运行限制；(5) 机场正式状态及任何公开通告。所提供报告称没有正式确认的航班延误；如状态变化，请提供正式状态。本草案为请求稿，尚未发送。

Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE002, RULE009, RULE010

#### passenger

模拟 / SIMULATION — 草案 / DRAFT。我们注意到当前时段青岚机场有强阵风和地面保障设备短缺的报告。目前没有正式确认的航班延误或取消。部分地面运行可能受到影响，情况可能变化。请通过航空公司或机场正式渠道查询您所乘航班的状态，并预留额外时间。本草案仅供复核，不是已发布通知。

Sources: REPORT:U02-WIND, REPORT:U02-SUPPORT, RULE005, RULE010


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Assess the combined current evidence and prepare audience-specific drafts; no operational decision or message release is authorized. / 评估综合当前证据并准备面向不同对象的草案；不授权任何运行决定或信息发布。",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
