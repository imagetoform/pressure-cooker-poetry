# PCP Visual Atlas: autonomous research and private pinboard

## Status and source of truth

This is an independent review-only pipeline, not a replacement for the Cutouts workflow, the cutup maker, or the Netlify site. Before advancing any design, read docs/CANON.md (especially D-01/02/11/15/20/24/26/27/31-35) and docs/GO_LIVE_PLAN.md. Never revive the retired Kitchen or old picker.

## Discovery

The seed registry at library/atlas/sources.json includes the user-shared Pinterest links, Cosmos image references and the Are.na Graphic Soup channel. Every linked source is retained as reference-only, even if image extraction is unavailable.

Are.na public channel blocks are read via its official **v3 channel-contents endpoint**, with only one page per scout. Github repository metadata is discovered using GitHub REST search, including title, link, language and claimed SPDX license. This pipeline **does not execute external code or download third-party assets**.

The open museum/archive index pages are kept as starting leads. The existing CC0 cutout harvester remains the approved way to bring licensed art into the image library. No attempt is made to bypass login walls, robots restrictions, or private Pinterest and Cosmos collections.

Results are merged into library/atlas/discoveries.json, deduped by URL. Existing human annotations are preserved. Each record has source, platform, stable ID, research status and rights label.

## PCP's own pinboard

Run tools/atlas/gallery.py to build **out/pcp-atlas/index.html**. The offline, responsive gallery has searchable reference and code links and six deterministic cutup design experiments using approved image files from the GitHub repository. The HTML does not load third-party JavaScript or publish assets. Cosmos images may appear as external previews only when the private HTML file is opened. They are not copied into the production site's assets.

Unlike the current cutup-maker sandbox, these are **design candidates**, not a replacement homepage.

## Autonomous schedule

The workflow .github/workflows/atlas-scout.yml runs on **Mondays and Thursdays, 10:13 UTC**, once this branch's PR is reviewed and merged into the default branch. It will then:

1. Scan documented public endpoints and retain the source references.
2. Build visual gallery and graphic composition candidates.
3. Run basic tests and upload the entire review HTML plus reviewed image thumbnails as a downloadable Actions artifact.
4. Open **draft PRs** when new research records are discovered. If GitHub settings prohibit PR creation, the discovery branch is still pushed.

No automatic merges, production deployments, runtime visitor APIs, analytics, accounts, or release overrides.

Optional ARENA_ACCESS_TOKEN as GitHub Actions secret enables authorized Are.na access. Never put tokens in files or issue text. Connecting a dedicated Pinterest account needs user authorization and an approved developer API integration. Cosmos has no comparable documented public API; use permitted exports for full ingestion. These external accounts have not been created.

## Run locally

python3 tools/atlas/scout.py --offline

python3 tools/atlas/gallery.py

python3 -m unittest discover -s tools/atlas -p 'test_*.py'

Open out/pcp-atlas/index.html. No third-party Python dependencies are required.

## Future additions

Separate source adapters can collect RSS, public-domain art metadata, and permitted source exports. An optional private Supabase mirror can support visual search and cross-linking. A later design build agent can create reviewable candidate branches from validated code and checked visual sources, but must follow the single-step release plan and avoid altering the active cutup-maker design without approval.
