# Data, rules and architecture

Updated 24 October 2026 for application `8ad14e3`. This is the repository counterpart of submission material D04. [Evaluation](EVALUATION.md) and [risk card](RISK-CARD.md) record the limits of these controls.

## Provenance and scope

Source: organizer-provided `Track 3 Data.xlsx` and `Track 3 Problem Statement.pdf`, included in this repository under `HackSHSID 2026/`. Workbook SHA-256: `571894e4d5ec64d661713c1f7e013f799f47356ccffe3e490cac73e1ae1cb5d6`. The importer refuses a different workbook until reviewed. The workbook describes fictional airports and scenarios, not live aviation operations; there is no live flight, meteorology or dispatch integration. Public sources mentioned by the organizer are background references, not evidence of such integrations.

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

Runtime uses Next.js 16.4.2, React 19, TypeScript, better-sqlite3, Drizzle, ExcelJS and Zod; Markdown is rendered with react-markdown/remark-gfm. This repository contains the source, lockfile, migrations, tests and workbook; the D08 package preserves the tested commit. See [submission status](SUBMISSION.md). Secrets stay server-side in local environment configuration; provider calls use the DeepSeek API. Model: `deepseek-flash`, tested Responses format, `high` effort. Chat Completions compatibility exists but is not established by these live evaluations.

Assessment prompt: `runway-2026-10-24-grounded-context-v1`. Discussion prompt: `runway-discussion-2026-10-24-grounded-context-v1`. Stored run metadata captures versions, usage and validation. JSON schemas and deterministic policy remain the authority for structural constraints; the model explains supplied material and drafts proposed checks/messages.

Validation checks JSON structure, required bilingual fields, known/scoped evidence IDs, metric-source relationships, policy-aligned risk/constraints, permitted action kinds, required rules, unique action IDs, supported numeric claims and incomplete provider output. Blocking failures remain blocking after repair. Some citation/presentation advisories can be retained on the second attempt and surfaced for review. Unsupported numeric contradictions still block. Invalid JSON can trigger one repair; a second failure produces an error while preserving the last valid result. Provider errors/timeouts are handled separately; there is no unbounded retry loop.

## Feedback, persistence and privacy

Reviewer decisions and later outcomes are separate stages. Accepted does not mean executed; Pending does not mean approved; an unrecorded outcome remains unknown. Edits preserve existing details and prior revisions. Assessment requests include at most 24 complete review records / 48,000 UTF-8 bytes, prioritize current version and label prior-version and omitted context. Scenario text describing a past assistant is not proof of stored assessment history. Discussion does not automatically receive saved reviewer records as reassessment context.

SQLite stores workspace-scoped incidents, snapshots, reports, valid assessments, chats, reviews and AI-run records. No automatic expiry deletion is promised. A browser cookie identifies the workspace and is renewed; clearing it can lose access even if records persist. Export before resetting; use a stable private `SESSION_SECRET`, database path and persistent volume. A later update invalidates stale promotion of an older model answer. Input privacy review prevents detected unresolved personal information from proceeding, but does not retroactively cleanse previously stored data.

Interpretation additions improve the material available to the model; the recorded failures show that correct inputs and valid citations cannot guarantee correct prose. See [evaluation results](EVALUATION.md) and the [risk card](RISK-CARD.md) for practical limits.


## Required output mapping

| Supplied field | Stored representation |
|---|---|
| Event ID | Incident ID; source event ID where applicable |
| Generation time | Assessment `generatedAt` |
| Risk | `riskLevel` |
| Airport/time scope | `scope` and bound snapshot |
| Rationale | `rationale` with fact/assumption/unknown labels and citations |
| Possible impact | `possibleImpacts` |
| Assumptions | `assumptionsToVerify` |
| Information gaps | `informationGaps` |
| First action | `firstAction` |
| Subsequent actions | `subsequentActions` |
| Escalation conditions | `escalationConditions` |
| Required human decisions | `humanDecisions` and decision constraints |
| Operations message | `drafts.operations` |
| Airport coordination message | `drafts.airportCoordination` |
| Passenger draft | `drafts.passenger` |
| References | `evidenceReferences`, per-claim citations, and `ruleIds` |
| Output status | `outputStatus` |

Every narrative is stored in English and Chinese with shared canonical codes. Manual editing of one draft language flags the other language for translation review.


## Nine required feedback fields

| Organizer field | Stored review field |
|---|---|
| Incident | `incidentId` |
| Recommendation | `recommendationId`, bound to `assessmentId` |
| Disposition | `pending`, `accepted`, `modified` or `rejected` |
| Modification/rejection reason | `reason`; complete reason retained |
| Final action taken | `finalAction`; unknown until supplied |
| Outcome | `outcome` and `outcomeStatus` |
| Next improvement | `nextImprovement` |
| Reviewer | `reviewerLabel` |
| Review date | `reviewedAt` |

`revisedRecommendation` separately stores a proposed replacement; it is not the final action taken. Every edit appends a revision and preserves the other stage's fields. Pending decisions remain unfinished; pending outcomes can be recorded later without blocking reassessment. The new submission examples are synthetic and their failed reassessment is documented in [EVALUATION.md](EVALUATION.md).
