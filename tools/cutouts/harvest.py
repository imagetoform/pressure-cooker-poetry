"""Harvest real public-domain cutouts from museum open-access collections (CC0).

Usage:
  python3 tools/cutouts/harvest.py <family-id> <count> "<query>" ["<query>" ...]
        [--source met|cma] [--mode subject|ink] [--retry-rejected] [--work DIR]

Sources: met = The Metropolitan Museum of Art (isPublicDomain), cma = Cleveland
Museum of Art (cc0=1). Query "artist:Name" keeps only objects whose artist field
contains Name. Modes: subject = cut the main subject out (rembg); ink = for prints
on paper, make the paper transparent and keep the ink.

For each query it searches the source, keeps only objects the museum marks CC0, downloads the image, cuts the main subject out onto a
transparent background (rembg, isnet-general-use model), crops to the cut, shrinks
to 900 px and 128 colours, and saves it as a PNG in the family's library folder.

Every cutout gets a CANDIDATE record in library/cutouts/candidates.json with full
provenance. A person (or Claude looking at the image) then tags emotions and
promotes it to library/cutouts/manifest.json with tools/cutouts/promote.py.
Nothing reaches the site until it is promoted.
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API = "https://collectionapi.metmuseum.org/public/collection"
UA = "PCP-cutout-harvester/1.0 (+https://github.com/imagetoform/pressure-cooker-poetry)"
MAX_PX = 900
CAND = os.path.join(REPO, "library", "cutouts", "candidates.json")


def save_new(rec):
    """Append one record, re-reading the file first so decisions made meanwhile are never overwritten."""
    cur = json.load(open(CAND)) if os.path.exists(CAND) else []
    if not any(c["id"] == rec["id"] for c in cur):
        cur.append(rec)
    json.dump(cur, open(CAND, "w"), indent=1, ensure_ascii=False)


def get(url, raw=False, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            return data if raw else json.loads(data)
        except Exception as e:  # network hiccup or rate limit: back off and retry
            if i == tries - 1:
                raise
            time.sleep(2 + 3 * i)


SOURCES = {"met": "The Metropolitan Museum of Art", "cma": "Cleveland Museum of Art"}


def search(source, q, limit=60):
    """Yield normalized CC0 objects with an image: object_id, title, creator, date, image_url, page_url."""
    if source == "met":
        res = get(API + "/v1.1/search?" + urllib.parse.urlencode({"hasImages": "true", "q": q, "limit": limit, "offset": 0}))
        for oid in res.get("objectIDs") or []:
            try:
                o = get("%s/v1/objects/%d" % (API, oid))
            except Exception as e:
                print("  skip %d: %s" % (oid, e)); continue
            if not o.get("isPublicDomain") or not o.get("primaryImage"):
                continue
            yield {"object_id": oid, "title": o.get("title") or "Untitled", "creator": o.get("artistDisplayName") or "Unknown",
                   "date": o.get("objectDate") or "", "medium": o.get("medium"), "image_url": o["primaryImage"],
                   "page_url": o.get("objectURL")}
    elif source == "cma":
        res = get("https://openaccess-api.clevelandart.org/api/artworks/?" + urllib.parse.urlencode(
            {"q": q, "cc0": 1, "has_image": 1, "limit": limit}))
        for a in res.get("data") or []:
            img = (a.get("images") or {}).get("print") or (a.get("images") or {}).get("web")
            if a.get("share_license_status") != "CC0" or not img:
                continue
            cr = a.get("creators") or []
            yield {"object_id": a["id"], "title": a.get("title") or "Untitled",
                   "creator": cr[0].get("description", "Unknown") if cr else "Unknown",
                   "date": a.get("creation_date") or "", "medium": a.get("technique"), "image_url": img["url"],
                   "page_url": a.get("url")}
    else:
        raise SystemExit("unknown source " + source)


def family_dir(fam):
    base = os.path.join(REPO, "library", "families")
    for branch in os.listdir(base):
        d = os.path.join(base, branch, fam)
        if os.path.isdir(d):
            return d
    raise SystemExit("unknown family: " + fam)


def slug(s, n=40):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:n].strip("-") or "untitled"


def ink(img):
    """Ink mode for printed matter: the paper turns transparent, the ink stays.
    Paper colour = median of the image border; alpha grows with distance from it."""
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    h, w, _ = a.shape
    b = max(4, int(min(h, w) * 0.03))
    border = np.concatenate([a[:b].reshape(-1, 3), a[-b:].reshape(-1, 3), a[:, :b].reshape(-1, 3), a[:, -b:].reshape(-1, 3)])
    paper = np.median(border, axis=0)
    dist = np.linalg.norm(a - paper, axis=2) / (np.sqrt(3) * 255)
    alpha = np.clip((dist - 0.07) / 0.22, 0, 1)
    out = Image.fromarray(np.dstack([a, alpha * 255]).astype(np.uint8), "RGBA")
    cov = float((alpha > 0.5).mean())
    return out, cov


_session = None
def cut(img, mode="subject"):
    """Cut the main subject out. Returns (RGBA image, coverage) or (None, reason)."""
    global _session
    from rembg import new_session, remove
    if _session is None and mode != "ink":
        _session = new_session("isnet-general-use")
    if mode == "ink":
        out, cov = ink(img)
    else:
        out = remove(img.convert("RGB"), session=_session)
    a = np.asarray(out.getchannel("A"))
    cov = float((a > 128).mean())
    if cov < 0.04:
        return None, "cut found almost nothing (%.0f%%)" % (cov * 100)
    if cov > 0.92:
        return None, "cut kept the whole frame (%.0f%%)" % (cov * 100)
    box = out.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    out = out.crop(box)
    out.thumbnail((MAX_PX, MAX_PX), Image.LANCZOS)
    # 128 colours keeps files small; alpha is preserved by quantizing RGBA directly.
    out = out.quantize(colors=128, method=Image.FASTOCTREE, dither=Image.NONE).convert("RGBA")
    return out, cov


def main():
    args = sys.argv[1:]
    work = os.path.join(REPO, "tmp", "harvest")
    mode = "subject"
    if "--mode" in args:
        i = args.index("--mode"); mode = args[i + 1]; del args[i:i + 2]
    source = "met"
    if "--source" in args:
        i = args.index("--source"); source = args[i + 1]; del args[i:i + 2]
    retry = "--retry-rejected" in args
    if retry:
        args.remove("--retry-rejected")
    if "--work" in args:
        i = args.index("--work"); work = args[i + 1]; del args[i:i + 2]
    fam, count, queries = args[0], int(args[1]), args[2:]
    out_dir = os.path.join(family_dir(fam), "cutouts")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(os.path.join(work, fam), exist_ok=True)
    cands = json.load(open(CAND)) if os.path.exists(CAND) else []
    seen = {(c["provenance"]["source"], c["provenance"]["object_id"]) for c in cands
            if not (retry and c.get("status") == "rejected")}
    made = 0
    for q in queries:
        if made >= count: break
        artist = None
        if q.startswith("artist:"):
            artist = q[7:]; q = artist
        try:
            objs = search(source, q)
        except Exception as e:
            print("  search failed %r: %s" % (q, e)); continue
        for o in objs:
            if made >= count: break
            key = (source, o["object_id"])
            if key in seen: continue
            seen.add(key)
            if artist and artist.lower() not in (o.get("creator") or "").lower():
                continue
            try:
                src = Image.open(io.BytesIO(get(urllib.parse.quote(o["image_url"], safe=":/"), raw=True)))
                src.thumbnail((1800, 1800), Image.LANCZOS)
                src.convert("RGB").save(os.path.join(work, fam, "%s-%s.jpg" % (source, o["object_id"])), quality=88)
                piece, info = cut(src, mode)
            except Exception as e:
                print("  skip %s: %s" % (o["object_id"], e)); continue
            if piece is None:
                print("  skip %s (%s): %s" % (o["object_id"], o.get("title", "")[:40], info)); continue
            cid = "%s-%s%s-%s%s" % (fam, source, o["object_id"], "ink-" if mode == "ink" else "", slug(o["title"], 28))
            rel = os.path.relpath(os.path.join(out_dir, cid + ".png"), REPO)
            piece.save(os.path.join(REPO, rel), optimize=True)
            cands.append({
                "id": cid, "family": fam, "file": rel, "status": "candidate",
                "label": o["title"][:80],
                "source": "%s, %s, %s. %s, Open Access (CC0). %s" % (
                    o["title"], o["creator"], o["date"], SOURCES[source], o["page_url"]),
                "provenance": {
                    "source": source, "object_id": o["object_id"], "query": q,
                    "page_url": o["page_url"], "image_url": o["image_url"],
                    "creator": o["creator"], "date": o["date"], "medium": o.get("medium"),
                    "license": "CC0 1.0 (%s open access)" % SOURCES[source],
                    "cut": ("ink mode: paper made transparent" if mode == "ink" else "rembg isnet-general-use") + ", auto-crop, <= %d px, 128 colours" % MAX_PX,
                    "coverage": round(info, 3), "when": time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime()),
                },
            })
            made += 1
            print("  + %s  (%.0f%% of frame)" % (cid, info * 100))
            save_new(cands[-1])
    print("%s: %d new candidates" % (fam, made))


if __name__ == "__main__":
    main()
