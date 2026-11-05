"""
Build step: the design-family kits (library/families/*/*/kit/kit.json) go into the page.

Every kit part is scoped to its movement. The room's recipe picks one part per
kind (see styles.js decorate): body[data-k-button|data-k-texture|data-k-motion]
and .kit-orn.orn-<name> elements. Parts with status "rejected" are left out.
Delivered snippets written in the prompt's looser form (.tex-<m>-N, .orn-<m>-N,
.anim-<m>-N, plain body[data-sty]) are rewritten onto those hooks here.
"""
import glob, json, os, re

BASE_CSS = """
/* ---- kit hooks (see site/tools/build_kits.py) ---- */
.sty-layer .kit-tex { position: absolute; inset: 0; pointer-events: none;
  -webkit-mask: linear-gradient(#000,#000) top / 100% 9% no-repeat, linear-gradient(#000,#000) bottom / 100% 9% no-repeat, linear-gradient(#000,#000) left / 7% 100% no-repeat, linear-gradient(#000,#000) right / 7% 100% no-repeat;
  mask: linear-gradient(#000,#000) top / 100% 9% no-repeat, linear-gradient(#000,#000) bottom / 100% 9% no-repeat, linear-gradient(#000,#000) left / 7% 100% no-repeat, linear-gradient(#000,#000) right / 7% 100% no-repeat; }
.sty-layer .kit-orn { position: absolute !important; pointer-events: none; display: block !important; }  /* delivered ornaments can't pull themselves out of place */
.no-motion .kit-orn { animation: none !important; }
@media (prefers-reduced-motion: reduce) { html:not(.lab) .kit-orn { animation: none !important; } }
"""

def rewrite(css, mid, kind, name):
    scope = 'body[data-sty="%s"]' % mid
    attr = {"button": '[data-k-button="%s"]', "texture": '[data-k-texture="%s"]', "motion": '[data-k-motion="%s"]'}.get(kind)
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    if attr: css = css.replace(scope, scope + attr % name)
    css = re.sub(r"\.sty-tex\.tex-%s-\d+|\.tex-%s-\d+" % (re.escape(mid), re.escape(mid)), ".kit-tex", css)
    css = re.sub(r"\.orn-%s-\d+" % re.escape(mid), ".kit-orn.orn-" + name, css)
    css = re.sub(r"\.anim-%s-\d+" % re.escape(mid), ".kit-orn", css)
    return css

def collect(repo_root):
    index, chunks = {}, []
    for kit_path in sorted(glob.glob(os.path.join(repo_root, "library", "families", "*", "*", "kit", "kit.json"))):
        mid = os.path.basename(os.path.dirname(os.path.dirname(kit_path)))
        for part in json.load(open(kit_path, encoding="utf-8")):
            if part.get("status") == "rejected": continue
            f = os.path.join(repo_root, part["file"])
            if not os.path.exists(f): continue
            css = open(f, encoding="utf-8").read()
            css = re.sub(r"/\*.*?\*/", "", css, flags=re.S).strip() if part.get("canonical") else rewrite(css, mid, part["kind"], part["name"]).strip()
            chunks.append(css)
            index.setdefault(mid, {}).setdefault(part["kind"], []).append(part["name"])
    return index, "\n".join(chunks)

def apply(s, patch, app_marker, repo_root):
    index, css = collect(repo_root)
    s = patch(s, "</head>", "<style id=\"pcp-kits\">\n" + BASE_CSS + css + "\n</style>\n</head>", "kit css")
    s = patch(s, app_marker, "<script>\nwindow.PCP = window.PCP || {}; window.PCP.kits = " + json.dumps(index, separators=(",", ":"), ensure_ascii=False) + ";\n</script>\n" + app_marker, "kit index")
    n = sum(len(v) for k in index.values() for v in k.values())
    print("kits: %d parts in %d movements, %d KB css" % (n, len(index), len(css) // 1024))
    return s
