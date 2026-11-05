# Intake

Drop a delivery file from another agent here (for example `pcp-delivery-punk-2026-11-05.json`, made with `tools/cutouts/prompts/superbot.md`). Pushing it to `main` starts the **Cutouts** workflow in `intake` mode. It checks every field again, downloads each image only from a known collection, cuts out the background, files everything as `new`, moves the delivery to `done/`, and opens a pull request for review.
