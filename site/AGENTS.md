# site/AGENTS.md: rules for the website code

Adds to the root `AGENTS.md`. Read `../DESIGN.md` before any visual change.

## How the site is put together

```
site/live/index.html  --build.py (asserted string patches + inlined src/*)-->  site/dist/index.html   (the Kitchen, committed)
site/landing/  +  site/dist/  +  site/visual/  --assemble.py + build_visual.py-->  site/public/  (deployed)

/              site/visual/index.html   front door: 3 rounds x 10 family fragments -> room + receipt
/kitchen/      site/dist/               the full pantry, archive, essays, Food Bank, lab mode
/collage/      (redirects to /; old collage deleted, CANON D-19)
/poems/ /essays/ /learning/ /about/ /contact/   from site/landing/
/visual/runtime.js   the Kitchen engine scripts, extracted from dist/ by build_visual.py
```

## Traps

1. **`build.py` patches by exact string match**, and each patch must match exactly once. If you change text in `live/index.html` or reorder something a patch targets, the build exits with `patch '<label>': expected 1 match, found N`. Prefer adding code in `site/src/` over changing `live/index.html`. If a patch truly has to change, change the patch in `build.py` and keep the assertion.
2. **Four engine files exist twice.** `tastes.js`, `board.js`, `styles.js` and `pantry-plus.js` live in both `site/src/` and `site/landing/src/`, and nothing syncs them. They are identical today. If you change one, copy it to the other in the same commit and check with `cmp site/src/X site/landing/src/X`.
3. **`site/dist/` is committed** and CI runs `git diff --exit-code -- site/dist` after a fresh build. Always rebuild and commit `dist/` with the source change. Never hand-edit `dist/`.
4. **The front door reuses the Kitchen engine.** `build_visual.py` pulls scripts out of `dist/index.html` by their header comments (`THE ENGINE`, `THE STYLE TREE`, `LAYOUT FAMILIES + RENDERER` and others) and asserts `PCP.render = render` and `PCP.engine = {` are present. Renaming those headers breaks the front door.
5. **Receipts are versioned by content hash.** `PCP.visualBuild` is a SHA-256 over the runtime, CSS, `site/visual/` and `dist/assets/`. Any change to those makes old receipts show the "incompatible build" message. That is intended. Never weaken the check to make old receipts "work".
6. **Coupons and receipts change meaning when the library grows.** Adding cutouts or movements changes which items a recipe picks. Say so in the PR when you add to the library.
7. **Lab mode** lives in `localStorage` (`pcp-lab`). If something "visible to visitors" shows up while you test, clear it with `?lab=0`.

## Engine rules

- Randomness only through the engine's seeded PRNG (`mkRng(...)` / the genome seed). Derive sub-seeds from stable strings, the way `styles.js` does with `mkRng("kit|" + sid)`.
- Iterate over arrays in a fixed order. Don't let the order of `Object.keys`, `Set` or `fetch` responses pick anything.
- The layout grammar arranges the poem; it must never drop, reorder or reword a line. `visual-flow.cjs` checks this across 600 compositions. Keep it that way.
- Keep the six layout grammars working on a 320px-wide screen.

## Code style

- Vanilla JS in an IIFE that hangs things off `window.PCP`. No modules system, no build-time transpile, no framework.
- No external requests at runtime: no CDN scripts, webfont links, analytics or remote images. Everything ships in `site/public/`.
- CSS: scope new rules under a class or data attribute (`.visual-page`, `[data-k-button=...]`), use the `--k-*` and `--f-*` tokens, and give every animation a reduced-motion off switch.
- Python tools: standard library only, Python 3.12, fail loudly with a clear message instead of half-writing output.

## Tests

| Suite | Serves | Run |
|---|---|---|
| `site/tests/visual-flow.cjs` (CI) | `site/public` on :8765 | `python3 -m http.server 8765 --directory site/public` then `node site/tests/visual-flow.cjs` |
| `site/tools/test.js` .. `test4.js` (older Kitchen checks) | `site/dist` on :8765 | `cd site/dist && python3 -m http.server 8765` then `node ../tools/test.js` |
| `site/tools/live_check.js` | production | only when the owner asked for a live check |

If the Playwright browser can't install (no network in the sandbox), say so in the PR and leave it as a draft. Don't mark visual work verified without screenshots.
