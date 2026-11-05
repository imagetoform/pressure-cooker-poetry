import json, re, collections, math
ing = json.load(open("../original/ingredients-new.json"))
new = [l.strip() for l in open("retaste.txt") if l.strip()]
assert len(new) == len(ing) == 300
AIM = {"sw": 0, "um": 45, "so": 125, "bi": 200, "sp": 285, "sa": 330}
rows, bad, dom, pat = [], [], collections.Counter(), collections.Counter()
for r, ts in zip(ing, new):
    v = {m[0]: int(m[1]) for m in re.findall(r"(sw|so|sa|bi|um|sp)(\d+)", ts)}
    tot = sum(v.values())
    if not (2 <= len(v) <= 4 and 8 <= tot <= 12 and all(1 <= x <= 10 for x in v.values())): bad.append((r[0], ts, tot))
    vx = sum(math.cos(math.radians(AIM[k])) * n for k, n in v.items()); vy = sum(math.sin(math.radians(AIM[k])) * n for k, n in v.items())
    focus = math.hypot(vx, vy) / tot
    pat["dominant (focus>.85)" if focus > .85 else "agreeing (.6-.85)" if focus > .6 else "muddled (<.6)"] += 1
    dom[max(v, key=v.get)] += 1
    rows.append([r[0], r[1], r[2], ts])
print("bad:", bad); print("dominant taste:", dict(dom)); print("focus pattern:", dict(pat))
json.dump(rows, open("ingredients-retasted.json", "w"), indent=0)
