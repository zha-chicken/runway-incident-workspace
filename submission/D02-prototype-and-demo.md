# D02 — AeroContext prototype and recorded demonstration

**Application edition:** 24 October 2026 input/context visibility update, built on `27f5ec9`, repository `zha-chicken/runway-incident-workspace`. Run from the repository root or the extracted D08 root. [The update](INPUT-CONTEXT-UPDATE.md) and D08 source manifest identify the exact app/test files; configuration, data and dependencies are unchanged. Recorded model examples retain their original checkpoints.

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

The current edition passed 379 automated tests, TypeScript, a Webpack production build and isolated English/Chinese browser checks. The default-build attempt hit an environment worker-port restriction; use `npm run build -- --webpack` if that restriction occurs. Earlier `8ad14e3` and `27f5ec9` results retain their original test counts and build outcomes. Fresh judge-machine real-inference/restart/export and Docker remain unverified. The repository is public and the owner-approved video is linked in the submission index; complete signed-out artifact checks remain separate.

There are no application daily workspace/IP quotas or spending caps. Up to six model requests may run concurrently across the database; provider limits still apply. Accounting, token ceilings, timeouts and the single repair remain. Browsing recorded outputs does not require a provider key; generating a fresh reply does. Never use a live incident database for a test installation.
