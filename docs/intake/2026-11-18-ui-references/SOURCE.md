```json
[
  {
    "id": "ui-010",
    "family": "Brutalism",
    "url": "https://github.com/steelzzeu/brutalistfolio",
    "heat": -2,
    "order": 3,
    "noise": 0,
    "weight": 2
  },
  {
    "id": "ui-011",
    "family": "Brutalism",
    "url": "https://github.com/pinecreativelabs/Blueprint-Grid",
    "heat": -1,
    "order": 2,
    "noise": 2,
    "weight": 2
  },
  {
    "id": "ui-012",
    "family": "Swiss / International",
    "url": "https://github.com/nsolerieu/brute",
    "heat": -2,
    "order": 3,
    "noise": -1,
    "weight": 1
  },
  {
    "id": "ui-013",
    "family": "Swiss / International",
    "url": "https://codepen.io/rachelandrew/pen/WNJKpzP",
    "heat": -1,
    "order": 3,
    "noise": -2,
    "weight": 1
  },
  {
    "id": "ui-014",
    "family": "Pop Art",
    "url": "https://github.com/quak-ai/Neo-brutalism-CSS",
    "heat": 2,
    "order": 1,
    "noise": 2,
    "weight": 3
  },
  {
    "id": "ui-015",
    "family": "Futurism",
    "url": "https://github.com/Liiift-Studio/stabilType",
    "heat": 2,
    "order": 1,
    "noise": 1,
    "weight": 1
  },
  {
    "id": "ui-016",
    "family": "Cyberpunk",
    "url": "https://gist.github.com/simon-raynor/8ed17a4642e52d5ec737e5294112aa79",
    "heat": 1,
    "order": -2,
    "noise": 3,
    "weight": 0
  },
  {
    "id": "ui-017",
    "family": "Punk",
    "url": "https://gist.github.com/grateful-dev/cad815ca6c4de90a6caaca79ff15b2f1",
    "heat": 3,
    "order": -2,
    "noise": 3,
    "weight": 1
  },
  {
    "id": "ui-018",
    "family": "Op Art",
    "url": "https://github.com/QC20/Emergent-Loops",
    "heat": 0,
    "order": 1,
    "noise": 2,
    "weight": -1
  },
  {
    "id": "ui-019",
    "family": "Art Nouveau",
    "url": "https://gist.github.com/JohnnySapient/be4acadb8dc61751140ffa1f35dc7ac8",
    "heat": 1,
    "order": -1,
    "noise": 1,
    "weight": -2
  },
  {
    "id": "ui-020",
    "family": "Geometric Abstraction",
    "url": "https://github.com/rossng/where-should-i-aim",
    "heat": 0,
    "order": 3,
    "noise": 0,
    "weight": 1
  },
  {
    "id": "ui-021",
    "family": "Dada",
    "url": "https://github.com/Aupajo/oulipo",
    "heat": 1,
    "order": 2,
    "noise": 2,
    "weight": 0
  },
  {
    "id": "ui-022",
    "family": "Surrealism",
    "url": "https://github.com/ericqweinstein/rukovsky",
    "heat": 0,
    "order": -2,
    "noise": 2,
    "weight": -1
  }
]
```

## Discovery Overview

* **Blueprint Grid (`https://github.com/pinecreativelabs/Blueprint-Grid`) & Brute (`https://github.com/nsolerieu/brute`) [Brutalism / Swiss]:** Blueprint Grid (MIT) packs six distinct layout philosophies—including a `Chaos Grid` (`chaos-grid.js`), `Bento Grid`, `PolyGrids`, and `Print Grid`—into pure CSS and vanilla JS, making it a strong structural reference for giving PCP's `null`-layout movements distinct spatial grammars. `Brute` compresses an opinionated fluid CSS grid into ~3 KB with zero framework bloat.
* **Container Queries + Subgrid (`https://codepen.io/rachelandrew/pen/WNJKpzP`) [Swiss / International]:** Demonstrates how nested poem cards, ledger columns, and sidebar panels can adapt to their parent container (`container-type: inline-size` + `subgrid`) instead of fragile viewport breakpoints.
* **stabilType (`https://github.com/Liiift-Studio/stabilType`) [Futurism]:** Vanilla JS motion-adaptive variable-font controller that maps velocity to `font-variation-settings` (`wght`, `opsz`, `slnt`), `letter-spacing`, and perspective tilt—ideal for tying scroll speed or pot pressure directly to typographic tension without mutating authored words.
* **SVG VSync Turbulence (`https://gist.github.com/simon-raynor/8ed17a4642e52d5ec737e5294112aa79`) & Clip-Path Text Glitch (`https://gist.github.com/grateful-dev/cad815ca6c4de90a6caaca79ff15b2f1`) [Cyberpunk / Punk]:** Zero-WebGL distortion primitives. Using `<feTurbulence>` + `<feDisplacementMap>` or staggered `clip-path: inset()` slices creates high-noise xerox/VHS tearing while keeping underlying DOM text selectable and screen-reader intact.
* **Emergent Loops (`https://github.com/QC20/Emergent-Loops`) & Draw With Flowers (`https://gist.github.com/JohnnySapient/be4acadb8dc61751140ffa1f35dc7ac8`) [Op Art / Art Nouveau]:** Both solve polar-coordinate continuity in GLSL shaders (`atan(y, x)` wrapped via `(cos θ, sin θ)` for seamless simplex noise). Directly adaptable for a subtle Three.js/WebGL backdrop driven by the `board.js` emotion-wheel angles.
* **Oulipo Ruby Gem (`https://github.com/Aupajo/oulipo`) & Rukovsky (`https://github.com/ericqweinstein/rukovsky`) [Dada / Surrealism]:** Lightweight Ruby tools for constrained writing (lipograms, prisoner's constraints, N+7 substitutions, Markov chains)—useful for offline corpus analysis or generating satirical pantry tiles/cutup fragments without touching the authored poems.
* **Literary / Educational Resource — Standard Ebooks (`https://standardebooks.org/subjects/poetry`):** A volunteer-run, Git-tracked public-domain publisher that takes raw Project Gutenberg texts, proofreads them against original scans, typesets them to a rigorous open manual, and releases the resulting editions back into the public domain (`CC0`/PD). Worth adding to the **Food Bank** (`site/src/foodbank.js`) under *Poetry, from scratch* as proof that high craft and open access belong together.
* **Literary / Educational Resource — Open Culture Free eBooks (`https://www.openculture.com/free_ebooks`):** A clean, no-login directory linking to 800+ free ebooks and poetry collections—from Vladimir Mayakovsky and William Blake to Matsuo Bashō, Charles Baudelaire, and T.S. Eliot's critical essays on meter—letting readers cross-examine traditions and form their own poetic taste without tuition or paywalls.

---

## Development Proposals & Usable Code for `imagetoform/pressure-cooker-poetry`

> **Submission note:** This environment does not have GitHub push or pull-request credentials for `imagetoform/pressure-cooker-poetry`, so I cannot open a PR directly on the repo. Below are **review-ready, drop-in examples and architectural proposals** aligned with the repo's Design Law (`site/src/styles.js`, `site/src/board.js`, `docs/DATABASE_SPEC.md`, and `docs/logbook.md`): deterministic via seeded RNG, zero external network calls at runtime, `prefers-reduced-motion` compliant, and never altering authored poem text.

### 1. Responsive Layout Templates (CSS Container Queries + Subgrid + Fluid Type)
**Problem in current build:** As `docs/logbook.md` notes, 12+ movements borrow the 6 existing layout grammars (`manifesto`, `cutup`, `xerox`, `ledger`, `whisper`, `reliquary`), and mobile vs. desktop scaling relies mainly on viewport media queries. Using CSS Container Queries (`cqi`) lets a room's poem block, margins, and drawing wall adapt whether it is rendered full-screen, inside a narrow phone frame, or inside a lab preview pane.

```css
/* Drop-in candidate for site/src/extra.css — Fluid container-aware room grammar */
.room {
  container: pcp-room / inline-size;
}

.room .content {
  display: grid;
  grid-template-columns: minmax(1rem, 1fr) minmax(0, 62ch) minmax(1rem, 1fr);
  gap: clamp(0.75rem, 2.5cqi, 2rem);
  padding-block: clamp(1.5rem, 5cqi, 4rem);
}

.room .poem-wrap {
  grid-column: 2;
  display: grid;
  grid-template-rows: auto 1fr auto;
  font-size: clamp(0.95rem, 1.2cqi + 0.7rem, 1.25rem);
  line-height: 1.55;
}

/* Subgrid keeps stanza titles, body, and receipt/margin notes aligned across split columns */
@container pcp-room (inline-size > 760px) {
  .room.sty-ledger .content,
  .room.sty-xerox .content {
    grid-template-columns: minmax(1rem, 1fr) minmax(0, 44ch) minmax(14rem, 24ch) minmax(1rem, 1fr);
  }
  .room.sty-ledger .poem-wrap { grid-column: 2; }
  .room.sty-ledger .wall-margin {
    grid-column: 3;
    display: grid;
    grid-template-rows: subgrid;
    grid-row: 1 / -1;
  }
}

/* Fix for Rococo ground readability noted in logbook (2026-11-05):
   forces pastel parchment ground inside cutup without altering poem contrast */
.room.sty-rococo.has-sty {
  background: radial-gradient(circle at 20% 20%, #fff5f8 0%, #fce4ec 65%, #f5d0dc 100%);
  color: #1a1a1a;
}
.room.sty-rococo .line {
  background: #fffdf9;
  color: #1a1a1a;
  border: 1px solid #d4af37;
  box-shadow: 3px 3px 0 rgba(26, 26, 26, 0.85);
}
```

---

### 2. Edgy CSS & SVG Filter Animations (Xerox Tear, Constructivist Wedge, Kinetic Type)
Designed to plug directly into `site/src/styles.js` motion classes (`.anim-*`) and respect `.no-motion` / `prefers-reduced-motion: reduce`.

```html
<!-- Include once in live/index.html or inject via build.py: zero-network procedural toner/tear filter -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="pcp-xerox-tear" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.18" numOctaves="2" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```

```css
/* Edgy motion templates for Punk / Dada / Constructivism / Cyberpunk */
@keyframes pcp-wedge-thrust {
  0%   { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); transform: translate3d(-18px, 0, 0) skewX(-6deg); opacity: 0; }
  70%  { clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%); transform: translate3d(2px, 0, 0) skewX(0deg); opacity: 1; }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translate3d(0, 0, 0); opacity: 1; }
}

@keyframes pcp-xerox-jitter {
  0%, 92%, 100% { transform: translate3d(0, 0, 0); clip-path: inset(0 0 0 0); }
  94% { transform: translate3d(-2px, 1px, 0); clip-path: inset(12% 0 58% 0); }
  96% { transform: translate3d(3px, -1px, 0); clip-path: inset(48% 0 18% 0); }
  98% { transform: translate3d(-1px, 0, 0); clip-path: inset(75% 0 4% 0); }
}

.room.sty-constructivism .sty-m { animation: pcp-wedge-thrust 520ms cubic-bezier(0.2, 0.9, 0.2, 1) both; }
.room.sty-punk .sty-m,
.room.sty-zine-diy .sty-m { filter: url(#pcp-xerox-tear); animation: pcp-xerox-jitter 4.5s steps(1, end) infinite; }

@media (prefers-reduced-motion: reduce) {
  .room * { animation: none !important; transition: none !important; }
}
body.no-motion .room * { animation: none !important; transition: none !important; }
```

---

### 3. JavaScript `PCP.animations` Pressurize Candidate (`pressurize-ransom.js`)
Matches the `tools/animations/` contract referenced in `docs/logbook.md` (no network requests, `transform`/`opacity`/`clip-path` only, <= 60 elements, skippable on tap/`Escape`/`Enter`, instant still frame in `reducedMotion`, cleans up DOM cleanly).

```javascript
/* site/tools/animations/pressurize-ransom.js
 * Drops ingredient slips into a boiling pot with seeded Constructivist/Zine energy.
 */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  PCP.animations = PCP.animations || {};

  PCP.animations["pressurize-ransom"] = function (host, ctx, done) {
    // ctx: { ingredients: [{text, cat, t}], psi, colors, rng, reducedMotion, narrow }
    var colors = (ctx.colors && ctx.colors.length) ? ctx.colors : ["#c4161c", "#111111", "#f4f4f2"];
    var rng = ctx.rng || Math.random;
    var r = function (a, b) { return a + (typeof rng === "function" ? rng() : rng.next()) * (b - a); };

    var wrap = document.createElement("div");
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");
    wrap.style.cssText = [
      "position:fixed;inset:0;z-index:9999;display:grid;place-items:center;",
      "background:rgba(14,14,14,0.92);color:#f4f4f2;overflow:hidden;cursor:pointer;"
    ].join("");

    var live = document.createElement("p");
    live.textContent = "Pressurizing " + (ctx.ingredients || []).length + " ingredients (" + Math.round(ctx.psi || 0) + " PSI). Tap or press Esc to skip.";
    live.style.cssText = "font:700 0.85rem/1.2 monospace;letter-spacing:0.08em;text-transform:uppercase;z-index:2;background:#111;padding:0.4rem 0.7rem;border:2px solid " + colors[0] + ";";
    wrap.appendChild(live);

    var items = (ctx.ingredients || []).slice(0, 18);
    var slips = items.map(function (ing, i) {
      var el = document.createElement("span");
      el.textContent = ing.text;
      var deg = r(-14, 14).toFixed(1);
      var dx = r(-36, 36).toFixed(1);
      var dy = r(-28, 28).toFixed(1);
      el.style.cssText = [
        "position:absolute;padding:0.28rem 0.55rem;font:700 clamp(0.8rem,2vw,1.15rem)/1.1 monospace;",
        "background:" + colors[i % colors.length] + ";color:" + (i % 2 ? "#f4f4f2" : "#111") + ";",
        "border:2px solid #111;will-change:transform,opacity;",
        "transform:translate3d(" + dx + "vw," + dy + "vh,0) rotate(" + deg + "deg);"
      ].join("");
      wrap.appendChild(el);
      return { el: el, deg: deg };
    });

    host.appendChild(wrap);

    var finished = false;
    function cleanup() {
      if (finished) return;
      finished = true;
      window.removeEventListener("keydown", onKey);
      wrap.removeEventListener("click", cleanup);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      if (done) done();
    }
    function onKey(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") cleanup();
    }
    window.addEventListener("keydown", onKey);
    wrap.addEventListener("click", cleanup);

    if (ctx.reducedMotion) {
      setTimeout(cleanup, 480);
      return cleanup;
    }

    // Converge slips into the center under pressure
    requestAnimationFrame(function () {
      slips.forEach(function (s, idx) {
        s.el.style.transition = "transform 700ms cubic-bezier(.2,.85,.25,1) " + (idx * 55) + "ms, opacity 400ms ease " + (1500 + idx * 30) + "ms";
        s.el.style.transform = "translate3d(0,0,0) rotate(" + (Number(s.deg) * 0.25).toFixed(1) + "deg) scale(0.75)";
        s.el.style.opacity = "0.15";
      });
    });

    var totalMs = Math.min(3100, 2200 + items.length * 45);
    setTimeout(cleanup, totalMs);
    return cleanup;
  };
})();
```

---

### 4. Three.js / GLSL Polar Emotion-Field Shader (Optional Progressive Layer)
For movements like `op-art`, `psychedelia`, `cyberpunk`, or `vaporwave`, a lightweight Three.js plane behind `.content` (`pointer-events: none; z-index: 0`) can translate the exact `darts` array from `site/src/board.js` (`angle` + `r` + `bull`) into a slow polar wave interference pattern—respecting reduced motion by rendering a single static frame.

```javascript
/* Fragment shader snippet driven by PCP.board.throwDarts() output */
const PCP_POLAR_FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2  u_dart;      // normalized xy from board.js (-1..1)
  uniform float u_overwhelm; // 1.0 if bullseye triggered, else 0.0
  uniform vec3  u_colA;
  uniform vec3  u_colB;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0 - (u_dart * 0.35);
    float radius = length(p);
    float angle  = atan(p.y, p.x);
    // Continuous angular mapping prevents seam discontinuity at -PI/PI
    float wave = sin(radius * (10.0 + u_overwhelm * 14.0) - u_time * 0.6)
               + cos(cos(angle) * 4.0 + sin(angle) * 4.0 + u_time * 0.4);
    float band = smoothstep(-0.25, 0.25, wave);
    // Keep center calmer so poem typography stays legible
    float edgeMask = smoothstep(0.25, 0.95, radius);
    vec3 col = mix(u_colA, u_colB, band);
    gl_FragColor = vec4(col, edgeMask * 0.22);
  }
`;
```

*Integration safeguard:* Because `site/tools/animations/prompt.md` and `README.md` keep the live site dependency-free and offline-safe, bundle Three.js locally or gate this module behind `if (window.THREE && !reducedMotion)` with a fallback to the existing CSS `.sty-tex` textures.

---

### 5. Ruby Offline Tooling (`pantry_audit.rb` + Oulipo Cut-Up Helper)
Since the repo builds statically (`build.py` -> `dist/index.html`), Ruby shines as a fast CLI editorial tool for auditing `site/src/pantry-plus.js` against `DATABASE_SPEC.md` rules (total taste 8–12, 2–4 tastes, spread across all 6 tastes) and generating constrained Oulipo-style "house stock" fragments offline.

```ruby
#!/usr/bin/env ruby
# tools/pantry_audit.rb — Audits compact pantry rows ["id", "text", "cat", "bi9 so1"]
# Usage: ruby tools/pantry_audit.rb site/src/pantry-plus.js

require "json"

TASTE_CODES = {
  "sw" => :sweet, "so" => :sour, "sa" => :salty,
  "bi" => :bitter, "um" => :umami, "sp" => :spicy
}.freeze

file = ARGV[0] or abort("Usage: ruby #{$0} path/to/pantry-plus.js")
raw  = File.read(file)

rows = raw.scan(/\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\]/)
abort("No compact pantry rows found.") if rows.empty?

dominant_counts = Hash.new(0)
warnings = []

rows.each do |id, _text, cat, taste_str|
  tastes = {}
  taste_str.split.each do |tok|
    if tok =~ /\A(sw|so|sa|bi|um|sp)(\d+)\z/
      tastes[TASTE_CODES[$1]] = $2.to_i
    else
      warnings << "#{id}: invalid taste token '#{tok}'"
    end
  end

  total = tastes.values.sum
  warnings << "#{id} (#{cat}): taste count #{tastes.size} (expected 2..4)" unless (2..4).include?(tastes.size)
  warnings << "#{id} (#{cat}): total #{total} outside 8..12" unless (8..12).include?(total)

  dom = tastes.max_by { |_k, v| v }&.first
  dominant_counts[dom] += 1 if dom
end

puts "Audited #{rows.size} pantry rows."
puts "Dominant taste distribution: #{dominant_counts}"
puts "Warnings (#{warnings.size}):"
warnings.first(25).each { |w| puts "  - #{w}" }
```

---

### 6. Brainstormed Development Ideas for Review (`imagetoform/pressure-cooker-poetry`)
1. **Map `(heat, order, noise, weight)` into `tastes.js` / `styles.js` cleanly:** Right now `styles.js` uses emotion words (`emo`) while the curator pipeline tags UI snippets with `heat / order / noise / weight` (`-3..+3`). A lightweight bridge in `site/tools/build_kits.py` could use those 4 axes to select *which* kit variant (`button`, `texture`, `motion`) fits a high-heat/high-noise pot vs. a cold/high-order pot—without exposing any numbers on cutouts or to visitors.
2. **Give the 4 `layout: null` movements dedicated CSS grammars:** `cyberpunk` (split-terminal / dual-pane HUD), `vaporwave` (tilted Win95 dialog window + marble margin), `abstract-expressionism` (asymmetric bleed canvas), and `op-art` (moiré optical border frame) currently fall back to whatever pressure picks. Adding `.room.sty-cyberpunk`, etc., via `@container` rules will dramatically cut down `cutup`'s ~40% dominance noted in the logbook.
3. **Wire `PCP.animations` into `cook()`:** `tools/animations/pressurize-gauge.js` and `harness.html` exist, and `logbook.md` notes `cook()` isn't wired to `PCP.animations[...]` yet. Routing `cook()` to select a movement-matched animation (e.g., `pressurize-ransom` for `revolt` branch movements) completes the pressurize experience.
4. **Expand `site/src/foodbank.js` with `Standard Ebooks` and `Open Culture` + Add a Gutter Corrections Channel:** Both resources fit Aisle 1 (*Poetry, from scratch*) with zero paywalls, and adding a lightweight `mailto:` / GitHub Issue template link on essay receipts resolves the open feedback-channel item in `docs/logbook.md`.
5. **Convert `library/intake/` JSON Deliveries via a Single Schema Validator:** A tiny pre-commit or GitHub Action check verifying every URL returns HTTP 200 before `build_library.py` or `run.py` ingests it will prevent the dead/invented URL problem documented in the Nov 5 audit (`AUDIT.md`).