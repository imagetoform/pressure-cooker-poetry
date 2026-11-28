#!/usr/bin/env python3
"""Import Brandon's own reviewed-and-accepted cutouts (from his CutoutBatcher library) into the site library.

    python3 tools/cutouts/owner_import.py SRC_DIR BATCH [--sheet contact-sheet.html]

SRC_DIR  a folder of transparent PNGs exactly as they sit in `Documents/PCP Library/cutouts/<BATCH>/`
         on his laptop. Being in that folder IS the acceptance: he culls duds in File Explorer first.
BATCH    the folder name, e.g. "loose 2026-11-23".
--sheet  that folder's `_contact-sheet.html` (written by CutoutBatcher). Gives each cutout's description,
         tags and 5-colour palette. Without it, palette and traits are measured from the pixels.

What it writes
  library/cutouts/owner/<batch-slug>/<id>.webp   web copy: trimmed to the alpha, long side <= 720 px
  library/cutouts/manifest.json                  one record per cutout (merged by id; other records kept)

The PNG masters stay on Brandon's laptop (650 MB is too heavy for git); each record says where.

Nothing here files a cutout under one art movement. Each record carries measured TRAITS instead
(darkness, saturation, warmth, contrast, colourfulness), a KIND (lettering / figure / creature / object),
the edges it was cut off at, emotion-wheel words read from its own description, and a LEAN: how strongly
it pulls toward each of the homepage's six branches. The homepage matches visitors to cutouts on those.
`family` is only a compatibility hint for /lab/cutup/, derived from the lean, never hand-filed.
"""
import argparse, colorsys, hashlib, html, json, re, sys
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parents[2]
MANIFEST = REPO / "library/cutouts/manifest.json"
MAX_SIDE = 720

# Characters owned by litigious megacorporations: Brandon's own rule is to avoid them (library/AGENTS.md).
# They're held out of the site, listed in the record, and his to release.
HOLD = re.compile(r"charlie[ _]brown|peanuts|snoopy|batman|joker|superman|marvel|spider.?man|mickey|minnie|disney|donald[ _]duck|"
                  r"pixar|simpsons|pokemon|pikachu|star[ _]wars|super[ _]mario|nintendo|hello[ _]kitty|sonic[ _]the|"
                  r"merlina|wednesday[ _]addams|cuphead|looney|bugs[ _]bunny|scooby|spongebob|barbie|transformers", re.I)

LEX = [  # (pattern, emotion-wheel words, branch nudges)
 (r"skull|skeleton|death|reaper|grave|coffin|bones?\b|corpse|rotting", ["apprehension", "awe", "pensiveness"], {"ornament": .4, "revolt": .3}),
 (r"devil|demon|horns|vampire|monster|evil|ghost|haunt|creepy|horror|spooky", ["apprehension", "amazement", "aggressiveness"], {"abstract": .4, "excess": .2}),
 (r"clown|circus|cartoon|funny|meme|frog|bunny|rabbit|silly|parody|troll|humou?r|joke", ["distraction", "amazement", "joy"], {"excess": .6}),
 (r"knife|gun|baseball bat|sword|weapon|fight|boxing|riot|fire\b|flame|explosion|stab|teargas|brick", ["aggressiveness", "anger", "vigilance"], {"revolt": .6}),
 (r"organi[sz]e|revolution|power to the people|\brich\b|fascis|fascm|kings|masters|obey|resist|refuse|strike|union|lenin|libertad|"
  r"\bfree\b|freedom|\baid\b|media|\bcops?\b|police|protest|tyrant|anarch|punk|antifascist|disrupt|chain|torch|flag|propaganda",
  ["anger", "disapproval", "anticipation"], {"revolt": .9}),
 (r"love|heart|kiss|cupid|lovers|flower|sunflower|angel|rose|tender|hug", ["love", "serenity", "joy"], {"ornament": .6}),
 (r"woman|pin.?up|portrait|lady|girl|beauty|dancer", ["admiration", "interest"], {"ornament": .3}),
 (r"moon|\bstars?\b|space|rocket|planet|cosmic|galaxy|astronaut|alien|ufo|sun\b", ["awe", "anticipation", "amazement"], {"future": .6, "abstract": .3}),
 (r"robot|machine|televisions?|\btv\b|computer|radio|barcode|digital|screen|circuit|wires?", ["vigilance", "anticipation", "interest"], {"future": .8}),
 (r"\beyes?\b|watching|gaze", ["vigilance", "interest", "apprehension"], {"abstract": .5}),
 (r"book|lettering|text|poster|quote|words|newspaper|magazine|alphabet|font|typography|calligraph|sign\b|sticker", ["interest", "trust"], {"order": .5}),
 (r"tarot|wizard|magic|mystic|occult|witch|cauldron|spell|crystal|zodiac|card", ["awe", "amazement", "interest"], {"abstract": .5, "ornament": .3}),
 (r"\bcats?\b|\bdogs?\b|animal|bird|fish|tiger|snake|insect|bug\b|alligator|shark|mouse|pig\b|crow|raven", ["interest", "joy"], {"excess": .2, "abstract": .2}),
 (r"\bsad|tears|crying|lonely|burnt|broken|alone|grief|mourning", ["sadness", "pensiveness", "grief"], {"ornament": .4}),
 (r"graffiti|tag(?:ging)?\b|spray|stencil|zine|xerox|collage|cut.?out", ["aggressiveness", "interest", "contempt"], {"revolt": .6}),
 (r"skate|bmx|guitar|drums?\b|microphone|band\b|rock|music", ["ecstasy", "anticipation", "aggressiveness"], {"revolt": .3, "excess": .3}),
 (r"helvetica|swiss|grid|minimal|brutalis|architect|geometric", ["interest", "trust", "acceptance"], {"order": .8}),
 (r"vintage|retro|old|antique|gothic|victorian|ornate|blackletter|fraktur|old english", ["admiration", "pensiveness"], {"ornament": .5}),
]

FIGURE = re.compile(r"\b(person|people|man|men|woman|women|human|face|girl|boy|lady|figure|portrait|skull|skeleton|head|hand|hands|body|nude|pin.?up|knight|wizard|witch|angel|devil|clown|robot)\b", re.I)
CREATURE = re.compile(r"\b(cat|cats|dog|dogs|bird|fish|frog|rabbit|bunny|tiger|snake|insect|bug|alligator|shark|mouse|pig|animal|monster|crow|raven)\b", re.I)


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse_sheet(path):
    s = Path(path).read_text(encoding="utf-8")
    out = {}
    for f in re.findall(r"<figure>(.*?)</figure>", s, re.S):
        name = html.unescape(re.search(r"<strong>(.*?)</strong>", f).group(1))
        sw = re.findall(r'background:(#[0-9a-fA-F]{6})" title="([^"]*)"', f)
        d = re.search(r"<p>(.*?)</p>", f)
        out[name] = {"palette": [h for h, _ in sw], "names": [n for _, n in sw],
                     "desc": html.unescape(d.group(1)) if d else "",
                     "tags": [html.unescape(t) for t in re.findall(r"<i>(.*?)</i>", f)]}
    return out


def hex_rgb(h):
    return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))


def measure_palette(im):
    """5 dominant colours of the opaque pixels (used when there's no contact sheet)."""
    small = im.copy(); small.thumbnail((96, 96))
    px = [p[:3] for p in (small.get_flattened_data() if hasattr(small, 'get_flattened_data') else small.getdata()) if p[3] > 160]
    if not px:
        return ["#000000"]
    q = Image.new("RGB", (len(px), 1)); q.putdata(px)
    q = q.quantize(colors=5, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[:15]; counts = sorted(q.getcolors(), reverse=True)
    return ["#%02x%02x%02x" % tuple(pal[i * 3:i * 3 + 3]) for _, i in counts]


def traits(palette):
    hsv = [colorsys.rgb_to_hsv(*hex_rgb(h)) for h in palette]
    lum = [0.2126 * r + 0.7152 * g + 0.0722 * b for r, g, b in (hex_rgb(h) for h in palette)]
    w = [1.0, .8, .6, .45, .35][:len(hsv)]; tw = sum(w)
    sat = sum(s * k for (_, s, v), k in zip(hsv, w)) / tw
    dark = 1 - sum(l * k for l, k in zip(lum, w)) / tw
    warm = sum(k * s * (1 if (h < 0.14 or h > 0.9) else -0.6 if 0.45 < h < 0.75 else 0) for (h, s, v), k in zip(hsv, w)) / tw
    contrast = (max(lum) - min(lum)) if lum else 0
    hues = {round(h * 8) % 8 for h, s, v in hsv if s > .35 and v > .25}
    colorful = min(1, len(hues) / 4 + sat * .5)
    r2 = lambda x: round(max(-1, min(1, x)), 2)
    return {"dark": r2(dark), "sat": r2(sat), "warm": r2(warm), "contrast": r2(contrast), "colorful": r2(colorful)}


def read(text, t, kind, lettering_batch):
    emo, lean = {}, {b: 0.0 for b in ("revolt", "ornament", "abstract", "future", "order", "excess")}
    for pat, words, nudge in LEX:
        if re.search(pat, text, re.I):
            for i, wd in enumerate(words):
                emo[wd] = emo.get(wd, 0) + 3 - i
            for b, v in nudge.items():
                lean[b] += v
    # what the pixels say
    lean["revolt"] += .6 * t["contrast"] + (.3 if t["warm"] > .15 and t["dark"] > .45 else 0)
    lean["ornament"] += .4 * max(0, t["warm"]) + (.3 if .15 < t["sat"] < .55 else 0)
    lean["future"] += .6 * max(0, -t["warm"]) + .2 * t["sat"]
    lean["order"] += .25 * (1 - t["sat"]) * (1 - t["colorful"])
    if t["sat"] < .2 and t["contrast"] > .6:   # black ink on white paper: photocopy, flyer, stencil
        lean["revolt"] += .35
    lean["excess"] += .7 * t["colorful"] + .3 * t["sat"]
    lean["abstract"] += .25
    if kind == "lettering":
        lean["order"] += .3; lean["revolt"] += .3 if lettering_batch else 0
    if t["dark"] > .65 and t["sat"] < .3:
        emo["pensiveness"] = emo.get("pensiveness", 0) + 2
    if t["sat"] > .6 and t["colorful"] > .6:
        emo["ecstasy"] = emo.get("ecstasy", 0) + 2
    if not emo:
        emo = {"interest": 2, "distraction": 1}
    top = max(lean.values()) or 1
    lean = {b: round(v / top, 2) for b, v in lean.items()}
    return [e for e, _ in sorted(emo.items(), key=lambda x: -x[1])[:3]], lean


LEAN_FAMILY = {"revolt": ("punk", "zine-diy"), "ornament": ("art-nouveau", "gothic-revival"), "abstract": ("surrealism", "dada"),
               "future": ("futurism", "cyberpunk"), "order": ("swiss", "brutalism"), "excess": ("pop-art", "maximalism")}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("batch"); ap.add_argument("--sheet")
    a = ap.parse_args()
    src = Path(a.src); bslug = slug(a.batch)
    prefix = "own-" + ("lt" if a.batch.startswith("lettering") else "lz")
    sheet = parse_sheet(a.sheet) if a.sheet else {}
    out = REPO / "library/cutouts/owner" / bslug; out.mkdir(parents=True, exist_ok=True)
    man = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []
    by_id = {m["id"]: m for m in man}
    added = held = skipped = 0
    for png in sorted(src.glob("*.png")):
        m = re.match(r"(?:lettering_alphabet_)?(\d{3})_(\w+?)_(.*)__(\d\d)\.png$", png.name)
        if not m:
            m = re.match(r"(.*?)(?:__(\d\d))?\.png$", png.name)
            num, pin, rest, part = slug(m.group(1))[:24], "", m.group(1), m.group(2) or "00"
        else:
            num, pin, rest, part = m.group(1), m.group(2), m.group(3), m.group(4)
        cid = f"{prefix}-{num}-{part}"
        meta = sheet.get(png.name, {})
        im = Image.open(png).convert("RGBA")
        bbox = im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
        if not bbox or min(bbox[2] - bbox[0], bbox[3] - bbox[1]) < 24:
            skipped += 1; continue
        im = im.crop(bbox)
        w0, h0 = im.size
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        dest = out / (cid + ".webp")
        im.save(dest, "WEBP", quality=80, method=4)
        palette = meta.get("palette") or measure_palette(im)
        t = traits(palette)
        tags = [x for x in meta.get("tags", []) if x not in (a.batch, "pinterest")]
        text_tag = next((x[6:] for x in tags if x.startswith("text: ")), "")
        pin_title = rest.replace("_", " ").replace(" pin page", "").replace(" pin pa", "").strip()
        desc = meta.get("desc") or pin_title
        blob = " ".join([desc, pin_title, " ".join(tags)])
        lettering_batch = a.batch.startswith("lettering")
        kind = ("lettering" if lettering_batch or "lettering" in tags or text_tag else
                "figure" if FIGURE.search(blob) else "creature" if CREATURE.search(blob) else "object")
        emo, lean = read(blob, t, kind, lettering_batch)
        top = max(lean, key=lean.get)
        fam = LEAN_FAMILY[top][1 if (kind == "lettering" or t["dark"] > .6) else 0]
        edges = [e for e in ("top", "bottom", "left", "right") if f"cut-off at {e} edge" in tags]
        shape = "tall" if h0 > w0 * 1.3 else "wide" if w0 > h0 * 1.3 else "squarish"
        rec = {
            "id": cid, "file": str(dest.relative_to(REPO)), "label": desc[:140], "text": text_tag[:120],
            "kind": kind, "shape": shape, "size": [im.width, im.height], "cut": edges,
            "palette": palette[:5], "traits": t, "lean": lean, "emo": emo, "family": fam, "family_is": "derived from lean, not hand-filed",
            "tags": [x for x in tags if not x.startswith("text: ")][:24],
            "source": {"owner": "Brandon", "rights": "owner-supplied", "library": "Documents/PCP Library/cutouts/" + a.batch,
                       "master": png.name, "pinterest_pin": pin, "pin_title": pin_title[:120],
                       "accepted": "reviewed and accepted by Brandon (kept in his cutouts folder), stated 2026-11-28"},
            "status": "kept",
        }
        hit = HOLD.search(blob)
        if hit:
            rec["status"] = "held"; rec["held_why"] = f"names '{hit.group(0)}': megacorp character (his avoid-Disney-and-the-like rule). His call to release."
            held += 1
        else:
            added += 1
        by_id[cid] = rec
    MANIFEST.write_text(json.dumps(sorted(by_id.values(), key=lambda r: r["id"]), indent=1, ensure_ascii=False) + "\n")
    print(f"{a.batch}: {added} kept, {held} held, {skipped} too small/empty; manifest now {len(by_id)}")


if __name__ == "__main__":
    sys.exit(main())
