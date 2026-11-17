# PCP CANON — what is true and decided right now

**Last checked against the repo and the live site: 2026-11-17** (main `e3372f2`, PR #11 merged)

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

## LIVE NOW (verified 2026-11-17)

| URL | What visitors get | Code |
|---|---|---|
| `/` | Visual picker: 3 rounds × 10 cards, all 30 families once per deal, then a cooked room + receipt. **Cards are temporary palette stand-ins, no artwork yet** | `site/visual/` |
| `/kitchen/` | The original ingredient Kitchen (481 ingredients, six tastes, dartboard) | `site/live/` + `site/src/` |
| `/collage/` | Gone. Redirects to `/` | `site/landing/_redirects` |
| `/poems/`, `/essays/` | Search + deep links into the Kitchen's published writing | `site/landing/poems/`, `essays/` |
| `/learning/` | The Learning Curve (`/learning-curve/` redirects here, 301) | `site/landing/learning/` |
| `/about/`, `/contact/` | Mission; contact = public GitHub issues | `site/landing/` |

Deploys: Netlify project `pressurecookerpoetry`, connected to GitHub `main`. Build: `python3 site/tools/build.py && python3 site/tools/assemble.py` → publishes `site/public`. **Never create a second Netlify project.**

### Honest inventory

- **Families:** 30, stable IDs in `site/visual/adapter.js` (`order` array) and `site/src/styles.js`.
- **Kit parts:** 523 procedural CSS/SVG parts across the 30 families.
- **Picker art:** none. Cards show each family's own palette as colour bands until new art is made and approved (Q-01).
- **Library cutouts: 127 real image files**, every one looked at and tagged. Sources: CC0 museum open access (Met, Cleveland), ChatGPT originals (Punk), Muse originals (Minimalism, Memphis, Brutalism, Grunge, Situationism), 2 earlier Constructivism pieces. Per family: mexican-muralism 10, situationism 10, brutalism 9, rococo 8, gothic-revival 8, expressionism 8, punk 8, minimalism 8, memphis 8, grunge-design 8, art-nouveau 7, futurism 7, ukiyo-e 6, surrealism 5, bauhaus 5, psychedelia 4, dada 3, constructivism 2, art-deco 2, geometric-abstraction 1. **10 families have none.** Records: `library/cutouts/manifest.json` (live), `candidates.json` (everything harvested, with keep/reject).
- **Writing:** 56 poems, 2 essays, all authored by Brandon.
- **Receipt format:** `pcp-visual/1`. Old receipts are rejected (not silently re-rendered) when the build changes.

---

## LOCKED DECISIONS

| # | Decision | Since |
|---|---|---|
| D-01 | Authored writing is never edited or rewritten by any generator or agent. | Oct 2026 |
| D-02 | Deterministic: same choices + same seed + same build = same room. A different seed = another coherent take on the same choices. | Oct 2026 |
| D-03 | The front door is the **visual picker**: 3 rounds, 10 fragments each, pick one per round, 30 families once per deal, shuffled by seed. | 2026-11-17 |
| D-04 | Picks are aesthetic signals, **not diagnosis**. No personality, gender or mood claims about the visitor. | 2026-11-17 |
| D-17 | **No dials.** Picked visual elements translate straight onto the emotion wheel (Plutchik dartboard). Each pick's tags become masked, vectored design layers (ground, type, cutouts, motion, layout pressure) that respond to each other. No taste matrix, no energy/clarity/intimacy/chaos, no Heat/Order/Noise/Weight in between. | 2026-11-17 |
| D-06 | Each family's emotion tags stay as separate darts. Contradictions are kept, never averaged away. | 2026-11-17 |
| D-07 | Layout grammar is chosen separately, biased (not dictated) by the picks. | 2026-11-17 |
| D-08 | The Kitchen stays at `/kitchen/` as the optional deep-play pantry. Don't delete or fork it. | 2026-11-17 |
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
| D-21 | Picker rooms use **only real library cutouts**. Each of the three picked families puts one of its own cutouts in first; the rest are wildcards chosen by emotion-wheel closeness from the whole library. | 2026-11-17 |
| D-22 | **ChatGPT (or another image-capable AI) makes the first pass for the empty and thin families**, as original image files, using `docs/handoffs/AI_CUTOUT_BRIEF.md`. Deliveries come back through `tools/cutouts/ingest.py` and pass the same look-and-tag gate (D-20). Provenance marks each one as AI-generated for PCP. | 2026-11-17 |
| D-23 | **Visitors only make choices.** Test machinery (flavor bars, odds, dartboard, poem picker, inspector) shows only in lab mode `?lab=1`. No new visitor-facing control without Brandon's OK. | 2026-11-01 |
| D-24 | Look: the torn-paper "Cutup Database" mockups and the Living Cover hero are the target: polished brutalism, page by page. Rooms mix several families, never one top to bottom; each family owns a layer; grammars may collide. References: Jacobin, AIGA Eye on Design. | Nov 2026 |
| D-25 | Voice: talk to the visitor in second person; the absurdly huge Kitchen pantry stays huge (satire of fake abundance); fact, satire and fiction are always labelled apart; inclusive, no corporate filler. | Nov 2026 |
| D-26 | No live AI API calls from the site, no analytics, tracking, login walls or visitor profiling. Generation happens at build time; the site picks from a library. | Nov 2026 |
| D-27 | Process: Brandon OKs **each** production deploy (OKs don't carry over). Agents open reviewable PRs; nobody auto-merges. One Netlify project, never a second. | Nov 2026 |
| D-28 | Saved rooms are framed as a **coupon** for next time. The drawing wall lives in each piece's margin, free in-browser recognition, auto-scored lines; it can be pulled later if it doesn't work. | Nov 2026 |
| D-29 | **The site is alive.** One input engine (`site/visual/alive.js`, doc: `docs/ALIVE.md`) turns touch, keys, scroll, sound and tilt into signals; every cutout moves by a verb chosen from its own emotion tags. Visitors can drag cutouts, type ransom letters, stamp ink. Sound comes only from an opt-in microphone or a song file the visitor picks, stays on the device, is never recorded or sent. Motion never changes a receipt. Reduced-motion and "Hold still" stop it. Replaces the deleted microphone experiment with new code. | 2026-11-17 |
| D-16 | The GitHub repo `imagetoform/pressure-cooker-poetry` is the one home for site, database, kits and cutouts. | Nov 2026 |

---

## NOT DONE YET (decided, not built)

- **D-17 is a decision, not code.** `site/visual/adapter.js` still routes picks through the old taste matrix and dials. Next job: rewrite it to go straight to the emotion wheel, then delete the dead dial code from `site/src/tastes.js`. The Kitchen at `/kitchen/` still runs on that code until then.
- **D-18** is not started. **The rooms don't show the cutouts well yet:** they are the old Kitchen's poem-first layouts, and cutouts land small or at the edges. Rebuilding the rooms around the art is the next job.
- **Old remote branches** (20) are still on GitHub. Deleting them needs push access.

---

## OPEN — needs Brandon's eye (don't decide these for him)

| # | Question | Notes |
|---|---|---|
| Q-01 | What is the new picker art? | Atlas deleted (D-19). Stand-in palette cards are live. Options: Brandon's own art, cleared cutouts per family, or a new generated set he art-directs first. Biggest visual lever on the front door. |
| Q-02 | Should the seed box and raw JSON stay visible on the result screen? | The README's design law says seeds are hidden test machinery. They currently sit inside a collapsed "Your recipe receipt" panel. |
| Q-07 | Where do the 16 families with no cutouts get their art? **First pass: ChatGPT (D-22).** Still open: whether Brandon's own art and scans join later. | Minimalism, Swiss, Brutalism, Punk, Zine/DIY, Situationism, Grunge, Cyberpunk, Vaporwave, Afrofuturism, Y2K, Maximalism, Pop Art, Memphis, Abstract Expressionism, Op Art. These are post-1930 and mostly still in copyright, so museums don't release them. Options: Brandon's own art, photos and pulp-magazine scans; original pieces made for the site; or public-domain material processed in the family's style (e.g. old newspaper photos photocopied for Punk). Thin families that need more: Art Deco, Dada, Constructivism, Geometric Abstraction. |
| Q-08 | Pop Art and Maximalism lead more rooms than others (about 16% and 12.5%). Retune? | Reported by the playbook session, not changed. |
| Q-09 | Front door styling: `site/visual/visual.css` uses Arial/Georgia and cream `#f3eadb` on `#17151a` with a lime accent, off the Kitchen's tokens in `DESIGN.md`. Bring it onto the tokens, or keep it? | Raised by the playbook session. Cream conflicts with D-11. |
| Q-10 | Muse mentions earlier Constructivism (5), Dada (8) and Punk (6) batches that weren't in the zips. Send them? | Constructivism and Dada are thin. |
| Q-11 | Grunge's ripped page and tape cross are too clean (clip-art). Replace? | Both kept for now to hold Grunge at 8, flagged in their notes. |
| Q-04 | Rococo ground reads dark, not pastel. | From the 2026-11-05 logbook. |
| Q-05 | Pressure gauge as the PRESSURIZE button + reveal? Post-Pressurize animation from cssauthor.com? | Both raised for the old cabinet flow. Do they carry over to the picker's "Cook my room"? |
| Q-06 | Room intro copy: carry over "You walked in hungry… draw your own damn map"? | Approved earlier for the old landing. |

---

## PARKED — good ideas, not now

Parked behind: **the picker art is approved and the cooked rooms look good on a phone.**

- Brain Candy (Propaganda Machine, S.O.F.T., DoubleSpeak, Bias Factory, Red-String Machine)
- Department Zero / hidden-world escape room
- Accounts, OAuth, galleries, achievements
- Subreddit, comments, submissions, moderation
- Drawing wall extended across all writing
- Archival image snapshots of rooms
- Nutrition-label cards for the pieces index (study first).
- OpenRouter / GitHub Actions cutout pipeline (`tools/cutouts/run.py`, `cutouts.yml`, PR #4). Replaced as the main path by `tools/cutouts/harvest.py` (D-20), which needs no API key. Kept for reference.

---

## GRAVEYARD — superseded, do not rebuild

| Idea | Killed | Why / replaced by |
|---|---|---|
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

---

## Canon change log

- **2026-11-17** — D-29 alive layer (engine, front-door controls, `/visual/lab/alive/`, tests). Muse's first five families in (Minimalism, Memphis, Brutalism, Grunge, Situationism): 127 cutouts. Q-10, Q-11.
- **2026-11-17** — Muse mission written: `docs/handoffs/MUSE_CUTOUT_MISSION.md` (every family to 8+ cutouts, one PR per family, Brandon reviews each).
- **2026-11-17** — Merged the parallel playbook branch (`agents/codex-playbook`): its AGENTS.md, DESIGN.md, folder rules, skills and templates kept; its DECISIONS.md folded in as D-23–D-28, Q-08, Q-09; references repointed here. Punk: 8 ChatGPT cutouts (84 total).
- **2026-11-17** — D-22: ChatGPT does the first pass on empty families; ingest tool + brief added.
- **2026-11-17** — D-20, D-21: real cutout database (76 files) and how rooms use it; Q-07 added; old pipeline parked.
- **2026-11-17** — D-18, D-19: room-by-room build with picks remembered per browser; fresh start. Atlas and collage deleted; Q-01 rewritten.
- **2026-11-17** — D-17: dials, taste matrix and Heat/Order/Noise/Weight retired; picks go straight to the emotion wheel. D-05 and Q-03 closed.
- **2026-11-17** — File created from main `e3372f2`, the live site, `docs/ISSUE_10_MILESTONE_1.md`, `docs/logbook.md` and Brandon's stated decisions.
