import json, re, collections, sys
D = "../original/"
cur = json.load(open("current.json"))
ing = json.load(open(D + "ingredients-new.json"))
mov = json.load(open(D + "movements-new.json"))
cut = json.load(open(D + "cutout-shopping-list.json"))
VOCAB = set("""ecstasy joy serenity admiration trust acceptance terror fear apprehension amazement surprise distraction
grief sadness pensiveness loathing disgust boredom rage anger annoyance vigilance anticipation interest
love submission awe disapproval remorse contempt aggressiveness optimism overwhelm""".split())
assert len(VOCAB) == 33
CATS = {"food", "object", "memory", "institution", "concept", "absurdity"}
KEYS = {"sw", "so", "sa", "bi", "um", "sp"}
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
prob = collections.defaultdict(list)

# ---------- ingredients ----------
old_ids = {i["id"] for i in cur["ingredients"]}
old_text = {i["text"].lower(): i["id"] for i in cur["ingredients"]}
seen = collections.Counter(r[0] for r in ing)
dom = collections.Counter(); totals = []
for r in ing:
    if len(r) != 4: prob["shape"].append(r); continue
    i, text, cat, ts = r
    if not SLUG.match(i): prob["bad slug"].append(i)
    if seen[i] > 1: prob["dup id in new"].append(i)
    if i in old_ids: prob["collides with live pantry"].append(i)
    if text.lower() in old_text: prob["same text as live"].append((i, old_text[text.lower()]))
    if cat not in CATS: prob["bad cat"].append((i, cat))
    parts = ts.split()
    vals = {}
    for p in parts:
        m = re.fullmatch(r"(sw|so|sa|bi|um|sp)(\d+)", p)
        if not m: prob["bad taste code"].append((i, p)); continue
        if m.group(1) in vals: prob["taste repeated"].append((i, p))
        vals[m.group(1)] = int(m.group(2))
    nz = [v for v in vals.values() if v]
    if not 2 <= len(nz) <= 4: prob["not 2-4 tastes"].append((i, ts))
    if any(v < 1 or v > 10 for v in vals.values()): prob["taste out of 1-10"].append((i, ts))
    tot = sum(vals.values()); totals.append(tot)
    if not 8 <= tot <= 12: prob["total outside 8-12"].append((i, ts, tot))
    if vals: dom[max(vals, key=vals.get)] += 1
print("INGREDIENTS", len(ing), "| cats", dict(collections.Counter(r[2] for r in ing)))
print("  dominant taste", dict(dom), "| totals", min(totals), "-", max(totals))
texts = collections.Counter(r[1].lower() for r in ing)
for t, n in texts.items():
    if n > 1: prob["dup text in new"].append(t)

# ---------- movements ----------
old_m = {s["id"]: s for s in cur["styles"]}
LAYOUTS = {"manifesto", "cutup", "xerox", "ledger", "whisper", "reliquary", None}
MOTIONS = set("grow rise melt fade slide spin drop thrust jitter speed flicker float pulse pop smear turn".split())
TEX = {"grid", "concrete", "toner", "scan", "dots", "benday", None}
BR = {"ornament", "order", "revolt", "future", "excess", "abstract"}
for m in mov:
    i = m.get("id")
    if i in old_m: prob["movement id collides"].append(i)
    if not SLUG.match(i or ""): prob["movement bad slug"].append(i)
    if m.get("branch") not in BR: prob["movement new branch"].append((i, m.get("branch")))
    if m.get("layout") not in LAYOUTS: prob["movement bad layout"].append((i, m.get("layout")))
    if m.get("motion") not in MOTIONS: prob["movement bad motion"].append((i, m.get("motion")))
    if m.get("texture") not in TEX: prob["movement bad texture"].append((i, m.get("texture")))
    e = m.get("emo", [])
    if len(e) != 3: prob["movement emo not 3"].append((i, e))
    for w in e:
        if w not in VOCAB: prob["movement emo off-vocab"].append((i, w))
    c = m.get("colors", [])
    if not 2 <= len(c) <= 5 or any(not re.fullmatch(r"#[0-9a-fA-F]{6}", x) for x in c): prob["movement colors"].append((i, c))
    if re.search(r"\d", json.dumps(e)): prob["number in emo"].append(i)
    print("  M", i, m["branch"], m["layout"], m["motion"], m["texture"], e)

# ---------- cutouts ----------
all_m = set(old_m) | {m["id"] for m in mov}
cid = collections.Counter(c["id"] for c in cut)
fams = collections.Counter(c["family"] for c in cut)
for c in cut:
    if cid[c["id"]] > 1: prob["cutout dup id"].append(c["id"])
    if c["family"] not in all_m: prob["cutout unknown family"].append((c["id"], c["family"]))
    if not 2 <= len(c["emo"]) <= 4: prob["cutout emo count"].append((c["id"], c["emo"]))
    for w in c["emo"]:
        if w not in VOCAB: prob["cutout emo off-vocab"].append((c["id"], w))
    for k in c.get("cats", []):
        if k not in CATS: prob["cutout bad cat"].append((c["id"], k))
    if len(c.get("cats", [])) > 3: prob["cutout >3 cats"].append(c["id"])
print("CUTOUT FAMILIES", len(fams), "| families not in tree:", sorted(set(fams) - all_m), "| tree movements with no cutouts:", sorted(all_m - set(fams)))

print("\nPROBLEMS")
for k, v in prob.items():
    print(f"  {k}: {len(v)}  e.g. {v[:6]}")
if not prob: print("  none")
