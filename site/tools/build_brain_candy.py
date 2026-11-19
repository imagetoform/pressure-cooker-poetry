"""Publish Brain Candy into site/public/brain-candy/.

  /brain-candy/          the hub (site/brain-candy/index.html)
  /brain-candy/bench/    the Cut-Up Bench, built from site/brain-candy/bench/bench.src.html

The bench reads every poem from /visual/runtime.js (the shared engine file), so new poems show up
on the bench without touching this folder. Tool art lives in bench/assets/ with its tip points in
pivots.json; the N+7 dictionary is bench/nouns.json (rebuild it with brain-candy/tools/build_nouns.py).
Called by assemble.py; can also run on its own after assemble.
"""
import json
import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
SRC = SITE / "brain-candy"


def assemble(pub=None):
    pub = Path(pub) if pub else SITE / "public"
    out = pub / "brain-candy"
    (out / "bench" / "assets").mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SRC / "index.html", out / "index.html")
    piv = json.loads((SRC / "bench/assets/pivots.json").read_text())
    art = {}
    for name, v in piv.items():
        shutil.copyfile(SRC / "bench/assets" / f"{name}.webp", out / "bench/assets" / f"{name}.webp")
        art[name] = dict(v, src=f"/brain-candy/bench/assets/{name}.webp")
    page = (SRC / "bench/bench.src.html").read_text()
    for key in ("__ART__", "__NOUNS__"):
        assert page.count(key) == 1, f"{key} placeholder missing"
    page = page.replace("__ART__", json.dumps(art)).replace("__NOUNS__", (SRC / "bench/nouns.json").read_text())
    (out / "bench" / "index.html").write_text(page)
    print(f"brain candy: hub + bench ({len(art)} tools, {len(page)//1024} KB)")


if __name__ == "__main__":
    assemble()
