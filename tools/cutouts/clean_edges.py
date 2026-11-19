"""Remove slivers of neighbouring pieces that an AI left along a cutout's edges.

ONLY for pieces an AI cropped out of a multi-piece sheet. Never run it on pieces made of
scattered bits (confetti, dots, spray splats, star fields): it would trim their outer bits.

Usage: python3 tools/cutouts/clean_edges.py FILE.png [...] [--join PX] [--keep FRACTION]

A fragment is removed when it touches the image border AND is smaller than FRACTION
(default 0.08) of the largest fragment. The main piece and any of its own loose bits
in the middle are kept. The file is re-cropped and overwritten; prints what it removed.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def clean(path, join=6, keep=0.08):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).copy()
    mask = a[..., 3] > 24
    labels, n = ndimage.label(ndimage.binary_dilation(mask, iterations=join))
    if n <= 1:
        return 0
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    big = sizes.max()
    edge = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    drop = [k for k in edge if sizes[k - 1] < big * keep]
    for k in drop:
        a[labels == k, 3] = 0
    out = Image.fromarray(a, "RGBA")
    box = out.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    out.crop(box).save(path, optimize=True)
    return len(drop)


if __name__ == "__main__":
    args = sys.argv[1:]
    join, keep = 6, 0.08
    if "--join" in args:
        i = args.index("--join"); join = int(args[i + 1]); del args[i:i + 2]
    if "--keep" in args:
        i = args.index("--keep"); keep = float(args[i + 1]); del args[i:i + 2]
    for f in args:
        print(f, "removed", clean(f, join, keep))
