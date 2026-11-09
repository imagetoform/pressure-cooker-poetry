# Muse Fusion Brief: Pressure Cooker Poetry, build day

Paste the shared rules below into every model's system prompt, then each model's role prompt after them.

## 0. The one decision before you start (2 minutes, yours)

Pick ONE direction. Do not run another ideation panel today; three panels have already converged on print.
- **A. THE FORME** (working prototype exists: `pressure-cooker/forme.html`)
- **B. THE FORME + MAKE-READY features**: one monumental word from the poem cropped by the sheet edge, plates printed in visible passes, a pile of proofs, phone scroll = feeding paper. **Recommended.**

Also answer:
- Big word: you mark it per poem, or the engine picks automatically?
- 17° diagonal: allowed or banned?
- Paper: newsprint/ivory allowed, or cool greys only?

## 1. The fusion: roles, not a vote

| Role | What it does | Model family (pick the newest you have on OpenRouter) |
|---|---|---|
| **Orchestrator** | Muse version 1. Holds the plan, hands out tasks, merges, runs the gates. | Muse |
| **Builder** | Writes all code. One author, so the code stays coherent. | Strongest coding model you have: Claude Opus class, or GPT top tier |
| **Art director** | Looks at SCREENSHOTS only, never code. Judges against the hard rules and your taste. | Strongest vision model: Gemini Pro class |
| **Adversary** | Tries to break it: long poems, phone width, keyboard only, reduced motion, determinism. Different family from the Builder. | Whichever of GPT / Claude / Gemini is not the Builder |
| **Judge** | Muse version 2. Reads the gate results and says ship or fix. Never writes code. | Muse |

Why roles: a fusion where every model writes its own version gives you three half-sites by tonight. One builder plus critics gives you one finished site.

Optional cheap helper (e.g. DeepSeek V4.1 Flash or GLM 5.3 Flash): generate the 200-recipe contact sheet and flag near-duplicates.

## 2. Schedule for today

| Block | Time | Who | Output |
|---|---|---|---|
| 1 | 30 min | Orchestrator → Builder | Plan: file list and changes to the existing `forme.html` (extend, don't restart) |
| 2 | 2 h | Builder | Working build, sample corpus only |
| 3 | 30 min | Orchestrator | Screenshots at 1440×900 and 390×844 for 6 recipes plus 1 long poem, plus Proof mode |
| 4 | 30 min | Art director + Adversary, in parallel | Findings, each with a screenshot reference and a fix |
| 5 | 1.5 h | Builder | Fixes |
| 6 | 30 min | Judge | Gate check (section 4). Ship or one more fix round. |
| 7 | 30 min | You | Look, approve, deploy to a Netlify preview URL. Not the production domain until you say so. |

About 6 hours. If block 6 fails twice, ship the preview anyway and list the gaps.

## 3. SHARED RULES: paste into every model's system prompt

```
You are working on Pressure Cooker Poetry, a generative literary site by poet and artist Brandon Rhodes.
Thesis: "The writing never changes. The room you read it in does."

NON-NEGOTIABLE
1. The poem text is never altered, re-broken, recolored low-contrast, overlapped, rotated or clipped. Authored line breaks are sacred; a necessary soft wrap gets a hanging indent.
2. The poem is real HTML text: selectable, screen-reader readable. Contrast in the poem cell is at least 7:1.
3. Deterministic: recipe (Burn + Binder + Weather + Pressure + Entropy + poem id + grammar version) gives the same plate every time. Independent seeded streams per dimension. No Math.random.
4. Bans: grunge or distress textures, torn paper, arbitrary rotation of single elements, gradients, rounded cards, bento or card grids, empty hero sections, beige or cream grounds unless the founder approved them, stock imagery.
5. No void: every cell is filled; cells share one rule; one giant element per plate.
6. Readers drive it: ingredient decks, Pressure and Entropy sliders, Proof (calm reading mode) one key away, Rack (archive). Every control is a plain accessible button or input.
7. Works at 320 to 1440 px wide with no horizontal scroll. Honors prefers-reduced-motion.
8. Privacy: build and test with corpus/corpus.sample.txt only. The full manuscript stays on the founder's machine and is never pasted into a prompt or committed to the public repo.
9. Vanilla HTML/CSS/JS (or TS + Vite). SVG for the plate. No WebGL, no framework migration.
10. Report only what you verified. "Should work" is not evidence.
```

## 4. Gates: the Judge checks these, pass or fail

1. Six named recipes render with no console errors at 1440×900 and 390×844.
2. For every poem in the sample corpus: poem cell height ≥ poem content height (no clipping). Check in the DOM, not by eye.
3. The same recipe loaded twice gives identical SVG markup.
4. No horizontal scroll at 320, 390, 768, 1024 and 1440 px.
5. Proof mode on and off restores the identical plate.
6. Keyboard only: open the Case, change all three decks, lock, Proof, Rack.
7. The Art director's verdict on the six screenshots: does each read as a locked print, or as a bento grid? Any "bento" verdict is a fail.
8. Contact sheet of 200 seeds: under 15% near-duplicates.

## 5. Role prompts (paste after the shared rules)

**Builder**
```
Extend the attached forme.html; do not start over. Implement: [paste the direction from section 0].
Keep the existing solver, fills, Case, Proof and Rack. Return complete files, not diffs.
List every change, and every rule you could not satisfy and why.
```

**Art director** (send screenshots only)
```
You are a severe art director. For each screenshot: (a) does it read as a locked print or a bento grid,
(b) which shared rule it breaks, if any, (c) the single most important visual fix.
Max 5 findings per image. No praise.
```

**Adversary**
```
Break this build. Test long poems, 320 px width, keyboard-only use, reduced motion, determinism
(load the same recipe twice and diff the SVG), and a corrupted URL hash.
For each failure give the exact input, the observed result, and the fix.
```

**Judge**
```
Given the gate results in section 4, answer SHIP or FIX. For FIX, list at most 5 items in priority order.
You do not write code.
```

## 6. Files to attach (from the repo `imagetoform/AF`, branch `claude/pressure-cooker-poetry-design-hdk1w3`, or the patches)

- `pressure-cooker/forme.html`: the engine to extend
- `pressure-cooker/index.html`: the reader edition (typing reader, follow-a-word). Keep its ideas available.
- `pressure-cooker/corpus/corpus.sample.txt`: test text
- `pressure-cooker/build.py`: inlines the private corpus locally (`python3 build.py forme.html`)

The branch is NOT on GitHub yet (push blocked). Apply the two patches with `git am` in your local clone, or give Muse the files directly.
