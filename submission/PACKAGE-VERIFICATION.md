# Package verification — 24 October 2026

Historical checkpoint: this report describes packaging of `8ad14e3`. For the refreshed `27f5ec9` distribution, see [publication verification](PUBLICATION-VERIFICATION.md). Original results below are retained.

These checks were performed while assembling the submission; no real model calls were made.

| Check | Result |
|---|---|
| Source archive | 95 tracked files match commit `8ad14e3ca10538f4a4fcf2ba5ce39f52c72e99b9` byte for byte. |
| Clean dependency installation | `npm ci --offline --no-audit --no-fund` passed in a separate source copy, using the local npm cache and Node 24.15.0. This is not an uncached Internet install. |
| Workbook import | `npm run data:import` passed; supplied workbook hash/dimensions checked. |
| TypeScript | `npm run typecheck` passed in the clean copy. |
| Automated tests | `npm test`: 345 passed in 18 files. |
| Default production build | Fresh package-copy attempt was blocked by the local environment when Turbopack tried to bind its worker port, including the elevated retry. Earlier current-source default-build success remains recorded in `evidence/supplied-current/verification.json`; no new default-build success is claimed here. |
| Webpack fallback | `npm run build -- --webpack` passed in the isolated copy without application edits. |
| Presentation | Nine slides; structural/layout/font/native-table checks passed. Final PPTX re-imported and rendered identically to the inspected slide images; all nine slides visually reviewed. The companion PDF is a fixed slide-image export; edit the PPTX for changes. Native PowerPoint execution was not tested. |
| Technical report | Twelve-page PDF; all final pages visually reviewed, with embedded fonts for the English and Chinese text. Markdown source included. |
| Evidence preservation | D05 originals and original run summaries hash-checked unchanged; distributed byte-identical evidence is listed in `evidence/MANIFEST.json`. Extracted provider reply files omit deliberation and transport state. |
| Distribution | Archive hash manifest, source equality, required-file coverage, ZIP integrity and credential/excluded-file checks are recorded in `package-verification.json`. |

## Reproduce without changing this package

Unzip D08 into a fresh directory, verify `MANIFEST.sha256`, then follow `materials/D02-prototype-and-demo.md`. If the default build hits the same worker-port restriction in your environment, use the verified Webpack command above; keep the restriction visible in your verification notes. Never point this copy at an existing incident database.

No fresh real-inference startup, restart-persistence workflow, hosting, remote judge access or Docker verification was performed during packaging. Those remain release checks. Historical model outputs are evidence of the recorded calls, not promises of identical future results. Repository documentation synchronization and final publication approval also remain release work.

The clean copy emitted dependency deprecation warnings during installation. No dependency upgrades were attempted: this package preserves the tested lockfile.
