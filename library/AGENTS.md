# library/AGENTS.md: rules for the asset database

Adds to the root `AGENTS.md`. Full schema and tagging guide: `../docs/DATABASE_SPEC.md`. Pipeline: `../docs/CUTOUT_PIPELINE.md`.

## What lives here

| Path | What |
|---|---|
| `catalog.json` | The site's emotion vocabulary, aliases and movement tree. **Generated** by `node tools/cutouts/catalog.js`. Never edit by hand |
| `families/<branch>/<movement>/` | One folder per movement: `README.md`, `SHOPPING.md` (wanted cutouts), `kit/` (CSS parts + `kit.json`), `cutouts/` |
| `cutouts/manifest.json` | The only list of cutouts the site may use. Today: 2 kept constructivism images |
| `cutouts/shopping-list.json` | Cutouts still wanted (descriptions, not files) |
| `cutouts/inbox/` | Untagged images waiting for review |
| `intake/` | Delivery JSON from research agents. Pushing one to `main` runs the Cutouts workflow, which re-checks it and opens a PR |

## The rule that matters most: verify, then record

A record goes in only after **you** downloaded the file and looked at it. For every asset:

1. Open the item page. Read the licence **on that page**. Copy the page URL and the direct file URL from the browser or the API response, never from memory.
2. Download the file. Check that it is the thing the record describes (a woodcut is a woodcut, not a news photo).
3. Write the record with `source` (creator, title, date, institution, page URL) and the licence as shown.
4. If you can't do steps 1 to 3 (no network, blocked host), you may still write a *wanted* entry in `shopping-list.json` or a family `SHOPPING.md`. Mark it plainly as unverified. Never add it to `manifest.json`.

Hosts the pipeline will download from are listed in `ALLOWED_HOSTS` in `tools/cutouts/run.py` (Wikimedia, Art Institute of Chicago, Openverse, Flickr static, the Met, Smithsonian, Library of Congress, Internet Archive, NYPL, NASA). Image licences it accepts: CC0, public domain, PDM. Code snippet licences: CC0, MIT, Apache-2.0, BSD.

## Rights status

- **Cleared:** public domain or CC0, verified on the source page. In the US, "public domain by age" means published before 1931 (check the year each time; this line moves every January). US federal government works also qualify.
- **Original:** made for this project (including generated art). Say how it was made in the record or a `provenance.json`. Generated images are never described as historical artwork.
- **Reference only:** anything else, including unknown licences and gallery sites (Cosmos, Are.na, Pinterest, Savee). Keep the URL for inspiration; don't commit the file.
- **Owner-supplied:** Brandon decides on material he supplies himself (his own scans, collage fragments). Record what he said about it. Don't make that call for him in either direction, and avoid material from litigious megacorporations (Disney and the like).
- Movements newer than about 1931 (Memphis, Punk, Y2K, Vaporwave...) usually can't get cleared cutouts. Ship them as original kit snippets, US federal works, or pre-1931 ancestors with the same visual grammar.

## Tagging

- `emo`: 2 to 4 words from the 33-word vocabulary in `catalog.json` (aliases are mapped). Tag what the image **feels like**, not what it shows. One strong word plus one or two softer or blended ones. Save `overwhelm` for images that are genuinely too much.
- **No numbers** on cutouts or movements. The wheel's geometry does the maths.
- `family`: a movement id copied from `catalog.json` (e.g. `swiss`, not `swiss-international`), or `""` if shared.
- `cats`: 0 to 3 of `food object memory institution concept absurdity`.
- Tag one image at a time, after looking at it. Never assign tags in rotation or by script.
- Coverage goal: at least 6 cutouts per wedge and 2 per blend. Fill gaps before adding more of what's common. A movement switches to database-only rooms at 6 cutouts.

## Kit parts (CSS snippets)

- One file per part in `families/<branch>/<id>/kit/`, listed in that folder's `kit.json`. Prefix by kind: `button-`, `texture-`, `ornament-`, `motion-` (generated ones start with `gen-`).
- The intake checker rejects `@import`, `url()` other than `data:`, `@font-face`, `javascript:`, `expression()`, `behavior:` and `<style>`/`<script>`. Write self-contained CSS that passes.
- A button skin may change the look, never the size, focus ring or label (see DESIGN.md section 8). Text on a skin needs 4.5:1 contrast.
- After adding parts, rebuild: `python3 site/tools/build.py` (it runs the kit and library builders and prints counts). Report the new counts in the PR.

## Before you finish

```sh
python3 -c "import json;[json.load(open(p)) for p in ['library/cutouts/manifest.json','library/cutouts/shopping-list.json']];print('json ok')"
node tools/cutouts/catalog.js     # if you changed movements in site/src/styles.js
python3 site/tools/build.py       # kits + library counts
```
