#!/usr/bin/env python3
"""
PRESSURE COOKER POETRY: kit generator.

Every design movement gets a kit of interchangeable parts, each written in its
own colours and grammar:
  button    a skin for the cook button             (body[data-k-button])
  texture   a frame around the room's edge          (.kit-tex)
  ornament  small shapes placed at the room's edges (.kit-orn.orn-<name>)
  motion    how the ornaments move                  (body[data-k-motion])

The room's recipe (seeded) picks one button, one texture, one or two ornaments
and one motion from its primary movement. Same recipe, same picks.

Templates are original CSS (CC0). Each movement chooses the templates that fit
its grammar in GRAMMAR below. Output: library/families/<branch>/<id>/kit/gen-*.css
plus entries in kit.json (hand-made or delivered entries are kept).

Usage: node tools/cutouts/catalog.js && python3 tools/kits/generate.py
"""
import json, os, re, urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LIB = os.path.join(ROOT, "library")
INK, PAPER = "#111111", "#f4f4f2"

# ---------------------------------------------------------------- colour helpers
def lum(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
def on(bg): return INK if contrast(bg, INK) >= contrast(bg, PAPER) else PAPER
def halo(bg):
    """Text colour for a solid background, plus a halo when contrast falls under 4.5:1."""
    t = on(bg)
    if contrast(bg, t) >= 4.5: return "color:%s;" % t
    other = PAPER if t == INK else INK
    return "color:%s;text-shadow:0 0 2px %s,0 0 5px %s;" % (t, other, other)
def lit(a, b):
    """Coloured text on the dark sidebar (#111): the first colour that reads, else paper."""
    for c in (a, b):
        if contrast(c, INK) >= 4.5: return c
    return PAPER
def svg_url(svg): return "url(\"data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/'(),;-.") + "\")"

# ---------------------------------------------------------------- templates
# Each returns CSS declarations (no selector). a, b = movement colours for this variant.
BUTTONS = {
    "slab":      lambda a, b: f"background:{a};{halo(a)}border:3px solid {INK};box-shadow:5px 5px 0 {b};border-radius:0;",
    "stamp":     lambda a, b: f"background:{INK};color:{lit(a, b)};border:4px double currentColor;box-shadow:none;transform:rotate(-2deg);letter-spacing:.14em;",
    "ticket":    lambda a, b: f"background:{a};{halo(a)}border:0;box-shadow:none;clip-path:polygon(8px 0,calc(100% - 8px) 0,100% 8px,100% calc(50% - 6px),calc(100% - 6px) 50%,100% calc(50% + 6px),100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px),0 calc(50% + 6px),6px 50%,0 calc(50% - 6px),0 8px);",
    "pill":      lambda a, b: f"background:{a};{halo(a)}border:0;border-radius:999px;box-shadow:inset 0 0 0 3px {b},0 0 0 3px {INK};",
    "wedge":     lambda a, b: f"background:{a};{halo(a)}border:0;border-radius:0;box-shadow:none;clip-path:polygon(0 0,100% 0,calc(100% - 16px) 100%,0 100%);",
    "tape":      lambda a, b: f"background:repeating-linear-gradient(90deg,{a} 0 10px,{a}dd 10px 12px);{halo(a)}border:0;box-shadow:2px 3px 0 rgba(0,0,0,.35);transform:rotate(1.5deg);clip-path:polygon(2% 6%,98% 0,100% 94%,1% 100%);",
    "outline":   lambda a, b: f"background:{INK};color:{lit(a, b)};border:2px solid currentColor;box-shadow:none;border-radius:0;",
    "split":     lambda a, b: f"background:linear-gradient(100deg,{a} 0 52%,{b} 52% 100%);color:{PAPER};text-shadow:0 0 3px {INK},0 0 1px {INK};border:2px solid {INK};box-shadow:none;",
    "arch":      lambda a, b: f"background:{a};{halo(a)}border:0;border-radius:40px 40px 4px 4px / 26px 26px 4px 4px;box-shadow:inset 0 0 0 3px {b};",
    "gloss":     lambda a, b: f"background:linear-gradient(180deg,#ffffff 0%,{b} 45%,{a} 100%);color:{INK};text-shadow:0 0 2px #fff,0 0 6px #fff,0 0 10px #fff;border:1px solid {INK};border-radius:999px;box-shadow:inset 0 2px 0 #fff,0 2px 6px rgba(0,0,0,.3);",
    "woodblock": lambda a, b: f"background:{a};{halo(a)}border:0;border-bottom:5px solid {b};border-radius:2px;box-shadow:none;font-family:var(--f-serif);",
    "halftone":  lambda a, b: f"background:radial-gradient(circle,{b}66 26%,transparent 28%) 0 0/8px 8px,{a};color:{on(a)};text-shadow:0 0 2px {a},0 0 4px {a},0 0 7px {a},0 0 10px {a};border:3px solid {INK};box-shadow:4px 4px 0 {INK};",
    "inset":     lambda a, b: f"background:{a};{halo(a)}border:0;box-shadow:inset 0 0 0 3px {a},inset 0 0 0 5px {on(a)},inset 0 0 0 8px {a};border-radius:0;",
    "underline": lambda a, b: f"background:{INK};color:{lit(a, b)};border:0;border-bottom:4px solid {b};box-shadow:none;border-radius:0;letter-spacing:.08em;",
    "double":    lambda a, b: f"background:{a};{halo(a)}border:0;box-shadow:0 0 0 2px {a},0 0 0 4px {b},0 0 0 6px {a},0 0 0 7px {b};letter-spacing:.12em;",
    "sticker":   lambda a, b: f"background:{a};{halo(a)}border:3px solid {PAPER};outline:2px solid {INK};outline-offset:0;border-radius:14px 4px 18px 6px;box-shadow:3px 4px 0 rgba(0,0,0,.4);transform:rotate(-1.5deg);",
}
EDGE = "position:absolute;inset:0;pointer-events:none;"
TEXTURES = {
    "bars":        lambda a, b: f"border-style:solid;border-color:{a} {b} {a} {b};border-width:14px 8px;",
    "double-rule": lambda a, b: f"border:7px double {a};outline:2px solid {b};outline-offset:-14px;",
    "stitch":      lambda a, b: f"border:3px dashed {a};outline:1px solid {b};outline-offset:-9px;",
    "corners":     lambda a, b: f"background:linear-gradient(135deg,{a} 0 46px,transparent 46px) top left,linear-gradient(225deg,{b} 0 46px,transparent 46px) top right,linear-gradient(45deg,{b} 0 46px,transparent 46px) bottom left,linear-gradient(315deg,{a} 0 46px,transparent 46px) bottom right;background-size:50% 50%;background-repeat:no-repeat;",
    "dots":        lambda a, b: f"background:radial-gradient(circle,{a} 30%,transparent 32%) 0 0/16px 16px;opacity:.8;",
    "stripes":     lambda a, b: f"background:repeating-linear-gradient(45deg,{a} 0 7px,transparent 7px 20px);opacity:.85;",
    "scan":        lambda a, b: f"background:repeating-linear-gradient(0deg,{a} 0 1px,transparent 1px 4px),linear-gradient(90deg,{b}33,transparent 30%,transparent 70%,{b}33);opacity:.7;",
    "checker":     lambda a, b: f"background:conic-gradient({a} 25%,transparent 0 50%,{a} 0 75%,transparent 0) 0 0/26px 26px;opacity:.75;",
    "vines":       lambda a, b: f"background:repeating-radial-gradient(circle at 0 0,transparent 0 22px,{a} 22px 25px),repeating-radial-gradient(circle at 100% 100%,transparent 0 30px,{b} 30px 32px);opacity:.8;",
    "rings":       lambda a, b: f"background:repeating-radial-gradient(circle at 50% 50%,{a} 0 3px,transparent 3px 14px);opacity:.7;",
    "zigzag":      lambda a, b: f"background:linear-gradient(135deg,{a} 25%,transparent 25%) -12px 0/24px 24px,linear-gradient(225deg,{a} 25%,transparent 25%) -12px 0/24px 24px,linear-gradient(315deg,{b} 25%,transparent 25%) 0 0/24px 24px,linear-gradient(45deg,{b} 25%,transparent 25%) 0 0/24px 24px;opacity:.8;",
    "grid":        lambda a, b: f"background:linear-gradient({a} 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,{a} 1px,transparent 1px) 0 0/32px 32px;border:2px solid {b};",
    "tape":        lambda a, b: f"background:linear-gradient(35deg,transparent 0 6%,{a}cc 6% 13%,transparent 13%) top left/40% 40% no-repeat,linear-gradient(-35deg,transparent 0 6%,{b}cc 6% 13%,transparent 13%) top right/40% 40% no-repeat,linear-gradient(-35deg,transparent 87%,{b}cc 87% 94%,transparent 94%) bottom left/40% 40% no-repeat,linear-gradient(35deg,transparent 87%,{a}cc 87% 94%,transparent 94%) bottom right/40% 40% no-repeat;",
    "frame-shadow":lambda a, b: f"box-shadow:inset 0 0 0 10px {a},inset 14px 14px 0 10px {b};",
    "brick":       lambda a, b: f"background:linear-gradient(90deg,transparent 0 46px,{a} 46px 48px) 0 0/48px 24px,linear-gradient(90deg,transparent 0 22px,{a} 22px 24px) 0 12px/48px 24px,linear-gradient({a} 0 2px,transparent 2px) 0 0/48px 12px;opacity:.55;",
    "wave":        lambda a, b: f"background:{svg_url('<svg xmlns=' + chr(39) + 'http://www.w3.org/2000/svg' + chr(39) + ' width=' + chr(39) + '60' + chr(39) + ' height=' + chr(39) + '24' + chr(39) + '><path d=' + chr(39) + 'M0 12 Q15 0 30 12 T60 12' + chr(39) + ' fill=' + chr(39) + 'none' + chr(39) + ' stroke=' + chr(39) + a + chr(39) + ' stroke-width=' + chr(39) + '3' + chr(39) + '/></svg>')} 0 0/60px 24px;opacity:.8;",
}
def q(s): return "'" + s + "'"
def svgtag(inner, vb="0 0 100 100"): return "<svg xmlns=" + q("http://www.w3.org/2000/svg") + " viewBox=" + q(vb) + ">" + inner + "</svg>"
ORNAMENTS = {
    "disc":      lambda a, b, w: f"aspect-ratio:1;border-radius:50%;background:{a};box-shadow:inset 0 0 0 6px {b};",
    "beam-disc": lambda a, b, w: f"aspect-ratio:4/1;background:linear-gradient({a},{a}) left center/78% 34% no-repeat,radial-gradient(circle at 88% 50%,{b} 0 11%,transparent 11.5%);",
    "triangle":  lambda a, b, w: f"aspect-ratio:1;background:{a};clip-path:polygon(50% 0,100% 100%,0 100%);",
    "star":      lambda a, b, w: f"aspect-ratio:1;background:{a};clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);",
    "cross":     lambda a, b, w: f"aspect-ratio:1;background:linear-gradient({a},{a}) center/22% 100% no-repeat,linear-gradient({a},{a}) center/100% 22% no-repeat;",
    "arc":       lambda a, b, w: f"aspect-ratio:2/1;border:10px solid {a};border-bottom:0;border-radius:999px 999px 0 0;",
    "rings":     lambda a, b, w: f"aspect-ratio:1;border-radius:50%;background:repeating-radial-gradient(circle,{a} 0 5%,transparent 5% 10%);",
    "tiles":     lambda a, b, w: f"aspect-ratio:1;background:conic-gradient({a} 25%,{b} 0 50%,transparent 0 75%,{a} 0) 0 0/50% 50%;",
    "sunburst":  lambda a, b, w: f"aspect-ratio:1;border-radius:50%;background:repeating-conic-gradient({a} 0 9deg,transparent 9deg 18deg);",
    "squiggle":  lambda a, b, w: f"aspect-ratio:3/1;background:{svg_url(svgtag('<path d=' + q('M5 30 Q20 5 35 30 T65 30 T95 30') + ' fill=' + q('none') + ' stroke=' + q(a) + ' stroke-width=' + q('8') + ' stroke-linecap=' + q('round') + '/>', '0 0 100 45'))} center/contain no-repeat;",
    "lancet":    lambda a, b, w: f"aspect-ratio:1/2;background:{a};border-radius:50% 50% 0 0 / 70% 70% 0 0;box-shadow:inset 0 0 0 5px {b};",
    "wave":      lambda a, b, w: f"aspect-ratio:3/1;background:{svg_url(svgtag('<path d=' + q('M0 30 Q12 5 25 30 T50 30 T75 30 T100 30') + ' fill=' + q('none') + ' stroke=' + q(a) + ' stroke-width=' + q('5') + '/><path d=' + q('M0 42 Q12 17 25 42 T50 42 T75 42 T100 42') + ' fill=' + q('none') + ' stroke=' + q(b) + ' stroke-width=' + q('3') + '/>', '0 0 100 50'))} center/contain no-repeat;",
    "bolt":      lambda a, b, w: f"aspect-ratio:1/2;background:{a};clip-path:polygon(55% 0,10% 55%,45% 55%,30% 100%,90% 40%,55% 40%,75% 0);",
    "diamond":   lambda a, b, w: f"aspect-ratio:1;background:{a};clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);box-shadow:inset 0 0 0 999px {a};",
    "bar":       lambda a, b, w: f"aspect-ratio:6/1;background:{a};box-shadow:6px 6px 0 {b};",
    "word":      lambda a, b, w: f"aspect-ratio:auto;width:auto !important;padding:.1em .35em;background:{a};color:{on(a)};font:400 clamp(1.2rem,3.2vw,2.6rem)/1 var(--f-display);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;",
}
MOTIONS = {   # keyframes body, duration, timing, direction
    "bob":      ("0%{transform:translateY(0)}100%{transform:translateY(-10px)}", "3.2s", "ease-in-out", "alternate"),
    "sway":     ("0%{transform:rotate(-4deg)}100%{transform:rotate(4deg)}", "4s", "ease-in-out", "alternate"),
    "spin":     ("to{transform:rotate(360deg)}", "24s", "linear", "normal"),
    "drift":    ("0%{transform:translate(0,0)}100%{transform:translate(14px,-8px)}", "7s", "ease-in-out", "alternate"),
    "breathe":  ("0%{transform:scale(1)}100%{transform:scale(1.08)}", "2.6s", "ease-in-out", "alternate"),
    "snap":     ("0%,40%{transform:rotate(0)}50%,90%{transform:rotate(-8deg)}100%{transform:rotate(0)}", "3s", "steps(1)", "normal"),
    "orbit":    ("0%{transform:rotate(0) translateX(8px) rotate(0)}100%{transform:rotate(360deg) translateX(8px) rotate(-360deg)}", "8s", "linear", "normal"),
    "shudder":  ("0%{transform:translate(0,0)}50%{transform:translate(2px,-1px)}100%{transform:translate(-1px,2px)}", "0.6s", "steps(2)", "normal"),
    "pendulum": ("0%{transform:rotate(-10deg)}100%{transform:rotate(10deg)}", "2.4s", "cubic-bezier(.45,0,.55,1)", "alternate"),
    "rise":     ("0%{transform:translateY(12px);opacity:.6}100%{transform:translateY(0);opacity:1}", "3.6s", "ease-out", "alternate"),
    "flicker":  ("0%,100%{opacity:1}46%{opacity:1}48%{opacity:.35}52%{opacity:1}", "4s", "steps(1)", "normal"),
}

# ---------------------------------------------------------------- each movement's grammar
GRAMMAR = {
  "art-nouveau":   (["pill", "arch", "outline", "double"], ["vines", "double-rule", "wave", "corners"], ["squiggle", "arc", "lancet", "disc", "wave"], ["sway", "breathe", "drift"], []),
  "art-deco":      (["double", "inset", "wedge", "gloss"], ["zigzag", "double-rule", "corners", "stripes"], ["sunburst", "diamond", "arc", "bar", "star"], ["rise", "breathe", "spin"], []),
  "psychedelia":   (["pill", "split", "halftone", "sticker"], ["rings", "wave", "dots", "checker"], ["rings", "squiggle", "sunburst", "disc", "wave"], ["spin", "breathe", "sway"], []),
  "gothic-revival":(["arch", "double", "outline", "inset"], ["double-rule", "corners", "stitch", "brick"], ["lancet", "cross", "rings", "arc", "star"], ["breathe", "pendulum", "rise"], []),
  "ukiyo-e":       (["woodblock", "underline", "outline", "stamp"], ["wave", "double-rule", "scan", "corners"], ["wave", "disc", "arc", "bar", "tiles"], ["drift", "sway", "bob"], []),
  "minimalism":    (["outline", "underline", "inset", "slab"], ["frame-shadow", "corners", "grid", "stitch"], ["disc", "bar", "triangle", "arc", "tiles"], ["breathe", "drift", "bob"], []),
  "swiss":         (["slab", "underline", "wedge", "outline"], ["grid", "bars", "stripes", "corners"], ["disc", "bar", "tiles", "triangle", "word"], ["snap", "rise", "drift"], ["01", "A4", "§", "→"]),
  "bauhaus":       (["pill", "slab", "split", "wedge"], ["bars", "checker", "grid", "corners"], ["disc", "triangle", "tiles", "arc", "bar"], ["spin", "snap", "bob"], []),
  "brutalism":     (["slab", "inset", "stamp", "outline"], ["brick", "bars", "frame-shadow", "stitch"], ["bar", "tiles", "cross", "triangle", "word"], ["snap", "shudder", "rise"], ["NO", "B2", "EXIT", "LOAD"]),
  "constructivism":(["wedge", "slab", "split", "stamp"], ["bars", "stripes", "corners", "zigzag"], ["beam-disc", "triangle", "star", "bar", "word"], ["snap", "rise", "shudder"], ["ВПЕРЁД", "STRIKE", "1917", "WORK"]),
  "dada":          (["sticker", "stamp", "tape", "split"], ["tape", "checker", "stitch", "dots"], ["word", "disc", "cross", "triangle", "squiggle"], ["shudder", "sway", "snap"], ["DA", "NO", "?", "ART?", "ZANG"]),
  "punk":          (["tape", "stamp", "sticker", "slab"], ["tape", "stripes", "stitch", "scan"], ["cross", "word", "bolt", "star", "bar"], ["shudder", "snap", "sway"], ["NO", "DIY", "RIOT", "FREE"]),
  "zine-diy":      (["tape", "stamp", "outline", "sticker"], ["tape", "stitch", "scan", "dots"], ["word", "tiles", "bar", "cross", "squiggle"], ["sway", "bob", "shudder"], ["DIY", "FREE", "COPY ME", "ZINE"]),
  "situationism":  (["stamp", "outline", "split", "underline"], ["stitch", "scan", "grid", "tape"], ["word", "arc", "cross", "disc", "bar"], ["drift", "sway", "snap"], ["DÉRIVE", "SPECTACLE", "SOUS LES PAVÉS", "REFUSE"]),
  "grunge-design": (["tape", "slab", "stamp", "inset"], ["scan", "stripes", "stitch", "brick"], ["cross", "bar", "word", "tiles", "squiggle"], ["shudder", "sway", "drift"], ["LOUD", "SOLD", "X", "NOISE"]),
  "futurism":      (["wedge", "split", "slab", "gloss"], ["stripes", "zigzag", "bars", "scan"], ["bolt", "beam-disc", "triangle", "star", "bar"], ["rise", "snap", "orbit"], []),
  "cyberpunk":     (["outline", "gloss", "split", "inset"], ["scan", "grid", "corners", "stripes"], ["tiles", "bar", "cross", "rings", "word"], ["flicker", "snap", "drift"], ["ERR", "404", "SYS", "//"]),
  "vaporwave":     (["gloss", "pill", "outline", "split"], ["grid", "scan", "wave", "checker"], ["disc", "wave", "tiles", "triangle", "rings"], ["drift", "bob", "breathe"], []),
  "afrofuturism":  (["pill", "gloss", "double", "inset"], ["rings", "dots", "zigzag", "corners"], ["rings", "disc", "star", "sunburst", "arc"], ["orbit", "rise", "breathe"], []),
  "y2k":           (["gloss", "pill", "sticker", "outline"], ["grid", "dots", "rings", "corners"], ["star", "disc", "rings", "bolt", "diamond"], ["bob", "spin", "breathe"], []),
  "maximalism":    (["halftone", "sticker", "split", "double"], ["dots", "checker", "zigzag", "stripes", "vines"], ["sunburst", "star", "diamond", "squiggle", "disc"], ["breathe", "spin", "sway"], []),
  "pop-art":       (["halftone", "sticker", "slab", "pill"], ["dots", "stripes", "checker", "bars"], ["star", "word", "disc", "bolt", "sunburst"], ["breathe", "snap", "bob"], ["POW!", "WOW", "SALE", "NEW!"]),
  "memphis":       (["sticker", "split", "pill", "halftone"], ["zigzag", "dots", "checker", "stripes"], ["squiggle", "bolt", "triangle", "disc", "tiles"], ["bob", "spin", "sway"], []),
  "abstract-expressionism": (["slab", "tape", "inset", "split"], ["stripes", "scan", "stitch", "brick"], ["squiggle", "bar", "disc", "cross", "arc"], ["sway", "drift", "shudder"], []),
  "geometric-abstraction":  (["split", "slab", "outline", "pill"], ["checker", "grid", "bars", "corners"], ["tiles", "triangle", "disc", "diamond", "arc"], ["spin", "snap", "drift"], []),
  "op-art":        (["outline", "split", "inset", "double"], ["rings", "stripes", "checker", "zigzag"], ["rings", "tiles", "diamond", "sunburst", "disc"], ["spin", "breathe", "pendulum"], []),
  "surrealism":    (["pill", "outline", "arch", "underline"], ["wave", "corners", "double-rule", "rings"], ["disc", "arc", "lancet", "wave", "triangle"], ["drift", "bob", "breathe"], []),
  "rococo":        (["gloss", "double", "arch", "pill"], ["vines", "double-rule", "corners", "dots"], ["squiggle", "arc", "sunburst", "disc", "star"], ["sway", "breathe", "flicker"], []),
  "mexican-muralism": (["woodblock", "stamp", "slab", "wedge"], ["brick", "stripes", "stitch", "scan"], ["sunburst", "triangle", "tiles", "bar", "word"], ["snap", "rise", "pendulum"], ["TIERRA", "PAN", "TRABAJO", "1910"]),
  "expressionism": (["wedge", "slab", "stamp", "arch"], ["zigzag", "stripes", "corners", "bars"], ["triangle", "bolt", "lancet", "bar", "star"], ["shudder", "sway", "pendulum"], []),
}

def esc_css_str(s): return s.replace("\\", "\\\\").replace('"', '\\"')

def build_movement(m):
    mid, cols = m["id"], m["colors"]
    g = GRAMMAR.get(mid)
    if not g: return []
    btns, texs, orns, mots, words = g
    n = len(cols)
    def pair(i):
        a = cols[i % n]; b = cols[(i + 1) % n]
        if a.lower() == b.lower(): b = INK if a.lower() != INK else PAPER
        return a, b
    scope = 'body[data-sty="%s"]' % mid
    parts = []
    for i, name in enumerate(btns):
        a, b = pair(i)
        css = '%s[data-k-button="%s"] .btn-cook, %s[data-k-button="%s"] .mb-cook { %s }' % (scope, name, scope, name, BUTTONS[name](a, b))
        parts.append(("button", name, css))
    for i, name in enumerate(texs):
        a, b = pair(i + 1)
        css = '%s[data-k-texture="%s"] .kit-tex { %s%s }' % (scope, name, EDGE, TEXTURES[name](a, b))
        parts.append(("texture", name, css))
    for i, name in enumerate(orns):
        a, b = pair(i + 2)
        if name == "word":
            for j, w in enumerate(words or ["!"]):
                wa, wb = pair(i + 2 + j)
                css = '%s .kit-orn.orn-word-%d { %s } %s .kit-orn.orn-word-%d::after { content: "%s"; }' % (scope, j, ORNAMENTS["word"](wa, wb, None), scope, j, esc_css_str(w))
                parts.append(("ornament", "word-%d" % j, css))
            continue
        css = '%s .kit-orn.orn-%s { %s }' % (scope, name, ORNAMENTS[name](a, b, None))
        parts.append(("ornament", name, css))
    for name in mots:
        kf, dur, tf, direction = MOTIONS[name]
        css = ('@media (prefers-reduced-motion: no-preference) { @keyframes k-%s-%s { %s } %s[data-k-motion="%s"] .kit-orn { animation: k-%s-%s %s %s infinite %s; } }'
               % (mid, name, kf, scope, name, mid, name, dur, tf, direction))
        parts.append(("motion", name, css))
    return parts

def main():
    import sys
    sys.path.insert(0, os.path.join(ROOT, "tools", "cutouts"))
    from run import check_snippet   # the same safety check every delivered snippet passes
    cat = json.load(open(os.path.join(LIB, "catalog.json"), encoding="utf-8"))
    total, per = 0, {}
    for m in cat["movements"]:
        parts = build_movement(m)
        kit_dir = os.path.join(LIB, "families", m["branch"], m["id"], "kit")
        os.makedirs(kit_dir, exist_ok=True)
        kit_path = os.path.join(kit_dir, "kit.json")
        kit = [k for k in (json.load(open(kit_path)) if os.path.exists(kit_path) else []) if not k.get("generated")]
        for f in os.listdir(kit_dir):
            if f.startswith("gen-") and f.endswith(".css"): os.remove(os.path.join(kit_dir, f))
        for kind, name, css in parts:
            check_snippet({"kind": kind, "css": css, "license": "CC0"}, m)
            rel = "library/families/%s/%s/kit/gen-%s-%s.css" % (m["branch"], m["id"], kind, name)
            open(os.path.join(ROOT, rel), "w", encoding="utf-8").write("/* %s · %s · %s kit · licence CC0 · generated by tools/kits/generate.py */\n%s\n" % (name, kind, m["name"], css))
            kit.append({"name": name, "kind": kind, "file": rel, "license": "CC0", "author": "Pressure Cooker Poetry", "source_url": "",
                        "why": "template '%s' in %s colours" % (name.split("-")[0], m["name"]), "status": "built-in", "generated": True, "canonical": True})
        json.dump(kit, open(kit_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        per[m["id"]] = len(parts); total += len(parts)
    print("kit parts:", total, "across", len(per), "movements;", ", ".join("%s %d" % kv for kv in per.items()))

if __name__ == "__main__":
    main()
