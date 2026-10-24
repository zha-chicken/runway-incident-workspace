# D01 final presentation adoption — 24 October 2026

The owner approved the final ten-slide PPTX after Claude's guided-workflow revision and the owner's own edits. That PPTX is the final source of truth and is adopted byte for byte. Its matching ten-page PDF is adopted without regeneration. [PPTX](D01-client-presentation.pptx), [PDF](D01-client-presentation.pdf), [speaker script](D01-speaker-script.md).

## Final presentation

- Slide 3 adds the owner's statement, “I value UI/UX as much as analysis logic,” and his explanation of guided interaction.
- Slide 4 illustrates the implemented workflow using five real prototype captures: choose/create an incident, start analysis, focused progress, six main blocks, and the completed-decisions banner. Its heading and owner credits follow the final PPTX.
- The results table is now slide 7. Claude corrected all 28 cells' left/right margins from 8 inches to 8 points. The earlier recorded table-height warning identified a real source-formatting defect, even though Keynote's PDF displayed the old table correctly. The current layout check reports no warning.
- Figures, citations, disclosures and evaluation provenance are retained. The evaluation footnote still distinguishes original supplied tests at `7bde4c8`, rerun/unseen code later committed as `8ad14e3`, and no new model evaluation for app `27f5ec9`. [Source provenance](EVALUATION-PROVENANCE.md).
- The nine pre-existing note bodies retain their wording under the new slide order. Slide 3 has no embedded notes; the PPTX has not been altered to add any. The separate speaker script is renumbered to ten slides and includes the owner's slide 3 wording. Rehearsal is still needed to confirm the five-minute target.

## PDF export and checks

The first Keynote export omitted slide 3's headline. The final PDF uses the Keynote export for the other nine pages and the LibreOffice export for slide 3, combined with pypdf. Each page remains selectable text; no slide was replaced with a screenshot. This export process did not modify the source PPTX.

All ten final PDF pages were visually inspected. All extracted PPTX text fragments longer than one normalized character appear on their corresponding PDF page, including Chinese text, numerical results and footnotes. Package integrity, declared layout, native-table checks and Artifact Tool import passed for ten slides. The native results table remains editable. Native PowerPoint rendering and animation playback are still unverified; structural validation and another renderer do not prove native playback.

[Comparison receipt](provenance/presentation-checks.json) records exact source/output hashes, content preservation and export method. [Validation receipt](provenance/presentation-validation.json) records the current ten-slide checks. The source revision's earlier nine-slide changelog is retained in its original local folder; it is historical authoring context, not the verification record for this final edition.

## Preservation and publication

The prior nine-slide published files are preserved at Git commit `c9cd2e4` and in a separate local backup of all 713 tracked files, the previous D08 ZIP/checksum and the checklist. Earlier originals remain preserved at their original checkpoints. The approved source PPTX/PDF and Claude's authoring folders remain unchanged. Frozen evidence, synthetic feedback data, technical report, video and application files are unchanged by this adoption.

This final presentation edition updates submission materials only. No model calls, app/runtime-data edits or Git-history rewrites were performed. D08 and its checksum identify the same edition and must be downloaded and verified together. The repository's visibility and final submission remain owner-controlled.
