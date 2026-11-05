/* pressurize-gauge.js · licence CC0 · written by Claude (Anthropic) for Pressure Cooker Poetry
   The site's current pressurize screen (gauge, needle, PSI count, the visitor's
   recipe, steam) rebuilt to the animation contract in tools/animations/prompt.md.
   It's the reference implementation: copy its shape. */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  PCP.animations = PCP.animations || {};

  var SVGNS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent, ns) {
    var e = ns ? document.createElementNS(SVGNS, tag) : document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "style") e.style.cssText = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (parent) parent.appendChild(e);
    return e;
  }
  var TASTE_ORDER = ["sweet", "sour", "salty", "bitter", "umami", "spicy"];
  function strongest(t) { return TASTE_ORDER.reduce(function (b, k) { return (t && t[k] || 0) > (t && t[b] || 0) ? k : b; }, "sweet"); }

  PCP.animations["pressurize-gauge"] = {
    moment: "pressurize",
    duration: 1500,
    play: function (stage, data) {
      var reduced = !!data.reducedMotion, anims = [], timers = [], finished = false, resolveDone;
      var done = new Promise(function (r) { resolveDone = r; });
      var root = el("div", { "class": "anim-root", style: "position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f4f4f2;text-align:center;overflow:hidden;font-family:var(--f-mono,monospace)" }, stage);
      var recipe = (data.ingredients || []).map(function (i) { return i.text; }).join(" + ") || "no ingredients, just the house stock";
      el("p", { "aria-live": "polite", style: "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)", text: "Pressurizing: " + recipe }, root);

      // gauge
      var svg = el("svg", { viewBox: "0 0 240 150", style: "width:" + (data.narrow ? "78vw" : "min(40vw,360px)") + ";height:auto" }, root, true);
      el("path", { d: "M20 130 A100 100 0 0 1 220 130", fill: "none", stroke: "#f4f4f2", "stroke-width": 10 }, svg, true);
      el("path", { d: "M170 43 A100 100 0 0 1 220 130", fill: "none", stroke: (data.movement && data.movement.colors && data.movement.colors[0]) || "#e2321f", "stroke-width": 10 }, svg, true);
      for (var k = 0; k <= 10; k++) {
        var a = Math.PI + k * Math.PI / 10;
        el("line", { x1: 120 + Math.cos(a) * 88, y1: 130 + Math.sin(a) * 88, x2: 120 + Math.cos(a) * 78, y2: 130 + Math.sin(a) * 78, stroke: "#f4f4f2", "stroke-width": 4 }, svg, true);
      }
      var needle = el("line", { x1: 120, y1: 130, x2: 120, y2: 42, stroke: "#ffd400", "stroke-width": 6, "stroke-linecap": "round", style: "transform-origin:120px 130px;transform-box:view-box;transform:rotate(-90deg)" }, svg, true);
      el("circle", { cx: 120, cy: 130, r: 12, fill: "#f4f4f2" }, svg, true);
      var word = el("p", { text: "Pressurizing", style: "margin:.6rem 0 0;font:400 clamp(2.6rem,12vw,7rem)/.9 var(--f-display,Impact);text-transform:uppercase" }, root);
      var psiP = el("p", { style: "margin:.4rem 0 0;font:700 1.4rem var(--f-mono,monospace);color:#ffd400" }, root);
      var psi = el("span", { text: reduced ? String(data.psi) : "0" }, psiP); psiP.appendChild(document.createTextNode(" PSI"));
      var rec = el("p", { style: "margin:.8rem auto 0;max-width:34ch;padding:0 1rem;font:italic 1.05rem/1.4 var(--f-serif,Georgia);color:#cfcfcf" }, root);
      (data.ingredients || []).forEach(function (ing, i) {     // each slip moves like its strongest taste
        var s = el("span", { text: ing.text, style: "display:inline-block;margin:.15rem .35rem;padding:.1rem .4rem;background:#f4f4f2;color:#111;font-style:normal" }, rec);
        if (reduced) return;
        var t = strongest(ing.tastes), d = 380 + i * 90;
        var kf = {
          sweet: [{ transform: "translateY(-40px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          sour: [{ transform: "rotate(-9deg) translateX(-20px)", opacity: 0 }, { transform: "rotate(4deg)", opacity: 1, offset: 0.7 }, { transform: "rotate(-2deg)", opacity: 1 }],
          salty: [{ transform: "translateY(-30px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          bitter: [{ transform: "translateY(-60px)", opacity: 0, filter: "brightness(.5)" }, { transform: "translateY(0)", opacity: 1 }],
          umami: [{ transform: "scale(1.3)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
          spicy: [{ transform: "translateX(80px) skewX(-20deg)", opacity: 0 }, { transform: "translateX(0)", opacity: 1 }]
        }[t];
        anims.push(s.animate(kf, { duration: t === "sweet" ? 700 : t === "spicy" ? 220 : 420, delay: d, easing: t === "salty" ? "steps(3)" : "cubic-bezier(.3,1.3,.5,1)", fill: "both" }));
      });
      if (!(data.ingredients || []).length) rec.textContent = recipe;

      function finish() {
        if (finished) return; finished = true;
        anims.forEach(function (a) { try { a.finish(); } catch (e) {} });
        timers.forEach(clearTimeout);
        needle.style.transform = "rotate(" + (-90 + 180 * data.pressure).toFixed(1) + "deg)";
        psi.textContent = String(data.psi);
        var out = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
        out.onfinish = function () { root.remove(); stage.removeEventListener("click", finish); document.removeEventListener("keydown", onKey); resolveDone(); };
      }
      function onKey(e) { if (e.key === "Escape" || e.key === "Enter") finish(); }
      stage.addEventListener("click", finish); document.addEventListener("keydown", onKey);

      if (reduced) {
        needle.style.transform = "rotate(" + (-90 + 180 * data.pressure).toFixed(1) + "deg)";
        root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        timers.push(setTimeout(finish, 300));
      } else {
        var target = -90 + 180 * data.pressure, wob = (data.rng() - 0.5) * 6;
        anims.push(needle.animate([{ transform: "rotate(-90deg)" }, { transform: "rotate(" + (target + 8 + wob).toFixed(1) + "deg)", offset: 0.7 }, { transform: "rotate(" + target.toFixed(1) + "deg)" }], { duration: 1000, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "forwards" }));
        anims.push(word.animate([{ transform: "translate(0,0)" }, { transform: "translate(" + (1 + 3 * data.pressure).toFixed(1) + "px,-1px)" }], { duration: 90, iterations: Infinity, easing: "steps(2)" }));
        var t0 = performance.now();
        (function count() {
          if (finished) return;
          var q = Math.min(1, (performance.now() - t0) / 1000);
          psi.textContent = String(Math.round(data.psi * (1 - Math.pow(1 - q, 3))));
          if (q < 1) requestAnimationFrame(count);
        })();
        timers.push(setTimeout(finish, 1500 - 220));
      }
      return { done: done, skip: finish };
    }
  };
})();
