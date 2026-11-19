"""Split one sheet holding several cutouts (how image AIs usually deliver) into separate PNGs.

Usage: python3 tools/cutouts/split_sheet.py SHEET.png OUT_DIR family-id slug1 slug2 ... [--join PX]

Pieces are found by transparency (or, on a sheet without transparency, by difference from
the flat background colour), ordered left-to-right, top-to-bottom, and saved as
OUT_DIR/<family-id>--<slug>.png. A cutouts.json stub is written for tagging; ingest.py
reads it. --join (default 12 px) merges bits closer than that into one piece
(barbs on a wire, letters on a scrap).
"""
import json, os, sys

import numpy as np
from PIL import Image
from scipy import ndimage


def main():
    args = sys.argv[1:]
    join = 12
    if "--join" in args:
        i = args.index("--join"); join = int(args[i + 1]); del args[i:i + 2]
    sheet, out, fam, slugs = args[0], args[1], args[2], args[3:]
    im = Image.open(sheet).convert("RGBA")
    a = np.asarray(im)
    alpha = a[..., 3]
    if (alpha < 10).mean() > 0.05:
        mask = alpha > 32
    else:  # flat background: whatever differs from the border colour
        rgb = a[..., :3].astype(np.float32)
        b = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3)])
        mask = np.linalg.norm(rgb - np.median(b, axis=0), axis=2) > 18
        alpha = (mask * 255).astype(np.uint8)
    grown = ndimage.binary_dilation(mask, iterations=join)
    labels, n = ndimage.label(grown)
    areas = ndimage.sum(mask, labels, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(areas) if s > mask.size * 0.004]
    objs = ndimage.find_objects(labels)
    boxes = [(objs[k - 1], k) for k in keep]
    # reading order: group into rows by vertical centre, then left to right
    items = sorted(((sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2, sl, k) for sl, k in boxes)
    rows = []
    for it in items:
        if rows and abs(it[0] - rows[-1][0][0]) < im.height * 0.25:
            rows[-1].append(it)
        else:
            rows.append([it])
    ordered = [it for r in rows for it in sorted(r, key=lambda t: t[1])]
    if len(ordered) != len(slugs):
        raise SystemExit("found %d pieces but got %d names; adjust --join" % (len(ordered), len(slugs)))
    os.makedirs(out, exist_ok=True)
    side = []
    for (_, _, sl, k), s in zip(ordered, slugs):
        piece = a.copy()
        piece[..., 3] = np.where(labels == k, alpha, 0)
        crop = Image.fromarray(piece[sl[0], sl[1]], "RGBA")
        name = "%s--%s.png" % (fam, s)
        crop.save(os.path.join(out, name))
        side.append({"file": name, "family": fam, "label": s.replace("-", " "), "emo": [], "cats": [], "notes": ""})
        print(name, crop.size)
    json.dump(side, open(os.path.join(out, "cutouts.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
