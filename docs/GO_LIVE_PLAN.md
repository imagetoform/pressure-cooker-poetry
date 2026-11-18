# Go-live plan: one step at a time

Written 2026-11-18 at Brandon's request ("slow down, one step at a time, a step-by-step test, build and go-live process").
Rule: **only one step is open at a time.** A step is finished when it is live and Brandon has said so. Then the next one starts.
Anything new that comes up goes to the bottom of the queue or to CANON → PARKED. It does not jump the line.

## The loop every step goes through

| # | Stage | Who | What "done" looks like |
|---|---|---|---|
| 1 | **Build** | Claude | Change made on its own branch, nothing else mixed in |
| 2 | **Test** | Claude | `visual-flow`, `alive`, `spin-cycle` pass; build is byte-identical twice; Claude has looked at screenshots on desktop and phone sizes |
| 3 | **Preview** | Claude | A link Brandon can open on his phone: a Netlify deploy preview from the PR, or the ALIVE LAB page for motion work |
| 4 | **Brandon checks** | Brandon | Goes through that step's short checklist (below) and says "ship it" or what's wrong |
| 5 | **Go live** | Claude, after the OK | Merge to `main`; Netlify publishes `pressurecookerpoetry` (never a second project) |
| 6 | **Check live** | Claude | Opens the live URLs, confirms the change is there and nothing else broke, notes it in the logbook and CANON "LIVE NOW" |
| — | **Undo** | either | Netlify → Deploys → pick the previous deploy → "Publish deploy". One click; nothing is lost |

An OK covers one step only (CANON D-27).

## The steps, in order

### Step 1: Get the finished work onto GitHub
The finished commits only existed in Claude's workspace (and in `pcp-local.bundle`). Nothing can preview or go live until they're on GitHub.
- Option A: Brandon gives a Claude session push access to `imagetoform/pressure-cooker-poetry`, and Claude opens one PR.
- Option B: Brandon pulls the bundle on his computer (`git pull pcp-local.bundle HEAD`) and pushes a branch.
**Brandon checks:** the PR exists and the Netlify deploy preview link opens.

### Step 2: Bigger motion with music and sound
Brandon, 2026-11-18: the pieces should move more dramatically with music or audio.
- Today the beat moves a piece about 10–30 px and grows it 4–10 %. Plan: a stronger beat hit (scale punch, rotation kick, bigger jumps on the bass), with a smooth fall-back so it doesn't jitter.
- To find the right amount, the ALIVE LAB gets a "drama" slider **in the lab only** (not on the site; no new visitor controls without Brandon's OK). Brandon picks a level; that number gets baked into the site.
- Reduced-motion and "Hold still" keep working; receipts stay identical.
**Brandon checks (in the lab, on his phone):** load a song file, then try the mic: does it feel like it dances? Too much? Is "Hold still" still calm?

### Step 3: First release of the new front door
What goes live: the 509-cutout library in the rooms, the alive layer, plus Step 2's motion.
**Brandon checks:** pick 3 rounds on the phone; the room uses real cutouts; touch, typing and the song file move things; receipts replay the same; Kitchen, poems, essays and Learning still open.

### Step 4: Brain Candy goes live
`/brain-candy/` and The Spin Cycle are built and tested but not deployed. Needs Brandon's OK on the nav link (where it appears and what it says).
**Brandon checks:** play one full round of The Spin Cycle on the phone; the wrapper jar fills; File 001 opens.

### Step 5: Rooms, one at a time (CANON D-18)
Rebuild each cooked room around the cutouts instead of the old poem-first layouts. **One room per release**, each through the full loop.
Order is Brandon's call (Q to ask at the start of the step).

### Step 6: Picks follow you
The browser remembers a visitor's picks and the next visit picks up from them (decided earlier, not built). Stored in the visitor's own browser only.

### Step 7: The esoteric easter egg
Brandon wants this "eventually". As of 2026-11-18 Claude has no description of it: nothing in the repo, and ChatGPT's notes never reached Claude.
**First action:** Brandon pastes or sends what he and ChatGPT worked out; it becomes a CANON entry before anything is built.
(Related, already decided: Brain Candy's Department Zero cipher files, D-30.)

## Runs alongside (doesn't need a release slot)
- Muse batches: Claude ingests and reviews each zip as it arrives. New cutouts ride along with the next release.
- Still short (under 8): constructivism, dada, swiss, afrofuturism. Missing Muse rounds: Art Deco 1–3; round 3 of Psychedelia, Bauhaus, Surrealism, Punk.
- The ALIVE LAB artifact is at its 512-file limit; from the next batch on it shows a sample of the library, not every piece.

## Status

| Step | State |
|---|---|
| 1 GitHub | **done 2026-11-18**: branch `release/step-1-front-door`, draft PR #14, Netlify deploy preview built (private: open it signed in to Netlify). Waiting on Brandon's look |
| 2 Bigger motion | next to build (can start in the lab before Step 1 is done) |
| 3 First release | after 1 and 2 |
| 4 Brain Candy | after 3; nav link needs Brandon's OK |
| 5 Rooms | after 4 |
| 6 Picks follow you | after 5 |
| 7 Easter egg | needs Brandon's description first |
