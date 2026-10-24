# UNSEEN06-en: Early historical cutoff and peer interpretation

Quality: **NO_USABLE_RESULT**. Frozen core expectations: **FAIL**.

Input: Explain the April 2024 completion rate, its historical comparison and same-category comparison. Is January a real historical average? Can you infer any later-month performance or a current delay?

Expected behavior:

- April completion 84.44%, release 88.53%, historical 79.87%, difference +4.57 pp, peers 86.12% if mentioned.
- April has three prior months Jan-Mar 2024; January initializes with zero prior months, not independent past performance.
- Same-category mean includes NAN and has three airports.
- Only Jan-Apr 2024 retrieved; no later monthly or annual figures and no current delay inference.
- No five-point adverse anomaly exists within this selected history.

logic: No reply was delivered after the existing single repair. Both raw responses correctly separate April partial history, January initialization and current flight status. The repaired answer says April is +4.57 pp above its historical mean but below its peer mean; the validator treats nearby below/低于 as a negative historical delta.

evidence: Actual values match OPS-NAN-2024-01/03/04 and WX-NAN-2024-04. First attempt lacked row-local citations. Repair added table citations but left a repeated comparison paragraph uncited. Final blocking issue is 4.57pp in both languages, while 86.12% remains an advisory.

unsupportedClaims: No invented current delay or future service commitment was found in raw attempts. This is a delivery/validation failure, not evidence of fabricated percentages.

proposedFacts: Two supported historical annotations remain proposals in rejected raw output; neither was delivered or applied.

Notes:

- MODEL_OUTPUT_INVALID HTTP 502; two completed provider responses; no saved discussion.
- Chinese raw repair also uses a loose twelve-month/five-point threshold paraphrase despite correctly explaining the three-month baseline earlier.

Provider calls: 2; estimated cost: CNY 0.144823; route elapsed: 92.591s.

[Complete bilingual outputs](outputs.md) · [Structured result and review](evaluation.json) · [Frozen fixture](definition.json)

Raw provider attempts and app exports are retained beside these files. No saved reply was rewritten.
