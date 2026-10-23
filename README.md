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

A four-step bar under each airport's title shows where you are: read the situation, run the analysis, decide, then share and record. The dark card on each screen is the next thing to do.

1. Choose an airport on **Choose an airport**, or create a new incident. Each row shows the current assessment's risk; an unassessed version stays neutral.
2. Read **Situation** and **Evidence** on the airport page. Use **Edit incident** to change facts; select a source badge to inspect its original record. Monthly history does not establish current flight status.
3. Select **Start analysis**. A focused progress screen replaces the page until the result is ready. Switching airports keeps each request separate.
4. After analysis, the airport page leads with **Assess & decide** (risk level, who decides, the next recommendation and your progress) beside **Situation**, **Evidence**, **Messages**, **Ask AeroContext** and **Record & export**.
5. In **Assess & decide**, review one recommendation at a time; the list beside it shows every recommendation and its decision. Choose Accept, Modify, Reject or Pending, then save the review; Modify and Reject require a reason. Pending advances to an unreviewed card without counting as a completed decision. Each saved decision advances to the next unfinished recommendation. Once every recommendation has a saved Accept, Modify or Reject decision, the airport page shows a completion banner offering **Reassess** or **Modify a decision**. Choosing Modify reopens the decision list; saving the revision returns to the completion prompt. **Back to [airport]** exits at any time, and reopening resumes the first unfinished review.
6. Inspect or edit the three audience drafts in **Messages**. Discuss new information in **Ask AeroContext**. **Apply and reassess** explicitly creates a new version from a proposed fact, which remains unverified until reviewed in the incident editor.
7. Open **Record & export** for the preserved versions and review history, complete JSON export, and printable report. Editing incident facts returns that version to Situation and Evidence until it is analyzed again.

The completion banner appears only after all recommendations in the current assessment have decisions, including when the final decision is Accept. It is derived from saved reviews, so it remains available after refreshing or returning to the airport page. **Reassess** starts analysis with the latest saved feedback; **Modify a decision** opens the existing decisions without starting an AI request or deleting feedback. The same completion check applies to reviews saved from **Record & export**. You can also run a reassessment through **Situation → Run analysis again**. Each request includes the latest saved review for each original assessment/recommendation, its original wording, and its incident version. Current-version reviews come first; older-version reviews are labeled historical context. The model is asked to explain material changes or why a suggestion cannot be adopted. Saving a review alone does not start a paid request.

Reviews remain separate from verified reports and cannot change the computed risk, source reliability, or safety restrictions. Acceptance is not proof that an action occurred, and unknown outcomes stay pending. Original assessments and review records are preserved. Request metadata records the included review IDs, source versions, content hash, and omitted count. Feedback context is limited to 24 complete reviews and 48,000 UTF-8 bytes of review entries; excess records remain in history and are not cut mid-sentence. Saved reviews are included in assessment requests, not automatically in **Ask AeroContext** requests.

Feedback has two stages. **Assess & decide** records the decision, its reason and optional revised recommendation. **Record & export → Record outcomes** lets users add the action actually taken, an observed simulation outcome and improvement notes later, including for earlier assessments. The completion banner and previously reviewed decision cards also link to follow-up. Unknown outcomes remain pending and do not block reassessment; a pending decision remains unfinished. Editing starts from the latest saved review and preserves fields belonging to the other stage. Every save appends a revision, retaining earlier feedback.

Revised recommendation wording is stored separately from the final action taken. Legacy records remain unchanged; if an older modified review used its final-action field for a proposed change, the follow-up form asks the reviewer to confirm what actually happened. Existing review payloads remain readable without a database migration.

Report applicability uses an inclusive ±30-minute window around the scenario time. Supported times include 24-hour and AM/PM clocks, Chinese/English simulation days, and calendar dates (with optional explicit UTC offsets). A report with only a clock time uses the scenario's day and timezone; give an explicit day/date for reports across midnight. Explicit days/dates must be compatible, and dated times must either both specify UTC offsets or both omit them. Ambiguous periods and ranges retain the existing exact-text match. Reliability, verification, source independence, and safety rules are unchanged.

The interface follows the device's light or dark setting; the switch in the sidebar can pin either one.

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


### Validation and recovery

Model output is checked before saving. JSON/schema, incident scope, policy risk and stop flags, action types, source/rule/metric identities, and demonstrated numeric contradictions remain mandatory on both attempts. Privacy rejection remains immediate. The competition policy, report reliability checks, and ±30-minute report window are unchanged.

Ambiguous message-sending claims, figures present in supplied evidence but needing citation/label review, and presentation issues become review notes. One repair is requested first. A second completed response may be saved with these notes only if every blocking check passes; notes identify the affected field and preserve an excerpt. The remaining prose check flags claims that messages were sent; demonstrably unsupported figures still fail. Prose phrase matching no longer checks operational instructions, blanket weather causation, safety-decision wording, or unconfirmed official flight status. Those statements may pass prose validation; model instructions and structured policy checks still apply, and human review remains necessary. Validation does not prove semantic correctness or absence of hallucination.

Review notes are server-generated, stored atomically with the result in its AI-run metadata, returned with assessments/discussions, visible in the workspace and history, and retained in JSON exports/print. The decision flow labels affected actions “Accept after review.” Missing simulation/draft notices are supplied by the display/copy layer without rewriting saved model prose. The last valid assessment is preserved when both attempts fail. No additional model call beyond the existing single repair is introduced.
