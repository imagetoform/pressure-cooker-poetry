# ChatGPT brief: make cutouts for Pressure Cooker Poetry's empty families

Paste everything below the line into ChatGPT. Do **one family per chat turn**.

---

You are making collage cutouts for Pressure Cooker Poetry, a punk-literary website. Visitors pick visual fragments they're drawn to, and the site builds a collage page from them. The site already has 76 real cutouts from museum archives. These 20 art families have none or almost none, because their era is still under copyright. **Your job is to make original image files for them.**

## The one rule that matters

**Deliver image files. Not descriptions, not plans, not mood boards, not links, not "here's how you could do it."**
If you can't produce an image, say "I can't make this one" and move on. A text description of an image counts as a failure.

## What a cutout is

- **One fragment per image:** a single object, figure, shape, texture strip or scrap of type. **Not** a finished poster or full scene.
- **Transparent background (PNG).** If you can't do transparency, use a **flat plain white background with nothing else in the frame**. We cut it out on our end.
- **1024 px or larger** on the short side.
- Edges can be clean or **torn-paper / scissor-cut**. Mix both within a family.
- Vary the scale: some big, bold pieces and some small accents.
- It has to **look like it belongs to its art movement** at a glance. Someone who knows design history should recognize the family without being told.

## Don'ts

- No real brand logos, real products, real people or celebrity faces.
- Don't copy any specific artist's known work. Make it in the movement's visual language, not "a Warhol" or "a Haring".
- No hate symbols, including the edgy-punk kind.
- Avoid readable text unless the family is built on type (Punk, Zine, Swiss, Situationism, Constructivism, Dada). When you do use type, keep it to 1–3 short words and **check the spelling**. Garbled AI letters get rejected.
- Satire aims **up** (bosses, landlords, empire, ad culture), never at poor or vulnerable people.

## Each family: 8 cutouts

Make **8** for the family named in the message, then give the sidecar file (below). Start with the first family and wait for "next".

| # | Family id | What it must look like |
|---|---|---|
| 1 | `punk` | Ransom-note cut letters, safety pins, blown-out xerox photo scraps, torn tape, hand-scrawled marker, fluorescent pink/yellow on black |
| 2 | `zine-diy` | Photocopied cut-and-paste, typewriter text strips, staples, glue-stick smear, ballpoint doodles, rubber-stamp borders, halftone dots |
| 3 | `situationism` | Hijacked comic panels (original drawings, not real comics), city-map fragments with drift arrows, plain slogan strips, 1968-style stencil posters, paving stones |
| 4 | `grunge-design` | Distressed and overlapping type, coffee rings, scanner noise, out-of-register print, layered tape and grime |
| 5 | `brutalism` | Raw concrete slabs and towers, board-formed concrete texture, window grids, heavy slab lettering |
| 6 | `minimalism` | One precise form: a lone square, a single line, one colour field, a small object isolated |
| 7 | `swiss` | Grid fragments, bold grotesk numerals, strict rectangular photo crops, black-red-white, rules and dots |
| 8 | `cyberpunk` | Neon sign shapes with abstract glyphs, circuit boards, cables, rain-wet chrome, glitch slices, scanlines |
| 9 | `vaporwave` | Generic classical marble bust, palm trees, checkerboard floor tiles, pink-teal sunset gradients, an unbranded 90s computer window, dolphins |
| 10 | `maximalism` | Dense colliding florals and patterns, stacked gilded frames, layered textiles |
| 11 | `pop-art` | Ben-Day dots, thick-outlined unbranded consumer objects, empty speech bubbles, primary colours |
| 12 | `abstract-expressionism` | Gestural brush strokes, drips and splatter torn into shapes |
| 13 | `op-art` | Black-and-white concentric rings, warped stripes, bulging checkerboards |
| 14 | `memphis` | Squiggles, terrazzo, pastel geometric solids, zigzags, confetti shapes, black-white grids |
| 15 | `afrofuturism` | Cosmic regalia, spacecraft, gold and deep blue, ancestral geometric pattern made with respect (not costume) |
| 16 | `y2k` | Chrome blobs, glossy bubble plastic, translucent candy-coloured gadgets (unbranded), star sparkles, pixel icons, aqua buttons |
| 17 | `art-deco` | Sunbursts, stepped ziggurats, chrome speed lines, fan motifs, geometric figures, gold on black |
| 18 | `dada` | Nonsense collage from printed scraps, machine-body hybrids, random type, rubber stamps |
| 19 | `constructivism` | Red/black diagonals and wedges, a megaphone, generic worker silhouettes, photomontage shapes |
| 20 | `geometric-abstraction` | Hard-edge circles, squares and triangles in flat colour |

## Name the files exactly like this

`<family-id>--<short-slug>.png`, for example `punk--safety-pin-mouth.png`.

## After the 8 images, give the sidecar `cutouts.json`

One code block, one entry per image:

```json
[
  {
    "file": "punk--safety-pin-mouth.png",
    "family": "punk",
    "label": "Safety-pin mouth, xerox scrap",
    "emo": ["rage", "contempt", "joy"],
    "cats": ["absurdity", "concept"],
    "notes": "One line on why these emotions.",
    "made_with": "the image model you used",
    "prompt": "the exact prompt you used"
  }
]
```

- `emo`: 1–3 words, **only** from this list: acceptance, admiration, aggressiveness, amazement, anger, annoyance, anticipation, apprehension, awe, boredom, contempt, disapproval, disgust, distraction, ecstasy, fear, grief, interest, joy, loathing, love, optimism, overwhelm, pensiveness, rage, remorse, sadness, serenity, submission, surprise, terror, trust, vigilance.
- `cats`: 1–2 from: food, object, memory, institution, concept, absurdity.

If you can build a .zip containing the 8 PNGs and `cutouts.json`, do that. If you can't, just give the images and the JSON, and Brandon will save them with the exact filenames.

---

## For Brandon, after each family

1. Drop the zip (or the folder of PNGs + `cutouts.json`) into the Claude chat.
2. Claude runs `tools/cutouts/ingest.py`, shows you a contact sheet, you say keep or kill, and Claude runs `promote.py`.
3. Nothing from ChatGPT reaches the site without passing that look.
