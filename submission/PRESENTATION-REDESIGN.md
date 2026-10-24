# D01 redesign adoption — 24 October 2026

The owner requested adoption of Claude's redesigned nine-slide presentation and PDF. Claude used PptxGenJS for the editable deck and Keynote for PDF export. The approved design, figures, source references, limitations and speaker-note wording are retained. [Final PPTX](D01-client-presentation.pptx), [PDF](D01-client-presentation.pdf), [speaker script](D01-speaker-script.md).

## Corrections during adoption

Slide 6 now says: “Original supplied tests: 7bde4c8. Rerun and unseen tests: code later committed as 8ad14e3. No model reevaluation for 27f5ec9.” Saved source manifests, rather than prompt names, establish this distinction. See [evaluation source provenance](EVALUATION-PROVENANCE.md).

The PPTX had eight unused content-type declarations for missing slide-master files. Those declarations were removed; no relationship referenced them. Only this metadata and slide 6's footnote differ from Claude's PPTX. Every other package part, including all transitions, entrance animations and media, is byte-identical.

Acknowledgements now credit Claude's presentation redesign, PptxGenJS and Keynote, and Codex's provenance correction and package refresh. The technical report retains its design while synchronizing provenance and credits. No recorded replies, verdicts, costs or app behavior were changed.

## Checks and limits

- Package integrity, layout/font checks and first-party re-import passed for nine slides. The native table is present; no summation check applies to this metrics table.
- All nine final PDF slides were visually reviewed, including the complete slide 6 table and footnotes. Text is selectable. Every displayed numeric token remains in the PDF text layer.
- At 95 dpi, eight pages are pixel-identical to Claude's PDF. Only the corrected footnote changes pixels on page 6. All extracted page text matches Claude's export after that replacement.
- All nine speaker-note bodies retain their wording, compared with paragraph whitespace normalized against the prior published deck. The separate speaker script is unchanged.
- The layout validator emitted a table-height heuristic warning for slide 6. The complete table fits in the Keynote PDF. Native PowerPoint layout and animation playback remain unverified; importing or examining XML does not prove playback compatibility.

[Machine-readable comparison](provenance/presentation-checks.json) records source/output hashes and per-page pixel results. [Package validation receipt](provenance/presentation-validation.json) retains the structural checks and warning.

## Preservation and publication boundary

The prior published deck, PDF, reports and all other tracked files are preserved in Git at `920ee97` and in a separate local backup. The previous D08 ZIP/checksum and Claude's unmodified authoring folder are also preserved outside the distribution. Frozen evaluation evidence remains byte-identical to the prior publication copies; original source hashes and distributed evidence hashes are retained.

This edition changes presentation and submission materials only. It makes no new model calls or database writes, preserves existing Git history and leaves repository visibility under the owner's control. D08 distributes the synchronized materials as a matching ZIP/checksum pair through the existing submission release.
