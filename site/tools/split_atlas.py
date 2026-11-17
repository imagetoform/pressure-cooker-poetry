"""Cut site/visual/assets/family-atlas-v1.png into one WebP tile per family.

The front door used to download the whole 4 MB sheet and show one cell of it per
tile with CSS. This writes the same cells (same crop boxes app.js used) to
site/visual/assets/tiles/<family-id>.webp, so a visitor only downloads the ten
tiles in the current round.

Needs Pillow (pip install pillow). Not part of the Netlify build: run it by hand
when the atlas changes, then commit the tiles.

    python3 site/tools/split_atlas.py
"""
import json
import re
from pathlib import Path

from PIL import Image

SITE = Path(__file__).resolve().parents[1]
ATLAS = SITE / 'visual/assets/family-atlas-v1.png'
OUT = SITE / 'visual/assets/tiles'

# Column and row edges of the 5 x 6 sheet, and the 5 px inset, exactly as app.js had them.
XS = [0, 249, 479, 704, 930, 1145]
YS = [0, 238, 461, 691, 915, 1133, 1374]
INSET = 5


def family_order():
    """The tile order is the `order` array in adapter.js: tile n is order[n]."""
    src = (SITE / 'visual/adapter.js').read_text()
    m = re.search(r"const order = (\[[^\]]*\]);", src)
    assert m, 'order array not found in adapter.js'
    order = json.loads(m.group(1).replace("'", '"'))
    assert len(order) == 30 and len(set(order)) == 30, 'expected 30 unique family ids'
    return order


def main():
    im = Image.open(ATLAS).convert('RGB')
    assert im.size == (XS[-1], YS[-1]), f'atlas is {im.size}, crop boxes expect {(XS[-1], YS[-1])}'
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for n, fid in enumerate(family_order()):
        col, row = n % 5, n // 5
        box = (XS[col] + INSET, YS[row] + INSET, XS[col + 1] - INSET, YS[row + 1] - INSET)
        path = OUT / f'{fid}.webp'
        im.crop(box).save(path, 'WEBP', quality=86, method=6)
        total += path.stat().st_size
    print(f'tiles: 30 written to {OUT.relative_to(SITE.parent)}, {total // 1024} KB total')


if __name__ == '__main__':
    main()
