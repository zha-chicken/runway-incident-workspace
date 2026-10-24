# Synthetic feedback demonstration — actual execution and reply review

October 24, 2026. Scenario, reviewer decisions and exercise outcomes are synthetic. This is development review, not independent human evaluation. App code and previous evaluations were not changed.

**Result: five new review examples and two later outcome revisions saved successfully. The fresh rejection → reassessment did not produce a saved new assessment.** Initial generation passed; reassessment exhausted its existing single repair and returned `MODEL_OUTPUT_INVALID`. All raw replies are preserved without rewriting.

## What was created and what was observed

- A new fictional HAI incident, with a 16:00 high-risk snapshot and a later 17:00 snapshot supported by newly authored exercise reports. The original assessment has five real model recommendations in English and Chinese.
- Five synthetic reviewer decisions tied to those exact original recommendations: two accepted, one modified, one rejected and one pending. All nine workbook fields are present; unobserved actions/outcomes remain empty/pending.
- Reassessment input includes all five full reasons, original recommendations and prior-snapshot labels; zero reviews omitted. The initial outcome states were all pending when that request was sent.
- Two later revisions record an explicitly fictional report-comparison outcome and the actual failed reassessment attempt. All five earlier revisions remain intact, for seven total.
- The production route handlers and storage were exercised in an isolated database. No browser usability check or real participant study was performed here.

## Actual calls and validation

| Stage | Provider calls | Route latency | Result |
|---|---:|---:|---|
| Initial assessment | 1 | 91.049 s | HTTP 200; saved high risk; validation passed without warnings |
| Reassessment | 2, including the existing repair | 106.040 s | HTTP 502; `MODEL_OUTPUT_INVALID`; no new assessment saved |

App-estimated cost across three calls: **CNY 0.433225**. Model: `deepseek-flash`, reasoning effort `high`. No judging-model call or additional rerun. Exact usage, provider IDs and validation messages: run-ledger.json (`run-ledger.json`; local supporting artifact excluded from this distribution). App version: `7bde4c8` plus the existing, unchanged five-file local context patch, fingerprinted in source-state.json (`source-state.json`; local supporting artifact excluded from this distribution) and source-manifest.json (`source-manifest.json`; local supporting artifact excluded from this distribution).

### First reassessment attempt

Blocking issue: **`Facts require evidence.`** Its final rationale item, `rationale[10]`, declares that the outputs are labeled simulation/draft and use no personal data, marks that item `kind: fact`, and supplies empty `evidenceIds` and `metricIds`. The schema/grounding contract requires citations for a fact. This is not an invalid-JSON or provider outage failure.

Five additional numeric/citation advisories were recorded: 69.49%, 73.16%, the Chinese five-point threshold, 88.36% and 92.16%. The four percentages match their retrieved source values; the five-point threshold is supplied in RULE003 but that rationale item did not cite it. These advisories were separate from the blocking empty-evidence fact. We have not changed the numeric matcher or claimed all warnings are valid semantic errors.

### Repair attempt

Blocking issue: **`Unknown evidence reference: REPORT:D05-SUPPORT-HEAD`.** It occurs in `possibleImpacts[1].evidenceIds`, alongside the real `REPORT:D05-SUPPORT-CLEAR`. The input contains WIND-INITIAL, SUPPORT-INITIAL, SUPPORT-CLEAR and WEATHER-CLEAR; no SUPPORT-HEAD report exists. This is a fabricated citation identifier, so the app correctly refused to save the reply. The repair also retains one numeric advisory concerning 69.49%, which matches the cited July 2025 completion metric.

The last valid high-risk assessment remains associated with snapshot 1. The snapshot-2 policy computes low risk, and both rejected model replies also propose low risk, but **there is no saved low-risk reassessment**. A raw rejected candidate must not be presented as a successful application result.

## Feedback-specific reasoning in the rejected replies

| Saved synthetic review | Observed candidate behavior | Limit |
|---|---|---|
| Accept source/time verification | Both candidates retarget verification to the new 16:55/17:00 reports. | Proposed verification is not proof of contact or execution. |
| Modify “short intervals” | First candidate proposes an owner-and-trigger checklist; repair explicitly asks the operations lead to assign a duty desk and approve cadence. Both say it has not started. | This is textual incorporation in rejected candidates, not a saved revised recommendation. |
| Leave draft approval pending | Both candidates retain reviewer approval and distinguish preparation from sending. | No approval or sent notification is fabricated in the stored records. |
| Reject carrying forward the old high escalation | Both link the change to new recovery reports and expired old reports. Repair explicitly says rejection alone does not establish the present rating. | Rejection does not override the risk policy; successful persistence remains unproven in this run. |
| Accept provenance log | Both keep earlier and current report IDs and time applicability visible. | Original records were preserved by the app; no operational success is claimed. |

The rejection means “do not reuse the earlier escalation unchanged for a later snapshot,” not “the original high-risk recommendation was wrong.” New evidence supports the policy change; reviewer disagreement alone does not.

## Bilingual qualitative review

The saved initial assessment correctly explains both matching report offsets (−10 and +5 minutes), two adverse signals and expanding support impact. Its passenger draft states unknown flight status without inventing execution. Both cited historical anomaly deltas match the data and are separated from current causation. **Verdict: PASS WITH NOTES.** The hypothetical escalation text overstates the stop rule: it says report conflict alone stops action conclusions, while the actual policy requires safety/unknown-reliability conditions. No current stop flag was wrongly set in this case. This is a documented wording limitation, not a fix made here.

Both reassessment candidates correctly distinguish the old reports at −70/−55 minutes from new reports at −5/0 minutes, preserve unknown official flight status and generally incorporate the synthetic feedback. Review of both languages nevertheless found issues beyond the validator:

1. **First candidate wrongly calls coverage missing.** `rationale[8]` says that coverage of every previously short zone is unstated. SUPPORT-CLEAR explicitly says resources meet demand in both previously affected zones. Residual baggage backlog really is unknown; it should not be conflated with the stated zone coverage.
2. **First candidate overstates exposure from annual scale.** `possibleImpacts[4]` says recurrence “would touch a large operation and many connecting flows.” Annual passenger volume establishes airport scale, not affected connections or the extent of a hypothetical current event.
3. **Both repeat a misleading independence gap from supplied policy context.** The two stable current reports have distinct `independenceGroup` values and verification bases. The policy's returned `independentGroups` counts adverse reports only, so it is empty here; its generic “independent identities not established” gap should not be treated as proof that these stable reports lack source metadata. No policy/risk code was changed for this demonstration.
4. **Repair invents SUPPORT-HEAD.** The nonexistent citation is the decisive save blocker, regardless of whether the adjacent conditional sentence is plausible.
5. **Repair misstates one earlier time in an assumption.** It calls the earlier gust bulletin a 16:00 bulletin; its applicability/creation time is 15:50, while its text concerns the 16:00 scenario. Other passages give the correct 15:50 time. These times should remain distinct.
6. **Repair passenger wording adds an unsupported organizational commitment.** It says further information will only be published once official status exists (Chinese: no further publication before official status). That publication commitment is not in the reports. The policy permits clearly labeled uncertainty and official-channel guidance; the model should not invent what an organization will publish.

The historical percentages and deltas themselves match retrieved rows: July 69.49% / −15.62 pp; August 73.16% / −10.99 pp; December completion 88.36%, release normality 92.16%, completion delta +4.60 pp. The December sentence's delta follows two metrics and is somewhat ambiguous; the delta is for completion, not release normality. These correct numbers do not cancel the other defects.

**Reassessment verdict: NO USABLE RESULT.** Feedback incorporation was observed in rejected candidates, but a complete successful feedback loop was not demonstrated. No model output was silently edited and no failing result was relabeled as a pass. Further paid reruns or app fixes require another decision.

## Files and verification

- [Submission examples](../../D05-synthetic-feedback.md), [CSV](../../D05-synthetic-feedback.csv), [JSON](../../D05-synthetic-feedback.json).
- [Saved initial output](initial-readable.md), [first rejected reply](reassess-attempt-1-readable.md), [rejected repair](reassess-attempt-2-readable.md).
- Exact reassessment input (`reassess-input.json`; local supporting artifact excluded from this distribution), [original review plan](review-plan.json), [later outcome revisions](outcome-plan.json), final isolated export (`current-export.json`; local supporting artifact excluded from this distribution).
- [Record/preservation checks](workflow-checks.json), [source/live-data integrity](integrity-after.json), credential scan (`credential-scan.json`; local supporting artifact excluded from this distribution).

Keep the SQLite database and runtime session material out of publication. The three submission files contain synthetic records without a session credential; raw local artifacts are retained for audit. All live incident/chat data and earlier evaluation artifacts are preserved.
