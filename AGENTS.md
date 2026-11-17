# AGENTS.md — Pressure Cooker Poetry

Instructions for any coding agent working in this repository (Codex / ChatGPT, Claude, Gemini, Muse). Read this file completely before you touch anything. `site/AGENTS.md` and `library/AGENTS.md` add rules for those folders. **Before any visual or UI change, also read `DESIGN.md`.** **Before planning anything, read `docs/CANON.md`**: what's live, what's locked, what's open, what's parked and what's dead. Don't reopen a LOCKED decision unless Brandon writes `reopen D-xx`, and never rebuild anything in its Graveyard.

## What this is, in one paragraph

pressurecookerpoetry.com is a generative poetry, art, essay and learning site. A visitor makes a few choices (three rounds of visual fragments at the front door, or ingredients from an absurdly huge pantry in the Kitchen), and a deterministic engine cooks a "room": a collage layout built around one of the owner's poems. The writing never changes; the room around it does. The ethos is the **Gutter Intelligentsia**: drag ivory-tower ideas down to street level, anti-elitist, punk and Dada in attitude, free of gatekeeping. Core phrase: *Not a machine for producing answers. A machine for multiplying possibilities.* The owner is Brandon (GitHub `imagetoform`), a poet and visual artist. Satire always aims **up** at the powerful, never at the people underneath.

## Source of truth, in order

When two sources disagree, the higher one wins. Say so in your PR when you find a conflict.

1. What the owner says in the current task or issue.
2. `docs/CANON.md`: the one decisions file. Numbered, dated; changes are added, never erased.
3. The newest open build-brief issue (currently **#10**). Where it disagrees with the canon, the canon wins (the canon is newer).
4. This file, `DESIGN.md`, `docs/DATABASE_SPEC.md`.
5. `README.md`, `docs/logbook.md` and older handoffs. History, not orders.

Production can lag behind `main`. Never assume what is on `main` is live, or that what is live is on `main`.

## Laws that never bend

1. **Authored writing is never edited.** Poems and essays are byte-for-byte the owner's. No typo fixes, no "light edits", no generated poem text. Rooms change around the words.
2. **Same inputs, same room.** Every generative choice comes from the seeded PRNG (`cyrb128-sfc32`). `Math.random()`, `Date.now()`, network order or object-key order must never decide anything visible. A brand-new seed may come from `crypto.getRandomValues` (as `site/visual/app.js` does), but it goes into the receipt at once and everything flows from it. Same choices + same seed + same build = same composition.
3. **Visitors only make choices.** Visitors pick fragments or ingredients. Flavor bars, PSI odds, dartboard, poem picker, seeds and the inspector are test machinery, shown only in lab mode (`?lab=1`, off with `?lab=0`). The hidden dials are retired from the engine (CANON D-17). Don't add a new visitor-facing control without the owner's explicit OK. The receipt's "variant seed" field is the one approved exception.
4. **No invented facts, sources or files.** Every URL, licence, date, creator and file path you write must be one you actually opened or ran. See "How agents have failed here" below.
5. **No fake completion.** Never say something is live, deployed, tested or done unless you ran the check in this session and can show the output. "Merged" is not "live".
6. **No production deploys without the owner's explicit OK for that deploy.** Earlier OKs don't carry over. Never create a second Netlify project.
7. **Privacy first.** No analytics, tracking, login walls, demographic or personality inference, or network calls with visitor data. The microphone feature stays opt-in and local.
8. **Readability and access survive the chaos.** The poem's reading region stays legible (contrast at least 4.5:1), everything works by keyboard and touch, `prefers-reduced-motion` gets a still version, and no horizontal scroll at 320px.

## Repo map

| Path | What | Notes |
|---|---|---|
| `site/visual/` | Front door at `/`: three rounds of ten family fragments, then a cooked room and a receipt | `adapter.js` maps family ids to the engine; `app.js` is the UI |
| `site/live/index.html` | The original single-file Kitchen (poems, fonts, engine, six layout grammars) | **Never edit by hand.** It is the patch base for `build.py` |
| `site/src/` | Everything layered onto the Kitchen: tastes, pantry, dartboard, styles, wall, essays, coupons, lab, CSS | |
| `site/landing/` | The section pages `/poems/ /essays/ /learning/ /about/ /contact/`. The old collage landing was deleted (CANON D-19); `/collage/` redirects to `/` | `site/landing/src/` holds only `sections.js` |
| `site/tools/` | `build.py` (Kitchen into `dist/`), `assemble.py` (everything into `public/`), builders for kits, board, library, visual | |
| `site/dist/index.html` | Built Kitchen, **committed**. CI fails if it doesn't match a fresh build | |
| `site/public/` | Deploy output (gitignored). Netlify publishes this | |
| `site/tests/visual-flow.cjs` | The CI browser suite (desktop, Pixel 7, 320px) | |
| `library/families/<branch>/<movement>/` | 30 design movements: `kit/` CSS parts, `cutouts/`, README, SHOPPING list | |
| `library/cutouts/` | `manifest.json` (what the site uses), `candidates.json` (everything harvested, kept/rejected), `inbox/`. Workflow in its README | |
| `library/intake/` | Delivery JSON for the parked OpenRouter workflow (CANON: Parked) | |
| `tools/cutouts/` | **Main path:** `harvest.py` (CC0 museum images), `ingest.py` + `split_sheet.py` (deliveries from ChatGPT or other AIs), `contact_sheet.py` (look), `promote.py` (tag or reject). Parked: `run.py` + OpenRouter prompts | |
| `tools/kits/generate.py` | Generates the CSS kit parts per movement | |
| `tools/animations/` | Animation contract, harness and prompt for the Pressurize moment | |
| `docs/` | Spec, decisions, logbook, audits | |
| `src/data/` | Raw records from earlier model runs. **Audited: 0 of 18 usable.** Don't build on them | |

## Commands

```sh
# full build, exactly what Netlify runs
python3 site/tools/build.py && python3 site/tools/assemble.py

# serve and run the CI browser suite
python3 -m http.server 8765 --directory site/public &
npm install --no-save playwright@1.62.1 && npx playwright install --with-deps chromium
node site/tests/visual-flow.cjs        # screenshots land in shots/ (gitignored)

# CI also requires this to be empty after a build:
git diff --exit-code -- site/dist
```

No package.json, no bundler, no framework. Plain HTML, CSS and vanilla JS in the browser; Python 3.12 standard library for builds. Don't add a framework, a bundler, a CDN script or an npm runtime dependency without the owner's OK.

## How to work

1. Read the task, then the files you'll touch. Run the build once before changing anything so you know the baseline is green.
2. Branch from fresh `main`: `feature/<issue>-<slug>`, `fix/<slug>` or `docs/<slug>`. Never push to `main`.
3. Keep the change to what was asked. Don't refactor neighbouring code, rename files, reformat or "clean up" on the side. If you see something worth fixing, list it in the PR under "Noticed, not touched".
4. Rebuild, commit `site/dist/` if it changed, and run the browser suite. For any visual change, look at the screenshots yourself before you claim anything about how it looks.
5. Open a PR using the template. Fill in every section honestly. Draft PR if anything is unverified.
6. Prepend a short entry to `docs/logbook.md` (newest first): what was asked, what you did, what you verified and how, what's open. Write it for the next agent, who has no memory of your session.

## Definition of done

- [ ] `build.py` and `assemble.py` pass; `git diff --exit-code -- site/dist` is clean after the build
- [ ] `node site/tests/visual-flow.cjs` passes, and you looked at desktop, Pixel 7 and 320px screenshots
- [ ] Determinism held: the same receipt or coupon reloads to the same genome
- [ ] Every authored poem line still renders verbatim
- [ ] No console errors, no local 404s, no horizontal overflow
- [ ] Reduced motion gives a still, complete page; every control works by keyboard
- [ ] Any new asset has a verified source record (`library/AGENTS.md`)
- [ ] PR says plainly what was **not** checked (real Android device, screen reader, production)

## How agents have failed here (don't repeat these)

- **Going in circles.** Agents worked from old briefs and handoffs instead of the current state, and rebuilt things the owner had already moved past. Two sessions on the same day even wrote two rival rulebooks. **Fix:** `docs/CANON.md` first, always. Briefs are history.
- **Descriptions instead of files.** Cutout "databases" made of text descriptions, research leads and pipelines with no images. **Fix:** a cutout is an image file that someone has looked at (CANON D-20).

These are real, from `docs/intake/*/AUDIT.md`:

- **Invented sources.** A batch of 18 asset records had made-up Wikimedia filenames, Met and archive.org URLs that 404, CodePen addresses that don't exist, fonts that don't exist and wrong licences. Two "woodcuts" were 1940s news photos. **Fix:** open every URL and download every file before writing its record. If you can't reach the web, write `"status": "unverified"` and say so. Never write a URL from memory.
- **Numbers by pattern instead of meaning.** 300 ingredients got their tastes from the row number, so "the communal potluck" came out the bitterest thing in the pantry. 224 cutouts got emotion tags in rotation. **Fix:** taste and tag one item at a time, for what it means. If you generate data with a script, the script may format it, never decide it.
- **Wrong ids.** `swiss-international` instead of the real id `swiss`. **Fix:** copy ids from `site/src/styles.js` or `library/families/`, never retype them.
- **Truncated files.** A YAML file stopped mid-line. **Fix:** parse every data file you write (`python3 -c "import json,sys;json.load(open(sys.argv[1]))" file`) and count its records.
- **Placeholder art passed off as real.** SVG stand-ins were presented as finished cutouts. **Fix:** label stand-ins as stand-ins, in the file and in the PR.
- **Claiming "live".** Merges were described as releases. **Fix:** live means you fetched the production URL and compared it to the build.

## Writing and voice (copy, labels, UI text)

- Talk to the visitor, not about the owner. Second person. Don't put the owner's name or biography into front-door copy.
- Literary but irreverent: bureaucratic forms, industrial labels, infomercial parody, fake coupons. Plain words over jargon.
- Satire punches up (landlords, CEOs, lobbyists, institutions). Never mock poor, sick, unhoused or otherwise struggling people.
- Inclusive by default. No in-group slang that shuts people out.
- Label fiction as fiction and facts as facts, with sources. Propaganda in the archive is shown as a teaching example, never endorsed.
- No corporate filler ("seamless", "elevate", "unlock", "journey").

## Skills in this repo

Codex loads these from `.agents/skills/`. Use them when the trigger fits:

| When | Skill |
|---|---|
| Before you open or update any PR | `pcp-verify` |
| Any change to layout, CSS, visuals, motion or copy | `pcp-design-pass` |
| Adding or tagging a cutout, kit part, font or snippet | `pcp-asset-intake` |

## When you're unsure

Ask in the PR or issue rather than guessing, when the question is about taste, voice, which movement something belongs to, publishing, or anything a visitor would see for the first time. Make the call yourself, and say which call you made, for mechanical things: naming, file placement, test structure.
