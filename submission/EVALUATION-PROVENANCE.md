# Evaluation source provenance

The Git HEAD recorded at a run and the bytes tested can differ when a working-tree patch has not yet been committed. These distinctions do not change any recorded result.

| Evaluation | Recorded source state | Verified correspondence |
|---|---|---|
| Original supplied tests | Clean source at `7bde4c8` | All 93 source files match that commit. |
| Supplied rerun | `7bde4c8` plus the five-file context patch | All five saved patch files match `8ad14e3`. |
| Unseen tests | `7bde4c8` plus the same uncommitted patch | All 95 source files match `8ad14e3`, with no missing or mismatched files. |

The unseen plan froze at 09:31:21 on 24 October 2026 (GMT+8); the run completed at 09:46:07. Commit `8ad14e3` was created at 10:08:36. The later commit captured the tested source; its hash was not the Git HEAD during the run. Prompt names alone were not used as proof.

[Machine-readable checks](provenance/source-checks.json) compare the [original-run manifest](provenance/supplied-original-source.json), [rerun patch manifest](provenance/supplied-rerun-patch.json) and [unseen manifest](provenance/unseen-source.json) against Git blobs. These are byte-identical copies of saved provenance records. The original frozen plans, source-state records, replies, verdicts and timestamps remain unchanged.

Application code in the submission is `27f5ec9`. The quota/concurrency change has its separately recorded 351-test verification; no real-model reevaluation was performed for that version. The original results column must not be labeled as an `8ad14e3` run.
