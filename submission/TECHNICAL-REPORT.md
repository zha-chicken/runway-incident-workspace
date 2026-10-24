# AeroContext — Technical report

Track 3 | 24 October 2026 | application code 27f5ec9

This report combines the current prototype, dated evaluation, data/rules, risk card and roadmap. The editable presentation, synthetic D05 records and D08 archive accompany it. [Acknowledgements and AI-use statement](../ACKNOWLEDGEMENTS.md).

# D02 — AeroContext prototype and recorded demonstration

**Application code:** `27f5ec9278a5ac4eb1700fc9843f9ff883b19808`, repository `zha-chicken/runway-incident-workspace`, prepared 24 October 2026. Run from the repository root, or the extracted D08 root. App code, tests, configuration and data match this commit; publication documentation is refreshed and listed separately in the package provenance. Recorded model examples remain tied to their original checkpoints.

AeroContext is a bilingual incident-review prototype for a fictional airline. It connects incident information, historical evidence, rule-based risk, generated explanations and communication drafts, reviewer decisions, later outcomes and version history. It does not dispatch aircraft, contact passengers or emergency services, or publish messages.

## Start locally

Use Node.js **24.x**, npm, and a platform capable of installing `better-sqlite3` (native build tools may be needed if a prebuilt binary is unavailable). Commands below run at the repository root, or the extracted ZIP root. Dependencies are pinned by `package-lock.json`; Internet access is needed on an uncached installation.

```sh
npm ci
cp .env.example .env.local
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Put that generated random value in `SESSION_SECRET`. Set your own `DEEPSEEK_API_KEY`. Keep `DEEPSEEK_API_FORMAT=responses` and `DEEPSEEK_EFFORT=high` for the tested configuration. Use a new `DATABASE_PATH=runtime/submission-review.sqlite`, `APP_ORIGIN=http://127.0.0.1:3010`, `TRUST_PROXY=false`. Do not point the package at an existing database. Keep `.env.local` private.

```sh
npm run data:import
npm run typecheck
npm test
npm run build
PORT=3010 npm start
```

Open **http://127.0.0.1:3010** exactly. Keep browser origin, port and `APP_ORIGIN` identical; switching between localhost and 127.0.0.1 can trigger `ORIGIN_REJECTED`. For development, use `npm run dev -- --port 3010`. The server creates a new SQLite database and applies the included migrations on first use. Use one server process per database. Keep the same browser cookies and database path across restarts to access the same workspace.

Only assessment/discussion buttons call the model and incur provider usage. Do not run `npm run live:smoke` against your personal workspace: it makes a real paid call. The source includes a Dockerfile, but Docker has not been verified for this delivery; the commands above are the documented path.

## Recorded real-inference walkthrough

This walkthrough uses **UNSEEN02-en**, frozen before the October 24 unseen evaluation. It was unseen at test time; it is now a recorded example, not a new holdout. Exact inputs and both-language outputs are in `evidence/unseen/cases/UNSEEN02-en/definition.json` and `outputs.md`; individual provider message outputs accompany them.

1. Open **All incidents → New incident**, choose QING, title “Gusts and expanding support shortage”, scenario `Simulation Day 42, 18:00`, history through `2025-04`. Leave official flight status unconfirmed and safety/source-reliability stop flags off.
2. Enter the two fictional reports from `definition.json`: **U02-WIND**, strong gusts, applicability and reporting time **17:45**; **U02-SUPPORT**, equipment shortage expanding to a second stand cluster, **18:20**. Both are team simulations with separately attributed origins/groups, fictional verification bases and `human_verified` reliability. They are not real operational reports.
3. Analyze. Both reports lie inside the ±30-minute window. Two independent signal types plus expansion produce policy **high**. Historical anomalies do not themselves cause this rating. No official flight delay is established.
4. Inspect the rationale, report/rule citations, verification gaps and three drafts. The recorded reply recommends referral, verification, monitoring and draft preparation; these are proposals, not performed actions.
5. In the recorded run this request returned HTTP 200 after one provider call: **100.62 seconds**, **CNY 0.176188** application estimate. It had qualitative notes; success does not prove every sentence or future run correct. See its evaluation record.
6. For an interactive demonstration, record a disposition for each recommendation, retaining reasons; choose **Pending** when undecided. After every recommendation has a saved Accept, Modify or Reject decision (Pending remains unfinished), use the banner to modify a decision or reassess. Record simulated outcomes later, then inspect history and export JSON/print. This part is a suggested demonstration sequence, not a claim that UNSEEN02 performed each step.

The separate D05 example demonstrates saved feedback/revisions, but its reassessment failed after one repair and left the prior assessment intact. Successful reassessments exist in supplied TEST014 and unseen UNSEEN09; use their full recorded outputs when explaining those outcomes. Any new live demonstration is stochastic and chargeable.

## Access and verification limits

The `27f5ec9` checks passed 351 automated tests, TypeScript and a Webpack production build. Earlier `8ad14e3` checks passed 345 tests and the default build; the latest default-build attempt hit an environment worker-port restriction. Use `npm run build -- --webpack` if that restriction occurs. A fresh judge-machine real-inference/restart/export workflow and Docker remain unverified. The owner-approved video is linked in the submission index; source and material access become public when the owner changes repository visibility.

There are no application daily workspace/IP quotas or spending caps. Up to six model requests may run concurrently across the database; provider limits still apply. Accounting, token ceilings, timeouts and the single repair remain. Browsing recorded outputs does not require a provider key; generating a fresh reply does. Never use a live incident database for a test installation.


---

# D03 — Event test report

Release context: app code is now `27f5ec9`; this report preserves the evaluations through `8ad14e3`. The later quota change was tested separately (351 automated tests), with no new model evaluation claimed.

**Scope:** recorded evaluation of AeroContext through application commit `8ad14e3`, 24 October 2026. All test incidents were fictional and all model runs used isolated databases. Live incidents/chats and the original evaluation files were preserved. The archive includes full final replies, both failed reply attempts when available, exact fixtures, expectations, matrices and usage summaries. Provider deliberation and transport credentials are excluded from the distribution.

## Design and definitions

The organizer supplied 15 questions in workbook sheet `08_测试问题`; the project tested each in English and Chinese. The bilingual count, additional ten unseen scenarios and choice of `high` are project commitments, not mandatory counts in the organizer's checklist. A variant denotes the language of the request; a response can itself contain both languages. The 30 supplied variants include two privacy checks with no model call and 28 final model-backed tasks. Four baseline assessments make **32 model-backed steps**. The unseen evaluation has 20 final variants plus two baseline assessments, or **22 steps**.

A **usable result** means the application accepted a response. It does not mean the content is free from unsupported claims. A **repair** is the existing single additional provider attempt after a validation issue. **Review required** means an accepted result retains nonblocking advisories. Quality verdicts separately consider logic, evidence support, unsupported claims and proposed facts. They are recorded project reviews, not an independent human panel or a separate model-judge experiment.

## Results

| Measure | Supplied original | Supplied after fixes | Unseen scenarios |
|---|---:|---:|---:|
| Final language variants | 30 | 30 | 20 |
| Model steps, including baselines | 32 | 32 | 22 |
| Accepted model steps | 32/32 | 32/32 | 21/22 |
| Usable final model replies | 28/28 | 28/28 | 19/20 |
| Provider calls | 44 | 50 | 29 |
| Steps needing repair | 12/32 | 18/32 | 7/22 |
| Validation passed / review required / blocked | 30 / 2 / 0 | 27 / 5 / 0 | 18 / 3 / 1 |
| Retained advisories | 6 | 16 | 7 |
| Quality: pass / notes / fail / no result | 19 / 7 / 4 / 0 | 13 / 14 / 3 / 0 | 2 / 14 / 3 / 1 |
| Median step latency, seconds | 67.741 | 81.907 | 69.273 |
| App-estimated cost, CNY | 4.894533 | 5.553762 | 3.420530 |

Supplied quality totals include the two non-model privacy variants; latency covers model-backed steps including a repair where needed. Costs use the app's accounting formula, not verified provider invoices. Calls and costs include baseline steps. Samples are small and runs are stochastic; no statistical superiority is established. The supplied rerun reduced counted quality failures from four to three but increased repairs, advisories, latency and cost. It did not demonstrate an overall improvement on every measure.

## Four targeted defects and what actually happened

The patch supplied computed historical baseline/anomaly summaries, explicit feedback context, report-period matching explanations, and shared grounding/conditional-reasoning instructions. It preserved risk calculation, reliability, safety restrictions, JSON contracts, storage and repair behavior.

| Area | Rerun finding | Status |
|---|---|---|
| Historical interpretation | TEST007-en still described July 2024's six preceding months as a 12-month baseline. The original YUN false claim did not recur, but the rerun omitted that discussion. | Known failure; no proof of comprehensive YUN explanation. |
| Feedback interpretation | TEST010-zh omitted supplied reason detail, blurred scenario history with saved reviews, and invented monitoring. | Known failure. |
| Time-window explanation | Correct current-window treatment in both language variants. | Passed in this rerun. |
| Unsupported passenger commitments | TEST012-zh still invented ongoing monitoring. | Known failure. |

The user accepted these remaining limitations and closed additional repair work. That decision does not turn failed replies into passes. A separate sent-notification phrase-check false positive remained outside the four-fix scope (TEST006-en and TEST015-zh); it is retained in the records.

## Unseen evaluation

Expectations were frozen before the calls at `2026-10-24T01:31:21.972Z`. Cases exercise current/stale reports, converging independent signals, professional/safety stops, partial history and cutoffs, conflicting sources, reviewer corrections and untrusted instructions. Definitions and per-case checks are in `evidence/unseen/frozen-plan.json` and `expected-results.md`. These cases were unseen when evaluated; they are now disclosed.

Three accepted replies failed qualitative review: **UNSEEN03-zh** and **UNSEEN04-en** made unsupported passenger-facing commitments to ongoing verification; **UNSEEN09-zh** inferred limited network impact from annual airport scale without sufficient evidence. **UNSEEN06-en** produced no usable result: the numeric validator rejected a legitimate peer/historical comparison and 4.57-point difference even after repair. The output is retained for inspection rather than hidden.

The Chinese UNSEEN10 fixture accidentally used the word for a mop where the English meant a towbar. Its provenance/instruction-isolation check remains informative, but it is not an exact bilingual noun comparison. Both UNSEEN09 variants preserved feedback; that does not remove the separate unsupported-claim failure in the Chinese reply.

## Feedback and browser evidence

D05 contains five synthetic feedback records, seven revisions and two later synthetic outcomes. Three provider calls cost an estimated CNY 0.433225. Initial high-risk assessment saved. Reassessment and its repair both used feedback but failed validation: an uncited fact, followed by nonexistent `REPORT:D05-SUPPORT-HEAD`. The previous assessment and all reviews remained intact. This is a persistence demonstration with a failed reassessment, not a successful complete feedback loop or real-user study.

Earlier browser verification used a controlled provider, not real model inference: nine attempts, six successful responses, two invalid JSON responses and one HTTP 429. It covered English/Chinese, 390-pixel layouts, keyboard paths, privacy review, decisions and later outcomes, reassessment, citations, Markdown, error/retry, JSON export and printing. Two accepted limitations remain: Escape can return focus to the page body after a dialog, and the skip link can appear/overlap in print. Browser checks were on the preceding UI source; the latest five-file change affected model context/domain tests, not UI layout.

## Automated verification and interpretation

Recorded `8ad14e3` checkpoint checks: **345 tests in 18 files**, TypeScript and default production build passed. Focused regressions passed; 50,176 period comparisons showed unchanged matching behavior, and 60 request comparisons preserved evidence/schema/provider settings. These checks establish program behavior within their fixtures, not semantic truth of model prose. No new paid calls were made while assembling this submission.

The application offers traceable evidence and structured review, with transparent failures. Human time savings and superiority over a basic model prompt were **not measured**: both practical-value experiments were intentionally skipped. The high-versus-max experiment and standalone B787 package were also intentionally skipped. Historical B787 development evidence is not an untouched final test set.

## Evidence index

- `evidence/supplied-original/`: baseline summary, 30-row matrix, original expectations, complete replies and attempted reply texts.
- `evidence/supplied-current/`: identical-fixture rerun, summary, comparisons, quality findings and current-source checks.
- `evidence/unseen/`: ten frozen scenario definitions, 20-row matrix, all final replies and blocked candidates.
- `evidence/feedback/reassessment-review.md`: failed D05 reassessment analysis; D05 files hold all required record fields.
- `evidence/browser/`: dated controlled-provider UI verification and export/print checks.
- `evidence/MANIFEST.json`: original provenance, hashes and any distribution transformations.


---

# D04 — Data, rules and architecture

## Provenance and scope

Source: organizer-provided `Track 3 Data.xlsx` and `Track 3 Problem Statement.pdf`, included in `HackSHSID 2026/` at the repository root or the same path in D08. Workbook SHA-256: `571894e4d5ec64d661713c1f7e013f799f47356ccffe3e490cac73e1ae1cb5d6`. The importer refuses a different workbook until reviewed. The workbook describes fictional airports and scenarios, not live aviation operations; there is no live flight, meteorology or dispatch integration. Public sources mentioned by the organizer are background references, not evidence of such integrations.

The importer preserves sheet, row, original cells, evidence ID, source family, period and quality flags. It validates 14 sheets, 192 airport-month rows across eight airports (January 2024–December 2025), five supplied events, 12 historical anomalies and four weather-quality flags. Those flagged weather rows remain missing even if numeric cells are present: QING 2025-03, GAO 2025-09, HAI 2025-11 and LIN 2025-11. Original workbook values are retained alongside calculated checks.

## Calculations

For a month, the historical mean is the unweighted mean of up to the **12 preceding months** at that airport, excluding the current month. With no preceding month, January 2024 initializes from its own completion rate; it is not a measured prior-year baseline. One to eleven prior months form a partial baseline: July 2024 has six. A full baseline requires 12 preceding months. The change is `(completion − historical mean) × 100` percentage points; a result **≤ −5 points** triggers focused historical review, including exactly −5.

Peer mean uses airports in the same category and month, including the selected airport, without traffic weighting; category groups contain two or three airports. Completion and release-normality are distinct metrics. Historical shortfall is not evidence of weather causation or current incident high risk. Retrieval respects the selected airport/history cutoff; annual records are excluded until their period has ended. The model receives the underlying figures and citations plus compact computed interpretations, not replacement evidence.

## Current reports and risk

Applicability time is separate from report creation time. Exact matching labels are accepted. Recognized simulation-day or compatible dated times are compared in minutes; **−30 through +30 minutes inclusive** is current. Chinese/English formats and supported timezone offsets use the same comparison helper as policy. Ambiguous/unparseable periods retain the existing exact-label fallback. A missing `reportedAt` is an independence/verification gap and is not automatically the same as incident-level unknown source reliability.

Provenance and reliability are separate. A `team_simulation` report is not automatically discarded: a reviewer can give it `human_verified` reliability with a verification basis within the fictional scenario. It cannot pretend to be an immutable organizer `scenario_given` report. Current context-only or conflicted reports do not count as active reliable signals. In-scope conflicts prevent an unwarranted low-risk conclusion; stale conflicts remain context.

The deterministic policy derives usable evidence and a risk rating before the model writes prose. High requires corroboration across at least two originating reports, independence groups and active signal types, plus expanding impact and the required attribution/timing/basis fields. A single active usable signal yields medium. Supported stable current information without active/conflicting signals can yield low; otherwise the policy can return unable to assess. These are prototype heuristics, not calibrated probabilities or a certified operational risk model. Source independence is entered metadata, not externally authenticated.

Professional decisions and stop flags are distinct from risk. Maintenance release, dispatch, cancellation and other professional requests require authorized humans. Safety involvement, unknown source reliability or an explicit source stop condition stops action conclusions and requires gaps/referral. A high rating never itself authorizes an operational command.

## Organizer rule mapping

| Rule | Requirement and current implementation |
|---|---|
| RULE001 | Separate gaps/conflicts; verify provenance, time and scope; avoid unsupported certainty. Evidence and policy supply gaps; model prose still needs review. |
| RULE002 | Weather risk without formal status warrants checks/drafts, not certain delay claims. Official status is separately represented. |
| RULE003 | Inclusive five-point historical shortfall triggers focused review, not causal attribution. Importer and context calculate it. |
| RULE004 | Decline plus operational concentration warrants prioritized checks, not automatic rescheduling. |
| RULE005 | Passenger messages state confirmed facts/uncertainty, retain draft labels and require human approval. No send integration exists. |
| RULE006 | Preserve rejection, full reasons, original recommendation and subsequent feedback. Reassessment receives bounded saved review context. |
| RULE007 | Professional operational decisions remain human. Policy flags restrict recommendation kinds and require review. |
| RULE008 | Independent converging signals with expansion support escalation for human approval. Structured policy determines corroboration. |
| RULE009 | Cite evidence and metric/time scope for numeric/status claims. IDs and scoped metrics are checked; citation existence does not prove entailment. |
| RULE010 | Keep simulation/draft indicators. The app retains explicit notices, including separate rounded draft boxes. |
| RULE011 | Remove/anonymize personal information before storage/model submission. Input review offers masking, correction or reasoned false-positive resolution; no “human approval to keep personal data” bypass. |
| RULE012 | Stop action conclusions for safety or unassessable reliability and refer to humans. Deterministic constraints remain mandatory on both attempts. |

Rules are not wholly proven by deterministic checks. Four phrase-based prose restrictions were deliberately removed because of false positives; the prompt/policy still express professional-action, causation, safety and official-status boundaries. The remaining sent-notification phrase detector also has known false positives. No output personal-data detector remains. Input detection is heuristic; a false-positive decision can be misused and cannot establish compliance by itself.

## Architecture and request flow

Browser (Next.js/React, English/Chinese) → same-origin server routes → input privacy/schema review → versioned SQLite snapshot → airport/cutoff retrieval and deterministic policy → model request → JSON and evidence/constraint validation → at most one repair → accepted result with any advisories → human dispositions/outcomes/history/export.

Runtime uses Next.js 16.4.2, React 19, TypeScript, better-sqlite3, Drizzle, ExcelJS and Zod; Markdown is rendered with react-markdown/remark-gfm. Source and lockfile, migrations, tests and workbook are in D08. Secrets stay server-side in local environment configuration; provider calls use the DeepSeek API. Model: `deepseek-flash`, tested Responses format, `high` effort. Chat Completions compatibility exists but is not established by these live evaluations.

Assessment prompt: `runway-2026-10-24-grounded-context-v1`. Discussion prompt: `runway-discussion-2026-10-24-grounded-context-v1`. Stored run metadata captures versions, usage and validation. JSON schemas and deterministic policy remain the authority for structural constraints; the model explains supplied material and drafts proposed checks/messages.

Validation checks JSON structure, required bilingual fields, known/scoped evidence IDs, metric-source relationships, policy-aligned risk/constraints, permitted action kinds, required rules, unique action IDs, supported numeric claims and incomplete provider output. Blocking failures remain blocking after repair. Some citation/presentation advisories can be retained on the second attempt and surfaced for review. Unsupported numeric contradictions still block. Invalid JSON can trigger one repair; a second failure produces an error while preserving the last valid result. Provider errors/timeouts are handled separately; there is no unbounded retry loop.

## Feedback, persistence and privacy

Reviewer decisions and later outcomes are separate stages. Accepted does not mean executed; Pending does not mean approved; an unrecorded outcome remains unknown. Edits preserve existing details and prior revisions. Assessment requests include at most 24 review records / 48 KB, prioritize current version and label prior-version and omitted context. Scenario text describing a past assistant is not proof of stored assessment history. Discussion does not automatically receive saved reviewer records as reassessment context.

SQLite stores workspace-scoped incidents, snapshots, reports, valid assessments, chats, reviews and AI-run records. No automatic expiry deletion is promised. A browser cookie identifies the workspace and is renewed; clearing it can lose access even if records persist. Export before resetting; use a stable private `SESSION_SECRET`, database path and persistent volume. A later update invalidates stale promotion of an older model answer. Input privacy review prevents detected unresolved personal information from proceeding, but does not retroactively cleanse previously stored data.

Interpretation additions improve the material available to the model; the recorded failures show that correct inputs and valid citations cannot guarantee correct prose. See D03 and D06 for practical limits.


---

# D06 — AeroContext prototype risk card

**System/version:** AeroContext, `27f5ec9`; reviewed 24 October 2026. **Use:** supervised hackathon simulation for a fictional airline. **Not validated for:** live dispatch, maintenance, aircraft movement, emergency response, official flight status, compensation decisions or passenger publication.

| Risk / trigger | Existing control | Residual risk and responsibility |
|---|---|---|
| Unsupported claims and commitments | Scoped evidence, structured rationale, prompt grounding, numeric/reference checks, reviewable drafts | Three quality failures in the latest supplied run and three in unseen accepted replies. Operator must check prose against actual evidence; no “hallucination-free” claim. |
| False validator rejection | One bounded repair, retained advisories where permitted, old valid result preserved | UNSEEN06-en remained blocked despite a legitimate numeric comparison. Never silently treat a blocked response as accepted. |
| Safety or professional decision | Policy stop flags, human referral, constrained action kinds, simulation/draft labels | Phrase heuristics cannot understand all language; four prose checks were removed. No automated operational authority. Qualified humans apply actual procedures. |
| Fabricated or misleading citations | Known IDs, metric membership and scoped evidence validation | An existing citation can still be misinterpreted. D05 repair invented an ID and was rejected. Reviewer verifies support, not just clickability. |
| Unreliable or correlated reports | Explicit reliability, origin/group/basis/time fields, ±30-minute checks | Metadata is user-entered, not authenticated; copied reports can appear independent if mislabeled. Reviewers must establish provenance. |
| Wrong time/baseline | Single period comparator, history cutoffs, computed context and tests | Ambiguous formats use exact-match fallback; model can still call a six-month baseline 12 months. Inspect timestamps and baseline counts. |
| Personal information | Input detection, masking preview/correction, reasoned false-positive review; server-side key | Heuristic misses and false-positive misuse remain; output privacy filter removed. Never enter real sensitive data; configure retention/access before any real pilot. |
| Feedback misunderstood | Original recommendation/reason and revisions retained; pending and omitted context explicit | D05 reassessment failed twice; context is bounded. Rejection is not proof a replacement was executed. Human confirms a new accepted assessment. |
| Prompt injection or malicious text | Reports treated as evidence, immutable organizer provenance, scoped schema/policy validation | Defense is incomplete; successful synthetic tests do not prove robust isolation against all attacks. No external tools execute model proposals. |
| Lost access or unintended retention | SQLite persistence, workspace ownership, export, same-origin checks | Cookie loss can lose workspace access; no automatic retention purge. Owner manages backups, stable secret and database location. |
| Cost, delay and availability | Usage accounting, six concurrent requests, token caps, timeouts, single repair | Daily workspace/IP quotas and application spending caps removed by owner decision. Provider limits still apply. Unseen median 69.273 s; cost is app-estimated, not a bill. Owner monitors provider usage. |
| Accessibility/printing | Recorded bilingual desktop/narrow/keyboard/print exercises | Two accepted issues: dialog Escape focus to body, print skip-link overlap. Review the exported file and use navigation controls explicitly. |

## Human responsibilities and escalation

Treat every generated message as a draft. Verify report provenance, applicability, unknowns, citations, constraints and any official status before accepting a recommendation. Record why a recommendation is accepted, modified, rejected or pending; record outcomes only after an actual or explicitly simulated outcome. If safety/source reliability triggers a stop, preserve the stopped assessment and refer to a qualified human. Do not convert simulation text into operational instructions.

## Evidence and release posture

The quota/concurrency row reflects the later owner-approved quota update in `27f5ec9`; recorded evaluation results below remain tied to `8ad14e3` and were not rerun with real model calls.

See [the event test report](D03-event-test-report.md) for denominators, source locations and the distinction between earlier successful default-build verification and the later packaging worker-port restriction. The packaging Webpack build passed.

At the earlier `8ad14e3` checkpoint, 345 automated tests, TypeScript and the default production build were recorded as passing. The quota/concurrency update passed 351 tests, TypeScript and the Webpack production build; its default Turbopack build remained blocked by the worker-port environment restriction, including an elevated retry. The latest supplied run accepted all 32 model steps but had three qualitative failures; unseen testing accepted 21/22 steps and 19/20 final replies, with three quality failures among accepted replies. These are bounded demonstrations, not safety certification, measured business benefit or independent real-user validation.

The repository materials and approved video are prepared. The owner-controlled public visibility change, signed-out link check and portal submission remain. Fresh judge-machine inference/restart/export and Docker remain unverified. No live deployment or additional model call was made to prepare this card. The promo/demo video is completed and owner-approved; publication and judge access remain separate gates. [Submission index](README.md).


---

# D07 — Implementation roadmap

The prototype demonstrates a workflow for evidence-grounded discussion and human review. It has not demonstrated production readiness, quantified human time savings or better performance than a basic prompt.

| Stage | Deliverable / owner role | Exit evidence | Status |
|---|---|---|---|
| 1. Hackathon prototype | Development team: bilingual incident/evidence workspace, scoped history, policy, AI drafts, citations, feedback and export | Versioned source, 351 tests, TypeScript/Webpack build, dated browser and model evaluations | Implemented; recorded failures retained. |
| 2. Submission release | Project owner: make the repository public, verify judge links, rehearse and submit. Materials, acknowledgements, quota changes and the approved video are prepared. | Confirmed setup with real inference, restart/history/export, accessible links, final commit and portal receipt | Materials prepared; public visibility and portal submission remain owner actions. |
| 3. Supervised shadow pilot | Airline operations sponsor + privacy/security leads: define users, data contracts, retention, access controls and qualified escalation owners | Approved protocol; no operational execution; verified input provenance and trained reviewers | Proposed; no real-data access or partner commitment. |
| 4. Reliability and usability evaluation | Evaluation lead + independent domain reviewers: broader holdouts, false-positive/false-negative analysis, bilingual accessibility and actual-user exercises | Agreed thresholds for factual support, usable replies, stop accuracy, failure recovery, cost/latency and review burden | Proposed; thresholds require stakeholder agreement. |
| 5. Conditional integration | Authorized airline/airport owners: read-only feeds, provenance authentication and governance before any workflow integration | Audited data quality, rollback/incident response, monitoring, privacy approvals and explicit human sign-off | Future only; no autonomous dispatch or publication promised. |

## Value and its measurement

The intended value is a single inspectable chain from evidence to interpretation, suggested checks, draft communication and reviewer rationale. Existing measurements establish usable-result rates, repair overhead, qualitative limitations, latency, application-estimated cost and preservation behavior. They do not quantify human time saved or financial return.

Manual-versus-app timing and a basic-prompt comparison were intentionally skipped for this submission. A future pilot could compare matched tasks for completion time, correction burden and evidence-check accuracy, with genuine participants and a preregistered rubric. This is a future proposal, not a hidden outstanding experiment in the current package.

## Accepted limits and deferred decisions

The remaining supplied/unseen quality failures and D05 blocked reassessment were accepted for the hackathon prototype. Broader fixes should be prioritized from repeated failure evidence, not prompt additions for every phrase. Keep deterministic constraints and review responsibilities visible. No production deadline, airline partnership, measured savings or regulatory approval is claimed. Real deployments require a separate scope and approval.


## Acknowledgements and AI use

The project owner, zha-chicken, selected the scope and reviewed the application behavior, submission materials and approved video. OpenAI Codex and Anthropic Claude assisted with implementation, debugging, tests and documentation. Claude created the promo/demo video. Codex assisted with output review, evaluation records and publication preparation. Existing Git author attribution is preserved.

The application uses DeepSeek Flash with the high setting. Its policy and validation checks do not prove that every generated claim is correct. D05 decisions and outcomes are synthetic demonstrations, not independent participant observations. Recorded failed replies and known limitations remain in the evaluation evidence. No new model calls were made for publication.

HackSHSID supplied the Track 3 workbook and problem statement; the problem setters are Accenture. The data describes a fictional airline simulation. Public aviation sources in the brief are background references, not live integrations in this prototype.

The software stack includes Next.js, React, TypeScript, Tailwind CSS, Radix UI, next-intl, Lucide, better-sqlite3, Drizzle, ExcelJS, Zod and the unified/remark Markdown ecosystem; Vitest supports checks. OpenAI presentation tooling and ReportLab were used for the documents. The video creator reports synthesized music and interface sounds, with no third-party audio. See ACKNOWLEDGEMENTS.md and THIRD-PARTY-NOTICES.md at the repository or ZIP root for attribution and copied dependency notices.
