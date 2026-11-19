# PRESSURE COOKER POETRY — LIVE ENTRY DESIGN (2026-11-19)

This is the current homepage design. Previous cutup-card-specific design notes below describe the independent /lab/cutup/ workshop, NOT the homepage. D-41 in docs/CANON.md wins.

The visitor begins with a four-step, non-diagnostic, self-reported mood/affinity questionnaire. Answers carry emotion words and aesthetic-family affinities. The engine evaluates the 30 established family records (with image availability checks), weighted emotion overlap, and one seeded random sequence. Three different families provide compositional layers and tagged image cutouts. One of five editorial grammars (revolt, archive, signal, ornament, spectrum) determines the typography, composition, framing, density, spatial relationships and motion. Images are real library assets, not drawn geometric placeholders. Repeating the same answer/seed/revision reproduces the same composition; changing the revision produces another composition of the same mood. No profiles, diagnoses, accounts or tracking. Responsive from 320px; reduced-motion keeps the full art static. Sources: the user's supplied Cosmos/Pinterest/Are.na design corpus and the verified manifest. Only *actually imported*, vetted assets are shipped.

Core files: `site/landing/index.html`, `site/landing/mood.css`, `site/landing/mood.js`; uses the shared seeded PRNG and cutout/data.js generated from the existing 509-image manifest. The original poem/essay/learning routes are preserved.

---

## Archive: cutup workshop design at /lab/cutup/
# DESIGN.md: Pressure Cooker Poetry (the cutup look)

Written 2026-11-19 after Brandon approved the cutup maker sandbox ("It looks good", CANON D-39). It replaces the Kitchen design file, which is history now (`docs/history/DESIGN-kitchen-2026-11.md`, D-35). Reference pictures: `docs/design/reference/`. The live source of every value below is `site/cutup/cutup.css` and `site/cutup/cutup.js`; if this file and the code disagree, fix this file.

## The idea in one line

Torn paper on a dark wall: strips of words, half the visitor's and half cut from the poems, slapped over loud cut-out pictures, and the whole thing never quite sits still.

## Ground and colour

| Role | Value | Notes |
|---|---|---|
| Page ground | `#15121c` | near-black with violet in it, never pure black, never beige (D-11) |
| Card ground | `#120f17` (dark, default) / `#f4f4f2` (light) | dark is the approved default |
| Text | `#f4f4f2`; muted `#b9b4c4` | muted only for hints and captions |
| Hot accent | `#ff2e88` | main buttons, picked tiles, links' underline, new-poem tick |
| Second accent | `#ffe14d` | the words box border, word-game chips, focus ring |
| Card accents | `#ff2e88 #ffe14d #2ec4d6 #8a4dff #ff6a2b #c6ff3d` | one per card, plus the picked families' own colours |
| Poem-strip papers | `#f4f1e8 #ffe14d #ffd1e6 #cfeffa #ffffff` | text `#111111` on all of them |
| Visitor strips | `#111111` paper, `#ffffff` text | flips to white paper with black bars when a word game blacks words out |

Contrast: every strip pairs near-black on a pale paper or white on near-black (well over 4.5:1). Tags and captions sit on the page ground in `#f4f4f2` or `#b9b4c4`.

## Type

No web fonts (no external requests at runtime). System stacks only:

| Use | Stack |
|---|---|
| Headings, brand, buttons | `Impact, "Arial Black", sans-serif`, uppercase |
| Poem strips | `Georgia, "Times New Roman", serif` bold, or `"Arial Black", "Helvetica Neue", Arial, sans-serif` |
| **Visitor's own words, only** | `"Courier New", Courier, monospace` bold, so anyone can tell whose words are whose |
| Body, hints | `system-ui, -apple-system, "Segoe UI", sans-serif` |
| Reading pages (poems, essays) | `plain.css`: Georgia on `#f4f4f2`, until they're restyled (go-live Step 7) |

Card text sizes are in container units (`cqw`), so a card reads the same on a phone and a desktop.

## Shapes

- **Torn edges** everywhere, never rounded corners: strips and colour blocks are cut with seeded `clip-path` polygons.
- Strips are stacked, staggered and tilted a few degrees, like a ransom-note stanza.
- The first picked image is the big one; 2-3 wildcards that share an emotion join it.
- Hard offset shadows (`4px 4px 0`), no blur glows.
- **Photocopy toner** (`#cc-xerox` SVG filter) on Punk, Zine/DIY, Grunge, Situationism, Dada and Constructivism pictures, sometimes on others.

## Motion (all of it stops under reduced motion and "Hold still")

| When | What |
|---|---|
| A card is cut | colour blocks wipe in, pictures drop, strips slap down one by one (about 1 second) |
| Always, on the card | strips sway a fraction of a degree; pictures follow touch, drag and tilt (alive engine) |
| Tap a strip | it lifts and says "yours" or "from *poem title*" |
| Sound (song file or mic, opt-in) | pictures jump, swell and tip on the beat; **drama 1.5** |
| A hard beat | pictures split pink/cyan and slip in slices for a blink. **Words never glitch** |
| Picking | tiles deal in, the pick number stamps on, "Cut it up" pulses when ready |
| A new poem is reached | its tick in "Poems you've cut from" flashes |

## The maker's defaults (D-39)

3 picks · 5 strips · 40% of strips from the visitor's words (up to 12 words are used, in their typed order) · poem runs of 1-4 words · 1-2 poems per card, chosen at random · dark ground · portrait 4:5 · drama 1.5 · word games: none, N+7, lipogram, snowball (visitor's words only).

## Don't

- Don't put the poems through word games, or retype, re-spell or swap words inside a poem strip (law 1).
- Don't use `Math.random()` or the clock for anything on the card (law 2).
- Don't add accounts, likes, view counts or "contribute" buttons, even though the reference pictures show them (D-34).
- Don't bring back anything from the Kitchen look: slabs, receipts, nutrition labels, rounded SaaS cards, beige grounds.
- Don't add webfonts, CDNs or frameworks.
