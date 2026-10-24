# Publication verification — 24 October 2026

**Edition: input limits and model-context visibility.** The current application builds on `27f5ec9278a5ac4eb1700fc9843f9ff883b19808` with the approved app/test changes. The preceding publication is `5672e7b9514f28e375fdc5a6f58a6d78050268b5`. This edition is identified by the exact [application source manifest](provenance/input-context-source.json), fingerprint `cbd8ed60a9989acc7c2d8256ef1220af26424adb5339fabe26b55d9aadfb0e5d`, and the final Git commit linked in the Release notes. [Machine-readable verification](publication-verification.json).

Download the matching D08 ZIP/checksum together and verify the sidecar, then the extracted `MANIFEST.sha256`. Older packages and Git history remain preserved. GitHub's automatic source archive still follows the historical release tag; the attached D08 contains this refreshed edition.

## Source, evidence and preservation

- All 97 original application-baseline files are accounted for: 79 unchanged, 11 app/test changes and 7 Markdown documentation overlays. Four new app/test files are included. D08 `SOURCE.json` records original and distributed hashes, keeping application changes distinct from documentation.
- All 717 pre-publication working files and the previous ZIP/checksum were backed up before editing; prior committed files remain in Git at `5672e7b`. No history rewrite, runtime database edit or restore was performed.
- The 578-entry frozen evidence manifest verifies. All 600 protected evidence, provenance and approved material files remain byte-identical, including D01 PPTX/PDF/script, the technical-report Markdown/PDF, D03, D05 records and video provenance. The current [update record](INPUT-CONTEXT-UPDATE.md) supplements those earlier materials without relabeling them as a new model evaluation.
- Original evaluation source receipts still match their 93-file, five-file and 95-file Git checkpoints. Recorded failures, denominators and costs remain unchanged.
- No credentials, runtime databases, session/transport state, provider deliberation, installed dependencies or build outputs are distributed. Only the empty `.env.example` is included.

## Application and package checks

- The exact app/test files passed 379 tests in 19 files, TypeScript, Webpack and isolated English/Chinese browser checks. Five schemas and 40 constructed requests matched the previous source. [Details](INPUT-CONTEXT-UPDATE.md) and [verification receipt](provenance/input-context-verification.json).
- The default Turbopack build hit the existing worker-port environment restriction, including its elevated retry. No build configuration changed. No real provider calls were made for this interface update or publication.
- The ten-slide PPTX, ten-page PDF and thirteen-page technical report retain their previous verified bytes. The original presentation checks remain historical receipts; native PowerPoint playback and timing rehearsal remain unverified.
- D08 has a complete SHA-256 manifest, source fingerprint, original baseline hashes and explicit overlays. The external archive checksum is excluded from the ZIP to avoid a self-reference. Package extraction, file hashes, local Markdown links, source equivalence and evidence preservation are checked before publication.

## Access and remaining limits

The repository is public; no visibility change was made by the agent. The documented local setup is the judge installation path. Complete signed-out artifact checks, rehearse, submit the repository URL and retain confirmation. Packaging itself does not prove access to every external link.

Fresh judge-machine real inference/restart/export, uncached installation and Docker remain unverified. No hosted deployment or improved live-model quality is claimed. The owner-approved video retains its earlier source provenance.
