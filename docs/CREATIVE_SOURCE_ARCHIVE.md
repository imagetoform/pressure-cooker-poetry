# Pressure Cooker Poetry | Creative source archive

## Visual north star
The approved cut-paper, found-image, maximal editorial mockups are the target, not generic stock-art templates. The site's emotional engine, recipes, writing and deterministic seed remain intact. Typography, image density, paper damage, scale, spatial arrangement and motion should shift with each visitor's ingredients, without reducing poetry to illegible decoration.

## Two separate pipelines

**Research intake (broad):** Study user-supplied images, scans, prints, magazine ads, flyers, book covers, screenshots, historic propaganda, commercial ephemera, archival photography and web references. Store provenance and original context, including source URL, creator, date, license/rights information as reported, design family, emotional tags, and the part to isolate. Unknown, restricted, or unverified material is useful research, not automatically publishable site content.

**Publication (explicit):** Only records in `library/cutouts/manifest.json` with `publication_status: "cleared"` and an available local file are included by `site/tools/build_library.py`. Clearance requires an actual basis such as an appropriate license, public-domain status, user ownership/permission, or a reviewed applicable exception; this property is never inferred merely from downloading, cropping, transforming or tagging an image. Keep credits and any necessary attribution.

## Intake implementation
- `tools/cutouts/run.py --mode intake` accepts delivery JSON under `library/intake/`.
- Compatible public-domain/CC0 files hosted on its existing trusted downloads list are cut out into `library/families/` and marked `publication_status: "review"`. Review them before changing to `cleared`.
- Other referenced images with a valid HTTPS source page are indexed in `library/research/index.json` as `research-only`. They are **not downloaded** by GitHub Actions and are **not exported** to the live site's assets. This includes copyright-uncertain references and sources beyond the automatic downloader's allowlist.
- For user-provided files, attach or place the actual file via an explicit, reviewed upload path before processing; do not pretend a URL points to a user upload.
- Reject invented provenance and unsafe remote fetches. Avoid treating “appears online” as a license. Do not fetch arbitrary remote URLs in CI.

## Publishing procedure
1. Inspect each candidate image and source metadata.
2. Make sure public use is permitted, or obtain an appropriate review of the intended use.
3. Confirm cutout quality, attribution requirements, accessibility and how it fits the intended movement.
4. Set `publication_status` to `cleared` in the manifest for approved local assets; leave `review` otherwise.
5. Run the build and inspect the actual composition before publishing.

## Mockup fidelity acceptance criteria
- First render should read as a composed physical collage, not a standard hero-section template.
- Cutouts have intentional foreground/background placement, contrasting scale, overlays and print texture.
- Primary authored writing remains legible and intact.
- Recipes map deterministically to the same visual outcome across reloads.
- Mobile layout should be authored for small screens, not simply a shrunk desktop.
- Movement kits and emotional tagging cause visibly distinct compositions, not only palette swaps.
- Every visible asset in published rooms passes the publication gate.
- Lab controls remain separate from the visitor-facing experience.

## Next design pass
Await the additional visual resources and specific page-content decisions before replacing the current landing composition. Keep experiments on a branch, preview them, and compare against the mockups before merging to main.
