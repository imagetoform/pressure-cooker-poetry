# Audit: src/data files added 2026-11-05

Files: `src/data/assets.yaml`, `Assets-1`, `family profiles 9`, `asset records batch 2` (commits e77ff49, 659efc9, 34e6be6, 2ccf910).

Every URL was checked on 2026-11-05: an HTTP request to the file, and Wikimedia Commons' own API for Commons files.

## Result: 0 of 18 asset records can go on the site

| id | type | what the record claims | what is really there |
|---|---|---|---|
| cut-0901 | cutout | Ottobeuren putto, Commons | Commons API: **file does not exist** |
| bg-0902 | background | Met brocade 22614, CC0 | image URL **404** |
| type-0903 | type | archive.org rococo type sample | item page **404** |
| grit-0904 | grit | cracked gold leaf, Commons | File: page **404** |
| fx-0905 | motion | CodePen "anon" pen, MIT | not a real CodePen address (pen ids are short random codes, not names like `rococo-shimmer.css`); **403** |
| type-0906 | type | IM Fell English, "rights: mit" | font file is real, but the licence is **OFL**, not MIT |
| cut-1401 | cutout | muralism hands detail, Commons | Commons API: **file does not exist** |
| bg-1402 | background | Chiapas stucco wall, Commons | File: page **404** |
| type-1403 | type | Taller de Gráfica Popular woodcut lettering, LOC | the file is real, but it is a **1940s news photo of two men at a Department of Justice door**, not a woodcut |
| btn-1404 | button | corrugated metal border, Commons | File: page **404** |
| grit-1405 | grit | peeling paint texture, Commons | File: page **404** |
| cut-1406 | cutout | woodcut maize stalks, LOC | the file is real, but it is a **1940s portrait photo of a woman in an armchair**, not a woodcut |
| cut-1801 | cutout | Cooper Hewitt Bacterio pattern | **404**; Memphis (1981) is under copyright anyway |
| bg-1802 | background | Memphis terrazzo SVG, Commons | File: page **404** |
| type-1803 | type | "Mendoza Bold" Google font | **404**, no such font in google/fonts |
| fx-1804 | motion | CodePen "anon" pen | **403**, invented address |
| type-1805 | type | Spartan Light | **404** (the family was renamed League Spartan) |
| fx-1806 | motion | CodePen "anon" pen | **403**, invented address |

The model that wrote these records made up the file names to look plausible. The pipeline's own rule applies: a record goes in only after its file has been downloaded and looked at.

## What is usable

- **The family profiles** (history, visual_dna, palette, type_cues, motion_cues, whisper, scream, key_makers) are written descriptions, not sources. They are useful as briefs for the scout and the kit generator.
- `assets.yaml` breaks off mid-line at line 237 (`type_cues: [s`), inside "Brutalism". The 19 families before that point parse.
- Two families are new to the site: **Rococo** and **Mexican Muralism & Rasquache**. Both are good public-domain territory: Rococo is 18th century, and much of the Taller de Gráfica Popular and the 1920s–30s murals predate 1931.
- `default_stats {heat, order, noise, weight}` is a second set of dials. The site already has its own hidden dials, so these need a decision about how they map before they can be used.

## Not done

Nothing from these files was published. The live update of 2026-11-05 17:5x carries only material that was already verified: 488 kit parts and 2 constructivism cutouts.
