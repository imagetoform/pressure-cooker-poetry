# Sharpen some bittersweet/opposed pairs: keep both tastes and their order, make the main one clearer.
import json, re, math
from rings import dart, parse
rows = json.load(open("ingredients-retasted.json"))
changed = []
for k, r in enumerate(rows):
    v = re.findall(r"(sw|so|sa|bi|um|sp)(\d+)", r[3])
    if len(v) != 2: continue
    (a, x), (b, y) = v; x, y = int(x), int(y)
    if dart(parse(r[3]))[0] != "mild" or x == y: continue
    if k % 3 == 2: continue          # leave a third of them as real edge-dwellers
    s = f"{a}{min(10, x + 2)} {b}{max(1, y - 2)}"
    changed.append((r[1], r[3], s)); r[3] = s
json.dump(rows, open("ingredients-retasted.json", "w"), indent=0)
open("retaste.txt", "w").write("\n".join(r[3] for r in rows) + "\n")
print(len(changed), "sharpened"); [print("  ", *c) for c in changed[:12]]
