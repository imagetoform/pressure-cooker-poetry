"""Dartboard patches (Nov 4 2026): emotion-tagged cutouts, darts in the
engine, lab panel + #/lab tagger. Called from build.py."""
import json

EMO = {
    "gauge": ["vigilance", "anticipation", "apprehension"],
    "valve": ["anticipation", "interest", "overwhelm"],
    "smokestacks": ["disgust", "pensiveness", "contempt"],
    "kit4-001": ["pensiveness", "serenity"],
    "kit4-002": ["amazement", "overwhelm", "contempt"],
    "halftone-moon": ["serenity", "pensiveness", "love"],
    "torn-scrap": ["grief", "distraction", "remorse"],
    "red-wedge": ["rage", "aggressiveness", "vigilance"],
    "arrow": ["anticipation", "vigilance", "aggressiveness"],
    "registration": ["acceptance", "trust", "interest"],
    "infomercial": ["amazement", "overwhelm", "contempt", "ecstasy"],
    "barcode": ["boredom", "disgust", "submission"],
    "ember-cluster": ["anger", "love", "anticipation"],
    "crow": ["apprehension", "awe", "pensiveness"],
    "eye": ["fear", "vigilance", "disapproval"],
    "rubber-stamp": ["submission", "disapproval", "boredom"],
    "scribble": ["rage", "distraction", "overwhelm"],
    "gear": ["submission", "boredom", "interest"],
    "loaf": ["trust", "love", "serenity"],
}

HOW_STYLES = (
    '    el.appendChild(h("h2", { "class": "how-h2", text: "The style tree" }));\n'
    '    el.appendChild(h("p", { text: "Every room also borrows from design history. Each movement below is tagged with emotions on the same dartboard, and your darts pick one or two of them to layer into the room. The poem itself is never restyled." }));\n'
    '    PCP.styles.TREE.forEach(function (b) {\n'
    '      el.appendChild(h("h3", { "class": "sty-branch", text: b.name }));\n'
    '      el.appendChild(h("dl", { "class": "how-axes sty-list" }, b.movements.reduce(function (acc, m) {\n'
    '        acc.push(h("dt", { text: m.name })); acc.push(h("dd", { text: m.blurb + " Feels like: " + m.emo.join(", ") + "." })); return acc;\n'
    '      }, [])));\n'
    '    });\n'
)

HOW_BOARD = (
    '    el.appendChild(h("h2", { "class": "how-h2", text: "The dartboard" }));\n'
    '    el.appendChild(h("p", { text: "Behind the counter hangs an emotion wheel laid out like a dartboard: joy, trust, fear, '
    'surprise, sadness, disgust, anger and anticipation, each strongest at the center, with blends like love, awe and contempt '
    'in the seams. Every ingredient in your pot is a dart, aimed by its tastes. Every cutout is tagged with emotions, never '
    'numbers, and the room pulls the cutouts that sit closest to where your darts landed." }));\n'
)


def apply(s, patch, read, app_marker):
    # 1. tag the cutout manifest with emotions
    a = s.index("window.PCP.assets = [")
    b = s.index("];", a)
    block = s[a:b]
    for aid, tags in EMO.items():
        i = block.index('{ id: "%s",' % aid)
        j = block.index("cats:", i)
        block = block[:j] + "emo: " + json.dumps(tags) + ", " + block[j:]
    s = s[:a] + block + s[b:]
    s = patch(s, "     cats: [food|object|memory|institution|concept|absurdity] }\n",
              "     emo: [emotion words from the dartboard]   (NO numbers: the wheel decides closeness)\n"
              "     cats: [food|object|memory|institution|concept|absurdity] }\n"
              "   Since Nov 2026 the engine picks cutouts by `emo` (see THE DARTBOARD);\n"
              "   `stats` are only used if no cutout carries emo tags.\n", "asset header")

    # 2. scripts
    t = read("tastes.js")
    i = s.index(t)
    j = s.index("</script>", i) + len("</script>")
    s = s[:j] + "\n<script>\n" + read("board.js") + "\n</script>\n<script>\n" + read("styles.js") + "\n</script>" + s[j:]
    s = patch(s, app_marker, "<script>\n" + read("board-lab.js") + "\n</script>\n" + app_marker, "board-lab script")

    # 3. engine: darts choose the cutouts
    s = patch(s, 'var ENGINE_VERSION = "pcp-engine/1.0";',
              'var ENGINE_VERSION = "pcp-engine/1.1"; // 1.1: cutouts chosen by emotion darts', "engine version")
    s = patch(s, "    // family\n",
              "    // darts + styles (the emotion wheel): thrown first, because a movement can choose the layout grammar\n"
              "    var darts = PCP.board ? PCP.board.throwDarts(recipe.ingredients || [], ctx.ingredients || [], inputs, key) : null;\n"
              "    var styles = (PCP.styles && darts) ? PCP.styles.pick(darts, R(\"styles\")) : [];\n"
              "    var styleLayout = styles.length && PCP.styles.BY_ID[styles[0]] ? PCP.styles.BY_ID[styles[0]].layout : null;\n\n"
              "    // family\n", "engine darts+styles")
    s = patch(s, "    // secondary grammar (used when Dissonance makes grammars collide)\n",
              "    if (!forced && styleLayout && ctx.families.some(function (f) { return f.id === styleLayout; })) familyId = styleLayout;\n"
              "    // secondary grammar (used when Dissonance makes grammars collide)\n", "style layout")
    s = patch(s, '    var assetIds = pickAssets(R("assets"), sem, ctx.assets, ingCats, imageCount);\n',
              '    var assetIds = (darts && (ctx.assets || []).some(function (a) { return a.emo && a.emo.length; }))\n'
              '      ? PCP.board.pickAssets(R("assets"), darts, ctx.assets, ingCats, imageCount)\n'
              '      : pickAssets(R("assets"), sem, ctx.assets, ingCats, imageCount);\n', "engine darts")
    s = patch(s, "      assets: assetIds,\n",
              "      assets: assetIds,\n"
              "      darts: darts ? darts.map(function (d) { return { label: d.label, tags: d.tags, angle: d.angle, r: d.r }; }) : null,\n"
              "      styles: styles,\n",
              "genome darts")

    s = patch(s, "    lastGenome = g;\n", "    lastGenome = g;\n    document.body.setAttribute(\"data-sty\", (g.styles || [])[0] || \"\");\n", "button skin hook")

    # 4. lab console panel + inspector
    s = patch(s, '        <!-- pantry -->\n',
              '        <!-- dartboard: TEST MACHINERY, lab mode only -->\n'
              '        <section class="panel lab-only" aria-labelledby="boardLbl">\n'
              '          <h2 class="dymo" id="boardLbl">The dartboard</h2>\n'
              "          <p class=\"panel-note\">Where the pot's darts land on the emotion wheel, and the cutouts they pulled.</p>\n"
              '          <div class="dartboard" id="dartboard"></div>\n'
              '        </section>\n\n'
              '        <!-- pantry -->\n', "board panel")
    s = patch(s, '    document.body.classList.toggle("has-pending", !!pend);\n',
              '    document.body.classList.toggle("has-pending", !!pend);\n'
              '    if (PCP.boardLab) PCP.boardLab.updatePanel(draftRecipe(), lastGenome);\n', "board panel sync")
    s = patch(s, '["Cutouts", g.assets.join(", ") || "none"],',
              '["Darts", g.darts ? g.darts.map(function (d) { return d.tags.join("+") + " (" + d.label + ")"; }).join(" · ") : "—"],\n'
              '      ["Cutouts", g.assets.join(", ") || "none"],', "inspector darts")

    s = patch(s, '["Darts", ', '["Styles", g.styles && g.styles.length ? g.styles.map(function (id) { return PCP.styles.BY_ID[id].name; }).join(" + ") : "—"],\n      ["Darts", ', "inspector styles")
    s = patch(s, "    fam.build(ctx, content);\n",
              "    if (PCP.styles && g.styles && g.styles.length) PCP.styles.decorate(room, g.styles, function (n) { return E().makeRng(key + \"|\" + n + \"|\" + g.mode); });\n"
              "    fam.build(ctx, content);\n", "render styles")

    # 5. #/lab tagger
    s = patch(s, 'var valid = ["kitchen", "archive", "read", "how", "essays", "food-bank"];',
              'var valid = ["kitchen", "archive", "read", "how", "essays", "food-bank", "lab"];', "router lab")
    s = patch(s, '    else if (r.view === "food-bank")',
              '    else if (r.view === "lab") { if (PCP.boardLab) PCP.boardLab.renderTagger(); document.title = "Lab — Pressure Cooker Poetry"; }\n'
              '    else if (r.view === "food-bank")', "router lab route")
    s = patch(s, '  <!-- ============ HOW ============ -->\n',
              '  <!-- ============ LAB (test machinery) ============ -->\n'
              '  <section class="view view-lab" id="view-lab" data-view="lab" hidden aria-labelledby="labHeading">\n'
              '    <div class="how" id="lab"></div>\n  </section>\n\n'
              '  <!-- ============ HOW ============ -->\n', "lab view")

    # 6. how page
    coupons = '    el.appendChild(h("h2", { "class": "how-h2", text: "Coupons" }));\n'
    s = patch(s, coupons, HOW_BOARD + HOW_STYLES + coupons, "how board")
    return s
