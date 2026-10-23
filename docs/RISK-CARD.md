# 航衡 · AeroContext prototype risk card

**Intended use:** education and hackathon demonstration with the supplied fictional airline data and explicitly simulated new incidents.

**User:** an operations coordinator reviewing evidence and preparing material for the responsible human reviewer.

**Outputs:** qualified risk assessment, evidence references, information gaps, suggested checks or referrals, and three draft communications. The app has no mechanism to send messages or operate flights.

| Failure condition | Expected behavior |
|---|---|
| No adequate current evidence | Unable-to-assess rating, gaps, and verification/referral |
| Forecast without official flight status | Distinguish forecast risk from confirmed delay or cancellation |
| Historical anomaly | Focused historical review; no automatic current high risk or causal conclusion |
| Conflicting reports | Preserve uncertainty and request scope/time clarification |
| Professional decision requested | Preserve supported risk; require the relevant professional |
| Safety issue or unreliable material source | Stop action conclusions and refer; assess risk independently |
| Missing-weather flag with numeric cells | Preserve the original row for inspection; do not treat those values as reliable weather facts |
| Personal data | New input pauses for false-positive resolution, previewed masking or removal. RULE011 cannot be overridden by human approval. No automated output privacy filter. |
| Model truncation, timeout, or invalid result | Preserve prior valid assessment; record failure and usage uncertainty |
| Newer snapshot while model runs | Keep old result only in history |
| Budget or quota exhausted | Keep reading, manual review, and exports available; disable new generation |

**Known limitations:** source verification and independence metadata are user assertions; risk levels are a prototype policy; monthly data cannot resolve real-time flight conditions; input privacy pattern detection can miss information or flag ordinary data, reviewer identities are self-reported, false-positive decisions can be incorrect, existing records are not retrospectively cleaned, model output has no privacy filter, and remaining prose checks are incomplete; valid structured output can still contain unsupported reasoning or poor wording. A completed independent evaluation is not yet available.

**Human responsibility:** verify sources and claims, correct incident inputs, review audience suitability, and obtain the appropriate professional decision. Never treat this simulation as authority for cancellation, release, dispatch, maintenance, compensation, or real passenger communication.

**Data handling:** isolated cookie workspaces; versioned local SQLite history; server-side provider key; explicit JSON export; bounded generation budgets. The provider receives the simulated incident and relevant evidence. Avoid entering personal or confidential operational data.

**Current evidence:** local real-model workflow, persisted history, agent-driven QA review, 28 deterministic tests, and a production build. These are not a real-world safety certification, independent operational validation, or final hackathon evaluation.

**Before wider use:** complete the plan's held-out and bilingual tests, human claim review, authorization and data-governance design, deployment isolation and retention review, and validation with appropriate domain professionals using authorized data.
