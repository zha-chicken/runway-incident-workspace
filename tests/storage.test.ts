import {beforeEach, afterEach, describe, expect, it, vi} from 'vitest';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {database, closeDatabase, workspaceFor, listIncidents, snapshotFor, updateIncident, resetWorkspace, saveAssessment, newId, validateInput} from '../src/server/db';
import {reserveRun, finishRun, budgetStatus} from '../src/server/budget';
import type {Assessment} from '../src/domain/types';
let directory: string;
beforeEach(() => {directory=mkdtempSync(join(tmpdir(),'runway-test-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');process.env.BUDGET_POOL='development';});
afterEach(() => {closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;vi.unstubAllEnvs();});
describe('workspace isolation, snapshots, and budget', () => {
  it('prevents reattributing competition reports to another airport or manufacturing supplied provenance', () => {
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    expect(()=>validateInput({...s,airportId:'LIN',sourceEventId:null})).toThrow('SOURCE_REPORT_IMMUTABLE');
    expect(()=>validateInput({...s,reports:s.reports.map(r=>({...r,provenanceKind:'team_simulation'}))})).toThrow('SOURCE_REPORT_IMMUTABLE');
  });
  it('isolates visitors and rejects stale writes', () => {
    const a=workspaceFor(),b=workspaceFor(); const id=listIncidents(a.id)[0].id;
    expect(() => snapshotFor(b.id,id)).toThrow('NOT_FOUND');
    const s=snapshotFor(a.id,id);updateIncident(a.id,id,1,{...s,title:'Changed'});
    expect(() => updateIncident(a.id,id,1,s)).toThrow('VERSION_CONFLICT');
    expect(snapshotFor(a.id,id,1).title).toBe(s.title);
    expect(snapshotFor(a.id,id).title).toBe('Changed');
  });
  it('never promotes an old generation after a new snapshot', () => {
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    updateIncident(a.id,id,1,{...s,title:'New evidence'});
    saveAssessment(a.id,s,'test-run',{riskLevel:'medium'} as Assessment);
    const current=database().native.prepare('SELECT current_assessment_id FROM incidents WHERE id=?').get(id) as {current_assessment_id:string|null};
    expect(current.current_assessment_id).toBeNull();
    expect(database().native.prepare('SELECT snapshot_id FROM assessments WHERE incident_id=?').get(id)).toMatchObject({snapshot_id:s.id});
  });
  it('deduplicates requests and keeps usage accounting across reset', () => {
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    const args={workspaceId:a.id,incidentId:id,snapshotId:s.id,action:'assessment',idempotencyKey:'same-key',ipHash:'test',reservedMicro:1000000,metadata:{}};
    const run=reserveRun(args);
    expect(reserveRun(args)).toEqual({id:run.id,existing:true});
    expect(budgetStatus().used).toBe(1);
    expect(() => resetWorkspace(a.id)).toThrow('RUN_ACTIVE');
    finishRun(run.id,'completed',250000,{});
    resetWorkspace(a.id);
    expect(budgetStatus().used).toBe(.25);
    expect(listIncidents(a.id)).toHaveLength(5);
  });
  it('allows six requests globally across workspaces, actions and pools, then rejects the seventh', () => {
    const owners=[workspaceFor(),workspaceFor()];
    const args=owners.map(a=>{const id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);return {workspaceId:a.id,incidentId:id,snapshotId:s.id,action:'assessment',ipHash:'test',reservedMicro:1000000,metadata:{}};});
    const runs=Array.from({length:6},(_,i)=>{
      vi.stubEnv('BUDGET_POOL',i%2?'hosted':'development');
      const request={...args[i%2],action:i%2?'discussion':'assessment',idempotencyKey:newId()};
      return {request,run:reserveRun(request)};
    });
    expect(()=>reserveRun({...args[0],idempotencyKey:newId()})).toThrow('BUSY');
    expect(reserveRun(runs[0].request)).toEqual({id:runs[0].run.id,existing:true});
    expect(database().native.prepare("SELECT COUNT(*) AS n FROM ai_runs WHERE status='running'").get()).toEqual({n:6});
    expect(budgetStatus('development').used).toBe(3);
    expect(budgetStatus('hosted').used).toBe(3);
  });
  it.each(['completed','failed','cancelled'])('releases a concurrency slot after a %s request', status => {
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    const args={workspaceId:a.id,incidentId:id,snapshotId:s.id,action:'assessment',ipHash:'test',reservedMicro:1000000,metadata:{}};
    const runs=Array.from({length:6},()=>reserveRun({...args,idempotencyKey:newId()}));
    expect(() => reserveRun({...args,idempotencyKey:newId()})).toThrow('BUSY');
    finishRun(runs[0].id,status,250000,{});
    expect(reserveRun({...args,idempotencyKey:newId()}).existing).toBe(false);
    expect(database().native.prepare("SELECT COUNT(*) AS n FROM ai_runs WHERE status='running'").get()).toEqual({n:6});
    expect(budgetStatus().used).toBe(6.25);
  });
  it('allows more than the former workspace and IP daily quotas even with legacy overrides set', () => {
    vi.stubEnv('VISITOR_DAILY_LIMIT','1');vi.stubEnv('IP_DAILY_LIMIT','1');
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    const args={workspaceId:a.id,incidentId:id,snapshotId:s.id,action:'assessment',ipHash:'shared-network',reservedMicro:1000,metadata:{}};
    for(let i=0;i<65;i++){
      const run=reserveRun({...args,action:i%2?'discussion':'assessment',idempotencyKey:newId()});
      finishRun(run.id,['completed','failed','cancelled'][i%3],1000,{});
    }
    expect(database().native.prepare('SELECT COUNT(*) AS n FROM ai_runs WHERE workspace_id=? AND ip_hash=?').get(a.id,args.ipHash)).toEqual({n:65});
    expect(budgetStatus().used).toBe(.065);
    expect(reserveRun({...args,idempotencyKey:newId()}).existing).toBe(false);
  });
  it.each(['development','hosted'])('keeps accounting above the former %s spending cap without blocking', pool => {
    vi.stubEnv('BUDGET_POOL',pool);
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    const args={workspaceId:a.id,incidentId:id,snapshotId:s.id,action:'assessment',ipHash:'test',reservedMicro:80000000,metadata:{}};
    const run=reserveRun({...args,idempotencyKey:newId()});
    finishRun(run.id,'completed',65000000,{});
    const ledgerBefore=database().native.prepare('SELECT * FROM ai_runs WHERE id=?').get(run.id);
    expect(reserveRun({...args,idempotencyKey:newId()}).existing).toBe(false);
    expect(budgetStatus()).toEqual({pool,limit:null,used:145,remaining:null});
    expect(database().native.prepare('SELECT * FROM ai_runs WHERE id=?').get(run.id)).toEqual(ledgerBefore);
  });
});
