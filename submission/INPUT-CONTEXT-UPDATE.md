# Input limits and model-context visibility — 24 October 2026

This application edition builds on `27f5ec9278a5ac4eb1700fc9843f9ff883b19808`. The preceding repository/materials checkpoint is `5672e7b9514f28e375fdc5a6f58a6d78050268b5`. It adds the owner-approved interface changes below. It is not described as an unchanged export of either commit: [the source manifest](provenance/input-context-source.json) records the exact application/data/configuration/test files and their canonical SHA-256 fingerprint. D08 `SOURCE.json` separately lists application and documentation overlays. GitHub Release notes link the final publication commit.

## What changed

- The incident editor displays character and report counters and exact UTF-8 JSON request size, including the version/input envelope when editing. Existing limits remain: 24 reports, 6,000 characters per report and 200,000 bytes per request, with the original individual metadata-field limits. Oversized pasted text stays available for correction; saving is blocked until valid.
- The client checks the final serialized request after privacy handling, and the server retains its independent existing limit. Bilingual errors explain what to correct. No stored content is shortened.
- Ask AeroContext explains that it sends the current incident/evidence and at most the latest six question-answer exchanges from the current incident version. Earlier conversations remain saved. Saved human feedback is used for reassessment, not automatically added to chat.
- Assessment screens disclose the existing maximum 24 complete reviews and 48,000 UTF-8 bytes of review entries. Selection/omission counts come from the same server selector used for generation; completed assessments with omissions show their recorded run counts. Whole omitted records remain in Record & export. Incident details and JSON export add these counts.

Numerical limits, prompts, risk/reliability/safety rules, output-validation/retry behavior, context selection, privacy handling, stored-data structure, concurrency and documented local setup are unchanged. The app rejects oversized submissions earlier, before an avoidable request to the server. No live incident or chat record was edited for implementation or publication.

## Verification

[Machine-readable checks](provenance/input-context-verification.json) record:

- 379 passing tests in 19 files, including 28 new boundary/context tests; TypeScript passed.
- Webpack production build passed. Default Turbopack hit an environment restriction when its CSS worker tried to bind a port, including the elevated retry. No build configuration was changed.
- Five schemas and 40 constructed assessment/discussion requests matched the preceding application. This checks request compatibility, not model response quality.
- Isolated Chrome checks passed in English at 1365 pixels/light and Chinese at 390 pixels/dark. A 6,001-character report stayed intact; field/report and aggregate limits blocked saving; correction restored saving. A controlled HTTP 413 preserved input, followed by a successful corrected save. Feedback notices showed 24 of 26 selected and two omitted; the chat explanation was associated with its input. No page errors, horizontal overflow or model-generation requests were observed.
- All 15 app/test files in this change match the tested files. Tests used temporary databases and synthetic browser fixtures. No real provider calls were made.

## Preserved material and remaining limits

The approved ten-slide PPTX, matching PDF, speaker script, thirteen-page technical report, video, D05 feedback examples and frozen evaluation evidence are preserved byte for byte. They describe their recorded earlier checkpoints and do not demonstrate this new interface. This update record supplements those materials; it does not relabel their model runs or replace their accepted failures with passes.

The public repository link is the submission delivery. Judges should use the documented local setup with their own private provider key. Full signed-out artifact review, fresh judge-machine inference/restart/export, uncached installation, Docker and native PowerPoint animation playback remain separate verification limits. No hosted service or new live-model quality result is claimed.
