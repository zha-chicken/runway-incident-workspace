# Evaluation results and verification

Updated 24 October 2026. This repository summary corresponds to submission D03. Artifact paths such as `evidence/unseen/...` below are relative to the [submission directory](../submission/README.md); the curated files are included in this repository. The later promo-video recording is separate from these benchmark totals. No model call or application test was run during this documentation update.

**Scope:** original supplied tests used `7bde4c8`; the supplied rerun and unseen tests used working-tree code later committed as `8ad14e3`. [Source hashes and timing](../submission/EVALUATION-PROVENANCE.md) establish this distinction. These are recorded evaluations from 23–24 October 2026, not a new model evaluation of application `27f5ec9`. All test incidents were fictional and all model runs used isolated databases. Live incidents/chats and the original evaluation files were preserved. The archive includes full final replies, both failed reply attempts when available, exact fixtures, expectations, matrices and usage summaries. Provider deliberation and transport credentials are excluded from the distribution.

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

The project owner accepted these remaining limitations and closed additional repair work. That decision does not turn failed replies into passes. A separate sent-notification phrase-check false positive remained outside the four-fix scope (TEST006-en and TEST015-zh); it is retained in the records.

## Unseen evaluation

Expectations were frozen before the calls at `2026-10-24T01:31:21.972Z`. Cases exercise current/stale reports, converging independent signals, professional/safety stops, partial history and cutoffs, conflicting sources, reviewer corrections and untrusted instructions. Definitions and per-case checks are in `evidence/unseen/frozen-plan.json` and `expected-results.md`. These cases were unseen when evaluated; they are now disclosed.

Three accepted replies failed qualitative review: **UNSEEN03-zh** and **UNSEEN04-en** made unsupported passenger-facing commitments to ongoing verification; **UNSEEN09-zh** inferred limited network impact from annual airport scale without sufficient evidence. **UNSEEN06-en** produced no usable result: the numeric validator rejected a legitimate peer/historical comparison and 4.57-point difference even after repair. The output is retained for inspection rather than hidden.

The Chinese UNSEEN10 fixture accidentally used the word for a mop where the English meant a towbar. Its provenance/instruction-isolation check remains informative, but it is not an exact bilingual noun comparison. Both UNSEEN09 variants preserved feedback; that does not remove the separate unsupported-claim failure in the Chinese reply.

## Feedback and browser evidence

D05 contains five synthetic feedback records, seven revisions and two later synthetic outcomes. Three provider calls cost an estimated CNY 0.433225. Initial high-risk assessment saved. Reassessment and its repair both used feedback but failed validation: an uncited fact, followed by nonexistent `REPORT:D05-SUPPORT-HEAD`. The previous assessment and all reviews remained intact. This is a persistence demonstration with a failed reassessment, not a successful complete feedback loop or real-user study.

Earlier browser verification used a controlled provider, not real model inference: nine attempts, six successful responses, two invalid JSON responses and one HTTP 429. It covered English/Chinese, 390-pixel layouts, keyboard paths, privacy review, decisions and later outcomes, reassessment, citations, Markdown, error/retry, JSON export and printing. Two accepted limitations remain: Escape can return focus to the page body after a dialog, and the skip link can appear/overlap in print. Browser checks were on the preceding UI source; the latest five-file change affected model context/domain tests, not UI layout.

## Automated and packaging verification

Recorded `8ad14e3` checkpoint checks: **345 tests in 18 files**, TypeScript and default production build passed. Focused regressions passed; 50,176 period comparisons showed unchanged matching behavior, and 60 request comparisons preserved evidence/schema/provider settings. These checks establish program behavior within their fixtures, not semantic truth of model prose. No new paid calls were made during submission packaging. This does not include Claude's later promo-video recording, which is separately described in [SUBMISSION.md](SUBMISSION.md).

The application offers traceable evidence and structured review, with transparent failures. Human time savings and superiority over a basic model prompt were **not measured**: both practical-value experiments were intentionally skipped. The high-versus-max experiment and standalone B787 package were also intentionally skipped. Historical B787 development evidence is not an untouched final test set.

## Evidence index

- `evidence/supplied-original/`: baseline summary, 30-row matrix, original expectations, complete replies and attempted reply texts.
- `evidence/supplied-current/`: identical-fixture rerun, summary, comparisons, quality findings and current-source checks.
- `evidence/unseen/`: ten frozen scenario definitions, 20-row matrix, all final replies and blocked candidates.
- `evidence/feedback/reassessment-review.md`: failed D05 reassessment analysis; D05 files hold all required record fields.
- `evidence/browser/`: dated controlled-provider UI verification and export/print checks.
- `evidence/MANIFEST.json`: original provenance, hashes and any distribution transformations.


## Latest package checks and release boundary

The clean package copy installed dependencies with `npm ci --offline --no-audit --no-fund` from the local npm cache on Node 24.15.0. Data import, TypeScript and all 345 tests passed. Its default Turbopack build was blocked while binding a worker port, including the elevated retry; `npm run build -- --webpack` passed without application edits. Earlier current-source default-build success remains in `evidence/supplied-current/verification.json`. These are separate observations, not contradictory pass/fail labels for one run.

The archive's 95 source files matched `8ad14e3` byte for byte; ZIP/manifest, required-file, known-runtime-secret and exclusion checks passed. All nine slides and twelve technical-report pages were visually reviewed. The source archive, original test matrices, review records and PDFs are not rewritten by this documentation synchronization.

A fresh-install real-inference/restart/export workflow in the intended judge environment, external access and Docker execution remain unverified. The approved video does not by itself close those installation gates. Full screen-reader and independent usability/operational studies have not been performed. See [remaining release work](../PLAN-HACK.md#remaining-release-work).
