# PRESSURE COOKER POETRY — CANONICAL ARCHITECTURE
## D-42 · HARD RESET · 2026-11-19

> THIS DOCUMENT IS THE ONLY ACTIVE PRODUCT ARCHITECTURE. Its authority supersedes D-01 through D-41 wherever they conflict, and ALL past chat handoffs, release plans, agents, archived design variants, preview branches and screenshots. Those materials are historical evidence only. A user instruction explicitly reopening this decision is required to change it. No agent may use archived designs as production source.

### The only visitor journey (must occur in this order)
1. On a fresh visit to / the FIRST visible application screen is a short, engaging, non-diagnostic, mood/affinity questionnaire. It must not show a generated homepage, the Kitchen, a cutup maker, writing, or a pre-selected editorial result.
2. Question answers map to emotional tags, tensions and weighted aesthetic-family affinities. The questions are a creative interaction, not a medical or psychological diagnosis. No identity profile or server-side tracking.
3. Only AFTER the final answer, present a visible, brief, animated PRESSURIZATION interstitial; honor reduced-motion.
4. Generate and reveal one COMPLETE, polished, responsive, user-conditioned, seeded homepage. It is an editorial world, not a poem page, a blank canvas, or a single cutup card.
5. The visitor explores consistent destinations through a unique seed-specific design; can remix for a new edition or change answers, and can share/replay the exact edition.

### Immutable content/behaviors (regardless of seed)
- MAIN DESTINATIONS: Brain Candies (linguistics playground, playful learning tools) -> /brain-candy/; My Two Cents (owner's essays and poetry) -> /my-two-cents/; Contact -> /contact/; Mission Statement -> /about/. Learning Curve -> /learning/ is also retained. Exact wording of these five entry destinations must be recognizable even if displayed differently.
- Existing authored poems, essays, credits and citations remain verbatim, accessible via /poems/ and /essays/. No generated random author prose is an entrance.
- Seed + answers + renderer version reproduce an edition. New seed or remix creates a materially different composition. No login needed.
- Every generated homepage has responsive art with mouse/touch/click behavior, optional local opt-in microphone-driven motion, and a reduced-motion/hold-still escape. No audio recording/transmission.
- A discoverable but hidden-eye graphic/animation is present in EVERY generated edition and ALWAYS links to the same Easter-egg page (/the-eye/). Seed can change its graphic/placement, never its function.
- Public routes are real destinations, not dummy buttons. Accessible keyboard and touch paths, 320px minimum width, reasonable contrast, preserved navigation.

### Per-edition generative design (NOT fixed templates)
Answers -> emotional/tension vector -> weighted query over curated families/approved real assets -> independent seeded sampling of families + layout grammar + palette + type hierarchy + cutout layering + compositional masks + UI/button geometry + motion personality + responsive rearrangements -> rendered homepage.

Generative freedom affects: arrangement, density, art selection, masking, textures, graphic depth, navigation geometry, title composition, typography, color, scale, module rhythm, motion and spatial hierarchy. Every edition must be a coherent designed environment, not a palette swap, a shuffled card set, a zigzag grid, or a fixed layout with changed decorations. Use multiple art-direction grammars; do not force all answers through one graphic style. Quality is reviewed visually across substantially different seeds and viewports: automated tests catch regressions but cannot certify good art.

### Mandatory source-first rule
All OWNER-SUPPLIED Cosmos, Pinterest, Are.na, screenshot, archive and original-art references are FIRST-CLASS visual evidence. Catalog each with URL/provenance, permissions, usable status and tags. Use licensed/owned files as production cutouts; if permission is unclear use the source to inform original composition, palette, masks and typography, without copying prohibited artwork. Do not ignore, silently replace, claim unimported assets exist, or fall back to generic filler when a required family is thin. No invented source or usage rights.
The three Cutup Database screenshots approved 2026-11-19 illustrate QUALITY and GRAPHIC RICHNESS, NOT a template and NOT a request to build a Cutup Database homepage.

### Explicitly retired / never return to front door
The Kitchen/pantry/fridge/nutrition labels; poem-first homepage; 3x10 visual picker; palette-only recipe rooms; cutup maker as /; generic blog or SaaS templates; fixed graphic grid with random wallpaper; unapproved old screenshots/prototypes; automatic swapping in a prior layout when a new family is missing. Existing cutup experiment stays isolated at /lab/cutup/ and may never take /.
Old branches, old PRs and historical instructions are NEVER merged to main as a restoration. Cherry-pick only reviewed NEW code that obeys this architecture, starting from current main.

### Production invariant / release protocol
- ONE public site: https://pressurecookerpoetry.com, ONE Netlify project: pressurecookerpoetry, ONE deployment source: current GitHub main branch of imagetoform/pressure-cooker-poetry. No alternate pre-production maze.
- Ship production edits against current main only, without resetting to an archived branch. No independent agent may force-push, override a concurrent edit, or deploy a different project.
- Build-time architecture_contract.py is a deploy blocker; run on every build. CI additionally tests browser flow and real destinations, seeded replay and diverse seeds. A failed gate must prevent publish, not silently restore older site code.
- After EACH production change verify deploy state AND actual public URL. Report accurately three distinct statuses: SOURCE CHANGED, DEPLOY READY, PUBLIC SITE VERIFIED. Never call a PR/commit/screenshot alone 'live'.
- If main changes during a write, stop, rebase the intended patch on current main, recheck, and commit without erasing parallel work.
- Every agent first reads THIS document, then README/AGENTS.md; old directives inside docs/history are historical only.
- Changes to this architecture require the owner's explicit 'reopen D-42' request, an updated CANON and updated regression checks in the same change.

### Current factual state / known gaps
As of the main snapshot bf10433 (2026-11-19), the questionnaire-first site with 4 questions and a seed-biased renderer is already published. Only a subset of the whole desired artistic diversity is implemented: five grammar families existed at the time of reset, while 30 named movement families and 509 catalogued cutouts exist. The owner-supplied Cosmos/Pinterest/Are.na corpus is not yet fully ingested or cleared; do NOT claim otherwise. D-42 is the TARGET and mandatory operating contract, not proof that every creative ambition has already shipped. The CI gate verifies the route/flow/behavioral spine, not an automatic guarantee of artistic excellence.

### Historical preservation, without active authority
Earlier full canon: docs/history/CANON-pre-D42-2026-11-19.md.
Earlier agent instructions: docs/history/AGENTS-pre-D42-2026-11-19.md and docs/history/site-AGENTS-pre-D42-2026-11-19.md.
Earlier design: docs/history/DESIGN-pre-D42-2026-11-19.md.
Earlier go-live plan: docs/history/GO_LIVE_PLAN-pre-D42-2026-11-19.md.
