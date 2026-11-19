---
name: pcp-verify
description: Build and check the Pressure Cooker Poetry site before opening or updating a pull request, then report results honestly. Use before every PR, after any change under site/, library/, content/ or tools/, and whenever you are about to say something works.
---

# pcp-verify

Run each step and keep the real output. If a step can't run, write down why and mark the PR as a draft. Don't skip to the report.

## 1. Build, twice

```sh
python3 site/tools/build.py
(cd site/public && find . -type f | sort | xargs sha256sum) > /tmp/one.txt
python3 site/tools/build.py
(cd site/public && find . -type f | sort | xargs sha256sum) | diff /tmp/one.txt - && echo "build is reproducible"
```

The build prints a line like `poems 56, essays 2, food bank 52, cutouts 509`. Copy it into the report.

## 2. Data files parse

```sh
python3 -c "import json;[json.load(open(p)) for p in ['library/cutouts/manifest.json','library/catalog.json','library/families.json','content/poems.json','content/essays.json','content/food-bank.json']];print('json ok')"
```

Also parse any data file you created or edited, and count its records against what you meant to write.

## 3. Browser suites

```sh
python3 -m http.server 8765 --directory site/public > /tmp/pcp-http.log 2>&1 &
npm install --no-save playwright@1.62.1 && npx playwright install --with-deps chromium
node site/tests/site.cjs        # every page at 320px + desktop, every poem line verbatim
node site/tests/alive.cjs       # the motion engine on /alive/lab/
node site/tests/spin-cycle.cjs  # Brain Candy
```

For any visual change, take screenshots of the pages you touched at 320px, phone and desktop, **open** them, and note anything clipped, overlapping, unreadable or empty.

## 4. Laws spot-check

- No poem or essay text changed: `git diff main --stat -- content/` is empty, unless the owner asked for a content change.
- No `Math.random(` or `Date.now(` introduced in anything that decides what a visitor sees: `git diff main -- site | grep -nE '^\+.*(Math\.random|Date\.now)'`.
- No new external URLs at runtime: `git diff main -- site | grep -nE '^\+.*https?://'`; check each hit is a link, not a script, font or image load.
- Nothing from the Graveyard came back (CANON): no Kitchen, fridge, recipe, nutrition card or poem-first room.

## 5. Report (paste into the PR)

```
Build:        <the poems/essays/cutouts line>, reproducible yes/no
JSON:         ok
Browser:      site PASS | alive PASS | spin-cycle PASS | FAIL <message> | not run (<reason>)
Screenshots:  <page @ width: what you saw, one line each>
Not checked:  real Android device, screen reader, production (always list what applies)
```

Never write "live", "deployed" or "verified on production" unless you fetched https://pressurecookerpoetry.com and compared it to `site/public` in this session.
