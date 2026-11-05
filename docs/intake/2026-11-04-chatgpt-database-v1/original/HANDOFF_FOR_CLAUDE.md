# Claude handoff: PCP database expansion

Use the original `DATABASE_SPEC.md` as the authoritative specification. The generated files are candidate additions, not replacements. **Do not pretend 224 cutout images have been created.**

1. Read the real current site pantry and extract all existing IDs. Report collisions with `ingredients-new.json`; rename conflicts before merging and preserve an old-to-new map.
2. Validate six-category values, unique slugs, taste abbreviations (`sw so sa bi um sp`), 2–4 nonzero tastes, total 8–12. Do not change hidden dartboard behavior.
3. Merge ten movements without overwriting the 18 existing records. Check branches, layouts, motions, textures, color formats, and tags against the source spec.
4. Treat `cutout-shopping-list.json` as an acquisition backlog. Once each artwork is sourced or drawn, convert the record to the runtime section 7 schema: `id,src,fallback,label,family,emo,cats,source,notes`. Store only actual image paths. Record rights and provenance.
5. Build a visual kit for each movement: CSS variables/colors, font stacks (with licensing/fallbacks), button skin, edge-only texture, layout grammar, and motion mapping. These components are NOT supplied as coded UI in this package; do not claim that they are.
6. Add stable tests: same recipe => same room; only hidden controls; poems remain byte-for-byte identical; absent assets use fallback; reduced-motion behaves; Android responsive rendering works.
7. Run seeded tests across thousands of ingredient combinations; audit dartboard ring/wedge distributions, too-frequent overrides, family dominance, duplicate cutouts, and whether `overwhelm` is reachable.
8. Report wedge and blend coverage after merging into the actual production catalog. Compare proposed tags to real art before committing.

## Open items

- Existing ingredient IDs and full existing movement records were not in the supplied spec.
- The spec lists no seed PRNG implementation and no canonical house-stock flavor; preserve existing source implementation.
- Cutout art, fonts, CSS kits, button code, and animations are next-stage implementation tasks.
