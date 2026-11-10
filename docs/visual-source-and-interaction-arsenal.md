# Visual Source & Interaction Arsenal

Curated for Pressure Cooker Poetry (PCP), 2026-11-10. This registry is a research and implementation queue, NOT an automatic asset-import license.

## Discovery / gallery / reference collections
| Source | URL | Use | Intake |
|---|---|---|---|
| Cosmos | https://www.cosmos.so/ | Image-led moodboards, relationships between references | inspiration only until item rights reviewed |
| Are.na | https://www.are.na/ | Human-curated channels mixing images, links and ideas | inspiration; retain original URL |
| Savee | https://savee.com/ | Curated typography and graphic design references | inspiration only |
| Same Energy | https://same.energy/ | Visual-similarity exploration, unusual aesthetic branches | inspiration only |
| Designspiration | https://www.designspiration.com/ | Color-oriented visual discovery | inspiration only |
| Awwwards | https://www.awwwards.com/ | Experimental web experiences and microinteractions | reverse-engineer patterns, not third-party assets |
| OpenProcessing | https://openprocessing.org/ | Generative art sketches and processing/p5.js experiments | per-sketch license required |

## Historical sources for the cutout inbox
| Source | URL | Target material | Rights |
|---|---|---|---|
| Library of Congress Free to Use & Reuse | https://www.loc.gov/free-to-use/ | Propaganda, advertisements, maps, antique diagrams, photography | use item page terms, attribution notes |
| Public Domain Review | https://publicdomainreview.org/collections/ | Oddball historic illustrations, art, books and ephemera | verify underlying work and digital reproduction status |
| Internet Archive | https://archive.org/details/magazine_rack | Old magazines, ads, layouts and printed ephemera | rights vary item by item |
| Rijksmuseum | https://www.rijksmuseum.nl/en/collection | Historical paintings, prints and object imagery | check public domain markings and conditions |

## UI / motion / creative coding toolchain
| Source | URL | Candidate PCP role |
|---|---|---|
| Uiverse | https://uiverse.io/ | Ingredient buttons, toggles, loading and hover motifs; site says UI components MIT-licensed |
| Awesome Web Animation | https://github.com/sergey-pimenov/awesome-web-animation | Vetted animation libraries by use case |
| Awesome Creative Coding | https://github.com/terkelg/awesome-creative-coding | Patterns, kinetic diagrams, generative ornament |
| Awesome Lists | https://github.com/sindresorhus/awesome | Index for visual resources, fonts, web design, creative coding |
| Animista | https://animista.net/ | Small CSS keyframe recipes |
| CodePen | https://codepen.io/ | Experiment references; respect each pen's license |
| GSAP | https://gsap.com/ | Sequenced editorial movement, if appropriate for bundle and terms |
| Motion | https://motion.dev/ | Motion and gesture experiments for compatible stacks |
| css-doodle | https://css-doodle.com/ | Generative collage textures and diagrams |

## Effects to prototype, ranked
1. **Pressure valve microinteraction**: physical press-and-release timing; avoid perpetual vibration.
2. **Cutout reveal**: clipped paper-mask transition when a new room loads, deterministic by seed.
3. **Typographic misregistration**: short offset in ink layers for chaos-heavy families, not constant text jitter.
4. **Collage parallax**: restrained pointer tilt on desktop; static/mobile-safe fallback.
5. **Print-shop loading**: ink roller/registration-mark sequence during generation, with instant mode under reduced motion.
6. **Connected archive trails**: cross-reference a cutout's provenance, movement, emotion and visual relatives in lab mode.

## Required asset record (for assets actually imported)
- id, source_url, original_item_url, creator, title, date, license, rights_evidence_url, attribution, downloaded_at
- media_type, file_hash, cutout_path, tags (movement/emotion/motif), review_status (reference-only / cleared / rejected)
- Never infer that a gallery's contents are public domain merely because a gallery is publicly viewable.

## Implementation rules
- Ingredient selection must remain the public interface; lab-only sliders, seeds and inspectors remain hidden from visitors.
- Same recipe, same room: all generative choices deterministic from seed/ingredient state.
- Distinct motion dialects per design family; don't indiscriminately stack effects.
- Respect prefers-reduced-motion, keyboard focus, touch input and page performance.
- Run a mobile check before enabling an effect for visitors.
- This file catalogs possibilities. It does not import external images or install effects into production.
