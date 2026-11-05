#!/usr/bin/env python3
"""
PRESSURE COOKER POETRY: the cutout pipeline.

For each wanted cutout on the shopping list (library/cutouts/shopping-list.json):
  1. FIND  candidates in public-domain / CC0 collections (Wikimedia Commons,
           Art Institute of Chicago, Openverse). No model involved: the
           collections' own licence data is the source of truth.
  2. PICK  a vision model looks at the thumbnails and chooses one (or none).
  3. CUT   the background is removed (rembg), the edge trimmed, the PNG sized.
  4. TAG   the vision model looks at the cutout itself and tags it with 2-4
           words from the site's 33-word wheel, by visual evidence.
  5. FILE  the PNG goes into library/families/<branch>/<movement>/cutouts/,
           the record into library/cutouts/manifest.json (status "new"),
           and the shopping list is marked.

Runs in GitHub Actions (.github/workflows/cutouts.yml), where the internet is
open. Needs OPENROUTER_API_KEY in the environment (a repo secret), except with
--dry-run, which picks the first candidate and keeps the first-guess tags.

Usage:
  python tools/cutouts/run.py --movement punk --limit 8
  python tools/cutouts/run.py --limit 4 --model meta/muse-spark-1.3
  python tools/cutouts/run.py --movement dada --dry-run
"""
import argparse, base64, datetime, io, json, os, re, sys, time, urllib.parse
import requests
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LIB = os.path.join(ROOT, "library")
PROMPTS = os.path.join(os.path.dirname(__file__), "prompts")
UA = "PressureCookerPoetry-cutouts/1.0 (+https://github.com/imagetoform/pressure-cooker-poetry; batch cutouts of public-domain images)"
DEFAULT_MODEL = "google/gemini-3.8-flash"
MAX_DOWNLOAD = 30 * 1024 * 1024
OUT_MAX_PX = 1200

# Only these hosts are ever downloaded from. Everything else is skipped.
ALLOWED_HOSTS = [
    r"upload\.wikimedia\.org", r"commons\.wikimedia\.org",
    r"www\.artic\.edu", r"api\.artic\.edu", r"lakeimagesweb\.artic\.edu",
    r"api\.openverse\.org", r"live\.staticflickr\.com", r"farm\d+\.staticflickr\.com",
    r"images\.metmuseum\.org", r"ids\.si\.edu", r"tile\.loc\.gov", r"www\.loc\.gov",
    r"archive\.org", r"ia\d+\.us\.archive\.org", r"images\.nypl\.org",
]
OK_LICENSES = {"cc0", "pdm", "pd", "public domain"}


# ---------------------------------------------------------------- utilities
def load(path, default=None):
    try:
        with open(path, encoding="utf-8") as f: return json.load(f)
    except FileNotFoundError:
        return default

def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1); f.write("\n")

def host_ok(url):
    h = urllib.parse.urlparse(url).hostname or ""
    return urllib.parse.urlparse(url).scheme == "https" and any(re.fullmatch(p, h) for p in ALLOWED_HOSTS)

def http_get(url, params=None, headers=None, binary=False, timeout=30):
    """GET with a polite user agent, a size cap and an allowlist for binaries."""
    if binary and not host_ok(url): raise ValueError("host not allowed: " + url)
    hd = {"User-Agent": UA, "AIC-User-Agent": UA}; hd.update(headers or {})
    for attempt in range(3):
        r = requests.get(url, params=params, headers=hd, timeout=timeout, stream=binary, allow_redirects=True)
        if r.status_code in (429, 502, 503):
            time.sleep(4 * (attempt + 1)); continue
        r.raise_for_status()
        if binary:
            if not host_ok(r.url): raise ValueError("redirected off the allowlist: " + r.url)
            buf = io.BytesIO()
            for chunk in r.iter_content(65536):
                buf.write(chunk)
                if buf.tell() > MAX_DOWNLOAD: raise ValueError("file too large")
            return buf.getvalue()
        return r.json()
    raise RuntimeError("gave up after retries: " + url)

def strip_html(s): return re.sub(r"<[^>]+>", "", s or "").strip()

def data_url(img, fmt="JPEG", max_px=512):
    img = img.copy(); img.thumbnail((max_px, max_px))
    if fmt == "JPEG" and img.mode != "RGB": img = img.convert("RGB")
    b = io.BytesIO(); img.save(b, fmt, quality=85)
    return "data:image/%s;base64,%s" % (fmt.lower(), base64.b64encode(b.getvalue()).decode())


# ---------------------------------------------------------------- 1. FIND
def find_commons(q, n=8):
    d = http_get("https://commons.wikimedia.org/w/api.php", params={
        "action": "query", "format": "json", "generator": "search", "gsrnamespace": 6,
        "gsrsearch": q + " filetype:bitmap", "gsrlimit": n, "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime", "iiurlwidth": 1600})
    out = []
    for p in (d.get("query", {}).get("pages", {}) or {}).values():
        ii = (p.get("imageinfo") or [{}])[0]; em = ii.get("extmetadata", {})
        lic = (em.get("License", {}).get("value") or em.get("LicenseShortName", {}).get("value") or "").lower()
        short = (em.get("LicenseShortName", {}).get("value") or "").lower()
        if not (lic in OK_LICENSES or "public domain" in short or short.startswith("cc0")): continue
        if ii.get("mime") not in ("image/jpeg", "image/png", "image/tiff", "image/webp"): continue
        out.append({"source": "Wikimedia Commons", "title": p.get("title", "").replace("File:", ""),
                    "creator": strip_html(em.get("Artist", {}).get("value")), "date": strip_html(em.get("DateTimeOriginal", {}).get("value")),
                    "license": em.get("LicenseShortName", {}).get("value") or lic, "license_url": em.get("LicenseUrl", {}).get("value", ""),
                    "page_url": ii.get("descriptionurl", ""), "image_url": ii.get("thumburl") or ii.get("url"),
                    "thumb_url": ii.get("thumburl") or ii.get("url"), "width": ii.get("width"), "height": ii.get("height")})
    return out

def find_aic(q, n=8):
    d = http_get("https://api.artic.edu/api/v1/artworks/search", params={
        "q": q, "query[term][is_public_domain]": "true", "limit": n,
        "fields": "id,title,image_id,artist_display,date_display,is_public_domain"})
    out = []
    for a in d.get("data", []):
        if not a.get("image_id") or not a.get("is_public_domain"): continue
        base = "https://www.artic.edu/iiif/2/%s/full/" % a["image_id"]
        out.append({"source": "Art Institute of Chicago", "title": a.get("title", ""), "creator": a.get("artist_display", ""),
                    "date": a.get("date_display", ""), "license": "CC0 (public domain)", "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                    "page_url": "https://www.artic.edu/artworks/%s" % a["id"], "image_url": base + "1686,/0/default.jpg",
                    "thumb_url": base + "400,/0/default.jpg", "width": None, "height": None})
    return out

def find_openverse(q, n=8):
    d = http_get("https://api.openverse.org/v1/images/", params={"q": q, "license": "cc0,pdm", "page_size": n})
    out = []
    for r in d.get("results", []):
        if (r.get("license") or "").lower() not in ("cc0", "pdm") or not host_ok(r.get("url", "")): continue
        out.append({"source": "Openverse / " + (r.get("provider") or r.get("source") or "?"), "title": r.get("title", ""),
                    "creator": r.get("creator", ""), "date": "", "license": r.get("license", "").upper(), "license_url": r.get("license_url", ""),
                    "page_url": r.get("foreign_landing_url", ""), "image_url": r.get("url"), "thumb_url": r.get("thumbnail") or r.get("url"),
                    "width": r.get("width"), "height": r.get("height")})
    return out

SOURCES = {"commons": find_commons, "aic": find_aic, "openverse": find_openverse}

def find(item, movement, sources, per=6):
    cands, seen, log = [], set(), []
    for q in (item["label"], item["label"] + " " + movement["name"]):
        for name in sources:
            try:
                for c in SOURCES[name](q, per):
                    if c["image_url"] in seen: continue
                    if c.get("width") and c.get("height") and min(c["width"], c["height"]) < 400: continue
                    seen.add(c["image_url"]); cands.append(c)
            except Exception as e:
                log.append("%s: %s" % (name, str(e)[:120]))
        if len(cands) >= 6: break
    return cands[:8], log


# ---------------------------------------------------------------- model calls
def ask_model(model, text, images, web=False, max_tokens=600):
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key: raise RuntimeError("OPENROUTER_API_KEY is not set")
    msgs = []
    if "@preset/" not in model:   # a preset carries its own system prompt; otherwise send ours
        msgs.append({"role": "system", "content": open(os.path.join(PROMPTS, "preset-system.md"), encoding="utf-8").read()})
    content = [{"type": "text", "text": text}] + [{"type": "image_url", "image_url": {"url": u}} for u in images]
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", timeout=120, headers={
        "Authorization": "Bearer " + key, "Content-Type": "application/json", "X-Title": "Pressure Cooker Poetry cutouts"},
        json=dict({"model": model, "temperature": 0.2, "max_tokens": max_tokens, "messages": msgs + [{"role": "user", "content": content}]},
                  **({"tools": [{"type": "openrouter:web_search"}]} if web else {})))
    r.raise_for_status()
    msg = r.json()["choices"][0]["message"]["content"]
    if isinstance(msg, list): msg = "".join(p.get("text", "") for p in msg if isinstance(p, dict))
    m = re.search(r"\{.*\}", msg, re.S)
    if not m: raise ValueError("model gave no JSON: " + msg[:200])
    return json.loads(m.group(0))

def fill(template, **kw):
    for k, v in kw.items(): template = template.replace("{" + k + "}", str(v))
    return template


# ---------------------------------------------------------------- 2. PICK
def pick(item, movement, cands, model, dry):
    if dry: return 0, "dry run: first candidate", ""
    thumbs, kept = [], []
    for c in cands:
        try: thumbs.append(data_url(Image.open(io.BytesIO(http_get(c["thumb_url"], binary=True))))); kept.append(c)
        except Exception: pass
    if not kept: return None, "no thumbnail could be loaded", ""
    cands[:] = kept
    listing = "\n".join("%d. %s (%s, %s)" % (i, c["title"][:90], c["creator"][:40] or "unknown maker", c["source"]) for i, c in enumerate(kept))
    prompt = fill(open(os.path.join(PROMPTS, "pick.md"), encoding="utf-8").read(), label=item["label"], movement_name=movement["name"],
                  movement_blurb=movement["blurb"], movement_colors=" ".join(movement["colors"]), count=len(kept), last=len(kept) - 1, candidate_list=listing)
    ans = ask_model(model, prompt, thumbs)
    ch = ans.get("choice")
    if ch is None or not isinstance(ch, int) or not 0 <= ch < len(kept): return None, ans.get("reason", "no suitable image"), ""
    return ch, ans.get("reason", ""), ans.get("keep", "")



# ---------------------------------------------------------------- crop to the part worth keeping
def valid_box(b):
    try:
        b = [float(x) for x in b]
    except Exception:
        return None
    if len(b) != 4: return None
    x0, y0, x1, y1 = [max(0.0, min(1000.0, v)) for v in b]
    if x1 - x0 < 30 or y1 - y0 < 30: return None          # under 3% a side: not a real box
    return [x0, y0, x1, y1]

def crop_raw(raw, box=None, keep="", model=None, dry=False):
    """Crop the source image to the part to keep. Box from the delivery, else asked of the model, else whole image."""
    img = Image.open(io.BytesIO(raw)); img.load(); img = img.convert("RGB")
    how = "whole image"
    b = valid_box(box) if box is not None else None
    if b: how = "crop from delivery"
    elif keep and model and not dry and os.environ.get("OPENROUTER_API_KEY"):
        try:
            ans = ask_model(model, fill(open(os.path.join(PROMPTS, "crop.md"), encoding="utf-8").read(), keep=keep), [data_url(img, "JPEG", 1024)])
            b = valid_box(ans.get("box")) if ans.get("box") is not None else None
            if b: how = "crop by model"
        except Exception as e:
            how = "whole image (crop failed: %s)" % str(e)[:60]
    if b:
        W, H = img.size
        img = img.crop((int(b[0] * W / 1000), int(b[1] * H / 1000), int(b[2] * W / 1000), int(b[3] * H / 1000)))
    out = io.BytesIO(); img.save(out, "PNG")
    return out.getvalue(), how, b

# ---------------------------------------------------------------- 3. CUT
_session = None
def remove_bg(img):
    global _session
    from rembg import remove, new_session
    if _session is None: _session = new_session(os.environ.get("PCP_REMBG_MODEL", "isnet-general-use"))
    return remove(img, session=_session)

def cut(raw):
    img = Image.open(io.BytesIO(raw)); img.load()
    img = img.convert("RGB"); img.thumbnail((1800, 1800))
    out = remove_bg(img).convert("RGBA")
    alpha = out.getchannel("A")
    box = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    if not box: raise ValueError("background removal left nothing")
    coverage = sum(1 for v in alpha.getdata() if v > 24) / float(alpha.width * alpha.height)
    if coverage < 0.02: raise ValueError("cutout too small (%.1f%% of the image)" % (coverage * 100))
    pad = 8
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(out.width, box[2] + pad), min(out.height, box[3] + pad))
    out = out.crop(box); out.thumbnail((OUT_MAX_PX, OUT_MAX_PX))
    return out, coverage

def on_checker(img, size=768):
    im = img.copy(); im.thumbnail((size, size))
    bg = Image.new("RGB", im.size, (255, 255, 255)); s = 24
    px = bg.load()
    for y in range(im.height):
        for x in range(im.width):
            if ((x // s) + (y // s)) % 2: px[x, y] = (214, 214, 214)
    bg.paste(im, mask=im.getchannel("A"))
    return bg


# ---------------------------------------------------------------- 4. TAG
def resolve(word, cat):
    w = str(word).lower().strip()
    if w in cat["vocabulary"]: return w
    a = cat["aliases"].get(w)
    return a if a in cat["vocabulary"] else None

def tag(item, movement, cutout, cat, model, dry):
    if dry: return {"emo": item["emo"], "cats": item.get("cats", []), "fallback": "torn", "label": item["label"], "reason": "dry run: first guess kept", "people": None, "flags": ["dry-run"]}
    wheel = "\n".join("- %s: %s" % (p["key"], " > ".join(p["ring"][::-1])) for p in cat["petals"])
    prompt = fill(open(os.path.join(PROMPTS, "tag.md"), encoding="utf-8").read(), label=item["label"], movement_name=movement["name"],
                  movement_blurb=movement["blurb"], first_guess=", ".join(item["emo"]), wheel=wheel, dyads=", ".join(cat["dyads"]),
                  categories=", ".join(cat["categories"]), fallbacks=", ".join(cat["fallbacks"]))
    img = data_url(on_checker(cutout), "JPEG", 768)
    for attempt in range(2):
        ans = ask_model(model, prompt, [img])
        emo = [x for x in (resolve(w, cat) for w in ans.get("emo", [])) if x]
        emo = list(dict.fromkeys(emo))[:4]
        if len(emo) >= 2:
            ans["emo"] = emo
            ans["cats"] = [c for c in ans.get("cats", []) if c in cat["categories"]][:3]
            if ans.get("fallback") not in cat["fallbacks"]: ans["fallback"] = "torn"
            ans["label"] = str(ans.get("label") or item["label"])[:80]
            return ans
        prompt += "\n\nYour last answer used words outside the 33-word list. Use only the listed words."
    raise ValueError("model could not tag with the vocabulary")



# ---------------------------------------------------------------- SCOUT: grow the shopping list
def slug(t): return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", t.lower())).strip("-")[:60]

def wheel_text(cat): return "\n".join("- %s: %s" % (p["key"], " > ".join(p["ring"][::-1])) for p in cat["petals"])

def gaps(cat, items):
    """Wedges and blends that this movement's wanted/found cutouts don't touch yet."""
    touched = set()
    for it in items:
        for w in it.get("emo", []):
            for p in cat["petals"]:
                if w in p["ring"]: touched.add(p["key"])
            if w in cat["dyads"]: touched.add(w)
    return [x for x in [p["key"] for p in cat["petals"]] + cat["dyads"] if x not in touched]

def scout(mv, shop, cat, model, count):
    mine = [s for s in shop if s["family"] == mv["id"]]
    prompt = fill(open(os.path.join(PROMPTS, "scout.md"), encoding="utf-8").read(), movement_name=mv["name"], movement_id=mv["id"],
                  movement_blurb=mv["blurb"], existing="; ".join(s["label"] for s in mine) or "nothing yet", wheel=wheel_text(cat),
                  dyads=", ".join(cat["dyads"]), gaps=", ".join(gaps(cat, mine)) or "none, spread evenly", count=count)
    ans = ask_model(model, prompt, [], web=True, max_tokens=2500)
    have, added = {s["id"] for s in shop}, []
    for c in (ans.get("cutouts") or [])[:count]:
        label = str(c.get("label", "")).strip()[:60]
        emo = list(dict.fromkeys(x for x in (resolve(w, cat) for w in c.get("emo", [])) if x))[:4]
        sid = mv["id"] + "-" + slug(label)
        if not label or len(emo) < 2 or sid in have: continue
        item = {"id": sid, "label": label, "family": mv["id"], "emo": emo, "cats": [k for k in c.get("cats", []) if k in cat["categories"]][:3],
                "status": "wanted", "file": sid + ".png", "src": None, "fallback": None, "source": None,
                "notes": "scouted by %s: %s; tags are a first guess" % (model, str(c.get("why", ""))[:160])}
        shop.append(item); have.add(sid); added.append(item)
    return added


# ---------------------------------------------------------------- SNIPPETS: grow a movement's kit
KINDS = {"button", "texture", "motion", "ornament"}
CODE_LICENSES = {"CC0", "MIT", "APACHE-2.0", "BSD", "BSD-2-CLAUSE", "BSD-3-CLAUSE"}
BAD_CSS = [r"@import", r"url\(\s*(?!['\"]?data:)", r"expression\s*\(", r"javascript:", r"behavior\s*:", r"-moz-binding", r"</?\s*(style|script)", r"@font-face"]

def css_rules(css):
    """Top-level selectors outside @keyframes/@media, via a tiny brace scanner."""
    sels, depth, buf, stack = [], 0, "", []
    for ch in css:
        if ch == "{":
            head = buf.strip(); buf = ""
            inside_kf = any(x.startswith("@keyframes") or x.startswith("@-webkit-keyframes") for x in stack)
            if not head.startswith("@") and not inside_kf: sels.append(head)
            stack.append(head); depth += 1
        elif ch == "}":
            if stack: stack.pop()
            depth -= 1; buf = ""
            if depth < 0: raise ValueError("unbalanced braces")
        elif ch == ";" and depth > 0:
            buf = ""
        else:
            buf += ch
    if depth != 0: raise ValueError("unbalanced braces")
    return sels

def check_snippet(sn, mv):
    css = str(sn.get("css", ""))
    if not css or len(css) > 8000: raise ValueError("empty or too long")
    for pat in BAD_CSS:
        if re.search(pat, css, re.I): raise ValueError("not allowed: " + pat)
    scope = 'body[data-sty="%s"]' % mv["id"]
    for sel in css_rules(re.sub(r"/\*.*?\*/", "", css, flags=re.S)):
        for part in sel.split(","):
            if scope not in part.replace("'", '"'): raise ValueError("selector not scoped to the movement: " + part.strip()[:60])
    if sn.get("kind") not in KINDS: raise ValueError("unknown kind")
    lic = str(sn.get("license", "")).upper().replace(" ", "-")
    if lic not in CODE_LICENSES: raise ValueError("licence not allowed: " + lic)
    if lic != "CC0" and not str(sn.get("source_url", "")).startswith("https://"): raise ValueError("borrowed code needs its source URL")
    return css, lic

def snippets(mv, cat, model, count, stamp):
    prompt = fill(open(os.path.join(PROMPTS, "snippets.md"), encoding="utf-8").read(), movement_name=mv["name"], movement_id=mv["id"],
                  movement_blurb=mv["blurb"], movement_colors=" ".join(mv["colors"]), movement_emo=", ".join(mv["emo"]),
                  movement_motion=mv["motion"], movement_layout=mv["layout"] or "none", count=count)
    ans = ask_model(model, prompt, [], web=True, max_tokens=6000)
    kit_dir = os.path.join(LIB, "families", mv["branch"], mv["id"], "kit")
    kit_path = os.path.join(kit_dir, "kit.json"); kit = load(kit_path, [])
    names, made, rejected = {k["name"] for k in kit}, [], []
    for sn in (ans.get("snippets") or [])[:count]:
        name = slug(str(sn.get("name", "")) or "snippet")
        try:
            css, lic = check_snippet(sn, mv)
            base = name; n = 2
            while name in names: name = "%s-%d" % (base, n); n += 1
            rel = "library/families/%s/%s/kit/%s-%s.css" % (mv["branch"], mv["id"], sn["kind"], name)
            head = "/* %s · %s · %s kit\n   licence: %s%s%s\n   why: %s\n   found by %s, %s. Not loaded by the site until reviewed. */\n" % (
                name, sn["kind"], mv["name"], lic, (" · author: " + sn["author"]) if sn.get("author") else "",
                (" · source: " + sn["source_url"]) if sn.get("source_url") else "", str(sn.get("why", "")).replace("*/", "")[:200], model, stamp)
            os.makedirs(kit_dir, exist_ok=True)
            open(os.path.join(ROOT, rel), "w", encoding="utf-8").write(head + css.strip() + "\n")
            kit.append({"name": name, "kind": sn["kind"], "file": rel, "license": lic, "author": sn.get("author", ""),
                        "source_url": sn.get("source_url", ""), "why": sn.get("why", ""), "status": "new", "model": model, "when": stamp})
            names.add(name); made.append(rel)
        except Exception as e:
            rejected.append("%s: %s" % (name, e))
    save(kit_path, kit)
    return made, rejected


# ---------------------------------------------------------------- INTAKE: a delivery from another agent (e.g. Superbot)
PD_WORDS = ("public domain", "cc0", "pdm", "no known copyright", "no known restrictions")

def intake(cat, MOV, shop, manifest, stamp, model=None):
    """library/intake/*.json -> checked, cut, filed. Tags come from the delivering agent's tagger."""
    in_dir = os.path.join(LIB, "intake"); done_dir = os.path.join(in_dir, "done")
    made, lines, have = [], [], {m["id"] for m in manifest}
    for fn in sorted(f for f in os.listdir(in_dir) if f.endswith(".json")) if os.path.isdir(in_dir) else []:
        path = os.path.join(in_dir, fn); d = load(path, {}) or {}
        who = d.get("made_by") or {}; dropped = []
        for c in d.get("cutouts", []):
            cid = slug(str(c.get("id", "")))
            try:
                mv = MOV.get(c.get("family") or d.get("movement"))
                if not mv: raise ValueError("unknown movement")
                if not cid or cid in have: raise ValueError("missing or duplicate id")
                emo = list(dict.fromkeys(x for x in (resolve(w, cat) for w in c.get("emo", [])) if x))[:4]
                if len(emo) < 2: raise ValueError("fewer than 2 wheel words")
                lic = str(c.get("license", "")).lower()
                if not any(w in lic for w in PD_WORDS): raise ValueError("licence not public domain / CC0: " + lic[:40])
                if not host_ok(str(c.get("image_url", ""))): raise ValueError("image host not on the allowlist")
                if not str(c.get("page_url", "")).startswith("https://"): raise ValueError("no source page")
                raw, how, box = crop_raw(http_get(c["image_url"], binary=True), c.get("crop"), str(c.get("keep", "")), model)
                cutout, cov = cut(raw)
                rel = "library/families/%s/%s/cutouts/%s.png" % (mv["branch"], mv["id"], cid)
                os.makedirs(os.path.dirname(os.path.join(ROOT, rel)), exist_ok=True); cutout.save(os.path.join(ROOT, rel), optimize=True)
                fb = c.get("fallback") if c.get("fallback") in cat["fallbacks"] else "torn"
                credit = ", ".join(x for x in [str(c.get("label", ""))[:80], str(c.get("creator", ""))[:80], str(c.get("date", ""))[:30]] if x)
                manifest.append({"id": cid, "src": "assets/cutouts/%s.png" % cid, "fallback": fb, "label": str(c.get("label", cid))[:80], "family": mv["id"],
                    "emo": emo, "cats": [k for k in c.get("cats", []) if k in cat["categories"]][:3],
                    "source": "%s (%s) %s" % (credit, c.get("license"), c.get("page_url")), "notes": str(c.get("tag_reason", ""))[:300], "status": "new", "file": rel,
                    "provenance": {"delivery": fn, "made_by": who, "image_url": c["image_url"], "page_url": c["page_url"], "creator": c.get("creator", ""),
                                   "date": c.get("date", ""), "license": c.get("license"), "keep": c.get("keep", ""), "critic": c.get("critic", ""),
                                   "coverage": round(cov, 3), "crop": how, "box": box, "looked": c.get("looked"),
                                   "flags": (["uncropped"] if how.startswith("whole image") and c.get("keep") else []) + (["tags-unseen"] if c.get("looked") is False else []),
                                   "when": stamp}})
                have.add(cid); made.append(rel)
                for it in shop:
                    if it["id"] == cid: it["status"] = "found"
            except Exception as e:
                dropped.append("%s: %s" % (cid or "?", str(e)[:120]))
        mv = MOV.get(d.get("movement"))
        if mv and d.get("snippets"):
            kit_dir = os.path.join(LIB, "families", mv["branch"], mv["id"], "kit"); kit_path = os.path.join(kit_dir, "kit.json"); kit = load(kit_path, [])
            names = {k["name"] for k in kit}
            for sn in d["snippets"]:
                name = slug(str(sn.get("name", "")) or "snippet")
                try:
                    css, lic = check_snippet(sn, mv)
                    while name in names: name += "-x"
                    rel = "library/families/%s/%s/kit/%s-%s.css" % (mv["branch"], mv["id"], sn["kind"], name)
                    os.makedirs(kit_dir, exist_ok=True)
                    open(os.path.join(ROOT, rel), "w", encoding="utf-8").write("/* %s · %s · %s kit · licence: %s%s · from %s */\n%s\n" % (
                        name, sn["kind"], mv["name"], lic, (" · source: " + sn["source_url"]) if sn.get("source_url") else "", fn, css.strip()))
                    kit.append({"name": name, "kind": sn["kind"], "file": rel, "license": lic, "author": sn.get("author", ""), "source_url": sn.get("source_url", ""),
                                "why": sn.get("why", ""), "status": "new", "model": who.get("kit_coder", ""), "when": stamp, "delivery": fn})
                    names.add(name); made.append(rel)
                except Exception as e:
                    dropped.append("snippet %s: %s" % (name, e))
            save(kit_path, kit)
        os.makedirs(done_dir, exist_ok=True); os.replace(path, os.path.join(done_dir, fn))
        lines.append("- %s: %d files filed so far%s" % (fn, len(made), ("; dropped: " + "; ".join(dropped)) if dropped else ""))
        print("intake %s | dropped %d" % (fn, len(dropped)))
    return made, lines

# ---------------------------------------------------------------- 5. FILE + run
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--movement", default="", help="movement id, or empty for any")
    ap.add_argument("--limit", type=int, default=8, help="how many wanted cutouts to try this run")
    ap.add_argument("--model", default=os.environ.get("PCP_MODEL") or DEFAULT_MODEL)
    ap.add_argument("--sources", default="commons,aic,openverse")
    ap.add_argument("--retry", action="store_true", help="also retry items that found no match before")
    ap.add_argument("--dry-run", action="store_true", help="no model calls: first candidate, first-guess tags")
    ap.add_argument("--mode", default="cutouts", choices=["cutouts", "scout", "snippets", "all", "intake"],
                    help="cutouts: find+cut+tag the shopping list; scout: add wanted cutouts; snippets: add CSS to kits; all: scout, snippets, then cutouts")
    ap.add_argument("--scout-count", type=int, default=8, help="new wanted cutouts per movement when scouting")
    ap.add_argument("--snippet-count", type=int, default=4, help="snippets per movement")
    a = ap.parse_args()

    cat = load(os.path.join(LIB, "catalog.json"))
    if not cat: sys.exit("library/catalog.json missing: run node tools/cutouts/catalog.js")
    MOV = {m["id"]: m for m in cat["movements"]}
    if a.movement and a.movement not in MOV: sys.exit("unknown movement %r; pick one of: %s" % (a.movement, ", ".join(sorted(MOV))))
    shop_path = os.path.join(LIB, "cutouts", "shopping-list.json")
    man_path = os.path.join(LIB, "cutouts", "manifest.json")
    shop, manifest = load(shop_path), load(man_path, [])
    have = {m["id"] for m in manifest}
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    targets = [MOV[a.movement]] if a.movement else list(MOV.values())
    extra_lines, made_extra = [], []
    if a.mode in ("scout", "all") and not a.dry_run:
        for mv in targets:
            try:
                added = scout(mv, shop, cat, a.model, a.scout_count); save(shop_path, shop)
                extra_lines.append("- Scouted %d new cutouts for %s: %s" % (len(added), mv["name"], "; ".join(x["label"] for x in added) or "none"))
                print("scout %-24s +%d" % (mv["id"], len(added)))
            except Exception as e:
                extra_lines.append("- Scouting %s failed: %s" % (mv["name"], str(e)[:160]))
    if a.mode in ("snippets", "all") and not a.dry_run:
        for mv in targets:
            try:
                made_s, rej = snippets(mv, cat, a.model, a.snippet_count, stamp); made_extra += made_s
                extra_lines.append("- %s kit: %d snippets added%s" % (mv["name"], len(made_s), (", rejected: " + "; ".join(rej)) if rej else ""))
                print("snippets %-21s +%d (-%d)" % (mv["id"], len(made_s), len(rej)))
            except Exception as e:
                extra_lines.append("- Snippets for %s failed: %s" % (mv["name"], str(e)[:160]))
    if a.mode == "intake":
        made_i, lines_i = intake(cat, MOV, shop, manifest, stamp, a.model); made_extra += made_i; extra_lines += lines_i
        save(shop_path, shop); save(man_path, manifest)
    if a.mode in ("scout", "snippets", "intake"): a.limit = 0
    todo = [s for s in shop if s["family"] in MOV and s["id"] not in have and (not a.movement or s["family"] == a.movement)
            and (s.get("status") == "wanted" or (a.retry and s.get("status") == "no-match"))][:a.limit]
    sources = [s for s in a.sources.split(",") if s in SOURCES]
    report, made = [], []
    print("model %s | sources %s | %d to try" % ("dry-run" if a.dry_run else a.model, ",".join(sources), len(todo)))

    for item in todo:
        mv = MOV[item["family"]]; row = {"id": item["id"], "label": item["label"], "movement": mv["name"]}
        try:
            cands, log = find(item, mv, sources)
            if not cands: raise ValueError("no public-domain candidates found" + (" (" + "; ".join(log) + ")" if log else ""))
            ch, why, keep = pick(item, mv, cands, a.model, a.dry_run)
            if ch is None: raise ValueError("picker rejected all: " + why)
            c = cands[ch]
            raw, how, box = crop_raw(http_get(c["image_url"], binary=True), None, keep, a.model, a.dry_run)
            cutout, cov = cut(raw)
            t = tag(item, mv, cutout, cat, a.model, a.dry_run)
            rel = "library/families/%s/%s/cutouts/%s.png" % (mv["branch"], mv["id"], item["id"])
            os.makedirs(os.path.dirname(os.path.join(ROOT, rel)), exist_ok=True)
            cutout.save(os.path.join(ROOT, rel), optimize=True)
            credit = ", ".join(x for x in [c["title"][:100], c["creator"][:80], c["date"][:30]] if x)
            manifest.append({
                "id": item["id"], "src": "assets/cutouts/%s.png" % item["id"], "fallback": t["fallback"], "label": t["label"],
                "family": mv["id"], "emo": t["emo"], "cats": t["cats"],
                "source": "%s: %s (%s) %s" % (c["source"], credit, c["license"], c["page_url"]),
                "notes": t.get("reason", ""), "status": "new", "file": rel,
                "provenance": {"source": c["source"], "title": c["title"], "creator": c["creator"], "date": c["date"],
                               "license": c["license"], "license_url": c["license_url"], "page_url": c["page_url"], "image_url": c["image_url"],
                               "picked_because": why, "keep": keep, "first_guess_emo": item["emo"], "people": t.get("people"),
                               "flags": t.get("flags", []), "coverage": round(cov, 3), "crop": how, "box": box, "model": "dry-run" if a.dry_run else a.model, "when": stamp}})
            item["status"] = "found"; item["file"] = rel; item["src"] = "assets/cutouts/%s.png" % item["id"]
            item["emo"] = t["emo"]; item["cats"] = t["cats"]; item["fallback"] = t["fallback"]
            item["source"] = manifest[-1]["source"]; item["notes"] = "tagged by looking (%s)" % manifest[-1]["provenance"]["model"]
            made.append(rel)
            row.update(ok=True, file=rel, emo=", ".join(t["emo"]), first=", ".join(manifest[-1]["provenance"]["first_guess_emo"]), lic=c["license"], page=c["page_url"], flags=", ".join(t.get("flags", [])))
            print("  + %-48s %s" % (item["id"], ", ".join(t["emo"])))
        except Exception as e:
            item["status"] = "no-match"; item["attempts"] = item.get("attempts", 0) + 1; item["last_reason"] = str(e)[:300]
            row.update(ok=False, why=str(e)[:200])
            print("  - %-48s %s" % (item["id"], str(e)[:120]))
        report.append(row)
        save(shop_path, shop); save(man_path, manifest)   # save as we go, so a crash keeps the work

    lines = ["# Cutout run %s" % stamp, "", "Model: `%s`. Sources: %s. Every image below is public domain or CC0, from the source shown." % ("dry-run" if a.dry_run else a.model, ", ".join(sources)), "",
             "Merging this pull request keeps these cutouts in the library. Delete any you don't want before merging, or say which ones in a comment.", "",
             "| Cutout | Tags (by looking) | Licence | Source | Flags |", "|---|---|---|---|---|"]
    for r in report:
        if r["ok"]: lines.append("| ![](../../../%s) %s | %s | %s | [page](%s) | %s |" % (r["file"], r["label"], r["emo"], r["lic"], r["page"], r["flags"] or "-"))
    if extra_lines: lines += ["", "## Scouting, kit snippets and deliveries", ""] + extra_lines
    miss = [r for r in report if not r["ok"]]
    if miss: lines += ["", "## Not found this time", ""] + ["- %s (%s): %s" % (r["label"], r["movement"], r["why"]) for r in miss]
    run_md = os.path.join(LIB, "cutouts", "runs", stamp[:16].replace(" ", "_").replace(":", "") + ".md")
    os.makedirs(os.path.dirname(run_md), exist_ok=True)
    open(run_md, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    with open(os.path.join(LIB, "cutouts", "last-run-files.txt"), "w") as f: f.write("\n".join(made + made_extra + [os.path.relpath(run_md, ROOT)]) + "\n")
    print("made %d of %d searched cutouts, %d other files (snippets, deliveries) | report %s" % (len(made), len(todo), len(made_extra), os.path.relpath(run_md, ROOT)))

if __name__ == "__main__":
    main()
