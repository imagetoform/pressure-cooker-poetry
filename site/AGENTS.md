# Website rules, D-42
READ /docs/CANON.md first and /AGENTS.md second. Any older site/AGENTS.md is stored under docs/history and has no active authority.
Entrypoint = site/landing/index.html + mood.js + mood.css. Always show the four-step questionnaire BEFORE a generated result. Then the animated pressurization screen, then the unique seed-conditioned homepage. The cutup tool remains only at /lab/cutup/. Never reintroduce the Kitchen or an old homepage.
Assets = library/cutouts/manifest.json + approved source records. Use real transparent image cutouts. Source-first artistic composition, not placeholder geometry.
Build = python3 site/tools/build.py -> site/public -> Netlify main. The build invokes the architecture contract; don't bypass it. Existing content/poems.json and content/essays.json must render verbatim. Reproducible build, no runtime CDN dependencies.
All generated worlds must have the core five destinations, accessible hidden-eye route, interactive responsive cutouts, opt-in local sound, reduced-motion and hold-still. Playwright tests in site/tests/mood.cjs validate the journey on phone and desktop. Verify the PUBLIC URL after deploy.
