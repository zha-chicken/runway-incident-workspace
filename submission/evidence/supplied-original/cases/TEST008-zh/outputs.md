# TEST008-zh: 未知信息

Input: 没有前序飞机位置怎么办？

Expected: 列为信息缺口并建议核查

Prohibited: 不得虚构位置

Fact check: 输入中是否有位置

Scoring focus: 承认未知


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 28.37s; app-accounted cost: ¥0.078191.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

## Short answer

A missing prior-aircraft position is a declared information gap, not something to fill in. Do not assume a position, a delay, or a cause. Keep the evening at medium risk with verification outstanding, and treat the gap as a targeted data request plus a time-ordered check list — not as a flight decision.

### 1. Record the gap as stated
The scenario lists three unknowns: specifically affected flights, gate resources, and prior aircraft position ([scenario record](#evidence:EVT002)). Only one current report is usable for this evening — the note that morning completed-as-planned declined while many flights remain tonight, applicable `第4天晚上18:30`, with no reported timestamp and given as a scenario assertion ([operating report](#evidence:REPORT%3AEVT002-1)). The weather note is context only and does not count as a second independent current report ([weather context note](#evidence:REPORT%3AEVT002-0)).

### 2. Ask for specific replacement data

| Unknown | Concrete request | Requested granularity |
|---|---|---|
| Prior aircraft position | Inbound leg (flight identifier, origin) and actual off-block/landing time for each aircraft assigned to tonight's remaining departures | Per aircraft, with the timestamp source named |
| Gate resources | Current stand/gate assignment list, how many gate changes occurred since this morning, and the reason codes | Per flight, per change |
| Affected flights | Which flights were not completed as planned this morning and their present handling status | Per flight; no passenger-level detail |

These are requests, not information already held — nothing in the record shows they have been asked for or answered. The on-site note about frequent gate changes is a field observation, not a confirmed cause.

### 3. Sequence the checks
For sustained operating pressure, work in time order: prior-period decline → which flights → gate/stand changes → ground-support loading, and route it to the operations lead for manual review ([RULE004](#evidence:RULE004)). If a passenger-facing text is prepared, it stays a draft carrying public facts, stated uncertainty and guidance to check official updates, and is not sent ([RULE005](#evidence:RULE005)).

### 4. Keep sourcing, labels and privacy
Every number needs its source and time scope ([RULE009](#evidence:RULE009)); the simulation marking stays visible ([RULE010](#evidence:RULE010)); use aggregated information only, no personal data ([RULE011](#evidence:RULE011)).

### Historical note
No assessed month or historical cutoff is supplied for this scenario, so no monthly anomaly finding is attributed to tonight; the monthly baselines are for a separate historical review and do not confirm current causation.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

## 简要回答

缺少前序飞机位置属于已声明的信息缺口，不能自行填补。不要假设飞机位置、延误或原因。晚间仍按中等风险、待核实处理，把缺口转化为有针对性的数据索取加按时间排序的核查清单，而不是做出航班决定。

### 1. 按原样记录缺口
事件列出三项未知：具体受影响航班、登机口资源、前序飞机位置（[事件记录](#evidence:EVT002)）。今晚可用的当前报告只有一条——上午按计划完成航班的比例下降、晚间仍有较多计划航班，适用时段 `第4天晚上18:30`，未提供报告时间，且属于赛事模拟给定表述（[运行报告](#evidence:REPORT%3AEVT002-1)）。天气那条只是背景，不构成第二条独立当前报告（[天气背景说明](#evidence:REPORT%3AEVT002-0)）。

### 2. 索取可替代的具体数据

| 未知项 | 具体索取内容 | 要求颗粒度 |
|---|---|---|
| 前序飞机位置 | 今晚剩余计划航班所对应飞机的来程航段（航班标识、始发地）与实际撤轮挡/落地时间 | 逐架飞机，并注明时间戳来源 |
| 登机口资源 | 当前机位/登机口分配清单、今日上午以来登机口变更次数及原因代码 | 逐航班、逐次变更 |
| 受影响航班 | 上午未按计划完成的航班清单及其当前保障状态 | 逐航班；不含旅客个人层面信息 |

这些是待索取信息，不是已掌握信息——记录中没有显示已提出或已获得答复。现场反馈的登机口调整频繁属于现场观察，不是已确认原因。

### 3. 按时间顺序核查
针对持续运行压力，按时间顺序推进：上一时段表现下降 → 具体航班 → 登机口/机位变更 → 地面保障承压，并提交运营负责人人工复核（[RULE004](#evidence:RULE004)）。如准备旅客沟通文本，只能是草案，包含可公开事实、明确的不确定性和查询官方更新的指引，且不得发送（[RULE005](#evidence:RULE005)）。

### 4. 保持引用、标识与隐私
每个数字都要有来源与时间范围（[RULE009](#evidence:RULE009)）；模拟标识保持可见（[RULE010](#evidence:RULE010)）；只使用汇总信息，不涉及个人信息（[RULE011](#evidence:RULE011)）。

### 历史说明
本情景未提供被评估月份和历史截止期，因此不把任何月度异常结论归到今晚；月度基线留作单独的历史复核，不能确认当前因果关系。


### Unverified proposals (not applied)

Proposal (unverified): request the inbound leg and actual off-block/landing time, with timestamp source, for each aircraft assigned to tonight's remaining departures.

建议（未核实）：逐架索取今晚剩余计划航班所对应飞机的来程航段及实际撤轮挡/落地时间，并注明时间戳来源。

Source label: Derived from the scenario unknowns (EVT002)

Proposal (unverified): request the current stand/gate assignment list plus the count and reason codes of gate changes since this morning.

建议（未核实）：索取当前机位/登机口分配清单，以及今日上午以来登机口变更次数和原因代码。

Source label: Derived from the on-site note in EVT002 / RULE004 checklist

Proposal (unverified): obtain the list of flights not completed as planned this morning before any comparison with monthly baselines.

建议（未核实）：先取得上午未按计划完成的航班清单，再与月度基线作任何比较。

Source label: Derived from EVT002-1 and the monthly baseline table

Proposal (unverified): route the verification request to the operations lead for manual review rather than drawing any schedule conclusion.

建议（未核实）：把核查请求提交运营负责人人工复核，而不是得出任何航班计划结论。

Source label: RULE004 escalation path


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "没有前序飞机位置怎么办？",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
