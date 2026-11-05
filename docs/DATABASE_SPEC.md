# Pressure Cooker Poetry: Database Spec

How the site's database is organized, and how the emotion wheel (the dartboard) picks what goes into each room. Hand this whole file to whoever (or whatever) builds out the full database. Section 9 is a prompt you can paste as-is.

---

## 1. The rules that never bend

1. **Visitors only choose ingredients.** Everything else (dials, flavor bars, pressure odds, the dartboard, seeds) is hidden test machinery.
2. **The pantry is absurdly big on purpose.** The overwhelming amount of choice is satire of late capitalism's fake abundance.
3. **Satire aims up.** Jokes target the powerful (landlords, CEOs, billionaires, lobbyists, institutions), never the people underneath them.
4. **Cutouts and styles carry emotion words, never numbers.** The wheel's geometry decides how close one emotion is to another.
5. **Same recipe, same room.** Every choice is deterministic: the same pot always throws the same darts and builds the same room.
6. **The writing is never edited.** Rooms change around the poem; the words don't.

---

## 2. The pieces and how they connect

```
INGREDIENT (has 6 tastes, 0–10)
   │  each ingredient in the pot = one DART
   ▼
DARTBOARD (Plutchik's emotion wheel)
   │  the tastes aim the dart; it lands on an emotion word
   ▼
LANDING SPOTS (emotion words)
   │  compared, by distance on the wheel, to the emotion tags on…
   ▼
CUTOUTS (emotion tags)  +  MOVEMENTS / design families (emotion tags)
   │                         │
   ▼                         ▼
images placed in the room    style layer, layout grammar, motion, button skin
```

The database has three tables you'll be filling: **ingredients**, **cutouts**, **movements** (design families). Poems already exist and aren't part of this job.

---

## 3. The dartboard

### 3.1 Layout

Eight wedges go clockwise from the top. Angles are in degrees: 0 is the top, and the angle increases clockwise.

| Wedge | Angle | Intense ring (center) | Core ring | Mild ring (edge) |
|---|---|---|---|---|
| joy | 0 | ecstasy | joy | serenity |
| trust | 45 | admiration | trust | acceptance |
| fear | 90 | terror | fear | apprehension |
| surprise | 135 | amazement | surprise | distraction |
| sadness | 180 | grief | sadness | pensiveness |
| disgust | 225 | loathing | disgust | boredom |
| anger | 270 | rage | anger | annoyance |
| anticipation | 315 | vigilance | anticipation | interest |

**Blends** sit in the seams between neighboring wedges:

| Blend | Between | Angle |
|---|---|---|
| love | joy + trust | 22.5 |
| submission | trust + fear | 67.5 |
| awe | fear + surprise | 112.5 |
| disapproval | surprise + sadness | 157.5 |
| remorse | sadness + disgust | 202.5 |
| contempt | disgust + anger | 247.5 |
| aggressiveness | anger + anticipation | 292.5 |
| optimism | anticipation + joy | 337.5 |

**Bullseye:** `overwhelm`. Only the whole pot can hit it (see 4.3).

### 3.2 Distances

The board is a circle of radius 1.

| Zone | Radius from center | Where its tag point sits |
|---|---|---|
| bullseye | 0 – 0.10 | center |
| intense ring | 0.10 – 0.42 | r = 0.26 |
| core ring | 0.42 – 0.72 | r = 0.57 |
| mild ring | 0.72 – 1.00 | r = 0.86 |
| blends | (drawn outside, 1.0–1.2) | their seam angle, r = 0.86 |

A wedge's own name (e.g. `anger`) sits on the core ring.

### 3.3 The complete tag vocabulary (33 words)

```
ecstasy joy serenity
admiration trust acceptance
terror fear apprehension
amazement surprise distraction
grief sadness pensiveness
loathing disgust boredom
rage anger annoyance
vigilance anticipation interest
love submission awe disapproval remorse contempt aggressiveness optimism
overwhelm
```

**Loose aliases** are accepted and mapped automatically: happiness→joy, calm/peace→serenity, hope→optimism, dread/anxiety→apprehension, panic→terror, shock→amazement, wonder→awe, sorrow→sadness, melancholy/nostalgia→pensiveness, revulsion→loathing, fury→rage, irritation→annoyance, defiance→aggressiveness, resolve→vigilance, curiosity→interest, tenderness→love, devotion→admiration, obedience→submission, scorn→contempt, regret/guilt→remorse, chaos→overwhelm.

**Use only these words.** Any other word is ignored.

---

## 4. Darts: how ingredients land

### 4.1 Which way each taste pulls

| Taste | Aims at | Angle |
|---|---|---|
| sweet | joy | 0 |
| umami | trust | 45 |
| sour | between fear and surprise | 125 |
| bitter | sadness, leaning toward disgust | 200 |
| spicy | anger, leaning toward anticipation | 285 |
| salty | anticipation, leaning toward joy | 330 |

### 4.2 The throw

For one ingredient:

1. Add up each taste as an arrow pointing at its angle, with the taste's value as the arrow's length.
2. **Angle** of the dart = the direction of the summed arrow.
3. **Focus** = length of the summed arrow ÷ total of all taste values. A focus of 1 means one clear taste; a focus near 0 means the tastes cancel out.
4. **Radius** = `1.25 − focus − 0.3 × (min(1.2, total ÷ 10) − 0.9)`
5. A seeded wobble makes it a throw: angle ±9°, radius ±0.05. The radius is then clamped to 0.14–0.98.
6. Read the landing spot:
   - wedge = the nearest wedge angle
   - ring = intense if r < 0.42, core if r < 0.72, otherwise mild
   - tag = that ring's word
   - if the dart is more than 12° off the wedge's center line and not in the intense ring, the neighboring **blend** is added as a second tag

What that means for writing tastes:

- **One strong taste** (e.g. bitter 9) flies to the center, giving grief, rage or ecstasy.
- **Two related tastes** land in the core ring.
- **Three or more tastes pulling different ways** land at the edge (pensiveness, annoyance, interest).

### 4.3 The bullseye and the empty pot

- **Overwhelm:** if the pot has 3 darts, they're in 3 different wedges, and two of them are at least 135° apart, the pot throws a 4th dart into the bullseye tagged `overwhelm`. Only cutouts and movements tagged `overwhelm` match that dart.
- **Empty pot:** throws one "house stock" dart from the default flavor.

---

## 5. Selection: how cutouts and styles get picked

### 5.1 Closeness

For one dart and one tagged item:

```
closeness = max over the item's tags of  e^( −distance(dart, tag point) / 0.16 )
```

The distance is measured on the board (section 3.2). A tag right where the dart landed scores about 1. A neighboring wedge's intense word scores about 0.3. The opposite side of the wheel scores about 0.

### 5.2 Cutouts

- Each room places `round(1 + 7 × density)` cutouts, roughly 1 to 8.
- A cutout's weight = `(sum of closeness over all darts)³ + 0.5 × category bonus + 0.004`. The category bonus is 0.15 per category it shares with an ingredient in the pot.
- Cutouts with no emotion tags get a tiny fixed weight, so they almost never show up.
- Picks are made one at a time by seeded weighted chance, without repeats.
- **Consequence:** the more cutouts there are near every part of the wheel, the sharper rooms get. A thin library makes every room look alike.

### 5.3 Movements (styles)

- Weight = `(sum of closeness)⁴`.
- **The primary movement is the closest one**, and it wins outright.
- A **secondary** movement from a different branch is added, by weighted chance, when the darts land in more than one wedge, plus 25% of the time otherwise.
- If the primary has a `layout`, the room is built in that layout grammar, unless a layout was forced in lab mode.

---

## 6. Table: ingredients

```js
{ id: "insulin-patent", text: "the patent on insulin", cat: "institution",
  t: { sweet: 0, sour: 1, salty: 0, bitter: 9, umami: 0, spicy: 0 } }
```

Compact form, as used in `site/src/pantry-plus.js`:

```js
["insulin-patent", "the patent on insulin", "institution", "bi9 so1"]
// sw sweet · so sour · sa salty · bi bitter · um umami · sp spicy
```

| Field | Rule |
|---|---|
| `id` | lowercase-hyphen slug, unique, never reused |
| `text` | what the tile says; short, concrete, funny or aching; lowercase except proper nouns |
| `cat` | one of `food`, `object`, `memory`, `institution`, `concept`, `absurdity` |
| `t` | 2–4 tastes, whole numbers 1–10; leave the rest out (or 0) |

**How to taste an ingredient** (what each taste does to the room):

| Taste | Feels like | Room effect |
|---|---|---|
| sweet | closeness, comfort, love, nostalgia (and fake sweetness from the powerful) | softer, wider margins, slower |
| sour | sharp, awake, surprising, wrong-footed | crisp, quick, jumpy |
| salty | order, plain speech, labor, endurance | steady grid, clean columns |
| bitter | grief, distance, injustice, bureaucratic cruelty | colder, crowded, noisy |
| umami | depth, home, solidarity, the body | dense, grounded, close |
| spicy | heat, anger, revolt, noise | bigger type, faster, more collision |

**Write for spread across the whole wheel.** In each batch of 100:

- About 25 should have one dominant taste of 8–10 (these land in the center).
- About 50 should have two tastes that agree.
- About 25 should be muddled, with three or more tastes pulling different ways (these land at the edge).

Keep the total of an ingredient's tastes around 8–12. Cover all six tastes as the dominant one. Bitter shouldn't swallow the pantry just because the satire is sharp.

---

## 7. Table: cutouts

```js
{ id: "red-fist", src: "assets/cutouts/red-fist.png", fallback: "torn",
  label: "raised red fist", family: "constructivism",
  emo: ["rage", "aggressiveness", "vigilance"], cats: ["concept"],
  source: "pulp magazine scan, 1952, archive.org item xyz", notes: "" }
```

| Field | Rule |
|---|---|
| `id` | slug, unique; usually the filename without its extension |
| `src` | `assets/cutouts/<file>` (transparent PNG or SVG) |
| `fallback` | the stand-in drawing if the file is missing; one of `halftone torn wedge arrow target burst bars ember crow eye stamp scribble gear loaf` |
| `label` | plain description of what the image is |
| `family` | the movement id it belongs to (section 8), or `""` if shared |
| `emo` | **2–4 words from the 33-word vocabulary. No numbers.** |
| `cats` | 0–3 of the six ingredient categories (gives a small boost when they match the pot) |
| `source` | where it came from (scan, collection, original drawing). Keeps the archive honest. |
| `notes` | optional |

**How to tag a cutout:**

1. Ask what the image *feels* like, not what it shows: a smokestack can be `contempt` (industry) or `pensiveness` (an old town).
2. Use 2–4 tags, and mix rings: one strong word plus one or two softer or blended ones is best, e.g. `["grief", "pensiveness", "remorse"]`.
3. Tag the feeling the image delivers, even when it's ironic. An infomercial's fake joy is `["ecstasy", "contempt", "overwhelm"]`.
4. Save `overwhelm` for images that are genuinely too much: crowds, collages, sale signs, noise.
5. **Coverage target:** at least 6 cutouts touching each of the 8 wedges, and at least 2 per blend, before the library is "full." Fill the gaps first.

Files live in `library/families/<branch>/<movement>/cutouts/`, or in `library/cutouts/inbox/` if they're shared or untagged. The lab tagger (`?lab=1#/lab`) can do the tagging by tapping the wheel and outputs these records.

---

## 8. Table: movements (design families)

Each movement is a whole kit: its emotion tags, its layout grammar, its motion, its button skin and its own cutouts.

```js
{ id: "constructivism", branch: "revolt", name: "Constructivism",
  layout: "manifesto", motion: "thrust", texture: null,
  emo: ["anticipation", "aggressiveness", "admiration"],
  colors: ["#c4161c", "#111111", "#e8dcc4"],
  blurb: "1917–1930s. Art for the revolution: red wedges, diagonals, the poster as a tool." }
```

| Field | Rule |
|---|---|
| `id` | slug |
| `branch` | one of `ornament`, `order`, `revolt`, `future`, `excess`, `abstract`, or a new branch if one is needed |
| `layout` | one of the six layout grammars (`manifesto`, `cutup`, `xerox`, `ledger`, `whisper`, `reliquary`), or `null` to let the pressure pick |
| `motion` | `grow rise melt fade slide spin drop thrust jitter speed flicker float pulse pop smear turn` |
| `texture` | `grid concrete toner scan dots benday` or `null` (always shown only as a frame around the room's edges) |
| `emo` | 3 words from the vocabulary |
| `colors` | 2–5 hex colors |
| `blurb` | one or two sentences, historically accurate, with dates; honest about a movement's politics (e.g. Futurism's love of war) |

**The 28 movements in the tree** (10 added Nov 4 2026):

| Branch | Movements |
|---|---|
| ornament | Art Nouveau, Art Deco, Psychedelia, Gothic Revival, Ukiyo-e |
| order | Minimalism, Swiss/International (`swiss`), Bauhaus, Brutalism |
| revolt | Constructivism, Dada, Punk, Zine/DIY, Situationism, Grunge Design |
| future | Futurism, Cyberpunk, Vaporwave, Afrofuturism, Y2K |
| excess | Maximalism, Pop Art, Memphis |
| abstract | Abstract Expressionism, Geometric Abstraction, Op Art, Surrealism, Expressionism |

Still unused, if the wheel needs them: Swiss Punk, Socialist Realism (as propaganda to study).

**The six layout grammars** (already built):

| Grammar | Feel |
|---|---|
| manifesto | Constructivist broadsheet; diagonal force, slab words |
| cutup | Dada ransom note; every line on its own torn strip |
| xerox | punk zine; toner, tape, highlighter, two columns |
| ledger | bureaucratic form; the poem filed as a grievance |
| whisper | restrained broadside; almost all negative space |
| reliquary | leaded-glass icon; flat jewel cells, heavy outlines |

---

## 9. Prompt to paste into ChatGPT

> You are building the database for Pressure Cooker Poetry, a generative poetry site. Read the attached spec (DATABASE_SPEC.md) completely before writing anything, and follow it exactly.
>
> Produce, in this order, in separate code blocks:
>
> 1. **Ingredients:** 300 new rows in the compact form `["id", "text", "cat", "taste string"]`. Follow section 6: the satire aims up, 2–4 tastes, totals of 8–12, a 25/50/25 split of dominant, agreeing and muddled, and all six tastes used as the dominant one. Mix real working-class food, objects, memories, institutions (aimed at the powerful), concepts and absurdities. No duplicates of these existing ids: [paste the current id list].
> 2. **Movements:** 10 new movements in the section 8 shape, chosen to fill the parts of the wheel the current 18 cover least. Blurbs must be historically accurate.
> 3. **Cutout shopping list:** for each of the 28 movements, 8 described cutouts I should find or make, each with a suggested filename, label, `emo` tags (2–4 words from the 33-word vocabulary only) and `cats`. Make sure the whole list meets the coverage target in section 7. Where possible, suggest public-domain sources (Internet Archive magazine scans, Library of Congress Free to Use, Smithsonian Open Access, Public Domain Review).
>
> Rules: use only the 33 emotion words (or the listed aliases). Put no numbers on cutouts or movements. Use valid JS syntax. After each block, print a coverage table showing how many items touch each of the 8 wedges and the 8 blends, so gaps are visible.

---

## 10. Checklist before anything goes into the site

- [ ] Every `emo` word is in the 33-word vocabulary or the alias list
- [ ] No numbers on any cutout or movement
- [ ] Ingredient tastes are whole numbers 1–10, 2–4 per ingredient, totals around 8–12
- [ ] Each ingredient was **tasted for what it means**, one at a time. Tastes handed out by a pattern or by row number fail this check even when every number is legal.
- [ ] Every id is unique, with no clashes with the existing pantry
- [ ] Coverage: at least 6 cutouts per wedge and at least 2 per blend
- [ ] Movement blurbs are accurate (dates, makers, politics)
- [ ] Satire aims up throughout
- [ ] Image files exist at the `src` paths (missing ones fall back to the stand-in drawing, so they won't break, but they won't show either)

Bring the output back here and it can be checked against this list automatically before it goes live.
