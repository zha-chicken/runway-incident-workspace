# Publication verification — 24 October 2026

Application code: **27f5ec9278a5ac4eb1700fc9843f9ff883b19808**. This refresh changes distribution documents and adds submission materials; it does not change app behavior or run new model calls. [Machine-readable verification](publication-verification.json).

## Source, evidence and exclusions

- All 97 original tracked files are accounted for; 90 are byte-identical. The 7 changed files are Markdown documentation overlays, explicitly listed in the verification JSON and D08 `SOURCE.json`. App code, tests, data, migrations, configuration and lockfile are unchanged.
- All 1175 fingerprinted original local package/evaluation/runtime files remain unchanged. Git history is retained; the publication commit is additive. Earlier author attribution remains visible in Git history.
- The 578-entry evidence manifest verifies each distributed file: 575 entries are unchanged; three Markdown reports have only portable-link/exclusion-label/local-path presentation adjustments. Original hashes are recorded alongside new distribution hashes. Model replies, fixtures, verdicts and D05 CSV/JSON are not rewritten.
- Twenty-eight broken relative links in supporting reports were repaired or explicitly labeled as references to excluded local artifacts. Runtime databases, full workspace exports, session/transport state and provider deliberation were not added to repair links. [Distribution notes](evidence/PUBLICATION-NOTES.md).
- Source and curated material credential-pattern scans found no likely provider secrets. Only the empty `.env.example` is included. No `.git`, `.env.local`, runtime database, installed dependency tree, build directory or unrelated personal document is distributed.

## Documents, downloads and checks

- Nine-slide editable deck passed package/layout/font/native-table checks and re-import. Changed slides were visually reviewed; the six unchanged slides rendered pixel-identically. Its PDF is a fixed export of the checked slides.
- The refreshed technical report has 13 pages. All pages were visually inspected. Acknowledgements cover development/model assistance, organizer data and libraries; the original approved video and poster bytes are retained.
- The package has a complete SHA-256 manifest, original-source hashes and explicit overlays. GitHub Release assets provide the ZIP, checksum and video; the repository contains the readable D01–D08 materials and evidence.
- App verification remains the previously completed 351 tests, TypeScript and Webpack build on byte-matched source. The default Turbopack build hit an environment worker-port restriction. Earlier default-build success belongs to the `8ad14e3` checkpoint. No new test/model-performance claim is made by regenerating documents.

## Owner-controlled submission and remaining limits

The owner will make the repository public and submit its URL. Until that change, links require private-repository access. Signed-out access cannot be confirmed while the repository is private. After the change, verify the repository, report, deck, ZIP and video links before submitting and retain the portal confirmation.

Fresh judge-machine real inference/restart/export, uncached installation and Docker remain unverified. No hosted deployment is claimed. Historical packaging verification and model outputs retain their original versions and outcomes; known failures were not changed to passes.
