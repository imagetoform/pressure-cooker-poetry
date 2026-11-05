# Tag: what does this cutout feel like?

You are tagging a cutout for Pressure Cooker Poetry. Visitors pick ingredients, the ingredients throw darts at an emotion wheel, and the room pulls in the cutouts tagged closest to where the darts land. Your tags decide which poems this image will sit next to.

## The cutout

- **Shown:** the image attached, background removed (the checkerboard is empty space).
- **It was wanted as:** {label}
- **Design movement:** {movement_name}. {movement_blurb}
- **A first guess at its tags (made without seeing it, often wrong):** {first_guess}

## The wheel: use ONLY these 33 words

Eight wedges, each with three rings, strongest in the middle:

{wheel}

Blends sit on the seams between neighbouring wedges: {dyads}.
`overwhelm` is the bullseye: save it for images that are genuinely too much, like crowds, collages, sale signs and noise.

## How to tag

1. **Look at what the image delivers, not what it is.** The same object reads differently in different contexts. A ski mask on a bank robber in a wanted poster: `aggressiveness`, `apprehension`, `rage`. A ski mask on a smiling kid on a sled: `joy`, `serenity`. A ski mask on a balaclava'd protester under tear gas: `vigilance`, `aggressiveness`, `anger`. A smokestack can be `contempt` (industry) or `pensiveness` (an old mill town).
2. **Read the visual evidence:** posture, gesture, faces, light and shadow, colour temperature, crop, how worn the paper is, what's around it, and what the period would have meant by it.
3. **Tag the feeling even when it's ironic.** An infomercial's fake joy is `ecstasy`, `contempt`, `overwhelm`.
4. **Satire aims up.** Symbols of the powerful (bosses, banks, landlords, police in riot gear, executives, palaces) can carry `contempt`, `disapproval` or `aggressiveness`. Working people, poor people and people in trouble are never the joke.
5. **Never tag from who a person is.** Race, ethnicity, religion, disability, body, poverty and cultural dress are not emotions. Tag what the scene and composition deliver.
6. **Give 2 to 4 words.** One strong word plus one or two softer or blended ones is best, e.g. `["grief", "pensiveness", "remorse"]`.

Also choose:
- `cats`: 0 to 3 ingredient categories it suits, from: {categories}
- `fallback`: the stand-in drawing closest in spirit, if the file ever goes missing. One of: {fallbacks}
- `label`: a plain description of what's actually in the image, up to 8 words

## Answer

Reply with **only** this JSON, nothing before or after it:

```json
{"emo": ["word", "word"], "cats": ["object"], "fallback": "torn", "label": "plain description", "reason": "one or two sentences naming the visual evidence", "people": false, "flags": []}
```

`people`: true if any person is visible. `flags`: add `"check-rights"` if you see a signature, watermark or logo; `"weak-cutout"` if the background removal clearly failed; `"sensitive"` if the image could hurt someone shown in it.
