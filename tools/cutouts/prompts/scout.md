# Scout: more cutouts worth hunting for

You are scouting for Pressure Cooker Poetry. The site builds a room for each poem out of cutouts from design movements. The more cutouts each movement has, the less any two rooms repeat. Your job is to add to the shopping list.

## The movement

- **{movement_name}** (`{movement_id}`). {movement_blurb}
- **Already on the list for it:** {existing}

## The wheel (the only emotion words allowed)

{wheel}

Blends: {dyads}. Bullseye: `overwhelm`.

**Parts of the wheel this movement's cutouts barely touch yet:** {gaps}

## Propose {count} new cutouts

Each one should be:
- a real kind of image from the movement's period that public-domain collections are likely to hold (Wikimedia Commons, the Art Institute of Chicago, the Library of Congress, the Internet Archive). Use web search to check that such images exist.
- a single shape that can be cut out: an object, figure, sign, building, hand, tool, scrap of type or pattern
- different from what's already on the list
- aimed at the gaps above where it honestly can be
- in keeping with the site: satire aims up at the powerful, never at the people underneath

## Answer

Reply with **only** this JSON, nothing before or after it:

```json
{"cutouts": [{"label": "short plain description, 2 to 6 words", "emo": ["word", "word"], "cats": ["object"], "why": "one sentence"}]}
```
