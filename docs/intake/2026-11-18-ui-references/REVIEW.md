# Review: UI references + development proposals (submitted 2026-11-18)

**What it is:** a research delivery Brandon brought in (author: another AI session; it says it had no push access). 13 UI/code references tagged with the old heat/order/noise/weight dials, 2 reading resources, and 6 code proposals. Saved exactly as sent in `SOURCE.md`. Brandon: "I would like to add this for looking over."

**Bottom line:** most of the code targets the Kitchen, which was deleted the same morning (CANON D-31): `site/src/styles.js`, `board.js`, `foodbank.js`, the six layout grammars, rooms, `cook()`, the Pressurize pot and the pantry. None of that exists anymore, so **none of the code goes in as written**. The ideas worth keeping are the xerox/glitch texture for the cutup card, the two reading resources for the Food Bank, and a link-checker for deliveries. Nothing from this file has been built or added to the library.

## 1. Links: opened on 2026-11-18

| Ref | Link | Checked | What it actually is | Licence |
|---|---|---|---|---|
| ui-010 | github.com/steelzzeu/brutalistfolio | ✅ exists | Brutalist portfolio template (HTML/CSS/JS) | MIT |
| ui-011 | github.com/pinecreativelabs/Blueprint-Grid | ⚠️ not checked | GitHub rate-limited the fetch twice | ? |
| ui-012 | github.com/nsolerieu/brute | ⚠️ not checked | rate-limited | ? |
| ui-013 | codepen.io/rachelandrew/pen/WNJKpzP | ⚠️ not reachable | CodePen refused the fetch | ? |
| ui-014 | github.com/quak-ai/Neo-brutalism-CSS | ⚠️ not checked | rate-limited | ? |
| ui-015 | github.com/Liiift-Studio/stabilType | ⚠️ not checked | rate-limited twice | ? |
| ui-016 | gist simon-raynor/8ed17a46… | ✅ exists | "Glitchy vsync SVG filter effect": feTurbulence displacing red/cyan layers | **none stated** |
| ui-017 | gist grateful-dev/cad815ca… | ✅ exists | clip-path + mix-blend-mode text glitch, written for GridSound's splash screen | **none stated** (points at a CodePen licence page) |
| ui-018 | github.com/QC20/Emergent-Loops | ⚠️ not checked | rate-limited | ? |
| ui-019 | gist JohnnySapient/be4acadb… | ✅ exists | "Draw With Flowers! (GLSL Shader & Three.js)", a copy of a pen by **Ksenia Kondrashova** on CodePen | **none stated** (copied from someone else's pen) |
| ui-020 | github.com/rossng/where-should-i-aim | ⚠️ not checked | rate-limited | ? |
| ui-021 | github.com/Aupajo/oulipo | ✅ exists | "Constrained writing with Ruby": lipograms, N+7 | MIT |
| ui-022 | github.com/ericqweinstein/rukovsky | ⚠️ not checked | rate-limited | ? |
| — | standardebooks.org/subjects/poetry | ✅ exists | Free, carefully proofread public-domain ebooks; their own production work is CC0 | CC0 (their work) |
| — | openculture.com/free_ebooks | ✅ exists | "800 Free eBooks", no login; links out to Apple Books, Project Gutenberg and others | links only |

**Recheck the ⚠️ rows one at a time before anyone relies on them.** No code from a "none stated" gist or a copied pen gets pasted in: the technique (SVG turbulence, clip-path slices) is fair to rebuild from scratch, the code isn't ours to copy.

**The dial numbers aren't usable.** The heat/order/noise/weight values belong to the retired dials (D-17), and some family tags don't match what the link is: a CSS grid framework tagged Swiss, a neo-brutalism kit tagged Pop Art, a darts-aiming repo tagged Geometric Abstraction, a Ruby writing library tagged Dada. Nothing was added to the library.

## 2. The six proposals, against the reset

| # | Proposal | Verdict | Why |
|---|---|---|---|
| 1 | Container-query room layouts + Rococo fix | **Idea already in; code dead** | The cutup card already sizes everything to the card with container units (`cqw`). The `.room`, `.sty-ledger`, `.poem-wrap` classes and the Rococo room are gone (D-31; Q-04 closed). |
| 2 | Xerox tear (SVG turbulence) + clip-path jitter + Constructivist wedge | **Worth doing, rebuilt as ours** | Fits the torn-paper card: a toner tear on Punk/Zine/Grunge strips or a glitch on a hard beat. Must be our own code (licences above), stay off the reading text's legibility, and stop under reduced motion and "Hold still". Proposed for the cutup maker build (go-live Step 4), Brandon's OK first. |
| 3 | `pressurize-ransom.js` (slips into a boiling pot) | **Graveyard** | The pot, `cook()` and Pressurize moment were deleted (D-31). It also falls back to `Math.random`, which breaks law 2 (same inputs, same card). |
| 4 | Three.js / GLSL polar emotion shader | **No (for now)** | Needs Three.js, which is a runtime dependency (AGENTS.md: none without Brandon's OK). Its input, `board.js` darts, is gone. A plain CSS or SVG background could do a calmer version if Brandon wants one. |
| 5 | Ruby pantry audit + Oulipo cut-up helper | **Pantry: graveyard. Oulipo: a question** | The pantry is deleted. Oulipo games (N+7, lipograms) could be a cutup method, but **never on Brandon's poems** (law 1: strips are his exact words). It could only work on the visitor's own words or on public-domain text. Brandon's call; maybe a Brain Candy machine. |
| 6.1 | Map heat/order/noise/weight onto kits | **Graveyard** | Dials retired (D-17); kits aren't shipped since the reset. |
| 6.2 | Layout grammars for 4 movements | **Graveyard** | Layout grammars deleted (D-31). |
| 6.3 | Wire `PCP.animations` into `cook()` | **Graveyard** | Same as #3. |
| 6.4 | Add Standard Ebooks + Open Culture to the Food Bank; a corrections link on essays | **Yes, pending Brandon's OK** | Both links verified, free and no login. They'd go in `content/food-bank.json` (not `site/src/foodbank.js`, which is gone), under "Poetry, from scratch". That's a content change, so Brandon says yes first. A corrections link (mailto or GitHub issue) on essay sources is a visitor-facing addition and also needs his OK. |
| 6.5 | Check every delivered URL before ingest | **Yes** | Directly stops the invented-link problem (AGENTS.md law 4). A small standard-library script under `tools/` that opens each URL in a delivery and writes `verified`/`unreachable`. Mechanical; can be built any time. |

## 3. Open for Brandon

1. Food Bank: add Standard Ebooks and Open Culture? (They'd be read as written; nothing about them changes.)
2. Xerox tear / glitch on the cutup card: in or out?
3. Oulipo games on the visitor's own words (never your poems): interesting, or noise?
