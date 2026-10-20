# 航衡 · AeroContext

A bilingual incident-review prototype for HackSHSID Track 3. It uses the supplied **simulated** airline dataset, inspectable evidence, an explicit risk policy, and DeepSeek Flash to prepare assessments and three audience-specific drafts for human review.

## Run locally

Requires Node.js 24 and npm. Native SQLite may require compiler tools if your platform has no prebuilt package.

```sh
npm ci
cp .env.example .env.local
```

Set `DEEPSEEK_API_KEY` in `.env.local` and set `SESSION_SECRET` to a random string. Never commit that file. The existing local installation already has these configured.

```sh
npm run dev -- --port 3000
```

Open [AeroContext locally](http://127.0.0.1:3000). The launch command supports the existing environment proxy through Node's `--use-env-proxy`. It does not change system proxy settings.

Internal identifiers keep the earlier `runway` prefix (session cookie, browser storage keys, database file, Docker volume, package name) so existing sessions and data keep working.

The database is created automatically at `runtime/runway.sqlite`, using the versioned migration. Each browser receives an isolated workspace through an HttpOnly cookie. Keep this directory to preserve history and API budget accounting. Run one application server per database.

For a local production build, stop the development server, then run `npm run build && npm start`. The launcher uses the same database and copies the static assets into the standalone bundle.

## Try the workflow

1. Open a supplied incident or create a new simulated event.
2. Inspect source records in **Evidence**. Monthly history does not establish current flight status.
3. Add current reports with their applicable period, reliability, and verification basis. Reports marked unverified are kept as context.
4. Select **Assess incident**. DeepSeek produces English and Chinese assessments and three drafts. Click any source badge to inspect its record.
5. Record a recommendation review, including a reason for modifications or rejection.
6. Discuss new information. **Apply and reassess** explicitly creates a new version from a proposed fact. The proposal remains unverified until reviewed in the incident editor.
7. Inspect **History & review**, download the complete JSON, or print the report.

No messages are sent, and no operational flight decisions are executed.

## Verification

```sh
npm run data:import
npm run typecheck
npm test
npm run build
```

`npm run live:smoke` performs a paid, budget-accounted request with the configured key. Run it with the application stopped: both use the same single-process database. It stores a synthetic result in ignored `output/private/`.

The data importer verifies the source workbook hash, 192 monthly operation rows, twelve historical anomalies, four flagged weather rows, historical means, and peer-group calculations. Do not edit the source workbook to fix application behavior.

## AI configuration and cost

- Model: `deepseek-flash`; default thinking effort: `high`.
- Endpoint: `responses` by default. Set `DEEPSEEK_API_FORMAT=chat_completions` only for an explicitly selected compatibility run.
- Total request ceiling: 524,288 tokens, including input and generated reasoning/answer.
- Maximum generated tokens: 65,536 for assessment and 32,768 for discussion.
- Deadlines: 300 and 180 seconds respectively; at most one validation repair.
- The application keeps final answers and usage metadata. It discards reasoning content.
- Development allocation: ¥40; hosted allocation: ¥60. A request reserves enough for its output ceiling and one repair. Unknown interrupted usage retains the reservation.
- Resetting incidents preserves the spend ledger and request quotas.

This ledger covers this application's requests, not other spending on the provider account. High-versus-max experiments are a later milestone after the complete prototype workflow is verified.

## Production packaging

The Docker image uses a persistent `/app/runtime` volume and receives secrets at runtime. Configure `APP_ORIGIN` to the exact external origin (scheme, host, and port if applicable). Only enable `TRUST_PROXY=true` behind a trusted reverse proxy that replaces forwarded headers. Keep development traffic in `BUDGET_POOL=development`.

```sh
docker compose up --build
```

Docker is provided for reproducibility; its runtime and external hosting still require separate verification. The local prototype uses the Node process above.

## Project structure

- `src/domain`: canonical schemas, evidence retrieval, risk/authority policy, validation.
- `src/ai`: stateless endpoint adapters, generation, validation repair, usage accounting.
- `src/server`: workspace ownership, immutable snapshots, SQLite persistence and budget.
- `src/components`: bilingual browser workspace.
- `scripts/import-data.ts`: reproducible workbook import.
- `tests`: deterministic, persistence, and route regressions.
- `PLAN-HACK.md`: accepted scope and release criteria.
- `docs/IMPLEMENTATION.md`: verified milestones and remaining work.

The release evaluation, thinking-effort comparison, client presentation, and hosted demo are tracked separately from the working local build. Passing structural validation does not prove every model claim is semantically supported; the plan requires claim review and held-out evaluations.
