---
name: pcp-design-pass
description: Check any visible change to Pressure Cooker Poetry (layout, CSS, colour, type, motion, buttons, copy) against DESIGN.md and the owner's taste before and after building it. Use for every UI, styling, animation or wording change.
---

# pcp-design-pass

## Before you build

1. Read the LOCKED decisions in `docs/CANON.md`, then `DESIGN.md` (the cutup look, D-39) and the reference pictures in `docs/design/reference/`.
2. Decide whether each thing you're touching is **shell** (needed to read, choose, navigate, recover) or **room** (mood). Shell uses the `--k-*` / `--f-*` tokens. Room looks come from the library (movement kits, cutouts), not from one-off CSS on a page.
3. If the change adds a step, control or screen a visitor will see, stop and ask the owner in the issue first.

## While you build

- Fonts: Anton (display), Archivo (UI), Fraunces (the writing), Space Mono (labels, receipts), Special Elite (collage strips only). No new webfont links.
- Colour: ink-black or paper grounds for the shell. No default cream or beige ground. Yellow is for focus and selected state.
- Every animation: `transform` / `opacity` / `clip-path` only, seeded if it varies, off under `prefers-reduced-motion` and `.no-motion`, nothing flashing more than 3 times a second.
- Buttons: 44px minimum, visible label, yellow focus ring, real disabled and pressed states.
- Copy: second person, irreverent, plain, punches up. No "seamless", "elevate", "unlock", "journey". Never about the owner on the front door.

## After you build: the checklist

Look at the screenshots from `pcp-verify` (desktop, Pixel 7, 320px) and answer each line in the PR:

- [ ] Poem or main text readable everywhere; contrast at least 4.5:1 against what is actually behind it (measure it; don't guess)
- [ ] Nothing covers the reading region
- [ ] Keyboard: Tab reaches every control in a sensible order; focus ring always visible
- [ ] Reduced motion: the page is complete and still
- [ ] No horizontal scroll at 320px; no clipped buttons
- [ ] Two different recipes look **different** (not just a hue swap). Attach both screenshots
- [ ] Nothing from the "Don't" list in DESIGN.md section 9 crept in (cream ground, SaaS cards, gradients, glassmorphism, emoji icons, everything centred)
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

Show, don't argue. Put two or three variants side by side as screenshots in the PR and let the owner pick. He works visually and prefers a playable prototype over a written spec.
