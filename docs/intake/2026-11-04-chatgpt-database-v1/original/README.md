# Pressure Cooker Poetry: expansion pack

This package follows `DATABASE_SPEC.md` sections 6–9. It **adds candidates**, not edits to the current production site.

## Files

- `ingredients-new.js` and `.json`: 300 new compact ingredient tuples.
- `movements-new.js` and `.json`: 10 new complete movement records.
- `cutout-shopping-list.js` and `.json`: 224 **proposals**, 8 for each of 28 movement families. These are descriptions, not downloaded images.
- `COVERAGE_REPORT.md`: counts and limitations.
- `HANDOFF_FOR_CLAUDE.md`: integration protocol and acceptance checks.
- `build.py`: reproducible source generator for these files.

## Non-negotiables

Visitors pick only ingredients; no exposed emotion mechanics. Never modify poems. Same recipe and same deployment data should produce same room. Cutouts and movements use **word** emotion tags only. Satire targets institutional power, not its victims.
