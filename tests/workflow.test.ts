import {describe, expect, it} from 'vitest';
import {airportStage, nextDecision} from '../src/components/workflow';
import {latestReviews, recommendationsOf, type Detail, type Review} from '../src/components/client';
import type {Assessment, StoredAssessment} from '../src/domain/types';
import recorded from '../evals/development/improvement-before.json';

const assessment:StoredAssessment={id:'a1',incidentId:'hai',snapshotId:'s1',snapshotVersion:1,generatedAt:'2026-10-20',runId:'r1',origin:'recorded_example',result:recorded.result as Assessment};
const detail=(current=true,version=1,runs:Detail['runs']=[])=>({
  incident:{id:'hai',version,current_assessment_id:current?'a1':null},
  snapshot:{version},assessments:[assessment],runs
}) as Detail;
const run=(action:string,status='running')=>({id:'r2',action,status}) as Detail['runs'][number];
const review=(recommendationId:string,disposition:Review['disposition']='accepted',assessmentId='a1')=>({
  id:'review',assessmentId,recommendationId,disposition
}) as Review;

describe('guided airport stages',()=>{
  it('keeps unassessed and edited versions in preflight even when historical assessments exist',()=>{
    expect(airportStage(null)).toBe('loading');
    expect(airportStage(detail(false))).toBe('preflight');
    expect(airportStage(detail(true,2))).toBe('preflight');
    expect(airportStage(detail())).toBe('ready');
  });
  it('focuses only an active assessment, including a run recovered from the server',()=>{
    expect(airportStage(detail(),'generate')).toBe('analyzing');
    expect(airportStage(detail(false,1,[run('assessment')]))).toBe('analyzing');
    expect(airportStage(detail(),'discuss')).toBe('ready');
    expect(airportStage(detail(true,1,[run('discussion')]))).toBe('ready');
  });
  it('returns failures and cancellations to preflight, or to the prior current assessment',()=>{
    for(const status of ['cancelled','failed','interrupted']){
      expect(airportStage(detail(false,1,[run('assessment',status)]))).toBe('preflight');
      expect(airportStage(detail(true,1,[run('assessment',status)]))).toBe('ready');
    }
    expect(airportStage(detail(false,1,[run('assessment','completed')]))).toBe('preflight');
  });
});

describe('sequential decisions',()=>{
  const actions=recommendationsOf(assessment);
  it('resumes the first unfinished recommendation and treats a later pending review as unfinished',()=>{
    const rows=[review(actions[1].id,'pending'),review(actions[1].id),review(actions[0].id)];
    expect(nextDecision(assessment,latestReviews(rows,assessment.id))).toBe(1);
  });
  it('does not inherit a decision from a previous assessment with the same recommendation id',()=>{
    const rows=actions.map(action=>review(action.id,'accepted','old-assessment'));
    expect(nextDecision(assessment,latestReviews(rows,assessment.id))).toBe(0);
    expect(nextDecision(assessment,new Map(rows.map(row=>[row.recommendationId,row])))).toBe(0);
  });
  it('finishes only when every recommendation has an accepted, modified or rejected decision',()=>{
    const rows=actions.map((action,i)=>review(action.id,(['accepted','modified','rejected'] as const)[i%3]));
    expect(nextDecision(assessment,latestReviews(rows,assessment.id))).toBe(-1);
    expect(nextDecision(assessment,latestReviews(rows.slice(0,-1),assessment.id))).toBe(actions.length-1);
  });
});
