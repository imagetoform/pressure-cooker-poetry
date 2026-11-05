# Pressure Cooker Poetry

The website's database, design elements and cutouts for [pressurecookerpoetry.com](https://pressurecookerpoetry.com), and the source for the site itself: a generative poetry site where visitors pick ingredients and the kitchen builds a room for a poem.

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

The site is a single static `index.html` on Netlify (site `pressurecookerpoetry`). Upload the whole `site/dist/` folder as a deploy: `index.html` plus `assets/cutouts/`, which the build fills from `library/cutouts/manifest.json`.

**Database-only rooms.** Once a movement has 6 library cutouts, its rooms stop using the layouts' built-in background art and stand-in drawings. They use only library cutouts and the movement's kit; the layout still arranges the poem. Movements below 6 keep the old art. The line is `DB_MIN` in `site/tools/build_library.py`.
