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

Re-ordered on 2026-11-18 after the reset (CANON D-31 to D-35). Earlier order is in git history.

### Step 1: Get the finished work onto GitHub ✔
Done 2026-11-18: branch `release/step-1-front-door`, draft PR #14, private Netlify deploy preview.

### Step 2: The reset ✔ (on the PR, not live)
Brandon, 2026-11-18: the Kitchen and its old designs go, the outcome becomes a cutup card, and nobody lands straight in a poem.
Done on the same branch: writing moved to `content/` and checked line by line; Kitchen, old front door and their build deleted; plain pages for poems, essays and the Food Bank; `/` is a plain stand-in; tests rewritten.
**Brandon checks (preview):** `/poems/` and a few poems read right; an essay shows its sources; `/kitchen/` sends you to the poems; nothing of the old look is left.

### Step 3: Design the cutup maker, as a playable sandbox
Before anything is built into the site: a sandbox Brandon can play with on his phone, using real cutouts and real poem lines. It answers Q-14 (what you pick, how your words and the poem lines are cut together, what a finished card holds) and sets the new look (D-35).
**Brandon checks:** plays it; says what feels right and wrong. Repeat until it's right. Then the new design system gets written down.

### Step 4: Build the cutup maker into the site
At `/`, from the approved sandbox. Includes: share link + "save" in the visitor's browser (D-34), credits and links to the poems each card cuts from (D-32), and **bigger motion with music**: the alive engine tuned so strips and cutouts move more dramatically with a song or the mic, with a "drama" level found in the lab first.
**Brandon checks:** make three cards on the phone; the same choices give the same card; a shared link opens the same card; the song makes it dance; "Hold still" is calm.

### Step 5: First release
Everything from Steps 2 to 4 goes live in one release, after Brandon's OK. (Option, Brandon's call: release Step 2 earlier on its own; the live `/` would then be the plain stand-in until Step 4.)
**Brandon checks:** the live site, on his phone, against the checklist in the PR.

### Step 6: Brain Candy goes live
Needs Brandon's OK on the menu link (where it appears and what it says).

### Step 7: Restyle the section pages, one at a time (D-18)
Poems, essays, the Food Bank, Learning, About and Contact get the new look, one page per release.

### Step 8: The esoteric easter egg
Needs Brandon's description first (ChatGPT's notes never reached Claude). Maybe related: the essay "Grimoire, Grammar, Glamour" is about occult esotericism and "as above, so below".

## Runs alongside (doesn't need a release slot)
- Muse batches: Claude ingests and reviews each zip as it arrives. New cutouts ride along with the next release.
- Still short (under 8): constructivism, dada, swiss, afrofuturism. Missing Muse rounds: Art Deco 1-3; round 3 of Psychedelia, Bauhaus, Surrealism, Punk.
- The ALIVE LAB artifact is at its 512-file limit; from the next batch on it shows a sample of the library, not every piece.

## Status

| Step | State |
|---|---|
| 1 GitHub | **done 2026-11-18**: PR #14, private deploy preview |
| 2 Reset | **done on PR #14 2026-11-18**, waiting on Brandon's look at the preview |
| 3 Cutup maker sandbox | next |
| 4 Build the maker (+ bigger motion) | after 3 |
| 5 First release | after 4 (or Step 2 alone, if Brandon wants) |
| 6 Brain Candy | after 5; menu link needs Brandon's OK |
| 7 Section pages | after 6, one at a time |
| 8 Easter egg | needs Brandon's description first |
