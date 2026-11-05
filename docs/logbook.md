---
task: pcp-site-update
goal: Put the Nov 1 2026 ideas onto pressurecookerpoetry.com (tastes instead of visible dials, drawing wall, essays with receipts, room coupons)
done_when: A Netlify preview of the updated site passes browser checks and Brandon approves publishing it to production
next: Brandon - add OPENROUTER_API_KEY secret + first Cutouts run; publish yes/no + style tuning (see 18:50)
owner: human
---

# Logbook — pressurecookerpoetry.com update

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

