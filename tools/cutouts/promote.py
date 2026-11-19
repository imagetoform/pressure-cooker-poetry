"""Promote looked-at candidates into the live cutout database, or reject them.

Usage: python3 tools/cutouts/promote.py decisions.json

decisions.json is a list of:
  {"id": "<candidate id>", "keep": true, "emo": ["awe", "serenity"], "cats": ["object"],
   "label": "optional nicer label", "notes": "why these emotions"}
  {"id": "<candidate id>", "keep": false, "notes": "why rejected"}

Kept: record moves to library/cutouts/manifest.json with status "kept" (the build
puts it on the site). Rejected: the PNG is deleted and the record stays in
candidates.json with status "rejected" so the same object is never harvested again.
Emotion tags must be words from library/catalog.json's vocabulary (or its aliases).
"""
import json, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIB = os.path.join(REPO, "library", "cutouts")
CATS = {"food", "object", "memory", "institution", "concept", "absurdity"}  # the six ingredient categories the engine matches on


def main():
    decisions = json.load(open(sys.argv[1]))
    cat = json.load(open(os.path.join(REPO, "library", "catalog.json")))
    vocab, alias = set(cat["vocabulary"]), cat.get("aliases", {})
    cands = json.load(open(os.path.join(LIB, "candidates.json")))
    man = json.load(open(os.path.join(LIB, "manifest.json")))
    by = {c["id"]: c for c in cands}
    have = {m["id"] for m in man}
    kept = rej = 0
    for d in decisions:
        c = by.get(d["id"])
        if not c:  # allow a unique prefix, as printed on contact sheets
            hits = [k for k in by if k.startswith(d["id"]) and by[k].get("status") == "candidate"]
            c = by[hits[0]] if len(hits) == 1 else None
        if not c:
            raise SystemExit("no candidate: " + d["id"])
        if c.get("status") != "candidate":
            continue
        if not d.get("keep"):
            f = os.path.join(REPO, c["file"])
            if os.path.exists(f):
                os.unlink(f)
            c["status"] = "rejected"; c["notes"] = d.get("notes", "")
            rej += 1
            continue
        if d.get("family") and d["family"] != c["family"]:  # a person re-files it under a better family
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from harvest import family_dir
            new_id = d["family"] + c["id"][len(c["family"]):]
            new_file = os.path.relpath(os.path.join(family_dir(d["family"]), "cutouts", new_id + ".png"), REPO)
            os.makedirs(os.path.dirname(os.path.join(REPO, new_file)), exist_ok=True)
            if os.path.exists(os.path.join(REPO, c["file"])):
                os.replace(os.path.join(REPO, c["file"]), os.path.join(REPO, new_file))
            c["provenance"]["refiled_from"] = c["family"]
            c["id"], c["family"], c["file"] = new_id, d["family"], new_file
        sug = c.get("suggested") or {}
        d.setdefault("emo", sug.get("emo")); d.setdefault("cats", sug.get("cats")); d.setdefault("notes", sug.get("notes", ""))
        if not d.get("emo"):
            raise SystemExit("%s: no emotion tags given or suggested" % d["id"])
        emo = [alias.get(e, e) for e in d["emo"]]
        bad = [e for e in emo if e not in vocab]
        if bad or not emo:
            raise SystemExit("%s: not on the emotion wheel: %s" % (d["id"], bad))
        cats = d.get("cats") or ["object"]
        if set(cats) - CATS:
            raise SystemExit("%s: unknown categories %s" % (d["id"], set(cats) - CATS))
        rec = {
            "id": c["id"], "src": "assets/cutouts/%s.png" % c["id"], "fallback": "torn",
            "label": d.get("label") or c["label"], "family": c["family"], "emo": emo, "cats": cats,
            "source": c["source"], "notes": d.get("notes", ""), "status": "kept", "file": c["file"],
            "provenance": c["provenance"],
        }
        if c["id"] not in have:
            man.append(rec)
        c["status"] = "kept"
        kept += 1
    json.dump(man, open(os.path.join(LIB, "manifest.json"), "w"), indent=1, ensure_ascii=False)
    json.dump(cands, open(os.path.join(LIB, "candidates.json"), "w"), indent=1, ensure_ascii=False)
    if kept:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import web_copy
        web_copy.main()
    print("kept %d, rejected %d, manifest now %d cutouts" % (kept, rej, len(man)))


if __name__ == "__main__":
    main()
