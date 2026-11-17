---
name: pcp-verify
description: Build and check the Pressure Cooker Poetry site before opening or updating a pull request, then report results honestly. Use before every PR, after any change under site/, library/ or tools/, and whenever you are about to say something works.
---

# pcp-verify

Run each step and keep the real output. If a step can't run, write down why and mark the PR as a draft. Don't skip to the report.

## 1. Build

```sh
python3 site/tools/build.py && python3 site/tools/assemble.py
git status --short site/dist        # if dist changed, commit it with the source change
```

The build prints kit, library and visual-build lines. Copy them into the report.

## 2. Engine copies are in sync

```sh
for f in tastes.js board.js styles.js pantry-plus.js; do cmp -s site/src/$f site/landing/src/$f && echo "$f ok" || echo "$f DIFFERS"; done
```

Any `DIFFERS` is a bug unless the task was to change only one of them.

## 3. Data files parse

```sh
python3 -c "import json;[json.load(open(p)) for p in ['library/cutouts/manifest.json','library/cutouts/shopping-list.json','library/catalog.json']];print('json ok')"
```

Also parse any data file you created or edited, and count its records against what you meant to write.

## 4. Browser suite

```sh
python3 -m http.server 8765 --directory site/public > /tmp/pcp-http.log 2>&1 &
npm install --no-save playwright@1.62.1 && npx playwright install --with-deps chromium
node site/tests/visual-flow.cjs
```

A pass prints `PASS: desktop, Pixel 7 emulation, 320px touch; ...`. Then **open** `shots/visual-*.png` and `shots/room-*.png` and look at them. Note anything clipped, overlapping, unreadable or empty.

## 5. Laws spot-check

- `git diff main -- site/live/index.html` is empty unless the task was about the base page.
- No poem or essay text changed: `git diff main --stat -- site/live/index.html site/src/essays.js` is empty, or every line it touches is code, not authored text.
- No `Math.random(` or `Date.now(` introduced in engine or room code: `git diff main -- site/src site/visual site/landing | grep -nE '^\+.*(Math\.random|Date\.now)'` (prints nothing when clean).
- No new external URLs at runtime: `git diff main -- site/src site/visual site/landing | grep -nE '^\+.*https?://'` and check each hit is a link, not a script, font or image load.

## 6. Report (paste into the PR)

```
Build:        <kits/library/visual lines>
dist:         clean | committed
Engine sync:  ok | <file> differs (why)
JSON:         ok
Browser:      PASS | FAIL <message> | not run (<reason>)
Screenshots:  looked at desktop / Pixel 7 / 320 — <what you saw, one line each>
Not checked:  real Android device, screen reader, production (always list what applies)
```

Never write "live", "deployed" or "verified on production" unless you fetched https://pressurecookerpoetry.com and compared it to `site/public` in this session.
