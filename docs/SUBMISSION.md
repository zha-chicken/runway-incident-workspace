# Submission materials and promo/demo video

Updated 24 October 2026 for application `8ad14e3`. The eight required materials are assembled locally. This index does not claim that the files have already been uploaded, included in this repository or made accessible to judges.

## Artifact index

The material filenames below are relative to the local submission directory, not repository-relative download links. After publication, replace them with verified public artifact links.

| ID | Material | Local filenames |
|---|---|---|
| D01 | Client presentation | `D01-client-presentation.pptx`, `D01-client-presentation.pdf`, `D01-speaker-script.md` |
| D02 | Prototype and recorded real-inference demonstration | `D02-prototype-and-demo.md`; exact app source in D08 |
| D03 | Event tests | `D03-event-test-report.md`, `evidence/supplied-original/`, `evidence/supplied-current/`, `evidence/unseen/` |
| D04 | Data and rules | `D04-data-rules-and-architecture.md` |
| D05 | Synthetic feedback | `D05-synthetic-feedback.md`, `.csv`, `.json`; failure analysis under `evidence/feedback/` |
| D06 | Risk card | `D06-risk-card.md` |
| D07 | Roadmap | `D07-implementation-roadmap.md` |
| D08 | Reproducibility | `D08-reproducibility.zip`, `D08-reproducibility.sha256`, `D08-reproducibility.md` |
| Supporting | Consolidated technical report | `TECHNICAL-REPORT.pdf` (12 pages), `TECHNICAL-REPORT.md` |
| Supporting | Verification and provenance | `PACKAGE-VERIFICATION.md`, `package-verification.json`, `evidence/MANIFEST.json`, `submission-requirements.json` |

Local development-machine locations:

```text
Submission materials:
/Users/benjamin/Documents/ChatGPT/HackSHSID/submission/

Working checklist:
/Users/benjamin/Documents/ChatGPT/HackSHSID/TODO.md

Promo/demo project:
/Users/benjamin/Documents/ChatGPT/AeroContext-promo/

Video:
/Users/benjamin/Documents/ChatGPT/AeroContext-promo/AeroContext-promo-1080p60.mp4
```

These paths are provided for the project owner. A fresh clone on another machine does not contain those sibling folders. The current repository still provides its application source, original workbook/problem statement, setup instructions, tests and documentation summaries; final material/video distribution and public access remain release tasks.

## Approved video and footage provenance

Claude completed the video and the project owner watched and approved it on October 24, 2026. This documentation task verified the local file and read the video's README; it did not independently watch or re-edit the footage.

According to that README, the video is a 1 minute 50 second, 1080p/60 fps promo with bilingual captions. It shows the incident/evidence/assessment/messages/discussion/feedback/export flow, Chinese UI, dark mode and a narrow layout. It identifies one later QING assessment recorded live on the running app, shown as a labeled time-lapse. Other chapters use earlier saved outputs and demonstration decisions entered in a separate app/database copy. Simulation/draft labels remain visible. These recording details are the creator's documented provenance, not a new benchmark measurement by this documentation task.

The recording reuses the D02/UNSEEN02 scenario with plainer wording; it is not another untouched holdout. Do not add its call, timing or cost to the frozen supplied/unseen evaluation totals. The full workflow in a fresh judge installation still needs verification.

## Current artifact version and release work

D08 contains **95 tracked files byte-identical to `8ad14e3`**, plus the materials/evidence assembled at packaging time. It intentionally retains that commit's older README/plan/docs. These repository documentation edits and the later video are not yet in that ZIP. Its dated verification reports and PDFs remain historical artifacts, even where their release-work lists mention the then-unfinished video or documentation synchronization.

The repository documentation is now updated locally; no commit or push accompanies this change. Before the final release, approve the documentation/code commit, synchronize the release materials/video references, regenerate the archive/manifest for that commit and check all public links. Do not silently rewrite original test outputs or evaluation verdicts while refreshing packaging.

D05 is synthetic, not independent participant feedback. The failed reassessment remains documented. High/max testing, manual timing, basic-prompt comparison and a standalone B787 package were intentionally skipped. See [evaluation results](EVALUATION.md), [risk card](RISK-CARD.md) and [release checklist](../PLAN-HACK.md#remaining-release-work).
