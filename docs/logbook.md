---
task: pcp-site-update
goal: Put the Nov 1 2026 ideas onto pressurecookerpoetry.com (tastes instead of visible dials, drawing wall, essays with receipts, room coupons)
done_when: A Netlify preview of the updated site passes browser checks and Brandon approves publishing it to production
next: Brandon creates an empty private GitHub repo (pressure-cooker-poetry) -> attach with add_repo (push) and push repo/; approve publishing the dartboard/styles build; send cutout files
owner: human
---

# Logbook — pressurecookerpoetry.com update

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

