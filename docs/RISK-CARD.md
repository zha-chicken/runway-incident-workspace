# AeroContext prototype risk card

**System/version:** AeroContext, `8ad14e3`; reviewed 24 October 2026. **Use:** supervised hackathon simulation for a fictional airline. **Not validated for:** live dispatch, maintenance, aircraft movement, emergency response, official flight status, compensation decisions or passenger publication.

| Risk / trigger | Existing control | Residual risk and responsibility |
|---|---|---|
| Unsupported claims and commitments | Scoped evidence, structured rationale, prompt grounding, numeric/reference checks, reviewable drafts | Three quality failures in the latest supplied run and three in unseen accepted replies. Operator must check prose against actual evidence; no “hallucination-free” claim. |
| False validator rejection | One bounded repair, retained advisories where permitted, old valid result preserved | UNSEEN06-en remained blocked despite a legitimate numeric comparison. Never silently treat a blocked response as accepted. |
| Safety or professional decision | Policy stop flags, human referral, constrained action kinds, simulation/draft labels | Phrase heuristics cannot understand all language; four prose checks were removed. No automated operational authority. Qualified humans apply actual procedures. |
| Fabricated or misleading citations | Known IDs, metric membership and scoped evidence validation | An existing citation can still be misinterpreted. D05 repair invented an ID and was rejected. Reviewer verifies support, not just clickability. |
| Unreliable or correlated reports | Explicit reliability, origin/group/basis/time fields, ±30-minute checks | Metadata is user-entered, not authenticated; copied reports can appear independent if mislabeled. Reviewers must establish provenance. |
| Wrong time/baseline | Single period comparator, history cutoffs, computed context and tests | Ambiguous formats use exact-match fallback; model can still call a six-month baseline 12 months. Inspect timestamps and baseline counts. |
| Personal information | Input detection, masking preview/correction, reasoned false-positive review; server-side key | Heuristic misses and false-positive misuse remain; output privacy filter removed. Never enter real sensitive data; configure retention/access before any real pilot. |
| Feedback misunderstood | Original recommendation/reason and revisions retained; pending and omitted context explicit | D05 reassessment failed twice; context is bounded. Rejection is not proof a replacement was executed. Human confirms a new accepted assessment. |
| Prompt injection or malicious text | Reports treated as evidence, immutable organizer provenance, scoped schema/policy validation | Defense is incomplete; successful synthetic tests do not prove robust isolation against all attacks. No external tools execute model proposals. |
| Lost access or unintended retention | SQLite persistence, workspace ownership, export, same-origin checks | Cookie loss can lose workspace access; no automatic retention purge. Owner manages backups, stable secret and database location. |
| Cost, delay and availability | Usage accounting, six concurrent requests, token caps, timeouts, single repair | Daily workspace/IP quotas and application spending caps removed by owner decision. Provider limits still apply. Unseen median 69.273 s; cost is app-estimated, not a bill. Owner monitors provider usage. |
| Accessibility/printing | Recorded bilingual desktop/narrow/keyboard/print exercises | Two accepted issues: dialog Escape focus to body, print skip-link overlap. Review the exported file and use navigation controls explicitly. |

## Human responsibilities and escalation

Treat every generated message as a draft. Verify report provenance, applicability, unknowns, citations, constraints and any official status before accepting a recommendation. Record why a recommendation is accepted, modified, rejected or pending; record outcomes only after an actual or explicitly simulated outcome. If safety/source reliability triggers a stop, preserve the stopped assessment and refer to a qualified human. Do not convert simulation text into operational instructions.

## Evidence and release posture

The quota/concurrency row reflects `27f5ec9`. Original supplied results used `7bde4c8`; the supplied rerun and unseen results used code later committed as `8ad14e3`. No model reevaluation was performed for `27f5ec9`. See [source provenance](../submission/EVALUATION-PROVENANCE.md).

See [EVALUATION.md](EVALUATION.md) for denominators, source locations and the distinction between earlier successful default-build verification and the later packaging worker-port restriction. The packaging Webpack build passed.

At the earlier `8ad14e3` checkpoint, 345 automated tests, TypeScript and the default production build were recorded as passing. The quota/concurrency update passed 351 tests, TypeScript and the Webpack production build; its default Turbopack build remained blocked by the worker-port environment restriction, including an elevated retry. The latest supplied run accepted all 32 model steps but had three qualitative failures; unseen testing accepted 21/22 steps and 19/20 final replies, with three quality failures among accepted replies. These are bounded demonstrations, not safety certification, measured business benefit or independent real-user validation.

Release gates remain: verify a clean real-inference installation/restart/export, resolve judge access, inspect publication contents and rehearse. No live deployment or additional model call was made to prepare this card. The promo/demo video is completed and owner-approved; publication and judge access remain separate gates. [Submission index](SUBMISSION.md).
