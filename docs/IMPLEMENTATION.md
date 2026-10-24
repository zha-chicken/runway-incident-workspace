# Implementation evidence

Updated 24 October 2026 for application commit `8ad14e3`. Current behavior and results are summarized here; the October 20 observations below remain a historical record. Documentation edits do not change the application or establish a new test run.

## Current milestones

- [x] Immutable workbook import, provenance, historical/peer calculations and missing-weather handling.
- [x] Bilingual incident navigation, workspace isolation, snapshots, evidence inspection and inclusive ±30-minute report matching.
- [x] DeepSeek Responses/high assessments and discussion, three editable drafts, bounded repair, advisories and preservation of the last valid result.
- [x] Markdown/citation rendering, numeric highlights, separate simulation/draft notice and explicit stop reasons.
- [x] Two-stage feedback: Pending decisions, preserved reasons/revisions, later outcomes and saved-feedback context for reassessment.
- [x] Input privacy review with masking/correction or reasoned false-positive handling; no Human Approval bypass and no output privacy filter.
- [x] Recorded browser exercises in English/Chinese and narrow layouts, keyboard paths, privacy, feedback/reassessment, chat failures, printing and JSON export. Two accepted focus/print limitations remain; this is not a full accessibility certification.
- [x] Fifteen supplied test cases in both input languages, before/after rerun, and ten additional scenarios in both languages. Remaining quality and validator failures are retained.
- [x] Fresh synthetic feedback examples accepted with their failed reassessment documented; no real participant study claimed.
- [x] High/max comparison, manual timing, basic-prompt comparison and standalone B787 package intentionally skipped.
- [x] D01–D08 assembled locally, including nine editable slides, a twelve-page technical report and source/evidence ZIP.
- [x] Promo/demo video completed by Claude and watched/approved by the owner; see [SUBMISSION.md](SUBMISSION.md).
- [x] Clean cached installation, data import, TypeScript, 345 tests and Webpack production build during packaging. Earlier default-build success and later worker-port restriction are separately recorded.
- [ ] Fresh-install real inference, saved history, restart persistence and export in the intended judge environment.
- [x] Owner-approved quota change implemented locally: no daily workspace/IP quotas or application spending cap; six concurrent requests; usage/history retained. Isolated verification passed 351 tests, TypeScript and the Webpack production build; the default Turbopack build hit the existing worker-port restriction, including its elevated retry.
- [ ] Other testing-only settings decisions, external judge access and Docker verification if offered.
- [ ] Final publication review, approved release commit/package refresh, portal fields, rehearsal and submission confirmation.

## Current evidence and limitations

[Evaluation results](EVALUATION.md) distinguish usable outputs from content quality. The supplied rerun accepted 32/32 model-backed steps but retained three qualitative failures and required 18 repairs. The unseen run accepted 21/22 steps and 19/20 final replies; three accepted replies failed quality review and one final reply remained validator-blocked.

D05 contains five synthetic feedback records and seven retained revisions. Initial assessment saved; both reassessment candidates used feedback but failed validation, so no replacement assessment was saved. This demonstrates preservation, not a successful complete feedback loop. Independent human evaluation and measured business benefits are not claimed.

The October 24 context patch adds computed historical interpretation, explicit feedback context, report-period reasons and shared grounding guidance. It preserves reliability/risk/safety calculations, response contracts, storage and the single-repair behavior. Recorded regressions include 50,176 equivalent period comparisons and 60 compatible request comparisons. Current prompt versions and exact behavior are documented in [DATA-AND-RULES.md](DATA-AND-RULES.md).

Source and packaging evidence locations, the approved video and all eight deliverables are indexed in [SUBMISSION.md](SUBMISSION.md). The D08 archive remains a frozen `8ad14e3` artifact; it does not yet include these uncommitted documentation updates or the later video.

## Historical implementation evidence — October 20

The following entries are preserved as recorded at their checkpoint. Test counts, UI names and “remaining” statements inside this section describe October 20; they are superseded for current status by the milestones above. Local artifact paths may not exist in a fresh clone.


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
- October 20 black-and-white redesign of the guided workflow (same stages and APIs): neutral light and dark themes with a System/Light/Dark switch, colour kept for risk, warnings and chart series; an airport board on the home page; a four-step progress bar on each airport; a pre-analysis page with a fixed "Start analysis" panel; an analysis screen that describes the work without claiming per-step progress; an airport overview whose lead card shows risk, decision authority, the next recommendation and progress; and a decision page listing every recommendation beside the current one with its sources and "must know" lists. The simulation label is shown again in the sidebar, home page and printed report. Browser checks against a database copy covered 1440- and 390-pixel layouts, English and Chinese, light and dark (including a saved theme across reloads), a held analysis request, Accept and Modify (reason enforced), the source sheet, editor and review dialogs, and print. Agent QA only; no model requests were made.


## Remaining before release

Use the [current release checklist](../PLAN-HACK.md#remaining-release-work). The four skipped experiments/packages are closed decisions, not unfinished milestones. Further fixes or paid reruns of the accepted model failures require a separate decision. A live Chat Completions request must precede any claim that the compatibility format is integration-tested.
