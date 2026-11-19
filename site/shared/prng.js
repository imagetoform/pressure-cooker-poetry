/* Seeded randomness for Pressure Cooker Poetry (AGENTS.md law 2: same inputs, same result).
   cyrb128 -> sfc32 with 15 warm-up draws, moved verbatim from the retired Kitchen (site/live/index.html, 2026-11-18).
   Use: const r = PCP.prng.makeRng('some key'); r.next(), r.int(a,b), r.pick(arr), r.shuffle(arr) ...
   Never use Math.random() or Date.now() for anything a visitor sees; a brand-new seed may come from crypto.getRandomValues. */
(function () {
  "use strict";
  /* ---------- hashing + PRNG (cyrb128 -> sfc32) ---------- */
  function cyrb128(str) {
    var h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (var i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= h2 ^ h3 ^ h4; h2 ^= h1; h3 ^= h1; h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
  }
  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }
  function makeRng(key) {
    var s = cyrb128(String(key));
    var f = sfc32(s[0], s[1], s[2], s[3]);
    for (var i = 0; i < 15; i++) f();
    var r = {
      next: f,
      range: function (a, b) { return a + (b - a) * f(); },
      int: function (a, b) { return Math.floor(a + (b - a + 1) * f()); },
      pick: function (arr) { return arr[Math.floor(f() * arr.length)]; },
      chance: function (p) { return f() < p; },
      sign: function () { return f() < 0.5 ? -1 : 1; },
      weighted: function (items, weights) {
        var total = 0, i;
        for (i = 0; i < weights.length; i++) total += Math.max(0, weights[i]);
        if (total <= 0) return items[Math.floor(f() * items.length)];
        var t = f() * total;
        for (i = 0; i < items.length; i++) {
          t -= Math.max(0, weights[i]);
          if (t <= 0) return items[i];
        }
        return items[items.length - 1];
      },
      shuffle: function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(f() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
      }
    };
    return r;
  }
  function hashString(str) {
    var h = cyrb128(String(str));
    return h.map(function (n) { return n.toString(36); }).join("").slice(0, 16);
  }

  /* ---------- helpers ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  window.PCP = window.PCP || {};
  window.PCP.prng = { cyrb128: cyrb128, sfc32: sfc32, makeRng: makeRng, hashString: hashString };
})();
