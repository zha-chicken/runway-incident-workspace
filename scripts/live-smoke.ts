import {workspaceFor, snapshotFor, listIncidents, incidentDetail, newId} from '../src/server/db';
import {generate} from '../src/ai/service';
import {budgetStatus} from '../src/server/budget';
import {writeFileSync, mkdirSync} from 'node:fs';
const workspace = workspaceFor();
const incident = listIncidents(workspace.id).find(i => i.sourceEventId === 'EVT001')!;
const snapshot = snapshotFor(workspace.id, incident.id);
console.log(JSON.stringify({stage: 'starting', apiFormat: process.env.DEEPSEEK_API_FORMAT || 'responses', budget: budgetStatus()}));
try {
  const result = await generate({workspaceId: workspace.id, incidentId: incident.id, expectedVersion: snapshot.version, action: 'assessment', idempotencyKey: newId(), ipHash: 'local-integration'});
  const detail = incidentDetail(workspace.id, incident.id);
  mkdirSync('output/private', {recursive: true});
  writeFileSync('output/private/live-smoke.json', JSON.stringify(detail, null, 2));
  console.log(JSON.stringify({stage: 'completed', ...result, risk: detail.assessments[0]?.result.riskLevel, budget: budgetStatus(), artifact: 'output/private/live-smoke.json'}));
} catch (error) {
  console.error(JSON.stringify({stage: 'failed', code: error instanceof Error ? error.message : 'UNKNOWN', budget: budgetStatus()}));
  process.exitCode = 1;
}
