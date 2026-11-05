# The cutout pipeline

A model through OpenRouter is the **brain**: it scouts, picks, tags by looking, and writes or finds CSS. GitHub Actions is the **hands**: it searches the open collections, downloads, cuts out backgrounds, checks everything, files it, and opens a pull request for you to review. Nothing reaches the live site until you merge it, and even then the site only loads cutouts after the build is taught to (see "Not done yet").

```
shopping-list.json ──▶ FIND in public-domain collections ──▶ PICK (model looks at thumbnails)
       ▲                                                              │
   SCOUT adds more                                                    ▼
   wanted cutouts                         CUT background (rembg) ──▶ TAG (model looks at the cutout)
                                                                      │
SNIPPETS: CSS for each kit ──────────────────────────────────────▶ FILE + pull request + zip
```

## What each step does

| Step | Who | What |
|---|---|---|
| Scout | model, with web search | Proposes new wanted cutouts for a movement, aimed at the parts of the wheel it barely touches. Adds them to `library/cutouts/shopping-list.json`. |
| Find | script | Searches Wikimedia Commons, the Art Institute of Chicago and Openverse, **public domain and CC0 only**, using each collection's own licence data. The model never supplies image URLs, so it can't invent them. |
| Pick | model, looking | Sees up to 8 thumbnails and chooses the one that shows the subject as a single cut-out-able shape and fits the movement, or rejects them all. |
| Cut | script | Downloads the image (only from an allowlist of collection hosts, max 30 MB), removes the background with rembg (`isnet-general-use`), trims, saves a transparent PNG at most 1200 px. |
| Tag | model, looking | Sees the cutout on a checkerboard and gives 2 to 4 wheel words from what it actually delivers (a ski mask on a robber is not a ski mask on a sledding kid), plus categories, a stand-in drawing and a plain label. Words outside the 33 are thrown out. |
| Snippets | model, with web search | Writes or finds CSS (button skins, edge textures, motion, ornaments) for a movement's kit. The script rejects anything with `@import`, outside `url()`s, scripts, or selectors not scoped to `body[data-sty="<movement>"]`, and borrowed code without an open licence and source link. |
| File | script | PNGs to `library/families/<branch>/<movement>/cutouts/`, records to `library/cutouts/manifest.json` (status `new`, full provenance: source page, creator, licence, why it was picked, the model, the first-guess tags). CSS to `.../kit/` with a licence header, listed in `kit.json`. A report goes to `library/cutouts/runs/`. |

## Set it up (once)

1. **Add your OpenRouter key as a repo secret.** In the repo on GitHub: Settings → Secrets and variables → Actions → New repository secret. Name it `OPENROUTER_API_KEY` and paste the key there. Never paste it into a chat or a file.
2. **Let Actions open pull requests.** Settings → Actions → General → Workflow permissions: tick "Allow GitHub Actions to create and approve pull requests". Without it, the run still pushes a branch and you open the pull request yourself.
3. **Optional: make the preset.** On openrouter.ai: Settings → Presets → new preset.
   - Name: `pcp-scout`
   - Model: a cheap vision model, e.g. `google/gemini-3.8-flash` (or `meta/muse-spark-1.3`)
   - System prompt: paste `tools/cutouts/prompts/preset-system.md`
   - Tools: turn on web search
   - Temperature: 0.2

   Then run the workflow with model `@preset/pcp-scout`. After that you can change the model or the rules in the preset without touching the repo.

## Run it

GitHub → Actions → **Cutouts** → Run workflow (this works from a phone browser too).

| Field | What to put |
|---|---|
| mode | `cutouts` to work through the list; `scout` to grow the list; `snippets` to grow the kits; `all` for all three |
| movement | e.g. `punk`, `art-nouveau`, `ukiyo-e`, or empty for any |
| limit | how many wanted cutouts to try (each costs two model calls with images) |
| model | an OpenRouter model id, or `@preset/pcp-scout` |

When it finishes:
- **Review:** the pull request shows the report, with each cutout, its tags and its source link. Delete the ones you don't want, then merge.
- **Download:** the run page has a zip (`cutouts-run-N`) with the new PNGs, CSS and records.

You can also run it locally: `node tools/cutouts/catalog.js`, then `pip install -r tools/cutouts/requirements.txt`, then `python tools/cutouts/run.py --movement punk --limit 4` with `OPENROUTER_API_KEY` set in your shell.

## Using the prompts by hand

The four prompts in `tools/cutouts/prompts/` are plain markdown with `{placeholders}`. You can paste one into OpenRouter's chat, Gemini or Muse, fill in the blanks, attach images, and get the same JSON back. `tag.md` is the one that matters most: it's the tagging rubric.

## Not done yet

- **The site doesn't load library cutouts yet.** The next build step: read `library/cutouts/manifest.json`, take the reviewed entries, put them in the asset manifest, and ship the PNGs as `assets/cutouts/` next to `index.html` in the deploy.
- **Kit snippets aren't wired in either.** They need the style engine to pick one variant per room (seeded, so the same recipe gives the same room).
- Openverse limits anonymous use heavily. If it keeps refusing, run with sources `commons,aic` (the `--sources` flag).
