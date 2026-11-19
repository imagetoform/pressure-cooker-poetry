---
name: Pressure Cooker Poetry
summary: Polished brutalism. A torn-paper cut-up collage that rebuilds itself for every visitor around a poem that never changes.
tokens:
  color:
    ink-black: "#0d0d0d"    # main dark ground, text on paper
    coal: "#1a1a1a"         # panels on dark
    steel: "#2b2b2b"        # borders and rules on dark, quiet surfaces
    paper: "#f4f4f2"        # paper ground, text on dark (cool white, not cream)
    red: "#c4161c"          # the house red: stamps, slabs, rules. On black, large text only (3.2:1)
    hot: "#e2321f"          # live/urgent accent: valve, pressure, warnings. 4.4:1 on black, use at 18px+ or bold
    yellow: "#ffd400"       # focus rings, highlighter, the one "you are here" mark. 13.6:1 on black
  font:
    display: '"Anton", Impact, "Arial Narrow Bold", sans-serif'    # slab headlines, stamps, big labels
    sans: '"Archivo Var", "Archivo", Arial, Helvetica, sans-serif'  # UI text and body copy
    serif: '"Fraunces Var", Georgia, "Times New Roman", serif'     # the writing: poems, essays, pull quotes
    mono: '"Space Mono", "Courier New", monospace'                  # labels, receipts, forms, the bureaucracy
    strip: '"Special Elite", "Courier New", monospace'              # typewriter strips (collage only, never body text)
  size:
    body-min: 16px
    poem: "clamp(1.12rem, 1rem + .5vw, 1.3rem) / 1.7"
    measure: "40-70ch"          # line length of the reading region
    tap-min: 44px               # 48px preferred
  layout:
    topbar: 56px
    max-content: 1440px
    gutter-desktop: 36px
    gutter-mobile: 20px
  motion:
    quick: 140ms
    settle: 300ms
    pressurize: "2.2s - 3.5s, skippable"
---

# DESIGN.md: Pressure Cooker Poetry

> **SUPERSEDED on 2026-11-18 (CANON D-35).** Brandon reset the design premise. This file describes the retired Kitchen look (rooms built around one poem, slabs, receipts, the old token set) and is kept as history only. **Don't build new work from it.**
>
> The new direction is the **cutup card**: torn-paper strips of words (lines cut from the poems mixed with the visitor's own words) over collage imagery from the cutout library. Brandon's three reference pictures are in `docs/design/reference/`: `cutup-db-dark-grid.png`, `cutup-db-collage-hero.png`, `cutup-db-light-archive.png`. They show *one of many* possible outcomes, not a spec. Their sign-in buttons, like and view counts and "Saved (24)" are **not** wanted (no accounts, no tracking; saves stay in the visitor's browser, D-33).
>
> A new DESIGN.md gets written with Brandon during the cutup-maker step of `docs/GO_LIVE_PLAN.md`. Until then, the rules that survive are the ones in AGENTS.md (legibility 4.5:1, keyboard and touch, reduced motion, no sideways scroll at 320px, no external requests at runtime).

---

## (history) DESIGN.md: Pressure Cooker Poetry

Read this before any change a visitor can see. Tokens above are the **shell**: the parts that stay put so the site stays usable. Everything else is the **room**, and the room is supposed to change. Both CSS custom properties already exist in `site/live/index.html` as `--k-*` and `--f-*`; use those names, never raw hex values, in new shell CSS.

## 1. What it should feel like

- **Polished brutalism.** Punk and Dada in attitude, built with the care of a good magazine. The owner rejected the messy sandbox as "too sloppy" and the flat menu-style landing as too plain. The target sits between.
- **Torn-paper cut-up collage.** Ripped edges, tape, staples, halftone, photocopy toner, misregistered ink, ransom-note type, stamps and dymo labels. The reference is the "Cutup Database" mockups and the Living Cover hero: loud, layered, still readable.
- **Editorial backbone.** Jacobin and AIGA Eye on Design are the references for hierarchy, type confidence and how an image sits next to an argument.
- **"Anarchy malarky."** Perfection is not the goal. Loose expression is welcome; broken function is not. Grammars may collide and break their own rules inside a room. Buttons, links, reading and navigation may not.
- **A guerrilla-left undertone, even at a whisper.** Infomercial parody, fake coupons, bureaucratic forms and propaganda turned inside out. Aim it at power.

## 2. Shell and room

| Shell (fixed, from tokens) | Room (generative, from the library) |
|---|---|
| Top bar and nav, skip link, focus rings | Background, ground colour, textures, frames |
| The poem's reading region: serif, measure, contrast | Cutouts and their placement, rotation and scale |
| Button behaviour: size, focus, disabled, pressed states | Button **skins** (`data-k-button`), ornaments (`.kit-orn`) |
| Receipts, coupons, forms (mono, ledger style) | Layout grammar, motion dialect, type treatment of titles |
| Error and empty states | Everything decorative |

Rule of thumb: if a visitor needs it to read, choose, navigate or recover, it's shell. If it carries mood, it's room.

## 3. The generative system (how rooms get their look)

- **30 movements** in six branches (ornament, order, revolt, future, excess, abstract). Each is a kit: emotion tags, layout grammar, motion, colours, button skin, textures, ornaments, cutouts. List: `library/families/README.md`; data: `site/src/styles.js`.
- **Six layout grammars:** `manifesto` (Constructivist broadsheet, diagonal force), `cutup` (Dada ransom note, every line its own strip), `xerox` (punk zine, toner and tape), `ledger` (bureaucratic form, poem filed as a grievance), `whisper` (restrained broadside, mostly empty), `reliquary` (leaded-glass icon, jewel cells, heavy outlines).
- **The dartboard** picks: choices become darts on Plutchik's wheel; movements and cutouts are matched by emotion tags (words, never numbers). A primary movement wins; a secondary from another branch is often mixed in. A page should mix families, never be one family top to bottom.
- **Kit hooks** set by `decorate()` in `styles.js`: `body[data-k-button]`, `body[data-k-texture]`, `body[data-k-motion]`, `.kit-orn`. Kit parts live in `library/families/<branch>/<id>/kit/*.css`, generated by `tools/kits/generate.py`.
- **Database-only rooms:** once a movement has 6 library cutouts (`DB_MIN` in `site/tools/build_library.py`), its rooms drop the layouts' built-in art and use only library cutouts plus the kit.

To add visual variety, add to the library (kit parts, cutouts, movement data). Don't hard-code a new look into one page.

## 4. Colour

- Two grounds for the shell: **ink-black** and **paper**. Rooms bring their own movement palettes on top.
- **Not cream, not beige, not parchment** as a default ground. The owner finds it generic. If a movement needs warm paper (Rococo, Art Nouveau), it comes from that movement's kit, inside the room.
- Red is for stamps, slabs and rules. On black it passes only as large text (24px+, or 18.7px+ bold).
- Yellow is the "you are here" colour: focus rings, selected states, the highlighter. Don't spend it on decoration in the shell.
- Every text-on-ground pair in the shell: at least **4.5:1** (3:1 for large text). Inside a room the poem's region must still meet 4.5:1 against whatever is actually behind it. Put a paper or ink panel under the text when the collage gets too busy.

## 5. Type

- Anton for slab headlines and stamps. Archivo for interface and prose. **Fraunces for the writing.** Space Mono for labels, receipts, forms and anything "official". Special Elite only for typewriter strips inside collage.
- Fonts are embedded in the Kitchen. Don't add a webfont CDN link. A new family needs a licence check (OFL or similar), recorded in the PR.
- Arial, Helvetica and Georgia are **fallbacks**, not choices. Don't design with them.
- Body text at least 16px. Poem measure 40 to 70 characters. Don't letter-space body text, don't set poems in all caps, and don't animate the letters of a poem.
- Ransom-note and cut-strip treatments are for titles, labels and ornament. The poem body stays one clean, continuous voice.

## 6. Collage rules

- Cutouts never sit on top of the reading region. They can bleed under its edges, behind a panel.
- Rotation is seeded and small for anything with text on it (about ±6°); free for pure image fragments.
- Layer order from back: ground, texture frame, large cutouts, ornaments, reading panel, small foreground scraps (tape, staples, stamps) that stay outside the text.
- About 1 to 8 cutouts per room (the engine's density rule). More is the Maximalism family's job, not the default.
- Image fragments: real scans and public-domain or cleared material, recorded in the manifest. Stand-in drawings must look like stand-ins.
- Propaganda pieces may appear as teaching material, framed so the room reads them critically.

## 7. Motion

- Each movement has its own motion dialect (thrust, jitter, float, flicker...). Pick one per layer; don't stack effects.
- Animate `transform`, `opacity` and `clip-path` only. No layout-shifting animation.
- Nothing flashes more than 3 times a second. No perpetual vibration or constant text jitter.
- The Pressurize moment: 2.2 to 3.5 seconds, skippable by tap, Esc or Enter, with an `aria-live` line. Contract and harness in `tools/animations/`.
- `prefers-reduced-motion: reduce` (and the `.no-motion` class) gives one finished still frame within 600ms. Never hide content behind an animation.

## 8. Components

- **Buttons.** At least 44px tall (48 preferred), visible text label, a yellow 3px focus ring offset from the edge, real `:disabled` and `[aria-pressed]` states. Skins (slab, stamp, sticker, halftone, pill...) change the look, never the size or the label.
- **Fragment tiles and ingredient tiles.** Whole tile is the button. Accessible name describes the image or ingredient. Selected state shown by outline and colour, not colour alone.
- **Receipts and coupons.** Mono type, ledger rules, scissor lines. They are legal-looking satire and also real data: show the ids and seed plainly.
- **Navigation.** Poems, Essays, The Learning Curve, Mission, Contact. Plain links, always reachable, same place on every page.

## 9. Don't

- Default cream/beige grounds, SaaS minimalism, blog templates, three identical feature cards, everything centred.
- Purple-to-blue gradients, glassmorphism, gradient headline text, soft drop-shadow "cards" everywhere, emoji as icons.
- Stock photos or AI art passed off as historical artwork. Generated art is labelled as generated in its provenance file.
- Logos or characters from litigious megacorporations (Disney and the like).
- Visible dials, sliders, scores, or "your personality is..." language anywhere a visitor can see.
- Any new visitor-facing control or step without the owner's OK.

## 10. Known drift (owner decision pending)

`site/visual/visual.css` (the front door added in PR #11) is off-system: it designs in Arial and Georgia and uses a cream `#f3eadb` on `#17151a` palette with a lime `#e4ef65` accent. Bringing it onto the tokens above is a reasonable task, but it changes the front door's look, so **ask the owner first** and show before/after screenshots. Don't spread its values into new work.
