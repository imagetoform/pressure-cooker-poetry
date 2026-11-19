"""Contact sheet of cutouts on a checkerboard, numbered, so a person can judge the cuts.

Usage: python3 tools/cutouts/contact_sheet.py OUT.png [family ...] [--status candidate|kept|all]
Reads library/cutouts/candidates.json and manifest.json.
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL, LABEL, COLS = 300, 44, 4  # override with --cols N --cell PX


def checker(w, h, s=16):
    im = Image.new("RGB", (w, h), (236, 232, 224))
    d = ImageDraw.Draw(im)
    for y in range(0, h, s):
        for x in range((y // s % 2) * s, w, 2 * s):
            d.rectangle([x, y, x + s - 1, y + s - 1], fill=(206, 200, 190))
    return im


def main():
    args = sys.argv[1:]
    status = "candidate"
    if "--status" in args:
        i = args.index("--status"); status = args[i + 1]; del args[i:i + 2]
    global CELL, COLS
    if "--cols" in args:
        i = args.index("--cols"); COLS = int(args[i + 1]); del args[i:i + 2]
    if "--cell" in args:
        i = args.index("--cell"); CELL = int(args[i + 1]); del args[i:i + 2]
    out, fams = args[0], set(args[1:])
    recs = []
    for f in ("candidates.json", "manifest.json"):
        p = os.path.join(REPO, "library", "cutouts", f)
        if os.path.exists(p):
            recs += json.load(open(p))
    uniq = {}
    for r in recs:
        uniq.setdefault(r["id"], r)
    recs = [r for r in uniq.values() if os.path.exists(os.path.join(REPO, r["file"])) and (not fams or r["family"] in fams) and (status == "all" or r.get("status") == status)]
    rows = max(1, (len(recs) + COLS - 1) // COLS)
    sheet = Image.new("RGB", (COLS * CELL, rows * (CELL + LABEL)), (23, 21, 26))
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 13)
    except OSError:
        font = ImageFont.load_default()
    for n, r in enumerate(recs):
        x, y = (n % COLS) * CELL, (n // COLS) * (CELL + LABEL)
        bg = checker(CELL - 8, CELL - 8)
        im = Image.open(os.path.join(REPO, r["file"])).convert("RGBA")
        im.thumbnail((CELL - 20, CELL - 20))
        bg.paste(im, ((bg.width - im.width) // 2, (bg.height - im.height) // 2), im)
        sheet.paste(bg, (x + 4, y + 4))
        d.text((x + 8, y + CELL + 2), "%02d %s" % (n + 1, r["id"][:34]), fill=(243, 234, 219), font=font)
        d.text((x + 8, y + CELL + 20), r.get("status", ""), fill=(228, 239, 101), font=font)
    sheet.save(out)
    print(out, len(recs))
    for n, r in enumerate(recs):
        print("%02d %s" % (n + 1, r["id"]))


if __name__ == "__main__":
    main()
