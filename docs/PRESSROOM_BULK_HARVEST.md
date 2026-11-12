# Pressroom bulk collection (issue #2)

This is a **production-scale source image extraction experiment**, not a four-graphic illustration job.

Run: `python tools/cutouts/bulk_harvest.py --target 200`

One run aims for **200 actually downloaded, background-removed, transparent PNGs** from public-domain Art Institute of Chicago artworks, with repeatable source attribution, checksums, cropping and image dimensions.

- 12 search families, 49 distinct search terms, paginated per family
- Image API metadata is recorded separately from editorial family suggestions
- Duplicates by collection object ID and source-byte checksum skipped
- Every PNG is saved locally with a manifest entry and publication status `review`
- Failed search, crop and downloads are reported, not counted as completed assets
- `--vision` runs the existing visual tagging function on the finished cutout, requiring a valid `OPENROUTER_API_KEY`
- Without a working key, speculative labels are `unreviewed`, with empty emotional tag arrays. Do **not** present them as contextual visual tags.
- This batch does not alter the live website, `main`, or the deployment.
- Real output must be verified by GitHub Actions. This code change alone does **not** mean 200 images exist.
- Workflow is triggered by a push to the dedicated branch; it commits output back to the same branch. Manually dispatch more batches after reviewing results.

## Known limitations
- The image model used for background segmentation can produce bad masks on densely composed artworks. Review transparent edges and crop quality.
- An Art Institute whole-work reproduction can include contextual backgrounds; source objects are not automatically the right cutout. Poor results need to be rejected in QA.
- Search terms are *discovery hints*, not evidence that the artwork historically belongs to that movement.
- Only AIC is implemented as a bulk provider in this initial pipeline. Existing `run.py` already supports Wikimedia Commons and Openverse in smaller candidate-based runs.
- Running hundreds of rembg operations in one job can be CPU-heavy. Job timeout is six hours; use multiple smaller runs if GitHub-hosted runners hit limits.
- Review license/object-level metadata before publishing; `is_public_domain` is checked but no legal conclusion is inferred for every downstream use.
