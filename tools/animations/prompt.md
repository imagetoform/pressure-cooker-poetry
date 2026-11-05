# Prompt: build an animation for Pressure Cooker Poetry

Paste everything below the line into a strong coding model (Claude, GPT, Gemini, through OpenRouter or its own chat). Fill in the two blanks at the top. One animation per run. Test what comes back in `tools/animations/harness.html`.

---

**Make this moment:** `pressurize`
**In this concept:** `hands-into-pot` (or pick one from the menu below, or describe your own)

## The site

Pressure Cooker Poetry (pressurecookerpoetry.com) is a generative poetry site. Visitors pick up to three ingredients from an absurdly huge pantry: real working-class food, objects, memories, institutions of power, abstract concepts and absurdities, such as "a pot of lentils", "the patent on insulin" or "a goose with a five-year plan". They press **Pressurize**, and the kitchen builds a room for a poem out of torn-paper cutouts and design-movement kits.

The tone is punk-literate, anti-elitist and funny. Satire aims up at the powerful, never at the people underneath. Visually: cut paper, photocopier toner, halftone, propaganda posters, stamps and receipts, with hard black, warm paper and one loud colour. Not glossy. Not cute-for-its-own-sake. Hand-made and a bit violent in the good way.

## The moments that need animation

| moment | when | length |
|---|---|---|
| `pressurize` | the visitor presses Pressurize with their pot full | 2.2 to 3.5 s |
| `valve` | they press Valve to re-roll the same pot into a sibling room | 0.3 to 0.6 s |
| `drop` | one ingredient tile flies into the pot when tapped | 0.25 to 0.45 s |
| `reveal` | the finished room's poem appears | 0.6 to 1.2 s |

## Concept menu (for `pressurize`)

1. **hands-into-pot**: two rubber-hose cartoon gloves (an original design: plain white gloves, no character, no ears, no studio look) stuff the visitor's own ingredients, written on torn paper slips, into a steel pot. The lid slams, the pot's gauge needle climbs to the PSI, the pot rattles, and steam blows the screen clear.
2. **ransom-note**: the ingredient words break into cut-out letters from different magazines and get sucked into the pot one by one.
3. **red-wedge**: a Constructivist poster. The gauge needle is a red wedge driving into a white circle while the words stack like slogans.
4. **xerox-jam**: a photocopier eats the ingredient slips, jams and grinds, and spits out a stamped receipt reading COOKED at the PSI.
5. **reliquary**: the pot is a leaded stained-glass vessel. Each ingredient fills panes in its taste's colour, outlined in heavy black lead, until it glows.

## What the host gives you

Your code receives a **stage** (an empty, full-screen, dark element the host has already shown) and this **data**:

```js
{
  moment: "pressurize",
  ingredients: [                       // 0 to 3; an empty array means "the house stock"
    { text: "the patent on insulin", cat: "institution",
      tastes: { sweet: 0, sour: 1, salty: 0, bitter: 9, umami: 0, spicy: 0 } }
  ],
  psi: 87,                             // a whole number to show
  pressure: 0.62,                      // 0 to 1: how hard the pot is working
  movement: { id: "constructivism", name: "Constructivism", colors: ["#c4161c", "#111111", "#e8dcc4"], motion: "thrust" },
  rng: function () { /* seeded: returns 0 <= n < 1 */ },
  reducedMotion: false,
  narrow: false                        // true on phones
}
```

Use the data:
- **Show the ingredient text exactly as given.** It's the joke and the point. Never shorten or rewrite it.
- **Let each ingredient's strongest taste decide how it moves**, without ever showing numbers:
  - sweet floats down slow and soft
  - sour jitters and lands off-balance
  - salty drops square and stacks neatly
  - bitter falls heavy and dark
  - umami sinks thick and settles
  - spicy whips in fast, hot red
- **Let `pressure` drive the intensity:** lid rattle, steam volume, shake.
- **Take colours from `movement.colors`**, plus the site's own black `#111111`, paper `#f4f4f2`, yellow `#ffd400` and red `#e2321f`.
- **Use `rng()` for every random choice.** The same data must give the same animation, every time. Never call `Math.random`.

## The contract (the code must follow it exactly)

Deliver **one JavaScript file** that registers itself like this:

```js
(function () {
  var PCP = (window.PCP = window.PCP || {});
  PCP.animations = PCP.animations || {};
  PCP.animations["pressurize-hands-into-pot"] = {
    moment: "pressurize",
    duration: 3200,                    // ms, for the full motion version
    play: function (stage, data) {
      // build inside `stage` only; return:
      return { done: /* Promise that resolves when finished */, skip: function () { /* end now, resolve done */ } };
    }
  };
})();
```

**Inside the stage:**
- Draw only inside `stage`, and remove everything you added before `done` resolves.
- No network: no images, fonts, libraries or `fetch`. Draw with inline SVG, CSS and the Web Animations API (`element.animate`).
- For fonts, use the CSS variables `var(--f-display)` (condensed poster type), `var(--f-mono)` and `var(--f-serif)`, falling back to `Impact`, `monospace` and `Georgia`.

**Motion and speed:**
- Animate only `transform`, `opacity` and `clip-path`. Use at most about 60 moving elements.
- It must stay at 60 frames a second on a mid-range Android phone.

**Size and length:**
- Fit both a 390×844 phone (`narrow: true`) and a 1440×900 desktop.
- Keep the ingredient text readable at both sizes, at least 16px.
- Stay inside the length range for the moment.

**Ending:**
- A tap, a click, Escape or Enter calls `skip()`.
- `skip()` must jump cleanly to a finished frame, then resolve.

**Reduced motion:**
- When `reducedMotion` is true, show one still, finished composition: the pot, the ingredient slips and the PSI. Nothing moves.
- Fade it in and out within 600 ms total, then resolve.

**Accessibility and safety:**
- Put the text "Pressurizing: <ingredients joined with ' + '>" in a visually hidden element with `aria-live="polite"`.
- Nothing flashes faster than 3 times a second.
- Never cover the screen with pure white for more than 100 ms.

**Ownership:**
- The art must be original: no copyrighted characters, no logos, no traced artwork.
- Begin the file with a comment naming the licence `CC0` and the model that wrote it.

## Also deliver

- **`demo.html`**: loads your file and plays it on three sample pots, with the ingredient lists below. It needs buttons for each pot, an empty pot, reduced motion on and off, a phone-sized frame, and skip:
  - A: "a pot of lentils", "the patent on insulin", "a goose with a five-year plan"
  - B: "your grandmother's hands", "a porch light left on"
  - C: "the executives-only lifeboat", "a rent strike", "hot sauce from a gas station"
- **Three short lines:** what you made, how each taste moves, and anything you couldn't do.

Write clean, commented, dependency-free code. No build step.
