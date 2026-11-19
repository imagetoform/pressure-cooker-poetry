# Pressure Cooker Poetry

The website's database, design elements and cutouts for [pressurecookerpoetry.com](https://pressurecookerpoetry.com), and the source for the site itself: poetry, essays with receipts, the Food Bank of free resources, and **Brain Candy**, a workbench of writers' methods for taking language apart (blackout, cut-up, fold-in, N+7, mesostic, permutations, sound poems).

> **The Kitchen is retired from the public site (Nov 2026).** Its engine still builds, because the reading pages load poems and essays from it, but `/kitchen/` now only forwards old links. The sections below on ingredients and rooms describe that archived engine.

## Design law

Visitors **only choose ingredients**, from an absurd, overwhelming pantry (satire of fake abundance). The dials, flavor bars, PSI odds, dartboard, poem picker, seeds and inspector are **test machinery**: hidden from visitors, shown only in lab mode (`?lab=1`; `?lab=0` turns it off). Authored writing is never edited. Same recipe, same room.

## How it works

1. **Ingredients** (481: 28 starters plus 453 in `site/src/pantry-plus.js`) each carry six tastes: sweet, sour, salty, bitter, umami, spicy.
2. **Tastes** push four hidden dials (energy, clarity, intimacy, chaos), which set the pressure and layout parameters (`site/src/tastes.js`).
3. **The dartboard** (`site/src/board.js`): each ingredient is a dart thrown at Plutchik's emotion wheel. Its tastes aim it, and strong single tastes land near the center (rage, grief).
4. **Cutouts and styles** carry emotion tags, never numbers. The room pulls the cutouts and design movements closest to where the darts landed (`site/src/styles.js`, `library/families/`).
5. **The writing**: 56 poems, 2 essays with receipts, the drawing wall in every margin, and the Food Bank of free resources.

## Where things live

| Path | What |
|---|---|
| `site/live/index.html` | The original single-file site the build starts from (poems, fonts, layout families, engine) |
| `site/src/` | Everything added on top: tastes, pantry, dartboard, styles, wall, essays, Food Bank, coupons, lab tools, CSS |
| `site/tools/build.py` | Patches `live/index.html` with `src/` and writes `dist/index.html` |
| `site/tools/test*.js` | Playwright browser checks |
| `site/dist/index.html` | The deployable page |
| `library/families/` | One folder per design movement: its kit and its cutouts |
| `library/cutouts/inbox/` | Cutouts waiting to be tagged |
| `docs/logbook.md` | Session-by-session history of the build |

## Build and test

```sh
cd site
python3 tools/build.py            # writes dist/index.html
cd dist && python3 -m http.server 8765 &
cd .. && node tools/test.js       # needs Playwright
```

## Deploy

Netlify (site `pressurecookerpoetry`) publishes `site/public/`, built by `python3 site/tools/build.py && python3 site/tools/assemble.py`:

- `/` is the front door: the Gutter Intelligentsia mission and a big door into Brain Candy (`site/landing/index.html`, styles in `site/landing/assets/site.css`)
- `/brain-candy/` is the Brain Candy hub, `/brain-candy/bench/` the Cut-Up Bench (`site/brain-candy/`, published by `site/tools/build_brain_candy.py`). Bench deep links: `#tool=marker`, `#station=n7`, `#poem=<id>`, `#burroughs`
- `/read/?poem=<id>` and `/read/?essay=<id>` are the plain reading pages; `/food-bank/` is the Food Bank on its own page
- `/kitchen/` forwards old Kitchen links (`#/read/…`, `#/essays/…`, `#/food-bank/…`) to their new homes; `/collage/` and `/visual-picks/` redirect to `/`
- The old Kitchen-era landing is kept, unpublished, at `site/archive/gutter-landing.html`
- Tests: `site/tests/site-flow.cjs` (desktop, Pixel 7, 320px phone) against `python3 -m http.server 8765 --directory site/public`

For automatic deploys, connect this GitHub repository to the existing Netlify project, choose `main` as the production branch, and use the build command and publish directory in `netlify.toml`. GitHub Actions rebuilds every pull request and checks that `site/dist/` matches the source files. Do not create a second Netlify project for the same domain.

**Database-only rooms.** Once a movement has 6 library cutouts, its rooms stop using the layouts' built-in background art and stand-in drawings. They use only library cutouts and the movement's kit; the layout still arranges the poem. Movements below 6 keep the old art. The line is `DB_MIN` in `site/tools/build_library.py`.
