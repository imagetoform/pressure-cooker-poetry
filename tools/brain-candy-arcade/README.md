# Brain Candy arcade: source

This is the readable source of `site/landing/brain-candy/index.html` (React + TypeScript, bundled into one HTML file).
The build never deploys this folder; only the compiled file in `site/landing/brain-candy/` goes live.

| Path | What |
|---|---|
| `src/App.tsx` | Hub, routes (`#spin-cycle`, `#soft`, `#bias-factory`, `#cutup-bench`, `#department-zero`, `#blueprints`), jar, sound toggle |
| `src/machines/*.tsx` | One file per machine. `CutupBench.tsx` is the Cut-Up Bench |
| `src/data/` | Content. `spin.ts` is copied word for word from `site/landing/brain-candy/spin-cycle/data.js`; `speeches.ts` was built by script from Project Gutenberg texts (#4, #202, #59110, #66938); every other fact carries its source in the file |
| `src/assets/tools.ts` | The graffiti cut-up kit tools (owner's art) as embedded WebP; originals in `src/assets/tools/` |
| `index.html` | Page shell with the five-door site strip; fonts load from `/brain-candy/fonts/fonts.css` |

The Cut-Up Bench loads the site's own poems and essays from `/brain-candy/writing.json`, which `site/tools/build.py` writes on every build. On any other host (claude.ai preview) that file is missing and the bench falls back to the speeches and bench classics.

## Rebuild

```sh
cd tools/brain-candy-arcade
pnpm install
pnpm exec tsc -p tsconfig.app.json --noEmit          # type check
rm -rf dist .parcel-cache
pnpm exec parcel build index.html --dist-dir dist --no-source-maps
pnpm exec html-inline dist/index.html > ../../site/landing/brain-candy/index.html
cd ../.. && python3 site/tools/build.py
python3 -m http.server 8765 --directory site/public &   # then:
node site/tests/cutup-bench.cjs && node site/tests/spin-cycle.cjs
```

Don't hand-edit the compiled `index.html` any more: change the source and rebuild.
