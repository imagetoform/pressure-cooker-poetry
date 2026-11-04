/* =====================================================================
   PRESSURE COOKER POETRY — ROOM COUPONS
   ---------------------------------------------------------------------
   "Save this room" is printed as a grocery coupon. The coupon's link is
   the recipe, so redeeming it rebuilds the exact same room. Coupons
   clipped in this browser go in a drawer (localStorage, best-effort).
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  var h = PCP.h;
  var KEY = "pcp-coupons";
  var lastFocus = null;

  function drawer() { try { return JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { return []; } }
  function saveDrawer(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 24))); } catch (e) {} }

  function snapshot() {
    var app = PCP.app;
    if (!app || !app.cooked || !app.genome) return null;
    var r = app.cooked, g = app.genome;
    var poem = (PCP.poems || []).filter(function (p) { return p.id === r.poemId; })[0] || {};
    var ings = r.ingredients.map(function (id) { return ((PCP.ingredients || []).filter(function (x) { return x.id === id; })[0] || {}).text; }).filter(Boolean);
    var fam = PCP.familyById && PCP.familyById[g.family];
    return {
      code: "PCP-" + g.fingerprint,
      url: location.href.split("#")[0] + app.recipeURL(r),
      poem: poem.title || "untitled",
      ings: ings,
      family: fam ? fam.name : g.family,
      psi: g.analysis.psi,
      seed: r.seed, variant: r.variant,
      flavor: PCP.tastes ? PCP.tastes.tasteWords(PCP.tastes.potFlavor(r.ingredients, r), 2) : "",
      date: new Date().toISOString().slice(0, 10)
    };
  }

  var FINE = "Void where profit is prohibited. Limit one revolution per customer. No cash value; it was never about the cash. Redeemable forever at pressurecookerpoetry.com.";

  function couponCard(c) {
    return h("div", { "class": "cp-card" }, [
      h("div", { "class": "cp-left" }, [
        h("p", { "class": "cp-maker", text: "MANUFACTURER'S COUPON · EXPIRES NEVER" }),
        h("p", { "class": "cp-save" }, [h("span", { text: "SAVE" }), h("strong", { text: "100%" })]),
        h("p", { "class": "cp-on", text: "on this exact room" }),
        h("p", { "class": "cp-recipe", text: (c.ings.length ? c.ings.join(" + ") : "house stock") + " → “" + c.poem + "”" }),
        h("p", { "class": "cp-meta", text: c.family + " · " + c.psi + " PSI" + (c.flavor ? " · tastes " + c.flavor : "") }),
        h("p", { "class": "cp-fine", text: FINE })
      ]),
      h("div", { "class": "cp-right" }, [
        h("p", { "class": "cp-code-l", text: "COUPON CODE" }),
        h("p", { "class": "cp-code", text: c.code }),
        h("div", { "class": "cp-barcode", "aria-hidden": "true" }),
        h("p", { "class": "cp-seed", text: c.seed + " / v" + c.variant })
      ])
    ]);
  }

  function drawPNG(c) {
    var W = 1200, H = 560, cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var x = cv.getContext("2d");
    x.fillStyle = "#fffbe6"; x.fillRect(0, 0, W, H);
    x.setLineDash([18, 12]); x.lineWidth = 6; x.strokeStyle = "#111"; x.strokeRect(18, 18, W - 36, H - 36);
    x.setLineDash([]);
    x.fillStyle = "#c4161c"; x.fillRect(820, 18, 3, H - 36);
    x.fillStyle = "#111";
    x.font = '700 22px "Space Mono", monospace'; x.fillText("MANUFACTURER'S COUPON · EXPIRES NEVER", 56, 78);
    x.font = '400 150px "Anton", Impact, sans-serif'; x.fillText("SAVE 100%", 52, 240);
    x.font = 'italic 600 38px "Fraunces Var", Georgia, serif'; x.fillText("on this exact room", 58, 300);
    x.font = '500 26px "Fraunces Var", Georgia, serif';
    wrap(x, (c.ings.length ? c.ings.join(" + ") : "house stock") + " → “" + c.poem + "”", 58, 352, 730, 32, 2);
    x.font = '700 20px "Space Mono", monospace'; x.fillText((c.family + " · " + c.psi + " PSI").toUpperCase(), 58, 440);
    x.font = '400 15px "Space Mono", monospace'; wrap(x, FINE, 58, 478, 730, 20, 3);
    x.font = '700 18px "Space Mono", monospace'; x.fillText("COUPON CODE", 860, 90);
    x.font = '400 46px "Anton", Impact, sans-serif'; x.fillText(c.code, 860, 150);
    var rng = PCP.engine.makeRng("barcode|" + c.code), bx = 860;
    while (bx < 1140) { var w = rng.int(2, 9); x.fillRect(bx, 190, w, 190); bx += w + rng.int(3, 8); }
    x.font = '700 16px "Space Mono", monospace'; x.fillText(c.seed + " / v" + c.variant, 860, 420);
    x.font = '400 14px "Space Mono", monospace'; wrap(x, c.url, 860, 460, 300, 18, 4);
    return cv;
  }
  function wrap(x, text, left, top, width, lh, maxLines) {
    var ws = text.split(/\s+/), line = "", y = top, n = 0;
    for (var i = 0; i < ws.length; i++) {
      var test = line ? line + " " + ws[i] : ws[i];
      if (x.measureText(test).width > width && line) {
        x.fillText(line, left, y); y += lh; line = ws[i]; if (++n >= maxLines - 1) { line = ws.slice(i).join(" "); break; }
      } else line = test;
    }
    if (line) {
      while (x.measureText(line).width > width && line.length > 4) line = line.slice(0, -2);
      x.fillText(line, left, y);
    }
  }

  function close() {
    var m = document.getElementById("couponModal");
    if (m) m.remove();
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(ev) {
    if (ev.key === "Escape") { ev.preventDefault(); close(); return; }
    if (ev.key === "Tab") {
      var m = document.getElementById("couponModal"); if (!m) return;
      var f = m.querySelectorAll("button, a[href]");
      if (!f.length) return;
      if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
    }
  }

  function open() {
    var c = snapshot();
    if (!c) return;
    lastFocus = document.activeElement;
    var list = drawer().filter(function (x) { return x.code !== c.code; });
    list.unshift({ code: c.code, url: c.url, poem: c.poem, ings: c.ings, date: c.date });
    saveDrawer(list);

    var copyBtn = h("button", { type: "button", "class": "nl-btn", text: "Copy coupon link" });
    var pngBtn = h("button", { type: "button", "class": "nl-btn cook", text: "Save coupon image" });
    var closeBtn = h("button", { type: "button", "class": "cp-close", "aria-label": "Close coupon", text: "×" });
    var older = list.slice(1);
    var box = h("div", { "class": "cp-box", role: "dialog", "aria-modal": "true", "aria-labelledby": "cpTitle" }, [
      closeBtn,
      h("p", { "class": "cp-scissors", "aria-hidden": "true", text: "✂ - - - - - - - - - - - - - - - - - - - - - - - -" }),
      h("h2", { "class": "sr-only", id: "cpTitle", text: "Your coupon for this room" }),
      couponCard(c),
      h("div", { "class": "cp-actions" }, [copyBtn, pngBtn, h("a", { "class": "nl-btn", href: c.url.slice(c.url.indexOf("#")), text: "Redeem" })]),
      h("p", { "class": "cp-note", text: "The link is the recipe. Anyone who opens it gets this exact room, today or ten years from now." }),
      older.length ? h("div", { "class": "cp-drawer" }, [
        h("p", { "class": "cp-drawer-h", text: "Your coupon drawer (this browser only)" }),
        h("ul", null, older.slice(0, 8).map(function (o) {
          return h("li", null, [h("a", { href: o.url.slice(o.url.indexOf("#")), text: o.code }), document.createTextNode(" · " + (o.ings && o.ings.length ? o.ings.join(" + ") : "house stock") + " → " + o.poem + " · " + o.date)]);
        }))
      ]) : null
    ]);
    var modal = h("div", { "class": "cp-modal", id: "couponModal" }, [box]);
    modal.addEventListener("click", function (ev) { if (ev.target === modal) close(); });
    box.addEventListener("click", function (ev) { var a = ev.target.closest && ev.target.closest("a[href^='#']"); if (a) setTimeout(close, 0); });
    closeBtn.addEventListener("click", close);
    copyBtn.addEventListener("click", function () {
      function ok() { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy coupon link"; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c.url).then(ok, function () { window.prompt("Copy this link:", c.url); });
      else window.prompt("Copy this link:", c.url);
    });
    pngBtn.addEventListener("click", function () {
      var cv = drawPNG(c);
      cv.toBlob(function (blob) {
        if (!blob) return;
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "pcp-coupon-" + c.code + ".png";
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      });
    });
    document.body.appendChild(modal);
    document.addEventListener("keydown", onKey);
    copyBtn.focus();
  }

  function init() {
    var btn = document.getElementById("couponBtn");
    if (btn) btn.addEventListener("click", open);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  PCP.coupon = { open: open, close: close, drawer: drawer, drawPNG: drawPNG };
})();
