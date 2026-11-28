---
name: pcp-design-pass
description: Check any visible change to Pressure Cooker Poetry (layout, CSS, colour, type, motion, doors, copy) against D-42 and the owner's taste before and after building it. Use for every UI, styling, animation or wording change.
---

# pcp-design-pass

## Before you build

1. Read `docs/CANON.md` (D-42 is the only active architecture), then `DESIGN.md`. Anything in `docs/history/`, old branches or old PRs is history, not a brief: no Kitchen, no cut-up maker as homepage, no poem-first cover, no "LOCKED" rows from archived files.
2. Know the journey you must not break: questionnaire → animated pressurization → seeded, art-directed homepage → live reactive art with the hidden eye (`/the-eye/`). Five doors on every edition: Brain Candies `/brain-candy/`, My Two Cents `/my-two-cents/`, Contact `/contact/`, Mission Statement `/about/`, Learning Curve `/learning/`.
3. Generative freedom means **structure** changes per seed (skeleton, grid, hierarchy, background, type system, motion), not a palette or card swap.
4. Source-first: imagery comes from `library/cutouts/manifest.json` (Brandon's own kept cutouts) or other catalogued, cleared sources. Name any reference that is still unimported instead of faking it.
5. If the change adds a step, control or screen a visitor will see, or replaces something on `/`, build it under `/lab/<name>/` first and let the owner play with it.

## While you build

- **No code-drawn stand-ins.** Don't draw objects in CSS/SVG to look like collage material: no fake paper notes, tape, torn labels, outlined arches, stickers, gradients or placeholder geometry. Code sets type, flat inks and placement; every object is a real cutout. (Nov 28, 2026: this is what made editions look "generated clip-art".)
- Fonts: self-hosted OFL files in `/brain-candy/fonts/` (Anton, Archivo, IM Fell English, Space Mono, Special Elite) or system stacks. No CDN or Google Fonts links.
- Colour: grounds and inks come from the edition's families (`/cutup/data.js` `families`), flattened to paper or night. Text at least 4.5:1 against what is actually behind it.
- Motion: `transform` / `opacity` / `clip-path`, seeded if it varies, fully off under `prefers-reduced-motion` and Hold still, nothing flashing more than 3 times a second.
- Doors and controls: real links/buttons with visible text, 44px targets, visible focus. The eye stays keyboard-reachable.
- Copy: second person, irreverent, plain, punches up. No "seamless", "elevate", "unlock", "journey". Authored poems verbatim, always.

## After you build: the checklist

Look at real renders (see `pcp-verify`). For generative work, look at **at least 12 seeds** at desktop, 390px and 320px (the `/lab/wall/?sheet=1` and `?sheet=phone` contact sheets show the pattern). Answer each line in the PR:

- [ ] Editions differ in structure, not just hue. Attach a contact sheet
- [ ] Five doors and the eye on every seed and viewport
- [ ] Text readable everywhere; nothing important under art
- [ ] Keyboard: Tab order is sensible; focus always visible
- [ ] Reduced motion / Hold still: the page is complete and still
- [ ] No sideways scroll at 320px; nothing clipped
- [ ] Every image on the page is a catalogued asset (no drawn props, no hotlinks)
- [ ] Copy follows the voice rules

## Contrast helper

```sh
python3 - <<'PY'
def L(h):
    h=h.lstrip('#');c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
def ratio(a,b):
    x,y=sorted([L(a),L(b)],reverse=True);return round((x+.05)/(y+.05),2)
print(ratio('#f4f4f2','#0d0d0d'))   # replace with your pair
PY
```

## When it's a matter of taste

Show, don't argue. Put variants side by side as screenshots or a playable lab page and let the owner pick. He works visually and prefers a sandbox over a written spec.
