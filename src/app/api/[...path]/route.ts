import {NextRequest, NextResponse} from 'next/server';
import {createHmac} from 'node:crypto';
import {z} from 'zod';
import {workspaceFor, listIncidents, createIncident, updateIncident, incidentDetail, snapshotFor, saveReview, saveDraft, resetWorkspace, database, newId, ownIncident} from '../../../server/db';
import {dataset, evidenceFor} from '../../../domain/evidence';
import {evaluatePolicy} from '../../../domain/policy';
import {AppError, assertNoPersonalData} from '../../../domain/privacy';
import {generate, cancelRun} from '../../../ai/service';
import {budgetStatus} from '../../../server/budget';
import {discussionSchema, reportSchema} from '../../../domain/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = {params: Promise<{path: string[]}>};
async function handle(req: NextRequest, ctx: Context) {
  let cookie: string | undefined;
  try {
    if (req.method !== 'GET') {
      const origin = req.headers.get('origin');
      // Next may normalize the internal URL to localhost. The Host header
      // retains the browser's authority; browsers cannot override that header.
      const authority = new URL(req.url);
      authority.host = req.headers.get('host') || authority.host;
      const expectedOrigin = process.env.APP_ORIGIN || authority.origin;
      if (origin && origin !== expectedOrigin) throw new AppError('ORIGIN_REJECTED', 403);
      if (!req.headers.get('content-type')?.includes('application/json')) throw new AppError('JSON_REQUIRED', 415);
    }
    const workspace = workspaceFor(req.cookies.get('runway-session')?.value);
    cookie = workspace.token;
    const {path} = await ctx.params;
    const [resource, id, command] = path;
    let result: unknown;
    if (req.method === 'GET') {
      if (resource === 'workspace') result = {
        incidents: listIncidents(workspace.id), airports: dataset.airports, events: dataset.events.map(e => ({id:e.id,title:e.title})),
        dataset: {version:dataset.version,sha256:dataset.sha256,audit:dataset.audit},
        budget: budgetStatus(), apiConfigured: !!process.env.DEEPSEEK_API_KEY,
        apiFormat: process.env.DEEPSEEK_API_FORMAT || 'responses', effort: process.env.DEEPSEEK_EFFORT || 'high'
      };
      else if (resource === 'incidents' && id) {
        if(command==='sources') {
          const version=z.coerce.number().int().min(1).parse(req.nextUrl.searchParams.get('version'));
          result=evidenceFor(snapshotFor(workspace.id,id,version));
          return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
        }
        const detail = incidentDetail(workspace.id, id), evidence = evidenceFor(detail.snapshot);
        result = {...detail, evidence, policy: evaluatePolicy(detail.snapshot)};
        if (command === 'export') {
          const response = new NextResponse(JSON.stringify({simulation:true,exportedAt:new Date().toISOString(),...result as object},null,2), {
            headers:{'Content-Type':'application/json','Content-Disposition':`attachment; filename="aerocontext-${id}.json"`,'Cache-Control':'no-store'}
          });
          if (cookie) setSession(response,cookie);
          return response;
        }
      } else throw new AppError('NOT_FOUND',404);
    } else {
      const text = await req.text();
      if (Buffer.byteLength(text)>200000) throw new AppError('REQUEST_TOO_LARGE',413);
      const body = JSON.parse(text);
      assertNoPersonalData(body);
      if (resource === 'workspace' && command === undefined && id === 'reset') {
        resetWorkspace(workspace.id); result = {ok:true};
      } else if (resource === 'runs' && id && command === 'cancel') {
        cancelRun(workspace.id,id); result = {ok:true};
      } else if (resource === 'incidents' && !id) {
        result = {id:createIncident(workspace.id,body)};
      } else if (resource === 'incidents' && id) {
        ownIncident(workspace.id,id);
        if (!command) result = updateIncident(workspace.id,id,body.expectedVersion,body.input);
        else if (command === 'generate' || command === 'discuss') {
          const forwarded = process.env.TRUST_PROXY === 'true' ? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : null;
          const ipHash = createHmac('sha256',process.env.SESSION_SECRET || 'local-development-only').update(forwarded || 'local-network').digest('hex');
          result = await generate({workspaceId:workspace.id,incidentId:id,expectedVersion:body.expectedVersion,
            action:command==='generate'?'assessment':'discussion',question:body.question,
            idempotencyKey:body.idempotencyKey,ipHash,signal:req.signal});
        } else if (command === 'reviews') result = {id:saveReview(workspace.id,id,body)};
        else if (command === 'drafts') result = {id:saveDraft(workspace.id,id,body)};
        else if (command === 'apply') {
          const db=database().native;
          result=db.transaction(() => {
            const entry=db.prepare('SELECT * FROM discussions WHERE id=? AND incident_id=?').get(body.discussionId,id) as {response:string;snapshot_id:string;applied_snapshot_id:string|null}|undefined;
            if(!entry)throw new AppError('NOT_FOUND',404);
            if(entry.applied_snapshot_id)throw new AppError('PROPOSAL_ALREADY_APPLIED',409);
            const snapshot=snapshotFor(workspace.id,id);
            if(snapshot.id!==entry.snapshot_id || snapshot.version!==body.expectedVersion)throw new AppError('VERSION_CONFLICT',409);
            const proposal=discussionSchema.parse(JSON.parse(entry.response)).proposedFacts[Number(body.index)];
            if(!proposal)throw new AppError('NOT_FOUND',404);
            const report=reportSchema.parse({
              id:newId(),text:`${proposal.text.en}\n${proposal.text.zh}`,sourceLabel:proposal.sourceLabel,
              originReportId:null,reportedAt:null,applicablePeriod:snapshot.scenarioPeriod,
              reliability:'unverified',independenceGroup:null,verificationBasis:null,signal:'context',
              expandingImpact:false,provenanceKind:'team_simulation',sourceEvidenceId:null
            });
            const next=updateIncident(workspace.id,id,snapshot.version,{...snapshot,reports:[...snapshot.reports,report]});
            db.prepare('UPDATE discussions SET applied_snapshot_id=? WHERE id=?').run(next.id,body.discussionId);
            return next;
          })();
        } else throw new AppError('NOT_FOUND',404);
      } else throw new AppError('NOT_FOUND',404);
    }
    const response=NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
    if(cookie)setSession(response,cookie);
    return response;
  } catch(error) {
    const code=error instanceof AppError?error.code:error instanceof z.ZodError?'INVALID_INPUT':error instanceof SyntaxError?'INVALID_JSON':'INTERNAL_ERROR';
    // Do not log request content, provider bodies, or secrets.
    const response=NextResponse.json({error:code},{status:error instanceof AppError?error.status:code==='INTERNAL_ERROR'?500:400});
    if(cookie)setSession(response,cookie);
    return response;
  }
}
function setSession(response:NextResponse,token:string) {
  response.cookies.set('runway-session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:14*86400});
}
export const GET=handle;
export const POST=handle;
