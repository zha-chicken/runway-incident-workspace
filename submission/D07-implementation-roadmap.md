# D07 — Implementation roadmap

The prototype demonstrates a workflow for evidence-grounded discussion and human review. It has not demonstrated production readiness, quantified human time savings or better performance than a basic prompt.

| Stage | Deliverable / owner role | Exit evidence | Status |
|---|---|---|---|
| 1. Hackathon prototype | Development team: bilingual incident/evidence workspace, scoped history, policy, AI drafts, citations, feedback and export | Versioned source, 351 tests, TypeScript/Webpack build, dated browser and model evaluations | Implemented; recorded failures retained. |
| 2. Submission release | Project owner: make the repository public, verify judge links, rehearse and submit. Materials, acknowledgements, quota changes and the approved video are prepared. | Confirmed setup with real inference, restart/history/export, accessible links, final commit and portal receipt | Materials prepared; public visibility and portal submission remain owner actions. |
| 3. Supervised shadow pilot | Airline operations sponsor + privacy/security leads: define users, data contracts, retention, access controls and qualified escalation owners | Approved protocol; no operational execution; verified input provenance and trained reviewers | Proposed; no real-data access or partner commitment. |
| 4. Reliability and usability evaluation | Evaluation lead + independent domain reviewers: broader holdouts, false-positive/false-negative analysis, bilingual accessibility and actual-user exercises | Agreed thresholds for factual support, usable replies, stop accuracy, failure recovery, cost/latency and review burden | Proposed; thresholds require stakeholder agreement. |
| 5. Conditional integration | Authorized airline/airport owners: read-only feeds, provenance authentication and governance before any workflow integration | Audited data quality, rollback/incident response, monitoring, privacy approvals and explicit human sign-off | Future only; no autonomous dispatch or publication promised. |

## Value and its measurement

The intended value is a single inspectable chain from evidence to interpretation, suggested checks, draft communication and reviewer rationale. Existing measurements establish usable-result rates, repair overhead, qualitative limitations, latency, application-estimated cost and preservation behavior. They do not quantify human time saved or financial return.

Manual-versus-app timing and a basic-prompt comparison were intentionally skipped for this submission. A future pilot could compare matched tasks for completion time, correction burden and evidence-check accuracy, with genuine participants and a preregistered rubric. This is a future proposal, not a hidden outstanding experiment in the current package.

## Accepted limits and deferred decisions

The remaining supplied/unseen quality failures and D05 blocked reassessment were accepted for the hackathon prototype. Broader fixes should be prioritized from repeated failure evidence, not prompt additions for every phrase. Keep deterministic constraints and review responsibilities visible. No production deadline, airline partnership, measured savings or regulatory approval is claimed. Real deployments require a separate scope and approval.
