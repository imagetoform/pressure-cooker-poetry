# Cutout coverage audit: PCP_Database_Expansion_v1

Source: `cutout-shopping-list.json` from Drive file `PCP_Database_Expansion_v1.zip` (224 records, all `status: proposed`). Every record was read. No unknown emotion words, no duplicate ids, no duplicate labels.

## The grid that actually exists in this data

The "20 families × 5 layers × 3 intensity bands" grid does not match the file. It has **28 families** and **no layer field**. The intensity bands come from the Plutchik words in `emo`: mild / core / intense (e.g. serenity / joy / ecstasy). So the real grid is **28 families × 8 wedges × 3 bands = 672 cells**, plus 9 blends.

### Wedge × band (tag counts)

| Wedge | Mild | Core | Intense |
|---|---:|---:|---:|
| joy | 14 | 10 | 14 |
| trust | 14 | 18 | 26 |
| fear | 16 | **0** | 14 |
| surprise | 22 | **0** | 28 |
| sadness | 18 | 6 | 10 |
| disgust | 8 | **0** | 8 |
| anger | 16 | **2** | 12 |
| anticipation | 34 | 10 | 26 |
| **Total** | 142 | **46** | 138 |

Blends (tags): optimism 46, awe 45, contempt 44, love 43, aggressiveness 41, remorse 36, disapproval 30, submission 28, overwhelm 24. The blends outnumber the core band about 8 to 1.

## Top 10 gaps for the Curator

1. **Fear, core: 0 cutouts.** A recipe that lands on plain fear has nothing to show.
2. **Surprise, core: 0.**
3. **Disgust, core: 0.**
4. **Anger, core: 2.**
5. **Disgust is the thinnest wedge overall** (16 tags), and is missing entirely from 20 of 28 families.
6. **Sadness, core: 6**, and sadness is missing from 15 families.
7. **The whole core band is underfed:** 46 tags against 142 mild and 138 intense. The set swings between whisper and scream with little in the middle.
8. **Dada and Punk cover only 4 of 24 cells each.** Punk has no fear, sadness or disgust, which is odd for punk.
9. **Every family covers at most 8 of 24 cells.** With 8 cutouts of about 3 tags each, no family can carry its own full range; the renderer will lean on cross-family borrowing.
10. **28 cutouts have no category** (exactly one per family), so they can't be picked by category.

## Systemic warning

The tags look template-generated, not read off artwork. Each category appears exactly 28 times (one per family, or two for object and concept), every family has exactly 8 entries, and 215 of 224 have exactly 3 emotion tags. That's a schedule, not a judgment of pictures. Re-tag each cutout against the real image once it exists, as the package's own handoff says.

## What this audit did not do

- No dartboard simulation: these are tag counts, not landing probabilities.
- No check against the live site's existing pantry or the 18 existing movements (not in the zip).
- `ingredients-new.json` and `movements-new.json` were not audited here.

---

# Ingredients and movements audit

Source: `ingredients-new.json` (300 rows) and `movements-new.json` (10 records) from the same zip. Every row was read and checked against the rules in the zip's own `HANDOFF_FOR_CLAUDE.md`.

## Ingredients: 300, all pass the rules

- **0 rule violations.** Six categories, unique ids and labels, ids match labels, taste codes only `sw so sa bi um sp`, 2–4 nonzero tastes, totals within 8–12.
- **Perfectly even by construction.** Exactly 50 per category and exactly 50 with each dominant taste: a quota, not a pantry that grew.

### Gaps and risks

1. **The intensity range is squeezed.** Every total is 10 or 11 (75 and 225); none uses 8, 9 or 12. No ingredient has 4 tastes. If landing distance on the dartboard follows recipe strength, mild and intense landings will be rarer than the spec intends. The zip's own open question, "is `overwhelm` reachable?", needs a seeded simulation before merging.
2. **Recipes drift sweet.** Each taste dominates exactly 50 ingredients, but sweet carries 24.4% of all taste weight against bitter's 11.1%, because sweet appears most as a secondary taste.
3. **Two satire soft spots** (the rule says target institutional power, not its victims):
   - "the royal order of middle managers" aims at mid-level workers, not power.
   - "the bureaucracy of invisible workers" can read as mocking the workers rather than the system that hides them.

   The other 48 institution labels aim squarely upward. The 50 absurdity labels are playful and harmless.
4. **Not checked:** collisions with the live site's existing pantry, which isn't in the zip.

## Movements: 10, all pass the format checks

Surrealism, Expressionism, Memphis, Zine/DIY, Afrofuturism, Gothic Revival, Ukiyo-e, Situationism, Grunge Design, Y2K. All fields are present, colours are valid hex, and every emotion tag is a real Plutchik word.

### Gaps and risks

1. **Grunge Design conflicts with your own design rules.** Its blurb celebrates "distressed surfaces", and every brief so far bans grunge and distress textures. Decide whether it stays as a history family drawn cleanly, or goes.
2. **Blend gaps.** No new movement carries love, submission, disapproval, remorse or overwhelm (the zip's coverage report says the same). Visitors landing there get only borrowed movements.
3. **3 of 10 have no texture** (`null`). Fine if "none" is allowed by `DATABASE_SPEC.md`, which isn't in the zip; otherwise fill them.
4. **Layouts lean on "reliquary"** (3 of 10).
5. **History blurbs** match what I know: Breton's 1924 manifesto, Die Brücke and Der Blaue Reiter, Sottsass and Memphis in 1981, Mark Dery naming Afrofuturism in 1994, the Situationist International 1957–1972. I didn't consult sources, so verify them before publishing, as the zip itself advises.

---

# Dartboard simulation

Spec: `pcp-dartboard-system.md` (Drive). Script: `/root/tasks/pressure-cooker-poetry/dartboard-sim/sim.py` (rerunnable, about 30 s). 100,000 random recipes of 3–7 ingredients per setting, about 528,000 darts, test pantry spread evenly over all 20 families × 10 intensities with random noise/order. Where the spec doesn't say (hash function, random generator, exact noise/order formula), the script states its choice at the top.

## First: the expansion zip can't be thrown at this board

The dartboard needs every ingredient to carry `family` 0–19, `intensity` 1–10 and `heat/order/noise/weight`. The 300 ingredients in `PCP_Database_Expansion_v1` carry taste strings and Plutchik emotions instead. The 224 cutouts have no `layer` and no family number, and the zip's 28 "movements" are not the dartboard's 20 families. Two different specs are in play: `DATABASE_SPEC.md` (tastes, Plutchik wheel, 28 movements) and the dartboard (20 taste-emotion families, 5 layers). **Pick one before anyone tags more assets.** This simulation tests the dartboard engine itself.

## Results

| | Spec, wobble ±3 | Spec, wobble ±6 | Fix, ±3 | Fix, ±6 |
|---|---:|---:|---:|---:|
| Dart slips into a neighbouring family | 15.3% | 29.7% | 10.7% | 11.5% |
| **Whisper ingredient lands as a scream** | **23.3%** | **30.6%** | 0.6% | 7.4% |
| **Scream ingredient lands as a whisper** | **21.2%** | **30.6%** | 0.4% | 6.5% |
| Bitter Grief ↔ Spice Ecstasy wraparound | 0.8% | 1.5% | 0.5% | 0.6% |
| Landing bands (mild / middle / intense) | 29 / 41 / 31% | 29 / 41 / 30% | 30 / 40 / 30% | 33 / 32 / 34% |
| Short recipes: motion and grit stay in the bodies' family | 69% | 42% | 72% | 69% |
| Non-reproducible rooms | 0 | 0 | 0 | 0 |

## What it means

1. **The spec flips quiet into loud at every wedge edge.** A dart aimed at intensity 1 that wobbles down by even one point lands at intensity 10 of the neighbouring family. So nearly a quarter of whisper ingredients arrive screaming, and a fifth of screams arrive whispering. A gentle Honey Tenderness ingredient can land as a maximum-volume Brine Longing. That isn't "surprising family combinations"; it breaks the promise that intensity means something.
   **Fix (tested in the right-hand columns):** let wobble move intensity *within* the wedge (clamped 1–10), and decide a family slip separately, keeping the intensity. Flips drop from 23% to under 1% at ±3, and cross-family surprises still happen about 11% of the time.
2. **±3 vs ±6 (your open question).** As written, ±6 doubles the family slips (30%) but also makes the flip problem worse. With the fix, ±6 widens how far intensity moves without many more family slips. Recommendation: **the fix with ±3**, raised to ±6 only if rooms feel too predictable.
3. **The wraparound joins Grief to Ecstasy.** Mod 200 makes Bitter Grief (0) and Spice Ecstasy (19) neighbours. It's rare (under 1%), but decide whether it's intentional. It's poetic, or it's a bug.
4. **Short recipes are samey.** In 3-ingredient recipes, the rethrown motion and grit darts land in the bodies' family about 70% of the time, so short recipes come out more uniform than long ones. If that's not wanted, use the spec's other option: a house default for those layers.
5. **Even and reproducible.** Every family gets 4.8–5.3% of landings, and no recipe ever produced two different rooms. The middle band naturally gets about 40%, because it's 4 points wide against 3 for mild and intense.
