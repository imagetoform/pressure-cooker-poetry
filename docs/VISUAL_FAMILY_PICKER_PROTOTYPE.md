# Visual family picker: three rounds / thirty movements

This branch is a non-production experiment at `/visual-picks/`. Its art is **temporary coded SVG sketches**, not verified photographs or assets belonging to the design families. The cutout library has only a small number of reviewed actual pieces, so representative visuals for each family still need to be created or cleared. Do not call the sketches real family artwork.

## Interaction
- 3 rounds of 10 different family concepts; choose one in each round.
- 30 families appear once. Labels are withheld during selection to reduce vocabulary/status bias and revealed after selection.
- Every choice is keyboard, touch, mouse accessible. Back preserves selections.
- Output a local copyable `pcp.visual-family-picks.v1` manifest of three family IDs and their current editorial emotion tags.
- No demographic inference, psychological test or tracking.

## Engine integration (not implemented in this prototype)
1. Source family IDs and editorial emotion tags dynamically from `site/src/styles.js` rather than duplicated prototype metadata; the prototype lists families locally.
2. Replace each generic SVG with a **representative cleared cutout** or a family-authored kit composition. Each must be visually distinct and legible at 170 px. Verify attribution and license before publication.
3. Use the three family selections as **preferences**, not as three asserted measured emotions. Family tags influence weights on eligible families, while retaining the existing wheel as a design metaphor.
4. Keep the current Kitchen engine and deterministic seed. Build an adapter from selected family IDs and seed to a composition manifest. Do not rewrite authored poems.
5. Explicitly resample layout details when the user requests "another interpretation" with a new variant seed; same input+seed stays stable.
6. Test position bias. Rotate a fixed, balanced assignment of families across rounds, or randomize with a stored seed and known probabilities, so a family is not permanently assigned to a more-favored round.
7. In user tests, compare art satisfaction against original ingredient selection; never claim gender/personality prediction based on visual clicks.
8. Review responsive behavior, click/keyboard focus, visual quality, accessibility and build before merging.

## Deployment
The existing `site/tools/assemble.py` copies the entire `site/landing/` directory into `site/public/`, so the prototype path would be available after the standard build and deploy. This branch has not been merged or deployed.
