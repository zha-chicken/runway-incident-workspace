# 航衡 · AeroContext

A bilingual incident-review prototype for HackSHSID Track 3. It uses the supplied **simulated** airline dataset, inspectable evidence, an explicit risk policy, and DeepSeek Flash to prepare assessments and three audience-specific drafts for human review.

**Submission entry point:** [D01–D08 materials](submission/README.md) · [Technical report](submission/TECHNICAL-REPORT.pdf) · [Presentation](submission/D01-client-presentation.pdf) · [Demo video](submission/video/README.md) · [Reproducibility ZIP](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.zip)

Application code is pinned to `27f5ec9`. Read [acknowledgements and the AI-use statement](ACKNOWLEDGEMENTS.md), [evaluation results](docs/EVALUATION.md) and [publication verification](submission/PUBLICATION-VERIFICATION.md). The owner will make this repository public for submission; the links remain private until then.

## Run locally

Requires Node.js **24.x** and npm. Native SQLite may require compiler tools if your platform has no prebuilt package. The following installation commands are for a fresh checkout. On an existing installation, preserve `.env.local`, its `SESSION_SECRET` and the database rather than replacing them.

```sh
npm ci
cp .env.example .env.local
```

Set your own `DEEPSEEK_API_KEY` and a private random `SESSION_SECRET` in `.env.local`. Keep `DEEPSEEK_API_FORMAT=responses`, `DEEPSEEK_EFFORT=high` and `TRUST_PROXY=false` for the tested local configuration. Never commit this file. A fresh checkout needs its own configuration; the existing development installation already has one. Set `DATABASE_PATH` to a new file when creating an isolated test instance, and use one server process per database.

```sh
APP_ORIGIN=http://127.0.0.1:3000 npm run dev -- --port 3000
```

Open [AeroContext locally](http://127.0.0.1:3000). Keep `APP_ORIGIN` identical to the browser origin, including hostname and port; mixing `localhost` and `127.0.0.1` can cause `ORIGIN_REJECTED`. If the port is in use, reuse the intended server or choose a free port and update both values. The launch command supports an existing environment proxy through Node's `--use-env-proxy`.

Internal identifiers keep the earlier `runway` prefix (session cookie, browser storage keys, database file, Docker volume, package name) so existing sessions and data keep working.

The database is created automatically at `runtime/runway.sqlite`, using the versioned migration. Each browser receives an isolated workspace through an HttpOnly cookie. Keep this directory to preserve history and API budget accounting. Run one application server per database.

For a local production build, stop the development server for this checkout, then run:

```sh
npm run build
APP_ORIGIN=http://127.0.0.1:3000 PORT=3000 npm start
```

The launcher loads `.env.local`, uses the configured database, and copies static assets into the standalone bundle. The default Turbopack build passed at the earlier `8ad14e3` checkpoint. Verification of `27f5ec9` passed 351 tests, TypeScript and `npm run build -- --webpack`; its default-build attempt was blocked by the environment when a worker tried to bind a port. See [verification limits](docs/EVALUATION.md#automated-and-packaging-verification). Neither build result establishes external hosting or Docker readiness.

## Try the workflow

A four-step bar under each incident's title shows where you are: read the situation, run the analysis, decide, then share and record. The dark card on each screen is the next thing to do.

1. Open **All incidents → Choose an incident**, select an existing incident, or choose **New incident**. Each row shows the current assessment's risk; an unassessed version stays neutral.
2. Read **Situation** and **Evidence** on the incident page. Use **Edit incident** to change facts; select a source badge to inspect its original record. Monthly history does not establish current flight status.
3. Select **Start analysis**. A focused progress screen replaces the page until the result is ready. Switching incidents keeps each request separate.
4. After analysis, the incident page leads with **Assess & decide** (risk level, who decides, the next recommendation and your progress) beside **Situation**, **Evidence**, **Messages**, **Ask AeroContext** and **Record & export**.
5. In **Assess & decide**, review one recommendation at a time; the list beside it shows every recommendation and its decision. Choose Accept, Modify, Reject or Pending, then save the review; Modify and Reject require a reason. Pending advances to an unreviewed card without counting as a completed decision. Each saved decision advances to the next unfinished recommendation. Once every recommendation has a saved Accept, Modify or Reject decision, the incident page shows a completion banner offering **Reassess** or **Modify a decision**. Choosing Modify reopens the decision list; saving the revision returns to the completion prompt. **Back to [airport]** exits at any time, and reopening resumes the first unfinished review.
6. Inspect or edit the three audience drafts in **Messages**. Messages and Ask AeroContext render Markdown and retain citations; simulation/draft notices are displayed separately, and numeric highlights are presentation aids rather than proof of verification. Discuss new information in **Ask AeroContext**. **Apply and reassess** explicitly creates a new version from a proposed fact, which remains unverified until reviewed in the incident editor.
7. Open **Record & export** for the preserved versions and review history, complete JSON export, and printable report. Editing incident facts returns that version to Situation and Evidence until it is analyzed again.

The completion banner appears only after all recommendations in the current assessment have a saved Accept, Modify or Reject decision, including when the final decision is Accept. A Pending decision remains unfinished. It is derived from saved reviews, so it remains available after refreshing or returning to the incident page. **Reassess** starts analysis with the latest saved feedback; **Modify a decision** opens the existing decisions without starting an AI request or deleting feedback. The same completion check applies to reviews saved from **Record & export**. You can also run a reassessment through **Situation → Run analysis again**. Each request includes the latest saved review for each original assessment/recommendation, its original wording, and its incident version. Current-version reviews come first; older-version reviews are labeled historical context. The model is asked to explain material changes or why a suggestion cannot be adopted. Saving a review alone does not start a paid request.

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

Recorded current-source checks passed **345 tests in 18 files**, TypeScript and the default build. Packaging repeated the clean cached installation, data import, TypeScript and all 345 tests; its Webpack build passed, while its default-build attempt hit the worker-port restriction described above. These are recorded results, not checks rerun by this documentation update.

The supplied-test rerun accepted 32/32 model-backed steps but had three qualitative failures. Unseen testing produced 19/20 usable final replies, with three quality failures and one validator-blocked reply. The synthetic feedback example preserved its records but failed reassessment after one repair. See [the full results and denominators](docs/EVALUATION.md). Passing structural checks does not establish that every claim is supported.

## AI configuration and cost

- Model: `deepseek-flash`; default thinking effort: `high`.
- Endpoint: `responses` by default. Set `DEEPSEEK_API_FORMAT=chat_completions` only for an explicitly selected compatibility run.
- Total request ceiling: 524,288 tokens, including input and generated reasoning/answer.
- Maximum generated tokens: 65,536 for assessment and 32,768 for discussion.
- Deadlines: 300 and 180 seconds respectively; at most one validation repair.
- The application keeps final answers and usage metadata. It discards reasoning content.
- No application daily workspace/IP quotas or spending cap. Legacy `VISITOR_DAILY_LIMIT` and `IP_DAILY_LIMIT` settings are ignored. Provider-side limits still apply.
- At most **six concurrent model requests** across the application database, including all workspaces, actions and accounting pools. A seventh request receives `BUSY`; an existing request with the same idempotency key does not consume another slot.
- Usage accounting remains. `BUDGET_POOL=development` or `hosted` labels the ledger; it does not impose a cap. Request estimates include a possible repair, and unknown interrupted usage retains that estimate. The budget response uses `limit: null` and `remaining: null` to indicate uncapped usage.
- Resetting incidents preserves the usage ledger.

This ledger covers requests in this application database, not unrelated provider-account spending or a centrally enforced total across independent copies. Cost figures are app estimates, not verified provider invoices or current pricing quotations. The high-versus-max experiment was **intentionally skipped**; `high` remains the tested default. Manual timing and basic-prompt comparisons were also intentionally skipped, so no measured time-saving or superiority claim is made.

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

The supplied and unseen evaluations and eight submission materials are complete as local artifacts, with accepted limitations. The promo/demo video is complete and owner-approved; it is linked in [SUBMISSION.md](docs/SUBMISSION.md). The owner-controlled visibility change, portal submission and fresh judge-machine real inference/persistence/export remain open. The standalone B787 package was intentionally skipped. Dated reports such as [LOCAL-VERIFICATION.md](docs/LOCAL-VERIFICATION.md) and [design-qa.md](design-qa.md) preserve their original checkpoints rather than claiming to be current release evidence.


### Validation and recovery

Model output is checked before saving. JSON/schema, incident scope, policy risk and stop flags, action types, source/rule/metric identities, and demonstrated numeric contradictions remain mandatory on both attempts. Model output has no automated personal-data filter. New user input instead goes through the input privacy review described below. RULE011 remains in the supplied rules and model instructions. The competition policy, report reliability checks, and ±30-minute report window are unchanged.

Ambiguous message-sending claims, figures present in supplied evidence but needing citation/label review, and presentation issues become review notes. One repair is requested first. A second completed response may be saved with these notes only if every blocking check passes; notes identify the affected field and preserve an excerpt. The remaining prose check flags claims that messages were sent; demonstrably unsupported figures still fail. Prose phrase matching no longer checks operational instructions, blanket weather causation, safety-decision wording, or unconfirmed official flight status. Those statements may pass prose validation; model instructions and structured policy checks still apply, and human review remains necessary. Validation does not prove semantic correctness or absence of hallucination.

Review notes are server-generated, stored atomically with the result in its AI-run metadata, returned with assessments/discussions, visible in the workspace and history, and retained in JSON exports/print. The decision flow labels affected actions “Accept after review.” Missing simulation/draft notices are supplied by the display/copy layer without rewriting saved model prose. The last valid assessment is preserved when both attempts fail. No additional model call beyond the existing single repair is introduced.

### Workspace retention and current report scope

Workspaces are no longer reset after inactivity. The opaque session cookie is renewed on API access with a one-year lifetime; explicit workspace reset still clears incidents. Clearing or losing the browser cookie can make the old workspace inaccessible, so export records you need to retain. Server data is not automatically deleted when a cookie expires.

Official status requires a human-verified source with a timestamp, verification basis and applicable period within the same ±30-minute window (or exact named-period match). An older saved incident with an obsolete status source must be edited before a new model request; saved history is preserved. Out-of-window conflict reports remain background context and do not affect current conflict classification.

Ask AeroContext displays request failures beside the restored question and offers Retry. Printed assessments use their own snapshot's title, scenario time and recorded official status, even after the incident has a newer version.

### Input privacy review

Before saving or sending new text, the browser checks for common personal-data patterns: email addresses, phone numbers (including separated digits), identity numbers, labeled passport/bank-account numbers and labeled personal names. The server repeats the check at the API boundary. Detection is heuristic; it can miss information or raise false positives. It is not identity recognition.

Incident/report input, chat questions, human feedback, edited messages and applying proposed facts use the same review dialog. A detected match pauses submission before the application saves that input or sends it to DeepSeek. The dialog highlights the matches and offers:

- **False Positive:** keep the text unchanged after recording who reviewed it and why it is not personal information.
- **Data Masking:** preview replacement of detected spans only, then explicitly apply the masked text and continue. Other text, numbers and citations are retained.
- **Back to editing:** cancel the submission and keep the unsaved form text.

Human Approval is not available. RULE011 prohibits storing sensitive personal information; it must be masked or removed. False Positive is only for text that is not personal information, not permission to keep real personal data. The API rejects removed approval resolutions and override flags, including submissions from older clients. Historical approval records remain readable and are marked as no longer available; existing records are not rewritten.

Decisions are bound to the exact request content and route. Changing the text requires another review. Audit entries contain decision type, reviewer, reason, time, detector version, finding count and a content hash; detected private values are not copied into the log. For masked submissions, the original text is not transmitted and the finding count is client-reported. Audit entries appear under Record & export and in JSON exports. A chat privacy review records the submitted decision even if the subsequent model request fails. Audit entries are excluded from model context.

The additive SQLite migration adds a privacy-review table and preserves existing incident/chat records. Existing data is not retrospectively scanned or rewritten, and model output remains outside this input filter. Applying a model-proposed fact counts as new input and is reviewed then. There is no extra model call for detection or review.
