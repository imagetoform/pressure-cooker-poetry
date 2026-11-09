# Prototypes

Experiments built with Claude, moved here from the `imagetoform/AF` repo. None of them is the live site; the live site is `site/`.

| File | What it is |
|---|---|
| `commission-unauthorized.html` | **The Unauthorized Thing**, winner of the "Begin Again" commission. Paint a mark on a cold wall; the poems answer the hand with exact lines that open into the whole poem. Has undo, and optional drawing recognition through claude.ai's `sample` capability. |
| `commission-resonance.html` | Sound Makes Form (runner-up): a Chladni sand plate tuned to each poem's frequency. |
| `commission-core.html` | Core Sample (runner-up): poems as rock strata, drilled into a personal core. |
| `forme.html` | THE FORME: a letterpress lockup where the poem is the one incompressible cell. |
| `reader-edition.html` | The first prototype: a typing reader whose words pick the poem and build the frame. |

Each page carries the 5 public sample excerpts from `corpus/corpus.sample.txt`. To run one with all 56 poems, put the full corpus at `corpus/corpus.txt` (gitignored) and run:

```sh
python3 build.py commission-unauthorized.html   # writes dist/commission-unauthorized.html
```

Background, audits, the dartboard simulation and open decisions: `docs/claude-handoff/HANDOFF.md`.
