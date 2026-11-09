---
done_when: the reader edition uses the founder's rights-cleared cutout library instead of drawn stand-ins, and the founder approves it
next: founder picks one spec (dartboard vs DATABASE_SPEC), decides on intensity-flip fix and wobble size; also tries doodle recognition live
---
# Pressure Cooker Poetry: reader edition

## 2026-11-09 03:44: Wrote handoff markdown

### Done
| Action | Detail |
|--------|--------|
| HANDOFF.md | /root/tasks/pressure-cooker-poetry/HANDOFF.md (sent to founder as pcp-HANDOFF.md): rules, file locations, lead prototype status, spec conflict, dartboard sim + fix, expansion audit, corrections to Gemini's draft, 8 pending decisions, verification checklist |

### Open / notes
- Keep HANDOFF.md current if state changes; it is the briefing for other agents (Gemini/Muse/ChatGPT).

## 2026-11-09 03:42: Answered Gemini's clarification questions (curator sub-agent prompt)

### What was asked
Founder relayed Gemini's 3 questions + a provisional "/refine" prompt for a curation and tagging sub-agent, plus a SPARK idea (critical hit / critical miss asset).

### Done (advice only, no files)
- Flagged errors in Gemini's draft against pcp-dartboard-system.md: says 28 families (should be 20; 28 = expansion-zip movements), stats -3..+3 (spec: 0-10; only the wobble is -3..+3), ingredient values summed (spec: each ingredient throws its own dart, one per layer); missing layer and intensity fields.
- Suggested answers: (1) data-only agent, YAML tag sheets with source and rights, no cropping; (2) use the existing schema exactly, no new variables; (3) compound chaos in ground/bodies/grit only; the Voice layer always has a readability_safe option; the poem is untouched.
- SPARK: OK as a rare intensity-10 grit/motion asset, seed-triggered and reversible, mutating decor only, never the poem or controls.

### Open / notes
- Still blocking: founder must choose dartboard vs DATABASE_SPEC before more tagging.

## 2026-11-09 00:11: Dartboard simulation run

### Done
| Action | Detail |
|--------|--------|
| Spec found | Drive file 1xLiJWCKfQQa3VRjieS901fkoPuYrJSCm pcp-dartboard-system.md: board 0-199, 20 taste-emotion families x10, intensity=(score mod 10)+1, wobble +/-3 scaled by noise/order, 5 dart layers ground/voice/bodies/motion/grit |
| Sim | /root/tasks/pressure-cooker-poetry/dartboard-sim/sim.py; 100k recipes x 4 settings; uniform test pantry |
| Report | appended to cutout-coverage-audit.md (sent to founder) |

### Result
- Spec as written flips intensity at wedge edges: 23% of whisper ingredients land as scream (+/-3), 31% at +/-6. Proposed fix (wobble within wedge, separate family slip) -> 0.6%.
- Slip 15% (+/-3) / 30% (+/-6); deterministic 0 failures; families even; 3-ingredient recipes ~70% motion+grit same family as bodies; Grief<->Ecstasy wrap <1%.
- The expansion zip data does not fit this spec at all (tastes/Plutchik/28 movements vs 20 families/intensity/stats). Two specs in conflict; founder must pick one.

### Open / notes
- Founder decisions: which spec; adopt the fix; wobble size; Grief-Ecstasy wrap intended?; short-recipe rule.

## 2026-11-08 23:41: Audited ingredients-new.json and movements-new.json

### Done
| Action | Detail |
|--------|--------|
| Ingredients | 300 rows, 0 rule violations. Totals only 10/11, never 4 tastes (squeezed intensity); sweet 24.4% of weight vs bitter 11.1%; satire soft spots: "royal order of middle managers", "bureaucracy of invisible workers" |
| Movements | 10 records valid. Grunge Design blurb celebrates distressed surfaces (conflicts with founder's ban); no movement tagged love/submission/disapproval/remorse/overwhelm; 3 with null texture |
| Report | appended to /root/tasks/pressure-cooker-poetry/cutout-coverage-audit.md (sent to founder) |

### Open / notes
- Still not done: seeded dartboard simulation; collision check against live pantry (not available).

## 2026-11-08 23:37: Cutout coverage audit of PCP_Database_Expansion_v1

### What was asked
Founder pasted another AI's ("Auditor") message: it could not open the zip and asked for catalog.json / cutout-shopping-list.json as text to map "20 families x 5 layers x 3 bands" and list Top 10 gaps.

### Done
| Action | Detail |
|--------|--------|
| Fetched | Drive file 1retykCfLVzG6zqcLqLTkCVM2Cavzgyna (PCP_Database_Expansion_v1.zip, 57 KB; several identical copies exist); decoded and unzipped into scratchpad/pcp-db-zip/x/ |
| Audited | cutout-shopping-list.json: 224 proposed records, 28 families, fields id/suggested_filename/label/family/emo/cats/status/source_hint. No layer field, so the Auditor's 5-layer grid doesn't exist; used Plutchik mild/core/intense from emo words |
| Report | /root/tasks/pressure-cooker-poetry/cutout-coverage-audit.md |

### Result
Core band nearly empty (fear/surprise/disgust core = 0, anger core = 2; core total 46 vs mild 142 / intense 138). Disgust absent in 20 of 28 families. Tags look template-generated (each category exactly 28).

### Open / notes
- ingredients-new.json and movements-new.json not audited; no dartboard simulation done.

## 2026-11-08 23:34: Branch pushed to GitHub

### What was asked
Founder: "you can push" (GitHub write access was fixed on their side).

### Done
| Action | Detail |
|--------|--------|
| git push | succeeded: new branch origin/claude/pressure-cooker-poetry-design-hdk1w3 with 5 commits (b8c6a2a, 6e5e6f6, 9e83142, 247684d, acec637) |
| Privacy check | remote tree has 0 corpus.txt / dist/ files; only sample excerpts are public |

### Open / notes
- No pull request opened (founder hasn't asked). Live site untouched.
- Push problem is resolved; earlier "403" notes in this logbook are history now.

## 2026-10-30 22:12: Undo + doodle recognition shipped (artifact v2)

### Done
| Action | Detail |
|--------|--------|
| Built (Studio A) | undo label + Ctrl/Cmd+Z; recognition after 1.1 s rest, 384px PNG only, prompt is a fixed string (I read commission-unauthorized.html ~line 854); local matching of exact 1-4 line passages, threshold 2.6; card shows "looks like: X (Claude's guess)"; 7 s timeout |
| Agent's tests | stub sample -> fork finds Origin at 1440 and 390; null path unchanged; undo; 56-poem integrity; no overflow/errors |
| Published | same URL, version 2, capabilities sample (images: true) |
| Commit | acec637 (0 manuscript lines in source). 5 local commits now, push still 403; patches regenerated: 0001-0005 in scratchpad/patches |
| Comment | replied twice and resolved thread 223235c8 |

### Open / notes
- Real `sample` never exercised (can't run outside the claude.ai viewer). The founder's first use is the real test.


## 2026-10-30 22:07: Founder comment: undo + match what the doodle depicts

### What was asked
Artifact comment (thread 223235c8-5983-4250-b967-88c6f701cdcf, on "step back" button): add an undo button; make the doodle's subject (e.g. a fork) match related writing by meaning, not literal word.

### Decisions
- Recognition via artifact capability `sample` with images (available on this account; checked artifact-capabilities skill, contract 0.2.94). Two-step: Claude sees ONLY the drawing PNG and returns {depicts, confidence, associations}; the page scores exact 1-4 line passages locally. Poems never sent; Claude's words never shown as poetry. Fallback to gesture reading when sample is null/declined/low confidence.
- Footer copy must change from "nothing is posted" to an honest note that drawings go to Claude with permission.
- Republish needs `capabilities: {sample: {images: true}}` on the Artifact publish of dist/commission-unauthorized.html (same file path keeps the URL).

### Done
| Action | Detail |
|--------|--------|
| Delegated | spec sent to Studio A (opus subagent that built the piece) |
| Replied | on the comment thread, explaining the plan; thread left open until shipped |

## 2026-10-30 20:34: Winner refined, verified, published privately

### Done
| Action | Detail |
|--------|--------|
| Refinement (Studio A) | cards no longer block painting; new brush (load/run-out, dry-brush at speed, room-temperature colour); wall-label controls instead of pills; invitation stays until first gesture |
| My verification | own render via wrapper with viewport meta (scratchpad/judge/wrap.html): 3 strokes on desktop answered by exact lines (slow rising -> First Lie I Told Myself; quick level -> What the Institution Does; slow loop -> Forgiveness as Geology); CDP touch on 390x844: paints, page scrollY stays 0, no overflow, no page errors |
| Integrity | Studio A's automated check: all 56 poems equal source. I did not re-run that check myself |
| Published | private artifact https://claude.ai/artifact/Mj2bvbuq51RzBtQZXmKs3E (dist/commission-unauthorized.html, full corpus) |
| Commits | 9e83142 (core + resonance), 247684d (unauthorized); sources checked for 0 full-corpus lines. 4 local commits total (b8c6a2a, 6e5e6f6, 9e83142, 247684d); push still 403; patches in scratchpad/patches |

### Open / notes
- Founder decides: develop this further, or look at the runners-up (Sound Makes Form, Core Sample) too.
- Sound in the winner never listened to; not tested on Safari or a real phone.

## 2026-10-30 20:28: Studios judged: "The Unauthorized Thing" wins

### Done
| Action | Detail |
|--------|--------|
| Studio C | Fable failed (no usage credits, left no files; checked repo glob + scratchpad); relaunched on Haiku -> "Core Sample" (commission-core.html): poems as strata, drill stanzas into your own core, share link #core= |
| Studio B | Sonnet -> "Sound Makes Form" (commission-resonance.html): Chladni plate, tune to a poem's frequency, "My figure" superposes heard plates |
| Studio A | Opus -> "The Unauthorized Thing" (commission-unauthorized.html): paint a mark on a cold wall, gesture kind (slow/quick/rising/looping...) answered by an exact 1-4 line run, opens whole poem; room warms cool->umber; "your wall" kept in localStorage. Its own check: all 56 poems match source exactly |
| My judging | built all three, rendered 1440x900 + 390x844 with a drag gesture (scratchpad/judge/); 0 page errors all; core + resonance phone 980px wide only because the raw file has no viewport meta (artifact wrapper adds it) |

### Result
Winner A. Reasons: the visitor's own mark summons the writing (matches the Arsonist's Gospels thesis), memorable, exact text. B: beautiful idea but my drag left visible noise, reads as particle field. C: a long document; drag selected text.

### Open / notes
- Sent A back for one refinement round: drag starting on answer card, richer strokes, real touch test, replace pill buttons, first screen complete at rest, re-run integrity check.
- Untracked commission-*.html in repo: check they hold only sample text before committing; dist/ stays uncommitted.

## 2026-10-30 20:14: "Begin Again" commission: three independent studios launched

### What was asked
Founder's new commission: start over with total freedom (no need to keep previous interface, decks, generative system or print look). Use the available models as independent creative minds with real disagreement, make it tangible fast, iterate against renders, "surprise me". Keep the writing accurate, accessible, desktop and mobile, and don't replace the live site without approval.

### Done
| Action | Detail |
|--------|--------|
| Launched 3 background agents | Studio A = opus, Studio B = sonnet, Studio C = fable; same brief, no shared framing, no sight of each other |
| Brief bans | letterpress/print/collage/tape/gauges/cooking/ingredient decks/recipes/pressure+entropy sliders/typing meters/bento/questionnaire, starfields, glassmorphism, purple gradients, cream+serif+terracotta |
| Output contract | each writes /home/user/AF/pressure-cooker/commission-<slug>.html with the sample corpus inline; `python3 build.py commission-<slug>.html` gives dist/ with full corpus; screenshots in scratchpad/studio-<slug>/ (never in the repo) |

### Open / notes
- Next: when all three report, render each myself at 1440x900 and 390x844, judge, pick, refine, publish a private artifact. Do not commit dist/ or screenshots.
- Context was ~420k tokens when this started.

## 2026-10-30 18:39: Wrote Muse fusion brief for a one-day build

### What was asked
Founder has Muse (his agent, two versions) on OpenRouter; wants a fusion of suitable models to build the site in the new visionary style, done today.

### Done
| Action | Detail |
|--------|--------|
| Brief | /root/tasks/pressure-cooker-poetry/muse-fusion-brief.md (also sent to founder): role-based fusion (Muse orchestrator + Muse judge, one Builder, a vision Art director on screenshots, an Adversary from a different model family), 6-hour schedule, shared non-negotiable rules, 8 pass/fail gates, role prompts |
| Model research | One web search; found only usage rankings (DeepSeek V4.1 Flash, GLM 5.3 Flash top usage), nothing on design quality, so models were named by family/role, not exact slugs |

### Decisions / reasoning
- Recommended against parallel builds by several models (gives half-sites) and against more ideation panels.
- Recommended direction B (FORME + MAKE-READY features), extending forme.html, not restarting.
- Privacy rule in brief: the full corpus is never sent to OpenRouter models; build with the sample corpus.

### Open / notes
- I cannot run Muse or OpenRouter from this container (no access, no key).
- Founder still owes: direction A/B, big-word authoring, 17 deg diagonal, paper colour.

## 2026-10-30 13:12: Founder shared a second panel report (MAKE-READY); assessment only, nothing built

### What was asked
"How about this one?" Founder pasted another multi-model Session 1 report: ROOM TONE (3D lit room), MAKE-READY (live press run; winner, 87/100), ASSAY OFFICE (poem as measured specimen). It proposes Session 2 = 8 image mockups.

### Done
| Action | Detail |
|--------|--------|
| Assessed | Gave founder a critique; no code written this turn |

### Result / my read (for the next agent)
- MAKE-READY is ~70% the same machine as THE FORME already built (ink passes, recipe strip, Proof = its "Clean Proof", seeded grammar, decks). Genuinely new parts: one monumental "load-bearing" word from the poem cropped by the sheet edge; plates printed in visible passes, slightly out of register; ghost of the previous proof; a proof pile you can restore; whole-lockup rotation (0/90/17 deg); mobile "web press" where scrolling feeds paper.
- Conflicts to resolve with founder: the 17 deg diagonal contradicts FORME's "quoin is the only diagonal"; "load-bearing words" + stanza weights need authored metadata per poem (founder's labor, 56 poems); paper "scans" and commercial fonts (Druk, GT, Lyon, Klim) cost licenses, open substitutes needed; ivory cotton-rag paper is near the cream the founder dislikes.
- Pattern: this is the third panel to land on print/letterpress. Recommended to founder: stop generating more panel reports; decide by looking at running prototypes. Offered to build MAKE-READY as a mode on the FORME engine in a fresh session (/clear first; context was ~390k tokens).
- Image mockups (Session 2) are not something this environment can generate; live renders of real poems are the substitute already used for FORME.

### Open / notes
- Waiting on founder: (1) build MAKE-READY or not, (2) answer on 17 deg diagonal, (3) whether he will mark load-bearing words or accept an automatic pick.

## 2026-10-30 10:06: Built THE FORME prototype (Session 1 winning direction)

### What was asked
Founder pasted a multi-model "Session 1" judge's report (Directions A THE FORME / B MONOLITHIC LOCKUP / C COUNTERFORM; FORME won, with adoptions: Burn = removal, 7:1 + 2.5rem legibility floor, silhouette previews) plus a Session 2 mockup brief, and asked to try it.

### Done
| Action | Detail |
|--------|--------|
| Built | /home/user/AF/pressure-cooker/forme.html: solver (poem reserved first, guillotine/spiral/lattice/column/nested trees, giant cell, wall-biased splits), fills (solid+bite, fit-type, rule stack, line-screen, posterized line-cut, one quoin), shared-rule contours, recipe floor strip, Proof mode, Case drawer with ghost-rule hover preview + per-slug silhouettes, Pressure/Entropy dials, Rack archive, hash routing #forme-BT-ST-GA-74-28-arsonist-5 |
| Decks | 6 authored placeholder ingredients per deck (Burn/Binder/Weather), NOT the founder's live 180-ingredient decks (not available to me) |
| Mockups | Session 2 rendered as live recipes, not images: 1 = BT-ST-GA-74-28, 2 = EM-WX-FG-35-18, 3 = phone width (any recipe) |
| build.py | now `python3 build.py forme.html` -> dist/forme.html |
| Verified | Playwright 1440x900 and 390x844 plus a long poem: no poem overflow (fixed a measure bug: measuring twin lacked poem CSS; now shared `.ptype` class), no horizontal scroll, same recipe -> identical SVG, no console errors |
| Published | private artifact https://claude.ai/artifact/UcZj7ECtkbjHDesHNS15SJ (full corpus) |
| Commit | 6e5e6f6 local; push 403 again; patches 0001/0002 exported to scratchpad/patches |
| Screenshots | FORME test renders in /root/tasks/pressure-cooker-poetry/screenshots/ (moved out of the repo: they show full poem text, never commit) |

### Corrections
- Fit-type width uses DOM measurement (getComputedTextLength) + textLength snap, not build-time precomputed glyph tables as the spec asks. Determinism verified in Chromium only.
- No stanza chaining across cells, no SVG poster export, no OG card, no essay mode yet.
- Newsprint #D9D2C2 used because Session 2 brief specifies it, though the Living Cover brief said the founder dislikes beige/cream. Flagged to founder.

### Open / notes
- Founder to decide: does it read as a locked print or as a Mondrian/bento generator (FORME's own named failure mode)?
- Next build steps if approved: real ingredient manifest, precomputed metrics, stanza chaining, poster export, 200-seed contact-sheet QA gate.

## 2026-10-30 00:43: Push still blocked; patch handed to founder

### What was asked
Stop hook: push the unpushed commit.

### Done
| Action | Detail |
|--------|--------|
| git push | 403 again (Claude GitHub App has no write access to imagetoform/AF) |
| GitHub API test | list_branches works (read); create_branch fails "403 Resource not accessible by integration" (no write) |
| Fallback | commit b8c6a2a exported with git format-patch and sent to the founder as pressure-cooker-reader-edition.patch (no full poems inside; checked) |

### Open / notes
- Still unpushed. Fix: founder reconnects GitHub / installs Claude app with write on imagetoform/AF, then push; or founder applies the patch with `git am`.
- Re-running push without an access change will just 403 again.

## 2026-10-27 06:40: Built reader-driven generative edition

### What was asked
Turn Pressure Cooker Poetry into a responsive, user-based generative design that explores the founder's writing and makes the reader the most important feature.

### Done
| Action | Detail |
|--------|--------|
| Sources read (Google Drive) | arsonist_gospels (1Q9MU51Yzq4OY1Ig0VWtPKURyGr6oWAdLErVCRguT_8M), Genealogy Of Stardust (1MOOm5d9NtoqjJt-UZ8FIFplxlpkSlYifC9m6BdSsYP4), AI Design Handoff & Decision Log, living-cover-handoff.md, semantic lab v0.1 |
| Built | /home/user/AF/pressure-cooker/index.html (single-file engine + UI), build.py, README.md, corpus/corpus.sample.txt |
| Private corpus | /home/user/AF/pressure-cooker/corpus/corpus.txt: 56 poems transcribed verbatim, gitignored (repo imagetoform/AF is PUBLIC; user chose "engine public, poems private") |
| Tested | Playwright at 1440 and 390 wide: no errors, no horizontal scroll; all 4 families reachable |
| Published | private artifact https://claude.ai/artifact/NpnJJGNvgMs25AUK3MBvtP (dist/pressure-cooker.html, full corpus) |
| Commit | local commit on claude/pressure-cooker-poetry-design-hdk1w3 |

### Result
Working reader edition. Design follows the Living Cover brief palette and fonts.

### Open / notes
- PUSH FAILED: 403, Claude GitHub App lacks access to imagetoform/AF. Commit is local only; the container is ephemeral. Push after the user fixes GitHub access.
- Never commit corpus/corpus.txt or dist/.
- Possible next steps: real cutout library (pressure-cooker-cutout-library.zip on Drive, rights audit pending per Nova PCP-0004), shared/opt-in reader responses (Leviathan Within), more axes from Semantic Lab.
