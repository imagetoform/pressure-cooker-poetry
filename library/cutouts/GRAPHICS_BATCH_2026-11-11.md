# Pressroom graphics batch · 2026-11-11

Issue: https://github.com/imagetoform/pressure-cooker-poetry/issues/2

This review branch adds **four original, editable SVG graphics** at `library/cutouts/originals/`, plus the machine-readable `graphics-batch-2026-11-11.json` index and an independently curated **research-only** source shortlist.

## Scope and status
- 4 SVG compositions committed; no external images downloaded or represented as cleared.
- 5 archive research leads; not individual images, not imported into the site.
- Per-asset expressive design-family tags and emotional axes are editorial choices, default `unreviewed`.
- No modification to `main`, live landing code, Netlify config or production build.
- Before publication: review aesthetics, suitability, accessibility, rights and integration with existing catalog.
- SVGs use no external images, fonts, scripts or embedded network requests.
- Existing Claude session handoff patch/bundle not recovered as part of this batch; that remains separate outstanding work.

## Intended use
Use cutouts as overlays, masks, stickers or print-like editorial accents. Their vector source can be recolored, cropped, rotated and multiplied by the renderer. Source leads are a research queue, *not* permission to scrape and publish an entire collection.

## Review checklist
- [ ] Visual QA in desktop and mobile layouts
- [ ] Confirm design-family labels and emotional tags
- [ ] Review fit with existing asset intake/schema
- [ ] Choose individual archive items from source leads and verify object-level rights
- [ ] Build test after integration (not run in this PR)
