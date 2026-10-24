# D01 — Speaker script

Approximately five minutes. Recorded examples retain their original checkpoints; no new inference is implied.

## Slide 1

AeroContext helps a fictional airline review incidents. It puts evidence, a proposed assessment, draft messages and reviewer decisions in one inspectable record. This is a simulation prototype, not an operational decision-maker. Today we show the implemented workflow, recorded results and known limits.

Sources: D02; Track 3 Problem Statement, pp.1–2; application code 27f5ec9; evaluations retain their original checkpoints.

## Slide 2

The supplied brief asks the team to compare normal operations with new disruptions and explain what is fact, assumption or unknown. The three audiences need different information. A weather warning does not establish a flight delay; an operational suggestion does not establish authority to act.

Sources: Organizer Track 3 Problem Statement; workbook RULE001, RULE002, RULE005, RULE007.

## Slide 3

Users add an incident and attributed reports, review the assessment and citations, then decide on recommendations. Pending is explicit. Outcomes can be entered later without deleting earlier detail. After decisions are complete, the app offers reassessment or editing. Failed generation preserves the prior valid assessment.

Sources: D02; D04; evidence/browser; D05 synthetic records.

## Slide 4

The policy uses structured metadata and the same time-comparison logic exposed to the model. Historical shortfall triggers review, not a causal claim or current high risk by itself. The model provides explanations and drafts. Structural checks and one repair reduce certain errors, but valid JSON and real citations do not prove semantic support.

Sources: D04; src/domain/policy.ts; src/domain/report-period.ts; src/ai/service.ts; src/domain/output-checks.ts.

## Slide 5

This example uses a real recorded model call, not a fabricated screen. Both reports are inside the window. Their separate origins, signal types and expansion support high risk. The accepted reply proposes referral, verification, monitoring and drafts; it does not establish a flight delay. The full inputs, outputs and review notes are included. This is now a disclosed case, not a future holdout.

Sources: evidence/unseen/cases/UNSEEN02-en/definition.json, outputs.md and evaluation.json.

## Slide 6

The original and repeated supplied tests each accepted all 32 model-backed steps, but quality review found four and three failures respectively. The rerun cost more and needed more repair. Unseen testing yielded 19 of 20 usable final replies, with three quality failures and one blocked numeric comparison. We separate application acceptance from content quality.

Sources: D03; evidence/supplied-original/summary.json; evidence/supplied-current/summary.json; evidence/unseen/summary.json.

## Slide 7

The submission includes fresh synthetic examples, as explicitly chosen for this project. There are accepted, modified, rejected and pending decisions, with later outcomes and revision history. The initial assessment saved, but reassessment failed twice: an uncited fact and then a fabricated source ID. We present that limitation rather than claiming a completed successful loop.

Sources: D05-synthetic-feedback.md/.csv/.json; evidence/feedback/reassessment-review.md.

## Slide 8

The practical benefit proposed is a traceable chain from evidence to human judgment. We have quality, reliability, latency and cost observations, but no measured time savings and no proof of superiority over a basic prompt. Important limitations remain: unsupported service commitments, historical interpretation errors and validator false positives.

Sources: D03; D06; project TODO user decisions on 24 October 2026; evidence/supplied-current/verification.json.

Release verification: 27f5ec9 passed 351 tests, TypeScript and Webpack. Its default build hit an environment worker-port restriction; the earlier default-build pass belongs to 8ad14e3. Frozen model results are unchanged.

## Slide 9

The repository connects every required submission item to an artifact. The owner-approved video, quota settings and acknowledgements are included. The owner will change visibility to public, verify signed-out access and submit the repository link. Fresh judge-machine real inference, persistence/export and Docker remain unverified. No new model call was made for publication. Codex and Claude assisted development and documentation; Claude created the approved video. D05 records are synthetic.

Sources: submission/README.md; D07; D08; ACKNOWLEDGEMENTS.md; publication verification.
