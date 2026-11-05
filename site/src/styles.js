/* =====================================================================
   PRESSURE COOKER POETRY — THE STYLE TREE
   ---------------------------------------------------------------------
   A family tree of design movements. Every movement is tagged with
   emotions from THE DARTBOARD (words, no numbers). The pot's darts pick
   one or two movements, and their motifs and textures are layered into
   the room on top of whichever layout family the pressure chose, so a
   Ledger room can come out Art Nouveau, or a Whisper room cyberpunk.

   Rules: style layers are decoration only. They sit behind the text,
   never touch the poem's colours, and keep to the edges, so the poem
   always stays readable.

   Each movement is a whole kit:
     layout   which of the six layout grammars it builds the room with (null = let the pressure pick)
     motion   how its pieces move (CSS keyframes "sty-<motion>", off when Motion is off)
     button   the site's Pressurize / Valve / Coupon buttons take its skin while its room is served
     cutouts  its own fragments: tag cutouts with the movement's emotions (or cats) in the manifest
     motif    procedural ornaments, drawn until real cutouts exist
   Shape: branch { id, name, movements: [
     { id, layout, motion, name, emo: [...], blurb, colors: [...], texture?, count, motif(rng, colors, i) -> SVG } ] }
   Adding a movement = one entry in the tree. Nothing else changes.
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});

  function svg(body, vb) { return '<svg viewBox="' + (vb || "0 0 200 200") + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + body + "</svg>"; }
  function f(n) { return Math.round(n * 10) / 10; }
  function pick(r, a) { return a[Math.floor(r.next() * a.length)]; }

  var TREE = [
    { id: "ornament", name: "Organic & ornamental", movements: [
      { id: "art-nouveau", layout: "reliquary", motion: "grow", name: "Art Nouveau", emo: ["serenity", "love", "admiration"], blurb: "1890s–1910s. Whiplash curves, vines and flowers; nature as line.", colors: ["#6b7a2f", "#b08d3c", "#3f5a3a"], count: 3,
        motif: function (r, c) {
          var p = "M10 190 C 40 120, " + f(r.range(60, 120)) + " " + f(r.range(140, 180)) + ", 100 100 S " + f(r.range(150, 190)) + " 40, 120 10";
          return svg('<path d="' + p + '" fill="none" stroke="' + c[0] + '" stroke-width="6" stroke-linecap="round"/>' +
            '<path d="M100 100 c 30 -10, 40 10, 20 30 c -20 20, -40 0, -20 -30" fill="' + c[1] + '" opacity=".8"/>' +
            '<circle cx="' + f(r.range(40, 160)) + '" cy="' + f(r.range(40, 160)) + '" r="14" fill="none" stroke="' + c[2] + '" stroke-width="4"/>');
        } },
      { id: "art-deco", layout: "reliquary", motion: "rise", name: "Art Deco", emo: ["admiration", "anticipation", "ecstasy"], blurb: "1920s–30s. Sunbursts, stepped forms, gold geometry of the machine-age luxury class.", colors: ["#c9a227", "#111111", "#1d5c5a"], count: 2,
        motif: function (r, c) {
          var rays = ""; for (var k = 0; k < 9; k++) { var a = Math.PI + k * Math.PI / 8; rays += '<line x1="100" y1="190" x2="' + f(100 + Math.cos(a) * 95) + '" y2="' + f(190 + Math.sin(a) * 95) + '" stroke="' + c[0] + '" stroke-width="4"/>'; }
          return svg(rays + '<path d="M40 190 h120 v-20 h-20 v-20 h-80 v20 h-20z" fill="' + c[2] + '"/><path d="M70 150 h60 v-20 h-60z" fill="' + c[1] + '"/>');
        } },
      { id: "psychedelia", layout: "reliquary", motion: "melt", name: "Psychedelia", emo: ["amazement", "ecstasy", "distraction"], blurb: "1960s. Melting type, vibrating complementary colour, concert-poster swirl.", colors: ["#ff3fa4", "#ffb800", "#7a2cff", "#00c2a8"], count: 2,
        motif: function (r, c) {
          var out = ""; for (var k = 6; k > 0; k--) { var rr = k * 15, w = f(r.range(4, 12)); out += '<path d="M' + (100 - rr) + ' 100 q ' + f(rr / 2) + ' ' + (-w) + ', ' + rr + ' 0 t ' + rr + ' 0 q ' + f(-rr / 2) + ' ' + w + ', ' + (-rr) + ' ' + f(rr * .2) + ' t ' + (-rr) + ' 0z" fill="' + c[k % c.length] + '"/>'; }
          return svg(out);
        } }
    ] },
    { id: "order", name: "Order & reduction", movements: [
      { id: "minimalism", layout: "whisper", motion: "fade", name: "Minimalism", emo: ["serenity", "acceptance", "pensiveness"], blurb: "1960s on. Less, then less again: one line, one mark, a lot of air.", colors: ["#111111", "#d4251c"], count: 1,
        motif: function (r, c) { return svg('<line x1="20" y1="' + f(r.range(60, 140)) + '" x2="180" y2="' + f(r.range(60, 140)) + '" stroke="' + c[0] + '" stroke-width="2"/><circle cx="' + f(r.range(30, 170)) + '" cy="' + f(r.range(30, 170)) + '" r="6" fill="' + c[1] + '"/>'); } },
      { id: "swiss", layout: "ledger", motion: "slide", name: "Swiss / International", emo: ["trust", "interest", "vigilance"], blurb: "1950s. The grid, flush-left type, objective and clear.", colors: ["#d4251c", "#111111"], texture: "grid", count: 2,
        motif: function (r, c) { return svg('<rect x="20" y="20" width="' + f(r.range(40, 90)) + '" height="' + f(r.range(40, 90)) + '" fill="' + c[0] + '"/><text x="30" y="185" font-family="Archivo, Arial" font-weight="900" font-size="90" fill="' + c[1] + '">' + r.int(1, 9) + "</text>"); } },
      { id: "bauhaus", layout: "manifesto", motion: "spin", name: "Bauhaus", emo: ["anticipation", "trust", "interest"], blurb: "1919–1933. Circle, square, triangle; art and industry as one school.", colors: ["#d4251c", "#1f4fbf", "#f2c200", "#111111"], count: 3,
        motif: function (r, c) { var k = r.int(0, 2), col = c[r.int(0, 2)]; return svg(k === 0 ? '<circle cx="100" cy="100" r="80" fill="' + col + '"/>' : k === 1 ? '<rect x="25" y="25" width="150" height="150" fill="' + col + '"/>' : '<path d="M100 15 L185 180 H15z" fill="' + col + '"/>'); } },
      { id: "brutalism", layout: "ledger", motion: "drop", name: "Brutalism", emo: ["disapproval", "vigilance", "boredom"], blurb: "Raw concrete, exposed structure, no apology. Honest about what holds it up.", colors: ["#111111", "#8a8a85"], texture: "concrete", count: 2,
        motif: function (r, c) { return svg('<rect x="10" y="10" width="180" height="' + f(r.range(40, 80)) + '" fill="' + c[1] + '" stroke="' + c[0] + '" stroke-width="8"/><rect x="10" y="110" width="' + f(r.range(60, 180)) + '" height="80" fill="none" stroke="' + c[0] + '" stroke-width="8"/>'); } }
    ] },
    { id: "revolt", name: "Revolt & noise", movements: [
      { id: "constructivism", layout: "manifesto", motion: "thrust", name: "Constructivism", emo: ["anticipation", "aggressiveness", "admiration"], blurb: "1917–1930s. Art for the revolution: red wedges, diagonals, the poster as a tool.", colors: ["#c4161c", "#111111", "#e8dcc4"], count: 2,
        motif: function (r, c) { return svg('<path d="M0 200 L200 ' + f(r.range(0, 60)) + ' L200 ' + f(r.range(80, 140)) + 'z" fill="' + c[0] + '"/><rect x="20" y="' + f(r.range(20, 60)) + '" width="120" height="16" fill="' + c[1] + '" transform="rotate(-20 80 50)"/><circle cx="150" cy="150" r="22" fill="' + c[1] + '"/>'); } },
      { id: "dada", layout: "cutup", motion: "jitter", name: "Dada", emo: ["amazement", "distraction", "contempt"], blurb: "1916 on. Anti-art against a world that made the war. Nonsense as a weapon.", colors: ["#111111", "#f4f4f2", "#c4161c"], count: 3,
        motif: function (r, c) { var w = pick(r, ["DA", "DADA", "NO", "?", "ART?", "BANK", "ZANG"]); return svg('<rect x="15" y="60" width="170" height="80" fill="' + c[1] + '" stroke="' + c[0] + '" stroke-width="3"/><text x="100" y="122" text-anchor="middle" font-family="Anton, Impact" font-size="62" fill="' + pick(r, [c[0], c[2]]) + '">' + w + "</text>"); } },
      { id: "punk", layout: "xerox", motion: "jitter", name: "Punk", emo: ["rage", "contempt", "aggressiveness"], blurb: "1976 on. Photocopier, scissors, glue stick. Do it yourself because nobody will do it for you.", colors: ["#111111", "#ff2d6f", "#f4f4f2"], texture: "toner", count: 3,
        motif: function (r, c) { var k = r.int(0, 2);
          if (k === 0) return svg('<path d="M30 40 L170 160 M170 40 L30 160" stroke="' + c[0] + '" stroke-width="22" stroke-linecap="square"/>');
          if (k === 1) return svg('<rect x="10" y="80" width="180" height="40" fill="' + c[2] + '" opacity=".85" transform="rotate(' + f(r.range(-25, 25)) + ' 100 100)"/>');
          return svg('<path d="M60 40 a40 40 0 1 0 80 0 v110 a20 20 0 0 1 -40 0 v-90" fill="none" stroke="' + c[1] + '" stroke-width="10"/>'); } }
    ] },
    { id: "future", name: "Future & machine", movements: [
      { id: "futurism", layout: "manifesto", motion: "speed", name: "Futurism", emo: ["anticipation", "ecstasy", "aggressiveness"], blurb: "1909. Speed, engines, noise. (Its founders also loved war; read the manifestos critically.)", colors: ["#e2321f", "#111111", "#f2c200"], count: 2,
        motif: function (r, c) { var out = ""; for (var k = 0; k < 7; k++) { var y = 20 + k * 25; out += '<path d="M' + f(r.range(0, 60)) + ' ' + y + ' L200 ' + f(y + r.range(-10, 10)) + '" stroke="' + c[k % 3] + '" stroke-width="' + f(r.range(3, 12)) + '"/>'; } return svg(out); } },
      { id: "cyberpunk", layout: null, motion: "flicker", name: "Cyberpunk", emo: ["apprehension", "vigilance", "awe"], blurb: "1980s on. High tech, low life. Neon over rain, corporations over everything.", colors: ["#ff2bd6", "#00e5ff", "#0b0b1a"], texture: "scan", count: 2,
        motif: function (r, c) { var out = ""; for (var k = 0; k <= 8; k++) { out += '<line x1="' + (k * 25) + '" y1="200" x2="' + f(100 + (k * 25 - 100) * .25) + '" y2="110" stroke="' + c[1] + '" stroke-width="1.5"/>'; }
          for (var j = 0; j < 5; j++) { var y = 110 + j * j * 4 + j * 6; out += '<line x1="0" y1="' + y + '" x2="200" y2="' + y + '" stroke="' + c[0] + '" stroke-width="1.5"/>'; }
          return svg(out + '<rect x="' + f(r.range(10, 120)) + '" y="' + f(r.range(20, 80)) + '" width="70" height="8" fill="' + c[0] + '"/>'); } },
      { id: "vaporwave", layout: null, motion: "float", name: "Vaporwave", emo: ["pensiveness", "boredom", "distraction"], blurb: "2010s. Mall music, dead tech, a sunset that never ends. Nostalgia for a future sold to us.", colors: ["#ff71ce", "#01cdfe", "#b967ff", "#fffb96"], count: 2,
        motif: function (r, c) { var out = '<defs><clipPath id="vw' + r.int(0, 99999) + '"><circle cx="100" cy="100" r="70"/></clipPath></defs>'; var id = out.match(/id="(vw\d+)"/)[1];
          out += '<g clip-path="url(#' + id + ')"><rect x="0" y="0" width="200" height="200" fill="' + c[0] + '"/>'; for (var k = 0; k < 6; k++) out += '<rect x="0" y="' + (100 + k * 14) + '" width="200" height="' + (4 + k) + '" fill="' + c[2] + '"/>'; return svg(out + "</g>"); } }
    ] },
    { id: "excess", name: "Excess & pop", movements: [
      { id: "maximalism", layout: "cutup", motion: "pulse", name: "Maximalism", emo: ["ecstasy", "overwhelm", "amazement"], blurb: "More is more. Pattern on pattern, colour on colour, nothing left empty.", colors: ["#d11f8b", "#f2c200", "#1f7a4d", "#2a5bd7", "#e2321f"], texture: "dots", count: 5,
        motif: function (r, c) { var out = ""; for (var k = 0; k < 6; k++) out += '<circle cx="' + f(r.range(20, 180)) + '" cy="' + f(r.range(20, 180)) + '" r="' + f(r.range(12, 40)) + '" fill="' + c[k % c.length] + '"/>'; return svg(out + '<path d="M0 0 L200 200 M200 0 L0 200" stroke="' + c[r.int(0, 4)] + '" stroke-width="10"/>'); } },
      { id: "pop-art", layout: "cutup", motion: "pop", name: "Pop Art", emo: ["joy", "amazement", "contempt"], blurb: "1950s–60s. Soup cans and comic panels; the market's own images turned back on it.", colors: ["#e2321f", "#f2c200", "#1f4fbf", "#111111"], texture: "benday", count: 2,
        motif: function (r, c) { var pts = ""; for (var k = 0; k < 16; k++) { var a = k * Math.PI / 8, rr = k % 2 ? 45 : 90; pts += f(100 + Math.cos(a) * rr) + "," + f(100 + Math.sin(a) * rr) + " "; }
          return svg('<polygon points="' + pts + '" fill="' + c[1] + '" stroke="' + c[3] + '" stroke-width="5"/><text x="100" y="116" text-anchor="middle" font-family="Anton, Impact" font-size="44" fill="' + c[0] + '">' + pick(r, ["POW!", "WOW", "SALE", "NEW!", "WHAM"]) + "</text>"); } }
    ] },
    { id: "abstract", name: "Abstract", movements: [
      { id: "abstract-expressionism", layout: null, motion: "smear", name: "Abstract Expressionism", emo: ["rage", "grief", "overwhelm"], blurb: "1940s–50s. The gesture is the subject: drips, slashes, the body on the canvas.", colors: ["#111111", "#c4161c", "#f4f4f2"], count: 3,
        motif: function (r, c) { var out = ""; for (var k = 0; k < 4; k++) out += '<path d="M' + f(r.range(0, 200)) + ' ' + f(r.range(0, 200)) + ' Q ' + f(r.range(0, 200)) + ' ' + f(r.range(0, 200)) + ' ' + f(r.range(0, 200)) + ' ' + f(r.range(0, 200)) + '" fill="none" stroke="' + c[k % 2] + '" stroke-width="' + f(r.range(4, 18)) + '" stroke-linecap="round"/>';
          for (var j = 0; j < 8; j++) out += '<circle cx="' + f(r.range(0, 200)) + '" cy="' + f(r.range(0, 200)) + '" r="' + f(r.range(1.5, 6)) + '" fill="' + c[0] + '"/>'; return svg(out); } },
      { id: "geometric-abstraction", layout: "whisper", motion: "slide", name: "Geometric Abstraction", emo: ["serenity", "interest", "trust"], blurb: "Pure shape and colour relationships, from Malevich to Albers.", colors: ["#2a5bd7", "#f2c200", "#c4161c", "#111111"], count: 2,
        motif: function (r, c) { var out = ""; for (var k = 0; k < 3; k++) out += '<rect x="' + f(r.range(10, 100)) + '" y="' + f(r.range(10, 100)) + '" width="' + f(r.range(40, 90)) + '" height="' + f(r.range(40, 90)) + '" fill="' + c[k] + '" opacity=".8"/>'; return svg(out); } },
      { id: "op-art", layout: null, motion: "turn", name: "Op Art", emo: ["distraction", "amazement", "apprehension"], blurb: "1960s. Patterns that make the eye do the moving.", colors: ["#111111", "#f4f4f2"], count: 1,
        motif: function (r, c) { var out = '<rect width="200" height="200" fill="' + c[1] + '"/>'; for (var k = 9; k > 0; k--) out += '<rect x="' + (100 - k * 10) + '" y="' + (100 - k * 10) + '" width="' + (k * 20) + '" height="' + (k * 20) + '" fill="' + (k % 2 ? c[0] : c[1]) + '" transform="rotate(' + (k * r.range(1, 4)).toFixed(1) + ' 100 100)"/>'; return svg(out); } }
    ] }
  ];

  /* ---------- ten more movements (Nov 4 2026) ----------
     Proposed by ChatGPT from DATABASE_SPEC.md, checked against the spec and
     history, blurbs corrected where needed. Each joins an existing branch. */
  var MORE = {
    abstract: [
      { id: "surrealism", layout: "cutup", motion: "float", name: "Surrealism", texture: "scan", emo: ["amazement", "awe", "pensiveness"], colors: ["#161925", "#d0bfa8", "#e55d35"], count: 2,
        blurb: "1924 on. André Breton's manifesto: dreams, automatic writing, the uncanny next to the ordinary. In 1938 Breton and Trotsky wrote the Manifesto for an Independent Revolutionary Art together (Breton and Diego Rivera signed it).",
        motif: function (r, c) { var ey = f(r.range(70, 95));
          return svg('<path d="M100 30 a34 34 0 0 1 22 60 l18 80 h-80 l18 -80 a34 34 0 0 1 22 -60z" fill="' + c[0] + '"/>' +
            '<ellipse cx="100" cy="' + ey + '" rx="22" ry="12" fill="' + c[1] + '"/><circle cx="100" cy="' + ey + '" r="7" fill="' + c[2] + '"/>' +
            '<path d="M' + f(r.range(10, 40)) + ' 185 q 20 -30 40 0" fill="none" stroke="' + c[2] + '" stroke-width="3"/>'); } },
      { id: "expressionism", layout: "reliquary", motion: "pulse", name: "Expressionism", texture: null, emo: ["grief", "terror", "admiration"], colors: ["#24202c", "#e5a827", "#b73138"], count: 2,
        blurb: "c. 1905–1920s. Die Brücke (1905) and Der Blaue Reiter (1911) bent form and colour to show what a thing feels like, not what it looks like. The Nazis branded it \"degenerate art\" in 1937.",
        motif: function (r, c) { var pts = "10,190 "; for (var k = 1; k < 8; k++) pts += f(k * 25) + "," + f(k % 2 ? r.range(20, 70) : r.range(110, 160)) + " "; pts += "190,190";
          return svg('<polygon points="' + pts + '" fill="' + c[0] + '"/><path d="M0 40 L200 ' + f(r.range(10, 60)) + ' L200 0 L0 0z" fill="' + c[2] + '"/>' +
            '<path d="M' + f(r.range(60, 140)) + ' 190 l10 -70 l12 70z" fill="' + c[1] + '"/>'); } }
    ],
    excess: [
      { id: "memphis", layout: "cutup", motion: "pop", name: "Memphis", texture: "benday", emo: ["ecstasy", "distraction", "optimism"], colors: ["#ffdf44", "#00a8ac", "#f17baf", "#1a175a"], count: 3,
        blurb: "1981–1987. Ettore Sottsass's Milan group: plastic laminate, squiggles, clashing pattern, furniture that laughed at good taste.",
        motif: function (r, c) { var k = r.int(0, 2);
          if (k === 0) return svg('<path d="M10 100 q 20 -40 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke="' + c[3] + '" stroke-width="10" stroke-linecap="round"/>');
          if (k === 1) return svg('<polygon points="100,20 180,170 20,170" fill="' + c[0] + '" stroke="' + c[3] + '" stroke-width="5"/><circle cx="' + f(r.range(60, 140)) + '" cy="130" r="18" fill="' + c[2] + '"/>');
          var d = ""; for (var y = 30; y < 200; y += 28) for (var x = 30; x < 200; x += 28) d += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + c[1] + '"/>';
          return svg(d); } },
      { id: "rococo", layout: "cutup", motion: "float", name: "Rococo", texture: null, emo: ["ecstasy", "distraction", "contempt"], colors: ["#fce4ec", "#d4af37", "#1a1a1a", "#fff59d"], count: 2,
        blurb: "c. 1720s–1770s France. Shell-and-scroll ornament (rocaille), pastels and gold leaf, Boucher's and Fragonard's pleasure gardens: luxury for a class headed for 1789. Played here as satire of fake abundance.",
        motif: function (r, c) { var out = '<rect width="200" height="200" fill="' + c[0] + '"/>';
          for (var k = 0; k < 3; k++) { var x = f(r.range(30, 150)), y = f(r.range(40, 160)), s = r.range(.6, 1.2);
            out += '<path transform="translate(' + x + ' ' + y + ') scale(' + f(s) + ')" d="M0 0 C -30 -40 30 -60 30 -20 C 30 0 10 5 5 -5 M0 0 C 30 40 -30 60 -30 20 C -30 0 -10 -5 -5 5" fill="none" stroke="' + c[1] + '" stroke-width="5" stroke-linecap="round"/>'; }
          for (var j = 0; j < 9; j++) out += '<circle cx="' + (20 + j * 20) + '" cy="188" r="5" fill="' + c[3] + '" stroke="' + c[1] + '" stroke-width="1.5"/>';
          return svg(out); } }
    ],
    revolt: [
      { id: "zine-diy", layout: "xerox", motion: "jitter", name: "Zine / DIY", texture: "toner", emo: ["interest", "annoyance", "acceptance"], colors: ["#171717", "#f0ece3", "#fa3a70"], count: 3,
        blurb: "1930s science-fiction fanzines, then punk from the 1970s: a photocopier, a stapler and something to say. Publishing without permission.",
        motif: function (r, c) { var rot = f(r.range(-8, 8));
          return svg('<g transform="rotate(' + rot + ' 100 100)"><rect x="30" y="35" width="140" height="130" fill="' + c[1] + '" stroke="' + c[0] + '" stroke-width="3"/>' +
            '<rect x="70" y="22" width="60" height="22" fill="' + c[2] + '" opacity=".7"/>' +
            '<path d="M45 80 h' + f(r.range(70, 110)) + ' M45 100 h' + f(r.range(50, 110)) + ' M45 120 h' + f(r.range(40, 100)) + '" stroke="' + c[0] + '" stroke-width="5"/>' +
            '<path d="M40 150 h8 M152 150 h8" stroke="' + c[0] + '" stroke-width="3"/></g>'); } },
      { id: "situationism", layout: "ledger", motion: "smear", name: "Situationism", texture: "scan", emo: ["contempt", "interest", "aggressiveness"], colors: ["#111111", "#eae5d8", "#d42f24"], count: 2,
        blurb: "1957–1972. The Situationist International (Guy Debord, The Society of the Spectacle, 1967): hijack the ads, drift through the city, refuse the life on sale. Its slogans were on the walls of Paris in May 1968.",
        motif: function (r, c) { var w = pick(r, ["DÉRIVE", "NE TRAVAILLEZ JAMAIS", "SOUS LES PAVÉS", "SPECTACLE"]);
          return svg('<path d="M20 60 h60 v40 h50 v50 h50" fill="none" stroke="' + c[0] + '" stroke-width="3" stroke-dasharray="6 5"/>' +
            '<path d="M170 150 l-12 -8 v16z" fill="' + c[2] + '"/><circle cx="' + f(r.range(30, 170)) + '" cy="' + f(r.range(30, 90)) + '" r="16" fill="none" stroke="' + c[2] + '" stroke-width="4"/>' +
            '<text x="12" y="190" font-family="Archivo, Arial" font-weight="900" font-size="' + (w.length > 10 ? 13 : 24) + '" fill="' + c[0] + '">' + w + '</text>'); } },
      { id: "grunge-design", layout: "xerox", motion: "smear", name: "Grunge Design", texture: "toner", emo: ["loathing", "annoyance", "pensiveness"], colors: ["#272920", "#aba18b", "#cf632e"], count: 2,
        blurb: "Late 1980s–1990s. Distressed type and broken layouts, from Seattle gig flyers to David Carson's Ray Gun (1992 on). Legibility on purpose made second.",
        motif: function (r, c) { var out = ""; for (var k = 0; k < 5; k++) { var y = f(r.range(20, 180)); out += '<rect x="' + f(r.range(-20, 60)) + '" y="' + y + '" width="' + f(r.range(80, 180)) + '" height="' + f(r.range(4, 18)) + '" fill="' + c[k % 3] + '" opacity=".8"/>'; }
          return svg(out + '<path d="M' + f(r.range(20, 80)) + ' 30 L' + f(r.range(120, 180)) + ' 170" stroke="' + c[0] + '" stroke-width="6"/>'); } },
      { id: "mexican-muralism", layout: "manifesto", motion: "drop", name: "Mexican Muralism & Rasquache", texture: "concrete", emo: ["admiration", "anger", "optimism"], colors: ["#c25927", "#1b4965", "#e8a838", "#2c221e"], count: 2,
        blurb: "1920s on. After the Revolution, Rivera, Orozco and Siqueiros painted workers and Indigenous history on public walls for people who couldn't buy paintings. Rasquache, the Chicano art of making do (named by Tomás Ybarra-Frausto, 1989): rescued materials, loud colour, hand-painted signs.",
        motif: function (r, c) { var out = '<rect width="200" height="200" fill="' + c[1] + '"/><circle cx="' + f(r.range(60, 140)) + '" cy="70" r="46" fill="' + c[2] + '"/>';
          out += '<path d="M0 200 V150 H40 V120 H80 V95 H120 V120 H160 V150 H200 V200z" fill="' + c[0] + '"/>';
          for (var k = 0; k < 6; k++) { var y = f(r.range(155, 195)); out += '<path d="M' + f(r.range(0, 120)) + ' ' + y + ' l' + f(r.range(30, 80)) + ' -3" stroke="' + c[3] + '" stroke-width="3"/>'; }
          return svg(out); } }
    ],
    future: [
      { id: "afrofuturism", layout: "reliquary", motion: "rise", name: "Afrofuturism", texture: "dots", emo: ["vigilance", "awe", "admiration"], colors: ["#241345", "#e99d22", "#31c6b4"], count: 2,
        blurb: "Sun Ra's Arkestra from the 1950s, Octavia Butler, Parliament-Funkadelic; named by Mark Dery in 1993. Black futures imagined by the people the official future left out. A way of seeing more than a single style.",
        motif: function (r, c) { var out = ""; for (var k = 1; k < 7; k++) out += '<circle cx="100" cy="100" r="' + (k * 14) + '" fill="none" stroke="' + c[k % 2 ? 1 : 2] + '" stroke-width="' + (k === 6 ? 4 : 1.5) + '"/>';
          var a = r.range(0, 6.28); return svg('<circle cx="100" cy="100" r="96" fill="' + c[0] + '"/>' + out + '<circle cx="' + f(100 + Math.cos(a) * 84) + '" cy="' + f(100 + Math.sin(a) * 84) + '" r="9" fill="' + c[1] + '"/>'); } },
      { id: "y2k", layout: "manifesto", motion: "flicker", name: "Y2K", texture: "grid", emo: ["anticipation", "amazement", "interest"], colors: ["#d9e4f1", "#7b8cc6", "#24b4cb", "#39314d"], count: 2,
        blurb: "Late 1990s–early 2000s. Translucent plastic, chrome blobs and bubble buttons: the glossy millennium the dot-com boom was selling. The name came later.",
        motif: function (r, c) { var id = "y2k" + r.int(0, 99999);
          return svg('<defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="' + c[2] + '"/><stop offset="1" stop-color="' + c[3] + '"/></radialGradient></defs>' +
            '<circle cx="100" cy="100" r="70" fill="url(#' + id + ')"/><path d="M' + f(r.range(150, 175)) + ' 30 l6 18 l18 6 l-18 6 l-6 18 l-6 -18 l-18 -6 l18 -6z" fill="' + c[1] + '"/>'); } }
    ],
    ornament: [
      { id: "gothic-revival", layout: "reliquary", motion: "grow", name: "Gothic Revival", texture: null, emo: ["awe", "apprehension", "pensiveness"], colors: ["#17182b", "#834753", "#decda0"], count: 2,
        blurb: "c. 1740s–1900s. Pointed arches and tracery again, from Walpole's Strawberry Hill to Pugin and the Houses of Parliament; for many, a religious and moral answer to the factory age.",
        motif: function (r, c) { return svg('<path d="M30 195 V90 Q30 25 100 10 Q170 25 170 90 V195z" fill="' + c[0] + '"/>' +
            '<path d="M48 195 V95 Q48 45 100 30 Q152 45 152 95 V195z" fill="' + c[1] + '" opacity=".85"/>' +
            '<circle cx="100" cy="' + f(r.range(70, 85)) + '" r="22" fill="none" stroke="' + c[2] + '" stroke-width="4"/><path d="M100 110 V195 M74 130 H126" stroke="' + c[2] + '" stroke-width="4"/>'); } },
      { id: "ukiyo-e", layout: "whisper", motion: "slide", name: "Ukiyo-e", texture: null, emo: ["serenity", "interest", "pensiveness"], colors: ["#243c57", "#e3c9a2", "#bd6248"], count: 2,
        blurb: "17th–19th-century Japan. Woodblock prints of the \"floating world\": actors, courtesans, travellers, Hokusai's waves, sold cheap to city people.",
        motif: function (r, c) { var out = ""; for (var k = 0; k < 4; k++) { var y = 60 + k * 30; out += '<path d="M0 ' + y + ' q 25 ' + f(r.range(-30, -15)) + ' 50 0 t 50 0 t 50 0 t 50 0" fill="none" stroke="' + c[0] + '" stroke-width="' + (6 - k) + '"/>'; }
          return svg(out + '<circle cx="' + f(r.range(130, 175)) + '" cy="35" r="18" fill="' + c[2] + '"/>'); } }
    ]
  };
  TREE.forEach(function (b) { (MORE[b.id] || []).forEach(function (m) { b.movements.push(m); }); });

  var ALL = [], BY_ID = {};
  TREE.forEach(function (b) { b.movements.forEach(function (m) { m.branch = b.id; m.branchName = b.name; ALL.push(m); BY_ID[m.id] = m; }); });

  /* darts -> one or two movements (deterministic) */
  function pickStyles(darts, rng) {
    if (!PCP.board || !darts || !darts.length) return [];
    var scored = ALL.map(function (m) {
      var w = darts.reduce(function (s, d) { return s + PCP.board.closeness(d, { emo: m.emo }); }, 0);
      return { m: m, w: Math.pow(w, 4) + 0.0005 };
    });
    // the movement that sits closest to the darts wins outright (the throw already carries the luck)
    var top = Math.max.apply(null, scored.map(function (s) { return s.w; }));
    var first = rng.pick(scored.filter(function (s) { return s.w >= top * 0.98; }));
    var out = [first.m.id];
    // a second movement, from another branch, when the pot pulls in more than one direction
    var spread = darts.length > 1 && darts.some(function (d) { return d.petal !== darts[0].petal; });
    if (spread || rng.chance(0.25)) {
      var rest = scored.filter(function (s) { return s.m.branch !== first.m.branch; });
      var second = rng.weighted(rest, rest.map(function (s) { return s.w; }));
      if (second) out.push(second.m.id);
    }
    return out;
  }

  /* lay the chosen movements into a rendered room (decoration only) */
  function decorate(room, styles, mkRng) {
    var h = PCP.h, content = room.querySelector(".content");
    ["button", "texture", "motion"].forEach(function (kind) { document.body.removeAttribute("data-k-" + kind); });
    (styles || []).forEach(function (sid, k) {
      var m = BY_ID[sid]; if (!m) return;
      var r = mkRng("style|" + sid);
      var layer = h("div", { "class": "deco sty-layer sty-" + sid, "aria-hidden": "true", "data-style": sid, style: { opacity: k ? "0.38" : "0.6" } });
      if (m.texture) layer.appendChild(h("div", { "class": "sty-tex tex-" + m.texture, style: m.texture === "concrete" && PCP.graphics && PCP.graphics.noise ? { "--grain": "url(" + PCP.graphics.noise() + ")" } : null }));
      for (var i = 0; i < (m.count || 2); i++) {
        var side = r.pick(["l", "r", "t", "b"]), wpc = r.range(16, 32), x, y;
        if (side === "l") { x = r.range(-6, 10); y = r.range(0, 85); }
        else if (side === "r") { x = r.range(82 - wpc / 2, 100 - wpc / 3); y = r.range(0, 85); }
        else if (side === "t") { x = r.range(0, 90); y = r.range(-6, 8); }
        else { x = r.range(0, 90); y = r.range(80, 96); }
        layer.appendChild(h("div", { "class": "sty-m anim-" + (m.motion || "fade"), html: m.motif(r, m.colors, i), style: { left: x.toFixed(1) + "%", top: y.toFixed(1) + "%", width: wpc.toFixed(1) + "%", "--rot": r.range(-14, 14).toFixed(1) + "deg" } }));
      }
      // the primary movement's kit: one button skin, one edge texture, one motion,
      // and one or two ornaments, picked by the recipe's own seed
      if (k === 0) {
        var kit = (PCP.kits || {})[sid] || {}, kr = mkRng("kit|" + sid), b = document.body;
        ["button", "texture", "motion"].forEach(function (kind) {
          var list = kit[kind] || [];
          if (list.length) b.setAttribute("data-k-" + kind, kr.pick(list)); else b.removeAttribute("data-k-" + kind);
        });
        if ((kit.texture || []).length) layer.appendChild(h("div", { "class": "kit-tex" }));
        var orns = (kit.ornament || []).slice(), howMany = orns.length ? 1 + (kr.next() < 0.55 ? 1 : 0) : 0;
        for (var o = 0; o < howMany && orns.length; o++) {
          var name = orns.splice(Math.floor(kr.next() * orns.length), 1)[0];
          var side = kr.pick(["l", "r", "t", "b"]), wpc = kr.range(7, 15), ox, oy;
          if (side === "l") { ox = kr.range(1, 6); oy = kr.range(8, 80); }
          else if (side === "r") { ox = kr.range(94 - wpc, 99 - wpc); oy = kr.range(8, 80); }
          else if (side === "t") { ox = kr.range(8, 86 - wpc); oy = kr.range(1, 5); }
          else { ox = kr.range(8, 86 - wpc); oy = kr.range(88, 93); }
          layer.appendChild(h("i", { "class": "kit-orn orn-" + name, "data-orn": name, style: {
            left: ox.toFixed(1) + "%", top: oy.toFixed(1) + "%", width: wpc.toFixed(1) + "%", rotate: kr.range(-18, 18).toFixed(1) + "deg" } }));
        }
      }
      room.insertBefore(layer, content);
      room.classList.add("has-sty", "sty-" + sid);
    });
  }

  PCP.styles = { TREE: TREE, ALL: ALL, BY_ID: BY_ID, pick: pickStyles, decorate: decorate };
})();
