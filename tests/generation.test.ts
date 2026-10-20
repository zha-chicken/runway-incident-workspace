import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import recorded from '../evals/development/improvement-before.json';
import {buildRequest,generate} from '../src/ai/service';
import * as provider from '../src/ai/provider';
import {database,closeDatabase,workspaceFor,createIncident,snapshotFor,updateIncident,incidentDetail} from '../src/server/db';
import {validateAssessment,ValidationFailure} from '../src/domain/validation';
import {evidenceFor} from '../src/domain/evidence';
import {evaluatePolicy} from '../src/domain/policy';
import {incidentInputSchema} from '../src/domain/types';

let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-generation-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');process.env.DEEPSEEK_API_KEY='unit-test-only';});
afterEach(()=>{vi.restoreAllMocks();closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;delete process.env.DEEPSEEK_API_KEY;});
const input=incidentInputSchema.parse(recorded.input);
function valid() {
  const result=structuredClone(recorded.result);
  result.rationale=result.rationale.filter(c=>!c.text.en.includes('computedPolicy'));
  return result;
}
function setup() {
  const w=workspaceFor(),id=createIncident(w.id,input);
  return {workspaceId:w.id,incidentId:id,expectedVersion:1,action:'assessment' as const,idempotencyKey:'request-1',ipHash:'unit-test'};
}
const response=(text:string)=>({text,status:'completed' as const,terminal:'completed',usage:{input:100,cached:0,output:50,reasoning:10,raw:{}},providerId:'test-provider',model:'deepseek-flash',fingerprint:null,latencyMs:1});
describe('generation persistence and bounded recovery',()=>{
  it('constrains model-generated citations to the actual snapshot evidence IDs',()=>{
    const args=setup(),snapshot=snapshotFor(args.workspaceId,args.incidentId);
    const request=buildRequest(snapshot,'assessment');
    const schema=JSON.stringify(request.schema);
    expect(schema).toContain(`REPORT:${snapshot.reports[0].id}`);
    const root=request.schema as {properties:{evidenceReferences:{items:{enum:string[]}}}};
    expect(root.properties.evidenceReferences.items.enum).not.toContain(snapshot.reports[0].id);
    expect(root.properties.evidenceReferences.items.enum).toContain(`REPORT:${snapshot.reports[0].id}`);
  });
  it('rejects the observed internal-field prose while accepting plain-language content',()=>{
    const evidence=evidenceFor(input),policy=evaluatePolicy(input);
    try{validateAssessment(recorded.result,input,evidence,policy);throw new Error('Expected validation failure');}
    catch(e){expect(e).toBeInstanceOf(ValidationFailure);expect((e as ValidationFailure).issues).toContain('Use plain operational language instead of implementation identifiers in narrative text.');}
    expect(validateAssessment(valid(),input,evidence,policy).riskLevel).toBe('medium');
  });
  it('repairs malformed JSON once and charges both attempts',async()=>{
    const args=setup();
    const mock=vi.spyOn(provider,'callModel').mockResolvedValueOnce(response('{')).mockResolvedValueOnce(response(JSON.stringify(valid())));
    await generate(args);
    expect(mock).toHaveBeenCalledTimes(2);
    const d=incidentDetail(args.workspaceId,args.incidentId);
    expect(d.assessments).toHaveLength(1);
    expect(d.runs[0]).toMatchObject({status:'completed',cost_micro:1200});
    expect((d.runs[0].metadata as {attempts:unknown[]}).attempts).toHaveLength(2);
    await generate(args);
    expect(mock).toHaveBeenCalledTimes(2);
  });
  it('does not retry a truncated response or replace the last valid result',async()=>{
    const args=setup();
    vi.spyOn(provider,'callModel').mockResolvedValueOnce(response(JSON.stringify(valid()))).mockResolvedValueOnce({...response('{}'),status:'incomplete',terminal:'incomplete'});
    await generate(args);
    const before=incidentDetail(args.workspaceId,args.incidentId).incident.current_assessment_id;
    await expect(generate({...args,idempotencyKey:'request-2'})).rejects.toThrow('MODEL_TRUNCATED');
    expect(incidentDetail(args.workspaceId,args.incidentId).incident.current_assessment_id).toBe(before);
    expect(provider.callModel).toHaveBeenCalledTimes(2);
  });
  it('keeps an old-snapshot completion in history without promoting it',async()=>{
    const args=setup();
    vi.spyOn(provider,'callModel').mockImplementation(async()=>{
      const snapshot=snapshotFor(args.workspaceId,args.incidentId);
      updateIncident(args.workspaceId,args.incidentId,1,{...snapshot,unknowns:'New conflicting information needs review.'});
      return response(JSON.stringify(valid()));
    });
    await generate(args);
    const d=incidentDetail(args.workspaceId,args.incidentId);
    expect(d.snapshot.version).toBe(2);expect(d.incident.current_assessment_id).toBeNull();expect(d.assessments[0].snapshotVersion).toBe(1);
  });
  it('accounts for unknown timeout usage conservatively and performs no blind retry',async()=>{
    const args=setup();
    vi.spyOn(provider,'callModel').mockRejectedValue(new DOMException('Timed out','TimeoutError'));
    await expect(generate(args)).rejects.toThrow('MODEL_TIMEOUT');
    const row=database().native.prepare('SELECT status,cost_micro,reserved_micro FROM ai_runs').get() as {status:string;cost_micro:number;reserved_micro:number};
    expect(row.status).toBe('failed');expect(row.cost_micro).toBe(row.reserved_micro);expect(provider.callModel).toHaveBeenCalledTimes(1);
  });
});
