"""Bring outside-made cutouts (ChatGPT or any AI image model, Brandon's own art, scans) into the candidate pile.

Usage: python3 tools/cutouts/ingest.py <folder-or-zip> [--source chatgpt|ai|brandon|scan] [--cut none|ink|subject]

Expects image files plus a cutouts.json sidecar listing, for each image:
  {"file": "punk--safety-pin-mouth.png", "family": "punk", "label": "...",
   "emo": ["rage", "contempt", "joy"], "cats": ["absurdity"], "notes": "...",
   "made_with": "model or tool name", "prompt": "the prompt used, if generated"}

Each image is checked (real image, at least 512 px). If it has no transparency it is cut
(--cut ink by default: paper/flat background made transparent). It is then saved like a
harvested cutout, as a CANDIDATE. The sidecar's emotion tags are kept as suggestions.
Nothing reaches the site until contact_sheet.py + promote.py (CANON D-20).
"""
import io, json, os, re, sys, time, zipfile

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from harvest import REPO, family_dir, cut, slug, save_new, MAX_PX  # noqa: E402

LICENSES = {
    "chatgpt": "Original image generated for Pressure Cooker Poetry with ChatGPT, art-directed by Brandon. No third-party artwork copied.",
    "ai": "Original image generated for Pressure Cooker Poetry with an AI image model (see made_with), art-directed by Brandon. No third-party artwork copied.",
    "brandon": "Brandon's own work. All rights his; used on his site.",
    "scan": "Scan from Brandon's own collection. Check source rights before promoting.",
}


def files_from(path):
    if zipfile.is_zipfile(path):
        z = zipfile.ZipFile(path)
        for n in z.namelist():
            if not n.endswith("/"):
                yield os.path.basename(n), z.read(n)
    else:
        for root, _, names in os.walk(path):
            for n in names:
                yield n, open(os.path.join(root, n), "rb").read()


def main():
    args = sys.argv[1:]
    source, mode = "chatgpt", "ink"
    if "--source" in args:
        i = args.index("--source"); source = args[i + 1]; del args[i:i + 2]
    if "--cut" in args:
        i = args.index("--cut"); mode = args[i + 1]; del args[i:i + 2]
    files = dict(files_from(args[0]))
    side = files.get("cutouts.json")
    if not side:
        raise SystemExit("no cutouts.json sidecar: refusing to guess families and tags")
    entries = json.loads(side)
    order = re.findall(r"'([a-z-]+)'", re.search(r"const order = \[([^\]]*)\]",
                       open(os.path.join(REPO, "site", "visual", "adapter.js")).read()).group(1))
    vocab = set(json.load(open(os.path.join(REPO, "library", "catalog.json")))["vocabulary"])
    made = 0
    for e in entries:
        name, fam = e.get("file"), e.get("family")
        problems = []
        if name not in files: problems.append("file missing from delivery")
        if fam not in order: problems.append("unknown family %r" % fam)
        bad = [w for w in e.get("emo", []) if w not in vocab]
        if bad: problems.append("emotions not on the wheel: %s" % bad)
        if problems:
            print("  skip %s: %s" % (name, "; ".join(problems))); continue
        try:
            im = Image.open(io.BytesIO(files[name])); im.load()
        except Exception as err:
            print("  skip %s: not an image (%s)" % (name, err)); continue
        if min(im.size) < 300:
            print("  skip %s: too small %s" % (name, im.size)); continue
        if min(im.size) < 512:
            print("  warn %s: small (%s), will look soft if shown big" % (name, im.size))
        im = im.convert("RGBA")
        alpha = np.asarray(im.getchannel("A"))
        if (alpha < 250).mean() > 0.03 or mode == "none":   # already cut out
            piece = im.crop(im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox() or (0, 0) + im.size)
            piece.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
            how = "delivered with transparency"
        else:
            piece, info = cut(im.convert("RGB"), mode)
            if piece is None:
                print("  skip %s: %s" % (name, info)); continue
            how = "%s mode cut on ingest" % mode
        cid = "%s-%s-%s" % (fam, source, slug(e.get("label") or os.path.splitext(name)[0], 32))
        out = os.path.join(family_dir(fam), "cutouts")
        os.makedirs(out, exist_ok=True)
        rel = os.path.relpath(os.path.join(out, cid + ".png"), REPO)
        piece.save(os.path.join(REPO, rel), optimize=True)
        save_new({
            "id": cid, "family": fam, "file": rel, "status": "candidate",
            "label": (e.get("label") or name)[:80],
            "suggested": {"emo": e.get("emo", []), "cats": e.get("cats", []), "notes": e.get("notes", "")},
            "source": "%s. %s" % (e.get("label") or name, LICENSES[source]),
            "provenance": {"source": source, "object_id": name, "made_with": e.get("made_with"),
                           "prompt": e.get("prompt"), "license": LICENSES[source], "cut": how,
                           "when": time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())},
        })
        made += 1
        print("  + %s" % cid)
    print("ingested %d of %d" % (made, len(entries)))


if __name__ == "__main__":
    main()
