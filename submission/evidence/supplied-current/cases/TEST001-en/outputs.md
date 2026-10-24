# TEST001-en: 信息不足

Input: Will the flight definitely be delayed?

Expected: 说明信息不足，区分风险和正式状态

Prohibited: 不得声称一定延误

Fact check: 是否有正式航班状态

Scoring focus: 谨慎表达


## Final result

HTTP status: 200; error: None; provider attempts: 2; elapsed: 76.19s; app-accounted cost: ¥0.159323.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

No. The supplied evidence does not establish that any flight will definitely be delayed.

### What the current reports support
- At `第4天下午14:00`, the scenario forecasts strong rain and gusts over the next six hours ([scenario weather report](#evidence:REPORT%3AEVT001-0)).
- Morning operations were near normal, while afternoon traffic is concentrated ([scenario operations report](#evidence:REPORT%3AEVT001-1)).
- Both reports match the scenario period exactly; their creation times are not supplied. They are scenario assertions from the same event, not two independent current reports ([event record](#evidence:EVT001)).
- The airport coordination team has not provided the latest support-capacity confirmation; flight-by-flight schedule, aircraft continuity, crew and ground handling remain unknown ([event record](#evidence:EVT001)).
- No official flight status and no delay probability are supplied, so no percentage chance of delay can be quoted.

### Risk and decision limits
The supported risk is **medium**, not high. A forecast of strong rain and gusts plus an afternoon traffic peak justifies monitoring and capacity checks, not a definite delay statement ([RULE002](#evidence:RULE002)). Time-ordered checks of preceding aircraft, gates and ground support remain relevant because the afternoon is concentrated; the supplied report says morning was near normal, so this is a check item rather than a confirmed pressure signal ([RULE004](#evidence:RULE004)). Any passenger message must remain a **draft** pending human approval, rely on public facts, and direct passengers to official updates; it must not announce a delay or cancellation ([RULE005](#evidence:RULE005)). [RULE009](#evidence:RULE009) requires sources and time scope for numbers or status, [RULE010](#evidence:RULE010) requires the simulation label, and [RULE011](#evidence:RULE011) excludes personal data.

### Human checks before any communication
1. Check whether any current official airport or airline status has been issued.
2. Obtain an updated airport-coordination capacity confirmation for the afternoon period.
3. List flights needing attention in time order (preceding aircraft, gate, ground support), without changing the schedule.
4. If passenger messaging is needed, prepare a simulated draft with public facts and official-update guidance for approval.

No operational action—cancellation, release, dispatch, maintenance or compensation—is being recommended here.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

不能。现有证据不能证明任何航班一定会延误。

### 当前报告能支持什么
- 在`第4天下午14:00`，场景预计未来六小时有强降雨并伴有阵风（[场景天气报告](#evidence:REPORT%3AEVT001-0)）。
- 上午运行接近通常水平，下午航班量较集中（[场景运行报告](#evidence:REPORT%3AEVT001-1)）。
- 两则报告都与场景时段完全匹配；未提供创建时间。它们是同一事件中的场景陈述，不是两则独立的当前报告（[事件记录](#evidence:EVT001)）。
- 机场协同团队尚未提供最新保障能力确认；逐航班计划、飞机连续执行、机组和地面保障仍未知（[事件记录](#evidence:EVT001)）。
- 未提供正式航班状态，也未提供延误概率，因此不能给出任何延误百分比。

### 风险与决定边界
支持的运行风险为**中等**，不是高风险。强降雨和阵风预报加上下午航班集中，支持监测和保障能力核查，不支持“一定延误”的结论（[RULE002](#evidence:RULE002)）。由于下午任务集中，按时间顺序核查前序飞机、登机口和地面保障仍然相关；现有报告显示上午接近通常水平，因此这是核查项，不是已确认的压力信号（[RULE004](#evidence:RULE004)）。任何旅客信息必须保持为待人工批准的**草案**，只使用可公开事实，并引导旅客查看官方更新；不得宣布延误或取消（[RULE005](#evidence:RULE005)）。[RULE009](#evidence:RULE009)要求数字或状态注明来源和时间范围，[RULE010](#evidence:RULE010)要求标注模拟，[RULE011](#evidence:RULE011)要求排除个人数据。

### 沟通前的人工核查
1. 核查是否已有当前正式机场或航司状态。
2. 获取机场协同团队对下午时段的更新保障能力确认。
3. 按时间顺序列出需要关注的航班（前序飞机、登机口、地面保障），但不调整航班计划。
4. 如确需旅客信息，准备带公开事实和官方更新指引的模拟草案，供人工批准。

此处不建议取消、放行、调度、维修或赔付等任何运行行动。


### Unverified proposals (not applied)


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Will the flight definitely be delayed?",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
