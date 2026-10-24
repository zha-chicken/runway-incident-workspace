import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {NextRequest} from 'next/server';
import {GET,POST} from '../src/app/api/[...path]/route';
import {closeDatabase,database} from '../src/server/db';
import {dataset} from '../src/domain/evidence';
let directory:string;
beforeEach(()=>{directory=mkdtempSync(join(tmpdir(),'runway-routes-'));process.env.DATABASE_PATH=join(directory,'test.sqlite');});
afterEach(()=>{closeDatabase();rmSync(directory,{recursive:true,force:true});delete process.env.DATABASE_PATH;});
async function request(path:string,cookie='',body?:unknown,origin='http://127.0.0.1:3000') {
  const req=new NextRequest(`http://localhost:3000/api/${path}`,{method:body===undefined?'GET':'POST',
    headers:{host:'127.0.0.1:3000',cookie,origin,'Content-Type':'application/json'},
    ...(body===undefined?{}:{body:JSON.stringify(body)})});
  const response=await (body===undefined?GET:POST)(req,{params:Promise.resolve({path:path.split('?')[0].split('/')})});
  return {response,body:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]||cookie};
}
describe('HTTP route contracts',()=>{
  it('accepts the browser host after Next normalizes its internal URL and persists edits',async()=>{
    const a=await request('workspace');
    expect(a.body.budget).toMatchObject({limit:null,remaining:null,used:0});
    const created=await request('incidents',a.cookie,{...dataset.events[0].input,title:'Route test'});
    expect(created.response.status).toBe(200);
    const detail=await request(`incidents/${created.body.id}`,a.cookie);
    expect(detail.body.snapshot.title).toBe('Route test');
    const changed=await request(`incidents/${created.body.id}`,a.cookie,{expectedVersion:1,input:{...detail.body.snapshot,title:'Changed'}});
    expect(changed.body.version).toBe(2);
    const stale=await request(`incidents/${created.body.id}`,a.cookie,{expectedVersion:1,input:detail.body.snapshot});
    expect(stale.response.status).toBe(409);
    const exported=await request(`incidents/${created.body.id}/export`,a.cookie);
    expect(exported.body.simulation).toBe(true);
    expect(exported.body.history).toHaveLength(2);
    expect(exported.response.headers.get('content-disposition')).toContain('attachment');
    const original=await request(`incidents/${created.body.id}/sources?version=1`,a.cookie);
    expect(original.body.reportEvidence).toHaveLength(detail.body.snapshot.reports.length);
  });
  it('rejects cross-origin changes and cross-workspace access including exports',async()=>{
    const a=await request('workspace'),b=await request('workspace'),id=a.body.incidents[0].id;
    expect((await request('incidents',a.cookie,dataset.events[0].input,'https://unrelated.example')).response.status).toBe(403);
    expect((await request(`incidents/${id}`,b.cookie)).response.status).toBe(404);
    expect((await request(`incidents/${id}/export`,b.cookie)).response.status).toBe(404);
    expect((await request(`incidents/${id}/sources?version=1`,b.cookie)).response.status).toBe(404);
    expect((await request(`incidents/${id}/reviews`,b.cookie,{})).response.status).toBe(404);
    expect((await request(`runs/unowned/cancel`,b.cookie,{})).response.status).toBe(404);
  });
  it('requires input privacy review before storing detected personal information',async()=>{
    const a=await request('workspace');
    const before=database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get();
    const result=await request('incidents',a.cookie,{...dataset.events[0].input,knownInformation:'Synthetic contact person@example.test, 13800000000'});
    expect(result.response.status).toBe(409);expect(result.body).toEqual({error:'PRIVACY_REVIEW_REQUIRED'});
    expect(database().native.prepare('SELECT COUNT(*) AS n FROM snapshots').get()).toEqual(before);
  });
  it('renews the same one-year session on reads, writes, source/export reads and handled errors',async()=>{
    const a=await request('workspace'),id=a.body.incidents[0].id;
    for(const result of [a,await request('workspace',a.cookie),await request(`incidents/${id}`,a.cookie),
      await request(`incidents/${id}/sources?version=1`,a.cookie),await request(`incidents/${id}/export`,a.cookie),
      await request('missing',a.cookie),await request('incidents',a.cookie,{...dataset.events[0].input,title:'Cookie refresh'})]) {
      const header=result.response.headers.get('set-cookie');
      expect(result.cookie).toBe(a.cookie);
      expect(header).toContain('Max-Age=31536000');expect(header).toContain('HttpOnly');expect(header).toContain('SameSite=lax');expect(header).toContain('Path=/');
    }
  });
});
