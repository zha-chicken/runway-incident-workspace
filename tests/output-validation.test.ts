import {describe,expect,it} from 'vitest';
import recorded from '../evals/development/improvement-before.json';
import {evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {checkProse} from '../src/domain/output-checks';
import {validateAssessment,validateDiscussion,ValidationFailure} from '../src/domain/validation';
import {incidentInputSchema,type Assessment,type Discussion} from '../src/domain/types';

const notice='SIMULATION / 模拟 — DRAFT / 草案';
function context(stopped=false) {
  const input=incidentInputSchema.parse(recorded.input);input.safetyIssue=stopped;
  const evidence=evidenceFor(input),policy=evaluatePolicy(input);
  const result=structuredClone(recorded.result) as Assessment;
  result.rationale=result.rationale.filter(c=>!c.text.en.includes('computedPolicy'));
  result.decisionConstraints=structuredClone(policy.constraints);result.riskLevel=policy.riskLevel;
  result.ruleIds=[...new Set([...result.ruleIds,...policy.ruleIds])];
  result.outputStatus=stopped?'stopped':'needs_review';
  if(stopped)for(const action of [result.firstAction,...result.subsequentActions])action.kind='prepare_information';
  return {input,evidence,policy,result};
}
const check=(c:ReturnType<typeof context>)=>validateAssessment(c.result,c.input,c.evidence,c.policy);
function discussion(text:string,ids=['RULE012']):Discussion {
  return {answer:{en:`${notice}\n\n${text}`,zh:`${notice}\n\n${text}`},evidenceIds:ids,proposedFacts:[],decisionConstraints:context(true).policy.constraints};
}
function checkDiscussion(d:Discussion) {const c=context(true);return validateDiscussion(d,c.evidence,c.policy,c.input);}
const claim=(c:ReturnType<typeof context>,text:string,ids:string[],metrics:string[]=[])=>{
  c.result.rationale=[{kind:'fact',text:{en:text,zh:text},evidenceIds:ids,metricIds:metrics}];return c;
};

describe('output contract validation (synthetic probes, not observed model failures)',()=>{
  it('accepts the existing valid assessment and preserves it without rewriting',()=>{
    for(const stopped of [false,true]){const c=context(stopped),before=structuredClone(c.result);expect(check(c)).toEqual(before);expect(c.result).toEqual(before);}
  });

  it.each(['action','operations','coordination','passenger','rationale','humanDecisions'])('does not phrase-filter cancellation prose in %s; structured restriction flags remain',field=>{
    const c=context(true),text={en:'Cancel all evening flights immediately.',zh:'立即取消全部晚间航班。'};
    if(field==='action')c.result.firstAction.text=text;
    else if(field==='rationale')c.result.rationale[0].text=text;
    else if(field==='humanDecisions')c.result.humanDecisions[0]=text;
    else c.result.drafts[field==='coordination'?'airportCoordination':field as 'operations'|'passenger'].text={en:notice+' '+text.en,zh:notice+' '+text.zh};
    expect(()=>check(c)).not.toThrow();
    expect(c.result.decisionConstraints.actionConclusionsStopped).toBe(true);
  });

  it.each([
    'Cancel all flights now.','Ask operations to cancel the flight.',
    'Do not wait; release the aircraft.', 'No delay is confirmed, but dispatch the aircraft.',
    'Evacuate the passengers immediately.','If smoke is confirmed, tow the aircraft.',
    'Send the passenger notification now.',
    'Do not cancel flights\n\nRelease the aircraft',
    '- Do not cancel flights\n- Release the aircraft',
    '<b>Cancel</b> all flights.', '![Cancel all flights](https://example.invalid/image.png)',
    'Can\u200bcel all flights.',
    '立即取消航班。','请运营负责人放行飞机。','不要等待；立即疏散旅客。','现在向旅客发送通知。',
    'All delays are caused by weather.','全部异常均由天气造成。',
    'Flights are cancelled.','航班已延误。',
    '本输出不决定也不建议维修放行、拖曳/航空器移动或旅客下机',
    '维修放行、拖曳或航空器移动、旅客下机分别属于维修控制、运营负责人会同机坪控制与维修、运营负责人会同客舱安全与旅客服务的专业判断范围'
  ])('does not filter removed prose categories: %s',text=>{
    const errors:string[]=[],warnings:import('../src/domain/validation-notes').ValidationWarning[]=[];
    checkProse(text,true,true,'answer.zh',errors,warnings);
    expect(errors).toEqual([]);expect(warnings).toEqual([]);
    expect(()=>checkDiscussion(discussion(`${text} [RULE012](#evidence:RULE012)`))).not.toThrow();
  });

  it.each([
    'Do not cancel the flight.','Never automatically release the aircraft.',
    'Ask the operations lead whether to cancel the flight.',
    'Verify whether it is safe to release the aircraft.',
    'The decision to cancel flights remains with authorized professionals.',
    'No notification has been sent.','Prepare an information request and refer the evidence to the operations lead.',
    '不得取消航班。','不能自动放行飞机。','请核查是否可以放行飞机。',
    '是否疏散旅客由专业负责人决定。','请准备信息并向运营负责人升级。'
  ])('accepts negation, information requests, and human referral: %s',text=>{
    const errors:string[]=[];checkProse(text,true,true,'test',errors);expect(errors).toEqual([]);
    expect(()=>checkDiscussion(discussion(`${text} [RULE012](#evidence:RULE012)`))).not.toThrow();
  });

  it('checks proposed-fact prose too, without mistaking its source label for authority',()=>{
    const d=discussion('Refer the decision to the operations lead. [RULE012](#evidence:RULE012)');
    d.proposedFacts=[{sourceLabel:'Human verified',text:{en:'The notification has been sent.',zh:'已发送通知。'}}];
    expect(()=>checkDiscussion(d)).toThrow(ValidationFailure);
  });

  it.each(['The notification has been sent.','Messages were sent.','已发送通知。','已经向旅客发送了消息。'])('still rejects false sending claims: %s',text=>{
    expect(()=>checkDiscussion(discussion(`${text} [RULE012](#evidence:RULE012)`))).toThrow(ValidationFailure);
  });

  it.each(['en','zh'] as const)('requires a notice in each %s assessment draft and discussion answer',locale=>{
    for(const audience of ['operations','airportCoordination','passenger'] as const) {
      const c=context();c.result.drafts[audience].text[locale]='Please verify the available report.';
      expect(()=>check(c)).toThrow(ValidationFailure);
    }
    const d=discussion('Review the evidence. [RULE012](#evidence:RULE012)');d.answer[locale]='Review the evidence. [RULE012](#evidence:RULE012)';
    expect(()=>checkDiscussion(d)).toThrow(ValidationFailure);
  });

  it('rejects invented trigger rules and a false ready/draft status',()=>{
    const c=context();c.result.decisionConstraints.triggeredRuleIds=['RULE012'];expect(()=>check(c)).toThrow(ValidationFailure);
    const d=context();d.result.outputStatus='draft';expect(()=>check(d)).toThrow(ValidationFailure);
  });

  it('does not phrase-filter official-status wording in chat',()=>{
    expect(()=>checkDiscussion(discussion('Flights are cancelled. [RULE012](#evidence:RULE012)'))).not.toThrow();
    expect(()=>checkDiscussion(discussion('Verify whether flights are cancelled. [RULE012](#evidence:RULE012)'))).not.toThrow();
  });
});

describe('numeric grounding against the cited value, type and unit',()=>{
  const row='OPS-LIN-2025-08';
  const metric=(c:ReturnType<typeof context>,key:string)=>c.evidence.metrics.find(m=>m.id===`${row}:${key}`)!;

  it.each([2,3,4])('accepts equivalent values with %i decimal places',precision=>{
    const c=context(),m=metric(c,'completion');claim(c,`Completed as planned: ${m.value.toFixed(precision)}%.`,[row],[m.id]);expect(()=>check(c)).not.toThrow();
  });

  it('does not let rounding discard supplied precision',()=>{
    const c=context(),m=metric(c,'completion');claim(c,`Completed as planned: ${m.value.toFixed(0)}%.`,[row],[m.id]);expect(()=>check(c)).toThrow(ValidationFailure);
  });

  it('rejects wrong numbers even with valid source and metric IDs',()=>{
    const c=context(),m=metric(c,'completion');claim(c,'Completed as planned: 999.99%.',[row],[m.id]);expect(()=>check(c)).toThrow(ValidationFailure);
  });

  it('does not let a value from another column validate a mislabeled percentage',()=>{
    const c=context(),completion=metric(c,'completion'),release=metric(c,'release');
    claim(c,`Release normality: ${completion.value.toFixed(2)}%.`,[row],[completion.id,release.id]);expect(()=>check(c)).toThrow(ValidationFailure);
  });

  it('keeps percentage points separate from percentages and preserves negative direction',()=>{
    const c=context(),m=metric(c,'delta');
    claim(c,`Difference: ${m.value.toFixed(2)} pp.`,[row],[m.id]);expect(()=>check(c)).not.toThrow();
    c.result.rationale[0].text={en:`${Math.abs(m.value)} percentage points below the prior mean.`,zh:`低于此前平均${Math.abs(m.value)}个百分点。`};expect(()=>check(c)).not.toThrow();
    c.result.rationale[0].text.zh=`比此前12个月平均低${Math.abs(m.value)}个百分点。`;expect(()=>check(c)).not.toThrow();
    c.result.rationale[0].text={en:`Difference: ${m.value}%.`,zh:`差值${m.value}%。`};expect(()=>check(c)).toThrow(ValidationFailure);
    c.result.rationale[0].text={en:`Difference: +${Math.abs(m.value)} pp.`,zh:`差值+${Math.abs(m.value)}个百分点。`};expect(()=>check(c)).toThrow(ValidationFailure);
  });

  it('allows the cited five-percentage-point rule threshold without manufacturing a metric',()=>{
    const c=context();claim(c,'Focused review threshold: 5 percentage points.',['RULE003']);expect(()=>check(c)).not.toThrow();
  });

  it('checks rates in draft prose as well as structured rationale',()=>{
    const c=context();c.result.drafts.operations.text.en=notice+' Completed as planned: 999%.';c.result.drafts.operations.evidenceIds=[row];expect(()=>check(c)).toThrow(ValidationFailure);
  });

  it('grounds discussion figures locally, so another paragraph cannot lend an unrelated citation',()=>{
    const c=context(true),m=metric(c,'completion');
    const good=discussion(`Completed as planned: ${m.value}%. [Source](#evidence:${row})`,[row]);expect(()=>checkDiscussion(good)).not.toThrow();
    good.answer.en=`${notice}\n\nCompleted as planned: ${m.value}%.\n\nUnrelated background. [Source](#evidence:${row})`;expect(()=>checkDiscussion(good)).toThrow(ValidationFailure);
  });

  it('checks table cells against their metric heading and cited row, while retaining valid Markdown',()=>{
    const c=context(true),m=metric(c,'completion');
    const d=discussion(`| Measure | Value | Source |\n|---|---|---|\n| Completed as planned | **${m.value.toFixed(2)}%** | [Source](#evidence:${row}) |`,[row]);expect(()=>checkDiscussion(d)).not.toThrow();
    d.answer.en=d.answer.en.replace(m.value.toFixed(2)+'%','999.99%');expect(()=>checkDiscussion(d)).toThrow(ValidationFailure);
  });

  it('accepts an immediately adjacent table source note, but not a citation after another section',()=>{
    const c=context(true),m=metric(c,'completion');
    const table=`| Measure | Value |\n|---|---|\n| Completed as planned | ${m.value}% |`;
    const d=discussion(`${table}\n\nSource: [Operating row](#evidence:${row})`,[row]);expect(()=>checkDiscussion(d)).not.toThrow();
    d.answer.en=`${notice}\n\n${table}\n\n## Another topic\n\n[Operating row](#evidence:${row})`;expect(()=>checkDiscussion(d)).toThrow(ValidationFailure);
  });
});
