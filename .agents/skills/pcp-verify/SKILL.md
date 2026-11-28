---
name: pcp-verify
description: Build and check the Pressure Cooker Poetry site before opening or updating a pull request or pushing to main, then report results honestly. Use after any change under site/, library/, content/ or tools/, and whenever you are about to say something works or is live.
---

# pcp-verify

Run each step and keep the real output. If a step can't run, write down why. Don't skip to the report.

## 1. Build (the D-42 gate runs inside it)

```sh
python3 site/tools/build.py
```

The build runs `site/tests/architecture_contract.py` and stops if it fails. It is a production gate: never disable or bypass it; fix forward according to `docs/CANON.md`. Copy the build's summary lines into the report.

## 2. Data files parse

```sh
python3 -c "import json;[json.load(open(p)) for p in ['library/cutouts/manifest.json','library/catalog.json','library/families.json','content/poems.json','content/essays.json','content/food-bank.json']];print('json ok')"
```

Also parse any data file you created or edited, and count its records against what you meant to write.

## 3. Browser suites (same list as .github/workflows/site-build.yml)

```sh
python3 -m http.server 8765 --directory site/public > /tmp/pcp-http.log 2>&1 &
npm install --no-save playwright@1.62.1 && npx playwright install --with-deps chromium
node site/tests/site.cjs         # every page at 320px + desktop, every poem line verbatim
node site/tests/alive.cjs        # reactive cutout engine
node site/tests/spin-cycle.cjs   # Brain Candy
node site/tests/cutup.cjs        # /lab/cutup/
node site/tests/cutup-bench.cjs  # Cut-Up Bench, mouse + real touch
node site/tests/wall.cjs         # /lab/wall/ paste-up wall sandbox
node site/tests/mood.cjs         # the front door: questionnaire -> transition -> seeded world
```

For any visual change, take screenshots at 320px, phone and desktop (several seeds for generative pages), **open** them, and note anything clipped, overlapping, unreadable or empty.

## 4. Laws spot-check

- No poem or essay text changed: `git diff origin/main --stat -- content/` is empty unless the owner asked.
- Nothing visitor-facing is decided by unseeded randomness: `git diff origin/main -- site | grep -nE '^\+.*(Math\.random|Date\.now)'`. Making a *new* seed is fine; drawing a page from it must be reproducible.
- No new runtime external URLs: `git diff origin/main -- site | grep -nE '^\+.*https?://'`; every hit must be a link, not a script, font or image load.
- No tracking, no account wall; microphone stays opt-in and local.
- Nothing retired came back (CANON D-42): no Kitchen, fridge, recipe card, cut-up maker on `/`, poem-first cover.

## 5. Report: three separate states

```
SOURCE CHANGED:        <commit> on <branch>; build + contract PASS; suites: site | alive | spin-cycle | cutup | cutup-bench | wall | mood
DEPLOY READY:          yes/no (why)
PUBLIC SITE VERIFIED:  no | yes: fetched https://pressurecookerpoetry.com/<path> and ran <suite> with PCP_BASE=https://pressurecookerpoetry.com
Not checked:           real Android device, screen reader, ... (list what applies)
```

Pushing to main does not deploy. Deploys go to the existing Netlify project and need the owner's OK. Never write "live", "deployed" or "verified on production" unless you fetched the public URL in this session.
