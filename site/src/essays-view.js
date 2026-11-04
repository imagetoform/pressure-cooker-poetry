/* =====================================================================
   PRESSURE COOKER POETRY — ESSAYS VIEW + RECEIPTS
   ---------------------------------------------------------------------
   #/essays            the essay rack
   #/essays/<id>       one essay, its receipt, and the drawing wall
   Citation links scroll to the receipt line instead of touching the
   hash, because the hash is the router.
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  var h = PCP.h;
  function essays() { return PCP.essays || []; }
  function byId(id) { return essays().filter(function (e) { return e.id === id; })[0]; }

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function inline(s, essayId) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(\d+)\]/g, function (m, n) {
        return '<a class="cite" href="#/essays/' + essayId + '" data-cite="' + n + '" aria-label="Receipt ' + n + '">' + n + "</a>";
      });
  }
  function plain(s) { return s.replace(/\*\*?/g, "").replace(/\s*\[\d+\]/g, ""); }

  /* split a paragraph into sentences without breaking abbreviations we use */
  function sentences(p) {
    var guarded = p.replace(/\b(U\.S|Inc|Mr|Mrs|Dr|St|vs|e\.g|i\.e|G\.R\.S)\./g, function (m) { return m.replace(/\./g, "․"); });
    var parts = guarded.match(/[^.!?]+(?:[.!?]+["”)]?|$)(?:\s*\[\d+\])*(?:\s*\[\d+\])*/g) || [guarded];
    return parts.map(function (s) { return s.replace(/․/g, ".").trim(); }).filter(Boolean);
  }

  function renderBody(e, into, items) {
    var sid = 0;
    function sentSpans(text, parent) {
      sentences(text).forEach(function (s, k) {
        var sp = h("span", { "class": "sent", html: inline(s, e.id) });
        if (k) parent.appendChild(document.createTextNode(" "));
        parent.appendChild(sp);
        items.push({ text: plain(s), el: sp, where: "sentence " + (++sid) });
      });
    }
    e.body.split(/\n{2,}/).forEach(function (block) {
      if (/^## /.test(block)) { into.appendChild(h("h2", { "class": "es-h2", html: inline(block.slice(3), e.id) })); return; }
      if (/^- /.test(block)) {
        var ul = h("ul", { "class": "es-ul" });
        block.split(/\n/).forEach(function (li) { var item = h("li"); sentSpans(li.replace(/^- /, ""), item); ul.appendChild(item); });
        into.appendChild(ul); return;
      }
      var p = h("p", { "class": "es-p" }); sentSpans(block, p); into.appendChild(p);
    });
  }

  function receipt(e) {
    var n = e.receipts.length;
    var code = PCP.engine.hashString("receipt|" + e.id).slice(0, 10).toUpperCase();
    var wrap = h("section", { "class": "receipt", id: "receipt-" + e.id, "aria-labelledby": "rc-h-" + e.id });
    wrap.appendChild(h("p", { "class": "rc-store", text: "PRESSURE COOKER POETRY" }));
    wrap.appendChild(h("h2", { "class": "rc-h", id: "rc-h-" + e.id, text: "Receipt of sources" }));
    wrap.appendChild(h("p", { "class": "rc-meta", text: e.title.toUpperCase() }));
    wrap.appendChild(h("p", { "class": "rc-meta", text: "TXN " + code + " · " + (e.date || "").toUpperCase() }));
    wrap.appendChild(h("p", { "class": "rc-rule", "aria-hidden": "true", text: "- - - - - - - - - - - - - - - - - - - - - - -" }));
    var ol = h("ol", { "class": "rc-list" });
    e.receipts.forEach(function (r, i) {
      ol.appendChild(h("li", { "class": "rc-item", id: "rc-" + e.id + "-" + (i + 1), tabindex: "-1" }, [
        h("span", { "class": "rc-n", text: String(i + 1).padStart(2, "0") }),
        h("span", { "class": "rc-t" }, [
          h("span", { text: r.text + " " }),
          h("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", "class": "rc-src", text: r.src + " ↗" })
        ])
      ]));
    });
    wrap.appendChild(ol);
    wrap.appendChild(h("p", { "class": "rc-rule", "aria-hidden": "true", text: "- - - - - - - - - - - - - - - - - - - - - - -" }));
    wrap.appendChild(h("p", { "class": "rc-total" }, [h("span", { text: "CLAIMS RECEIPTED" }), h("strong", { text: String(n) })]));
    wrap.appendChild(h("p", { "class": "rc-total" }, [h("span", { text: "OPINIONS" }), h("strong", { text: "NOT FOR SALE" })]));
    wrap.appendChild(h("p", { "class": "rc-total" }, [h("span", { text: "AMOUNT DUE" }), h("strong", { text: "$0.00" })]));
    wrap.appendChild(h("div", { "class": "rc-barcode", "aria-hidden": "true" }));
    wrap.appendChild(h("p", { "class": "rc-foot", text: "KEEP THIS RECEIPT. CHECK OUR MATH. If a source is wrong, the claim is wrong, and it gets corrected in the open." }));
    return wrap;
  }

  function renderList(el) {
    el.appendChild(h("header", { "class": "es-rack-head" }, [
      h("h1", { id: "essaysHeading", "class": "arch-title", html: "Essays <span>with receipts</span>" }),
      h("p", { "class": "arch-note", text: "Long-form arguments. Every checkable claim is numbered and itemized on the receipt at the bottom, so you can do your own research when something sounds unbelievable." })
    ]));
    var ul = h("ul", { "class": "es-rack" });
    essays().forEach(function (e) {
      ul.appendChild(h("li", { "class": "es-card" }, [
        h("p", { "class": "es-card-k", text: e.date + " · " + e.receipts.length + " receipts" }),
        h("h2", { "class": "es-card-t" }, [h("a", { href: "#/essays/" + e.id, text: e.title })]),
        h("p", { "class": "es-card-d", text: e.dek }),
        h("a", { "class": "nl-btn", href: "#/essays/" + e.id, text: "Read", "aria-label": "Read " + e.title })
      ]));
    });
    el.appendChild(ul);
  }

  function renderEssay(el, e) {
    var i = essays().indexOf(e);
    var art = h("article", { "class": "es-article" });
    art.appendChild(h("p", { "class": "rd-kicker", text: "Essay · " + (i + 1) + " of " + essays().length }));
    art.appendChild(h("h1", { "class": "rd-title", id: "essaysHeading", text: e.title }));
    art.appendChild(h("p", { "class": "rd-author", text: e.author + " · " + e.date }));
    art.appendChild(h("p", { "class": "es-dek", text: e.dek }));
    var body = h("div", { "class": "es-body" });
    var items = [];
    renderBody(e, body, items);
    art.appendChild(body);
    art.appendChild(h("div", { "class": "receipt-wrap" }, [receipt(e)]));
    if (PCP.foodBank) { var st = PCP.foodBank.strip(e.aisles, "Do your own research: free resources at the Food Bank"); if (st) art.appendChild(st); }
    art.appendChild(h("nav", { "class": "rd-nav", "aria-label": "Essay navigation" }, [
      h("a", { "class": "nl-btn", href: "#/essays", text: "← All essays" })
    ]));
    var layout = h("div", { "class": "with-wall" }, [art]);
    var margin = h("div", { "class": "wall-col" });
    layout.appendChild(margin);
    el.appendChild(layout);
    if (PCP.wall) PCP.wall.attach(margin, items, { kind: "essay", id: e.id });
  }

  function render(arg) {
    var el = document.getElementById("essays");
    el.innerHTML = "";
    if (!arg) { renderList(el); return "Essays"; }
    var e = byId(arg);
    if (!e) {
      el.appendChild(h("h1", { "class": "rd-title", id: "essaysHeading", text: "Not on the rack" }));
      el.appendChild(h("p", { text: "No essay with that name is here." }));
      el.appendChild(h("a", { "class": "nl-btn", href: "#/essays", text: "All essays" }));
      return "Essays";
    }
    renderEssay(el, e);
    return e.title;
  }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a.cite[data-cite]");
    if (!a) return;
    ev.preventDefault();
    var essay = a.getAttribute("href").split("/").pop();
    var item = document.getElementById("rc-" + essay + "-" + a.getAttribute("data-cite"));
    if (!item) return;
    item.classList.remove("rc-flash"); void item.offsetWidth; item.classList.add("rc-flash");
    item.scrollIntoView({ behavior: document.documentElement.classList.contains("no-motion") ? "auto" : "smooth", block: "center" });
    item.focus({ preventScroll: true });
  });

  PCP.essaysView = { render: render, sentences: sentences };
})();
