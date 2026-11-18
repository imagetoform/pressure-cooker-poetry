# site/AGENTS.md: rules for the website code

Adds to the root `AGENTS.md`. Rewritten for the 2026-11-18 reset (CANON D-31 to D-35): the Kitchen, its patched single-file build and the old front door are gone. Don't bring any of them back.

## How the site is put together

```
site/landing/   hand-written pages + _redirects  ┐
site/shared/    plain.css, prng.js                │
site/alive/     alive.js, alive.css, lab/         ├─ python3 site/tools/build.py ─> site/public/  (deployed by Netlify)
content/*.json  poems, essays, food bank          │    (generates /poems/, /essays/, /food-bank/)
library/cutouts/manifest.json + files             ┘    (copies cutouts to /assets/cutouts/, writes /alive/cutouts.js)
```

| URL | From |
|---|---|
| `/` | `site/landing/index.html`: a plain **stand-in** until the cutup maker is built (D-33) |
| `/poems/`, `/poems/<id>/`, `/essays/`, `/essays/<id>/`, `/food-bank/` | generated from `content/` by `build.py` |
| `/learning/`, `/about/`, `/contact/`, `/brain-candy/…` | `site/landing/` |
| `/alive/lab/` | the motion engine's lab (test machinery, not linked from visitor pages) |
| `/kitchen/*`, `/visual/*`, `/visual-picks/*`, `/collage/*`, `/learning-curve/*` | redirects in `site/landing/_redirects` |

## Rules

- **The writing comes only from `content/`.** Print it with HTML escaping and nothing else: no smart quotes, no trimming, no re-wrapping. `site.cjs` compares every poem line on every poem page against `content/poems.json`.
- **Randomness only through `site/shared/prng.js`** (`PCP.prng.makeRng(key)`). Derive sub-seeds from stable strings (`makeRng(seed + '|strips')`). Iterate arrays in a fixed order; don't let `Object.keys`, `Set` or `fetch` order pick anything.
- **The build is reproducible.** Sort inputs, write no timestamps. CI builds twice and diffs the output.
- **Vanilla JS** in an IIFE that hangs things off `window.PCP`. No module system, no transpile, no framework.
- **No external requests at runtime**: no CDN scripts, webfont links, analytics or remote images. Everything ships in `site/public/`.
- **CSS**: scope new rules to their page or component, give every animation a reduced-motion off switch, no sideways scroll at 320px (`site.cjs` checks every page).
- **Python tools**: standard library only, Python 3.12, fail loudly with a clear message instead of half-writing output.

## Tests

| Suite | What | Run (serve `site/public` on :8765 first) |
|---|---|---|
| `site/tests/site.cjs` | every page at 320px and desktop (errors, missing files, sideways scroll), every poem line verbatim, essays' sources, Kitchen gone | `node site/tests/site.cjs` |
| `site/tests/alive.cjs` | the motion engine on `/alive/lab/?seed=…` | `node site/tests/alive.cjs` |
| `site/tests/spin-cycle.cjs` | Brain Candy | `node site/tests/spin-cycle.cjs` |

If the Playwright browser can't install (no network in the sandbox), say so in the PR and leave it as a draft. Don't mark visual work verified without screenshots.

## Alive layer

`site/alive/alive.js` + `alive.css` make things react to touch, keys, sound and tilt (CANON D-29). Read `docs/ALIVE.md` before changing it. It must never change what a seed produces, never record sound, and must stop moving under reduced motion.
