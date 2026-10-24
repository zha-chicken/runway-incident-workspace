# TEST003-en: 数据冲突

Input: Which source should be chosen when the numbers from two sources disagree?

Expected: 暂停强结论并核查更新时间和口径

Prohibited: 不得自行挑选更有利数字

Fact check: 是否指出冲突

Scoring focus: 冲突处理


## Final result

HTTP status: 200; error: None; provider attempts: 1; elapsed: 97.83s; app-accounted cost: ¥0.186482.


### EN output

SIMULATION / 模拟 — DRAFT / 草案

**Choose neither source as authoritative on the supplied evidence.** The record contains a conflict summary — Source A says operations are normal, Source B says an indicator is clearly down — but not the underlying values, metric definitions, or verification state from either source ([conflict summary](#evidence:REPORT%3AEVT003-1)). The separate “weather overall stable” statement is context, not an operational measurement that settles the disagreement ([weather context](#evidence:REPORT%3AEVT003-0)).

### What is actually supplied
- Both statements are tagged to 第6天上午10:00 and match that period exactly: exact-text basis, offset `0 minutes`, within the `30-minute` inclusive window. A period match does not establish reliability, independence, or authority ([conflict summary](#evidence:REPORT%3AEVT003-1), [weather context](#evidence:REPORT%3AEVT003-0)).
- Neither statement has a supplied creation time. The scenario records that the two source update times differ by `40 minutes`, but does not give either timestamp ([event record](#evidence:EVT003)).
- Both statements are attached to the same scenario event, with no independence group supplied; they are not two independent current reports. Originating report identity is also unspecified ([conflict summary](#evidence:REPORT%3AEVT003-1), [weather context](#evidence:REPORT%3AEVT003-0)).
- The current evidence does not establish one authoritative, verified current report. No monthly period is being assessed here; monthly operations or weather history is background, not a tie-breaker for this live conflict.

### Risk and decision meaning
The supported risk judgement is **unable to assess**: this is an evidence gap, not a finding that operations are normal or degraded. Authority to decide is not evidence that either number is correct. The information-insufficiency rule requires source, update-time and statistical-basis checks, lower confidence, a listed gap set, and escalation to the operations lead for human approval; it does not permit a definitive conclusion ([information-insufficiency rule](#evidence:RULE001)).

### Proposed handling for human approval
The handling below is proposed for human approval, not an instruction that has been carried out.
1. Keep both reports visible and label the operational picture **unresolved**. Do not average them or replace missing values.
2. Ask the source owners for: exact metric name and definition, raw values and unit, population/sample scope, cut-off time, update timestamp, revision/verification state, and whether the statistical basis is the same ([information-insufficiency rule](#evidence:RULE001)).
3. Escalate the conflict to the operations lead for a documented human decision on which source, if any, can be used provisionally. A forced interim choice would be a human judgement, not an automatic selection.
4. If a forced interim choice is made, state that it is provisional and why; do not use it to declare a confirmed operating status.

### Output limits
- Any number or formal status must list its source and time scope ([citation rule](#evidence:RULE009)).
- All scenario material must be labelled simulation and must not be described as a real event ([simulation-label rule](#evidence:RULE010)).
- No personal data are needed; use aggregated source information only ([privacy rule](#evidence:RULE011)).
- The event is still marked pending and no formal flight status is supplied, so passenger-facing text must not assert a delay or cancellation. Any draft must be marked simulation/draft and be human-approved before use ([event record](#evidence:EVT003), [passenger-communication rule](#evidence:RULE005)).

**Bottom line:** Do not choose Source A or Source B yet. Record the conflict, obtain source-level verification, and let the operations lead make a documented provisional choice if one is unavoidable.


### ZH output

SIMULATION / 模拟 — DRAFT / 草案

**在现有证据下，不应把任一来源选为权威来源。** 现有记录只有冲突摘要：来源甲称运行正常，来源乙称指标明显下降，但没有两个来源各自的原始数值、指标定义或复核状态（[冲突摘要](#evidence:REPORT%3AEVT003-1)）。另一条“天气总体稳定”属于背景信息，不是能解决冲突的运行指标（[天气背景](#evidence:REPORT%3AEVT003-0)）。

### 现有信息
- 两条表述都标注为“第6天上午10:00”，与该时段精确文本匹配：偏移 `0分钟`，在 `30分钟` 的包含窗口内；时段匹配不能证明可靠性、独立性或权限（[冲突摘要](#evidence:REPORT%3AEVT003-1)，[天气背景](#evidence:REPORT%3AEVT003-0)）。
- 两条表述都未提供创建时间。情景记录两个来源更新时间相差 `40分钟`，但没有给出各自的具体时间（[事件记录](#evidence:EVT003)）。
- 两条表述都来自同一模拟事件，且未提供独立分组；它们不是两份独立的当前报告。原始报告身份也未说明（[冲突摘要](#evidence:REPORT%3AEVT003-1)，[天气背景](#evidence:REPORT%3AEVT003-0)）。
- 现有当前证据不足以形成一份权威且已核实的当前来源。这里没有评估任何月度时段；月度运行或天气历史只是背景，不能作为当前实时冲突的裁决依据。

### 风险与决定含义
当前证据支持的风险判断是 **无法评估**：这表示证据缺口，不表示运行正常或下降。有决定权限并不等于任一来源的数值已被证明正确。信息不足规则要求核查来源、更新时间、统计口径，降低判断强度，列出缺口并升级给运营负责人进行人工批准；不能据此发布确定性结论（[信息不足规则](#evidence:RULE001)）。

### 提交人工审批的处理建议
以下处理仅作为提交人工审批的建议，尚未执行。
1. 两份报告都保留，运行态势标记为 **未解决**。不要取平均，也不要补造缺失值。
2. 向来源方索取：准确指标名称和定义、原始数值和单位、总体/样本范围、截止时间、更新时间、修订/复核状态，以及统计口径是否一致（[信息不足规则](#evidence:RULE001)）。
3. 将冲突升级给运营负责人，由其记录人工决定：在核实前，是否允许某一来源作为临时输入。若被迫临时选择，这是人工判断，不是自动选择。
4. 如作临时选择，必须说明其临时性和理由；不得据此宣布已确认的运行状态。

### 输出限制
- 任何数字或正式状态都必须列出来源和时间范围（[引用规则](#evidence:RULE009)）。
- 所有情景材料都必须标注为模拟，不得称为真实事件（[模拟标识规则](#evidence:RULE010)）。
- 不需要个人数据；只使用汇总后的来源信息（[隐私规则](#evidence:RULE011)）。
- 事件仍标记为待处理，且未提供正式航班状态，因此面向旅客的文字不得断言延误或取消。任何草案都必须标注模拟/草案并经人工批准后才能使用（[事件记录](#evidence:EVT003)，[旅客沟通规则](#evidence:RULE005)）。

**结论：** 现在不要选择来源甲或来源乙。记录冲突、取得来源级核实，并在确实无法避免时由运营负责人作出有记录、临时性的判断。


### Unverified proposals (not applied)

Proposed verification request: source owner, exact metric name and definition, raw values and unit, population/sample scope, cut-off time, update timestamp, revision/verification state, and whether the statistical basis matches.

建议核查项：来源方、准确指标名称和定义、原始数值和单位、总体/样本范围、截止时间、更新时间、修订/复核状态，以及统计口径是否一致。

Source label: Discussion proposal / 讨论建议

Proposed handling: keep the conflict flagged as unresolved until the operations lead records a source choice and the reason.

建议处理方式：在运营负责人记录来源选择和理由之前，将冲突标记为未解决。

Source label: Discussion proposal / 讨论建议

Proposed interim display: show both supplied statements as unverified, not as confirmed normal or degraded operations.

建议临时展示方式：将两条现有表述都标为未核实，不要标为已确认的运行正常或下降。

Source label: Discussion proposal / 讨论建议


### Decision restrictions

```json

{
  "professionalDecisionRequired": false,
  "actionConclusionsStopped": false,
  "triggeredRuleIds": [],
  "decisionScope": "Which source should be chosen when the numbers from two sources disagree?",
  "reviewerRoles": [
    {
      "en": "Operations lead",
      "zh": "运营负责人"
    }
  ]
}

```
