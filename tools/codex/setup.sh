#!/usr/bin/env bash
# Setup for agent sandboxes (ChatGPT Codex cloud environments and similar).
# In ChatGPT -> Codex -> Environments -> this repo -> "Setup script", enter:
#   bash tools/codex/setup.sh
# Setup runs with network access; the agent itself may not have any,
# so everything the tests need is installed here. Mirrors .github/workflows/site-build.yml.
set -euo pipefail

python3 --version
node --version

# Browser test runner, same version as CI. node_modules/ is gitignored.
npm install --no-save playwright@1.62.1
npx playwright install --with-deps chromium

# Prove the build reproduces before the agent starts.
python3 site/tools/build.py
python3 site/tools/assemble.py
git diff --exit-code -- site/dist && echo "setup: build reproduces site/dist"
