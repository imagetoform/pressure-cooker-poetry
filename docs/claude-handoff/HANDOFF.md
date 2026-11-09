# Pressure Cooker Poetry: Handoff

For any agent (Claude, Gemini, ChatGPT, Muse) picking up this project. Read it all before acting.

**Owner:** Brandon Rhodes, poet, painter and founder. He makes every creative and publishing decision.
**Site:** pressurecookerpoetry.com. The live site is **not** to be changed until a new version is tested and Brandon approves it.

---

## 1. Rules that never bend

1. **The writing is never altered.** Words, punctuation and line breaks are shown exactly as written. Fragments are fine only if the whole poem is one step away. Never generate, paraphrase or remix text and present it as his.
2. **The manuscripts are private.** The full text of *The Arsonist's Gospels* (27 poems) and *The Genealogy of Stardust* (29 poems) is unpublished. Never paste it into a prompt for an outside model, never commit it to a public repo. Build and test with the 5-excerpt sample.
3. **Same recipe, same room.** All variation comes from a seed hashed from the visitor's choices. No uncontrolled randomness.
4. **Readable at every intensity.** Loud is fine; unusable isn't. Accessible, keyboard-friendly, honors reduced motion, works on desktop and phone.
5. **No new visitor-facing controls** without Brandon's approval.
6. **Satire punches up** at institutions and the powerful, never down at their victims or workers.
7. **Collage as sampling:** fragments, not whole works; record source and rights; avoid litigious megacorps.
8. **Visual bans** from earlier briefs: no beige or cream grounds, no blog-template or SaaS minimalism, no grunge or distress overlays, no rounded-card grids, no soft gradients.
9. **No live AI on the site** under the dartboard spec ("no API key or live AI calls"). One exception exists and needs Brandon's ruling (see section 5, The Unauthorized Thing).

---

## 2. Where things live

### GitHub: `imagetoform/pressure-cooker-poetry` (public). Prototypes in `prototypes/`, these notes in `docs/claude-handoff/`. The live site source is `site/`, and the live engine's spec is `docs/DATABASE_SPEC.md`. (An older copy of the prototypes remains on `imagetoform/AF`, branch `claude/pressure-cooker-poetry-design-hdk1w3`.)

| File | What it is |
|---|---|
| `prototypes/commission-unauthorized.html` | **The Unauthorized Thing**, winner of the "Begin Again" commission. The current lead prototype. |
| `prototypes/commission-resonance.html` | Sound Makes Form (runner-up): a Chladni sand plate tuned to each poem's frequency. |
| `prototypes/commission-core.html` | Core Sample (runner-up): poems as rock strata, drilled into a personal core. |
| `prototypes/forme.html` | THE FORME: an earlier letterpress-lockup prototype. |
| `prototypes/index.html` | The reader edition: the earliest prototype (typing reader, follow-a-word). |
| `prototypes/build.py` | `python3 build.py <page>.html` inlines the private corpus and writes `dist/<page>.html`. |
| `prototypes/corpus/corpus.sample.txt` | Public sample: 5 short excerpts. |

**Not in the repo, on purpose:** `prototypes/corpus/corpus.txt` (the full manuscript, gitignored) and `prototypes/dist/` (builds containing it). The full text also lives in Brandon's Google Drive as `arsonist_gospels` and `Genealogy Of Stardust by: Brandon Rhodes`.

**Corpus format:**
```
=BOOK id | Title | after ...
=MOVE I | Movement title
=POEM 1 | Poem title            (add "| excerpt" for partial text)
lines; a blank line separates stanzas; a line holding only * is a section break
```

### Private previews (claude.ai, visible only to Brandon until he shares them)

| Prototype | Link |
|---|---|
| The Unauthorized Thing (v2, with undo and doodle matching) | https://claude.ai/artifact/Mj2bvbuq51RzBtQZXmKs3E |
| THE FORME | https://claude.ai/artifact/UcZj7ECtkbjHDesHNS15SJ |

### Google Drive

| File | Contents |
|---|---|
| `pcp-dartboard-system.md` | The dartboard engine spec (section 3) |
| `PCP_Database_Expansion_v1.zip` | 300 ingredients, 10 movements, 224 cutout proposals. Several identical copies. |
| `pcp-gem-curator.md` | Instructions for the Gemini "Pantry Raider" curator |
| `pressure-cooker-cutout-library.zip` | 61-cutout image library; rights audit still pending |
| `Pressure Cooker Poetry — AI Design Handoff & Decision Log` | Earlier Nova/Gemini log |

### Working records (Claude's container)

`/root/tasks/pressure-cooker-poetry/`: `LOGBOOK.md` (full session history), `cutout-coverage-audit.md` (all audits and the simulation), `dartboard-sim/sim.py`, and `muse-fusion-brief.md`.

---

## 3. The lead prototype: The Unauthorized Thing

**The idea:** a cold, empty wall says *Make a mark. Any mark. Nothing here is graded.* The visitor paints a stroke, and the page reads how the hand moved (slow, quick, rising, looping, broken…). Brandon's poems answer with an exact run of 1–4 lines, each opening into the whole poem. As the visitor keeps making, the room warms from cool blue-grey to umber, after "the cooling of the room" / "the warming" in *First Mark* and *The Duende*. The visitor keeps "your wall": their painting plus the lines that answered them, stored only in their browser. It's *The Arsonist's Gospels* made participatory: the visitor makes the unauthorized thing first, and the writing comes to meet the hand.

**Added at Brandon's request (v2):**
- **Undo:** a button and Ctrl/Cmd+Z, which remove the last mark and its answer.
- **Doodle matching:** after the hand rests, only the drawing (a 384px PNG) goes to Claude through the claude.ai `sample` capability, which guesses what it depicts plus associations. The page then matches an exact passage locally by meaning (a fork → the tuning fork in *Origin*). Poem text is never sent. Viewers who decline get the gesture reading.

**Verified:**
- Desktop and phone render with no errors and no horizontal scroll; touch drawing works.
- All 56 poems match the source exactly (the studio's automated check).
- Undo works.
- Matching works with a stand-in for Claude.

**Not verified:** the real Claude `sample` path (it only runs inside claude.ai), the optional sound, Safari, a real phone.

**Open question for Brandon:** doodle matching calls Claude live, which conflicts with the dartboard spec's "no live AI calls on the site". Keep it as a claude.ai-only feature, cut it, or replace it with an offline shape recognizer.

---

## 4. Two specs are in conflict (resolve before any more tagging)

| | Dartboard (`pcp-dartboard-system.md`) | `DATABASE_SPEC.md` (used by the expansion zip) |
|---|---|---|
| Families | **20** taste-emotion families (0 Bitter Grief … 19 Spice Ecstasy) | **28** art movements (Art Nouveau … Y2K) |
| Ingredients carry | `family` 0–19, `intensity` 1–10, `heat/order/noise/weight` 0–10 | taste strings (`sw so sa bi um sp`) + Plutchik emotions |
| Assets carry | `layer` (ground, voice, bodies, motion, grit), `family`, `intensity`, stats | `family` (movement), `emo` words, `cats` |
| Engine | each ingredient throws its own dart; one dart per layer | hidden taste and emotion dartboard (exact rules not in hand) |

The expansion zip's 300 ingredients, 10 movements and 224 cutouts **cannot be thrown at the dartboard as-is**. Brandon must choose one spec, or define a mapping between them.

---

## 5. The dartboard engine, and what the simulation found

**Spec, in brief:**
- The board runs 0–199. Family = `floor(score/10)`; intensity = `(score mod 10)+1`.
- `aim = family×10 + (intensity−1)`, plus a seeded wobble of −3..+3 (high noise widens it, high order narrows it), then wrap mod 200.
- Darts in recipe order: 1 Ground, 2 Voice, 3 Bodies, 4 Motion, 5+ Grit. In a 3-ingredient recipe, darts 4–5 are rethrown near dart 3.
- Asset pick: assets of that family and layer, weighted by closeness of intensity.
- Coverage target: 20 families × 5 layers × 3 bands (mild 1–3, middle 4–7, intense 8–10). Minimum 2 per cell (600 assets); healthy is 5 (1,500).

**Simulation:** `dartboard-sim/sim.py`, 100,000 random recipes per setting, test pantry spread evenly. The spec doesn't name a hash, random generator or noise/order formula, so the script's own choices are stated at its top.

| | Spec ±3 | Spec ±6 | Fix ±3 | Fix ±6 |
|---|---:|---:|---:|---:|
| Slips into a neighbouring family | 15% | 30% | 11% | 12% |
| **Whisper lands as a scream** | **23%** | **31%** | 0.6% | 7% |
| **Scream lands as a whisper** | **21%** | **31%** | 0.4% | 7% |
| Non-reproducible rooms | 0 | 0 | 0 | 0 |

**Bug:** at a wedge edge, a one-point wobble jumps from intensity 1 to the neighbour's intensity 10, so intensity loses its meaning.
**Proposed fix:** the wobble moves intensity *within* the wedge (clamped 1–10), and a family slip is decided separately, keeping the intensity. **Recommendation:** the fix with ±3.

**Other findings:**
- Families get an even share (about 5% each).
- Bitter Grief and Spice Ecstasy are neighbours because of the wraparound. Under 1% of darts cross; decide whether that's intended.
- In 3-ingredient recipes, Motion and Grit land in the Bodies' family about 70% of the time, so short recipes look samey.

---

## 6. Audit of `PCP_Database_Expansion_v1`

All records pass the format rules. The problems are balance:

- **Cutouts (224):**
  - The core intensity band is nearly empty: fear, surprise and disgust core = 0, anger core = 2 (core 46 vs mild 142, intense 138).
  - Disgust is missing in 20 of 28 families.
  - 28 cutouts have no category.
  - The tags look template-generated; re-tag each against the real image.
- **Ingredients (300):**
  - Totals are only 10 or 11, never 8, 9 or 12, so the intensity range is squeezed.
  - Recipes drift sweet: sweet carries 24% of taste weight, bitter 11%.
  - Two satire soft spots: "the royal order of middle managers" and "the bureaucracy of invisible workers".
- **Movements (10):**
  - The Grunge Design blurb celebrates distressed surfaces, against the visual bans.
  - No movement carries love, submission, disapproval, remorse or overwhelm.
  - 3 have no texture.

Full details are in `cutout-coverage-audit.md`.

---

## 7. Corrections to Gemini's curator draft (the "/refine" prompt)

| Gemini's draft said | Correct, per the dartboard spec |
|---|---|
| 28 aesthetic families | **20** families (28 belongs to the other spec) |
| Stats −3..+3 | Stats **0–10**; only the wobble is −3..+3, and the engine computes it |
| Ingredient values summed into one score | **Each ingredient throws its own dart**, one per layer; nothing is summed |
| (missing) | Every asset needs **`layer`** and **`intensity` 1–10** |

**Answers given to Gemini's questions:**
1. **Data only.** Give source URL, rights and a YAML tag sheet (spec section 6). No cropping.
2. **Use the existing schema exactly.** No new variables.
3. **Compound chaos only in Ground, Bodies and Grit.** The Voice layer always has a clean `readability_safe: true` option, and the poem is never touched.

**On the "critical hit" idea:** OK as a rare, seed-triggered, reversible intensity-10 Grit or Motion asset that mutates the decor only, never the poem or the controls.

**Tag sheet (from the spec):**
```yaml
id: cut-0412
type: cutout        # cutout | background | palette | type | button | motion | grit
layer: bodies       # ground | voice | bodies | motion | grit
family: 13          # 0–19
intensity: 8        # 1–10
stats: { heat: 7, order: 2, noise: 9, weight: 6 }
source: "Internet Archive / 1968 magazine"
rights: fragment    # own | public-domain | fragment
notes: "crowd with banner, torn edge, b&w halftone"
file: assets/cutouts/cut-0412.png
```

---

## 8. Decisions waiting on Brandon

1. **Which spec wins:** the dartboard (20 families) or `DATABASE_SPEC.md` (28 movements)? This blocks all tagging.
2. **The intensity-flip fix and wobble size** (recommended: the fix with ±3).
3. **Grief↔Ecstasy wraparound:** intended or a bug?
4. **Short recipes:** rethrow darts 4–5, or use a house default?
5. **Doodle matching** uses live Claude: keep it as claude.ai-only, cut it, or go offline?
6. **The Unauthorized Thing:** is it the direction? Its first real-world test is Brandon drawing on it.
7. **Grunge Design movement:** keep it drawn cleanly, or cut it?
8. **Cutout library rights:** an audit is still owed before any public use.

**Done when** (from the logbook): the reader edition uses Brandon's rights-cleared cutout library instead of drawn stand-ins, and Brandon approves it.

---

## 9. How to verify anything you build

- Render it at 1440×900 and 390×844 with Playwright, look at the screenshots, and fix what's weak. Keep screenshots out of the public repo (they show private text).
- Check: no console errors; `scrollWidth === clientWidth`; every poem readable whole; the same recipe gives the same room; keyboard-only use; reduced motion.
- Before committing: `grep` the source for lines from the full manuscript. The count must be 0.
- Report only what you actually checked. "Should work" isn't evidence.
