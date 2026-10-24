# Local prototype verification — October 20, 2026

> Historical checkpoint, preserved as recorded. The test counts and pending items below describe October 20 and are not the current release checklist. For October 24 results and remaining limitations, see [EVALUATION.md](EVALUATION.md), [IMPLEMENTATION.md](IMPLEMENTATION.md) and [SUBMISSION.md](SUBMISSION.md).

This report records observed software behavior. All incident content is simulated. The browser walkthrough and its review record were entered by the development agent, not an independent operational reviewer.

## Environment and data

Node 24.15.0; Next.js 16.4.2; React; next-intl; SQLite through better-sqlite3 and Drizzle. DeepSeek Flash used the Responses endpoint at high effort, with a 524,288-token total ceiling, 65,536 generated-token assessment limit, and 32,768 generated-token discussion limit.

The immutable workbook import passed its hash and calculation checks: 14 worksheets, 471 source records, 192 monthly operation records, twelve historical anomalies, four flagged weather rows. Historical means use up to twelve preceding available months, and the supplied first-month initialization and self-inclusive peer means are preserved.

## Browser walkthrough

1. Created **Linjiang afternoon weather review**, a new scenario outside the five supplied events. Added a reviewed fictional forecast, its report timestamp, and its applicable period.
2. Generated a real bilingual medium-risk assessment and three audience-specific drafts. The app did not invent official flight status.
3. Opened the current-report citation and inspected its exact text, time, provenance, and verification basis.
4. Recorded a modified recommendation review with a reviewer alias, reason, final action, improvement, and pending outcome.
5. Changed the prompt and validator to remove internal field names from reader-facing explanations; reassessed the same incident without changing its risk.
6. Submitted a Chinese discussion question containing an unverified gate-capacity claim. The response proposed a fact and left the incident unchanged.
7. Selected **Apply and reassess**. The app created version 2 with the new claim marked unverified/context and preserved medium risk.
8. Reloaded the page, reopened version 2 and version 1 history, and downloaded the full JSON export.
9. Restarted from the development server into the production standalone build. The same incident and history remained available.
10. Edited the English passenger draft. The edit persisted and the Chinese version showed the translation-review warning.

The inspected 390-pixel layout had `documentWidth === viewportWidth === 390`. A 1280-pixel evidence view was also inspected. This is not a complete accessibility audit.

## Measured early integration results

The first five user-initiated AI actions all completed after validation: four assessments and one discussion. They required **nine provider attempts** because four actions used the single permitted repair.

| Action | Prompt | Attempts | Provider time, summed | Accounted cost |
|---|---|---:|---:|---:|
| Supplied Hailing scenario smoke test | v1 | 2 | 114.139 s | ¥0.263298 |
| New Linjiang assessment | v1 | 1 | 60.430 s | ¥0.155317 |
| Same-input explanation improvement | v2 | 2 | 77.436 s | ¥0.187514 |
| Chinese discussion | v2 | 2 | 67.923 s | ¥0.157253 |
| Linjiang version 2 reassessment | v2 | 2 | 77.680 s | ¥0.189336 |

Total for these five actions: **¥0.952718**, according to returned token usage and the app's configured pricing. Provider time is not a timed end-user workflow measurement.

The v3 citation-schema follow-up subsequently completed on its **first attempt**, with no validation issues, in 69.317 seconds of provider time at ¥0.194481. The six-action development total is **¥1.147199**. One successful follow-up is not enough to estimate a general first-attempt success rate. Its saved output is `evals/development/citation-schema-followup.json`.

Most repairs addressed missing `REPORT:` prefixes in citation IDs. One also rejected a factual weather claim against a missing-weather row. Invalid intermediate prose was not saved as an assessment; validation issue descriptions and usage metadata were retained. These five actions are development integration evidence, not the final benchmark or a high-versus-max comparison.

## Genuine improvement records

- `evals/development/improvement-before.json`: original output containing internal implementation identifiers in its explanation.
- `evals/development/improvement-after.json`: v2 output for the same incident, with ordinary operational wording and unchanged medium risk.
- `evals/development/browser-workflow.json`: downloaded simulation export containing three assessments, one discussion, two incident versions, and the QA review at the time of download. The subsequent draft edit is in the local database.
- v3 constrains citation arrays to the available evidence/rule/metric IDs in the generation schema. Its live follow-up is recorded separately; do not count it as part of the five-action table.

The before/after wording change was motivated by an observed output, not an injected defect. Citation repair frequency is a second observed implementation issue. Neither result establishes general semantic accuracy.

## Automated and packaging checks

The suite covers data calculations, risk/authority separation, out-of-period evidence, source provenance, ownership, stale writes/completions, bounded repair, failed-output preservation, conservative unknown-usage charging, quotas, reset accounting, cross-origin writes, personal-data rejection, and historical-source access.

`npm run typecheck`, all **28 tests**, and `npm run build` pass at the current checkpoint. Production output contains the migration and excludes local environment files, databases, original ZIP/PDF attachments, and private output directories. Browser console inspection after the final production reload returned no warnings or errors.

Full public/holdout release gates, independent claim review, a real compatibility-endpoint request, live cancellation/restart failures, print-layout QA, Docker execution, and external hosting are pending.
