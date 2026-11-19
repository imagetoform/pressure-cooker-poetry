"""D-42 production architecture gate. Runs locally AND as part of Netlify build.
Prevents obsolete front doors or missing fixed destinations from publishing.
Art quality still requires human review across seeds; these are structural invariants.
"""
from pathlib import Path
import re
import sys

REPO = Path(__file__).resolve().parents[2]
SITE = REPO / "site"
def txt(p):
    f = REPO / p
    assert f.is_file(), f"Missing required D-42 file: {p}"
    return f.read_text(encoding="utf-8")

def require(check, label):
    if not check:
        raise AssertionError("D-42 regression blocked: " + label)

canon = txt("docs/CANON.md")
index = txt("site/landing/index.html")
js = txt("site/landing/mood.js")
css = txt("site/landing/mood.css")
alive = txt("site/alive/alive.js")
build = txt("site/tools/build.py")
require("D-42" in canon and "HARD RESET" in canon, "definitive canon missing")
require("mood.js" in index and 'id="app"' in index and "show-questions" in index, "the question-first entrance was replaced")
require("cutup/app.js" not in index and "site/live" not in index and "kitchen.js" not in index, "obsolete homepage script")
require("const questions=[" in js and "function renderQ()" in js, "questionnaire no longer first")
require("function renderLoading()" in js and "pressure-transition" in js, "animated loading between intake and reveal missing")
require("function renderWorld(" in js and "scoreFamilies" in js and "chooseArt" in js and "PCP.prng.makeRng" in js, "seeded family-driven renderer removed")
require("if(!restore())renderQ()" in js, "direct entry bypasses questionnaire")
require("function restore()" in js and "seed" in js and "revision" in js, "reproducible share links removed")
require("data-layout" in js and "composition-" in js, "structural layout variation removed")
for title, route in [("Brain Candies", "/brain-candy/"), ("My Two Cents", "/my-two-cents/"),
                     ("Contact", "/contact/"), ("Mission Statement", "/about/"),
                     ("Learning Curve", "/learning/")]:
    require(title in js and route in js, f"fixed destination missing: {title}")
require("/the-eye/" in js and "secret-eye" in js, "seed-independent hidden-eye path removed")
require("alive.js" in index and "PCP.alive.attach" in js and ".stage-art" in alive,
        "shared reactive cutout engine disconnected")
require("PCP.alive.listen()" in js and "PCP.alive.still(" in js,
        "opt-in audio or hold-still control removed")
require("prefers-reduced-motion" in css and "pressure-transition" in css,
        "reduced motion / loading screen not styled")
for path in ["site/landing/my-two-cents/index.html","site/landing/the-eye/index.html",
             "site/landing/brain-candy/index.html","site/landing/contact/index.html",
             "site/landing/about/index.html","site/landing/learning/index.html"]:
    require((REPO / path).is_file(), f"dead destination {path}")
require("architecture_contract" in build, "build must invoke its own regression gate")
print("D-42 architecture contract: PASS (questionnaire -> loading -> generated homepage, fixed destinations, eye, alive input, seeded link)")
