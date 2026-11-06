"""
Build step: the cutout library goes into the page, and full movements go database-only.

1. Every cutout in library/cutouts/manifest.json (except status "rejected")
   whose PNG exists is copied to dist/assets/cutouts/<id>.png and appended to
   PCP.assets with library: true.
2. A movement is "full" once it has DB_MIN library cutouts. When a room's
   primary movement is full, the genome marks it dbOnly:
     - its cutouts come only from the library (no starter assets),
     - no procedural stand-in drawings (a missing file is simply left out),
     - the layout's painted background art is hidden (bands, discs, glass,
       grain, tape, stamps, scribbles, hairlines); the layout still arranges
       the poem, and the movement's kit (texture, ornaments, button) stays.
   Movements that aren't full keep the old art until they are.
"""
import json, os, shutil

DB_MIN = 6

CSS = """
/* ---- database-only rooms (see site/tools/build_library.py) ---- */
.room.db-only .m-band, .room.db-only .m-disc, .room.db-only .c-cut:not(.cut),
.room.db-only .x-grain, .room.db-only .x-mark, .room.db-only .x-staple, .room.db-only .x-tape, .room.db-only .x-loop,
.room.db-only .l-stamp, .room.db-only .w-ember, .room.db-only .w-hair, .room.db-only .r-glass, .room.db-only .r-halo,
.room.db-only .cut.is-fallback, .room.db-only .x-photo:has(.is-fallback) { display: none !important; }
.room.db-only.fam-ledger { background-image: none; }
.room.db-only .cut img { filter: drop-shadow(2px 3px 0 rgba(0,0,0,.35)); }
"""

def collect(repo_root, dist_dir):
    man_path = os.path.join(repo_root, "library", "cutouts", "manifest.json")
    manifest = json.load(open(man_path, encoding="utf-8")) if os.path.exists(man_path) else []
    out_dir = os.path.join(dist_dir, "assets", "cutouts")
    # Keep the directory itself: OneDrive can make it a reparse point on Windows.
    # Clear only generated PNGs so removed manifest entries leave no stale assets.
    if os.path.isdir(out_dir):
        for name in os.listdir(out_dir):
            if name.endswith(".png"):
                os.unlink(os.path.join(out_dir, name))
    assets, per = [], {}
    for m in manifest:
        if m.get("status") == "rejected": continue
        f = os.path.join(repo_root, m.get("file", ""))
        if not m.get("file") or not os.path.exists(f): continue
        os.makedirs(out_dir, exist_ok=True)
        shutil.copyfile(f, os.path.join(out_dir, m["id"] + ".png"))
        assets.append({"id": m["id"], "src": "assets/cutouts/%s.png" % m["id"], "fallback": m.get("fallback") or "torn",
                       "label": m.get("label", m["id"]), "emo": m.get("emo", []), "cats": m.get("cats", []),
                       "family": m.get("family", ""), "library": True, "stats": {"e": .5, "c": .5, "i": .5, "x": .5}})
        per[m.get("family", "")] = per.get(m.get("family", ""), 0) + 1
    return assets, per

def apply(s, patch, app_marker, repo_root, dist_dir):
    assets, per = collect(repo_root, dist_dir)
    full = sorted(k for k, n in per.items() if n >= DB_MIN)
    s = patch(s, app_marker, "<script>\n(function () { var P = window.PCP = window.PCP || {}; P.DB_MIN = %d;\n"
              "  P.assets = (P.assets || []).concat(%s); })();\n</script>\n" % (DB_MIN, json.dumps(assets, ensure_ascii=False, separators=(",", ":"))) + app_marker,
              "library assets")
    # engine: database-only pool for full movements
    s = patch(s, '''    var assetIds = (darts && (ctx.assets || []).some(function (a) { return a.emo && a.emo.length; }))
      ? PCP.board.pickAssets(R("assets"), darts, ctx.assets, ingCats, imageCount)
      : pickAssets(R("assets"), sem, ctx.assets, ingCats, imageCount);''',
      '''    var libAssets = (ctx.assets || []).filter(function (a) { return a.library; });
    var dbOnly = !!(styles && styles[0]) && libAssets.filter(function (a) { return a.family === styles[0]; }).length >= (PCP.DB_MIN || 6);
    var pool = dbOnly ? libAssets : (ctx.assets || []);
    var assetIds = (darts && pool.some(function (a) { return a.emo && a.emo.length; }))
      ? PCP.board.pickAssets(R("assets"), darts, pool, ingCats, imageCount)
      : pickAssets(R("assets"), sem, pool, ingCats, imageCount);''', "db-only pool")
    s = patch(s, "      styles: styles,\n", "      styles: styles,\n      dbOnly: dbOnly,\n", "genome dbOnly")
    # renderer: no stand-in drawings, and the flag on the room
    s = patch(s, '    var fallback = PCP.graphics.draw(a ? a.fallback : "halftone", r, colors);',
              '    var fallback = ctx.g && ctx.g.dbOnly ? "" : PCP.graphics.draw(a ? a.fallback : "halftone", r, colors);', "db-only no fallback")
    s = patch(s, "    fam.decorate(ctx, deco);\n", "    if (g.dbOnly) room.classList.add(\"db-only\");\n    fam.decorate(ctx, deco);\n", "db-only room flag")
    s = patch(s, "</head>", "<style id=\"pcp-db-only\">" + CSS + "</style>\n</head>", "db-only css")
    print("library: %d cutouts in %d movements; database-only movements (>= %d): %s" % (len(assets), len(per), DB_MIN, ", ".join(full) or "none yet"))
    return s
