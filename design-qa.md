# Guided airport workflow — design QA

> The visual design recorded here (charcoal surfaces, amber emphasis, green Accept) was replaced by the black-and-white redesign described in `docs/IMPLEMENTATION.md`. The workflow, stage logic and tests below still apply.

Date: 2026-10-20

final result: passed

## Visual target and captures

Approved source:
`/Users/benjamin/.codex/generated_images/01a1546f-8d0b-7d93-8326-38c4e4173d47/exec-9b96efad-97c3-4f01-8f2f-e0f68b476f84.png`

The source is a 1672 × 941, five-screen storyboard, not a single browser viewport or pixel specification. Its individual frames have different proportions. Comparisons used the matching workflow state in dark mode, with the original storyboard and rendered captures supplied together in the same comparison input. No frame stretching or pixel-diff threshold was used.

Browser screenshots are in `tmp/guided-qa/` (local QA artifacts, intentionally ignored by Git):

| State | Capture | Browser CSS viewport / image pixels |
|---|---|---|
| Workspace, initial layout | `home.png` | 1280 × 720 / 1280 × 720 |
| Workspace, corrected layout | `home-final.png` | 1280 × 720 / 1280 × 720 |
| Situation and Evidence | `preflight.png` | 1280 × 720 / 1280 × 720 |
| Analysis running | `analyzing.png` | 1280 × 720 / 1280 × 720 |
| Airport hub, final layout | `hub-final.png` | 1280 × 720 / 1280 × 720 |
| One decision | `decision.png` | 1280 × 720 / 1280 × 720 |
| Phone hub | `mobile-hub.png` | 390 × 844 / 390 × 844 |
| Phone decision | `mobile-decision.png` | 390 × 844 / 390 × 844 |
| Phone home, Chinese | `mobile-home.png` | 390 × 844 / 390 × 844 |
| Actual saved workspace | `live-home.png` | 1280 × 720 / 1280 × 720 |

Captures are at one image pixel per CSS pixel; no density normalization was needed. The storyboard is compared as a miniature design reference. Typography, icons and controls were readable in the full-resolution comparisons, so additional focused crops were unnecessary. Tablet overflow was checked separately at 1024 × 768. Temporary viewport overrides were reset.

## Findings and comparison history

1. **P2 — first home layout placed the bottom card edges below the initial desktop viewport.** `home.png` showed the second row clipped. Reduced the desktop top spacing, brand gap and minimum card height. `home-final.png`, compared with the source again, shows the complete five-card grid; `live-home.png` also fits six saved incidents. Resolved.
2. **Final comparison:** no remaining actionable P0/P1/P2 issues. The reference's composition is preserved: simple airport home, two pre-analysis sections, focused progress, six navigation boxes, and one review card with a back control.

### Required fidelity surfaces

- **Typography:** system sans serif with clear title/body/control hierarchy, restrained weights, and readable real recommendation text. The generated reference does not identify a font family; no claim of an exact typeface match is made. Longer real content wraps naturally instead of being truncated to the sample copy.
- **Spacing/layout:** generous padding, charcoal rounded surfaces, persistent desktop airport rail, three-column desktop hub and two-column phone hub. No horizontal document overflow at 390 or 1024 CSS pixels. The hub displays only its six boxes in the main area.
- **Colors/tokens:** near-black background, charcoal cards, warm white text, amber decision/progress emphasis, green Accept and restrained red Reject. Existing light-theme support remains; visual reference comparisons used dark mode.
- **Assets/icons:** reused the app's existing AeroContext wing-A mark; Lucide provides the other icons and progress indicator. No decorative images or generated asset placeholders were introduced.
- **Copy/content:** the action reads “Start analysis.” Navigation labels match the approved flow. Real source text and model outputs remain intact. The model's actual recommendation count drives progress, rather than the storyboard's example count of four.

Expected differences: home cards include airport names and incident titles to distinguish custom incidents; source inspection, reviewer alias, cancellation and language controls remain available. Source and generated content can be longer than the storyboard examples. The Next.js development badge appears only in development captures.

## Functional verification

Browser interaction tests ran against a separate local fixture server on port 3001 using temporary data and controlled AI responses. They did not make paid provider requests or mutate the user's saved workspace.

- Airport selection, unassessed neutral status, and only Situation/Evidence before analysis.
- Analysis hides the previous main content; switching to BEI while HAI runs does not display HAI's timer. HAI completion does not redirect the active BEI screen.
- Completion opens exactly six hub buttons.
- One recommendation at a time; failed save leaves the card available to retry.
- Accept persists and advances. Modify records revised text and reason. Reject enforces a nonempty reason.
- Leaving and reopening resumes the first unfinished decision; completing all five fixture recommendations returns to the hub.
- Saved acceptance, modification and rejection records are visible in Record & export.
- Situation, Evidence, Messages, Ask AeroContext and Record & export open independently and return to the hub.
- Draft revision saves and displays. Discussion stays in its own view and does not trigger the full analysis screen.
- Cancellation restores preflight without a timer.
- Phone decision controls, airport drawer, Chinese labels, and tablet layout work.
- No browser warnings/errors in the mobile and actual-workspace console checks. The deliberately injected failed-save request was expected in its separate test tab.

Automated verification: **34 tests passed**, including six new stage/resume regression tests; TypeScript and the production build passed. The new state tests cover stale snapshots, recovered runs, failed/cancelled runs, prior-assessment review isolation, pending decisions and completion.

Actual app verification: opened `http://127.0.0.1:3000`, confirmed the saved six-incident workspace rendered with current risks and neutral unassessed states, and captured `live-home.png`.

## Implementation checklist

- [x] Approved workflow implemented using existing APIs and persistence.
- [x] Original drafts, source inspection, history and export retained.
- [x] Responsive and bilingual behavior verified.
- [x] Initial visual finding corrected and re-compared.
- [x] Production build, typecheck and regression suite passed.

No open design questions. No new real-model evaluation or formal screen-reader audit was performed in this UI change.
