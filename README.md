# Pressure Cooker Poetry

**LIVE PROJECT · D-42 HARD RESET · November 19, 2026**

[Open the live site](https://pressurecookerpoetry.com/) · [THE ONLY ARCHITECTURE](docs/CANON.md) · [Current design doctrine](DESIGN.md) · [Agent instructions](AGENTS.md)

## The ONE visitor experience

1. Fresh entry to / shows an engaging four-question mood/affinity intake. No generated writing and no generated homepage beforehand.
2. Visitor answers create emotional signals and weighted aesthetic-family affinities.
3. A brief, accessible animated pressurization transition plays.
4. A unique seeded, responsive, source-first **complete editorial homepage** appears. Remix changes the composition; shared links recreate an edition.
5. Every edition provides the SAME core content: Brain Candies (/brain-candy/), My Two Cents (/my-two-cents/), Contact (/contact/), Mission Statement (/about/) and Learning Curve (/learning/), with original poems and essays on their own pages.
6. Graphic cutouts react to click, touch and pointer; sound is opt-in and locally processed; hold-still/reduced-motion work in every edition; the hidden eye always leads to /the-eye/.

What varies: chosen and blended aesthetic families, graphical cutouts, masks, composition grammar, palette, typography, layout, interactive geometry and motion personality. No single permanent Cutup Database layout; the owner's reference images define the visual quality level, not a template.

## One live source, no preview labyrinth

Production is the existing Netlify project `pressurecookerpoetry` tracking the current `main` branch of this repo. Never restore older archived branches or obsolete homepage styles. The release plan in [docs/GO_LIVE_PLAN.md](docs/GO_LIVE_PLAN.md) instructs agents to verify the **actual public site** after any change. Source committed, deployment ready and public verified are three separate states.

## Technical map (for collaborators only)

- `site/landing/index.html`, `mood.js`, `mood.css`: real entrance, loading screen, live world
- `site/alive/`: centralized pointer/touch/audio motion behavior
- `site/shared/prng.js`: deterministic seeded renderer randomness
- `library/families.json`, `library/cutouts/manifest.json`: catalogued movements and approved graphic assets
- `content/`: original writing (must be preserved verbatim)
- `site/landing/brain-candy/`, `my-two-cents/`, `about/`, `contact/`, `learning/`, `the-eye/`: canonical destinations
- `site/cutup/`, `site/landing/lab/cutup/`: separate cutup tool/lab; NEVER the homepage
- `site/tests/architecture_contract.py`: build-blocking anti-regression rule. Called by `site/tools/build.py` even outside GitHub Actions.
- `site/tests/mood.cjs`: end-to-end questionnaire, loading, seeded edition and viewport tests

To build locally: `python3 site/tools/build.py`. GitHub CI runs a deterministic double-build and browser tests. Broken changes must be repaired forward from current main; do not roll back to historic screens.

## Historical records are not build instructions

Prior versions of CANON, DESIGN, AGENTS, README, GO_LIVE_PLAN live under `docs/history/` and in version history strictly for provenance. They have **no authority** to override D-42.
