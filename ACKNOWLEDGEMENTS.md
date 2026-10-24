# Acknowledgements and AI-use statement

## Project ownership and development assistance

AeroContext is a HackSHSID 2026 Track 3 project owned by **Benjamin Jin, class 9(4)** (GitHub: **zha-chicken**). The project owner chose the scope and design decisions, reviewed the demonstrated behavior and approved the submission materials and video. Existing Git author attribution is preserved.

OpenAI **Codex** and Anthropic **Claude** assisted with implementation, debugging, tests, documentation and submission preparation. Claude created the promo/demo video, which the project owner watched and approved. Codex helped review code and outputs and prepare the evaluation and publication materials. This disclosure describes development assistance; it does not claim independent expert certification.

The application's recorded AI responses use **DeepSeek Flash**, with the `high` setting and Responses format. Application policy and validation constrain structured outputs, but they do not establish that every statement is correct. Evaluation reports retain failed replies and unsupported claims. AI-assisted evaluation is not an independent human study. The D05 reviewer decisions and exercise outcomes are explicitly **synthetic demonstrations**, not observations collected from real participants. High/max and practical-value comparisons were intentionally skipped.

This section can be used as the submission portal's AI-use statement. No per-screen label or application behavior was changed for publication.

## Data and problem sources

The HackSHSID organizers supplied **Track 3 Problem Statement** (problem setters: **Accenture**) and **Track 3 Data.xlsx**. The original files and their provenance are retained under [HackSHSID 2026](HackSHSID%202026/). The airports, incidents and exercise reports are fictional simulation material. References to CAAC, weather and other public resources in the organizer's brief are not claims that this prototype integrates their live services.

## Software and document tools

The application uses Next.js, React, TypeScript, Tailwind CSS, Radix UI, next-intl, Lucide, better-sqlite3, Drizzle, ExcelJS, Zod, react-markdown and the unified/remark ecosystem. Vitest and tsx support development and checks. Versions and dependency integrity are pinned in [package-lock.json](package-lock.json). [Third-party notices](THIRD-PARTY-NOTICES.md) list installed direct dependencies and their license notices; upstream terms remain applicable. This document does not assign a new license to organizer materials or other contributors' work.

OpenAI document/presentation tooling and ReportLab were used to prepare the original presentation and technical report. Claude redesigned the current presentation using PptxGenJS, with its PDF exported through Keynote. Codex corrected the evaluation-provenance footnote and refreshed the submission package. The technical report retains its design and fonts, with provenance and attribution wording synchronized. PowerPoint animation playback has not been verified. The promo README attributes its generated music and interface sounds to the project's `music.py`; it reports no third-party audio. The video and poster are used unchanged from the owner-approved copies.

## Verification and provenance

Application code is unchanged from **27f5ec9278a5ac4eb1700fc9843f9ff883b19808**; subsequent commits update documentation and submission materials. Submission documents are refreshed for that version; recorded model evaluations and video remain attributed to their original earlier checkpoints. No new model calls were made for this publication refresh. See [submission materials](submission/README.md), [publication verification](submission/PUBLICATION-VERIFICATION.md) and [video provenance](submission/video/README.md).
