# Muse: fill every family with real cutouts

**Mission:** every one of the 30 families gets **at least 8 real cutout image files** in the database, each one looked at, tagged and recorded. About 158 new cutouts in total.

Follow these steps in order. Don't skip ahead, and don't start a family until the one before it is done.

---

## Step 0: Make sure the tools exist

The cutout tools were written in a Claude session and may not be on `main` yet.

```sh
git fetch origin
git ls-tree -r --name-only origin/main | grep -c '^tools/cutouts/ingest.py$'
```

- **If that prints `1`:** branch from `main` and go to Step 1.
- **If it prints `0`:** Brandon will give you `pcp-docs-canon.bundle`. Run this, then branch from `docs/canon` instead of `main`:
  ```sh
  git fetch /path/to/pcp-docs-canon.bundle docs/canon:docs/canon
  git push origin docs/canon
  ```
  If you can't push either, stop and tell Brandon. Don't rebuild the tools yourself.

## Step 1: Read, in this order

1. `docs/CANON.md`: what's live, decided, open, parked and dead. **It wins over every other document, including this one.**
2. `AGENTS.md`: how to work here. Read its section "How agents have failed here" twice.
3. `library/cutouts/README.md`: the cutout workflow.
4. `docs/handoffs/AI_CUTOUT_BRIEF.md`: what each family must look like.

## Step 2: The rules

1. **A cutout is an image file.** Not a description, a plan, a link, a prompt, a mood board or a placeholder SVG. If you can't make or get the file, write "couldn't make this one" and move on.
2. **One piece per image.** A single object, figure, shape, texture strip or scrap of type, on a transparent background. Never a finished poster or full scene. Never several pieces packed on one sheet.
3. **Look at every image before it goes in.** Open it. Reject cuts that are ghosted, fragmented, carry slivers of other pieces, have garbled letters, or don't read as their family at a glance.
4. **Tag one image at a time, for what it shows.** Never tag in rotation or by pattern. Use 1–3 words from the emotion wheel (the `vocabulary` list in `library/catalog.json`) and 1–2 categories (food, object, memory, institution, concept, absurdity).
5. **Every source must be one you actually opened.** Never write a URL, licence, creator or date from memory.
6. **Copy family ids exactly** from the table below. `swiss`, not `swiss-international`.
7. **Never say it's done, pushed or live unless you just checked.** "I committed it" means `git log` shows it. "I pushed it" means `git ls-remote` shows it.
8. **Don't touch** poems, essays, the engine, `site/visual/`, `docs/CANON.md`'s decisions, or any family that's already at 8. Only add cutouts.

## Step 3: Where cutouts may come from

Use these sources in this order. Record which one in the delivery file.

| Source | Use for | How |
|---|---|---|
| **A. Museum open access (CC0)** | Anything with real pre-1931 material | `python3 tools/cutouts/harvest.py <family> 9 --source met\|cma [--mode ink] "artist:Name" ...`. Use `--mode ink` for prints on paper. Check every result: name searches catch the wrong artists. |
| **B. Your own library** | Fragments you already hold | Only if you know where each came from. Write that source in `notes`. Brandon's collage rules (CANON D-15): fragments yes, whole works no, nothing sold, no litigious megacorps (Disney etc.). If you don't know the source, don't use it. |
| **C. Original images you make** | Post-1930 families (most of the empty ones) | Make them in the movement's visual language, following `AI_CUTOUT_BRIEF.md`. No copies of a specific artist's known work, no real logos, no real people. |

## Step 4: Work one family at a time

Order: `zine-diy`, `situationism`, `grunge-design`, `brutalism`, `swiss`, `minimalism`, `constructivism`, `dada`, `art-deco`, `pop-art`, `op-art`, `memphis`, `abstract-expressionism`, `maximalism`, `cyberpunk`, `vaporwave`, `y2k`, `afrofuturism`, `geometric-abstraction`, then top up `psychedelia`, `bauhaus`, `surrealism`, `ukiyo-e`, `art-nouveau`, `futurism`.

| Family id | Has now | Needs |
|---|---|---|
| zine-diy, situationism, grunge-design, brutalism, swiss, minimalism, pop-art, op-art, memphis, abstract-expressionism, maximalism, cyberpunk, vaporwave, y2k, afrofuturism | 0 | 8 each |
| constructivism, art-deco | 2 | 6 each |
| geometric-abstraction | 1 | 7 |
| dada | 3 | 5 |
| psychedelia | 4 | 4 |
| bauhaus, surrealism | 5 | 3 each |
| ukiyo-e | 6 | 2 |
| art-nouveau, futurism | 7 | 1 each |
| punk, expressionism, rococo, gothic-revival, mexican-muralism | 8+ | done, don't touch |

**Delivered so far (2026-11-17):** minimalism, memphis, brutalism, grunge-design, situationism are done (8+ each). Your tag-file format is fine: Claude maps it.

**Recount before you start** (`library/cutouts/manifest.json`). If the numbers differ from this table, trust the manifest.

### For each family

1. Branch: `cutouts/muse-<family-id>`.
2. Get **at least 10 candidates**, so you can reject a few and still reach 8.
   - Museum (A): `harvest.py` puts them straight into `candidates.json`.
   - Library or originals (B, C): put the PNGs in one folder named `<family-id>--<short-slug>.png`, plus a `cutouts.json` in the format shown in `AI_CUTOUT_BRIEF.md`. Then:
     ```sh
     python3 tools/cutouts/ingest.py <folder> --source ai      # or --source brandon / scan for his material
     python3 tools/cutouts/clean_edges.py <png>   # ONLY if the piece was cropped from a multi-piece sheet; never on confetti/dots/splats
     ```
3. **Look:** `python3 tools/cutouts/contact_sheet.py tmp/<family>.png <family-id>`. Open the image and judge every piece.
4. Write `tmp/decide-<family>.json`: keep with tags, or reject with a reason, for **every** candidate. Then `python3 tools/cutouts/promote.py tmp/decide-<family>.json`.
5. **Check:**
   ```sh
   python3 -c "import json,collections;m=json.load(open('library/cutouts/manifest.json'));print(collections.Counter(x['family'] for x in m)['<family-id>'])"   # must be >= 8
   python3 site/tools/build.py && python3 site/tools/assemble.py
   python3 site/tools/build.py && git diff --exit-code -- site/dist          # build must be stable
   python3 -m http.server 8765 --directory site/public & node site/tests/visual-flow.cjs
   ```
6. Commit (library files, the `.webp` copies, `site/dist/`, `candidates.json`, `manifest.json`). Add an entry at the top of `docs/logbook.md`: family, how many kept and rejected, which sources, anything odd.
7. Open **one PR per family** titled `Cutouts: <family-id> (+N)`. Attach the contact sheet image. List what you rejected and why. **Don't merge it.** Brandon reviews every family (CANON D-27).
8. Only then start the next family.

## Step 5: If you can't run code or can't push

Do steps 2–4 on your side and send Brandon, **per family**, a zip containing:
- the PNGs, one piece each, transparent, at least 1024 px, named `<family-id>--<slug>.png`
- `cutouts.json` (format in `AI_CUTOUT_BRIEF.md`), with `made_with` and, for A or B, the real source URL in `notes`

He'll hand it to Claude for the ingest.

## When to stop and ask Brandon

- A family's look is unclear to you, or you think a piece belongs to a different family
- You're unsure whether a source is OK to use
- Anything would change something a visitor sees, other than adding cutouts
- You find a conflict between this file and `docs/CANON.md` (the canon wins, but tell him)

## Definition of done (whole mission)

- [ ] Every one of the 30 families has at least 8 cutouts in `manifest.json`
- [ ] Every cutout has a real file, a web copy (`.webp`), 1–3 wheel emotions, a source and a licence line
- [ ] Every candidate in `candidates.json` is `kept`, `rejected` (with a reason) or `replaced`. None left as `candidate`
- [ ] One PR per family, each with its contact sheet, none merged by you
- [ ] `docs/logbook.md` has an entry per family
