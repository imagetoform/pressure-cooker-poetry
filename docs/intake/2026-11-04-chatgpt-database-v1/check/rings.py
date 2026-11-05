import json, math, collections, re
AIM = {"sweet": 0, "umami": 45, "sour": 125, "bitter": 200, "spicy": 285, "salty": 330}
AB = {"sw": "sweet", "so": "sour", "sa": "salty", "bi": "bitter", "um": "umami", "sp": "spicy"}
PET = "joy trust fear surprise sadness disgust anger anticipation".split()
def parse(s): return {AB[m[0]]: int(m[1]) for m in re.findall(r"(sw|so|sa|bi|um|sp)(\d+)", s)}
def dart(t):
    vx = vy = tot = 0
    for k, n in t.items():
        if not n: continue
        vx += math.cos(math.radians(AIM[k])) * n; vy += math.sin(math.radians(AIM[k])) * n; tot += n
    f = math.hypot(vx, vy) / tot
    ang = math.degrees(math.atan2(vy, vx)) % 360
    r = 1.25 - f - 0.3 * (min(1.2, tot / 10) - 0.9)
    return ("intense" if r < .42 else "core" if r < .72 else "mild"), PET[int(((ang + 22.5) % 360) // 45)]
def report(name, ts):
    rc = collections.Counter(); pc = collections.Counter()
    for t in ts: a, b = dart(t); rc[a] += 1; pc[b] += 1
    print(name, len(ts), dict(rc), dict(pc))
if __name__ == "__main__":
    report("live 181", [i["t"] for i in json.load(open("current.json"))["ingredients"]])
    report("chatgpt 300", [parse(r[3]) for r in json.load(open("../original/ingredients-new.json"))])
    report("retasted 300", [parse(r[3]) for r in json.load(open("ingredients-retasted.json"))])
