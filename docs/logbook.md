---
task: pcp-site-update
goal: Put the Nov 1 2026 ideas onto pressurecookerpoetry.com (tastes instead of visible dials, drawing wall, essays with receipts, room coupons)
done_when: A Netlify preview of the updated site passes browser checks and Brandon approves publishing it to production
next: decide a corrections channel (form or email); swap in Brandon's 152-card deck when he shares it
owner: human
---

# Logbook — pressurecookerpoetry.com update

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

