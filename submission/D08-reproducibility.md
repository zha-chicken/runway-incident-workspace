# D08 — Reproducibility package

[Download D08 ZIP](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.zip) · [Checksum](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.sha256)

**Final presentation edition, 24 October 2026:** this D08 contains the owner's final ten-slide D01, matching PDF, synchronized speaker script and updated credits/verification. Download both release assets together and run `shasum -a 256 -c D08-reproducibility.sha256` in their directory. Use the ZIP and checksum from the same edition; a checksum from an earlier download does not verify this refreshed archive.

The package pins application code, tests, data, lockfile, migrations and configuration to **27f5ec9278a5ac4eb1700fc9843f9ff883b19808**. Its documentation is refreshed for publication. `SOURCE.json` lists the documentation overlays and original hashes; no application behavior changes are included. The original local package and Git history are preserved.

## Contents

- Package root: runnable source from `27f5ec9`, with the current documentation overlay and acknowledgements.
- `submission/`: D01–D07, owner-approved final presentation and matching PDF, previously published technical report, portable evidence, source-provenance checks, video provenance and publication verification.
- `MANIFEST.sha256`: SHA-256 of every other archive file.
- `ORIGINAL-SOURCE.sha256`: hashes of the 97 original tracked files at the pinned commit.
- `SOURCE.json`: application baseline, documentation base `c9cd2e4`, final-presentation overlay, source verification, overlay list and distribution exclusions.

Start at `submission/README.md`; run setup commands at the extracted root. Verify `shasum -a 256 -c MANIFEST.sha256` at the extracted root. The checksum covers distributed files; `ORIGINAL-SOURCE.sha256` is provenance for comparing unchanged app files, not a command to validate overlaid documentation.

No API keys, personal/runtime databases, session/transport state, provider deliberation, installed dependencies or build output are distributed. The approved video is a separate release download to avoid duplicating the 91 MB file in the archive. It remains footage of `8ad14e3`, not a recording of newly executed tests.

Recorded evidence can be inspected without a provider key. New model calls require the reviewer's private key and incur provider usage. No new model calls were made for this refresh. Frozen evaluation results and D05 records are retained; publication-only link adjustments are documented in [evidence notes](evidence/PUBLICATION-NOTES.md).

The evaluation footnote distinguishes the original supplied tests at `7bde4c8` from the rerun/unseen working tree later committed as `8ad14e3`; see [source provenance](EVALUATION-PROVENANCE.md). The [presentation adoption record](PRESENTATION-REDESIGN.md) documents the byte-identical adoption of the owner's final PPTX, the PDF export method, the preserved original notes and evidence, and the unverified native PowerPoint playback.

Read [publication verification](PUBLICATION-VERIFICATION.md) and the [historical packaging verification](PACKAGE-VERIFICATION.md). Fresh judge-machine real inference/restart/export and Docker remain unverified; no hosting is claimed.
