# Publication verification — 24 October 2026

Application code remains **27f5ec9278a5ac4eb1700fc9843f9ff883b19808**. This presentation refresh adopts Claude's redesigned D01, corrects evaluation provenance, updates acknowledgements and rebuilds D08 from documentation base `920ee97`. [Machine-readable verification](publication-verification.json).

**Edition:** 24 October 2026 presentation redesign and provenance correction. D08 distributes these materials as a matching ZIP/checksum pair through the submission release. Verify the downloaded archive against its sidecar, then verify the extracted manifest. Do not mix files from different archive editions. Repository visibility remains an owner-controlled setting.

## Source, evidence and preservation

- All 97 application-baseline files are accounted for: 90 are byte-identical to `27f5ec9`, and seven are Markdown documentation overlays. App code, tests, data, migrations, configuration and lockfile are unchanged. D08 `SOURCE.json` and this verification JSON list the overlays.
- All 705 prior published tracked files are preserved in a separate backup and at Git commit `920ee97`. Existing commit history is retained. The old D08 ZIP/checksum and original Claude authoring folder are preserved separately. 1189 files match the reused earlier publication/Claude fingerprints. Two live SQLite bookkeeping files (WAL and shared memory) differ from that older fingerprint and are excluded from the byte-identical claim. This documentation task does not write to or restore any database.
- All 578 distributed evidence entries verify against their existing manifest. Every prior published evidence file is byte-identical. The earlier distribution's 575 unchanged files and three portable-link/report copies retain their original provenance; no new evidence transformation was made. D05 CSV/JSON and the speaker script are also byte-identical.
- [Evaluation source checks](EVALUATION-PROVENANCE.md) verify the original 93-file source against `7bde4c8`, the rerun's five saved patch files against `8ad14e3`, and the unseen 95-file source against `8ad14e3`. The latter commit was created after the run. Frozen plans, source states, replies, verdicts and timestamps are unchanged.
- Credential-pattern and archive-exclusion checks passed. Only the empty `.env.example` is distributed. No Git metadata, runtime databases, session/transport state, provider deliberation, credentials, dependencies or build outputs were added.

## Presentation, report and archive

- Nine editable slides passed package integrity, layout/font checks and first-party re-import. The metrics table is native. The validator retained one table-height heuristic warning; the full table and footnotes are visible in the Keynote PDF. Native PowerPoint rendering and animation playback remain unverified.
- All nine PDF pages were visually reviewed. Eight are pixel-identical to Claude's export; page 6 changes only the evaluation footnote. Text is selectable, and all numeric tokens remain present. The speaker-note wording and all animation/transition XML are preserved. [Adoption record](PRESENTATION-REDESIGN.md).
- The synchronized technical report remains 13 pages, all visually reviewed. Its design/fonts are unchanged; source-version wording and acknowledgements are aligned with the deck. The owner-approved video and poster remain unchanged.
- D08 contains a complete SHA-256 manifest, original-source hashes, explicit documentation overlays and the new provenance receipts. The separate sidecar verifies the archive; it is excluded from the ZIP to avoid a self-referential checksum.
- App verification remains the prior 351 tests, TypeScript and Webpack build on byte-matched app source. These were not rerun for document-only changes. The default Turbopack build hit the recorded worker-port restriction; earlier default-build success belongs to the `8ad14e3` checkpoint. No new test-performance or model-quality claim accompanies this refresh.

## Remaining boundaries

The owner controls the public-visibility change and final portal submission. Verify repository and download links signed out after making the repository public, and retain the portal confirmation. Packaging checks do not establish public access.

Fresh judge-machine real inference/restart/export, uncached installation and Docker remain unverified. No hosted deployment is claimed. Known model/validator failures and synthetic feedback limitations remain documented without changing any failure to a pass.
