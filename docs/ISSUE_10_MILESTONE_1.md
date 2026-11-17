# Issue #10 — working visual Kitchen increment

Baseline: `ed485186080755cdb243ccb5ab57fc9c4e4f83cb` (fresh main, PR #8 included).
Branch: `feature/issue-10-visual-recipes`.

## Inventory and reconciliation

- Main: working deterministic Kitchen, taste matrix, emotion dartboard, six layout grammars, 30 style families / 523 kit parts, original poems and essays, learning workshop, opt-in Resonance Engine.
- Cutout manifest: **two** kept Constructivist artworks. Landing's 225 WebP fragments are a separate legacy collection; no new rights claims are made for them.
- #9: inspected isolated visual picker and placeholder SVGs. New implementation uses original generated representative artwork instead, with provenance in `site/visual/assets/provenance.json`.
- #6: reused only the two editorial HTML shells, rewrote their catalog to link actual published Kitchen poems/essays. Kept newer `/learning/`; `/learning-curve/` redirects there.
- #7: design-only brief; text interview superseded. No branch merge.
- #4: harvesting pipeline only; no claim of 200 completed assets. No merge.
- #3: four review-only originals, left untouched.
- #1: rights-review proposal inspected; not merged. No research assets newly published.
- Older branches include removals of newer Learning Curve / Resonance work. None were merged wholesale.

## Implemented

The front door offers three shuffled rounds of ten art fragments, covering all 30 stable IDs exactly once per deal. Visual descriptions are accessible names; names and editorial tags do not prejudge the choice. Keyboard, touch, back/edit and reduced motion work without login. The full pantry remains at `/kitchen/`; the original collage and opt-in sound experiment remain at `/collage/`, without the cabinet avalanche.

`adapter.js` uses the existing taste matrix, dartboard asset picker, conditional layout odds, engine PRNG, genome and renderer. Separate darts retain each family's editorial tags, including contradictions. All three styles decorate the room; all three chosen original fragments remain visible outside the reading region. Original writing is used verbatim. Layout grammar is separately sampled with selected-family bias. No mathematical uniqueness or psychological inference is claimed.

Poems and Essays search published writing and deep-link to its existing readers. About and Contact are usable routes; Contact points explicitly to public GitHub issues, not an invented private inbox.

## Receipts and limits

`pcp-visual/1` stores three ordered family IDs, an explicit variant seed, adapter version, PRNG (`cyrb128-sfc32/warmup15`) and SHA-256 build fingerprint. The build fingerprint covers extracted engine/data/renderer, style kits, adapter/UI, CSS and local published art. No timestamps or machine paths enter the fingerprint. Display order is independent of composition.

Copy link, JSON download/import and one opt-in local save are supported. Changing seed preserves families. Current-build receipts replay deterministically; **incompatible builds are rejected explicitly**, not silently rendered with new assets. Keep the corresponding Git commit/build artifact to replay older receipts. Historical engine hosting and archival image snapshots remain later work. The composition adapts to wide/narrow viewports; receipts do not promise identical pixels across devices, fonts or browser versions.

Artwork: original AI-generated 30-study collage atlas, not placeholder SVGs and not historical source artwork. Implementation visual QA completed; owner art-direction review is still pending. It is one roughly 4 MB image; image delivery optimization and individual transparent cutouts can follow without pretending this is a full curated museum library.

## Verification

Run:

```sh
python3 site/tools/build.py && python3 site/tools/assemble.py
python3 -m http.server 8765 --directory site/public
# another terminal, with Playwright and Chromium installed:
node site/tests/visual-flow.cjs
```

Browser suite: desktop 1440×1000, Pixel 7 Chromium emulation, and 320px touch viewport, all with reduced motion. Verified three rounds / 30 unique IDs, keyboard Space selection, back/edit, same-seed reload, remix preserving families, local save, JSON download/import, incompatible-version handling, editorial deep links and search. 600 deterministic compositions preserve every authored poem line, exercise all six grammars, and verify each selection influences output. No page errors or local asset HTTP failures. Two pre-existing absent Kit-4 PNG requests were changed to direct use of the already-existing procedural fallbacks.

Screenshots are generated under ignored `shots/`; CI uploads them with the full public build. Pixel 7 is **emulation**, not physical-device certification. Screen-reader and physical Android checks remain release review tasks.

## Deployment evidence

Existing Netlify project: `1176071c-2c46-48fb-82b5-1a87a714fb04`, `pressurecookerpoetry`.
Inspected production deploy: `6af27a382b846f243237edb2`, published 2026-11-10 01:59 UTC, upload/API source, no commit reference or branch. It is not evidence that current main is live. Read tools report non-production team-login protection. Repository build config remains the documented Python build + assemble, publishing `site/public`.

Available Netlify tools can inspect but cannot upload a deploy or read Git build settings. This workspace has no Netlify CLI credential. No new project, production publish, Git integration change or guessed preview URL. The PR's CI build artifact is the reproducible review package; a Netlify preview remains dependent on existing Git integration or authenticated draft upload.

## Later development (not launch dependencies)

Brain Candy Play → Reveal → Learn; accessible fictional Department Zero / escape-room experiments; optional OAuth and profiles; portable receipt import into future accounts; opt-in preferences; moderated submissions/community and badges. No social APIs, profiling, analytics, microphone prompts, account backend or complex moderation system added. Keep future modules independent of the anonymous recipe contract.
