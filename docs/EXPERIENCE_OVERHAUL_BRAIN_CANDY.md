# PCP Experience Overhaul: Mood Interview + Brain Candy
Status: design work order / non-production branch
Date: 2026-11-13

## Goal
Make the first interaction intuitive and emotionally self-expressive while retaining PCP's existing deterministic emotion-wheel and style engine. Replace the cabinet animation. Build an interactive Brain Candy section for visual demonstrations of language mechanics and discoverable Easter eggs.

## Repository constraints verified
- Landing currently at `site/landing/` and published at `/`; Kitchen at `/kitchen/`.
- Build: `python3 site/tools/build.py && python3 site/tools/assemble.py`; Netlify publishes `site/public/`.
- Six tastes are `sweet, sour, salty, bitter, umami, spicy` (`site/src/tastes.js`).
- Four hidden dials are `e,c,i,x` (energy/clarity/intimacy/chaos).
- `site/src/board.js` projects taste profiles onto Plutchik-style emotional tags; style selection compares emotions to tagged design families.
- Same recipe currently implies same room; authored poems must never be rewritten.
- The pantry has 481 options according to README; do not delete the data or break lab mode.

## User-facing landing experience
**Primary call to action:** “Make something that feels like you.” 
Three small sequential prompts, each with 4 plain-language, emotionally specific options:
1. “What's the weather inside your head?”  Quiet but crowded / Something is about to happen / Soft around the edges / Everything is too much
2. “What do you need right now?” A little peace / Break something open / Make sense of things / Disappear for a while
3. “How should the world meet you?” Gently / With friction / Straight to the point / Surprise me

No ingredient explanation, no full card wall on first view. One question at a time; 2x2 compact tiles with tactile selection feedback, large tap targets, visible Back, keyboard access, short copy, and reduced-motion fallback. Ask questions in natural terms, without claiming a clinical psychological assessment.

## Engine adapter: preserve mathematics
Implement an adapter rather than rewriting core `tastes.js`, `board.js` or `styles.js`.
Represent each response as a curated profile on the existing 6 taste axes (0–10). Compose selected profiles (document and test the normalization method). Feed the resulting effective taste profile to existing `PCP.tastes.push` and the emotion wheel through a **virtual ingredient per answer** or equivalent compat layer. Ensure the wheel can still see three distinct darts when the answers express contrasting emotions, preserving the overwhelm/bullseye rule. Preserve seed determinism: same choices and seed => same room. For a “Try another version” action, change an explicit variant seed and preserve emotional coordinates; do not claim unbounded uniqueness or silently overwrite the existing deterministic rule.

Validate: same inputs stable output; contrasting profiles yield distinct family distribution; all eight petals are reachable; optional pantry remains usable; authored poems unchanged; first-time flow completes quickly on mobile. No direct normalization that unintentionally destroys intensity or collapses all responses into neutral tastes.

## Navigation + Brain Candy
Main menu: Poems / Essays / Brain Candy / The Learning Curve / About (adjust to actual available site sections).
Brain Candy is a toy-like factory of tools. Every tool uses a common 3-layer pattern: Play → Reveal → Learn.
- **Propaganda Machine:** input statement; modes such as corporate PR, triumphalism, sensationalist tabloid, grassroots rally, advertisement. Clearly labeled transformations; inspect rhetorical techniques and distinguish invention from source facts.
- **S.O.F.T.:** Carlin-homage language sterilizer; escalating euphemism levels; link to Tongue & Dagger if reusing existing standalone implementation rather than duplicating.
- **DoubleSpeak:** factual statement → sanitized official formulation; clickable annotations of removed agency, ambiguity, missing facts.
- **Bias Factory:** interactive demonstrations of selection effects, framing, anchoring and pattern detection, with grounded examples.
- **Conspiracy / Red String Machine:** deliberate fictional theories with visible satire labels, plus a separate documentary archive.
Show an animated but comprehensible mini-assembly-line infographic for each tool: input sentence enters, transformation stages act on it, changed output exits. Supply text descriptions of every mechanism.

## Reactive graphics system
Central signal-to-response layer: user selection / text input / pointer / optional mic amplitude → normalized UI signals → gauge, waveform, light, motion, text typography, clue reveal. Use sensors only with permission; no ambient sound capture by default. Changes must have semantic relationship to the signal, not fake analysis. Limit simultaneous movement. Support reduced motion, keyboard operation, touch, muted sound by default, easy audio opt-in, low-end mobile performance and pause/disable motion controls.

## All-Seeing Eye Easter Egg
Occasionally appears in decorative background. Eye pupil subtly tracks the cursor. On desktop approaching/hovering causes it to vanish, with DevTools inspect/pause as an optional discovery path. On mobile, tapping causes disappearance and leaves a tiny brass key or glyph; its discovery can later unlock a hidden route. Do not make DevTools the only accessible route. No deceptive surveillance; tracking is local pointer position only.
Using the key can briefly change the site to a cascading green digital-rain effect; the existing layout remains usable and a reduced-motion still alternative is available. Hidden archive “Department Zero” holds sourced critical explorations of esoteric history, Freemasonry and mystery schools, UAP/UFO investigations and declassified records, with evidence labels separating documented history, interpretation and fictional play. Preserve an explicit navigation exit.

Optional satirical hidden cockroach cartoon and other Easter eggs; keep surprises sparse so they do not interrupt the primary experience. Avoid using third-party likeness assets without checking rights; commission original illustrative art.

## Rollout
Phase 1: replace landing cabinet and card wall with the mood interview adapter; retain pantry behind “Explore ingredients” and lab access; validate build and mobile.
Phase 2: add Brain Candy hub, Propaganda / S.O.F.T. / DoubleSpeak and explainers; expose links from landing without making entry mandatory.
Phase 3: add shared responsive instrument components, optional microphone visualizations, accessible Easter eggs, digital-rain overlay, Department Zero.
Phase 4: test performance, accessibility, copy and visual consistency, staging preview, then merge only after approval. Do not overwrite production directly.

## Acceptance tests
- All 3 interview questions selectable by touch, mouse and keyboard, with Back and edit.
- Valid choices yield a room using the original emotional wheel and movement library, with no placeholder design matching.
- Determinism verified for fixed selections+seed.
- Optional legacy pantry still works; poems untouched.
- Cabinet animation removed from new landing.
- Brain Candy tools clearly distinguish generated satire, analysis and sourced facts.
- Responsive gauges don't move randomly or assert bogus measurements.
- Eyeball Easter egg is discoverable on phone and keyboard; no required hover.
- Reduced motion and audio-off modes function; page remains accessible if animations are disabled.
- Automated build/tests and visual screenshots checked before production deploy.
