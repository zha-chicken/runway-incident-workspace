import {beforeEach, afterEach, describe, expect, it} from 'vitest';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {database, closeDatabase, workspaceFor, listIncidents, snapshotFor, updateIncident, resetWorkspace, saveAssessment, newId, validateInput} from '../src/server/db';
import {reserveRun, finishRun, budgetStatus} from '../src/server/budget';
import type {Assessment} from '../src/domain/types';
let directory: string;
beforeEach(() => {directory=mkdtempSync(join(tmpdir(),'runway-test-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');process.env.BUDGET_POOL='development';});
afterEach(() => {closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;});
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
  it('deduplicates requests and keeps spend and quotas across reset', () => {
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
  it('reserves budget atomically and caps global concurrent requests', () => {
    const a=workspaceFor(),id=listIncidents(a.id)[0].id,s=snapshotFor(a.id,id);
    const args={workspaceId:a.id,incidentId:id,snapshotId:s.id,action:'assessment',ipHash:'test',reservedMicro:1000000,metadata:{}};
    expect(() => reserveRun({...args,idempotencyKey:newId(),reservedMicro:40000001})).toThrow('BUDGET_EXHAUSTED');
    for(let i=0;i<3;i++)reserveRun({...args,idempotencyKey:newId()});
    expect(() => reserveRun({...args,idempotencyKey:newId()})).toThrow('BUSY');
    expect(budgetStatus().used).toBe(3);
  });
});
