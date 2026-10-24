# AeroContext — current Track 3 plan and release status

Updated 24 October 2026 (GMT+8), input/context visibility edition built on `27f5ec9`. This replaces the October 20 implementation targets with current decisions, recorded outcomes and remaining release work. The original plan remains in Git history; dated verification records are preserved.

## Goal and boundaries

Provide a bilingual incident-review workspace for a fictional Chinese domestic airline. The coordinator can enter an incident, inspect source evidence and historical context, review a risk assessment and three audience-specific drafts, record decisions/outcomes, reassess and export the history. The interface labels simulation and draft content. It neither operates aircraft nor sends messages.

Use the organizer's simulation workbook only. Live aviation/weather integrations, model training, autonomous operational tools and production deployment to a real airline are outside this prototype. Hosting was a project choice; the supplied eight-item checklist does not itself require a hosted URL. Submission uses the public GitHub repository and documented local setup; complete artifact-access and judge-machine checks remain separate.

## Implemented workflow

| Area | Current behavior |
|---|---|
| Incidents | All incidents / Choose an incident, five supplied seed events per workspace, new incidents and immutable snapshots. |
| Evidence | Airport/history-cutoff retrieval, exact source inspection, historical baseline/peer definitions and flagged missing weather. |
| Report applicability | Inclusive ±30-minute comparison for supported times; exact named-period fallback. Creation time remains distinct from applicability. |
| Assessment | Four risk levels; separate facts, assumptions, gaps, impact, ordered recommendations and RULE007/RULE012 restrictions. See the 17-field mapping in DATA-AND-RULES. |
| Messages and discussion | Bilingual Markdown, citations, highlights and separate simulation/draft boxes. Proposed facts require explicit application and remain unverified until reviewed. |
| Feedback | Accept, Modify, Reject or Pending; full reason/recommendation history. Outcomes can be recorded later. Pending decisions remain unfinished; pending outcomes do not block reassessment. |
| Reassessment | Latest saved reviews, original recommendations/reasons and version provenance; at most 24 complete reviews / 48,000 UTF-8 bytes. Omitted and historical context are explicit. |
| Export and retention | JSON/print with snapshot history; no inactivity reset or automatic server-data expiry. Cookie loss can lose access; explicit reset still clears incidents and preserves usage accounting. |
| Privacy | Input review before storage/provider submission, masking/correction or reasoned false-positive resolution. No Human Approval override and no model-output privacy filter. |

Risk, source reliability, professional authority, action stopping, official flight status and human review are separate. Source labels/independence groups are user-entered assertions, not independently authenticated facts. A supported risk rating never grants operational authority.

## Technical and model decisions

- Node.js 24, Next.js 16.4.2, React, TypeScript, next-intl, SQLite/better-sqlite3 and Drizzle. Lockfile and migrations are committed. Use one server process per database.
- DeepSeek `deepseek-flash`, Responses format, `high` effort is the live-tested configuration. Chat Completions compatibility exists but has no corresponding final live integration proof.
- Total request ceiling: **524,288 tokens**, including input and generated reasoning/answer. Assessment output allowance: **65,536**; discussion: **32,768**. Per-attempt deadlines: **300 / 180 seconds**. Headroom and conservative input accounting are implemented in `src/server/budget.ts`.
- At most one validation repair with the same configuration. JSON, scope, evidence/metric IDs, policy-aligned risk/constraints and demonstrated numeric contradictions remain blocking on both attempts. Some advisories may be retained after repair; they remain visible. Prior valid assessments survive failure.
- Four phrase-based prose checks were removed: professional operational commands, blanket weather causation, safety-decision actions and unconfirmed flight status. Prompt instructions and structured constraints remain, but they are not proof that all prose complies. The remaining sent-notification detector also has known false positives.
- Input privacy review is heuristic. A reviewer must not misuse False Positive to retain genuine personal information. Existing data is not retroactively rewritten.
- The app stores final results and usage, not provider deliberation. Current assessment/discussion prompt versions end in `2026-10-24-grounded-context-v1`.

See [data, rules and architecture](docs/DATA-AND-RULES.md) for calculation definitions, all twelve rules, output/feedback mappings and source hash; see the [risk card](docs/RISK-CARD.md) for human responsibilities and known limits.

## Evaluation and accepted decisions

| Work | Current status |
|---|---|
| 15 supplied cases, English and Chinese | Original and same-fixture rerun completed. Each has 30 variants (two privacy checks without model calls) and 32 model-backed steps including four baselines. |
| Ten unseen scenarios, both languages | Expectations frozen before execution. Twenty final variants plus two baselines; cases are now disclosed rather than future holdouts. |
| Reply-quality fixes | Historical/feedback/time-window/grounding context added. Rerun kept three quality failures and increased repairs, advisories, latency and cost. Remaining limits accepted; no claim all defects were fixed. |
| Fresh feedback examples | User chose synthetic examples: five records, all four dispositions, seven revisions and two later simulated outcomes. D05 reassessment failed after its single repair; earlier assessment/reviews preserved. |
| Practical-value measurement | Manual-versus-app timing and basic-prompt comparison intentionally skipped. No measured time savings or basic-prompt superiority claim. |
| Thinking-effort comparison | High/max intentionally skipped; no conclusion about max being better, worse or unnecessary. Keep high. |
| Standalone B787 package | Intentionally skipped. Original development incident/evaluation retained; not an untouched final holdout. |
| Automated and browser checks | Current input/context update: 379 tests, TypeScript, Webpack and bilingual/narrow browser checks passed. Default Turbopack hit the worker-port restriction. Earlier default-build and full-workflow checks remain dated evidence, including two accepted focus/print limitations. |

[Evaluation results](docs/EVALUATION.md) give exact denominators, failures, repairs, advisories, latency, cost and provenance. Application acceptance is not equivalent to factual correctness. Reviews are project evaluation records, not an independent human panel. Extra bilingual/unseen counts were project commitments, not separate organizer-mandated counts.

## Eight required materials

All eight items from workbook sheet `12_提交材料检查表` are available in the public repository and release assets. This does not establish portal submission.

| ID | Material | Current artifact |
|---|---|---|
| D01 | Client presentation | Owner-approved ten-slide editable deck, matching PDF and speaker script. |
| D02 | Assistant prototype | Current source with input/context visibility, local launch instructions and the earlier recorded UNSEEN02 real-model walkthrough. |
| D03 | Event test report | Supplied original/rerun and unseen matrices, replies, failed candidates, changes and limitations. |
| D04 | Data and rules | Provenance, calculations, current-window/reliability policy, rules and architecture. |
| D05 | Feedback records | Fresh synthetic records in Markdown/CSV/JSON, including the failed reassessment. |
| D06 | Risk card | Simulated-use scope, actual controls, semantic/validation/privacy limits and human responsibilities. |
| D07 | Implementation roadmap | Demonstrated prototype separated from future shadow pilots, validation and authorized integrations. |
| D08 | Reproducibility | Exact source, lockfile, migrations, workbook, environment template, tests, evidence and SHA-256 manifest. |

A thirteen-page technical report consolidates D02/D03/D04/D06/D07. See [the artifact index](docs/SUBMISSION.md) for filenames and current local locations.

The promo/demo video was completed by Claude and watched/approved by the owner on October 24. Its README describes real app captures, a later live assessment and separate-copy demonstration entries. That recording is not part of the frozen evaluation totals and does not replace fresh-install verification.

## Remaining release work

1. **Verify submission access.** The owner has made the repository public. Check the repository, D01–D08 and video downloads from a signed-out browser.
2. **Complete the event portal submission and retain confirmation.** Use the repository URL, project description, poster, test evidence and AI-use statement; rehearse the demonstration.
3. **Record verification limits accurately.** Fresh judge-machine real inference/restart/export, uncached installation and Docker execution remain unverified. Existing model evidence is dated, not a guarantee of a future run. No hosted service is claimed.
4. **Keep the approved scope.** Input-limit consistency and context visibility are implemented; the documented local setup is retained. The quota removal and six-request limit remain as in `27f5ec9`. Additional app changes or paid reruns require a separate decision.

See [submission materials](submission/README.md) and [publication verification](submission/PUBLICATION-VERIFICATION.md).

## After the hackathon

A supervised shadow pilot would need authenticated data sources, explicit access/retention controls, qualified human reviewers and independent evaluation. Proposed benefit is easier inspection of evidence and reviewer judgment; measured time/quality gains would require genuine participant exercises. No airline integration, real-world safety certification or autonomous operational authority is claimed.

## Source and evidence record

- Organizer [Track 3 problem statement](HackSHSID%202026/Track%203%20Problem%20Statement.pdf) and [workbook](HackSHSID%202026/Track%203%20Data.xlsx), especially the rules, test questions and submission checklist.
- Application contracts/policy/validation in `src/domain`, request context/provider handling in `src/ai`, persistence/privacy/usage accounting in `src/server` and regressions in `tests`.
- Current [evaluation](docs/EVALUATION.md), [implementation evidence](docs/IMPLEMENTATION.md), [risk card](docs/RISK-CARD.md) and [submission index](docs/SUBMISSION.md).
- [October 20 local verification](docs/LOCAL-VERIFICATION.md) and [dated design QA](design-qa.md) retained as checkpoint evidence. Their counts and pending milestones are not current-release status.

Competition requirements, implemented prototype choices, measured results and proposed future work are kept distinct. The October 20 plan's fourteen-day retention proposal, mandatory high/max/baseline experiments and other unimplemented targets are superseded by the current behavior and explicit decisions above.
