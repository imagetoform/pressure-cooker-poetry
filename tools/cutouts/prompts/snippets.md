# Snippets: design code for one movement's kit

You are gathering front-end design code for Pressure Cooker Poetry. Every room on the site is decorated by one or two design movements. Each movement is a kit: button skins, edge textures, motion and ornament. You are adding variations to one kit, so that no two rooms come out quite the same.

## The kit

- **Movement:** {movement_name} (`{movement_id}`). {movement_blurb}
- **Colors:** {movement_colors}
- **Emotions it carries:** {movement_emo}
- **Its motion today:** `{movement_motion}`. **Its layout grammar:** `{movement_layout}`

## Find or write {count} snippets

Use web search to look at how this movement's real work looked and moved: posters, prints, buildings, record sleeves, screens. Then deliver CSS that brings that into a web page.

Each snippet is one of these kinds:
- `button`: a skin for the site's cook button, as a rule for `.btn-cook`
- `texture`: a frame around the room's edge, as a rule for `.sty-tex.tex-{movement_id}-N` (it must keep the centre clear: use `mask` or `border-image`, or paint only near the edges)
- `motion`: a `@keyframes` block plus one class, `.anim-{movement_id}-N`, that uses it
- `ornament`: a pure-CSS shape (gradients, borders, clip-path) for `.orn-{movement_id}-N`

## Rules

1. **Licence.** Either write the CSS yourself (`"license": "CC0", "source_url": ""`), or adapt code published under MIT, Apache-2.0, BSD or CC0, with `source_url` pointing at the exact page and `author` filled in. CodePen's public pens are MIT unless they say otherwise. Never copy code from a site that doesn't state an open licence.
2. **Self-contained.** No `@import`, no `url()` pointing at other sites (a `data:` URL is fine), no JavaScript, no `expression()`, no `behavior`.
3. **Prefix everything** with `body[data-sty="{movement_id}"]` so the snippet only fires in this movement's rooms.
4. **Readable rooms.** Never put pattern behind the poem's text. Keep animation under 8 seconds per loop. Animate only `transform`, `opacity`, `filter` and `clip-path`.
5. **Reduced motion.** Wrap motion in `@media (prefers-reduced-motion: no-preference)`.
6. Be true to the movement. Bauhaus is primary shapes and grids; Art Nouveau is whiplash curves; Punk is photocopier grime.

## Answer

Reply with **only** this JSON, nothing before or after it:

```json
{"snippets": [
  {"name": "short-slug", "kind": "button", "css": "body[data-sty=\"{movement_id}\"] .btn-cook { ... }",
   "license": "CC0", "source_url": "", "author": "", "why": "what in the movement this comes from"}
]}
```
