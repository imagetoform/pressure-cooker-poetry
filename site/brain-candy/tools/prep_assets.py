# One-time prep for the tool art from the brain-candy-graffiti-cutup-kit upload (paths point at the original working folder).
# Prep Brandon's kit art for the web: crop the Wite-Out brush and glue-stick cap apart,
# fix tip points, shrink, write webp + a pivots.json. Source: brain-candy-graffiti-cutup-kit (his upload).
import json, sys
from PIL import Image, ImageDraw
SRC = sys.argv[1] + "/assets/tools/"
OUT = "/root/tasks/pcp-cutup-bench/assets/"
piv = {}
def save(name, im, pivot_px, target_w):
    bb = im.getchannel("A").getbbox(); im = im.crop(bb)
    px, py = pivot_px[0]-bb[0], pivot_px[1]-bb[1]
    s = target_w / im.width
    im = im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS)
    im.save(OUT+name+".webp", "WEBP", quality=88, method=6)
    piv[name] = {"w": im.width, "h": im.height, "pivot": [round(px/ (bb[2]-bb[0]),4), round(py/(bb[3]-bb[1]),4)]}
def mask_poly(im, poly, keep_inside=True):
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255)
    if not keep_inside: m = Image.eval(m, lambda v: 255-v)
    a = im.getchannel("A"); a = Image.composite(a, Image.new("L", im.size, 0), m)
    im = im.copy(); im.putalpha(a); return im
def load(n): return Image.open(SRC+n).convert("RGBA")
# marker, knife, cap, school glue: kit pivots are right
for n, f, w in [("marker","fat-chisel-marker.png",440),("knife","precision-knife.png",400),("knife-cap","precision-knife-cap.png",150),("school-glue","school-glue.png",250)]:
    im = load(f); man = json.load(open(sys.argv[1]+"/manifest.json"))["tools"][f[:-4]]["contactPivotNormalized"]
    save(n, im, (man[0]*im.width, man[1]*im.height), w)
# glue stick: drop the floating cap (top-right), tip = middle of the white glue end
gs = load("glue-stick.png")
stick = mask_poly(gs, [(0,0),(140,0),(140,124),(212,124),(212,178),(312,178),(312,540),(0,540)], True)
cap = mask_poly(gs, [(140,0),(312,0),(312,121),(140,121)], True)
save("glue-stick", stick, (155,140), 240)
save("glue-stick-cap", cap, (230,60), 130)
# wite-out: split brush-on-cap from the bottle; tip = bottom of the bristles
wo = load("whiteout-brush-set.png")
brush_poly = [(255,0),(429,0),(429,200),(322,200),(312,346),(268,346),(274,250),(288,198),(255,168)]
save("whiteout-brush", mask_poly(wo, brush_poly, True), (291,333), 170)
bottle = mask_poly(wo, brush_poly, False)
bottle = mask_poly(bottle, [(0,0),(268,0),(268,522),(0,522)], True)
save("whiteout-bottle", bottle, (140,300), 260)
json.dump(piv, open(OUT+"pivots.json","w"), indent=1)
print(json.dumps(piv, indent=1))
