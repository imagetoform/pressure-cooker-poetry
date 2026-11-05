"""Build the updated pressurecookerpoetry.com index.html.

Reads live/index.html (the page currently in production), applies exact,
asserted string patches, inlines the new CSS/JS from src/, and writes
dist/index.html. Every patch must match exactly once, so a changed
source page fails loudly instead of half-applying.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")


def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()


def patch(s, old, new, label):
    n = s.count(old)
    if n != 1:
        sys.exit(f"patch '{label}': expected 1 match, found {n}")
    return s.replace(old, new)


def main():
    with open(os.path.join(ROOT, "live", "index.html"), encoding="utf-8") as f:
        s = f.read()

    # ---------------- HTML ----------------
    s = patch(s, '    <a href="#/archive" data-route="archive">Archive</a>\n',
              '    <a href="#/archive" data-route="archive">Archive</a>\n'
              '    <a href="#/essays" data-route="essays">Essays</a>\n'
              '    <a href="#/food-bank" data-route="food-bank">Food Bank</a>\n', "nav")
    s = patch(s, "Tap up to three. Each one pushes the dials below.",
              "More than anyone needs. Tap up to three; limit three per customer.", "pantry note")
    s = patch(s, '        <!-- dials -->\n        <section class="panel" aria-labelledby="dialLbl">\n'
                 '          <h2 class="dymo" id="dialLbl">The dials</h2>\n          <div class="dials" id="dials"></div>\n',
              '        <!-- flavor (the dials stay hidden behind the counter) -->\n        <section class="panel" aria-labelledby="dialLbl">\n'
              '          <h2 class="dymo" id="dialLbl">The flavor</h2>\n'
              '          <p class="panel-note">What the pot tastes like right now. You pick the ingredients; the kitchen works the dials behind the counter.</p>\n'
              '          <div class="flavor" id="dials" role="img" aria-label="Flavor of the pot"></div>\n', "flavor panel")
    s = patch(s, '          <button type="button" class="btn-valve" id="valveBtn"><span>Release the valve</span></button>\n        </div>\n',
              '          <button type="button" class="btn-valve" id="valveBtn"><span>Release the valve</span></button>\n        </div>\n'
              '        <div class="coupon-row"><button type="button" class="btn-coupon" id="couponBtn">&#9986; Clip a coupon for this room</button></div>\n',
              "coupon button")
    # test machinery: lab mode only (#/kitchen?lab=1). Visitors only ever choose ingredients.
    s = patch(s, '        <!-- flavor (the dials stay hidden behind the counter) -->\n        <section class="panel" aria-labelledby="dialLbl">',
              '        <!-- flavor + gauge + odds: TEST MACHINERY, lab mode only -->\n        <section class="panel lab-only" aria-labelledby="dialLbl">', "lab flavor")
    s = patch(s, '        <!-- poem -->\n        <section class="panel" aria-labelledby="poemLbl">',
              '        <!-- poem picker: lab mode only (the kitchen picks the poem from the pot) -->\n        <section class="panel lab-only" aria-labelledby="poemLbl">', "lab poem")
    s = patch(s, '        <!-- batch -->\n        <section class="panel" aria-labelledby="batchLbl">',
              '        <!-- batch / seed: lab mode only -->\n        <section class="panel lab-only" aria-labelledby="batchLbl">', "lab batch")
    s = patch(s, '<details class="inspector" id="inspector">', '<details class="inspector lab-only" id="inspector">', "lab inspector")
    s = patch(s, '<!DOCTYPE html>', '<!DOCTYPE html>\n<!--\n  DESIGN LAW (Brandon Rhodes, Nov 2026): visitors ONLY choose ingredients.\n  An absurd, overwhelming pantry is the point (satire of fake abundance).\n  Dials, flavor bars, PSI odds, poem picker, seeds and the inspector are TEST\n  MACHINERY: hidden from visitors, shown only in lab mode (add ?lab=1 or\n  #/kitchen?lab=1 to the URL; lab=0 turns it off). Do not bring them back.\n-->', "design law")
    s = patch(s, '</head>', '<script>\n(function(){try{var q=location.search+location.hash,m=q.match(/[?&]lab=([01])/);if(m){if(m[1]==="1")localStorage.setItem("pcp-lab","1");else localStorage.removeItem("pcp-lab");}if(localStorage.getItem("pcp-lab")==="1")document.documentElement.classList.add("lab");}catch(e){}})();\n</script>\n</head>', "lab switch")
    s = patch(s, '          <option value="energy">Energy</option>\n          <option value="clarity">Clarity</option>\n'
                 '          <option value="intimacy">Intimacy</option>\n          <option value="chaos">Chaos</option>\n',
              "".join(f'          <option value="{k}">{k.capitalize()}</option>\n'
                      for k in ["sweet", "sour", "salty", "bitter", "umami", "spicy"]), "archive sort")
    s = patch(s, '  <!-- ============ HOW ============ -->\n',
              '  <!-- ============ ESSAYS ============ -->\n'
              '  <section class="view view-essays" id="view-essays" data-view="essays" hidden aria-labelledby="essaysHeading">\n'
              '    <div class="essays" id="essays"></div>\n  </section>\n\n'
              '  <!-- ============ FOOD BANK ============ -->\n'
              '  <section class="view view-foodbank" id="view-foodbank" data-view="food-bank" hidden aria-labelledby="foodbankHeading">\n'
              '    <div class="foodbank" id="foodbank"></div>\n  </section>\n\n'
              '  <!-- ============ HOW ============ -->\n', "essays view")

    # ---------------- CSS ----------------
    s = patch(s, "</head>", "<style>\n" + read("extra.css") + "\n</style>\n</head>", "css")

    # ---------------- scripts ----------------
    i = s.index("window.PCP.ingredients = [")
    j = s.index("</script>", i) + len("</script>")
    s = s[:j] + "\n<script>\n" + read("pantry-plus.js") + "\n</script>\n<script>\n" + read("tastes.js") + "\n</script>" + s[j:]

    app_marker = "<script>\n/* =====================================================================\n   PRESSURE COOKER POETRY — APP (UI, state, routing)"
    s = patch(s, app_marker,
              "<script>\n" + read("essays.js") + "\n</script>\n<script>\n" + read("wall.js") + "\n</script>\n<script>\n"
              + read("essays-view.js") + "\n</script>\n<script>\n" + read("foodbank.js") + "\n</script>\n" + app_marker, "pre-app scripts")
    s = patch(s, "</body>", "<script>\n" + read("coupon.js") + "\n</script>\n</body>", "coupon script")

    # ---------------- app patches ----------------
    s = patch(s, "  var ENG = PCP.engine;\n  var h = PCP.h;\n",
              "  var ENG = PCP.engine;\n  var h = PCP.h;\n  var TS = PCP.tastes;\n", "TS var")
    s = patch(s, '"aria-pressed": "false", style: { "--rot": (r.range(-2.2, 2.2)).toFixed(2) + "deg" } }, [ing.text]);\n      b.title = statLine(ing.d);',
              '"aria-pressed": "false", style: { "--rot": (r.range(-2.2, 2.2)).toFixed(2) + "deg" } }, '
              '[h("span", { "class": "tile-text", text: ing.text }), h("span", { "class": "tile-taste", text: TS.tasteLine(ing.t || {}, 2) })]);\n'
              '      b.title = statLine(ing);', "tile")
    s = patch(s, '  function statLine(d) {\n    function s(n) { return (n > 0 ? "+" : "") + n; }\n'
                 '    return "Energy " + s(d.e) + " · Clarity " + s(d.c) + " · Intimacy " + s(d.i) + " · Chaos " + s(d.x);\n  }',
              '  function statLine(ing) {\n    return ing && ing.t ? "Tastes: " + TS.tasteLine(ing.t) : "";\n  }\n'
              '  /* the kitchen picks the poem that tastes closest to the pot (deterministic), unless one was chosen in the Archive */\n'
              '  function pickPoem() {\n'
              '    if (!draft.ingredients.length) return DEFAULT.poemId;\n'
              '    var pot = TS.potFlavor(draft.ingredients, effective());\n'
              '    var scored = DATA.poems.map(function (p) { var f = TS.flavorOf(p.profile), d = 0; TS.LIST.forEach(function (ts) { d += Math.pow((f[ts.key] || 0) - (pot[ts.key] || 0), 2); }); return { id: p.id, d: d }; })\n'
              '      .sort(function (a, b) { return a.d - b.d || (a.id < b.id ? -1 : 1); }).slice(0, 5);\n'
              '    return ENG.makeRng("poem|" + draft.ingredients.slice().sort().join(",")).pick(scored).id;\n'
              '  }', "statLine")
    s = patch(s, 'var b = h("button", { type: "button", "class": "pot-item", "aria-label": "Remove " + ing.text }, [h("span", { text: ing.text }), h("span", { "class": "x", "aria-hidden": "true", text: "×" })]);',
              'var b = h("button", { type: "button", "class": "pot-item", "aria-label": "Remove " + ing.text }, [h("span", null, [ing.text, ing.t ? h("span", { "class": "pot-taste", text: TS.tasteLine(ing.t, 3) }) : null]), h("span", { "class": "x", "aria-hidden": "true", text: "×" })]);',
              "pot tastes")
    s = patch(s, '      draft.ingredients.push(id);\n    }\n    syncConsole();',
              '      draft.ingredients.push(id);\n    }\n    if (!draft.poemPinned) draft.poemId = pickPoem();\n    syncConsole();', "auto poem")
    s = patch(s, '    draft.poemId = p.id; draft.force = null;', '    draft.poemId = p.id; draft.force = null; draft.poemPinned = true;', "pin on cook this")
    s = patch(s, 'ps.addEventListener("change", function () { draft.poemId = ps.value; syncConsole(); });',
              'ps.addEventListener("change", function () { draft.poemId = ps.value; draft.poemPinned = true; syncConsole(); });', "pin on select")
    s = patch(s, '    var wrap = $("pantry");\n    DATA.ingredients.forEach(function (ing) {',
              '    var wrap = $("pantry");\n    var stock = DATA.ingredients.slice();\n'
              '    for (var si = stock.length - 1; si > 0; si--) { var sj = Math.floor(Math.random() * (si + 1)); var st = stock[si]; stock[si] = stock[sj]; stock[sj] = st; } // a fresh mess every visit; rooms stay deterministic\n'
              '    stock.forEach(function (ing) {', "shuffle pantry")
    s = patch(s, 'announce((at >= 0 ? "Removed " : "Added ") + ing.text + ". " + statLine(ing.d) + ".");',
              'announce((at >= 0 ? "Removed " : "Added ") + ing.text + ". " + statLine(ing) + ".");', "announce")

    a = s.index("  function buildDials() {")
    b = s.index("  function word(ax, v)")
    s = s[:a] + '''  function buildDials() {
    var wrap = $("dials");
    TS.LIST.forEach(function (ts) {
      wrap.appendChild(h("div", { "class": "fl-row", "data-taste": ts.key }, [
        h("span", { "class": "fl-k", text: ts.label }),
        h("span", { "class": "fl-bar", "aria-hidden": "true" }, [h("span", { style: { "--c": ts.color, width: "0%" } })]),
        h("span", { "class": "fl-v", text: "0" })
      ]));
    });
  }
''' + s[b:]

    a = s.index('    AXES.forEach(function (ax) {\n      var inp = $("dial-" + ax.key);')
    end_marker = '      inp.style.setProperty("--fill", eff[ax.key] + "%");\n    });\n'
    b = s.index(end_marker, a) + len(end_marker)
    s = s[:a] + '''    // what's in the pot: the tastes the visitor actually chose (capped at 10);
    // an empty pot shows the house stock (or the poem's own flavor after "Cook this")
    var fl = TS.potFlavor(draft.ingredients, eff);
    var flLabel = [];
    TS.LIST.forEach(function (ts) {
      var row = document.querySelector('.fl-row[data-taste="' + ts.key + '"]'); if (!row) return;
      row.querySelector(".fl-bar span").style.width = (fl[ts.key] * 10) + "%";
      row.querySelector(".fl-v").textContent = fl[ts.key];
      flLabel.push(ts.label + " " + fl[ts.key]);
    });
    $("dials").setAttribute("aria-label", "Flavor of the pot, out of 10: " + flLabel.join(", "));
''' + s[b:]

    s = patch(s, '"no ingredients declared — the dials alone"', '"no ingredients — just the house stock"', "pz text")
    s = patch(s, '''    AXES.forEach(function (ax) {
      art.appendChild(h("p", { "class": "nl-row" }, [
        h("span", { "class": "nl-k", text: ax.label }),
        h("span", { "class": "nl-bar", "aria-hidden": "true" }, [h("span", { style: { width: p.profile[ax.key] + "%" } })]),
        h("strong", { text: p.profile[ax.key] + "%" })
      ]));
    });''', '''    var fl = TS.flavorOf(p.profile);
    TS.LIST.forEach(function (ts) {
      art.appendChild(h("p", { "class": "nl-row" }, [
        h("span", { "class": "nl-k", text: ts.label }),
        h("span", { "class": "nl-bar", "aria-hidden": "true" }, [h("span", { style: { width: fl[ts.key] * 10 + "%" } })]),
        h("strong", { text: fl[ts.key] * 10 + "%" })
      ]));
    });''', "nutrition rows")
    s = patch(s, "b.profile[sort] - a.profile[sort]",
              "TS.flavorOf(b.profile)[sort] - TS.flavorOf(a.profile)[sort]", "shelf sort")

    s = patch(s, '    var el = $("reader"); el.innerHTML = "";\n',
              '    var el = $("reader"); el.innerHTML = ""; el.classList.remove("has-wall");\n', "reader reset")
    s = patch(s, '''    p.stanzas.forEach(function (st) { body.appendChild(h("p", { "class": "rd-stz" }, st.reduce(function (acc, line, k) { if (k) acc.push(h("br")); acc.push(line); return acc; }, []))); });
    el.appendChild(body);
''', '''    var wallItems = [], lineNo = 0;
    p.stanzas.forEach(function (st) { body.appendChild(h("p", { "class": "rd-stz" }, st.reduce(function (acc, line, k) { if (k) acc.push(h("br")); var sp = h("span", { "class": "ln" }, [line]); lineNo++; wallItems.push({ text: line, el: sp, where: "line " + lineNo }); acc.push(sp); return acc; }, []))); });
    el.appendChild(body);
    var wallCol = h("div", { "class": "wall-col" });
    el.appendChild(wallCol);
    el.classList.add("has-wall");
    if (PCP.wall) PCP.wall.attach(wallCol, wallItems, { kind: "poem", id: p.id });
''', "reader lines + wall")
    s = patch(s, '    el.appendChild(h("p", { "class": "rd-hint", text: "Tip: the ← and → keys move along the shelf." }));\n',
              '    el.appendChild(h("p", { "class": "rd-hint", text: "Tip: the ← and → keys move along the shelf." }));\n'
              '    if (PCP.foodBank) { var fbs = PCP.foodBank.strip(["poetry", "publish"], "Hungry for more? Free at the Food Bank"); if (fbs) el.appendChild(fbs); }\n',
              "reader food bank strip")

    s = patch(s, '["Declare", "Drop up to three ingredients in the pot and/or set the four dials. Ingredients are shortcuts: each one pushes the dials by a fixed amount you can see on hover."]',
              '["Declare", "Drop up to three ingredients in the pot. Every ingredient carries a flavor, printed on the tile: sweet, sour, salty, bitter, umami, spicy. That is the only thing you choose. The kitchen picks the poem that tastes closest to your pot, unless you chose one in the Archive."]',
              "how declare")
    s = patch(s, '["Pressurize", "The dials become a semantic vector.',
              '["Pressurize", "Behind the counter, flavor turns into four hidden dials (energy, clarity, intimacy, chaos), and the dials become a semantic vector.',
              "how pressurize")
    s = patch(s, '''    el.appendChild(h("h2", { "class": "how-h2", text: "The four dials" }));
    el.appendChild(h("dl", { "class": "how-axes" }, AXES.reduce(function (acc, ax) {
      acc.push(h("dt", { text: ax.label })); acc.push(h("dd", { text: "Drives " + ax.help + ". Low to high: " + ax.words.join(" → ") + "." })); return acc;
    }, [])));''', '''    el.appendChild(h("h2", { "class": "how-h2", text: "The six tastes" }));
    el.appendChild(h("p", { text: "Every ingredient is rated 0 to 10 on six tastes. Each taste point pushes the hidden dials by a fixed amount, so the flavor on the tile is exactly what moves the room. Here is what each taste tends to do:" }));
    el.appendChild(h("dl", { "class": "how-axes" }, TS.LIST.reduce(function (acc, ts) {
      acc.push(h("dt", null, [h("span", { "class": "how-taste-sw", "aria-hidden": "true", style: { "--c": ts.color } }), ts.label]));
      acc.push(h("dd", { text: ts.room.charAt(0).toUpperCase() + ts.room.slice(1) + "." })); return acc;
    }, [])));
    el.appendChild(h("h2", { "class": "how-h2", text: "The drawing wall" }));
    el.appendChild(h("p", { text: "Every poem and essay has a wall in its margin. Draw a mark and the piece answers with the line that tastes closest to it. The wall recognizes about fifteen basic shapes (circle, spiral, zigzag, heart, X and so on) and also reads how you drew: fast or slow, big or small, one stroke or many. Every line is scored from its own words on the same hidden dials. It all runs in your browser; nothing is sent anywhere." }));
    el.appendChild(h("h2", { "class": "how-h2", text: "Coupons" }));
    el.appendChild(h("p", { text: "Clip a coupon in the Batch panel and you get a link to that exact room. The link is the recipe, so it rebuilds the same room forever. Coupons you clip are kept in a drawer in your own browser." }));''',
              "how tastes")
    s = patch(s, '''        h("div", { "class": "how-aff", "aria-label": "Leans: " + ["E", "C", "I", "X"].map(function (k, i) { return AXES[i].label + " " + f.affinity[k]; }).join(", ") }, aff),''',
              '''        h("p", { "class": "how-leans", text: "Tastes " + TS.tasteWords(TS.flavorOf({ energy: 50 + 45 * f.affinity.E, clarity: 50 + 45 * f.affinity.C, intimacy: 50 + 45 * f.affinity.I, chaos: 50 + 45 * f.affinity.X }), 2) }),''',
              "how leans")

    s = patch(s, 'var valid = ["kitchen", "archive", "read", "how"];',
              'var valid = ["kitchen", "archive", "read", "how", "essays", "food-bank"];', "router valid")
    s = patch(s, '    else if (r.view === "how") { renderHow(); document.title = "How it works — Pressure Cooker Poetry"; }\n',
              '    else if (r.view === "how") { renderHow(); document.title = "How it works — Pressure Cooker Poetry"; }\n'
              '    else if (r.view === "essays") { document.title = (PCP.essaysView ? PCP.essaysView.render(r.arg) : "Essays") + " — Pressure Cooker Poetry"; }\n'
              '    else if (r.view === "food-bank") { document.title = (PCP.foodBank ? PCP.foodBank.render(r.arg) : "The Food Bank") + " — Pressure Cooker Poetry"; }\n',
              "router essays")
    s = patch(s, '    if (changed && r.view !== "kitchen") {',
              '    if ((changed || r.view === "essays") && r.view !== "kitchen") {', "essay scroll top")

    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import build_board
    s = build_board.apply(s, patch, read, app_marker)
    import build_kits
    s = build_kits.apply(s, patch, app_marker, os.path.dirname(ROOT))

    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    with open(os.path.join(ROOT, "dist", "index.html"), "w", encoding="utf-8") as f:
        f.write(s)
    print("ok", len(s))


if __name__ == "__main__":
    main()
