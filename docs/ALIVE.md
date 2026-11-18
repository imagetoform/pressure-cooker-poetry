# ALIVE: how the site reacts to people

One engine, `site/alive/alive.js` (styles: `site/alive/alive.css`; moved from `site/visual/` in the 2026-11-18 reset). Decided in CANON D-29.

```
 touch / mouse ─┐
 keys ──────────┤
 sound (opt-in) ┼─▶  SIGNALS (numbers 0–1)  ─▶  each cutout's VERB  ─▶  translate / rotate / scale
 song file ─────┤     px py speed keys tap        (from its emotion       on the <img> only
 tilt (opt-in) ─┤     audio low high onset          tags on the wheel)
 scroll ────────┘     tiltX tiltY energy idle
```

## The rules it keeps

- **The receipt never changes.** Motion goes on the cutout `<img>`; the composition's own position and rotation live on its parent `div.cut` and are untouched. Loose scraps are placed from the receipt seed, so a replay scatters them the same way.
- **Sound is opt-in and local.** The microphone starts only on a click, is never connected to the speakers, never recorded, never sent. "Feed it a song" plays a file the visitor picks, also local. "Stop" releases everything.
- **No tracking.** Signals live in memory for the current page only. The one thing saved is the visitor's own "Hold still" choice (`localStorage: pcp-still`).
- **Reduced motion is respected.** With `prefers-reduced-motion`, or "Hold still", nothing moves on its own; typing, stamps and dragging still work.
- **Battery.** One `requestAnimationFrame` loop for everything. It sleeps 8 s after the last input and when the tab is hidden.
- **Accessible.** Every cutout is focusable; arrow keys move it (Shift for big steps). Letters and stamps are decorative (`aria-hidden`). Escape wipes the letters.

## Emotion → verb

The first emotion on a cutout picks its main verb; a different second emotion adds a quieter second verb.

| Verb | Emotions | What it does |
|---|---|---|
| jolt | rage, anger, aggressiveness, annoyance, overwhelm | shakes with energy, kicks on a loud hit |
| flinch | terror, fear, apprehension | backs away from your finger |
| bounce | ecstasy, joy, optimism | hops to the bass, swells on taps |
| drift | serenity | floats slowly, even at rest |
| lean | trust, acceptance, admiration, submission | tilts toward you |
| pop | amazement, surprise, distraction | jumps on every tap or key, sparkles with treble |
| sink | grief, sadness, pensiveness, remorse | sags when ignored, lifts when you act |
| recoil | loathing, disgust, boredom, contempt, disapproval | turns away and shrinks as you come near |
| track | vigilance, anticipation, interest | follows you |
| breathe | awe, love | slow breath, swells with sound |

To add a verb: write it in `VERBS` in `alive.js` (it returns `{x, y, r, s}` from the signals), map emotions to it in `VERB`, and add a row here.

## What visitors can do

- **Touch / mouse:** everything reacts to where you are and how fast you move. Tap empty space: an ink stamp in the room's colours.
- **Drag a cutout:** mouse grabs it even under the text. On phones, pieces slide sideways under your finger and vertical swipes still scroll.
- **Type anything:** cut-out ransom letters in the room's colours. Enter = new line, Backspace = remove, Escape = wipe.
- **Let it hear you:** microphone. **Feed it a song:** any audio file. **Tilt:** phones.
- **Hold still:** stops all motion.

## Where it runs

- Front door: the old cooked rooms are gone (CANON D-31). The cutup card will attach it when it's built.
- The lab: `/alive/lab/` (every cutout, pick families, meters, "Show behaviours"; `?seed=` makes a run repeatable). Data comes from `/alive/cutouts.js`, written by `site/tools/build.py`.
- Tests: `site/tests/alive.cjs` (serve `site/public` on :8765 first).

## Next

- The rooms themselves are still the old poem-first layouts (CANON D-18). Rebuilding them around the art will give the alive layer far more to move.
- Ideas not built: letters that stick to the receipt as a "message in the room"; families with their own sound palette; a shared wall.
