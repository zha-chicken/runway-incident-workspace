# Publication verification — 24 October 2026

Application code remains **27f5ec9278a5ac4eb1700fc9843f9ff883b19808**. This final-presentation edition adopts the owner's ten-slide D01 and matching PDF, updates the speaker script and credits, and rebuilds D08 from documentation base `c9cd2e4`. [Machine-readable verification](publication-verification.json).

**Release edition:** owner-approved final ten-slide presentation, 24 October 2026. Download the matching D08 ZIP and checksum together, verify the archive checksum, then verify `MANIFEST.sha256` after extraction. The release notes identify the corresponding materials commit and archive hash. Earlier editions and their provenance remain preserved.

## Source, evidence and preservation

- All 97 application-baseline files are accounted for: 90 are byte-identical to `27f5ec9`, and seven are existing Markdown documentation overlays. App code, tests, data, migrations, configuration and lockfile are unchanged.
- All 713 prior tracked files are backed up and preserved in Git at `c9cd2e4`. The previous D08 ZIP/checksum and the original authoring folders are preserved separately. No database was written to or restored for this adoption; runtime files are not part of the distribution or its hash claims.
- All 578 distributed evidence entries verify against their existing manifest. Every prior published evidence file is byte-identical. D05 CSV/JSON, the technical-report Markdown/PDF, and video provenance files remain unchanged. The speaker script is intentionally renumbered and extended for the added slide.
- [Evaluation source checks](EVALUATION-PROVENANCE.md) retain the original 93-file source at `7bde4c8`, the rerun's five saved patch files at `8ad14e3`, and the unseen 95-file source at `8ad14e3`. These receipts and frozen evidence are unchanged.
- Credential-pattern and archive-exclusion checks cover the rebuilt package. Only the empty `.env.example` is distributed; no Git metadata, credentials, runtime databases, provider deliberation, installed dependencies or build output are added.

## Presentation and archive

- The final PPTX is byte-identical to the owner's approved source. Ten slides passed package integrity, layout checks and Artifact Tool import. The native metrics table on slide 7 has corrected 8-point cell margins; no layout warning remains.
- The matching PDF has ten pages and selectable text. All pages were visually inspected and all checked source text is present. Nine pages use Keynote's export; slide 3 uses LibreOffice's export to preserve its headline. The PDF was assembled with pypdf. [Adoption record](PRESENTATION-REDESIGN.md).
- The original nine embedded note bodies retain their wording. Slide 3 has no embedded note. The separate script now follows all ten slides; its timing has not been rehearsed. Native PowerPoint layout and animation playback remain unverified.
- The previously published 13-page technical report, owner-approved video and poster are preserved. Current presentation credits and export provenance are described in the acknowledgements and adoption record.
- D08 contains a complete SHA-256 manifest, original-source hashes, documented overlays and the refreshed presentation receipts. The separate archive checksum is excluded from the ZIP to avoid a self-reference.
- Application checks remain the prior 351 tests, TypeScript and Webpack build on byte-matched source. They were not rerun for this documentation-only adoption. The default-build environment restriction remains documented. No model quality or runtime verification claim is added.

## Remaining boundaries

Rehearse the ten-slide presentation and verify the repository and download links signed out after the owner makes the repository public. Retain the portal submission confirmation. Packaging checks do not establish public access.

Fresh judge-machine inference/restart/export, uncached installation and Docker remain unverified. No hosted deployment is claimed. Existing failed replies and synthetic-feedback limitations remain recorded.
