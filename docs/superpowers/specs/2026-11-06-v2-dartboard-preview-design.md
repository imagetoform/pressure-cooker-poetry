# Pressure Cooker Poetry v2 Dartboard Preview

## Decision and boundary

Build the 20-family, five-layer dartboard as a separate next version. The current kitchen remains the production site at `pressurecookerpoetry.com`; its 481-ingredient pantry, Plutchik wheel, 30 movements, poems, essays, and Food Bank stay in `site/`. Put the new preview in `v2/` and keep it out of Netlify's production publish directory until Brandon reviews it.

This first release is a working, local preview and engine, not the 600-asset library. The coverage grid must show missing cells honestly. Later asset batches can fill it without changing the engine's contract.

## Visitor experience

The visitor chooses exactly three ingredients. The first ingredient controls the ground, the second the voice, and the third the bodies. Motion and grit are derived from the same recipe behind the scenes. No visitor-facing seed, dial, poem picker, intensity slider, family picker, or inspector is added. A `?lab=1` mode can show dart scores and asset choices for review. A selected poem is displayed verbatim and on a contrast-safe reading surface above decorative layers.

The preview uses a small, clearly labeled subset of existing authored poems and a small ingredient sample that conforms to the v2 schema. It does not silently translate the current 481 taste records into `family`, `intensity`, and four stats. That translation needs editorial review.

## Engine contract

The family order and names are exactly those in Brandon's November 6 Dartboard System & Sub-Agent Build Kit, indices 0 through 19. A score is 0 through 199. `familyIndex = Math.floor(score / 10)` and `intensity = score % 10 + 1`. An ingredient has `id`, `label`, `category`, `family`, `intensity`, and `stats` containing `heat`, `order`, `noise`, `weight`, each an integer from 0 through 10.

| Index | Family | Index | Family |
|---:|---|---:|---|
| 0 | Bitter Grief | 10 | Chalk Bureaucracy |
| 1 | Sour Agitation | 11 | Citrus Joy |
| 2 | Sweet Nostalgia | 12 | Ash Aftermath |
| 3 | Salt Labor | 13 | Pepper Riot |
| 4 | Umami Comfort | 14 | Honey Tenderness |
| 5 | Burnt Rage | 15 | Brine Longing |
| 6 | Smoke Mysticism | 16 | Raw Exposure |
| 7 | Metallic Paranoia | 17 | Spoiled Satire |
| 8 | Fermented Decay | 18 | Bland Void |
| 9 | Sugar Rush Infomercial | 19 | Spice Ecstasy |

The recipe seed hashes ingredient IDs in selection order, with a version string (`pcp-v2-board-1`) so future algorithm changes are explicit. Each dart gets an independent seeded draw. `aim = family * 10 + intensity - 1`; `score = ((aim + wobble) % 200 + 200) % 200`. Wobble is an integer in `[-span, span]`, with `span = clamp(1, 3, 2 + round((noise - order) / 10))`. This keeps the promised maximum of three points while high noise and high order pull in opposite directions. The exact formula is a v2 choice to review before the preview is treated as final.

For a three-ingredient recipe, synthetic motion and grit darts use two further seeded draws aimed at dart 3's **landed score**, each with a fixed span of three. They do not create new visitor choices. An asset record has the tag sheet fields from the build kit, including `layer`, `family`, `intensity`, `rights`, and `file`. Candidate assets must match both layer and landed family. Weight is `1 / (1 + abs(asset.intensity - dart.intensity))`; sort candidates by ID before a seeded weighted pick so input file order cannot change the room. Empty pools return an explicit fallback marker and a coverage gap, never a fabricated asset path.

Freeze each published asset manifest under a versioned filename. The same recipe and manifest version must reproduce the same asset picks; adding assets creates a new manifest version rather than silently changing a saved room.

## Visual preview

Start with one concrete, polished room for a three-ingredient recipe. It should visibly combine ground, voice, and bodies from different families, with motion and grit from the synthetic darts. Provide a second recipe showing a different combination and a mobile layout. Asset records used in this preview must point to files actually in `v2/assets/`; self-made vector fragments are acceptable. Keep texture and motion away from the poem's reading surface, and honor `prefers-reduced-motion`.

The visual grammar should be bold and crowded without a generic template. The poem text and line breaks are data, not generated text. The current production site's visual or poem files are read-only inputs to this preview.

No live AI call or API key ships in the preview. Satire aims at institutions and the powerful, and the sample art must offer more than one cultural point of view rather than treating one taste as the default.

## Coverage and publication gates

The auditor reports coverage across 20 families × five layers × three bands (mild 1–3, middle 4–7, intense 8–10). The long-term minimum is two approved assets per cell: 600 total. A preview can run with fewer assets only if empty cells and fallbacks are visible in its lab report. Each proposed cutout requires source, creator/date when known, rights evidence, and a human review status. `fragment` is a working description, not publication clearance.

Before any v2 production switch: validate all schemas and deterministic recipes; compare poem bytes to their source; test keyboard access, reduced motion, and desktop/mobile readability; review rights and satire; and verify the exact deployed output. The v2 preview does not alter the current Netlify production publish path.

## Open editorial decisions

- Confirm the 20 family names and order before assigning a large ingredient catalog; changing order changes score meanings.
- Approve or revise the wobble formula and the synthetic motion/grit rule above.
- Decide which existing poems and ingredient labels belong in the v2 preview, and review the visual prototypes before broad asset acquisition.
