# Decisions

The owner's standing decisions, newest first within each section. When something here disagrees with an older doc, this file wins (the owner's words in a live task win over this file). Add a line, with the date and where it was decided, when the owner decides something new. Don't delete old lines: mark them **superseded** and point to what replaced them.

## Experience

- **2026-11 (issue #10):** Front door = **three rounds of ten visual fragments**, one per design family, covering all 30 families. The emotion tags are editorial design cues, never presented as facts about the visitor. The full ingredient pantry stays, opt-in, at `/kitchen/`.
- **2026-11 (issue #10):** Receipts: same families + same variant seed + same build = same composition. "Another interpretation" changes only the seed. Old receipts on a new build are rejected openly, never silently re-rendered.
- **2026-11 (issue #10):** Editorial sections: Poems, Essays, The Learning Curve, Mission (About), Contact. Learning Curve cycle: Notice → Investigate → Imagine → Act → Connect, with no compulsory ladder or doctrinal test.
- **2026-11 (issue #10):** No accounts, social APIs, profiling or moderation backend now. Keep receipts portable (JSON) so they can be imported into accounts later.
- **2026-11:** Microphone "resonance" is opt-in, local only, with a reduced-motion fallback (PR #5).
- **2026-11:** Saved rooms are framed as a **coupon** for next time.
- **2026-11-01:** Visible dials are gone for good. Dials, flavor bars, odds, poem picker, seeds and inspector are lab-only (`?lab=1`).
- **2026-11:** The drawing wall lives in each piece's margin and uses free in-browser recognition; matching scores lines automatically. Can be pulled later if it doesn't work.
- **Superseded:** the "Mood Interview" text questions (PR #7) → replaced by the visual fragments (issue #10).
- **Superseded:** the cabinet avalanche as the front door → issue #10 calls it obsolete; the collage landing survives at `/collage/` without it.

## Look and feel

- The target is the torn-paper cut-up collage of the "Cutup Database" mockups and the Living Cover hero: brutalist ideology, polished page by page. The messy sandbox was "too sloppy".
- **Rejected:** the first flat, menu-style "Gutter" landing.
- **Disliked:** the beige/cream ground used on the Kitchen Door and the page studies. Don't use it as a default ground.
- No blog-template or SaaS-minimalism look.
- Every element beyond what readability and usability need should come from the database (cutouts, kit parts, saved icons and snippets), so each visitor gets a different page that can be saved and reproduced.
- Pages mix several families; never one family top to bottom. Each chosen family should own a layer (background and colour, type and buttons, cutouts and motion).
- Grammars may collide and break their own rules inside a room.
- References: Jacobin's design, AIGA Eye on Design's editorial eye.
- **Pending:** the animation after "Pressurize" should be replaced with one inspired by cssauthor.com (contract in `tools/animations/`). Unsure about turning the pressure gauge into the Pressurize button.
- **Pending:** nutrition-label cards for the pieces index (study first).

## Content and voice

- Authored writing is never edited.
- The site is a resource for the reader's curiosity and education; the owner's writing is one item on the menu, not the focus. Front-door copy is about the visitor, not about the owner.
- Satire aims up at the powerful, never at the people underneath. Everyone is equal; the pantry and the deck should be as inclusive as possible.
- The absurdly large pantry is deliberate satire of fake abundance. Keep it big.
- Propaganda pieces stay in the library as teaching material about how propaganda works.
- Clearly separate sourced fact from satire and fiction.

## Data and engine

- Engine stays deterministic. No live AI API calls from the site; generation happens at build time and the site picks from a library.
- Cutouts and movements carry emotion words, never numbers (`docs/DATABASE_SPEC.md`).
- 30 movements as of 2026-11-05 (Rococo and Mexican Muralism & Rasquache were 29 and 30).
- **Open:** whether the four stats Heat / Order / Noise / Weight map onto the hidden dials or tastes. Not decided; don't wire them in.
- **Open:** Pop Art and Maximalism lead more rooms than others (about 16% and 12.5%). Reported, not retuned; the owner's call.

## Process

- Owner OK required for each production deploy. Previous OKs don't carry over.
- One Netlify project (`pressurecookerpoetry`). Never create another.
- Agents open reviewable PRs for verified increments; nobody auto-merges a pile of draft PRs.
