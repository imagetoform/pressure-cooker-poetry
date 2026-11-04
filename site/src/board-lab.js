/* =====================================================================
   PRESSURE COOKER POETRY — DARTBOARD LAB (test machinery, lab mode only)
   ---------------------------------------------------------------------
   1. The console's dartboard panel: where the pot's darts landed, in
      words, and which cutouts the last room pulled.
   2. #/lab : the cutout tagger. Load cutout images, tap the wheel to tag
      each one with emotions, copy the finished manifest entries.
   Visitors never see any of this (DESIGN LAW at the top of the page).
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  var h = PCP.h, B = PCP.board;

  /* ---------- 1. console panel ---------- */
  function updatePanel(recipe, genome) {
    var el = document.getElementById("dartboard");
    if (!el || !document.documentElement.classList.contains("lab")) return;
    var darts = B.throwDarts(recipe.ingredients, PCP.ingredients, recipe, recipe.seed + "#" + (recipe.variant || 0));
    el.innerHTML = B.svg({ darts: darts, label: "Dartboard: " + darts.map(function (d) { return d.word; }).join(", ") });
    var list = h("ol", { "class": "db-darts" }, darts.map(function (d) {
      return h("li", null, [h("strong", { text: d.tags.join(" + ") }), document.createTextNode(" ← " + d.label)]);
    }));
    el.appendChild(list);
    if (genome && genome.assets) {
      var names = genome.assets.map(function (id) { var a = (PCP.assets || []).filter(function (x) { return x.id === id; })[0]; return a ? a.label + (a.emo ? " (" + a.emo.join(", ") + ")" : "") : id; });
      el.appendChild(h("p", { "class": "db-cut" }, [h("strong", { text: "Cutouts in the last room: " }), document.createTextNode(names.join(" · ") || "none")]));
      if (genome.styles && PCP.styles) el.appendChild(h("p", { "class": "db-cut" }, [h("strong", { text: "Styles in the last room: " }), document.createTextNode(genome.styles.map(function (id) { var m = PCP.styles.BY_ID[id]; return m.name + " (" + m.emo.join(", ") + ")"; }).join(" + ") || "none")]));
    }
  }

  /* ---------- 2. the tagger ---------- */
  var KEY = "pcp-lab-tags";
  var items = [], current = -1;
  function loadTags() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function saveTags() { try { var o = loadTags(); items.forEach(function (it) { o[it.name] = { emo: it.emo, label: it.label, cats: it.cats }; }); localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function slug(name) { return name.replace(/\.[a-z0-9]+$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "cutout"; }
  var CATS = ["food", "object", "memory", "institution", "concept", "absurdity"];

  function manifest() {
    return items.map(function (it) {
      return "  { id: " + JSON.stringify(slug(it.name)) + ", src: " + JSON.stringify("assets/cutouts/" + it.name) + ", fallback: \"torn\", label: " + JSON.stringify(it.label || slug(it.name).replace(/-/g, " ")) +
        ", emo: " + JSON.stringify(it.emo) + ", cats: " + JSON.stringify(it.cats) + " },";
    }).join("\n");
  }

  function renderTagger() {
    var el = document.getElementById("lab");
    el.innerHTML = "";
    if (!document.documentElement.classList.contains("lab")) {
      el.appendChild(h("p", { text: "This room is for testing. Add ?lab=1 to the address to open it." }));
      return;
    }
    el.appendChild(h("p", { "class": "how-kicker", text: "Lab · test machinery · visitors never see this" }));
    el.appendChild(h("h1", { "class": "how-title", id: "labHeading", text: "Cutout tagger" }));
    el.appendChild(h("p", { "class": "lab-lede", text: "Load cutout images, pick one, then tap the wheel to give it emotion tags. Tap again to remove a tag. No numbers: the wheel's layout decides how close one emotion is to another. Copy the manifest when you're done and those lines go into the cutout manifest." }));
    var file = h("input", { type: "file", accept: "image/*", multiple: true, id: "labFiles", "class": "lab-file" });
    el.appendChild(h("label", { "class": "field-lbl", "for": "labFiles", text: "Cutout images (PNG with a transparent background is best)" }));
    el.appendChild(file);
    var strip = h("div", { "class": "lab-strip" });
    var work = h("div", { "class": "lab-work" });
    el.appendChild(strip); el.appendChild(work);
    var outWrap = h("div", { "class": "lab-out" });
    el.appendChild(outWrap);
    var words = h("details", { "class": "lab-words" }, [h("summary", { text: "Every word on the board (and loose aliases)" }),
      h("p", { text: B.words().join(" · ") }),
      h("p", { text: "Aliases: " + Object.keys(B.ALIASES).map(function (k) { return k + " → " + B.ALIASES[k]; }).join(" · ") })]);
    el.appendChild(words);

    var saved = loadTags();
    file.addEventListener("change", function () {
      Array.prototype.forEach.call(file.files, function (f) {
        if (items.some(function (it) { return it.name === f.name; })) return;
        var s = saved[f.name] || {};
        items.push({ name: f.name, url: URL.createObjectURL(f), emo: s.emo || [], label: s.label || "", cats: s.cats || [] });
      });
      if (current < 0 && items.length) current = 0;
      draw();
    });

    function draw() {
      strip.innerHTML = "";
      items.forEach(function (it, i) {
        var b = h("button", { type: "button", "class": "lab-thumb" + (i === current ? " on" : ""), "aria-label": "Tag " + it.name, "aria-pressed": i === current ? "true" : "false" }, [
          h("img", { src: it.url, alt: "" }), h("span", { text: it.emo.length ? it.emo.join(", ") : "untagged" })]);
        b.addEventListener("click", function () { current = i; draw(); });
        strip.appendChild(b);
      });
      work.innerHTML = "";
      var it = items[current];
      if (it) {
        var board = h("div", { "class": "lab-board", html: B.svg({ selected: it.emo, label: "Tap to tag " + it.name }) });
        board.addEventListener("click", function (ev) {
          var t = ev.target.closest && ev.target.closest("[data-tag]"); if (!t) return;
          var tag = t.getAttribute("data-tag"), at = it.emo.indexOf(tag);
          if (at >= 0) it.emo.splice(at, 1); else it.emo.push(tag);
          saveTags(); draw();
        });
        var label = h("input", { type: "text", "class": "select", value: it.label, placeholder: "label (what it is)", "aria-label": "Label" });
        label.addEventListener("input", function () { it.label = label.value; saveTags(); outWrap.querySelector("textarea").value = manifest(); });
        var cats = h("div", { "class": "lab-cats" }, CATS.map(function (c) {
          var cb = h("input", { type: "checkbox", id: "cat-" + c });
          cb.checked = it.cats.indexOf(c) >= 0;
          cb.addEventListener("change", function () { var k = it.cats.indexOf(c); if (cb.checked && k < 0) it.cats.push(c); if (!cb.checked && k >= 0) it.cats.splice(k, 1); saveTags(); outWrap.querySelector("textarea").value = manifest(); });
          return h("label", { "for": "cat-" + c }, [cb, document.createTextNode(" " + c)]);
        }));
        work.appendChild(h("div", { "class": "lab-pane" }, [
          h("img", { "class": "lab-big", src: it.url, alt: it.name }),
          h("p", { "class": "lab-name", text: it.name }),
          label, cats,
          h("p", { "class": "lab-tags", text: it.emo.length ? "Tags: " + it.emo.join(", ") : "No tags yet. Tap the wheel." })
        ]));
        work.appendChild(board);
      } else work.appendChild(h("p", { "class": "lab-empty", text: "No images loaded yet." }));
      outWrap.innerHTML = "";
      var ta = h("textarea", { "class": "lab-ta", rows: "8", readonly: true, "aria-label": "Manifest entries" });
      ta.value = manifest();
      var copy = h("button", { type: "button", "class": "nl-btn", text: "Copy manifest entries" });
      copy.addEventListener("click", function () { ta.select(); if (navigator.clipboard) navigator.clipboard.writeText(ta.value); copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy manifest entries"; }, 1500); });
      outWrap.appendChild(h("p", { "class": "field-lbl", text: "Manifest entries (paste into the cutout manifest, put the images in assets/cutouts/)" }));
      outWrap.appendChild(ta); outWrap.appendChild(copy);
    }
    draw();
  }

  PCP.boardLab = { updatePanel: updatePanel, renderTagger: renderTagger, _items: function () { return items; } };
})();
