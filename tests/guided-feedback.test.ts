import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createTranslator} from 'next-intl';
import recorded from '../evals/development/improvement-before.json';
import {feedbackDraft,nextAfterReview} from '../src/components/feedback';
import {nextDecision} from '../src/components/workflow';
import {latestReviews,recommendationsOf,type Review,type T,type Detail} from '../src/components/client';
import {ReviewForm} from '../src/components/editor';
import {HistoryView} from '../src/components/history';
import {messages} from '../src/components/messages';
import {assessmentSchema,incidentInputSchema,reviewSchema,type ReviewInput} from '../src/domain/types';
import {database,closeDatabase,workspaceFor,createIncident,snapshotFor,saveAssessment,saveReview,incidentDetail} from '../src/server/db';
import {feedbackForReassessment} from '../src/server/reassessment-feedback';
import {buildRequest} from '../src/ai/service';
import {evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';

let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-guided-feedback-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');});
afterEach(()=>{closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;});
function setup(){
  const workspace=workspaceFor(),id=createIncident(workspace.id,incidentInputSchema.parse(recorded.input)),snapshot=snapshotFor(workspace.id,id);
  saveAssessment(workspace.id,snapshot,'isolated-fixture',assessmentSchema.parse(recorded.result));
  const detail=()=>incidentDetail(workspace.id,id),assessment=detail().assessments[0];
  const first=recommendationsOf(assessment)[0].id;
  return {workspace,id,snapshot,detail,assessment,first};
}
const translate=(locale:'en'|'zh')=>createTranslator({locale,messages:messages[locale]}) as T;

describe('two-stage feedback records',()=>{
  it('keeps proposed wording separate from execution and leaves unknown outcomes pending',()=>{
    const c=setup(),review=feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','modified');
    review.reason='Check the current capacity first.';review.revisedRecommendation='Request an updated capacity report.';
    saveReview(c.workspace.id,c.id,review);
    expect(c.detail().reviews[0]).toMatchObject({disposition:'modified',revisedRecommendation:review.revisedRecommendation,finalAction:'',outcome:'',outcomeStatus:'pending'});
  });
  it('records an outcome later, retains it when editing a decision, and preserves every earlier revision across reload',()=>{
    const c=setup();const initial=feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','accepted');
    initial.reason='Supported by the supplied reports.';saveReview(c.workspace.id,c.id,initial);
    const followup=feedbackDraft(c.assessment.id,c.first,c.detail().reviews[0],'Reviewer A');
    Object.assign(followup,{finalAction:'Requested an updated report.',outcome:'Two gates were available in the simulation.',outcomeStatus:'simulated_observed',nextImprovement:'Include the verification time.'});
    saveReview(c.workspace.id,c.id,followup);
    const edit=feedbackDraft(c.assessment.id,c.first,c.detail().reviews[0],'Reviewer A','modified');
    edit.reason='Also request the report timestamp.';edit.revisedRecommendation='Request gate availability with its timestamp.';
    saveReview(c.workspace.id,c.id,edit);closeDatabase();
    const d=c.detail();expect(d.reviews).toHaveLength(3);
    expect(d.reviews[0]).toMatchObject({...followup,disposition:'modified',reason:edit.reason,revisedRecommendation:edit.revisedRecommendation});
    expect(d.reviews[2]).toMatchObject(initial);
    expect(d.assessments[0].result).toEqual(c.assessment.result);
    expect(d.runs).toHaveLength(0);
    const feedback=feedbackForReassessment(c.workspace.id,c.snapshot);
    expect(feedback.reviews).toHaveLength(1);expect(feedback.reviews[0].review).toMatchObject({disposition:'modified',reason:edit.reason,revisedRecommendation:edit.revisedRecommendation,finalAction:edit.finalAction,outcome:edit.outcome,nextImprovement:edit.nextImprovement});
  });
  it('allows deliberate clearing without silently copying old details back',()=>{
    const c=setup(),review={...feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','accepted'),nextImprovement:'Old note'};
    saveReview(c.workspace.id,c.id,review);
    const edit=feedbackDraft(c.assessment.id,c.first,c.detail().reviews[0],'Reviewer A');edit.nextImprovement='';
    saveReview(c.workspace.id,c.id,edit);expect(c.detail().reviews[0].nextImprovement).toBe('');expect(c.detail().reviews[1].nextImprovement).toBe('Old note');
  });
  it('preserves legacy modified reviews without reclassifying their finalAction',()=>{
    const c=setup(),legacy={...feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','modified'),reason:'Earlier wording',finalAction:'A legacy proposal stored here'};
    expect(legacy).not.toHaveProperty('revisedRecommendation');saveReview(c.workspace.id,c.id,legacy);
    const edit=feedbackDraft(c.assessment.id,c.first,c.detail().reviews[0],'Reviewer A','accepted');
    expect(edit.finalAction).toBe(legacy.finalAction);expect(edit).not.toHaveProperty('revisedRecommendation');expect(reviewSchema.parse(edit)).toEqual(edit);
  });
  it('does not copy details across assessments or recommendation IDs',()=>{
    const c=setup();const previous={...feedbackDraft('other',c.first,undefined,'Other','accepted'),id:'r',reviewedAt:'now',outcome:'Other assessment'} as Review;
    expect(feedbackDraft(c.assessment.id,c.first,previous,'Reviewer A').outcome).toBe('');
    expect(feedbackDraft('other','different',previous,'Reviewer A').outcome).toBe('');
  });
  it('selects the newest review when timestamp precision ties',()=>{
    const c=setup();for(const disposition of ['accepted','pending'] as const)saveReview(c.workspace.id,c.id,feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A',disposition));
    database().native.prepare('UPDATE reviews SET created_at=? WHERE incident_id=?').run('2026-10-23T00:00:00.000Z',c.id);
    expect(latestReviews(c.detail().reviews,c.assessment.id).get(c.first)?.disposition).toBe('pending');
    expect(feedbackForReassessment(c.workspace.id,c.snapshot).reviews[0].review.disposition).toBe('pending');
  });
  it('keeps feedback attached to an earlier assessment after a new assessment is saved',()=>{
    const c=setup();saveReview(c.workspace.id,c.id,feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','accepted'));
    saveAssessment(c.workspace.id,c.snapshot,'next-fixture',assessmentSchema.parse(recorded.result));
    const update=feedbackDraft(c.assessment.id,c.first,c.detail().reviews[0],'Reviewer A');update.outcome='Outcome now known';update.outcomeStatus='simulated_observed';
    saveReview(c.workspace.id,c.id,update);const d=c.detail();
    expect(d.reviews[0].assessmentId).toBe(c.assessment.id);
    const other=d.assessments.find(a=>a.id!==c.assessment.id)!;expect(latestReviews(d.reviews,other.id).size).toBe(0);
    const html=renderToStaticMarkup(React.createElement(HistoryView,{detail:{...d,evidence:evidenceFor(c.snapshot),policy:evaluatePolicy(c.snapshot)} as Detail,locale:'en',t:translate('en'),onReview:()=>{}}));
    expect(html).toContain('Outcome now known');expect(html).toContain('Record or update outcome');
  });
  it('keeps proposed changes and outcomes in reassessment input without sending reviewer identity',()=>{
    const c=setup(),review={...feedbackDraft(c.assessment.id,c.first,undefined,'Private alias','modified'),reason:'New check needed',revisedRecommendation:'Verify the timestamp',finalAction:'Requested the timestamp',nextImprovement:'Check freshness sooner'};
    saveReview(c.workspace.id,c.id,review);
    const input=JSON.parse(buildRequest(c.snapshot,'assessment','',[],feedbackForReassessment(c.workspace.id,c.snapshot)).input);
    expect(input.humanFeedback.reviews[0].review).toMatchObject({revisedRecommendation:review.revisedRecommendation,finalAction:review.finalAction,outcomeStatus:'pending'});
    expect(JSON.stringify(input.humanFeedback)).not.toContain('Private alias');
  });
});

describe('Pending navigation and bilingual forms',()=>{
  it('saves Pending then visits an unseen card, without marking the review completed',()=>{
    const c=setup(),input=feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','pending');saveReview(c.workspace.id,c.id,input);
    const rows=latestReviews(c.detail().reviews,c.assessment.id);
    expect(nextAfterReview(c.assessment,rows,input)).toBe(1);expect(nextDecision(c.assessment,rows)).toBe(0);
  });
  it('exits instead of looping after every card has been reviewed but deferred; reopening resumes Pending',()=>{
    const c=setup();let input:ReviewInput;
    for(const a of recommendationsOf(c.assessment)){input=feedbackDraft(c.assessment.id,a.id,undefined,'Reviewer A','pending');saveReview(c.workspace.id,c.id,input);}
    const rows=latestReviews(c.detail().reviews,c.assessment.id);
    expect(nextAfterReview(c.assessment,rows,input!)).toBe(-1);expect(nextDecision(c.assessment,rows)).toBe(0);
  });
  it('does not let pending outcomes prevent decision completion',()=>{
    const c=setup();let input:ReviewInput;
    for(const a of recommendationsOf(c.assessment)){input=feedbackDraft(c.assessment.id,a.id,undefined,'Reviewer A','accepted');saveReview(c.workspace.id,c.id,input);}
    const rows=latestReviews(c.detail().reviews,c.assessment.id);
    expect(nextDecision(c.assessment,rows)).toBe(-1);expect(nextAfterReview(c.assessment,rows,input!)).toBe(-1);
  });
  it.each(['en','zh'] as const)('makes outcomes a separate form, preserves the decision, and requires an observed outcome description (%s)',locale=>{
    const c=setup(),t=translate(locale),review=feedbackDraft(c.assessment.id,c.first,undefined,'Reviewer A','accepted');
    const render=(mode:'decision'|'outcome')=>renderToStaticMarkup(React.createElement(ReviewForm,{review,recommendation:'Original recommendation',setReview:()=>{},t,busy:false,onSave:()=>{},mode}));
    expect(render('decision')).toContain(t('pending'));expect(render('decision')).not.toContain(t('finalAction'));
    expect(render('outcome')).toContain(t('finalAction'));expect(render('outcome')).not.toContain('type="radio"');
    review.outcomeStatus='simulated_observed';expect(render('outcome')).toMatch(/textarea[^>]*required/);
  });
});
