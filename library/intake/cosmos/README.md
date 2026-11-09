# Website Design Inspo intake

Board: [Website Design Inspo](https://www.cosmos.so/brandonrhodes/website-design-inspo). The public collection reported 1,398 saves on 2026-11-09. Intake proceeds in collection-order batches of roughly 32. The current reviewed range is **1–32** in `batch-001.json` and `batch-001-notes.md`; **33–1,398 remain**. Collection order and count can change, so later captures must deduplicate by `cosmos_id`, not by position.

## What a batch means

- `cosmos_url` is the reference link. `source_url` is only the URL recorded by Cosmos; it can be a repost, marketplace, or another aggregator.
- `label`, `categories`, `emo`, and `cutup_note` are a visual reading, not claims about authorship or licensing. `emo` follows the current site's [33-word wheel vocabulary](../../../docs/DATABASE_SPEC.md). The separate v2 dartboard can map these later.
- `rights_status: unverified` and `intake_status: reference_only` mean no saved image is approved for the site, a prototype, or the cutout manifest. A Cosmos public-domain flag by itself is not clearance. Record the original creator, source page, and license before changing status.
- `cutup_note` describes a visual operation we can make with original or cleared material. It does not authorize extracting part of the saved image.

## Repeating the intake

1. Review the next board page in the browser and capture its public metadata in a batch file using the same fields as `batch-001.json`. Keep its cursor or other collection-order checkpoint and check for duplicate `cosmos_id` values against all earlier batches.
2. Look at every image, write a concise label, categories, two to four valid `emo` words, and one concrete visual idea. Keep a separate visual-notes file that links every Cosmos ID.
3. Validate the notes with `python tools/cosmos/apply_review.py <batch.json> <notes.md>`. This checks IDs, full coverage, and emotion vocabulary.
4. If a reference is a candidate for actual cutout use, follow [the cutout pipeline](../../../docs/CUTOUT_PIPELINE.md): locate the original source, verify creator and license, make a reviewable crop or adaptation, and then add the cleared asset to the cutout manifest. Do not write reference-only items to the runtime manifest.

`python tools/cosmos/first_page.py --output library/intake/cosmos/batch-001.json` captures public metadata for the first page only. It overwrites visual fields, so keep the notes file and rerun `apply_review.py` afterward. Later pages need a browser-visible export or another authorized collection export; the script does not assume a reusable API.

## Prototype candidates from batch 001

The [visual review](batch-001-notes.md) selects **Letter as doorway**, **Pressure map**, and **Chorus poster**. Build them as separate next-version experiments using original work. The live site stays on its current design until a rendered candidate is reviewed.
