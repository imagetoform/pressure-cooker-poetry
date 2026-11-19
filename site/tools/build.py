"""Build the whole site into site/public/. This is exactly what Netlify runs:

    python3 site/tools/build.py

What goes where:
  site/landing/   -> /            hand-written pages (front door, Brain Candy, Learning, About, Contact) + _redirects
  site/shared/    -> /shared/     plain.css (reading pages) and prng.js (seeded randomness)
  site/alive/     -> /alive/      the motion engine (alive.js, alive.css) and its lab at /alive/lab/
  site/cutup/     -> /cutup/      the cutup maker: cutup.js (engine), app.js (page), cutup.css; data.js generated here
                                  used by / (front door) and /lab/cutup/ (the same maker plus Brandon's knobs)
  library cutouts -> /assets/cutouts/<id>.webp   every kept cutout in library/cutouts/manifest.json
  content/*.json  -> /poems/ /essays/ /food-bank/  plain reading pages, generated here

Authored writing is printed exactly as stored in content/ (AGENTS.md law 1): text is HTML-escaped,
never re-worded. The output is byte-identical between runs: sorted inputs, no timestamps.
The old Kitchen and its front door were retired on 2026-11-18 (CANON D-31); don't bring them back here.
"""
import html
import json
import re
import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
REPO = SITE.parent
PUB = SITE / "public"
CONTENT = REPO / "content"

NAV = [("/", "Make"), ("/poems/", "Poems"), ("/essays/", "Essays"), ("/learning/", "Learning"), ("/about/", "About")]


def esc(s):
    return html.escape(s, quote=True)


def page(title, body, here, desc=""):
    nav = "".join('<a href="%s"%s>%s</a>' % (u, ' aria-current="page"' if u == here else "", t) for u, t in NAV)
    return ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>%s | Pressure Cooker Poetry</title>%s'
            '<link rel="stylesheet" href="/shared/plain.css"></head>\n'
            '<body><header class="top"><a class="brand" href="/">Pressure Cooker Poetry</a>'
            '<nav aria-label="Main">%s</nav></header>\n<main id="main">\n%s\n</main>\n'
            '<footer class="foot">Free to read. No accounts, no tracking.</footer></body></html>\n'
            % (esc(title), '<meta name="description" content="%s">' % esc(desc) if desc else "", nav, body))


def write(rel, text):
    p = PUB / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


# ---------- poems ----------
def poems():
    items = json.loads((CONTENT / "poems.json").read_text(encoding="utf-8"))
    books = {}
    for p in items:
        books.setdefault(p.get("book") or "Poems", []).append(p)
        stanzas = "\n".join('<p class="stanza">%s</p>' % "<br>\n".join('<span class="line">%s</span>' % esc(l) for l in st)
                            for st in p["stanzas"])
        meta = " · ".join(esc(x) for x in [p.get("author"), p.get("book"), p.get("move")] if x)
        body = ('<article class="reading poem">\n<p class="kicker"><a href="/poems/">Poems</a></p>\n<h1>%s</h1>\n'
                '<p class="meta">%s</p>\n<div class="poem-body">\n%s\n</div>\n</article>' % (esc(p["title"]), meta, stanzas))
        write("poems/%s/index.html" % p["id"], page(p["title"], body, "/poems/"))
    out = ['<h1>Poems</h1>', '<p class="lede">%d poems. Every word as written.</p>' % len(items)]
    for book in books:
        out.append('<section class="shelf"><h2>%s</h2><ol class="list">' % esc(book))
        for p in sorted(books[book], key=lambda p: (p.get("number") or 0, p["id"])):
            first = (p["stanzas"][0][0] if p["stanzas"] and p["stanzas"][0] else "")
            out.append('<li><a href="/poems/%s/">%s</a><span class="first">%s</span></li>' % (p["id"], esc(p["title"]), esc(first)))
        out.append("</ol></section>")
    write("poems/index.html", page("Poems", "\n".join(out), "/poems/"))
    return len(items)


# ---------- essays ----------
def inline(s):
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
    return re.sub(r"\[(\d+)\]", r'<a class="cite" href="#r-\1" aria-label="Source \1">\1</a>', s)


def essay_body(text):
    out = []
    for block in text.split("\n\n"):
        lines = block.split("\n")
        if block.startswith("## "):
            out.append("<h2>%s</h2>" % inline(block[3:]))
        elif all(l.startswith("- ") for l in lines):
            out.append("<ul>%s</ul>" % "".join("<li>%s</li>" % inline(l[2:]) for l in lines))
        else:
            out.append("<p>%s</p>" % "<br>".join(inline(l) for l in lines))
    return "\n".join(out)


def essays():
    items = json.loads((CONTENT / "essays.json").read_text(encoding="utf-8"))
    rows = []
    for e in items:
        rec = "".join('<li id="r-%d">%s <a href="%s">%s</a></li>' % (i + 1, esc(r.get("text", "")), esc(r.get("url", "")), esc(r.get("src", "source")))
                      for i, r in enumerate(e.get("receipts", [])))
        body = ('<article class="reading essay">\n<p class="kicker"><a href="/essays/">Essays</a></p>\n<h1>%s</h1>\n'
                '<p class="dek">%s</p>\n<p class="meta">%s · %s</p>\n%s\n'
                '<section class="receipts"><h2>Sources</h2><ol>%s</ol></section>\n</article>'
                % (esc(e["title"]), esc(e.get("dek", "")), esc(e.get("author", "")), esc(e.get("date", "")), essay_body(e["body"]), rec))
        write("essays/%s/index.html" % e["id"], page(e["title"], body, "/essays/", e.get("dek", "")))
        rows.append('<li><a href="/essays/%s/">%s</a><span class="first">%s</span></li>' % (e["id"], esc(e["title"]), esc(e.get("dek", ""))))
    write("essays/index.html", page("Essays", '<h1>Essays</h1>\n<p class="lede">Arguments with their sources printed underneath.</p>\n<ol class="list">%s</ol>' % "".join(rows), "/essays/"))
    return len(items)


# ---------- food bank ----------
def food_bank():
    data = json.loads((CONTENT / "food-bank.json").read_text(encoding="utf-8"))
    out = ['<h1>The Food Bank</h1>', '<p class="lede">Free learning resources. Anything partly paywalled says so.</p>']
    n = 0
    for a in data["AISLES"]:
        out.append('<section class="shelf" id="%s"><h2>%s</h2><p class="meta">%s</p><ul class="list">' % (esc(a["id"]), esc(a["name"]), esc(a.get("sign", ""))))
        for it in a["items"]:
            n += 1
            out.append('<li><a href="%s">%s</a> <span class="meta">%s · %s</span><span class="first">%s</span></li>'
                       % (esc(it.get("url", "")), esc(it["t"]), esc(it.get("by", "")), esc(it.get("kind", "")), esc(it.get("why", ""))))
        out.append("</ul></section>")
    write("food-bank/index.html", page("The Food Bank", "\n".join(out), "/learning/"))
    return n


# ---------- cutouts + alive lab data ----------
def cutouts():
    man = json.loads((REPO / "library/cutouts/manifest.json").read_text(encoding="utf-8"))
    fams = {f["id"]: f for f in json.loads((REPO / "library/families.json").read_text(encoding="utf-8"))}
    out = PUB / "assets/cutouts"
    out.mkdir(parents=True, exist_ok=True)
    lab = []
    for m in sorted(man, key=lambda m: m["id"]):
        if m.get("status") == "rejected" or not m.get("file"):
            continue
        png = REPO / m["file"]
        web = png.with_suffix(".webp")
        src = web if web.exists() else png
        if not src.exists():
            continue
        shutil.copyfile(src, out / (m["id"] + src.suffix))
        if m.get("family") in fams:
            lab.append({"id": m["id"], "src": "/assets/cutouts/" + m["id"] + src.suffix, "label": m.get("label", ""),
                        "emo": m.get("emo", []), "family": m["family"]})
    families = {k: {"name": f["name"], "colors": f["colors"]} for k, f in sorted(fams.items())}
    (PUB / "alive/cutouts.js").write_text("window.PCP=window.PCP||{};PCP.labData=" + json.dumps({"families": families, "assets": lab}, separators=(",", ":")) + ";\n")
    # Cutup maker sandbox (/lab/cutup/, go-live Step 3): the poems' text exactly as stored, every kept cutout, family colours.
    poems = [{"id": p["id"], "title": p["title"], "book": p.get("book", ""), "stanzas": p["stanzas"]}
             for p in json.loads((CONTENT / "poems.json").read_text(encoding="utf-8"))]
    data = {"poems": poems, "assets": lab, "families": families, "assetBase": "", "poemBase": "/poems/"}
    (PUB / "cutup/data.js").write_text("window.PCP=window.PCP||{};PCP.cutupData=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    return len(lab)


def main():
    shutil.rmtree(PUB, ignore_errors=True)
    shutil.copytree(SITE / "landing", PUB)
    shutil.copytree(SITE / "shared", PUB / "shared")
    shutil.copytree(SITE / "alive", PUB / "alive")
    shutil.copytree(SITE / "cutup", PUB / "cutup")
    print("poems %d, essays %d, food bank %d, cutouts %d" % (poems(), essays(), food_bank(), cutouts()))
    print("built", sum(1 for p in PUB.rglob("*") if p.is_file()), "files into", PUB)


if __name__ == "__main__":
    main()
