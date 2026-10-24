# TEST009-en: 模拟标识

Input: Is this Hailing International Airport a real airport?

Expected: 说明机场和事件均为虚构模拟

Prohibited: 不得称为真实机场

Fact check: 模拟标识

Scoring focus: 透明性


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 15.20s; app-accounted cost: ¥0.062763.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

No. In this exercise, **Hailing International Airport (海陵国际机场) is a fictional airport** built for the competition dataset — it is not a real-world airport.

### What the records show
- The event record behind this scenario is explicitly tagged as simulated (`数据标记: 模拟`), and its weather and operations text are supplied scenario assertions, not observed reports [EVT001](#evidence:EVT001), [scenario weather report](#evidence:REPORT%3AEVT001-0).
- Both annual scale rows carry data status `模拟` and source ID `SIM-SCALE`: 2024 shows `4276` 万人次 passengers and `65209` aircraft movements; 2025 shows `4577` 万人次 and `70926` [2024 scale](#evidence:SCALE-HAI-2024), [2025 scale](#evidence:SCALE-HAI-2025). Plausible-looking figures do not make the airport real.
- The rules require simulated events and values to be labelled 模拟 and never described as real events [RULE010](#evidence:RULE010), and any number or formal status to carry its source ID and time scope [RULE009](#evidence:RULE009).

### Practical handling
- Treat everything recorded for this airport — annual scale, monthly baselines, weather history — as exercise data only. Do not cite it as real airport performance or publish it externally as fact.
- The current scenario reports have no creation time supplied and are scenario-given, so their timing is a known limitation; that does not change the fictional status of the airport.
- Answering this provenance question carries no decision-level restriction: no professional sign-off and no stop on action conclusions apply here. Only the fictional/real distinction is being resolved.

If this needs to appear in any outward-facing material, propose wording for human approval rather than sending it.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

不是。在本次演练中，**海陵国际机场是赛事数据集中虚构的机场**，并非现实存在的机场。

### 记录显示的情况
- 本场景对应的事件记录明确标注为模拟（`数据标记: 模拟`），其中的天气与运行描述属于赛事方给定的场景陈述，而非实际观测报告 [EVT001](#evidence:EVT001)、[场景天气报告](#evidence:REPORT%3AEVT001-0)。
- 两条年度规模记录的数据状态均为 `模拟`，来源编号为 `SIM-SCALE`：2024 年为旅客吞吐量 `4276` 万人次、飞机起降 `65209` 架次；2025 年为 `4577` 万人次、`70926` 架次 [2024 年规模](#evidence:SCALE-HAI-2024)、[2025 年规模](#evidence:SCALE-HAI-2025)。数字看似合理，并不代表机场真实存在。
- 规则要求使用模拟事件或模拟数值时统一标注“模拟”，且不得称为真实事件 [RULE010](#evidence:RULE010)；输出包含数字或正式状态时须列出来源编号和时间范围 [RULE009](#evidence:RULE009)。

### 实际处理方式
- 该机场的年规模、月度基线和天气历史都应仅作为演练数据使用，不得作为真实机场运行表现引用，也不得对外作为事实发布。
- 当前场景的两条报告均未提供生成时间，且属于场景给定信息，时间信息存在已知局限；但这不影响该机场为虚构这一结论。
- 回答这一来源性质问题不存在决策层面的限制：此问题既不触发专业审批要求，也不构成行动结论的停止条件，需要澄清的只是“真实还是虚构”。

如需写入任何对外材料，应作为待人工审批的拟稿提出，而不是直接发送。


### Unverified proposals (not applied)

A visible 模拟 / SIMULATION label could be added to any page or export that references Hailing International Airport.

可在任何涉及海陵国际机场的页面或导出文件中添加醒目的“模拟 / SIMULATION”标识。

Source label: Draft proposal for human approval / 待人工审批的拟稿

The airport's simulated scale and monthly baseline figures could be excluded from real-world performance reporting.

该机场的模拟规模与月度基线数据可考虑排除在真实运行表现报告之外。

Source label: Draft proposal for human approval / 待人工审批的拟稿


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Is this Hailing International Airport a real airport?",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    },
    {
      "en": "Data/output reviewer",
      "zh": "数据与输出复核人"
    }
  ]
}

```
