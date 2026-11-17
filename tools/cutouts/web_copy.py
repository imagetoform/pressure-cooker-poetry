"""Make the light WebP copy the site ships, next to each lossless PNG master.

Usage: python3 tools/cutouts/web_copy.py [--all]
Without --all, only cutouts in library/cutouts/manifest.json that have no .webp yet.
The build (site/tools/build_library.py) copies these files as they are, so CI and
Netlify need no image library and the output stays byte-identical.
"""
import json, os, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def make(png):
    web = os.path.splitext(png)[0] + ".webp"
    im = Image.open(png).convert("RGBA")
    im.thumbnail((720, 720), Image.LANCZOS)
    im.save(web, "WEBP", quality=78, method=4)
    return web


def main():
    redo = "--all" in sys.argv
    man = json.load(open(os.path.join(REPO, "library", "cutouts", "manifest.json")))
    n = 0
    for m in man:
        png = os.path.join(REPO, m["file"])
        if os.path.exists(png) and (redo or not os.path.exists(os.path.splitext(png)[0] + ".webp")):
            make(png); n += 1
    print("web copies made:", n)


if __name__ == "__main__":
    main()
