# Cutouts

Real image files only (CANON D-20). Each cutout is a transparent PNG master plus a WebP web copy in
`library/families/<branch>/<family>/cutouts/`, and a record in `manifest.json` with its source, creator, date and license.

| File | What |
|---|---|
| `manifest.json` | The live database: every cutout the site uses. Built into the site by `site/tools/build_library.py`. |
| `candidates.json` | Everything ever harvested, with status `candidate`, `kept` or `rejected`. Rejected objects are never harvested again. |

## Adding cutouts: harvest, look, promote

```sh
# 1. Harvest CC0 images from a museum and cut them out (subject mode) or keep only the ink (ink mode, for prints on paper)
python3 tools/cutouts/harvest.py posada-family-id 9 --source met --mode ink "artist:Posada"
python3 tools/cutouts/harvest.py expressionism 9 --source cma --mode ink "artist:Kirchner" "artist:Kollwitz"
#    sources: met (The Met), cma (Cleveland Museum of Art). "artist:Name" = only objects whose artist matches.

# 2. LOOK at them. This step is the point.
python3 tools/cutouts/contact_sheet.py tmp/sheet.png expressionism

# 3. Write decisions (keep + emotion tags, or reject + why) and promote. Makes the WebP copies too.
python3 tools/cutouts/promote.py decisions.json
```

A decision looks like
`{"id": "expressionism-cma138833", "keep": true, "label": "On the Street (Kirchner)", "emo": ["apprehension", "distraction", "loathing"], "cats": ["institution", "memory"], "notes": "why"}`.
Add `"family": "other-family"` to re-file a cutout under a better family. Ids can be shortened to any unique prefix.

Emotion tags must be words on the emotion wheel (`library/catalog.json` vocabulary). Categories: food, object, memory, institution, concept, absurdity.

**Don't run `harvest.py` and `promote.py` at the same time.** Saves are merge-safe now, but there's no reason to tempt it.

## Outside deliveries (ChatGPT, Brandon's art, scans)

```sh
python3 tools/cutouts/ingest.py delivery.zip --source chatgpt     # or a folder; needs a cutouts.json sidecar
python3 tools/cutouts/contact_sheet.py tmp/sheet.png punk          # look
python3 tools/cutouts/promote.py decisions.json                    # {"id": ..., "keep": true} reuses the suggested tags
```
The ChatGPT brief is `docs/handoffs/CHATGPT_CUTOUT_BRIEF.md`. Sources: chatgpt, brandon, scan.

## Brandon's own images

Put files in `library/cutouts/inbox/` with a note on where they came from. They go through the same look-and-tag step.
