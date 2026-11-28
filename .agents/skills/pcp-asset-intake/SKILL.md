---
name: pcp-asset-intake
description: Add a cutout, background image, CSS kit part or font to the Pressure Cooker Poetry library with a verified source, correct rights status and meaning-based tags. Use whenever you add, tag, re-tag or move an asset in library/.
---

# pcp-asset-intake

Read `library/AGENTS.md` first; it wins over this summary. The short version: **download it, look at it, then record it.** Records written from memory have failed here before (0 of 18 usable in one batch).

## Brandon's cutouts (the homepage library)

- `library/cutouts/manifest.json` holds Brandon's own reviewed-and-accepted cutouts, imported with `tools/cutouts/owner_import.py SRC BATCH` into `library/cutouts/owner/<batch>/` (WebP web copies; masters stay on his laptop).
- Never repopulate it from historical files, AI batches, intake batches or old manifests.
- `status: held` (megacorp characters) stays off the site until he releases it. Don't decide owner-supplied rights for him in either direction.

## Outside images (cutouts or backgrounds from archives)

1. Only from a host in `ALLOWED_HOSTS` (`tools/cutouts/run.py`). Open the item page and read the licence **there**.
2. Rights: CC0, public domain or PDM, verified on that page; US federal government works qualify; US public domain by age means published before 1931 (check the year each time). Anything else, including Cosmos, Are.na, Pinterest and stock sites with custom licences (Unsplash, Pexels), is reference-only: keep the URL in a `SHOPPING.md` note, don't commit the file.
3. Download it. Open it. Confirm it shows what you'll say it shows.
4. Record `source` (creator, title, date, institution, page URL, licence as shown) and tag `emo` with 2 to 4 words from `library/catalog.json` `vocabulary` for what it **feels like**, plus one sentence in `notes` saying why.
5. Self-host it. No hotlinking: the site makes no runtime requests to other hosts.
6. Run `python3 site/tools/build.py` and report the new count.

## Kit part (CSS)

Self-contained CSS in `library/families/<branch>/<movement>/kit/`, listed in that folder's `kit.json`. No `@import`, no external `url()`, no `@font-face`, no scripts. Licence: own work (CC0) or MIT / Apache-2.0 / BSD with the source URL you visited. No code-drawn stand-ins for collage material (fake paper, tape, labels): that is what made editions look generated.

## Font

Only OFL (or equally open), licence read on the foundry or Fontsource/Google Fonts page and committed next to the file (see `site/landing/brain-candy/fonts/`). Self-hosted; no CDN links.

## Never

- Write a URL, filename, licence or date you didn't see.
- Tag in rotation, by script or by filename.
- Present a generated image or stand-in as a historical artwork or as Brandon's work.
- Add to `manifest.json` anything you didn't download and look at.
