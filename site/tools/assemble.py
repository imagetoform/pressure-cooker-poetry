"""Assemble the deployable site into site/public/.

  /          the Gutter Intelligentsia landing (site/landing/, the new front door)
  /kitchen/  the Kitchen, built by build.py into site/dist/

Run after build.py:  python3 site/tools/build.py && python3 site/tools/assemble.py
"""
import os
import shutil

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(SITE, "public")

shutil.rmtree(PUB, ignore_errors=True)
shutil.copytree(os.path.join(SITE, "landing"), PUB)
shutil.copytree(os.path.join(SITE, "dist"), os.path.join(PUB, "kitchen"))
n = sum(len(f) for _, _, f in os.walk(PUB))
print(f"assembled {n} files into {PUB}")
