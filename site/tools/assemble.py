"""Assemble the deployable site into site/public/.

  /              the front door: mission + a big door into Brain Candy (site/landing/)
  /brain-candy/  Brain Candy hub and the Cut-Up Bench (site/brain-candy/, via build_brain_candy.py)
  /read/         plain reading pages for every poem and essay (?poem=<id>, ?essay=<id>)
  /food-bank/    the Food Bank (site/src/foodbank.js on its own page)
  /visual/       shared engine file (runtime.js) the reading pages load poems and essays from

The Kitchen is retired from the public site. build.py still builds it into site/dist/, because the
shared engine file is cut out of that build, but site/dist is no longer published. /kitchen/ is a
small page that forwards old links (#/read/..., #/essays/..., #/food-bank/...) to their new homes.

Run after build.py:  python3 site/tools/build.py && python3 site/tools/assemble.py
"""
import os
import shutil

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(SITE, "public")

shutil.rmtree(PUB, ignore_errors=True)
shutil.copytree(os.path.join(SITE, "landing"), PUB)
shutil.copyfile(os.path.join(SITE, "src", "foodbank.js"), os.path.join(PUB, "food-bank", "foodbank.js"))
n = sum(len(f) for _, _, f in os.walk(PUB))
print(f"assembled {n} files into {PUB}")

# Shared engine file for the reading pages (no Kitchen front door, no collage, no picker).
import build_visual
build_visual.assemble(front=False)

import build_brain_candy
build_brain_candy.assemble(PUB)
