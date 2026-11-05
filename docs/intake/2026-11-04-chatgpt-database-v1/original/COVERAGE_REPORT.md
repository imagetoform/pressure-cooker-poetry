# PCP database expansion: coverage report

## Status

- 300 new ingredient proposals, 10 new movements, 224 cutout acquisition concepts (8 per each of 28 movements).
- Cutout entries are **not** imported image assets: no `src` exists yet. Map `suggested_filename` to real, verified files after sourcing.
- Existing pantry IDs were not supplied. Internal uniqueness checked; collisions with the actual site pantry are **not** checked.
- The existing 18 movements were provided as names and branch assignments, not complete records. The 10 new movements are full records; 28-movement coverage here refers to cutout concepts only.
- Emotion coverage counts below are tag matches, **not** simulated dartboard selection probabilities.

## Ingredient pattern counts

| Recipe pattern | Count |
|---|---:|
| dominant | 75 |
| agreeing | 150 |
| muddled | 75 |

These are construction-pattern classes, not measured dart radii. The recipe taste vectors need a simulation to prove the promised intense/core/mild landing distribution.

## Movement coverage (10 new movements only)

| Emotion wedge / blend | New movements | Cutout concepts | Target for cutouts |
|---|---:|---:|---:|
| joy | 2 | 36 | 6 |
| trust | 3 | 56 | 6 |
| fear | 2 | 28 | 6 |
| surprise | 3 | 48 | 6 |
| sadness | 5 | 34 | 6 |
| disgust | 1 | 16 | 6 |
| anger | 2 | 28 | 6 |
| anticipation | 5 | 62 | 6 |
| love | 0 | 43 | 2 |
| submission | 0 | 28 | 2 |
| awe | 3 | 45 | 2 |
| disapproval | 0 | 30 | 2 |
| remorse | 0 | 36 | 2 |
| contempt | 1 | 44 | 2 |
| aggressiveness | 1 | 41 | 2 |
| optimism | 1 | 46 | 2 |
| overwhelm | 0 | 24 | n/a |

## Cutout concepts by movement

| Movement | Branch | Concepts |
|---|---|---:|
| Art Nouveau | ornament | 8 |
| Art Deco | ornament | 8 |
| Psychedelia | ornament | 8 |
| Minimalism | order | 8 |
| Swiss / International | order | 8 |
| Bauhaus | order | 8 |
| Brutalism | order | 8 |
| Constructivism | revolt | 8 |
| Dada | revolt | 8 |
| Punk | revolt | 8 |
| Futurism | future | 8 |
| Cyberpunk | future | 8 |
| Vaporwave | future | 8 |
| Maximalism | excess | 8 |
| Pop Art | excess | 8 |
| Abstract Expressionism | abstract | 8 |
| Geometric Abstraction | abstract | 8 |
| Op Art | abstract | 8 |
| Surrealism | abstract | 8 |
| Expressionism | abstract | 8 |
| Memphis | excess | 8 |
| Zine / DIY | revolt | 8 |
| Afrofuturism | future | 8 |
| Gothic Revival | ornament | 8 |
| Ukiyo-e | ornament | 8 |
| Situationism | revolt | 8 |
| Grunge Design | revolt | 8 |
| Y2K Aesthetic | future | 8 |

## Important distinctions

The specification defines selection weights, but does not define the exact hashing, seeded random generator, or default house-stock flavor. This package does not invent replacements for these implementation details.

The `cutout-shopping-list.json` file is **not** directly compatible with the runtime cutout table: it contains `suggested_filename`, `status`, and `source_hint` instead of `src`, `fallback`, and `source`. Do not load it into the renderer until real assets exist and those fields are added.

Historical blurbs are concise editorial summaries, not a full provenance audit. Verify any archive licenses and creators before publication.
