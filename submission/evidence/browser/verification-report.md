# Final build and browser verification — October 23, 2026

**Default build: passed. Browser workflow: completed, with two findings requiring correction before browser acceptance can be closed.** No application source was changed, committed or pushed.

## Version and isolation

- Tested commit: `7bde4c8964f7c8663bf95e5e0143fe2e014f7dd5` on `main`.
- Source repository: `[original local source checkout]`.
- Isolated stage: `/tmp/aerocontext-final-browser-7bde4c8`, created from the commit archive. All 93 tracked source-file hashes matched; the source repository remained clean.
- Production server: `http://[::1]:3017`, using its own SQLite database, session cookie scope and dummy provider key. Existing dependencies were copied into the stage; this was not a fresh dependency-install test.
- The live server on port 3001 was not restarted or used for this test. Before/after fingerprints matched for all nine live database tables, including 28 incidents, 29 snapshots, 7 assessments, 41 reviews and 3 discussions.

## Build and automated checks

`npm run build` completed successfully with Next.js 16.4.2 **Turbopack**, including TypeScript, page generation and optimization. The run used approved execution outside the filesystem sandbox so the build worker could use its local ports. No build-command, dependency or configuration change was needed. This closes the previous environment-related default-build uncertainty.

`npm test` passed **324 tests across 17 files**. The browser checks ran against the resulting standalone production server. Logs: default build (`build-default.log`; local supporting artifact excluded from this distribution), tests (`tests.log`; local supporting artifact excluded from this distribution), server (`server.log`; local supporting artifact excluded from this distribution).

## Browser verification completed

The workflow was exercised across English and Chinese, with desktop and 390 × 844 CSS-pixel layouts. These were app-integration checks using nine controlled provider attempts, not real DeepSeek calls. The preload fixture intercepted the provider transport with six successful responses, two malformed-JSON responses and one HTTP 429 response. Other remote fetch destinations were blocked. There were **zero real model calls** and no transmission of saved personal feedback.

The production app's normal routes, validators, persistence and UI processed those responses. This does not establish the factual quality, language quality or reliability of live model outputs. The app's AI-run records in this isolated database identify the normal provider path; the responses must still be described as synthetic test fixtures.

| Area | Observed result |
|---|---|
| Create incident and report | Created a separate synthetic HAI incident, retained its source/time fields, and saved an unverified report. |
| Input privacy review | Synthetic email detection paused input. Back to editing preserved fields; masking removed the email while retaining `20:08`. No Human Approval option was shown. A synthetic inventory-number false positive required reviewer alias and reason before saving. |
| Analysis and evidence | Production analysis route produced a usable assessment. Evidence history displayed full rates, comparison windows and source records. `OPS-YUN-2024-07` opened the correct workbook row 50 with its original values and source hash. |
| Decision stage | Accepted, modified, rejected and Pending were all exercised. A modified decision with no reason was blocked. Pending left the count at 3/4 and did not show the all-decisions-complete banner. |
| Outcome stage | Recorded actual action, simulated observed outcome and improvement later. Editing the earlier decision preserved these later details and all earlier revisions. |
| Completion and reassessment | Completing all four decisions showed the banner with reassessment, decision editing and later-outcome options. The reassessment request included the latest four reviews, the changed reason and later outcome. |
| Invalid assessment output | Two controlled malformed JSON responses exhausted the bounded repair path. A localized error appeared, the prior valid assessment stayed intact, and a subsequent reassessment succeeded. |
| Messages | Three audience drafts displayed headings, lists, table, citations and the separate rounded simulation/draft notice. Copy retained source Markdown and the notice. Saving a Chinese edit created a revision and the English translation-review indication. |
| Ask AeroContext | Command+Enter submitted the question. Privacy masking retained its report time. A controlled 429 produced a visible localized error beside the composer, restored the masked question and exposed Retry. Retry produced one saved exchange. |
| Proposed fact | Applying the controlled proposal created a new version and an unverified context report. The previous version was preserved and reassessment completed. |
| Narrow layouts | English and Chinese Messages, Chinese chat, incident editing and evidence were exercised at 390 pixels. Checked page scroll width remained 390; the wide evidence table scrolled within its container. |
| Keyboard | Dialog focus entry and wrapping, Enter submission, Command+Enter chat submission and Escape closure worked. Focus restoration after source-dialog closure failed; see B01. |
| History and JSON export | UI download contained three versions at export time, four assessments, seven review revisions, the edited draft, one discussion and three privacy reviews. The two masked email values were absent. Prior versions and feedback were preserved. |
| Printing | Saved and inspected all pages of three-page English and Chinese PDFs through Microsoft Edge's print UI. Drafts, citations, feedback and source hash were present. B02 affects visible layout. |
| Historical assessment printing | After making version 4 unassessed, Chinese printing correctly retained the last assessed version 3 title and `21:10` time, displayed the stale-assessment notice, and excluded the version 4 title and `22:10` time. |

The main synthetic incident ID was `772efa65-c1de-4609-85e8-2723991eea5d`. Versions 1–3 were created through the UI. Version 4 was added only to the isolated database as a controlled stale-print fixture. For native-browser printing, that synthetic incident and its associated workspace-scoped records were temporarily assigned to the isolated Edge workspace and then restored. No live workspace was involved.

The JSON export was taken before the version 4 print fixture was added, so its three-version history is expected. A seeded YUN scenario in the isolated workspace was also used to verify the evidence table and raw-source dialog.

## Open browser findings

### B01 — Source-dialog closure loses keyboard focus

**Medium impact.** Open a citation, then press Escape. The dialog closes, but `document.activeElement` becomes `BODY` instead of the button that opened it. Reproduced in Messages, Ask AeroContext and the monthly evidence table. Keyboard users lose their position in the workflow.

The shared controlled modal is in `src/components/ui.tsx`, around line 38; it has no trigger binding or explicit return-focus handling. This is a code pointer for investigation, not a tested fix. Acceptance after correction should verify focus returns to the originating control after both Escape and the close button, without breaking focus trapping.

Evidence: browser observations (`browser-observations.json`; local supporting artifact excluded from this distribution).

### B02 — Skip-to-content control leaks into printed reports

**Medium impact.** The English “Skip to content” and Chinese “跳至内容” control appears near the bottom of printed pages 1 and 2. On page 1 it overlays report text, making part of the report harder to read. This is visible in the saved PDFs, not merely the browser preview.

The fixed `.skip-link` styling is in `src/app/globals.css` around line 103. The print rules around line 939 hide navigation and dialogs but do not explicitly exclude this control. Acceptance after correction should inspect all pages in both languages and confirm the keyboard skip link still works on screen.

Evidence: English PDF (`print-en.pdf`; local supporting artifact excluded from this distribution), Chinese historical PDF (`print-zh-historical.pdf`; local supporting artifact excluded from this distribution), English page 1 (`print-en-1.png`; local supporting artifact excluded from this distribution), Chinese page 1 (`print-zh-historical-1.png`; local supporting artifact excluded from this distribution).

An earlier suspected right-margin overflow was **not confirmed** when the saved page renders were re-inspected. It is not recorded as a defect.

## Evidence and remaining limits

- [Machine-readable summary](verification.json)
- [Failure preservation](failure-preservation.json)
- Feedback context (`feedback-context-check.json`; local supporting artifact excluded from this distribution)
- Proposal versioning (`proposal-version-check.json`; local supporting artifact excluded from this distribution)
- [JSON export checks](export-check.json) and downloaded export (`browser-export.json`; local supporting artifact excluded from this distribution)
- [Historical print checks](print-check.json)
- Before (`live-data-before.json`; local supporting artifact excluded from this distribution) / after (`live-data-after.json`; local supporting artifact excluded from this distribution) live-data fingerprints
- Source hash verification (`source-check.json`; local supporting artifact excluded from this distribution)
- Provider fixture (`provider-fixture.cjs`; local supporting artifact excluded from this distribution) and controlled request log (`provider-requests.jsonl`; local supporting artifact excluded from this distribution)

The latest browser tab recorded no console warnings or errors; this is not a claim that earlier closed tabs had no errors. The two intentionally injected provider failures were verified by their UI behavior and saved records.

The isolated server was stopped, created browser tabs closed, and the temporary viewport reset. Live port 3001 remained running. Test artifacts and the isolated database are retained for reproduction. App fixes, fresh-install verification, real-model evaluation, hosted/device compatibility and Docker checks remain separate work.
