# AeroContext submission materials

**HackSHSID 2026 · Track 3 · 24 October 2026 · cancellation-fix edition**

Start with the [technical report](TECHNICAL-REPORT.pdf), [presentation](D01-client-presentation.pdf), or [approved demo video](video/README.md). Run the prototype from the repository root using [D02](D02-prototype-and-demo.md). Source and recorded results are inspectable without a model key; new AI responses require your own DeepSeek key.

| Required item | Artifact |
|---|---|
| D01 Client presentation | [PPTX](D01-client-presentation.pptx), [PDF](D01-client-presentation.pdf), [speaker script](D01-speaker-script.md) |
| D02 Assistant prototype | [Setup and recorded walkthrough](D02-prototype-and-demo.md) |
| D03 Event test report | [Report](D03-event-test-report.md), [supplied results](evidence/supplied-current/evaluation-matrix.csv), [unseen results](evidence/unseen/evaluation-matrix.csv) |
| D04 Data and rules | [Data, rules and architecture](D04-data-rules-and-architecture.md) |
| D05 Feedback records | [Synthetic narrative](D05-synthetic-feedback.md), [CSV](D05-synthetic-feedback.csv), [JSON](D05-synthetic-feedback.json) |
| D06 Risk card | [Controls and limitations](D06-risk-card.md) |
| D07 Roadmap | [Delivered behavior and future work](D07-implementation-roadmap.md) |
| D08 Reproducibility | [ZIP](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.zip), [guide](D08-reproducibility.md), [checksum](https://github.com/zha-chicken/runway-incident-workspace/releases/download/submission-2026-10-24/D08-reproducibility.sha256) |

**Current source edition, 24 October 2026:** D08 contains the input/context visibility application at `24d66d2` plus the fix that keeps Cancel available during proposed-fact reassessment. [Current change and checks](CANCEL-REASSESSMENT-UPDATE.md) · [earlier interface update](INPUT-CONTEXT-UPDATE.md). The owner-approved ten-slide PPTX, matching PDF, speaker script, technical report and recorded evidence are preserved byte for byte. Download the ZIP and checksum from the same edition and verify them together. See the [D08 guide](D08-reproducibility.md).

Supporting: [presentation redesign and checks](PRESENTATION-REDESIGN.md), [evaluation source provenance](EVALUATION-PROVENANCE.md), [technical report source](TECHNICAL-REPORT.md), [publication verification](PUBLICATION-VERIFICATION.md), [evidence provenance](evidence/MANIFEST.json), [acknowledgements and AI-use statement](../ACKNOWLEDGEMENTS.md), [release downloads](https://github.com/zha-chicken/runway-incident-workspace/releases/tag/submission-2026-10-24). The organizer's eight-item checklist is preserved in [submission-requirements.json](submission-requirements.json); its original status cells are source data, not this project's current completion status.

## Evidence and limitations

The current Cancel fix passed 379 tests, TypeScript, Webpack and isolated English/Chinese browser cancellation checks. Its default Turbopack build hit the local worker-port restriction. No provider calls were made for the fix or publication. The preceding `24d66d2` separately passed local uncached installation, a default build and real-model workflows; these are checkpoint-specific results. The applied-note time mismatch and current print/PDF verification gap remain open; see the [update record](CANCEL-REASSESSMENT-UPDATE.md). Frozen model evaluation remains unchanged: supplied rerun accepted 32/32 model steps with three reply-quality failures; unseen testing produced 19/20 usable final replies, three quality failures and one blocked reply. D05 is synthetic and its reassessment failed. These are bounded observations, not proof of universal correctness.

High/max, manual timing/basic-prompt comparison and a standalone B787 package were intentionally skipped. No new model calls or measured time-saving claims accompany publication. The video was owner-approved and remains dated to its original source. A different judge machine, Docker and other operating systems remain unverified; no hosted service is required by this repository delivery or claimed here.

## Provenance and publication

Original local evidence, feedback records, earlier package and Git history remain preserved. Publication copies only adjust links and source-location labels; see [distribution notes](evidence/PUBLICATION-NOTES.md). The current application includes the original `27f5ec9` baseline, the input/context update published as `24d66d2`, and the Cancel-button fix. D08 records the exact source hashes and separates application changes from documentation overlays; configuration, data, lockfile and migrations are unchanged. Large assets are release downloads, not installed dependencies or runtime data.

The repository is public. The final submission URL is `https://github.com/zha-chicken/runway-incident-workspace`. Check the repository and all material/video downloads while signed out, submit that URL through the event portal and retain its confirmation.
