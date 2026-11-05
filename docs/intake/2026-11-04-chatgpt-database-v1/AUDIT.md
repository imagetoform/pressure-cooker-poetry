# Audit: ChatGPT database expansion v1 (Nov 4 2026)

Source: `PCP_Database_Expansion_v1.zip` from Brandon's Downloads, unchanged in `original/`.
Checked against `docs/DATABASE_SPEC.md` and the real site (the built page, not the spec's description of it).
Tools and raw numbers are in `check/`.

## Verdict

| Part | Structure | Content | What happened |
|---|---|---|---|
| 300 ingredients | valid: no ID clashes with the 181 on the site, legal categories, taste codes, counts and totals | **tastes were not tasted.** `build.py` handed them out by row number (`tastes[(idx+idx//6)%6]`, pattern by `idx%4`), so "the communal potluck" was the bitterest thing in the pantry and "a melting ice-pop" was spicy | words kept; **all 300 re-tasted by hand** (`check/retaste.txt`), then 52 opposed pairs sharpened so fewer land on the rim; merged into `site/src/pantry-plus.js` |
| 10 movements | valid branches, layouts, motions, textures, colors, 3 tags each | good choices; blurbs mostly accurate, a few thin | merged into `site/src/styles.js` with new motifs (none were supplied), button skins in `extra.css`, blurbs corrected |
| 224 cutouts | valid tags, but 8 used family `swiss-international` (the site's id is `swiss`) | **tags assigned in rotation, not by meaning** ("bird with book wings" → category food) | filed as a shopping list only: `library/cutouts/shopping-list.json` and one `SHOPPING.md` per movement. Not loaded by the site |

## Blurb corrections

- Surrealism: added the 1938 Manifesto for an Independent Revolutionary Art, written by Breton and Trotsky, signed by Breton and Diego Rivera.
- Expressionism: added the dates of Die Brücke (1905) and Der Blaue Reiter (1911), and the Nazis' "degenerate art" label (1937).
- Afrofuturism: the term is from 1993 (Dery's essay "Black to the Future"), not 1994 (the anthology reprint). Sun Ra, Octavia Butler and Parliament-Funkadelic added as roots.
- Situationism: added Debord's *The Society of the Spectacle* (1967) and the May 1968 slogans.
- Grunge Design: added David Carson's *Ray Gun* (1992 on).
- Gothic Revival: added Walpole's Strawberry Hill and Pugin.

## Where the darts land (one dart per ingredient)

| Pantry | intense | core | mild | Wedges reached |
|---|---|---|---|---|
| live 181 | 42 | 82 | 57 | all 8, joy-heavy (52) |
| ChatGPT's 300 as delivered | **208** | 17 | 75 | 6 of 8: **no anger, no disgust** |
| 300 re-tasted | 79 | 133 | 88 | all 8 (joy 82, trust 43, surprise 36, sadness 31, anger 31, fear 26, anticipation 27, disgust 24) |

## 6,000 seeded pots through the real engine (before → after)

- Deterministic: same recipe gives the same genome in all 6,000 pots, before and after, and across page reloads.
- No cutout repeats inside one room. All 19 current cutouts get picked.
- `overwhelm` (the bull) is reachable: about 14% of pots, before and after.
- Darts by wedge: joy is still the biggest (26% of darts). Sweet is the most common main taste, partly because the satire uses fake sweetness from the powerful.
- **Pop Art and Maximalism dominate:** 16.0% and 12.5% of rooms (were 18.8% and 13.4%). Pop Art carries `joy`, which sits where most darts land. Maximalism carries `overwhelm`, which wins every bull. This was already true before the merge. **Not retuned**, because it changes the hidden behaviour; it's Brandon's call.
- **A movement picks the layout in 86% of rooms** (was 74.5%). Only 4 of 28 movements leave the layout to the pressure, so the hidden dials now choose the room's grammar in about 1 room in 7. Cutup is 40% of rooms. Same caveat: reported, not changed.
- Every one of the 28 movements leads at least 0.9% of rooms (Ukiyo-e is the rarest).

## Browser checks (`check/test5.js`, plus the earlier suites in `site/tools/`)

- All 56 poems are byte-for-byte identical to the pre-merge build.
- Visitors see 481 ingredient tiles and nothing else: no dials, flavor bars, poem picker, seed, inspector or dartboard (`site/tools/test3.js`, `test4.js`).
- A pot was found and rendered for each of the 10 new movements: the motif layer, the `data-sty` skin on the cook button, and the movement's layout.
- Cooking through the UI picks poems by flavor (four different pots, four different poems).
- Reduced motion: the `no-motion` class is on and no style layer is animating.
- Phone (Pixel 7 viewport): no sideways overflow on the pantry or in Memphis, Y2K or Gothic Revival rooms.
- No console errors other than the two old 404s for kit4 cutout files that were never uploaded (the stand-in drawings show).

## Still open

- Fonts: the new movements reuse the site's embedded fonts (no new licences needed). A true font per movement is later work.
- The 224 cutouts don't exist yet. Every one needs a real image, real tags, and a written source and licence before it goes into the manifest.
- Spot-check the 300 ingredient texts for tone. The words are ChatGPT's. Many institutions follow one formula ("the ministry of…", "the department of…").
