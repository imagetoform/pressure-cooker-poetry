#!/usr/bin/env python3
"""Build an offline, review-only visual pinboard and six seeded collage experiments.
No network requests are made by this builder. Nothing touches site/public.
"""
import hashlib
from html import escape
import json
from pathlib import Path
import shutil
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / "out/pcp-atlas"
LIB = ROOT / "library"

def e(value):
    return escape(str(value or ""), quote=True)

def safe_url(value):
    u = urlparse(str(value or ""))
    return value if u.scheme == "https" and u.hostname else "#"

def slug(value):
    return "".join(c if c.isalnum() or c == "-" else "-" for c in str(value).lower())[:90]

def family_samples(manifest, maximum=6):
    targets = ["dada", "punk", "expressionism", "art-nouveau", "surrealism",
               "bauhaus", "constructivism", "swiss", "op-art", "afrofuturism"]
    kept = [a for a in manifest if a.get("status") == "kept" and
            a.get("file") and (ROOT / a["file"]).is_file()]
    families = sorted(set(a.get("family", "") for a in kept), key=str.lower)
    selected = [f for f in targets if f in families]
    selected += [f for f in families if f not in selected]
    cards = []
    used = set()
    for family in selected[:maximum]:
        pool = sorted([a for a in kept if a.get("family") == family], key=lambda a: a["id"])
        pieces = []
        for a in pool:
            if a["id"] not in used:
                pieces.append(a)
                used.add(a["id"])
            if len(pieces) == 3:
                break
        if pieces:
            cards.append((family, pieces))
    return cards

def thumbnail(asset):
    source = ROOT / asset["file"]
    extension = source.suffix.lower()
    if extension not in (".png", ".webp", ".jpg", ".jpeg"):
        return ""
    filename = slug(asset["id"]) + extension
    dest = DEST / "assets" / filename
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, dest)
    return "assets/" + filename

def build():
    DEST.mkdir(parents=True, exist_ok=True)
    discoveries_path = LIB / "atlas/discoveries.json"
    sources_path = LIB / "atlas/sources.json"
    pins = json.loads(discoveries_path.read_text(encoding="utf-8")) if discoveries_path.exists() else []
    sources = json.loads(sources_path.read_text(encoding="utf-8"))
    # Offline fallback ensures hand-provided references are always represented.
    urls = {p.get("url") for p in pins}
    for s in sources:
        if s.get("url") and s["url"] not in urls:
            pins.append({"title": s["title"], "url": s["url"], "platform": s["platform"],
                         "kind": "source-board", "rights": s.get("rights", "reference_only"),
                         "tags": s.get("tags", []), "source_id": s["id"]})
    pins = sorted(pins, key=lambda p: (p.get("platform", ""), p.get("title", "")))
    rows = []
    for pin in pins:
        url = safe_url(pin.get("url"))
        kind = pin.get("kind", "reference")
        tags = pin.get("tags", [])
        platform = pin.get("platform", "web")
        remote_preview = (
            url if urlparse(url).hostname == "cdn.cosmos.so" and
            len(urlparse(url).path.strip("/")) >= 30 else None
        )
        if remote_preview:
            visual = '<img loading="lazy" referrerpolicy="no-referrer" src="' + e(remote_preview) + '" alt="External Cosmos reference preview">'
        else:
            visual = '<span class="glyph">' + e("◧" if kind == "code-repository" else "✦") + '</span>'
        pills = " ".join('<small class="tag">' + e(t) + '</small>' for t in tags[:4])
        rows.append('<article class="pin" data-search="' +
          e(" ".join([pin.get("title",""), platform, kind] + tags).lower()) + '">' +
          '<div class="pin-art">' + visual + '</div><div class="pin-copy">' +
          '<div class="meta">' + e(platform) + " · " + e(kind) + '</div>' +
          '<a href="' + e(url) + '" target="_blank" rel="noopener noreferrer">' +
          e(pin.get("title") or url) + '</a>' +
          '<div class="tags">' + pills + '</div><p class="rights">' +
          e(pin.get("rights", "reference_only")) + '</p></div></article>')
    manifest_path = LIB / "cutouts/manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else []
    experiment_cards = []
    for i, (family, assets) in enumerate(family_samples(manifest)):
        images = []
        for j, a in enumerate(assets):
            local = thumbnail(a)
            if local:
                images.append('<img class="layer layer-' + str(j) + '" src="' + e(local) +
                              '" alt="' + e(a.get("label", "")) + '" loading="lazy">')
        captions = " / ".join(e(a.get("label", "")) for a in assets)
        exp_id = hashlib.sha256(("atlas-v1|" + family + "|" + "|".join(a["id"] for a in assets)).encode()).hexdigest()[:10]
        experiment_cards.append('<article class="experiment variant-' + str(i % 6) + '">' +
            '<div class="collage"><span class="serial">' + e(exp_id) + '</span>' +
            '<div class="paper p1"></div><div class="paper p2"></div>' +
            "".join(images) +
            '<b class="cutword">CUT / REASSEMBLE</b><span class="stamp">' + e(family) + '</span></div>' +
            '<div class="exp-info"><strong>' + e(family.upper()) +
            '</strong><small>Seeded experiment · approved library cutouts</small>' +
            '<p>' + captions + '</p></div></article>')
    css = r"""*{box-sizing:border-box}html{background:#121219;color:#f8f3e8}body{margin:0;font:16px/1.5 system-ui,Arial,sans-serif}a{color:inherit}a:hover{color:#ffe45b}header{border-bottom:6px solid #e8ee42;background:#121219;padding:24px clamp(18px,4vw,60px)}h1{font-size:clamp(2.6rem,9vw,7rem);font-weight:1000;letter-spacing:-.075em;line-height:.95;margin:15px 0;color:#fff;text-transform:uppercase;max-width:1000px}header p{max-width:750px;color:#b9bac5}header .eyebrow{font-size:.82rem;color:#e8ee42;font-weight:900;letter-spacing:.2em}section{padding:25px clamp(18px,4vw,60px)}h2{font:900 clamp(1.5rem,4vw,3rem)/1.05 system-ui;margin:8px 0 22px;text-transform:uppercase;letter-spacing:-.04em}.lede{max-width:850px;color:#c5c4cb}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,225px),1fr));gap:12px}.pin{border:2px solid #54525a;background:#24242b;min-width:0;box-shadow:4px 4px 0 #000}.pin-art{height:180px;background:repeating-linear-gradient(43deg,#342b3d 0 20px,#4a2635 20px 30px,#d8db6e 30px 34px);display:grid;place-items:center;overflow:hidden}.pin-art img{width:100%;height:100%;object-fit:cover}.glyph{font:900 6rem/1 Georgia;filter:drop-shadow(5px 5px 0 #16161d);color:#f8e85b;transform:rotate(-15deg)}.pin-copy{padding:12px}.pin a{font-weight:800;text-decoration-thickness:2px;overflow-wrap:anywhere}.meta{font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:#f6a45d;font-weight:900}.rights{font-size:.72rem;color:#a9a9b2;margin-bottom:0}.tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}.tag{font-size:.64rem;border:1px solid #716d7a;padding:2px 4px}input{border:2px solid #f2efdf;background:#111;color:white;padding:12px;width:min(100%,540px);font:inherit;margin:0 0 16px}input:focus{outline:4px solid #e8ee42}.experiments{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:22px}.experiment{background:#fff;color:#141313;box-shadow:9px 10px 0 #000}.collage{height:370px;position:relative;isolation:isolate;overflow:hidden;background:#ef3e36}.variant-1 .collage{background:#2c75c4}.variant-2 .collage{background:#f2ca40}.variant-3 .collage{background:#7f5a79}.variant-4 .collage{background:#71b4a9}.variant-5 .collage{background:#ca5a2d}.paper{position:absolute;width:85%;height:40%;background:#141414;opacity:.9;clip-path:polygon(0 5%,100% 0,95% 97%,8% 100%);transform:rotate(-12deg);top:16%;left:-12%}.p2{background:#fbf7e4;top:55%;left:23%;transform:rotate(9deg)}.layer{position:absolute;object-fit:contain;max-width:65%;max-height:80%;filter:drop-shadow(8px 7px 1px #0008)}.layer-0{left:14%;top:8%;height:85%;transform:rotate(-12deg)}.layer-1{right:-5%;top:5%;height:64%;transform:rotate(15deg)}.layer-2{left:1%;bottom:-2%;height:47%;transform:rotate(-22deg)}.cutword{position:absolute;left:7%;bottom:25%;font:1000 clamp(1.2rem,5vw,2rem)/1 system-ui;background:#f6e94c;color:#131313;padding:10px;transform:rotate(-4deg);max-width:88%;z-index:6}.stamp{position:absolute;right:-5px;top:18px;font-size:1rem;text-transform:uppercase;writing-mode:vertical-rl;background:#fff;padding:7px;z-index:5}.serial{position:absolute;left:12px;top:8px;color:white;font-size:.72rem;font-weight:bold;z-index:7}.exp-info{padding:16px}.exp-info strong{display:block;font-size:1.3rem}.exp-info small{color:#555}.exp-info p{font-size:.75rem;color:#505050}.pin[hidden]{display:none!important}footer{padding:30px;border-top:4px solid #f1e94e;color:#aaa;font-size:.8rem}::selection{background:#e8ee42;color:#121219}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}"""
    js = """const search=document.querySelector('#search');search.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();document.querySelectorAll('.pin').forEach(p=>p.hidden=!p.dataset.search.includes(q))});"""
    page = ('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<meta name="referrer" content="no-referrer"><title>PCP Visual Atlas · Review Lab</title>' +
            '<style>' + css + '</style><header><div class="eyebrow">PCP // ARCHIVE DIVISION // OFFLINE REVIEW</div>' +
            '<h1>The visual evidence locker</h1><p>Source-first references and seeded graphic experiments. Nothing here automatically goes live.</p></header>' +
            '<main><section><h2>Experimental cutup builds</h2><p class="lede">Composed locally from reviewed repository cutouts. Art-direction drafts only, not the visitor-facing cutup maker.</p>' +
            '<div class="experiments">' + "".join(experiment_cards) + '</div></section><section>' +
            '<h2>Pinned references / discovered code</h2><p class="lede">Every source preserved. Reference-only items are not cleared for publication; code needs a license and a human review. Cosmos image previews are externally loaded only when you open this private HTML gallery.</p>' +
            '<label for="search">Search source, family or technique</label><div><input id="search" type="search" placeholder="Try: motion, dada, cosmos, typography…" autocomplete="off"></div>' +
            '<div class="gallery">' + "".join(rows) + '</div></section></main>' +
            '<footer>Private review artifact · generated without third-party JavaScript or live services · source credits retained</footer>' +
            '<script>' + js + '</script></html>')
    (DEST / "index.html").write_text(page, encoding="utf-8")
    print(json.dumps({"pins": len(pins), "experiments": len(experiment_cards),
                      "destination": str(DEST.relative_to(ROOT))}))

if __name__ == "__main__":
    build()
