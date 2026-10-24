# Why UNSEEN06-en returned no answer

The application returned `MODEL_OUTPUT_INVALID` after the permitted single repair. Both provider calls completed with valid JSON. No provider outage or JSON parse failure occurred.

The first answer used correct percentages but put source references outside some table cells, producing ten citation-placement warnings and triggering repair. The repair added table-row citations. It then repeated a comparison in an uncited paragraph: April was **+4.57 percentage points above its own historical mean but below the peer mean of 86.12%**.

The numeric checker searches nearby text for “below”/“低于” to infer a negative percentage-point magnitude. Here that word belongs to the separate peer comparison. It nevertheless converts +4.57 to -4.57 for validation; no such negative delta exists in this retrieved evidence, so both languages receive a blocking error. The uncited 86.12% is a nonblocking advisory.

A pure, offline replay of the unchanged checker reproduced the errors. Removing only that peer-direction word in an in-memory diagnostic changed the +4.57 issue from blocking to an ordinary citation advisory. This is a diagnostic experiment, not an app fix or alteration to recorded replies. No model call was used.

See raw replies (`raw-attempts.md`; local supporting artifact excluded from this distribution), [diagnostic output](validator-diagnosis.json), app result (`final-result.json`; local supporting artifact excluded from this distribution), and saved run/export metadata (`final-export.json`; local supporting artifact excluded from this distribution). The requested historical distinctions and numerical values were largely correct in the raw reply, but the user received no usable discussion. This case is therefore recorded as **NO_USABLE_RESULT**, not a pass.
