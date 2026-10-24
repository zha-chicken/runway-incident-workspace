# Cancel during proposed-fact reassessment — 24 October 2026

This edition builds on `24d66d25cfca1f23219d769f0f3919e0163c3eb9`. Only `src/components/workspace.tsx` changes application behavior: after saving a proposed fact and refreshing the incident, the page releases its save-busy state while the existing generation handler manages reassessment. **Cancel request** therefore remains usable once the server run is available. Existing duplicate prevention, cancellation, error reporting and cleanup remain in that handler.

The [source manifest](provenance/cancel-reassessment-source.json) identifies all 91 application/data/configuration/test files and their exact fingerprint: `541b08915f5856cfb64c811637589b17e15cad642f4e872703079d8bbddd1904`. The prior [input/context update](INPUT-CONTEXT-UPDATE.md), its source manifest and verification receipt remain preserved historical records. D08 contains the current source; its enclosing Git commit is linked in the Release notes.

## Verification

- TypeScript and **379 tests across 19 files passed**. The Webpack production build passed.
- The default Turbopack build was attempted twice, including an approved retry, and hit the local CSS-worker port-permission restriction. No build configuration was changed.
- Computer-use verified Apply and reassess followed by an enabled, working Cancel button in English and Chinese. Both requests ended with the localized cancellation message and a saved `cancelled` run status.
- Requests were held before transmission using a dummy key and an external test-only transport substitute. **No real provider calls** were made for this fix or publication. The substitute is not included in the application or D08.
- Each test retained the applied proposal/new version and its earlier recorded assessment/chat. All **35 table fingerprints across four protected databases** matched before/after; existing incidents and chats were unchanged.

See [machine-readable verification](provenance/cancel-reassessment-verification.json). These checks establish the cancellation interaction, not new model response quality or actual provider billing behavior.

## Preserved behavior and remaining limits

Proposal storage and timestamp handling, prompts, validation/retry behavior, risk/reliability/safety rules, context selection and numerical limits are unchanged. The approved presentation, report, video, D05 examples and frozen evaluations retain their original bytes and checkpoint attribution.

The separate time-fidelity finding remains open: applying a note explicitly dated 14:10 assigns the incident's 14:00 applicability period, and a subsequent recorded explanation called it a note at 14:00. The note remained unverified/context only; high risk and safety stops did not change. This Cancel-only fix does not resolve that issue. Current print/PDF rendering was not verified in the latest browser run because native printing blocked browser control; the minor modal focus-return limitation remains documented.

The preceding `24d66d2` passed a local uncached fresh install, default Turbopack build and isolated real assessment/chat/reassessment workflows. Those results belong to that checkpoint and do not override the build limitation recorded above. Docker, other operating systems, native PowerPoint animation playback, signed-out access to every artifact, rehearsal and portal submission remain separate checks. No hosted service or universal reply correctness is claimed.
