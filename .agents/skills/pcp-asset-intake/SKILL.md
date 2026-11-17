---
name: pcp-asset-intake
description: Add a cutout image, CSS kit part, font or animation snippet to the Pressure Cooker Poetry library with a verified source, correct rights status and meaning-based emotion tags. Use whenever you add, tag, re-tag or move an asset in library/.
---

# pcp-asset-intake

Read `library/AGENTS.md` first. The short version: **download it, look at it, then record it.** Records written from memory have failed here before (0 of 18 usable in one batch).

## Cutout image

1. Find it on a host in `ALLOWED_HOSTS` (`tools/cutouts/run.py`). Open the item page and read the licence there.
2. Rights: CC0, public domain or PDM only, verified on that page. US public domain by age means published before 1931. Otherwise it is reference-only: keep the URL in a `SHOPPING.md` note, don't commit the file.
3. Download it. Open it. Confirm it shows what you'll say it shows.
4. Prepare it: transparent PNG (or WebP if the pipeline expects it), at most 1200px on the long side, reasonable size (the two kept ones are 57 KB and 93 KB after 128-colour quantising).
5. Save under `library/families/<branch>/<movement>/cutouts/<id>.png`, or `library/cutouts/inbox/` if no movement fits yet.
6. Write the record into `library/cutouts/manifest.json`, copying the shape of the existing entries:
   `id, src, fallback, label, family, emo, cats, source, notes, status, file, provenance`.
   - `family`: copied from `library/catalog.json`.
   - `emo`: 2 to 4 words from `catalog.json` `vocabulary`, chosen for what the image **feels like**. Write one sentence in `notes` saying why.
   - `source`: creator, title, date, institution, page URL.
7. Run `python3 site/tools/build.py` and report the new library count.

Easier route for batches: write a delivery JSON into `library/intake/` (format in `tools/cutouts/prompts/openrouter-preset.md`) and let the Cutouts workflow re-check, download, cut and open a PR.

## Kit part (CSS)

1. Put it in `library/families/<branch>/<movement>/kit/` with a kind prefix: `button-`, `texture-`, `ornament-`, `motion-`. Add it to that folder's `kit.json`.
2. Self-contained CSS: no `@import`, no `url()` except `data:`, no `@font-face`, no scripts. Licence: your own work (CC0) or MIT / Apache-2.0 / BSD with the source URL you actually visited.
3. Buttons keep size, label and focus ring; text on them meets 4.5:1.
4. Motion has a reduced-motion off switch.
5. Rebuild and force a room with that movement in lab mode (`?lab=1`) to see it in place. Screenshot it for the PR.

## Font

Only with an OFL (or equally open) licence, checked on the foundry or Google Fonts page. Never commit a font binary whose licence you haven't read. Record family, licence and URL in the PR. Fonts are embedded at build time; no CDN links.

## Never

- Write a URL, filename, licence or date you didn't see.
- Tag in rotation, by script or by filename.
- Present a generated image or stand-in as a historical artwork.
- Add to `manifest.json` anything you didn't download.
