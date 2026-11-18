# PCP CANON — what is true and decided right now

**Last checked against the repo and the live site: 2026-11-17** (main `e3372f2`, PR #11 merged). **Reset written 2026-11-18 on PR #14 (not live).**

This file is the single source of truth for Pressure Cooker Poetry.
Briefs, handoff docs, chat summaries, issues and PR descriptions are **history**, not canon.
If any of them disagrees with this file, **this file wins**. Point out the conflict; don't act on the older document.

---

**There is exactly one rulebook: this file.** `AGENTS.md`, `DESIGN.md` and the folder `AGENTS.md` files say *how* to work; this file says *what is decided*. `docs/DECISIONS.md` (written by a parallel session the same morning) was folded in here on 2026-11-17 and deleted.

## Rules for every collaborator (human, Claude, Codex, ChatGPT, Gemini, Muse)

1. **Read this file before planning anything.** Then read the top entry of `docs/logbook.md`.
2. **LOCKED means locked.** Don't redesign, re-propose or "improve" a locked decision unless Brandon writes `reopen D-xx`.
3. **Changing a decision = adding, never erasing.** Write a new decision with a new number. Move the old one to the Graveyard with the date and one line on why. Never quietly rewrite an old line.
4. **Graveyard ideas stay dead.** Don't rebuild them, even partly, even if an old brief describes them as the plan.
5. **Parked ideas wait.** Don't start them before the milestone they're parked behind.
6. **Build on what exists.** Start from current `main`. Never restart from an older branch, a prototype PR or a brief's description of the system.
7. **Verify before claiming.** "Merged" isn't "live". "Pipeline" isn't "assets". Say what you checked.
8. **Update this file in the same PR** whenever a decision changes or something new goes live.

---

**Release order:** `docs/GO_LIVE_PLAN.md` (one step open at a time; each goes build → test → preview → Brandon's OK → live → check live).

## LIVE NOW (verified 2026-11-17)

> **Production is still the old site** (the Kitchen at `/kitchen/`, the poem-first front door). The reset (D-31 to D-35) exists only on branch `release/step-1-front-door` / PR #14 until Brandon OKs a release. After that release, this table becomes the "After the reset" table below.

| URL | What visitors get | Code |
|---|---|---|
| `/` | Visual picker: 3 rounds × 10 cards, all 30 families once per deal, then a cooked room + receipt. **Cards are temporary palette stand-ins, no artwork yet** | `site/visual/` |
| `/kitchen/` | The original ingredient Kitchen (481 ingredients, six tastes, dartboard) | `site/live/` + `site/src/` |
| `/collage/` | Gone. Redirects to `/` | `site/landing/_redirects` |
| `/poems/`, `/essays/` | Search + deep links into the Kitchen's published writing | `site/landing/poems/`, `essays/` |
| `/learning/` | The Learning Curve (`/learning-curve/` redirects here, 301) | `site/landing/learning/` |
| `/about/`, `/contact/` | Mission; contact = public GitHub issues | `site/landing/` |
| `/brain-candy/` (local, not deployed) | Brain Candy arcade hub + wrapper jar + Department Zero File 001 | `site/landing/brain-candy/` |
| `/brain-candy/spin-cycle/` (local, not deployed) | Machine 01: The Spin Cycle | `site/landing/brain-candy/spin-cycle/` |

Deploys: Netlify project `pressurecookerpoetry`, connected to GitHub `main`. Build after the reset: `python3 site/tools/build.py` → publishes `site/public` (before it: `build.py && assemble.py`). **Never create a second Netlify project.**

### After the reset (on PR #14, not live yet)

| URL | What visitors get | Code |
|---|---|---|
| `/` | **Stand-in**: a plain page saying the cutup maker is being built, with links | `site/landing/index.html` |
| `/poems/`, `/poems/<id>/` | Plain list + one page per poem (56), every line verbatim | `content/poems.json` → `site/tools/build.py` |
| `/essays/`, `/essays/<id>/` | Plain list + each essay with its sources | `content/essays.json` |
| `/food-bank/` | The free-resources list that used to live in the Kitchen | `content/food-bank.json` |
| `/learning/`, `/about/`, `/contact/` | As before; links to the Kitchen repointed; About/Contact on the plain stylesheet | `site/landing/` |
| `/brain-candy/…` | As before, not in the menu (Step 4) | `site/landing/brain-candy/` |
| `/alive/lab/` | The motion engine's lab (test machinery, not linked) | `site/alive/` |
| `/kitchen/*`, `/visual/*`, `/visual-picks/*` | 301 redirects (to `/poems/` and `/`) | `site/landing/_redirects` |

### Honest inventory

- **Families:** 30, stable IDs, names and colours in `library/families.json` (moved out of the Kitchen's `styles.js` on 2026-11-18).
- **Kit parts:** 523 procedural CSS/SVG parts across the 30 families, in `library/families/*/kit/`. Not shipped since the reset; the new design decides whether they're used.
- **Library cutouts: 509 real image files**, every one looked at and tagged. Sources: CC0 museum open access (Met, Cleveland: 74), Muse originals (424), ChatGPT originals (Punk, 8), fragments from Brandon's Cosmos posters with artists credited (1), earlier Constructivism pieces (2). Per family: mexican-muralism 31, art-nouveau 30, gothic-revival 30, futurism 30, expressionism 30, ukiyo-e 29, rococo 28, situationism 20, memphis 19, brutalism 19, cyberpunk 19, op-art 19, surrealism 18, bauhaus 18, minimalism 18, grunge-design 18, maximalism 17, psychedelia 16, abstract-expressionism 16, punk 14, geometric-abstraction 13, zine-diy 11, pop-art 10, vaporwave 9, art-deco 8, y2k 8, swiss 6, dada 3, constructivism 2. **Under 8:** constructivism 2, dada 3, swiss 6, afrofuturism 0. Muse now works toward 30 per family (its own notes); the canon floor is still 8. Records: `library/cutouts/manifest.json` (live), `candidates.json` (everything harvested, with keep/reject and reasons).
- **Writing:** 56 poems (2,650 lines), 2 essays, the Food Bank (52 resources), all in `content/` since 2026-11-18, checked line by line against the Kitchen source when moved.
- **Receipts:** the old `pcp-visual/1` receipts died with the old front door. The cutup card gets its own share-link format when it's built.

---

## LOCKED DECISIONS

| # | Decision | Since |
|---|---|---|
| D-01 | Authored writing is never edited or rewritten by any generator or agent. | Oct 2026 |
| D-02 | Deterministic: same choices + same seed + same build = same room. A different seed = another coherent take on the same choices. | Oct 2026 |
| ~~D-03~~ | The front door is the **visual picker**: 3 rounds, 10 fragments each, pick one per round, 30 families once per deal, shuffled by seed. | 2026-11-17 · **Superseded 2026-11-18 by D-31** |
| D-04 | Picks are aesthetic signals, **not diagnosis**. No personality, gender or mood claims about the visitor. | 2026-11-17 |
| D-17 | **No dials.** Picked visual elements translate straight onto the emotion wheel (Plutchik dartboard). Each pick's tags become masked, vectored design layers (ground, type, cutouts, motion, layout pressure) that respond to each other. No taste matrix, no energy/clarity/intimacy/chaos, no Heat/Order/Noise/Weight in between. | 2026-11-17 |
| D-06 | Each family's emotion tags stay as separate darts. Contradictions are kept, never averaged away. | 2026-11-17 |
| ~~D-07~~ | Layout grammar is chosen separately, biased (not dictated) by the picks. | 2026-11-17 · **Superseded 2026-11-18 by D-31** |
| ~~D-08~~ | The Kitchen stays at `/kitchen/` as the optional deep-play pantry. Don't delete or fork it. | 2026-11-17 · **Superseded 2026-11-18 by D-31** |
| D-09 | No account is ever required to make art. Receipts are link + JSON file + one local browser save. | 2026-11-17 |
| D-10 | One Learning Curve, at `/learning/`. | 2026-11-17 |
| D-11 | No generic SaaS look, no blog template, no beige/cream "tasteful" ground. Polished brutalist cut-paper collage with a leftist guerrilla-punk undertone, even at a whisper, but not every room as the same red-black punk poster. | Oct–Nov 2026 |
| D-12 | Satire punches up at the powerful, never at people underneath. | Nov 2026 |
| D-13 | The site is about the **visitor**: a menu of resources; Brandon's work is one item on it. Landing intro leaves out his name and bio. | Nov 2026 |
| D-14 | Keep propaganda pieces (e.g. red-scare ads) in the library as teaching material. | Nov 2026 |
| D-15 | Collage like sampling: fragments yes, whole works no, nothing sold, avoid litigious megacorps (e.g. Disney). Provenance recorded for every asset. | Nov 2026 |
| D-18 | Build **one room at a time**: the site sections (front door, Poems, Essays, Learning Curve, Mission, Contact), then the cooked result rooms, each designed individually. Visitors' three picks are remembered in their own browser (no account) and style every room they walk into. Rooms also react to the visitor live (touch, motion, scroll). | 2026-11-17 |
| D-19 | **Fresh start, no old visuals.** The AI atlas and the old collage landing are deleted. History lives only in git (tag `archive/pre-reset-2026-11-17`). Nothing from before today comes back as a visual unless Brandon names it. | 2026-11-17 |
| D-20 | **Cutouts are real image files, never descriptions.** Each one = transparent PNG master + WebP web copy + a manifest record with source URL, creator, date and license. Sources: CC0 museum open access (Met, Cleveland), or Brandon's own / cleared work. Nothing reaches the site until someone has looked at it and tagged it on the emotion wheel. Workflow: `tools/cutouts/harvest.py` → `contact_sheet.py` → `promote.py` (see `library/cutouts/README.md`). | 2026-11-17 |
| ~~D-21~~ | Picker rooms use **only real library cutouts**. Each of the three picked families puts one of its own cutouts in first; the rest are wildcards chosen by emotion-wheel closeness from the whole library. | 2026-11-17 · **Superseded 2026-11-18 by D-31** |
| D-22 | **ChatGPT (or another image-capable AI) makes the first pass for the empty and thin families**, as original image files, using `docs/handoffs/AI_CUTOUT_BRIEF.md`. Deliveries come back through `tools/cutouts/ingest.py` and pass the same look-and-tag gate (D-20). Provenance marks each one as AI-generated for PCP. | 2026-11-17 |
| D-23 | **Visitors only make choices.** Test machinery (flavor bars, odds, dartboard, poem picker, inspector) shows only in lab mode `?lab=1`. No new visitor-facing control without Brandon's OK. | 2026-11-01 |
| D-24 | Look: the torn-paper "Cutup Database" mockups and the Living Cover hero are the target: polished brutalism, page by page. Rooms mix several families, never one top to bottom; each family owns a layer; grammars may collide. References: Jacobin, AIGA Eye on Design. | Nov 2026 |
| D-25 | Voice: talk to the visitor in second person; ~~the absurdly huge Kitchen pantry stays huge~~ (pantry retired, D-31); fact, satire and fiction are always labelled apart; inclusive, no corporate filler. | Nov 2026 |
| D-26 | No live AI API calls from the site, no analytics, tracking, login walls or visitor profiling. Generation happens at build time; the site picks from a library. | Nov 2026 |
| D-27 | Process: Brandon OKs **each** production deploy (OKs don't carry over). Agents open reviewable PRs; nobody auto-merges. One Netlify project, never a second. | Nov 2026 |
| ~~D-28~~ | Saved rooms are framed as a **coupon** for next time. The drawing wall lives in each piece's margin, free in-browser recognition, auto-scored lines; it can be pulled later if it doesn't work. | Nov 2026 · **Superseded 2026-11-18 by D-31** |
| D-29 | **The site is alive.** One input engine (`site/alive/alive.js` since the reset, doc: `docs/ALIVE.md`) turns touch, keys, scroll, sound and tilt into signals; every cutout moves by a verb chosen from its own emotion tags. Visitors can drag cutouts, type ransom letters, stamp ink. Sound comes only from an opt-in microphone or a song file the visitor picks, stays on the device, is never recorded or sent. Motion never changes a receipt. Reduced-motion and "Hold still" stop it. Replaces the deleted microphone experiment with new code. | 2026-11-17 |
| D-30 | **Brain Candy is unparked** (Brandon, 2026-11-17). An arcade of machines, each Play → Reveal → Learn, with a wrapper jar that opens Department Zero cipher files. Hand-written content, no live AI; fiction labelled, satire points up; jar kept in the visitor's browser only. Plan: `docs/BRAIN_CANDY.md`. Machine 01, The Spin Cycle, is built. | 2026-11-17 |
| D-16 | The GitHub repo `imagetoform/pressure-cooker-poetry` is the one home for site, database, kits and cutouts. | Nov 2026 |
| D-31 | **The Kitchen is retired and deleted** (Brandon, 2026-11-18: *"i do not want the old generative kitchen on the site, it's redundant … not the whole kitchen, fridge, recipes, nutrition card, i don't like the old designs, they are too rigid and tacky looking … get rid of the old versions so we're not mixing them into the design over and over"*). Gone: the Kitchen and its pantry, fridge, recipes, nutrition card, coupons, drawing wall, dartboard UI, six poem-first layout grammars, the old front door (3×10 picker, adapter, cooked rooms, receipts) and the build that patched them. The writing, families, emotion vocabulary, seeded PRNG and alive engine were moved out first. Supersedes D-03, D-07, D-08, D-21, D-25's pantry clause and D-28. | 2026-11-18 |
| D-32 | **The outcome is a cutup card**: torn-paper strips of words over collage imagery from the cutout library, like the references in `docs/design/reference/`, and one of many possible outcomes. The words **mix lines cut from Brandon's poems with the visitor's own words** (Brandon's choice). A strip of Brandon's words is an exact run of his words: never retyped, re-spelled or swapped inside the strip. Every card credits and links each poem it cut from, and the full poem stays verbatim on its own page (D-01 stands). | 2026-11-18 |
| D-33 | **Front door = make one first.** A visitor starts making a cutup (picking images and adding words) right away; nobody lands straight in a poem. How the picking works is designed with Brandon in the cutup-maker step (Q-14). Same choices + same seed = same card (D-02). | 2026-11-18 |
| D-34 | **No logins, saves stay local.** "Saved" lives in the visitor's own browser; a card can be shared as a link. No accounts, likes, view counts or contribution counters, even though the references show them (restates D-09 and D-26 for the new design). Poems and essays live on **plain reading pages** for now, restyled in the new look later. | 2026-11-18 |
| D-35 | **DESIGN.md is superseded.** It described the Kitchen look. The new design system is written with Brandon during the cutup-maker step, from the reference pictures. Until then only AGENTS.md's access rules bind (4.5:1, keyboard and touch, reduced motion, 320px). D-11 (no SaaS look, no beige ground) and D-24 (torn-paper Cutup Database target) stand. | 2026-11-18 |

---

## NOT DONE YET (decided, not built)

- **The cutup maker (D-32, D-33)** is not built. `/` is a plain stand-in. **Sandbox v1** (2026-11-18) is at `/lab/cutup/` (unlinked, `site/landing/lab/cutup/`, test `site/tests/cutup.cjs`) with knobs for picks, strips, your-words share, words per strip, ground and shape, so Brandon can answer Q-14 by playing. It's the next big step in `docs/GO_LIVE_PLAN.md`, starting with how the picking works (Q-14) and a new design system (D-35).
- **D-18's section rooms**: Poems, Essays and the Food Bank are plain pages; Learning, About and Contact still wear their older styles. Each gets redesigned in the new look, one at a time.
- **Bigger motion with music (go-live Step 2)** isn't started; it now tunes the alive engine for the cutup card.
- **Old remote branches** (20) are still on GitHub.

---

## OPEN — needs Brandon's eye (don't decide these for him)

| # | Question | Notes |
|---|---|---|
| Q-07 | Where do the 16 families with no cutouts get their art? **First pass: ChatGPT (D-22).** Still open: whether Brandon's own art and scans join later. | Minimalism, Swiss, Brutalism, Punk, Zine/DIY, Situationism, Grunge, Cyberpunk, Vaporwave, Afrofuturism, Y2K, Maximalism, Pop Art, Memphis, Abstract Expressionism, Op Art. These are post-1930 and mostly still in copyright, so museums don't release them. Options: Brandon's own art, photos and pulp-magazine scans; original pieces made for the site; or public-domain material processed in the family's style (e.g. old newspaper photos photocopied for Punk). Thin families that need more: Art Deco, Dada, Constructivism, Geometric Abstraction. |
| Q-10 | Batches Muse made that never reached Claude: Constructivism (5), Dada (8), Punk (6), and round 1 of Zine/DIY (9), Swiss (10), Pop Art (9). Send them? | Constructivism, Dada and Swiss are still under 8. |
| Q-11 | Grunge's ripped page and tape cross are too clean (clip-art). Replace? | Both kept for now to hold Grunge at 8, flagged in their notes. |
| Q-12 | Brain Candy: grow the Spin Cycle's tricks? How loud should the fictional clients be? One wrapper jar or one per machine? | See `docs/BRAIN_CANDY.md`. |
| Q-14 | **How does making a cutup work?** What does a visitor pick (images? a family? a mood?), how many of their own words, how the poem lines get chosen, how many strips, what a finished card holds, and what "one of many outcomes" covers beyond the card. | The first question of the cutup-maker step. Design with Brandon, playable sandbox first. |
| Q-13 | Muse reports Brandon raised its target to **30 cutouts per family** (5–6 minimum per batch, keep going without stopping). Confirm? | Not stated to Claude directly; recorded so it isn't lost. |

---

## PARKED — good ideas, not now

Parked behind: **the cutup maker is live and looks good on a phone.**

- Department Zero beyond File 001 (the full multi-visit escape room)
- Accounts, OAuth, galleries, achievements (D-34: not without Brandon reopening it)
- Subreddit, comments, submissions, moderation
- Drawing wall extended across all writing
- Archival image snapshots of rooms
- OpenRouter / GitHub Actions cutout pipeline (`tools/cutouts/run.py`, `cutouts.yml`, PR #4). Replaced as the main path by `tools/cutouts/harvest.py` (D-20), which needs no API key. Kept for reference.

---

## GRAVEYARD — superseded, do not rebuild

| Idea | Killed | Why / replaced by |
|---|---|---|
| **The Kitchen**: pantry (481 ingredients), fridge, recipes, nutrition card, coupons, drawing wall, dartboard UI, Pressurize moment, lab mode | 2026-11-18 | Brandon: redundant, rigid, tacky (D-31). Deleted; the writing moved to `content/`. In git history before the reset commit. |
| Poem-first rooms (six layout grammars that arrange one poem, cutouts at the edges), database-only room mode | 2026-11-18 | D-31. The outcome is the cutup card (D-32); nobody lands in a poem (D-33). |
| Front door 3×10 visual picker with palette stand-in cards, its Kitchen adapter, cooked rooms and `pcp-visual/1` receipts | 2026-11-18 | D-31, D-33. |
| The old `DESIGN.md` token set and look as a spec | 2026-11-18 | Kept as history only (D-35). |
| Nutrition-label cards (was parked) | 2026-11-18 | Brandon named the nutrition card as something to remove (D-31). |
| Three-question **verbal** Mood Interview as the front door (PR #7) | 2026-11-17 | Replaced by the visual picker (D-03). |
| Placeholder-SVG picker prototype (PR #9) | 2026-11-17 | Rebuilt properly in PR #11 with real art and the engine adapter. |
| Cabinet "infomercial avalanche" as the front door / Gutter Intelligentsia cabinet landing at `/` | 2026-11-17 | Picker took `/`. The old collage lives at `/collage/` without the avalanche. |
| AI-generated 30-cell picker atlas (`family-atlas-v1.png`) | 2026-11-17 | Deleted (D-19). |
| Old collage landing at `/` and `/collage/`, cabinet, microphone experiment, ~235 legacy cutouts | 2026-11-17 | Deleted (D-19). `/collage/` redirects to `/`. |
| A cutout "database" made of text descriptions, research leads, shopping lists and pipeline proposals without image files | 2026-11-17 | Replaced by real files (D-20). |
| Branch `fix/collage-and-front-door-weight` (2026-11-17 10:38): self-hosted fonts for `/collage/` and per-family picker tiles cut from the AI atlas | 2026-11-17 | **Don't merge.** Built on the collage and atlas deleted by D-19. |
| Microphone "resonance" experiment on the collage page (PR #5) | 2026-11-17 | Deleted with the collage (D-19). |
| `docs/DECISIONS.md` as a second decisions file | 2026-11-17 | Folded into this file. One rulebook only. |
| First flat menu-style "Gutter" landing | Nov 2026 | Rejected by Brandon. |
| Ten-axis mood wheel as the live engine | Nov 2026 | Replaced by the emotion wheel (D-17). Background thinking only. |
| D-05: picker feeds the old engine through the taste/dial adapter | 2026-11-17 | Replaced by D-17. Picks go straight to the emotion wheel. |
| Hidden dials: energy / clarity / intimacy / chaos | 2026-11-17 | Retired by Brandon (D-17). |
| Six-taste matrix (sweet, sour, salty, bitter, umami, spicy) as the engine's middle step | 2026-11-17 | Retired with the dials (D-17). |
| Heat / Order / Noise / Weight card stats (was Q-03) | 2026-11-17 | Retired by Brandon (D-17). |
| A second Learning Curve at `/learning-curve/` | 2026-11-17 | Redirects to `/learning/` (D-10). |
| Q-09 (closed) | 2026-11-18 | Moot: visual.css is deleted; the new design system decides (D-35). |
| Q-08 (closed) | 2026-11-18 | Moot: the room-leading weights are gone (D-31). |
| Q-06 (closed) | 2026-11-18 | Moot: the cooked room intro is gone (D-31). |
| Q-05 (closed) | 2026-11-18 | Moot: the Pressurize/cook moment is gone (D-31). |
| Q-02 (closed) | 2026-11-18 | Moot: the receipt it was about is gone (D-31). |
| Q-01 (closed) | 2026-11-18 | Moot: the picker it was for is gone (D-31). |

---

## Canon change log

- **2026-11-18** — **Reset (D-31 to D-35).** Brandon dropped the Kitchen and the poem-first premise; the outcome is a cutup card (his lines + the visitor's words over collage), the front door makes one first, no logins, plain reading pages. Kitchen, old front door and their build deleted; writing, families, vocabulary, PRNG and alive engine moved out first. D-03/07/08/21/28 superseded; Q-01/02/04/05/06/08/09 closed; Q-14 added; graveyard and parked list updated.

- **2026-11-18** — Added `docs/GO_LIVE_PLAN.md` at Brandon's request (step-by-step test/build/go-live). Brandon asked for bigger motion with music/audio (plan Step 2) and mentioned an esoteric easter egg for later (Step 7, not yet described to Claude).
- **2026-11-17** — Muse batches 2 + 3: 219 kept, 15 rejected → 346 cutouts. Q-10 widened, Q-13 added. ingest.py reads Muse's format natively.
- **2026-11-17** — D-30: Brain Candy unparked; hub + The Spin Cycle built; Q-12.
- **2026-11-17** — D-29 alive layer (engine, front-door controls, `/visual/lab/alive/`, tests). Muse's first five families in (Minimalism, Memphis, Brutalism, Grunge, Situationism): 127 cutouts. Q-10, Q-11.
- **2026-11-17** — Muse mission written: `docs/handoffs/MUSE_CUTOUT_MISSION.md` (every family to 8+ cutouts, one PR per family, Brandon reviews each).
- **2026-11-17** — Merged the parallel playbook branch (`agents/codex-playbook`): its AGENTS.md, DESIGN.md, folder rules, skills and templates kept; its DECISIONS.md folded in as D-23–D-28, Q-08, Q-09; references repointed here. Punk: 8 ChatGPT cutouts (84 total).
- **2026-11-17** — D-22: ChatGPT does the first pass on empty families; ingest tool + brief added.
- **2026-11-17** — D-20, D-21: real cutout database (76 files) and how rooms use it; Q-07 added; old pipeline parked.
- **2026-11-17** — D-18, D-19: room-by-room build with picks remembered per browser; fresh start. Atlas and collage deleted; Q-01 rewritten.
- **2026-11-17** — D-17: dials, taste matrix and Heat/Order/Noise/Weight retired; picks go straight to the emotion wheel. D-05 and Q-03 closed.
- **2026-11-17** — File created from main `e3372f2`, the live site, `docs/ISSUE_10_MILESTONE_1.md`, `docs/logbook.md` and Brandon's stated decisions.
