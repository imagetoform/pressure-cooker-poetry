---
task: pcp-site-update
goal: Put the Nov 1 2026 ideas onto pressurecookerpoetry.com (tastes instead of visible dials, drawing wall, essays with receipts, room coupons)
done_when: A Netlify preview of the updated site passes browser checks and Brandon approves publishing it to production
next: Brandon plays the cutup maker sandbox (artifact "CUTUP MAKER sandbox" or /lab/cutup/ on the PR #14 preview) and answers Q-14; then iterate the sandbox, write the new design system, and build it into / (Step 4).
owner: human
---

# Logbook — pressurecookerpoetry.com update

## 2026-11-19 00:23 — Q-15 yes ×3: Food Bank additions, xerox + glitch, Oulipo word games (sandbox v3)

### What was asked
Brandon: "yes to ALL 3" (Q-15 from the UI-references review).

### Done
| Action | Detail |
|--------|--------|
| Food Bank (D-36) | `content/food-bank.json`: 2 items appended to "Poetry, from scratch"; only additions (format check before writing). Descriptions use only facts confirmed on the pages |
| Xerox (D-37) | `cutup.js`: SVG filter `#cc-xerox` (turbulence grain knocks out toner + slight displacement), injected once; `make()` flags `imgs[].xerox` with its own sub-RNG `xerox` (other choices unchanged); `imgs[].family` added |
| Glitch (D-37) | sandbox listens to `A.onChange(S)`; `S.onset > 0.6` → `.cc-glitching` for 140 ms (max every 240 ms), strength from drama; CSS slices + pink/cyan split on `.cc-img` only |
| Games (D-38) | `play(text, game, R)`: n7 (437-noun list, keeps caps/plurals/punctuation), lipo (banned letter from e/a/o/i/t/s per card, words → █ runs rendered as `.cc-redact` bars, strip flips to white paper), snowball; game in the state/link, chips (radiogroup, arrow keys) + live preview by the words box; caption tag "your words: …" |
| Tests | cutup.cjs: games keep poem strips exact, lipo hides the banned letter, snowball order, n7 swaps, link restores game, punk always xerox, filter present, beat.wav triggers glitch, words never glitch; 300-card loop now cycles games. All 4 suites PASS; build reproducible |
| Artifact | CUTUP MAKER sandbox v3 (version 1795069385-50a6) |

### Open / notes
- Another chat's project note: Brandon wants a blackout/erasure canvas and a Burroughs razor-and-glue cut-up (split words, glue halves), with tool assets he'll make himself. Not started; would be its own step.

## 2026-11-18 14:07 — Intake: UI references + proposals file, reviewed (nothing built)

### What was asked
Brandon attached a research file (13 UI references with dial numbers, 2 reading resources, 6 code proposals) "for looking over".

### Done
| Action | Detail |
|--------|--------|
| Saved | `docs/intake/2026-11-18-ui-references/SOURCE.md` (byte-identical, `cmp` checked) |
| Links | opened 7: brutalistfolio (MIT), oulipo (MIT), 3 gists (no licence stated; one is a copy of Ksenia Kondrashova's CodePen), Standard Ebooks (CC0 own work), Open Culture (no login). 7 GitHub repos rate-limited twice: **not checked**; the CodePen pen refused the fetch |
| Review | `REVIEW.md`: code targets the deleted Kitchen → graveyard; keepers = xerox/glitch idea (own code), Food Bank additions (needs OK), URL checker for deliveries; Three.js needs a dependency OK; Oulipo only on visitor words or public-domain text, never the poems |
| Canon | Q-15 added |

### Open / notes
- Recheck the 7 rate-limited repos one at a time before relying on them.
- Nothing added to the library, Food Bank or site.

## 2026-11-18 13:54 — Motion: drama with sound + built-in animations in the cutup sandbox

### What was asked
Brandon (via `/animatedwebs:design`): yes to the drama slider, and "different animations within the site's design embedded in subtle details, keeping the site alive and responsive, almost gamified but still reserved to the site's design". The AnimatedWebs connector isn't available (no `get_account` tool; not in the connector registry), so everything was built in-house from the site's own pieces.

### Done
| Action | Detail |
|--------|--------|
| Drama | `alive.js`: `A.drama` (0-3, default 1.5) + `A.setDrama`; beat layer in `step()` (bass lift, hit kick + spin, loudness swell; faster easing on hits). Slider in `/alive/lab/` and in the sandbox knobs. `docs/ALIVE.md` updated |
| Card assembly | torn blocks wipe in, pictures drop, strips slap down one by one (`cc-enter`, CSS only, `backwards` fill so alive takes over after) |
| Living card | alive engine attached to the card art (`room cut` classes): pictures react to touch, drag, keys, mic, song file; strips sway a hair (`cc-live`); "Hold still" and reduced motion stop it |
| Discovery | tap/Enter a strip: it lifts and says "yours" or "from <poem>" |
| Reserved game | "Poems you've cut from: N of 56" with 56 ticks; new ones flash (localStorage `pcp-cutup-found`, this browser only) |
| Small details | tiles deal in with a stagger, pick number stamps on, Cut it up pulses when ready, buttons press in |
| Sound row | Play it a song / Let it hear you / Hold still under the card (sandbox) |
| Tests | cutup.cjs: compares plan + strips (not raw HTML, alive moves things), strip tells its source, pictures movable, found count, reduced motion = no animations and a complete card. All 4 suites PASS. 320px: `html { overflow-x: clip }` because dealing tiles tip mid-flight |
| Artifact | CUTUP MAKER sandbox v2 (version 1795031655-8b31) |

### Open / notes
- Drama default 1.5 is a guess; Brandon tunes it.
- Found-poems count is a visitor-facing feature: sandbox only until Brandon OKs it (AGENTS law 3).
- ALIVE LAB artifact (407cb959…) not updated (at its 512-file cap); the drama slider is in the repo lab and the sandbox artifact.

## 2026-11-18 08:24 — Go-live Step 3 started: cutup maker sandbox v1

### What was asked
Brandon: "Alright let's move forward" (after the reset). Next in the plan: a playable cutup maker sandbox (Q-14).

### Done
| Action | Detail |
|--------|--------|
| Engine | `site/landing/lab/cutup/cutup.js`: `make(data, {picks, text, seed, knobs})` returns a JSON plan; `render(plan, el)` draws it. Poem strips are `line.slice(start, end)` over word spans (never retyped); visitor words chunked 1-3 words, kept in typed order, max 12 words; 1-2 poems per card; picked cutouts + 2-3 wildcards sharing an emotion; torn colour blocks from the picked families' colours + one accent; credits link `/poems/<id>/` |
| Page | `/lab/cutup/`: deal 12 images from 12 families (seeded), pick 3, add words, Cut it up / Cut again / Save (localStorage `pcp-cutups-sandbox`) / Copy link (state JSON in the hash). Sandbox knobs: picks 2-4, strips 3-8, your-words share, words per poem strip, ground dark/light, shape |
| Look decisions (mine, for Brandon to overrule) | Typewriter face = the visitor's words only (black strip, white text); poem strips serif or heavy sans on cream/yellow/pink/blue/white paper; dark ground; first pick is the big image |
| Data | `build.py` writes `/lab/cutup/data.js` (56 poems' text as stored, 509 cutouts, family colours) |
| Test | `site/tests/cutup.cjs` (in CI): Pixel 7, 320px, desktop; exact strips; words in order; credits; same link same card; cut again; save; 300 seeded cards exact + repeatable. PASS. site/alive/spin-cycle PASS. Build reproducible |
| Artifact | "CUTUP MAKER sandbox" slug ca8a8be7-7fdd-4b97-98f1-ecb1dc84c2c5 (167 cutouts: up to 6 per family; poem titles shown without links). Files staged in /home/claude/artifact-cutup (publish can't read /root/tasks) |

### Open / notes (for Q-14)
- With 6 words typed and "your words share" 0.4 of 5 strips, only the first 2 chunks of the visitor's words appear. Whether all their words should always appear is Brandon's call.
- Poem lines are chosen at random, not matched to the images' emotions.
- Black-on-dark tiles (e.g. Minimalism's black ellipse) are hard to see in the deal grid.
- No motion yet (Step 4 brings the alive engine + bigger motion with music).

## 2026-11-18 07:43 — The reset: Kitchen deleted, cutup card is the new outcome (D-31 to D-35)

### What was asked
Brandon, after opening the preview: drop the old generative Kitchen (kitchen, fridge, recipes, nutrition card; "too rigid and tacky"), go toward the torn-paper Cutup Database look (3 reference pictures), don't drop visitors straight into a poem, reset the design premise and delete the old versions so they stop getting mixed back in. His answers: words = his poem lines mixed with the visitor's words; front door = make one first; no logins, saves local; poems and essays on plain reading pages for now.

### Done
| Action | Detail |
|--------|--------|
| Writing moved out first | `content/poems.json` (56 poems, 2,650 lines), `content/essays.json` (2), `content/food-bank.json` (52 resources). Each poem line checked against the Kitchen source: 0 differences. JSON round-trip deep-equal |
| Other things moved out | `site/shared/prng.js` (cyrb128-sfc32 verbatim), `library/families.json` (30 ids, names, branches, colours from styles.js), `site/alive/` (alive engine + lab, lab takes `?seed=`), reference pictures in `docs/design/reference/` |
| Deleted | `site/live/`, `site/src/`, `site/dist/`, `site/visual/`, `assemble.py`, `build_board/kits/library/visual.py`, `live_check.js`, `tastefit.js`, `tastes.json`, `test*.js`, `links.txt`, `visual-flow.cjs`, `tools/cutouts/catalog.js`, old `/poems/` and `/essays/` shells + `landing/src/` |
| New build | `site/tools/build.py` alone: landing + shared + alive, generated `/poems/<id>/`, `/essays/<id>/`, `/food-bank/`, cutouts to `/assets/cutouts/`. Reproducible (built twice, identical) |
| Pages | `/` is a plain stand-in; About/Contact on `plain.css`; Learning's Kitchen links repointed; redirects `/kitchen/*` → `/poems/`, `/visual/*` → `/` |
| Fixes found by the new 320px check | Spin Cycle shelf/stage and Learning h1 overflowed at 320px (pre-existing); fixed with `minmax(0,1fr)` and `overflow-wrap` |
| Tests | New `site/tests/site.cjs`; `alive.cjs` now runs on `/alive/lab/`; CI + `netlify.toml` + `tools/codex/setup.sh` updated |
| Docs | CANON D-31 to D-35, Q-14, graveyard, closed Q-01/02/04/05/06/08/09; AGENTS.md, site/AGENTS.md, CLAUDE.md, README rewritten for the reset; DESIGN.md and DATABASE_SPEC marked history; GO_LIVE_PLAN re-ordered; pcp-verify skill rewritten |

### Result
`site.cjs` PASS (69 pages at 320px + desktop, 56 poems / 2,650 lines verbatim, 2 essays with all sources), `alive.cjs` PASS, `spin-cycle.cjs` PASS. Screenshots looked at: stand-in `/` at 390, a poem at 320, an essay at 1280, the poems list at 390. Plain, readable, no overflow.

### Open / notes
- Production still runs the old site until Brandon OKs a release (Step 5).
- `library/catalog.json` is now hand-edited (its generator read Kitchen files).
- `game.js` in the Spin Cycle uses `Math.random()` for the drum's word scatter (decoration only, pre-existing). Noticed, not touched.
- Ingredient pantry data and the Kitchen are in git history: parent of this commit, `site/src/pantry-plus.js`, `site/live/index.html`.

## 2026-11-18 02:10 — Go-live Step 1 done: work on GitHub, PR #14

### What was asked
Brandon: "How do I do step 1, getting the work onto GitHub?"

### Done
| Action | Detail |
|--------|--------|
| Push access | `add_repo` with push access was granted this time. The repo is cloned at `/home/claude/pressure-cooker-poetry`. This is now the working copy; `/home/claude/pcp` was the old push-less one |
| Branch | `release/step-1-front-door`: all 14 local commits, on top of `e3372f2` (main) |
| PR | #14, **draft, don't merge**: Step 2 goes on top, Step 3 is the release. `gh pr create` fails (no GraphQL); use `gh api repos/.../pulls` (REST) |
| Checks | GitHub `build` check passed. Netlify bot: deploy preview ready, https://deploy-preview-14--pressurecookerpoetry.netlify.app |

### Open / notes
- Netlify deploy previews are **private** (curl gets 401). Claude cannot click through them; Brandon opens it signed in to Netlify. Claude verified the same build locally (3 suites pass, reproducible build).

## 2026-11-18 01:55 — Go-live plan written

### What was asked
Brandon liked the batch. He wants the pieces to move more dramatically with music/audio, mentioned an esoteric easter egg ChatGPT worked on (for later), and asked to slow down and plan a step-by-step test, build and go-live process.

### Done
| Action | Detail |
|--------|--------|
| Plan | `docs/GO_LIVE_PLAN.md`: one loop (build → test → preview → Brandon's OK → live → check live → undo path) and 7 steps in order |
| Canon | Pointer to the plan above LIVE NOW; change-log line |
| Easter egg | Searched the repo and Claude's past chats: no description exists. Step 7 starts with Brandon sending it |

### Open / notes
- Step 1 (get the 13 local commits onto GitHub) needs Brandon. Step 2 (bigger motion) can start in the ALIVE LAB first, with a lab-only "drama" slider.

## 2026-11-18 01:40 — Cutouts batch 4: 19 Muse zips, +163

### What was asked
Brandon sent 19 more Muse zips (rounds 3-4 for ukiyo-e, art-nouveau, mexican-muralism, futurism, gothic-revival, expressionism, rococo, art-deco, punk, psychedelia, bauhaus, surrealism).

### Done
| Action | Detail |
|--------|--------|
| New tool | `tools/cutouts/unpack.py DEST ZIP...`: one folder per zip outside the repo, drops any PNG already received (sha256), prunes the sidecar, prints Muse's count note |
| Unpack | 169 PNGs, 0 repeats |
| Ingest | `ingest.py <folder> --source ai --cut none` per folder, 169 candidates |
| Review | 5 contact sheets (`--cols 6 --cell 200`), every piece looked at |
| Promote | 163 kept, 6 rejected (reasons in candidates.json): VW Beetle (brand trade dress), sombrero "mural painter" (cliche), rococo slipper and violin (don't read), cream plume (invisible), geta (reads as a bench) |
| Checks | build reproducible; visual-flow, alive, spin-cycle all PASS |

### Result
Manifest 346 -> 509. Five families at 30+. Under 8: constructivism 2, dada 3, swiss 6, afrofuturism 0.

### Open / notes
- Muse's notes claim totals Claude never received (e.g. art-deco "28 delivered", 2 here before this batch). Missing: Art Deco rounds 1-3; round 3 of Psychedelia, Bauhaus, Surrealism, Punk.
- Muse now aims for 30 per family. The canon floor stays 8; the under-8 families matter more.

## 2026-11-17 23:31 — Muse batches 2 and 3: 219 kept, 15 rejected → 346 cutouts

### Done
| Action | Detail |
|--------|--------|
| Received | 30 zips. 5 were byte-identical repeats of earlier zips (skipped). The other 25 held 234 new pieces, no piece-level repeats (checked by sha256 against every earlier delivery). |
| ingest.py | Reads Muse's preset sidecar (`{cutouts:[...], made_by}`) natively; per-piece source: Muse's "Source B" fragments get licence `cosmos` with the original artist kept in provenance notes. |
| contact_sheet.py | `--cols`, `--cell` for dense review. Seven sheets, every piece looked at. |
| Rejected (15) | 3 Ab-Ex clip-art (blob, palette, thermometer-drip); Murakami-like flower ring; cropped grey sphere; smiley (litigious trademark); 5 Swiss tourist pieces (flag, ticket, SBB clock, Matterhorn, cowbell): Muse read "swiss" as Switzerland; grey sticker square; faint Supra fragment; hairline Y2K rings; toy airplane render. Reasons in candidates.json. |
| Feedback | Written into MUSE_CUTOUT_MISSION.md and AI_CUTOUT_BRIEF.md (Swiss = Swiss Style, no artist copies, no litigious marks, no clip-art, no hairlines, woodblock texture for ukiyo-e). |
| Tested | visual-flow, alive, spin-cycle: all PASS. Build reproducible. |

### Corrections
The record-keeping script first crashed on two early Constructivism records with no provenance source, after the cutouts had already been committed; docs went in a second commit.

### Open / notes
Under 8: art-deco 2, constructivism 2, dada 3, swiss 6, afrofuturism 0. Q-10 (batches that never arrived), Q-13 (30-per-family target reported by Muse, unconfirmed). Shipped cutouts are now 28 MB of WebP; a room loads only its own few.

## 2026-11-17 19:50 — Brain Candy unparked: hub + Machine 01, The Spin Cycle (D-30)

### What was asked
"Build on the Brain Candy page … immersive, animated, almost gamified, but unique and educational."

### Done
| Action | Detail |
|--------|--------|
| Read prior design | `origin/design/brain-candy-mood-interview:docs/EXPERIENCE_OVERHAUL_BRAIN_CANDY.md` (five machines, Play → Reveal → Learn, Eye / Department Zero). Built on it; its Propaganda Machine + DoubleSpeak became The Spin Cycle (no live AI, so curated sentences instead of free text). |
| Verified facts | IPA founded 1937, seven devices in the Nov 1937 bulletin; Orwell's essay in Horizon, April 1946; Carlin's shell shock → battle fatigue → operational exhaustion → PTSD chain. Sources listed on the page. |
| The Spin Cycle | `site/landing/brain-candy/spin-cycle/` (index.html, data.js, game.js, assets/mister-vulture.webp). 8 techniques × 6 fictional clients = 48 hand-written spun sentences. Washer drawn in CSS, gauges, tumbling drum, suds, synthesized sounds (mute), X-ray reveal, timed catch-the-spin round (timer can be turned off), combo scoring, wrapper jar in localStorage, learn cards with sources. |
| Hub | `site/landing/brain-candy/`: four arcade cabinets with live mini-scenes, the jar, Department Zero File 001 (ROT13 → "NOTHING IS INEVITABLE"), locked until the jar is full. |
| Plan | docs/BRAIN_CANDY.md: six machines, the jar/cipher progression, build order, open questions. |
| Tested | site/tests/spin-cycle.cjs PASS on desktop, Pixel 7, reduced motion (full play-through incl. keyboard picks, jar, lock and cipher). Looked at screenshots: fixed buttons showing before the spin (`[hidden]` vs `display:flex`), stretched coin light, broken empty wrappers, a filled-black string path. |

### Open / notes
Not linked from the main nav yet (add when Brandon approves). Q-12 in the canon.

## 2026-11-17 17:43 — Alive layer (D-29); Muse's first five families (127 cutouts)

### What was asked
Ingest the new zips; "everything responsive through audio, touch or keystroke … feels alive to the user's inputs."

### Done
| Action | Detail |
|--------|--------|
| Muse zips | Minimalism 9, Memphis 8, Brutalism 9, Grunge 9, Situationism 10 delivered (Muse made them; its own sidecar format, mapped in a one-off script). Kept 43, rejected 2: a 1-px diagonal (invisible) and a fingerprint with a fake checkerboard painted in. The punk zip was byte-identical to the one already in. |
| Mistake caught | Ran clean_edges.py on Muse's pieces: it trimmed outer dots of confetti/splat pieces. Restored all 45 from the deliveries; clean_edges.py now warns it's only for pieces cropped from multi-piece sheets. |
| Engine | `site/visual/alive.js`: signals from pointer/touch, keys, scroll, opt-in mic, song file, tilt; ten verbs keyed to emotion tags; drag (mouse grabs under text, touch slides sideways), ransom letters, ink stamps on real taps only, keyboard moves, Hold still, reduced motion, one rAF loop that sleeps. Loose scraps: the room's chosen cutouts its layout didn't place, seeded from the receipt. Doc: docs/ALIVE.md. |
| Bugs fixed on the way | Audio context created after the permission wait starts suspended: now made inside the click. Letter colours could match their tile (#111 vs #111111): now by contrast. Family regex missed `y2k` (digit) in build_visual.py and ingest.py: fixed. Lab data regex grabbed branch ids: fixed. |
| Lab | `/visual/lab/alive/`: all cutouts, family chips, meters, behaviour labels, shuffle, song, mic, tilt. Published as a claude.ai artifact (mic and tilt don't work inside artifacts; the song button does). |
| Tested | site/tests/alive.cjs PASS (pointer, drag, letters, stamps, keyboard, fake mic, song file, hold still, replay identical, phone tap, reduced motion). visual-flow.cjs PASS. Build reproducible. |

### Open / notes
Rooms still place only 1–3 cutouts themselves (old layouts): D-18 is the real fix. Q-10, Q-11 in the canon. Still no push access in this session.

## 2026-11-17 14:31 — One rulebook; Punk from ChatGPT; split/ingest tools

### Done
| Action | Detail |
|--------|--------|
| Merged `agents/codex-playbook` | Kept its AGENTS.md, DESIGN.md, folder AGENTS.md files, .agents/skills, templates. Folded its docs/DECISIONS.md into docs/CANON.md (D-23–D-28, Q-08, Q-09) and deleted it. Every reference repointed to CANON. Stale bits fixed (collage, dials, intake pipeline). |
| Graveyarded `fix/collage-and-front-door-weight` | Its tiles are cut from the deleted AI atlas and its fonts serve the deleted collage page. Don't merge. |
| Punk | ChatGPT first sent one 8-piece sheet (split with split_sheet.py, ~350 px pieces), then a zip of the same 8 as separate 1200 px files with a sidecar. The zip versions are fresh, sharper renders, so they replaced the split ones (old records marked `replaced`). Its own separation left slivers of neighbouring pieces on 6 of 8: clean_edges.py removed them (fist needed --keep 0.3). Megaphone and NO MASTERS keep a flat crop edge from ChatGPT; reads as a scissor cut. All 8 kept with ChatGPT's own emotion tags. |
| Checked | ChatGPT said it would upload to the repo: nothing arrived (no branch, commit or PR). Its GitHub access is likely read-only. Deliveries come through Brandon. |

### Open / notes
84 cutouts. This session still has no push access; everything is local commits on `docs/canon`.

## 2026-11-17 11:03 — Real cutout database: 2 → 76 image files (D-20, D-21)

### What was asked
"Implement the actual cutouts into a database, not just text descriptions."

### Done
| Action | Detail |
|--------|--------|
| Why it stalled before | Every earlier attempt produced descriptions, leads or pipelines. The OpenRouter Actions pipeline ran once and then waited on a key. This workspace can reach The Met and Cleveland Museum APIs directly. Wikimedia search API rate-limits this connection (direct upload.wikimedia.org links work). Art Institute of Chicago returned nothing. |
| Tools | `tools/cutouts/harvest.py` (Met + Cleveland, CC0 only, subject mode via rembg isnet-general-use, ink mode for prints), `contact_sheet.py`, `promote.py` (tags, rejects, re-files, makes WebP), `web_copy.py`. |
| Harvested | 125 candidates. Every one looked at on contact sheets. Kept 74, rejected 51 (wrong family from loose name searches, ghosted cuts, duplicates). |
| Site | build_library.py ships the committed WebP copies (no Pillow needed in CI/Netlify; byte-stable). Picker rooms use library cutouts only, one from each picked family first. |
| Tested | visual-flow.cjs passes. Three rooms cooked on Pixel 7 emulation: real cutouts load, no errors. |

### Corrections
Tagged batches while a harvest was running; the harvester saved a stale copy over the decisions. Fixed: harvest now re-reads before each save. Re-applied all decisions; manifest was unaffected.
First tried encoding WebP inside the build: very slow, and CI/Netlify have no Pillow. Moved to promote time.

### Open / notes
Rooms show cutouts poorly (old poem-first layouts): that is D-18. 16 families have no cutouts (Q-07). "artist:" filter is a substring match: "Barbier" and "Heckel" matched other people on The Met, so check every sheet.

## 2026-11-17 10:15 — Canon created; fresh-start cleanup (D-17, D-18, D-19)

### Done
| Action | Detail |
|--------|--------|
| Canon | Added docs/CANON.md, AGENTS.md, CLAUDE.md. CANON is the single source of truth; briefs are history. |
| Deleted | AI atlas + provenance.json, landing/index.html (old collage), landing/assets (~235 cutouts), 7 landing/src JS files (cabinet, resonance, old engine copies). |
| Replaced | Picker cards now draw each family's palette as colour bands. `/collage/` redirects to `/`. |
| Tested | Rebuilt; site/tests/visual-flow.cjs passes (desktop, Pixel 7 emulation, 320px). Not deployed. |

### Open / notes
Dials are retired in the canon but still in adapter.js and site/src/tastes.js. Rewrite adapter to emotion wheel next. Remote branches not deleted (no push access in this session).

## 2026-11-17 09:34 — Agent playbook: AGENTS.md, DESIGN.md, decisions, Codex skills

### What was asked
Brandon: read the repo and set up the design and agents markdown, plus whatever else would make the models working on this site (ChatGPT/Codex especially) work better.

### Done
| Action | Detail |
|--------|--------|
| AGENTS.md (root) | source-of-truth order (owner > DECISIONS > issue #10 > specs > history), 8 laws, repo map, commands, workflow, definition of done, the real failure modes from the two intake audits, voice rules, skill triggers. About 10 KB, under Codex's 32 KiB instruction budget together with a nested file |
| site/AGENTS.md, library/AGENTS.md | folder rules: build.py's exact-match patches, the four engine files duplicated in site/src and site/landing/src (identical today, nothing syncs them), committed dist, build_visual's header extraction and content-hash receipts; asset verification, rights statuses, tagging, kit-part limits |
| DESIGN.md | shell tokens taken from the Kitchen's existing --k-* / --f-* variables (contrast measured), shell vs room, the generative system, collage/motion/component rules, the Don't list, and the front door's off-token drift flagged for Brandon |
| docs/DECISIONS.md | Brandon's standing decisions with superseded items marked (Mood Interview, cabinet as front door) and open ones (Heat/Order/Noise/Weight, Pop Art/Maximalism dominance) |
| .agents/skills/ | pcp-verify, pcp-design-pass, pcp-asset-intake (Codex loads .agents/skills automatically) |
| Other | CLAUDE.md imports AGENTS.md; tools/codex/setup.sh for the Codex environment setup script; PR template; agent-task issue template; README design law and route list brought up to date (front door at /, collage at /collage/) |
| Checked | build.py + assemble.py run clean on this branch, site/dist unchanged; setup.sh passes bash -n; README route claims checked against site/visual/app.js route() |

### Open / notes
- Brandon: paste `bash tools/codex/setup.sh` into the Codex environment's setup script.
- Brandon to decide: bring site/visual/visual.css (Arial/Georgia, cream #f3eadb on #17151a, lime accent) onto the Kitchen tokens, or keep it.
- Browser suite not run here (docs-only change; CI runs it on the PR).

## 2026-11-05 22:11 — Sent Brandon the preset's system prompt on its own

### What was asked
"So i just paste that in system prompt of the preset on open router?"

### Done
| Action | Detail |
|--------|--------|
| Extract | lines 31-168 of tools/cutouts/prompts/openrouter-preset.md (inside the ````text fence) -> pcp-database-system-prompt.txt in this folder, 138 lines; sent as a file |

### Result
Told him: paste only that text into the System prompt box, replacing the old one; the rest of openrouter-preset.md is setup notes for him, not prompt.

## 2026-11-05 17:57 — Movements 29-30 live: Rococo and Mexican Muralism & Rasquache (deploy 6aed17b74e29ff90a1c4a2bc)

### What was asked
Brandon said yes (by voice) to adding Rococo and Mexican Muralism as movements 29 and 30, then: "We can come back to that later right now just make it live and we can troubleshoot from there". The mood talk is deferred; publish was explicitly asked for.

### Done
| Action | Detail |
|--------|--------|
| Movements | site/src/styles.js: `rococo` in excess (cutup, float, no texture, emo ecstasy/distraction/contempt, colours #fce4ec #d4af37 #1a1a1a #fff59d from Brandon's profile) and `mexican-muralism` in revolt (manifesto, drop, concrete, emo admiration/anger/optimism, #c25927 #1b4965 #e8a838 #2c221e), each with blurb + SVG motif. Button skins in extra.css. GRAMMAR rows in tools/kits/generate.py (muralism words TIERRA, PAN, TRABAJO, 1910) |
| Kits | catalog.js -> 30 movements; generate.py -> rococo 16, mexican-muralism 19 parts; build: 523 parts, 131 KB css |
| Library | family folders with README (incl. where the PD material is) + SHOPPING; shopping-list.json +16 (240 wanted) |
| Docs | DATABASE_SPEC (30 movements table), openrouter-preset.md (30 movements, PD routes for both: Met/Rijksmuseum CC0 ornament engravings; Posada d.1913 broadsides and anonymous retablos/ex-votos; murals and TGP (founded 1937) are under copyright) |
| Checked | random 20000 pots: all 30 movements appear as primary, rococo 385, muralism 607. Forced rooms render, no page errors (shots/99-new-*.png). test/test2/test3/test4 pass (howStyles 30; the known placeholder 404). Live md5 91d1deef... = dist; live_check desktop + Pixel 7: 481 tiles, no errors |

### Corrections
On the voice call I said early Taller de Gráfica Popular work is public domain. Wrong: TGP was founded 1937. Told Brandon in text and kept it out of the preset.

### Open / notes
- Rococo room's ground reads dark (cutup layout), not the pastel pink of the profile: first thing to tune.
- Moods, stats (heat/order/noise/weight) and the emo picks are my first pass from his profiles; revisit with Brandon.
- Brandon still needs to paste the updated openrouter-preset.md into his OpenRouter preset.

## 2026-11-05 17:58 — Published deploy 6aed160c861c99567614c4de; Brandon's src/data records audited (0 of 18 usable)

### What was asked
"Lets take the assets we have gathered in the GitHub repo and put them into the sites design live." An explicit publish request.

### Done
| Action | Detail |
|--------|--------|
| Audit | Brandon's 4 new files in src/data (assets.yaml, Assets-1, family profiles 9, asset records batch 2). Every file URL was checked by HTTP request and the Commons API. **0 of 18 records usable**: Commons files don't exist, Met/archive.org/Cooper Hewitt URLs 404, CodePen "anon/pen/<name>.css" addresses invented, the Spartan and Mendoza font files 404, IM Fell is OFL not "mit". The 2 LOC files exist but are 1940s news photos (a woman in an armchair, two men at a DOJ door), not the woodcuts claimed. Written up in docs/intake/2026-11-05-src-data/AUDIT.md. assets.yaml is cut off at line 237 (inside Brutalism) |
| Build + tests | build.py: 488 kit parts, 2 cutouts, dist md5 5134eccb... test/test2/test3/test4 pass (they need `python3 -m http.server 8765` in site/dist first; test.js's one 404 is the known placeholder cutout) |
| Deploy | deploy 6aed160c861c99567614c4de, production. Live md5 = dist md5; both cutout PNGs 200; delivered parts (red-wedge, beam-frame, laminate-button, triangle-disc) in the live page. site/tools/live_check.js on desktop and Pixel 7: 481 tiles, no page errors (shots/98-live-*.png) |

### Result
Live now carries everything verified in the repo: 488 kit parts (including the 8 Muse/Memphis delivered snippets) and the 2 constructivism cutouts. Nothing from src/data went live.

### Open / notes
- Still to decide with Brandon: add Rococo and Mexican Muralism & Rasquache as movements (both have good pre-1931 sources), and whether heat/order/noise/weight maps onto the hidden dials. The family profiles' text is good brief material for the scout and kit generator.
- No movement has 6 library cutouts yet, so no room is database-only. Blocked on the OpenRouter key (provisioning key, needs a regular one) for crops.

## 2026-11-05 11:06 — Memphis delivery filed (0 cutouts, 4 snippets); preset taught the public-domain date line; publish blocked pending OK

### What was asked
Brandon pasted a pcp-database preset delivery for Memphis: no cutouts (a CC BY 3.0 photo and an off-host CC0 background were honestly dropped), 4 CSS snippets.

### Done
| Action | Detail |
|--------|--------|
| Intake (run locally, here) | saved as library/intake/pcp-delivery-memphis-2026-11-05.json, then `run.py --mode intake`: 4 Memphis parts filed (laminate-button, confetti-frame, playful-tilt, triangle-disc). The same run also re-read the constructivism delivery still in intake/ and filed **Muse's 4 constructivism snippets** (red-wedge, beam-frame, diagonal-thrust, beam-and-disc); its cutouts failed here (no rembg in this sandbox). Moved the constructivism delivery back into intake/ for the crop re-run |
| Fixes | intake skips a snippet already filed from the same delivery (re-runs would otherwise add "-x" copies); build_kits BASE_CSS pins .kit-orn to position:absolute and display:block with !important (triangle-disc set position:relative). Kits: 488 parts |
| Checked | tmp/delivered_check.js forced each delivered part onto a real room: all render in place (shots/97-delivered.png); test3 passes. Commit 7a2505c |
| Publish | **refused by the auto-mode classifier ([Production Deploy])**, because Brandon didn't ask to publish this time. Not deployed. Live is still deploy 6aec9eda53a8f7258ab0b2dd (md5 bbc1cc...). dist now 5134eccb... |
| Preset | openrouter-preset.md: new section "When the movement is too recent for the public domain" (US public domain = published before 1931; routes: US federal works (NASA, LOC HABS/HAER, WPA/FSA/OWI), pre-1931 ancestors with the same grammar, creator CC0 dedications; otherwise deliver snippets only). NASA's images-assets.nasa.gov added to the host allowlist in run.py and the preset |

### Open / notes
- Ask Brandon before every production publish.
- Brandon must update his OpenRouter preset's system prompt with the new section (paste the file again).
- PD-friendly movements, by date: Art Nouveau, Art Deco (pre-1931), Gothic Revival, Ukiyo-e, Constructivism, Dada, Futurism, Expressionism, Bauhaus, early Surrealism; partly Geometric Abstraction and Maximalism (Victorian ornament).

## 2026-11-05 10:48 — Runs 3-4: the key is a provisioning (management) key; PR setting still off

### What was asked
Brandon asked me twice to do the key and the PR setting for him, then said "Done".

### Done
| Action | Detail |
|--------|--------|
| Browser attempts | Claude in Chrome: github.com/.../settings/actions opened (the title loaded), but find/read_page/screenshot all timed out waiting for document_idle or script injection, over 7 tries across 2 tabs. Stopped and closed the tabs. Likely a pending extension site permission for github.com, or GitHub's sudo "Confirm access" screen. Told Brandon that entering an API key into a field is something I won't do even when asked; the checkbox I can do once the page works |
| Run 3 (42067493883) | still 401 on crops; PR still refused |
| Key check step | added to .github/workflows/cutouts.yml before "Run the pipeline": prints length, prefix (sk-or-v1-), whitespace/quote warnings, and GET https://openrouter.ai/api/v1/key status + fields. Never the key |
| Run 4 (42067955690) | KEY CHECK: length 73, prefix ok, HTTP 200, **is_provisioning_key: True**, usage 0. **A provisioning key can manage keys but can't run models, hence the 401 on chat completions.** PR: still "GitHub Actions is not permitted to create or approve pull requests" |

### Open / notes
- Brandon: on openrouter.ai create a regular **API key** (Settings -> Keys), not a provisioning or management key, and put it in the OPENROUTER_API_KEY repo secret. The PR checkbox is at github.com/imagetoform/pressure-cooker-poetry/settings/actions (repo level), bottom box "Workflow permissions": tick it, then Save in that box.
- I can open pull requests myself through the REST API (`gh api repos/.../pulls -X POST`) if the setting stays off.
- Branches cutouts/run-1..4 are all uncropped attempts; delete them after a good run.

## 2026-11-05 09:38 — Run 2: the secret exists but OpenRouter says 401; PR permission still off

### What was asked
Brandon: "All right, I think I did it" (added the secret and the PR setting).

### Done
| Action | Detail |
|--------|--------|
| Re-run | appended a corrections line to library/intake/pcp-delivery-constructivism-2026-11-04.json and pushed 05af251 -> run 42056579631 (run 2), success, about 2 min |
| Result | proun-99 and gan-cover were dropped as duplicates (already kept on main), as expected. Red wedge, ROSTA and VKhUTEMAS: "crop failed: 401 Client Error: Unauthorized" from openrouter.ai, so the secret is set but its value is rejected (wrong or partial key, extra spaces or quotes, or a deleted key). All three were cut out whole again and flagged "uncropped". Branch cutouts/run-2 |
| PR | still "GitHub Actions is not permitted to create or approve pull requests": the setting isn't saved or isn't ticked |

### Open / notes
- Brandon: re-paste the key (only the `sk-or-v1-...` string, no quotes or spaces) in Settings -> Secrets and variables -> Actions -> OPENROUTER_API_KEY -> Update. Under Settings -> Actions -> General -> Workflow permissions, tick "Allow GitHub Actions to create and approve pull requests" and press **Save** in that box.
- Then re-run again by touching the delivery in library/intake on main. Don't merge cutouts/run-1 or run-2; delete both once a good run lands.

## 2026-11-05 09:23 — Published to production (kits, 481 ingredients, 28 movements, 2 library cutouts) + OpenRouter preset

### What was asked
"Lets update the live site, and use the database of graphics we have so far or do we have any yet, in fact write me a preset i can put into openrouter to create said database properly".

### Done
| Action | Detail |
|--------|--------|
| Library | kept constructivism-proun-99 and constructivism-gan-cover from cutouts/run-1 (the uncropped whole image came out clean). Resized to 900 px and 128-colour quantised (617->57 KB, 916->93 KB), status "kept", added to library/cutouts/manifest.json on main. Red wedge, ROSTA and VKhUTEMAS were left out (they need crops or failed). Commit 1e5c653 |
| Pre-publish checks | test.js-test4.js pass (only the old kit4 404s); sim 2000 pots: deterministic, no repeated cutouts, both library cutouts get picked (~20% of rooms each) |
| Deploy | publish/ = dist/index.html + assets/cutouts/ (2 PNGs) + netlify.toml; previous page saved as tmp/live-2026-11-02.html. Netlify deploy-site tool -> local deploy-tool/node_modules/.bin/netlify-mcp in publish/ (proxy URL [secret removed; the deploy-site tool issues a fresh one each time]). **Deploy 6aec9eda53a8f7258ab0b2dd ready.** Rollback target: previous deploy 6ae8f67b4c83d484435703db |
| Verify live | live md5 bbc1cc246236ff120680f96eaf565398 == dist; /assets/cutouts/constructivism-proun-99.png 200; Playwright desktop: 481 tiles, 28 kits, 28 styles, 2 library assets, lab controls hidden, cooking through the UI gives a kit room (pop-art slab button, texture, ornament); phone: room renders, no overflow, no JS errors |
| Preset | tools/cutouts/prompts/openrouter-preset.md: OpenRouter preset `pcp-database` for chat (settings table + system prompt): one movement per message; scout PD/CC0 on allowlisted hosts with the licence read on the page; keep + crop; tag by looking, with `looked` true/false; 4 kit snippets; self-critic; one JSON delivery for library/intake. Built from superbot.md's wheel/movements/rules. run.py intake now records `looked` and flags `tags-unseen` |

### Result
Live: the dartboard and style tree build (Nov 4), 481 re-tasted ingredients, 28 movements, the 480-part kits, and 2 library cutouts. No movement is database-only yet (needs 6).

### Open / notes
- Brandon: make the `pcp-database` preset, run it per movement, upload deliveries to library/intake (GitHub web upload works from a phone). Add the OPENROUTER_API_KEY secret so crops work; tick "Allow GitHub Actions to create and approve pull requests".
- After a merge, the next publish must ship dist/ with assets/cutouts/.
- Coupons from before today rebuild differently (the engine changed with the dartboard build, and the pantry and pool grew).

## 2026-11-05 09:09 — Kits (480 parts) + database-only rooms

### What was asked
`/animatedwebs:style`: "create the proper elements for PCP and add more to the aesthetic families so that we get a robust collage database to pull randomly from each one according to recipes". The AnimatedWebs connector is NOT connected: its search/get_style_reference tools are missing, and SearchMcpRegistry didn't find it. Told Brandon, and argued that one brand system works against 28 families anyway; built the kits in-house instead. Mid-turn: "i want these default layouts and backgrounds etc... to be replaced with the database that we have gathered and only to use those graphics". AskUserQuestion answers: **switch per movement as it fills (6+ cutouts)**; **keep the layouts' text arrangement, drop their art**.

### Done
| Action | Detail |
|--------|--------|
| tools/kits/generate.py | 16 button, 16 texture, 16 ornament (incl. per-movement words), 11 motion templates; GRAMMAR picks 4/4/5/3 per movement -> 480 parts, CC0; every part passes run.py check_snippet. Button text: halo under 4.5:1; transparent variants got an #111 background with coloured text only where it reads (the sidebar is dark). Contact sheet shots/83-buttons.png (taken after the .3 s transition; the first sheet was mid-transition and looked washed out) |
| site/tools/build_kits.py | bundles kit CSS (119 KB) + PCP.kits; rewrites delivered snippets (.tex-/.orn-/.anim-<m>-N, plain scope) onto the hooks; base CSS gives .kit-tex the same edge mask as .sty-tex and turns motion off for .no-motion and reduced motion |
| styles.js decorate | primary movement: mkRng("kit|"+sid) picks body data-k-button/texture/motion + 1-2 .kit-orn at the edges; data-k-* cleared at the start of every decorate. Test (tmp/kits_test.js): 8 movements, the same recipe gives the same picks, valve variant differs, reduced motion stops animations, Pixel 7 no overflow, no errors. shots/82-kit-grid.png |
| run.py fix | BAD_CSS url() pattern rejected quoted data: URLs (backtracking); now `url\(\s*(?!['\"]?data:)` |
| site/tools/build_library.py | library/cutouts/manifest.json (non-rejected, file exists) -> dist/assets/cutouts/ + PCP.assets (library: true); genome.dbOnly when the primary movement has >= DB_MIN (6) library cutouts -> pool = library only; cutout() draws no stand-ins; .room.db-only hides m-band, m-disc, c-cut:not(.cut), x-grain/mark/staple/tape/loop, l-stamp, w-ember/hair, r-glass/halo, fallbacks, ledger rules. Each family's decorate() still runs (it places the cutouts and ingredient slogans and sets ctx.theta) |
| Test | copy at tmp/dbonly with 6 constructivism cutouts (run-1 minus vkhutemas, plus 2 duplicates): db-only manifesto room shows 3 real cutouts, 0 stand-ins, 0 layout art, kit texture and ornament present (shots/90-db-manifesto.png); a brutalism room unchanged |
| Main | 0 library cutouts on main, so no room is db-only yet. Commits f0ab81c (kits), 2e97919 (db-only). dist md5 changes with each build; the task dist/ copy was updated |

### Open / notes
- **Deploy now needs the whole dist/ folder** (index.html + assets/cutouts/), not just index.html. README updated.
- Coupons: once library cutouts land on main, existing rooms' cutout picks change (the pool grows), and full movements switch look. Expected.
- Still not live in production; Brandon hasn't said publish. Still pending: OPENROUTER_API_KEY secret + allow Actions PRs, then re-run the constructivism intake with crops (don't merge cutouts/run-1).

## 2026-11-05 08:54 — Animation prompt, contract and harness

### What was asked
After Brandon proposed a cartoon GIF (gloved hands dropping ingredients into a pot) for the pressurize moment: "create a prompt for some proper animations we can create". The GIF's origin and rights are still unknown; it was not used.

### Done
| Action | Detail |
|--------|--------|
| tools/animations/prompt.md | prompt for a coding model; moments pressurize (2.2-3.5 s), valve, drop, reveal; concept menu (hands-into-pot with original generic gloves, ransom-note, red-wedge, xerox-jam, reliquary); data contract (ingredients text/cat/tastes, psi, pressure, movement colours, seeded rng, reducedMotion, narrow); taste -> motion map; rules: no network, transform/opacity/clip-path only, ~60 elements, skip on tap/Esc/Enter, reduced motion = one still frame in under 600 ms, aria-live text, no flashing, CC0 original art; deliverables: one .js + demo.html |
| pressurize-gauge.js | the current overlay rebuilt to the contract (1.5 s, so the harness flags it as shorter than the new range; that's the old screen's length) |
| harness.html | file-openable; loads a candidate .js through a file picker (warns on fetch/http/Math.random); pots A/B/C/empty; movement picker; reduced motion and phone frame toggles; skip; logs length vs range and leftover elements. Tested with Playwright: no errors, cleans up, reduced motion 544 ms, skip marked |
| Commit | on main (see git log) |

### Open / notes
- Not wired into the site: cook() in the app would need to call PCP.animations[...] in place of the #pressurize overlay. Do that once a candidate passes the harness and Brandon likes it.
- The headless test used fallback fonts (no Impact); real devices have the site's embedded display font.

## 2026-11-04 23:38 — First live run: Muse constructivism delivery through intake (run 1)

### What was asked
Brandon uploaded `pcp-delivery-constructivism-2026-11-04.json`. He made it with Muse Spark 1.3 using superbot.md; Superbot itself didn't work on his phone or network. Muse played all six roles.

### Done
| Action | Detail |
|--------|--------|
| Checked the delivery | 5 cutouts, all on Commons and PD; 4 snippets, all passing check_snippet; 12 honest drops (Klutsis because of ARS, a Rodchenko deletion nomination, a Pelikan logo, unverifiable licences). Two page_urls pointed at wikiquote/wikidata mirrors and were repointed to Commons (noted in its "corrections" field) |
| New: crop step | crop_raw(): use the delivery's crop box, else ask the model with prompts/crop.md and the keep note (needs the key), else the whole image flagged "uncropped". Added to the main flow and to intake; superbot.md now asks for a crop box. Stub-tested all three paths |
| UA | now names the repo URL (Wikimedia bot policy) |
| Pushed 0293cd9 | the delivery is in library/intake/ on main; the push trigger fired: run 41975006101, all steps green, 2.5 min. Wikimedia downloads and rembg's model download work on the runner. Artifact 13391321456 |
| Result branch | cutouts/run-1 (06d33c0): 5 PNGs + manifest + 4 kit CSS files. **No PR**: "GitHub Actions is not permitted to create or approve pull requests" (the repo setting isn't ticked). No OPENROUTER_API_KEY secret yet, so no model crops |
| Looked at the cutouts | contact sheet shots/60-run1-sheet.png. Proun 99: clean, good. Gan cover: whole cover cut well (lettering + bar), good as is. Red wedge: the wedge is clean, but ghosts of the white circle and text remain; needs a crop. ROSTA: the whole 4-panel poster came through; needs a crop to one worker. VKhUTEMAS: failed; the grey photo hand was removed and only the text survived; crop alone may not fix it |

### Open / notes
- Brandon: add the OPENROUTER_API_KEY secret, and tick Settings -> Actions -> General -> "Allow GitHub Actions to create and approve pull requests".
- Then re-run the intake: the delivery is still in library/intake/ on main, because run-1 was never merged. Push any change there, or run the workflow with mode intake. Don't merge cutouts/run-1.
- gh from this session: actions/runs, jobs and logs are readable; secrets and permissions are blocked (403); gh pr list (GraphQL) is blocked, use REST `gh api repos/.../pulls`.
- The kit snippets are filed but the site doesn't load kits yet.

## 2026-11-04 22:00 — Superbot multi-model prompt + intake mode

### What was asked
"A prompt for an agentic multi-model workflow (superbot)". Searched: "Superbot" is most likely the multi-model hub app (one interface over several AI services, relays into agent harnesses; aiagentslist.com/agents/superbot). There is also a Python SuperBot framework. So the prompt is written to work in any multi-agent harness.

### Done
| Action | Detail |
|--------|--------|
| tools/cutouts/prompts/superbot.md | orchestrator instructions for 6 roles on different model families (orchestrator, scout with web search, picture editor and tagger as two different vision models, kit coder, critic). Embeds the wheel, all 28 movements and their emotions, the tag rubric (ski-mask context, never tag from identity, satire aims up), the snippet rules, and the delivery JSON format pcp-delivery-<movement>-<date>.json |
| run.py --mode intake | library/intake/*.json -> re-checks wheel words (aliases), movement, PD/CC0 licence wording, image host allowlist, https source page, snippet safety -> cut -> file as status new with made_by provenance -> moves the delivery to intake/done/. Stub test: 1 good cutout filed (defiance->aggressiveness), a bad host and a CC BY-SA item dropped, 1 snippet filed |
| Workflow | push trigger on library/intake/*.json on main (defaults to intake mode); the bot commits to cutouts/run-N branches, so no loop |
| Commit | 6720e61 on main, pushed |

### Open / notes
- Still never run live. It needs the OPENROUTER_API_KEY secret, and intake doesn't even need the key: no model calls, only download and cut.
- Intake cutouts get a line in the run report, not table rows with thumbnails.

## 2026-11-04 21:34 — Cutout pipeline built (scout / find / pick / cut / tag / snippets) and pushed

### What was asked
Brandon: a prompt or workflow for OpenRouter (or Gemini or Muse) that finds the shopping-list images, cuts them out, files them into their aesthetic families and tags mood by looking at the visual context (a ski mask tagged violent or aggressive, depending on the scene). Mid-turn he added: he'd make an OpenRouter preset as the scout, image cutter and code-snippet agent; sheer volume is the point, for random but unified collage rooms.

### Done
| Action | Detail |
|--------|--------|
| Design | The model (preset) is the brain: scout, pick, tag, snippets. GitHub Actions is the hands: search the collections, download, rembg cutout, validate, file, PR + zip. A preset can't download or cut images itself; told Brandon |
| tools/cutouts/run.py | modes cutouts / scout / snippets / all. Find = Commons API + AIC API + Openverse (cc0,pdm), licence filter from the collections' own metadata, so the model never supplies URLs. Downloads only from a host allowlist, 30 MB cap, re-checked after redirects. Cut = rembg `isnet-general-use` (rembg 2.0.86; the name is in sessions/dis_general_use.py), alpha trim, max 1200 px, fails under 2% coverage. Tag = vision model on a checkerboard composite; aliases resolved, words outside the 33 dropped, one retry. Snippets validated: no @import, no external url(), no scripts, every selector scoped to body[data-sty=id], licence CC0/MIT/Apache/BSD, source URL required when borrowed. Manifest records carry full provenance and status "new" |
| prompts/ | pick.md, tag.md (ski-mask context examples; never tag from identity; satire aims up), scout.md (aims at wheel gaps per movement), snippets.md, preset-system.md (system prompt for @preset/pcp-scout; also sent as the system message when no preset is used) |
| catalog.js | node vm loads site/src/board.js + styles.js -> library/catalog.json (33 words, aliases, petals, dyads, 28 movements) |
| .github/workflows/cutouts.yml | workflow_dispatch inputs mode/movement/limit/model, passed via env (no ${ } in shell); actions pinned by SHA (checkout v7.0.1 3d3c42e, setup-python v7.1.0 6d4fd22, upload-artifact v7.0.2 cf430e0); concurrency group; commits to branch cutouts/run-N, gh pr create, zip artifact |
| OpenRouter facts checked | presets are called as model "@preset/slug" and can store tools incl. openrouter:web_search (openrouter.ai/docs/guides/features/presets). Vision models exist: google/gemini-3.8-flash (default), meta/muse-spark-1.3 (from the public /api/v1/models list) |
| Tests | offline stub test (/root/tasks/pcp-site-update/tmp/stub_test.py, run in a copy at tmp/cutout-test): all modes end to end; alias fury->rage; bad words and categories dropped; 3 unsafe snippets rejected; scout added an item. Request-shape test: system+user messages, image_url parts, web_search tool only for scout/snippets, no system message with a preset |
| Docs | docs/CUTOUT_PIPELINE.md (setup: OPENROUTER_API_KEY repo secret, allow Actions to create PRs, preset recipe; run; review; not done yet); library/cutouts/README.md pointer |
| Commit | c4637bd on main, pushed (the workflow file push was accepted) |

### Result
The pipeline is in the repo, but it has never run against the real internet or a real model: this sandbox can't reach Commons, AIC, Openverse or rembg's model download (403/429/500 through the proxy). The first real run happens in Actions once Brandon adds the secret.

### Open / notes
- Brandon: add the OPENROUTER_API_KEY secret, tick "allow Actions to create PRs", optionally create preset pcp-scout, then run Actions -> Cutouts (start small: movement punk, limit 4).
- On the first real run, watch for: Commons extmetadata licence strings, AIC IIIF size 1686 (may need 843), Openverse anonymous rate limits, and how fast rembg's model downloads on the runner.
- Not wired into the site yet: the build doesn't read library/cutouts/manifest.json or ship assets/cutouts/; kit snippets need a seeded per-room variant picker.
- Still open from 18:50: publish yes/no; Pop Art/Maximalism and layout-override tuning.

## 2026-11-04 18:58 — OpenRouter intake started (paused), `next` shortened

### What was asked
Brandon wants a prompt/markdown for OpenRouter that finds images, cuts them out, and gathers animation/CSS snippets to add to the database, with the results landing in the GitHub repo or as a download. He interrupted the build with "Pcp-site-update-next" after Baton flagged the `next` field as too long.

### Done
| Action | Detail |
|--------|--------|
| Plan told to Brandon | 1) `docs/OPENROUTER_PROMPT.md` to paste into OpenRouter (web search on); it returns one JSON delivery. 2) A loading dock: JSON goes in `library/intake/`, and a GitHub Action downloads, cuts out the background (rembg), validates against the spec, files each piece as needs-review, and uploads a zip. Licence rule: PD/CC0 images; MIT/CC0/Apache code; source recorded |
| Checked | OpenRouter: `:online` is deprecated; use the `openrouter:web_search` server tool (openrouter.ai/docs/guides/routing/model-variants/online.md) |
| Action pins (git ls-remote) | actions/checkout v7.0.1 = 3d3c42e5aac5ba805825da76410c181273ba90b1; actions/setup-python v7.1.0 = 6d4fd22b20465ccc0f7354476588e8df7c9ca0e0; actions/upload-artifact v7.0.2 = cf430e030ddbb5b0abf93d22962f4752f3646cd9. Lightweight tags; checkout v7.0.1 also lists 043fb46d…, so check which one is the commit before pinning |

### Result
No files written for the intake yet. `next` was cut back to a pointer.

### Open / notes
- The sandbox can't download from archive.org or loc.gov (only GitHub and package registries are allowed), so the fetch-and-cutout step has to run in GitHub Actions or on Brandon's PC. `gh api` is refused for other repos in this session (403); `git ls-remote` works.
- Still waiting on Brandon from the last entry: publish or not; the Pop Art/Maximalism and layout-override tuning call; where the real cutouts are.

## 2026-11-04 18:50 — ChatGPT database v1 audited, re-tasted and merged

### What was asked
Brandon attached ChatGPT's HANDOFF_FOR_CLAUDE.md and COVERAGE_REPORT.md (validate and merge the expansion per DATABASE_SPEC). The data files weren't attached; his computer was linked, so I asked for ~/Downloads and ~/pressurecookerpoetry (granted) and found `PCP_Database_Expansion_v1.zip` in Downloads.

### Done
| Action | Detail |
|--------|--------|
| Unpacked | /root/tasks/pcp-site-update/intake/db-expansion-v1/ (originals also in repo docs/intake/2026-11-04-chatgpt-database-v1/original/) |
| Structural check (check.py vs current.json dumped from the built page) | no id clashes with the 181, all cats/codes/totals legal, all emo words in the 33; only bug: 8 cutouts used family `swiss-international` (site id `swiss`) |
| Found | ChatGPT's build.py assigned tastes by row number and cutout tags by rotation. Its 300 darts: 208 intense, no anger or disgust wedge at all |
| Re-tasted all 300 by hand | check/retaste.txt, then sharpen.py made 52 opposed pairs clearer. One dart per ingredient: 79 intense / 133 core / 88 mild, all 8 wedges |
| Merged ingredients | appended to site/src/pantry-plus.js under a "batch 2" comment -> 481 total |
| Merged 10 movements | MORE block in site/src/styles.js (surrealism, expressionism, memphis, zine-diy, situationism, grunge-design, afrofuturism, y2k, gothic-revival, ukiyo-e) with my own motif SVGs; button skins in extra.css (fixed 2 low-contrast ones); blurbs corrected (Breton+Trotsky 1938 manifesto, Dery 1993, degenerate art 1937, Debord 1967, Ray Gun) |
| Cutouts | library/cutouts/shopping-list.json + SHOPPING.md in every movement folder; 10 new movement folders with README + cutouts/.gitkeep; not loaded by the renderer |
| Sim | check/sim.js: 6000 seeded pots through PCP.engine.genome, pre-merge build (served from check/before on :8766) vs merged (:8765). Deterministic 0 diffs; no repeated cutout in a room; bull about 14% of pots |
| Browser | check/test5.js: poems byte-identical (56), visitor hidden controls, one pot rendered per new movement, reduced motion, Pixel 7 no overflow; site/tools/test.js-test4.js all pass (only the old kit4 404) |
| Docs | docs/intake/.../AUDIT.md; DATABASE_SPEC 28-movement table + "tasted for what it means" checklist line; README count; families index regenerated |
| Commit | 3e5cc19 on main; dist md5 8c489923553a557cf3d9d43b27edfd1f (task dist/ updated to match) |

### Result
The merged build is in the repo, not deployed. Production is still the Nov 2 build (md5 30354a8e…).

### Corrections
ChatGPT's handoff said "do not change hidden dartboard behavior": I didn't. The tastes were replaced, not kept, because they had nothing to do with the words. The handoff's step 5 (a full visual kit per movement: fonts, CSS kit) was done only partly: motifs, button skins, layout, motion and texture, using existing fonts. No new fonts.

### Open / notes
- FOR BRANDON TO DECIDE (hidden tuning, not changed): Pop Art 16% + Maximalism 12.5% of rooms (joy tag sits where most darts land; overwhelm wins every bull). A movement picks the layout in 86% of rooms (only 4 of 28 have layout null), so the dials pick the grammar in about 1 room in 7; cutup 40%. Possible fixes: more movements with layout null, or weaken the style->layout override, or a softer argmax for the primary style.
- URL-loaded rooms (`#/kitchen?...&g=` with no poem) show poems[0] "First Mark"; cooking through the UI picks by flavor. This was already true before today.
- The ingredient words are ChatGPT's; many institutions use one formula. Brandon should skim.
- Check scripts in the repo copy point at ../original/; in the task folder they point at ../pcp-database-expansion/.
- Brandon's computer (Windows, device dini-ding-dong) has more PCP material: ~/pressurecookerpoetry/pressure_cooker_poetry_publishable (a separate Vite-style build with 12 "aesthetic registry" families + SVG motifs), Downloads/pcp-kitchen-rebuild(.zip), pressure-cooker-batch(-v2).zip (168/247 MB), "Web page elements" zip (32 MB), PCP-ATELIER-studio-kit zips, Logo.psd. Not opened yet. These may hold the real cutouts.

## 2026-11-04 17:47 — Repo attached and pushed to GitHub

### What was asked
Brandon: "I created the repo on GitHub to add the database to" — put the staged repo into it.

### Done
| Action | Detail |
|--------|--------|
| Attached repo | imagetoform/pressure-cooker-poetry (private, branch main), push access, cloned to /home/claude/pressure-cooker-poetry and registered as a repo root |
| Merged with his initial commit | rebased the staged repo onto his c6921af; README conflict resolved by keeping his description line first, expanded, then the design law / how it works / layout / build / deploy |
| Verified build | site/tools/build.py in the clone gives a byte-identical dist/index.html (md5 c02ad47116b3eecc9b33d68bb812b8d2) |
| Pushed | c6921af..21f6d71 main -> main; GitHub contents list shows .gitignore README.md docs library site |

### Result
One home for everything: site source + build + tests (site/), design-family library (library/families/<branch>/<movement>/cutouts/), cutout inbox (library/cutouts/inbox/), docs/DATABASE_SPEC.md, docs/logbook.md (mirror of this file). From now on work in the clone, not /root/tasks/pcp-site-update/repo (that staged copy is superseded).

### Open / notes
- Production is still the Nov 2 build (md5 30354a8e…); dartboard/styles build c02ad471… waits for Brandon's OK. Coupons clipped earlier will rebuild differently after that publish.
- No cutout image files yet; he can drop them in library/cutouts/inbox/ via GitHub upload, or link this chat to his computer.
- When ChatGPT returns the database, validate against the DATABASE_SPEC checklist before merging.
- Corrections channel (Netlify form vs email) still undecided.

## 2026-11-04 17:45 — Database spec for ChatGPT

### What was asked
A markdown explaining how the database is organized and how items are selected with the emotion wheel / dartboard, so ChatGPT can build out the full database.

### Done
| Action | Detail |
|--------|--------|
| Spec | repo/docs/DATABASE_SPEC.md (committed): design rules, wheel layout + radii + tag points, 33-word vocabulary + aliases, taste aim angles, dart formula, bull + house rules, closeness and cutout/style selection formulas, schemas for ingredients / cutouts / movements, tagging and coverage guidance, paste-ready ChatGPT prompt, validation checklist. Numbers checked against src/board.js and src/styles.js. |
| Facts pulled live | fallback generators: halftone torn wedge arrow target burst bars ember crow eye stamp scribble gear loaf; layout ids: manifesto cutup xerox ledger whisper reliquary. |

### Open / notes
- Spec adds optional cutout fields `family`, `source`, `notes` (engine ignores them; harmless).
- When ChatGPT output comes back: validate vocabulary, ids, taste ranges and coverage before merging.
- Still waiting: empty GitHub repo from Brandon; approval to publish the dartboard/styles build.

## 2026-11-04 15:15 — Dartboard (emotion wheel), style tree with per-movement kits, repo staged

### What was asked
Use the cutouts: an emotion wheel split like a dartboard; ingredient values are the darts; cutouts chosen by emotion tags (no numbers). Then: a hierarchy of design movements (Art Nouveau, Minimalism, Cyberpunk, Punk, Maximalism, Brutalism, Abstract...) mixed in with the cutouts; one repository instead of scattered folders and zips; cutouts, buttons, layouts and animations each in their own design family. Also asked whether I have the cutout library.

### Done
| Action | Detail |
|--------|--------|
| Dartboard | src/board.js: Plutchik wheel, 8 petals x 3 rings (intense/core/mild) + 8 dyads + bull "overwhelm". Taste aim angles: sweet 0, umami 45, sour 125, bitter 200, spicy 285, salty 330. Dart radius r = 1.25 - focus - 0.3*(min(1.2,total/10)-0.9), seeded wobble. Bull only when 3 darts spread over >=3 petals and >=135deg. Closeness exp(-d/0.16); overwhelm matches only the bull. Spread over pantry: 42 intense / 88 core / 51 mild. |
| Cutout tags | 19 manifest fragments got emo tags (tools/build_board.py EMO). Engine 1.1 picks cutouts by darts when any asset has emo. |
| Style tree | src/styles.js: 6 branches, 18 movements, each with emo, blurb, colors, texture, motif SVG, layout (one of the 6 grammars or null), motion. Primary = closest movement (argmax); secondary weighted from another branch when darts spread or 25%. Primary's layout overrides the family unless forced. Layers are decoration only; textures masked to an edge frame (fixed after Whisper test showed dots behind text). |
| Kits | Per-movement motion keyframes (.anim-*; off with Motion off / reduced motion) and button skins via body[data-sty] on Pressurize/Valve buttons. |
| Lab | Dartboard panel in console (lab-only), Darts + Styles rows in inspector, #/lab cutout tagger (load images, tap wheel cells, copy manifest lines; tags saved in localStorage pcp-lab-tags). Every wheel cell labelled. |
| How page | Sections: The dartboard, The style tree (all 18 movements with blurbs and emotions). |
| Repo | repo/ (git, branch main, 2 commits): site/{live,src,tools,dist}, library/families/<branch>/<movement>/{README.md,cutouts/}, library/cutouts/inbox, docs/logbook.md, README with design law. Builds byte-identical dist. Not pushed: this session's GitHub access is bound to existing repos (no user/repos endpoint), so Brandon must create the empty repo first. |
| Tests | test4.js: pots map to fitting styles (grief->Abstract Expressionism, ecstasy->Art Deco/Reliquary, contempt->Dada, overwhelm->Maximalism); board hidden for visitors; tagger produces manifest; no JS errors. |

### Changed: old → new
- Cutout choice: numeric stats distance → emotion darts + tags (engine pcp-engine/1.0 → 1.1). Coupons clipped before this build will rebuild with different cutouts and styles.
- Layout family: chosen only by pressure → primary movement's layout grammar when it has one.

### Open / notes
- NOT deployed yet. dist/index.html = repo/site/dist/index.html (md5 c02ad471...).
- Cutout library: none of Brandon's real cutouts are reachable here. Only 3 embedded images + procedural stand-ins. Drive has pressure-cooker-poetry-rc2-site.zip (5.3 MB) and pressurizing-preview.zip that may contain cutouts; Drive download returns base64 inline, too big to pull through the tool. Best path: he drops images in the repo (library/cutouts/inbox) or links this chat to his computer.
- 12 movements without a matching grammar (cyberpunk, vaporwave, abstract-expressionism, op-art have layout null) borrow the pressure's pick; real new layout grammars per movement are future work.

## 2026-11-02 14:47 — Published to production

### What was asked
Brandon: "Yeah let's publish it."

### Done
| Action | Detail |
|--------|--------|
| Pre-check | Live site had only index.html (robots, favicon, cutout PNGs all 404); live md5 matched the copy pulled on Nov 1, so nothing else would be lost. |
| Deploy | Fresh command from the Netlify deploy-site tool; ran the local @netlify/mcp bin inside publish/ (index.html + netlify.toml with publish "."). Deploy 6ae8f67b4c83d484435703db, ready. Proxy URL not stored [secret removed; it comes from the deploy-site tool each time]. |
| Verify | Live md5 == dist/index.html md5. Playwright on https://pressurecookerpoetry.com: 181 tiles, dials hidden, coupon visible, 5 nav links, Food Bank 52 items, 2 essays, wall present, no JS errors. |

### Result
Live. Rollback target if needed: previous deploy 6ae51df243afff5d5e014dfc (Netlify UI -> Deploys -> Publish deploy).

### Open / notes
- Corrections channel still undecided.
- Brandon's 152-card deck still not located.

## 2026-11-01 23:12 — Dials hidden for good (lab mode), big pantry, auto poem pick

### What was asked
Brandon, frustrated that dials keep coming back: dials are strictly hidden test tools. Visitors only choose from a ridiculous, satirical amount of ingredients. That's all that is needed.

### Done
| Action | Detail |
|--------|--------|
| Lab mode | Flavor bars + PSI gauge + family odds, poem picker, seed/batch, inspector all get class `lab-only`; hidden unless `html.lab`. Turn on with `?lab=1` (or `#/kitchen?lab=1`), off with `lab=0`; stored in localStorage `pcp-lab`. |
| Design law comment | HTML comment at the top of index.html stating the rule, so any future builder (human or LLM) sees it. |
| Big pantry | src/pantry-plus.js: +153 ingredients (food, objects, memories, institutions, concepts, absurdities), 181 total, each with tastes. Shuffled per visit with Math.random (display only; rooms stay deterministic). |
| Tiles | Taste labels removed from tiles (they forced one tile per row); tastes show on the ingredients once they're in the pot. |
| Auto poem | pickPoem(): closest poem flavor to the pot, seeded pick among top 5. Pinned when chosen via Archive "Cook this" or the lab poem picker. |
| Coupon button | Moved out of Batch (now lab-only) to just under Pressurize/Valve. |
| Tests | test3.js: visitor sees 181 tiles, no flavor/seed/inspector/poem picker, coupon visible; lab=1 shows them, lab=0 hides; same pot -> same poem. test.js/test2.js pass (only the known kit4 cutout 404s). |

### Changed: old → new
- Visible "The flavor" panel (6 bars + gauge + odds) → lab-only
- Taste labels on every tile → only on ingredients in the pot
- Poem chosen by visitor dropdown → picked by the kitchen from the pot (dropdown is lab-only)

### Open / notes
- Brandon's real 152-card deck was not found in Drive (only the 28-card ingredients.js). It's probably on his computer; it can replace or join pantry-plus.js using { id, text, cat, t }.
- Memory writes are blocked in this chat (a connector was used), so the dials rule is NOT in Claude memory. It lives in the index.html header comment and this logbook.
- Still waiting on: go-ahead to publish to production; decision on a corrections channel.

## 2026-11-01 22:28 — Built tastes, drawing wall, essays+receipts, coupons, Food Bank

### What was asked
Put the Nov 1 ideas on pressurecookerpoetry.com: tastes instead of visible dials, drawing wall, the two essays with receipts, room coupons (all four chosen), preview before live. Mid-task Brandon also asked for an education section linking free learning resources for every main subject on the site, and asked me to just build rather than keep asking.

### Done
| Action | Detail |
|--------|--------|
| Pulled live site | `curl` of https://pressurecookerpoetry.com -> live/index.html (single 1.1 MB file, deployed by upload, no git repo). It already holds 56 of Brandon's real poems (Arsonist's Gospels 27, Genealogy of Stardust 29), NOT demo poems. |
| Tastes | src/tastes.js: 6 tastes (0-10) per ingredient; MATRIX turns taste points into the hidden e/c/i/x dial pushes (ing.d is now derived from ing.t). Dial sliders removed; "The flavor" panel shows potFlavor (chosen tastes summed, cap 10; empty pot = flavorOf(dials)). Archive labels + sort use tastes. How page rewritten. Mean deviation from old pushes ~11 points per ingredient (tools/tastefit.js). |
| Drawing wall | src/wall.js: $P point-cloud recognizer, ~15 code-drawn shape templates + scribble/dot heuristics; stroke speed/size/count adjust the mark; lines scored by a word lexicon; seeded pick among top 4. In poem reader margin and essay margin. |
| Essays | src/essays.js (content = Claude Docs exports, Grimoire rev 2, Mailman rev 4) + src/essays-view.js: #/essays, #/essays/<id>, sentence spans, [n] cite links scroll to receipt (no hash change), masked zigzag receipt. |
| Coupons | src/coupon.js: "Clip a coupon" in Batch panel; modal coupon, copy link, PNG via canvas, localStorage drawer (pcp-coupons). |
| Food Bank | src/foodbank.js: #/food-bank[/<aisle>], 9 aisles, 52 free resources. Every URL curl-checked; 403s were bot-blockers, confirmed by search. Dropped: yourlogicalfallacyis (timeout), amsterdamhermetica (500), Met open access (429, unverified). Bernays -> Gutenberg #78634. Strips link essays + poems into aisles. |
| Build | tools/build.py patches live/index.html with asserted single-match replacements -> dist/index.html. |
| Tests | tools/test.js + tools/test2.js (Playwright, 1400x900 and 390x844): no JS errors; screenshots in shots/. Only 404s are pre-existing assets/cutouts/kit4-001.png and -002.png (live site already references them; engine draws fallbacks). |
| Preview | Netlify deploy-site tool only offers a zip -> builds upload that publishes to production; its proxy refused a read-only API call (403), so no draft deploy was possible. Sent pressurecookerpoetry-preview.html to Brandon instead. Proxy credential file deleted. |

### Result
dist/index.html is ready and tested; nothing has been deployed. Production is unchanged.

### Corrections
I told Brandon in the scope question that the Archive held public-domain demo poems. Wrong: the poem manifest's header comment is stale, and the shelf is his real work.

### Open / notes
- To publish: run `npx -y @netlify/mcp@latest --site-id 1176071c-2c46-48fb-82b5-1a87a714fb04 --proxy-path "<fresh proxy URL from the deploy-site tool>"` inside a folder containing only index.html (copy of dist/index.html). It zips the folder and builds to production. Rollback = republish deploy 6ae51df243afff5d5e014dfc in the Netlify UI.
- Receipts promise open corrections, but the site has no feedback channel yet (Netlify forms are disabled; Brandon's email isn't published). Needs his decision.
- Essays are marked by Brandon Rhodes; they're drafts written with Claude and not yet signed off by him.
