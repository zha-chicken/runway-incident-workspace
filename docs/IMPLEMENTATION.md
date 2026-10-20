# Implementation evidence

Objective: implement PLAN-HACK.md in full. Local implementation and verification come first, per the user's October 20 update. Hosted deployment follows the working local prototype.

This file tracks actual evidence; unchecked items are not complete.

## Milestones

- [x] Immutable workbook import, provenance, calculations, and data-quality validation.
- [x] Independent workspaces, incident snapshots, source inspection, bilingual interface.
- [x] Real DeepSeek assessment, schemas, citation/policy validation, budget accounting.
- [x] Three editable bilingual drafts, discussion, explicit application of proposed facts.
- [x] Review-entry workflow, history, reassessment, stale-result handling, JSON export.
- [ ] Failure recovery, privacy guards, quotas, ownership, accessibility, browser checks.
- [ ] Public test suite in both languages; sealed final holdouts and evaluation report.
- [ ] Effort comparison after verified prototype; manual and basic-model baselines.
- [ ] Eight substantive submission materials, editable presentation and PDF.
- [ ] Clean local setup and reproducibility package.
- [ ] Hosted deployment, persistence, judge-access verification.

## Current evidence

- Plan and all supplied workbook sheets inspected. No existing implementation was present at start.
- Local-first priority confirmed by user. API credential supplied for local integration; keep it out of source, logs, exports, and submission artifacts.
- External submissions, final hosted URL/domain, and live portal verification remain pending.
- Local browser walkthrough created an unseen Linjiang incident, generated an assessment and three bilingual drafts, inspected a report citation, recorded a QA review, discussed an unverified update in Chinese, explicitly applied it as version 2, reassessed, reopened history, and downloaded the JSON export.
- The walkthrough is agent-driven software QA. It is not a completed independent human evaluation or timed manual baseline.
- An English passenger-draft edit persisted in the production build and correctly marked the Chinese text as requiring translation review.
- Saved incident state survived a development-to-production server restart. The local production launcher serves the standalone bundle at `http://127.0.0.1:3000` using the same database.
- A 390-pixel viewport showed no horizontal document overflow; a 1280-pixel layout and English/Chinese views were inspected. Full keyboard, contrast, and print-layout QA remain.
- Production packaging was checked for local environment files, SQLite files, ZIPs, and source PDFs: none were present in the standalone output. The migration was included.
- The key file has mode `0600`, is Git ignored, and was absent from the downloaded incident export.
- See `LOCAL-VERIFICATION.md` and the synthetic records under `evals/development/` for measured results and limitations.
- The v3 citation-enum follow-up passed on its first live attempt. Six completed actions (ten provider attempts including repairs) cost ¥1.147199 in total. This is development evidence, not the final evaluation.
- The final preview is `docs/screenshots/local-prototype.png`. Twenty-eight automated tests and the production build pass.
- October 20 interface redesign: numbered workflow steps, a status strip that keeps risk, decision authority, official status and human review separate, per-recommendation review status, a side-panel source inspector, audience and language comparison for drafts, and light/dark themes. Agent-driven browser checks covered 1440- and 390-pixel layouts in English and Chinese, review entry (reason enforced for modifications), draft editing with translation flags, incident creation, tab keyboard navigation, and print emulation, against a copy of the local database. No model requests were made. Screen-reader and contrast audits remain.
- October 20 guided-workflow revision: replaced the tab/status-strip navigation with an airport home, Situation/Evidence preflight, focused analysis, six-box airport hub and sequential decision cards. Reviews resume and advance using persisted decisions; sources, drafts and history retain the existing APIs. Isolated browser checks covered save failure/retry, modification/rejection reasons, airport request isolation, cancellation, draft revisions, English/Chinese, and phone/tablet layouts. All 34 tests, typecheck and production build passed; see `design-qa.md`. No paid model requests were made for this revision.
- Simplified layout on the `claude` branch (the first redesign is kept on `ui-redesign-v1`): a single "Next step" panel holds the page's only primary action (assess, decide, or check messages); a four-cell summary states risk, who decides, official flight status and decision progress in plain language; navigation is four numbered steps plus two tools; each recommendation has inline Accept / Modify / Reject buttons beside a "must know" column (human-only decisions, escalation conditions, unknowns, assumptions). Browser checks against a database copy covered the full decision flow (reason enforced for Modify/Reject, next step advancing to messages), English and Chinese, light and dark, and 390-pixel layouts. Agent QA only; not an independent usability test.

## Remaining before release

- Strengthen and evaluate semantic claim support, decision restrictions in free-form discussion, and numeric scope checks. Structural validation alone is insufficient.
- Include explicit review context in subsequent model requests, with snapshot-bound provenance, rather than relying only on manually added incident facts.
- Verify a real Chat Completions compatibility request before claiming that alternative endpoint is tested.
- Complete the planned public cases, sealed holdouts, high/max comparison, independent human review, and manual/basic-model baselines.
- Verify cancellation/restart edge cases with live transport, print output, and additional accessibility paths. Existing failure tests use deterministic provider stubs.
- Finish the eight submission materials and clean-install package. Docker is supplied but not yet run.
- Resolve hosting/domain, deployment, live portal labels/deadline, public repository, and actual submission separately.
