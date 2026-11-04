/* =====================================================================
   PRESSURE COOKER POETRY — TASTES
   ---------------------------------------------------------------------
   Visitors only ever see flavor. Each ingredient carries six tastes
   (0–10). Behind the counter, every taste point pushes the four hidden
   dials (energy, clarity, intimacy, chaos) by a fixed amount, so the
   flavor on the tile is exactly what drives the room. Nothing here is
   random: same tastes -> same pushes -> same room.

   To add an ingredient, give it `t` instead of `d`:
     { id, text, cat, t: { sweet, sour, salty, bitter, umami, spicy } }
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});

  var TASTES = [
    { key: "sweet",  label: "Sweet",  color: "#f29bc0", room: "closeness and softness: wider margins, gentler type, slower motion" },
    { key: "sour",   label: "Sour",   color: "#d9e021", room: "a sharp, wide-awake page: crisp edges, quicker motion, a little jumpiness" },
    { key: "salty",  label: "Salty",  color: "#9fc3e0", room: "order and plain speech: a steady grid, clean columns, nothing spilling" },
    { key: "bitter", label: "Bitter", color: "#6f8f4e", room: "distance and fog: colder rooms, crowded corners, more noise than comfort" },
    { key: "umami",  label: "Umami",  color: "#b4693c", room: "depth and weight: dense, grounded, close to the body, slow to move" },
    { key: "spicy",  label: "Spicy",  color: "#e2321f", room: "heat and noise: bigger, wider type, faster motion, more tilt and collision" }
  ];

  /* Taste point -> dial push. One point of spicy adds 2.5 energy, etc. */
  var MATRIX = {
    sweet:  { e: -1,   c: -0.5, i: 2,    x: -0.5 },
    sour:   { e: 1.5,  c: 2,    i: -0.5, x: 1.5 },
    salty:  { e: 0,    c: 2,    i: 0,    x: -2 },
    bitter: { e: -0.5, c: -2,   i: -2,   x: 1 },
    umami:  { e: -0.5, c: 1,    i: 2,    x: -1.5 },
    spicy:  { e: 2.5,  c: -0.5, i: 0.5,  x: 2 }
  };

  /* Taste profiles for the v1 pantry (keyed by ingredient id). */
  var PANTRY_TASTES = {
    "borrowed-light":      { sweet: 5, sour: 2, salty: 3 },
    "cold-coffee":         { bitter: 5, sour: 5, spicy: 4 },
    "union-bread":         { umami: 6, salty: 3, sweet: 2, sour: 1 },
    "red-ink":             { spicy: 7, sour: 4, bitter: 1 },
    "grandmothers-hands":  { sweet: 7, umami: 5 },
    "honest-sentence":     { salty: 7, sour: 3, umami: 2 },
    "ceo-prayers":         { bitter: 8, sour: 3 },
    "static":              { bitter: 6, spicy: 5, sour: 3 },
    "long-shift-salt":     { salty: 4, umami: 4, spicy: 3 },
    "store-brand-silence": { salty: 6, bitter: 3, sweet: 2 },
    "earnings-call":       { bitter: 9, sour: 3, spicy: 2 },
    "crow-on-wire":        { umami: 4, sour: 3, sweet: 3 },
    "embers":              { spicy: 6, umami: 4, sweet: 2 },
    "ruler-no-numbers":    { sour: 6, bitter: 3 },
    "bootstraps":          { bitter: 6, spicy: 4, salty: 1 },
    "unsent-letter":       { sweet: 6, umami: 4, bitter: 3 },
    "fluorescent-hum":     { bitter: 5, salty: 3, sour: 3 },
    "marigold-riot":       { spicy: 6, sweet: 4, sour: 2 },
    "empty-chair":         { umami: 5, sweet: 4, bitter: 2, salty: 2 },
    "shareholder-sermon":  { bitter: 7, sour: 3, spicy: 2 },
    "gold-foil-nothing":   { bitter: 6, spicy: 4, sour: 3, sweet: 1 },
    "three-am":            { spicy: 5, sweet: 3, sour: 2 },
    "strike-fund":         { salty: 5, umami: 4, spicy: 3 },
    "margin-manifesto":    { sour: 5, spicy: 4, salty: 2 },
    "tv-dinner":           { sweet: 5, salty: 3, bitter: 2, sour: 1 },
    "landlord-apology":    { bitter: 7, sour: 3, sweet: 1 },
    "drum-solo":           { spicy: 8, sour: 3, bitter: 2 },
    "rust":                { bitter: 5, umami: 3, sour: 2, spicy: 1 }
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function fullTastes(t) {
    var o = {};
    TASTES.forEach(function (ts) { o[ts.key] = clamp(Math.round(+((t || {})[ts.key]) || 0), 0, 10); });
    return o;
  }

  /* tastes -> dial push (-25..+25 per dial) */
  function push(t) {
    var d = { e: 0, c: 0, i: 0, x: 0 };
    TASTES.forEach(function (ts) {
      var n = t[ts.key] || 0, m = MATRIX[ts.key];
      d.e += m.e * n; d.c += m.c * n; d.i += m.i * n; d.x += m.x * n;
    });
    Object.keys(d).forEach(function (k) { d[k] = clamp(Math.round(d[k]), -25, 25); });
    return d;
  }

  /* hidden dials (0–100 each) -> what it tastes like (0–10 each).
     Each taste is the dials' agreement with that taste's direction. */
  var DIRS = {};
  TASTES.forEach(function (ts) {
    var m = MATRIX[ts.key], len = Math.sqrt(m.e * m.e + m.c * m.c + m.i * m.i + m.x * m.x);
    DIRS[ts.key] = { e: m.e / len, c: m.c / len, i: m.i / len, x: m.x / len };
  });
  function flavorOf(dials) {
    var v = {
      e: ((+dials.energy || 0) - 50) / 50, c: ((+dials.clarity || 0) - 50) / 50,
      i: ((+dials.intimacy || 0) - 50) / 50, x: ((+dials.chaos || 0) - 50) / 50
    };
    var out = {};
    TASTES.forEach(function (ts) {
      var d = DIRS[ts.key];
      var dot = v.e * d.e + v.c * d.c + v.i * d.i + v.x * d.x;
      out[ts.key] = clamp(Math.round(4 + 6 * dot), 0, 10);
    });
    return out;
  }

  /* the strongest tastes, strongest first */
  function topTastes(t, n) {
    return TASTES.map(function (ts) { return { key: ts.key, label: ts.label, v: t[ts.key] || 0 }; })
      .filter(function (x) { return x.v > 0; })
      .sort(function (a, b) { return b.v - a.v || TASTES.findIndex(function (q) { return q.key === a.key; }) - TASTES.findIndex(function (q) { return q.key === b.key; }); })
      .slice(0, n || 6);
  }
  function tasteLine(t, n) {
    return topTastes(t, n).map(function (x) { return x.label.toLowerCase() + " " + x.v; }).join(" · ");
  }
  function tasteWords(t, n) {
    var top = topTastes(t, n || 2).map(function (x) { return x.label.toLowerCase(); });
    return top.length > 1 ? top.slice(0, -1).join(", ") + " and " + top[top.length - 1] : (top[0] || "plain");
  }

  /* what a pot tastes like: the chosen ingredients' tastes added up
     (capped at 10); an empty pot tastes like its dials (house stock) */
  function potFlavor(ingredientIds, dials) {
    var ings = (ingredientIds || []).map(function (id) { return (PCP.ingredients || []).filter(function (x) { return x.id === id; })[0]; }).filter(function (x) { return x && x.t; });
    if (!ings.length) return flavorOf(dials || {});
    var o = {};
    TASTES.forEach(function (ts) { o[ts.key] = Math.min(10, ings.reduce(function (n, ing) { return n + (ing.t[ts.key] || 0); }, 0)); });
    return o;
  }

  /* attach tastes to the pantry and derive the hidden pushes from them */
  (PCP.ingredients || []).forEach(function (ing) {
    if (!ing.t && PANTRY_TASTES[ing.id]) ing.t = PANTRY_TASTES[ing.id];
    if (ing.t) { ing.t = fullTastes(ing.t); ing.d = push(ing.t); }
  });

  PCP.tastes = {
    LIST: TASTES, MATRIX: MATRIX,
    push: push, flavorOf: flavorOf, potFlavor: potFlavor, topTastes: topTastes, tasteLine: tasteLine, tasteWords: tasteWords, full: fullTastes
  };
})();
