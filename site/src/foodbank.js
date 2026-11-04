/* =====================================================================
   PRESSURE COOKER POETRY — THE FOOD BANK
   ---------------------------------------------------------------------
   Free learning resources for every subject this site is built on.
   Knowledge is a grocery, not a luxury: everything stocked here is free
   to read, watch or download, and anything partly paywalled says so.
   We stock sources we argue with when they're the best source.

   #/food-bank            every aisle
   #/food-bank/<aisle>    jump to one aisle

   Item shape: { t: title, by, kind, why, url, note? }
   kind: COURSE | ARCHIVE | REFERENCE | BOOK | PODCAST | TOOL | MAGAZINE
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  var h = PCP.h;

  var AISLES = [
    { id: "poetry", name: "Poetry, from scratch", sign: "Forms, sounds, and how poems get built", items: [
      { t: "Glossary of Poetic Terms", by: "Poetry Foundation", kind: "REFERENCE", why: "Every term you'll trip over, from anaphora to volta, with examples from real poems.", url: "https://www.poetryfoundation.org/learn/glossary-terms" },
      { t: "Poetic forms and terms", by: "Academy of American Poets (poets.org)", kind: "REFERENCE", why: "Short, plain explanations of forms like the sonnet, ghazal and pantoum, with poems to read alongside.", url: "https://poets.org/glossary" },
      { t: "ModPo: Modern & Contemporary American Poetry", by: "University of Pennsylvania", kind: "COURSE", why: "A free, open course built on close reading out loud with other people. No grades, no gatekeepers.", url: "https://modpo.org/" },
      { t: "PennSound", by: "University of Pennsylvania", kind: "ARCHIVE", why: "Thousands of recordings of poets reading their own work. Hear where the line breaks actually breathe.", url: "https://writing.upenn.edu/pennsound/" },
      { t: "UbuWeb", by: "Kenneth Goldsmith and volunteers", kind: "ARCHIVE", why: "The avant-garde, sound poetry and concrete poetry, collected outside the market since 1996.", url: "https://ubu.com/" },
      { t: "Poetry bookshelf", by: "Project Gutenberg", kind: "BOOK", why: "Public-domain poetry collections, free to read and download in any format.", url: "https://www.gutenberg.org/ebooks/bookshelf/60" }
    ] },
    { id: "language", name: "Where words come from", sign: "Etymology and the history of English", items: [
      { t: "Online Etymology Dictionary", by: "Douglas Harper", kind: "REFERENCE", why: "Where most of the word histories on this site start. Look up any word and follow it back.", url: "https://www.etymonline.com/" },
      { t: "Wiktionary", by: "Wikimedia volunteers", kind: "REFERENCE", why: "Etymologies, old spellings and cousins in other languages, for nearly every word you can think of.", url: "https://en.wiktionary.org/wiki/Wiktionary:Main_Page" },
      { t: "Bosworth-Toller Anglo-Saxon Dictionary", by: "Charles University (online edition)", kind: "REFERENCE", why: "The classic dictionary of Old English, searchable. See what words like rūn and spell meant first.", url: "https://bosworthtoller.com/" },
      { t: "The History of English Podcast", by: "Kevin Stroud", kind: "PODCAST", why: "The language's whole story, episode by episode, from Proto-Indo-European forward.", url: "https://historyofenglishpodcast.com/" },
      { t: "The Oxford Etymologist", by: "Anatoly Liberman, OUP Blog", kind: "MAGAZINE", why: "A working etymologist untangling hard cases, including why glamour and grammar are the same word.", url: "https://blog.oup.com/category/series-columns/oxford_etymologist/" }
    ] },
    { id: "propaganda", name: "How they sell it to you", sign: "Propaganda, advertising and media literacy", items: [
      { t: "Propaganda (1928)", by: "Edward Bernays, via Project Gutenberg", kind: "BOOK", why: "The father of PR explaining, in his own words, how to engineer what the public wants. Read it as a confession.", url: "https://www.gutenberg.org/ebooks/78634" },
      { t: "State of Deception: The Power of Nazi Propaganda", by: "U.S. Holocaust Memorial Museum", kind: "ARCHIVE", why: "How a modern state sold hatred, piece by piece, with the actual posters, films and newspapers.", url: "https://www.ushmm.org/propaganda/" },
      { t: "Prelinger Archives", by: "Internet Archive", kind: "ARCHIVE", why: "Thousands of ads, industrial and educational films. Watch how the 20th century was taught to want things.", url: "https://archive.org/details/prelinger" },
      { t: "Ad*Access", by: "Duke University Libraries", kind: "ARCHIVE", why: "Over 7,000 U.S. and Canadian print ads from 1911 to 1955. Propaganda you can sort by year.", url: "https://repository.duke.edu/dc/adaccess" },
      { t: "Checkology", by: "News Literacy Project", kind: "COURSE", why: "Free lessons on telling news from opinion, ads and misinformation.", url: "https://checkology.org/" }
    ] },
    { id: "thinking", name: "Thinking straight", sign: "Bias, fallacies and checking claims", items: [
      { t: "Calling Bullshit", by: "Carl Bergstrom and Jevin West, University of Washington", kind: "COURSE", why: "A full free course on spotting nonsense dressed up in numbers, charts and big data.", url: "https://callingbullshit.org/" },
      { t: "Web Literacy for Student Fact-Checkers", by: "Mike Caulfield", kind: "BOOK", why: "A short, free book of practical moves for checking a claim online in minutes, not hours.", url: "https://pressbooks.pub/webliteracy/" },
      { t: "SIFT: The Four Moves", by: "Mike Caulfield", kind: "TOOL", why: "Stop, investigate the source, find better coverage, trace claims back to the original. One page, use it daily.", url: "https://hapgood.us/2019/06/19/sift-the-four-moves/" },
      { t: "Fallacies", by: "Stanford Encyclopedia of Philosophy", kind: "REFERENCE", why: "The serious version: what makes a bad argument bad, and where philosophers still disagree.", url: "https://plato.stanford.edu/entries/fallacies/" },
      { t: "List of cognitive biases", by: "Wikipedia", kind: "REFERENCE", why: "The mind's shortcuts and blind spots, each linked to the research behind it.", url: "https://en.wikipedia.org/wiki/List_of_cognitive_biases" },
      { t: "Carl Sagan's Baloney Detection Kit", by: "The Marginalian", kind: "TOOL", why: "Sagan's checklist from The Demon-Haunted World for testing a claim before you believe it.", url: "https://www.themarginalian.org/2014/01/03/baloney-detection-kit-carl-sagan/" }
    ] },
    { id: "labor", name: "Labor, class & people's history", sign: "History from the bottom up", items: [
      { t: "Zinn Education Project", by: "Rethinking Schools and Teaching for Change", kind: "COURSE", why: "Free lessons on history as working people, strikers and organizers lived it.", url: "https://www.zinnedproject.org/" },
      { t: "Marxists Internet Archive", by: "Volunteers", kind: "ARCHIVE", why: "Marx, Engels, Trotsky, Luxemburg, Du Bois and hundreds more, free, in dozens of languages.", url: "https://www.marxists.org/" },
      { t: "The Communist Manifesto (1848)", by: "Marx and Engels, via MIA", kind: "BOOK", why: "Short enough to read in a sitting. Read the original before you trust anybody's summary of it.", url: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/" },
      { t: "American Social History Project", by: "CUNY", kind: "ARCHIVE", why: "Who Built America? and other resources on the people who actually did the building.", url: "https://ashp.cuny.edu/" },
      { t: "Labor Notes", by: "Labor Notes", kind: "MAGAZINE", why: "News and how-to guides for rank-and-file organizing, written by and for workers.", url: "https://labornotes.org/" },
      { t: "Monthly Review", by: "Monthly Review Foundation", kind: "MAGAZINE", why: "Independent socialist magazine since 1949. Much of the archive is free online.", url: "https://monthlyreview.org/", note: "Some articles paywalled" },
      { t: "Jacobin", by: "Jacobin", kind: "MAGAZINE", why: "Socialist magazine with an eye for design. Most articles can be read free online.", url: "https://jacobin.com/", note: "Some paywall" }
    ] },
    { id: "esoteric", name: "The esoteric shelf", sign: "Occult history, read with a skeptic's eye", items: [
      { t: "Western esotericism", by: "Wikipedia", kind: "REFERENCE", why: "A sourced map of the field: Hermeticism, alchemy, Rosicrucians, and how scholars study them.", url: "https://en.wikipedia.org/wiki/Western_esotericism" },
      { t: "The Corpus Hermeticum (G.R.S. Mead translation)", by: "sacred-texts.com", kind: "BOOK", why: "Read the Hermetic texts themselves, with an introduction on where they actually came from.", url: "https://sacred-texts.com/chr/herm/" },
      { t: "European Society for the Study of Western Esotericism", by: "ESSWE", kind: "REFERENCE", why: "The academic side: historians studying esotericism as history, not as something to sell you.", url: "https://www.esswe.org/" },
      { t: "Embassy of the Free Mind", by: "Bibliotheca Philosophica Hermetica, Amsterdam", kind: "ARCHIVE", why: "A library of hermetic, alchemical and mystical books, with digitized rare works.", url: "https://embassyofthefreemind.com/en/" },
      { t: "Wellcome Collection", by: "Wellcome Collection, London", kind: "ARCHIVE", why: "Free digitized alchemy manuscripts, medical magic and the history of what people believed about the body.", url: "https://wellcomecollection.org/" }
    ] },
    { id: "philosophy", name: "Philosophy without the tuition", sign: "The big questions, free", items: [
      { t: "Stanford Encyclopedia of Philosophy", by: "Stanford University", kind: "REFERENCE", why: "Peer-reviewed and free. The best first stop for Hegel, Nietzsche, Kierkegaard, dialectics, anything.", url: "https://plato.stanford.edu/" },
      { t: "Internet Encyclopedia of Philosophy", by: "Peer-reviewed volunteers", kind: "REFERENCE", why: "A second opinion with clear, readable entries.", url: "https://iep.utm.edu/" },
      { t: "Philosophize This!", by: "Stephen West", kind: "PODCAST", why: "The history of philosophy told in order, for people with jobs.", url: "https://www.philosophizethis.org/" },
      { t: "Open Yale Courses: Philosophy", by: "Yale University", kind: "COURSE", why: "Full Ivy League lecture courses, recorded and free. The classroom without the debt.", url: "https://oyc.yale.edu/philosophy" },
      { t: "Hegel archive", by: "Marxists Internet Archive", kind: "BOOK", why: "Hegel's works and study guides in one place, the root of the dialectic.", url: "https://www.marxists.org/reference/archive/hegel/index.htm" },
      { t: "Project Gutenberg", by: "Volunteers", kind: "BOOK", why: "Tens of thousands of free books: Nietzsche, Dostoevsky, Marx, Emerson, and every classic past copyright.", url: "https://www.gutenberg.org/" }
    ] },
    { id: "art", name: "Art, collage & the public domain", sign: "Free images to study, cut and remix", items: [
      { t: "The Public Domain Review", by: "Public Domain Review", kind: "MAGAZINE", why: "Strange, beautiful public-domain finds with essays on where they came from.", url: "https://publicdomainreview.org/" },
      { t: "Free to Use and Reuse", by: "Library of Congress", kind: "ARCHIVE", why: "Curated sets of images the Library believes are free to use, from posters to photographs.", url: "https://www.loc.gov/free-to-use/" },
      { t: "WPA Posters, 1936–1943", by: "Library of Congress", kind: "ARCHIVE", why: "More than 900 posters made by artists the government put to work in the Depression. Public art as public works.", url: "https://www.loc.gov/pictures/collection/wpapos/" },
      { t: "Smithsonian Open Access", by: "Smithsonian Institution", kind: "ARCHIVE", why: "Millions of images released copyright-free. Download, cut, remix, no permission needed.", url: "https://www.si.edu/openaccess" },
      { t: "Magazine Rack", by: "Internet Archive", kind: "ARCHIVE", why: "Scanned magazines going back a century: ads, layouts and type to study and cut up.", url: "https://archive.org/details/magazine_rack" },
      { t: "Pulp Magazine Archive", by: "Internet Archive", kind: "ARCHIVE", why: "Thousands of scanned pulp magazines. Lurid covers, cheap paper, and the art that came with them.", url: "https://archive.org/details/pulpmagazinearchive" },
      { t: "Digital Comic Museum", by: "Volunteers", kind: "ARCHIVE", why: "Public-domain golden-age comics, free to download.", url: "https://digitalcomicmuseum.com/" },
      { t: "Smarthistory", by: "Smarthistory", kind: "COURSE", why: "Free art history from hundreds of scholars: essays and short videos, no textbook required.", url: "https://smarthistory.org/" }
    ] },
    { id: "publish", name: "Find your voice, get it out", sign: "Writing help and publishing yourself", items: [
      { t: "Purdue Online Writing Lab", by: "Purdue University", kind: "REFERENCE", why: "Grammar, structure, citing sources. The handbook everyone uses, free.", url: "https://owl.purdue.edu/" },
      { t: "Barnard Zine Library", by: "Barnard College", kind: "ARCHIVE", why: "A library that takes zines seriously, with guides on making and finding them. Print it yourself.", url: "https://zines.barnard.edu/" },
      { t: "Literary Magazines Database", by: "Poets & Writers", kind: "TOOL", why: "Where to send your poems, with what each magazine publishes and how to submit.", url: "https://www.pw.org/literary_magazines" },
      { t: "LibriVox", by: "Volunteers", kind: "ARCHIVE", why: "Free public-domain audiobooks read by volunteers, and anyone can volunteer to read.", url: "https://librivox.org/" }
    ] }
  ];

  function byId(id) { return AISLES.filter(function (a) { return a.id === id; })[0]; }

  function render(arg) {
    var el = document.getElementById("foodbank");
    if (!el.childNodes.length) build(el);
    var target = arg && byId(arg) ? document.getElementById("aisle-" + arg) : null;
    setTimeout(function () {
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
      else window.scrollTo(0, 0);
    }, 0);
    return target ? byId(arg).name : "The Food Bank";
  }

  function build(el) {
    var total = AISLES.reduce(function (n, a) { return n + a.items.length; }, 0);
    el.appendChild(h("header", { "class": "fb-head" }, [
      h("p", { "class": "fb-kicker", text: "Department of Free Groceries · no ID required" }),
      h("h1", { id: "foodbankHeading", "class": "fb-title", text: "The Food Bank" }),
      h("p", { "class": "fb-lede", text: "Knowledge is a grocery, not a luxury. Everything on these shelves is free to read, watch or download, for every subject this site is built on. Take what you need. Take extra for somebody else." }),
      h("p", { "class": "fb-rules" }, [
        h("strong", { text: "House rules: " }),
        document.createTextNode("Free means free; anything partly paywalled says so on the can. We stock sources we argue with when they're the best source, because you can't beat an idea you've never read. Check everything, including us.")
      ])
    ]));
    el.appendChild(h("nav", { "class": "fb-dir", "aria-label": "Aisles" }, [
      h("p", { "class": "fb-dir-h", text: "Store directory · " + AISLES.length + " aisles · " + total + " items" }),
      h("ol", null, AISLES.map(function (a, i) {
        return h("li", null, [h("a", { href: "#/food-bank/" + a.id, text: a.name }), h("span", { text: " · aisle " + (i + 1) })]);
      }))
    ]));
    AISLES.forEach(function (a, i) {
      var sec = h("section", { "class": "fb-aisle", id: "aisle-" + a.id, "aria-labelledby": "aisle-h-" + a.id });
      sec.appendChild(h("div", { "class": "fb-sign" }, [
        h("span", { "class": "fb-num", text: String(i + 1) }),
        h("div", null, [h("h2", { id: "aisle-h-" + a.id, text: a.name }), h("p", { text: a.sign })])
      ]));
      var ul = h("ul", { "class": "fb-shelf" });
      a.items.forEach(function (it) {
        var r = PCP.engine.makeRng("can|" + it.url);
        ul.appendChild(h("li", { "class": "fb-can", style: { "--rot": r.range(-0.8, 0.8).toFixed(2) + "deg" } }, [
          h("p", { "class": "fb-tags" }, [h("span", { "class": "fb-kind", text: it.kind }), h("span", { "class": "fb-free" + (it.note ? " part" : ""), text: it.note ? "FREE · " + it.note.toUpperCase() : "FREE" })]),
          h("h3", { "class": "fb-t" }, [h("a", { href: it.url, target: "_blank", rel: "noopener noreferrer", text: it.t })]),
          h("p", { "class": "fb-by", text: it.by }),
          h("p", { "class": "fb-why", text: it.why }),
          h("a", { "class": "fb-take", href: it.url, target: "_blank", rel: "noopener noreferrer", "aria-label": "Open " + it.t + " (new tab)", text: "Take it ↗" })
        ]));
      });
      sec.appendChild(ul);
      el.appendChild(sec);
    });
    el.appendChild(h("p", { "class": "fb-foot", text: "Shelves restocked by hand. A dead link is our fault, not yours." }));
  }

  /* little "stock up" strip other pages can drop in */
  function strip(ids, label) {
    var list = (ids || []).map(byId).filter(Boolean);
    if (!list.length) return null;
    return h("aside", { "class": "fb-strip", "aria-label": "Related Food Bank aisles" }, [
      h("p", { "class": "fb-strip-h", text: label || "Stock up at the Food Bank" }),
      h("ul", null, list.map(function (a) { return h("li", null, [h("a", { href: "#/food-bank/" + a.id, text: a.name + " →" })]); }))
    ]);
  }

  PCP.foodBank = { AISLES: AISLES, render: render, strip: strip };
})();
