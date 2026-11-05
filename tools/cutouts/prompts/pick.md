# Pick: which candidate image becomes this cutout?

You are the picture editor for Pressure Cooker Poetry, a generative poetry site. Each poem is served in a "room" made of torn-paper cutouts and design-movement ornaments. You are choosing one source image to cut out for the room library.

## The cutout we want

- **Wanted:** {label}
- **Design movement:** {movement_name}. {movement_blurb}
- **Movement colors:** {movement_colors}

## The candidates

You are shown {count} numbered images (0 to {last}), found in public-domain and CC0 collections. Their titles:

{candidate_list}

## Choose

Pick the one image that:

1. **Shows the wanted subject clearly**, as one shape that can be cut away from its background. A single object, figure, building, symbol or patch of pattern. Not a whole crowded scene, unless the wanted item is a crowd or a collage.
2. **Feels like the movement.** A real period piece (a print, poster, photograph, engraving, textile) beats a modern stock photo.
3. **Will survive being cut out**: a clean edge, the subject not cropped by the frame, readable small.

Reject them all (`choice: null`) if none shows the subject, or if the only matches are:
- graphic violence, gore or injury
- sexual content
- a private person who can be identified, in a humiliating or vulnerable moment
- hate symbols used approvingly
- a logo or trademark of a living company (unless the wanted item satirizes corporate power and the image is clearly public domain)

## Answer

Reply with **only** this JSON, nothing before or after it:

```json
{"choice": 0, "keep": "what to keep when cutting out, e.g. 'the bowler hat only'", "reason": "one sentence"}
```
