# Pressure Cooker Poetry

The source for [pressurecookerpoetry.com](https://pressurecookerpoetry.com) and its library of design elements and cutouts.

**Agents start with [`AGENTS.md`](AGENTS.md), then [`docs/CANON.md`](docs/CANON.md)** for what's live, what the owner has decided and what's dead. The release order is in [`docs/GO_LIVE_PLAN.md`](docs/GO_LIVE_PLAN.md).

## What it's becoming (reset 2026-11-18, CANON D-31 to D-35)

A visitor **makes a cutup**: picks images, adds a few words of their own, and the site cuts those words together with lines from the poems into a torn-paper collage card over imagery from the cutout library. Same choices, same card. Cards can be kept in the visitor's own browser and shared as a link. No accounts, no tracking. The poems and essays are read on their own plain pages; nobody gets dropped straight into a poem.

The look is written down in `DESIGN.md` (approved 2026-11-19); Brandon's reference pictures are in `docs/design/reference/`. The maker is the front door at `/` on PR #14; it goes live only with Brandon's OK.

The old generative Kitchen (pantry, fridge, recipes, nutrition card, poem-first rooms, dials) and the front door that ran on it were deleted in the reset. They're in git history if anything ever needs looking up; don't bring them back (CANON Graveyard).

## Where things live

| Path | What |
|---|---|
| `content/` | The writing, exactly as written: `poems.json` (56), `essays.json` (2, with sources), `food-bank.json` (free resources) |
| `site/cutup/` | The cutup maker (engine, page logic, styles) used by `/` and `/lab/cutup/` |
| `site/landing/` | Hand-written pages: the front door shell, Brain Candy, Learning, About, Contact, `_redirects` |
| `site/shared/` | `plain.css` for reading pages, `prng.js` (seeded randomness) |
| `site/alive/` | The motion engine (touch, keys, sound, tilt) and its lab at `/alive/lab/` |
| `site/tools/build.py` | The whole build: writes `site/public/` |
| `site/tests/` | Browser checks: `site.cjs`, `alive.cjs`, `spin-cycle.cjs` |
| `library/` | 30 design movements, 509 looked-at cutouts (`library/cutouts/manifest.json`), the emotion vocabulary (`catalog.json`), `families.json` |
| `tools/cutouts/` | Bringing cutouts in: harvest, unpack, ingest, contact sheets, promote |
| `docs/` | Canon, go-live plan, logbook, handoffs, history |

## Build and test

```sh
python3 site/tools/build.py                                   # exactly what Netlify runs
python3 -m http.server 8765 --directory site/public &
npm install --no-save playwright@1.62.1 && npx playwright install --with-deps chromium
node site/tests/site.cjs && node site/tests/alive.cjs && node site/tests/spin-cycle.cjs
```

## Deploy

Netlify project `pressurecookerpoetry` (never a second one) builds every pull request into a private deploy preview and publishes `main`. Production changes only with Brandon's OK for that release.
