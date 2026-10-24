# D08 — Reproducibility package

[Download D08 ZIP](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.zip) · [Checksum](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.sha256)

**Input/context visibility edition, 24 October 2026:** this D08 contains the same current app/test files as the publication commit linked in the Release notes, plus the preserved owner-approved presentation and recorded evidence. Download the matching ZIP and checksum together and run `shasum -a 256 -c D08-reproducibility.sha256`. A sidecar from an earlier edition does not verify this archive.

The application builds on **27f5ec9278a5ac4eb1700fc9843f9ff883b19808**, with the approved [input-limit and context-disclosure changes](INPUT-CONTEXT-UPDATE.md). It is not an unchanged export of that baseline. The preceding repository checkpoint is `5672e7b`; exact application hashes and their canonical source fingerprint are in [the source manifest](provenance/input-context-source.json). `SOURCE.json` records the application changes, added tests/helpers and documentation overlays separately. Configuration, data, dependencies and migrations are unchanged.

## Contents

- Package root: current runnable application, tests, local launch guide, source data, lockfile and acknowledgements.
- `submission/`: D01–D07, the unchanged final ten-slide PPTX/PDF and technical report, portable evidence, input/context update, source and presentation provenance, and publication verification.
- `MANIFEST.sha256`: SHA-256 of every other archive file.
- `ORIGINAL-SOURCE.sha256`: original hashes of the 97 tracked baseline files at `27f5ec9`, retained for provenance rather than validation of changed files.
- `SOURCE.json`: baseline and prior repository commits, application source fingerprint, explicit application/documentation overlays and distribution exclusions.

Start at `submission/README.md`; run setup at the extracted root. Verify `shasum -a 256 -c MANIFEST.sha256` after extraction. The external archive checksum is excluded from the ZIP to avoid a self-reference.

No API keys, runtime databases, session/transport state, provider deliberation, installed dependencies, build output or Git metadata are distributed. The unchanged approved video is a separate release download and retains its `8ad14e3` provenance. Original supplied tests used `7bde4c8`; the supplied rerun and unseen tests used working-tree bytes later committed as `8ad14e3`. See [evaluation provenance](EVALUATION-PROVENANCE.md).

Recorded evidence can be inspected without a provider key. New model calls require the reviewer's private key and incur provider usage. No new provider calls were made for this refresh. All recorded replies, verdicts and D05 records remain unchanged; original package/evidence and Git history are preserved.

Read [publication verification](PUBLICATION-VERIFICATION.md), [the interface update](INPUT-CONTEXT-UPDATE.md) and [historical packaging verification](PACKAGE-VERIFICATION.md). Current checks include 379 tests, TypeScript, Webpack and isolated bilingual browser checks. Default Turbopack remains blocked by the worker-port environment restriction. Fresh judge-machine inference/restart/export, uncached installation and Docker remain unverified; no hosting is claimed.
