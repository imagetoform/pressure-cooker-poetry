/* =====================================================================
   PRESSURE COOKER POETRY — ESSAY MANIFEST
   ---------------------------------------------------------------------
   Essays are read, not cooked. Every checkable claim carries a number
   like [3] that points at the receipt printed under the essay.
   Opinions and arguments don't get receipts, and don't pretend to.

   Shape:
   { id, title, dek, author, date,
     body:      markdown-lite string. "## " headings, "- " bullets,
                blank line between paragraphs, *em*, **strong**, [n].
     receipts:  [{ text, src, url }]  numbered in order, from 1 }
   ===================================================================== */
window.PCP = window.PCP || {};
window.PCP.essays = [
 {
  id: "grimoire-grammar-glamour",
  aisles: ["language", "esoteric", "thinking"],
  title: "Grimoire, Grammar, Glamour",
  dek: "The misconceptions of English roots, and why a pattern isn't a family tree.",
  author: "Brandon Rhodes",
  date: "November 2026",
  body: [
   "I have \"as above, so below\" tattooed on my shoulder. Every so often somebody reads it and gives me a look, like I've got a pentagram under my shirt and a goat in the trunk. I'm a fan of occult esotericism and its long, strange history. I read about it a lot more than I practice it. None of that makes me a devil worshipper, because those aren't the same thing, and the gap between them is what this essay is about: two things lining up doesn't mean they're actually connected.",
   "## Two different shelves",
   "The phrase comes out of Hermeticism, a set of Greek writings from Roman-era Egypt, written around the 2nd and 3rd centuries and credited to a legendary teacher called Hermes Trismegistus [1]. When those texts reached Renaissance Florence, Cosimo de' Medici had Marsilio Ficino set aside his translation of Plato to put them into Latin first [2], and that translation came out in 1463 [1]. It was philosophy about God, the mind and the cosmos, read by people who considered themselves Christians.",
   "Organized Satanism is a different animal, and a young one. Anton LaVey founded the Church of Satan in San Francisco on April 30, 1966 [3]. It's an atheist group that treats Satan as a symbol of pride and individual freedom, not a god to pray to [4]. Scholars do file both under the big umbrella of \"esotericism\" [5], but sharing a bookstore shelf isn't sharing a bloodline. More than a thousand years sit between them.",
   "## My tattoo is a mistranslation",
   "Here's the part I love. The line on my shoulder comes from the Emerald Tablet, a short, cryptic text whose earliest known version is in Arabic, from the late 700s or early 800s [6]. The famous \"like,\" as in what's above is like what's below, only exists in the popular medieval Latin version. The Arabic says \"from\": what's above comes from what's below [7]. The Latin translator also didn't recognize the Arabic word for talisman and just copied it out by its sound [8]. Isaac Newton, of all people, made his own English translation of it [9].",
   "So the world's most famous motto about correspondence got its wording through a translation that didn't correspond to the original. If that doesn't teach some humility about connections, nothing will.",
   "## The magic really is in the grammar",
   "Now for English. The roots that sound occult mostly are, just not the way the rumors go. They don't show a hidden witch religion steering the language. They show what happens when reading belongs to a small class of people.",
   "- **Grimoire**, a spellbook, comes from the French word for grammar. Old French *gramaire* meant grammar and learning, and also a book of conjuring [10].\n- **Glamour** is grammar with a Scottish accent. Scots bent *gramarye* into *glamer*, meaning a magic spell, and Sir Walter Scott carried it into mainstream English [11]. When he used it in a poem in 1805, he felt he had to add a footnote, because English readers wouldn't know the word [12].\n- **Grammar** itself once meant any kind of scholarship, occult learning included, and a grammar school was originally where you went to learn Latin [11]. Latin was the language of church, law and power. If you couldn't read it, the people who could looked like they were casting spells.\n- **Spell** in Old English meant a story or a message. **Gospel** is *godspel*, \"good story,\" a translation of the Greek for good news, and later speakers misheard the \"good\" as \"God\" [13]. The magic sense of spell didn't show up until the 1500s [14].\n- **Rune** meant a secret, a mystery or a council before it meant a letter, and its Old English form also meant a whisper [15][16].",
   "That's the real throughline. Words for writing turn into words for magic, because knowledge kept from people feels like sorcery to the people it's kept from. That isn't the occult. That's class.",
   "## The fake connections",
   "Then there are the connections that are just made up.",
   "**Hollywood and the wands.** The story goes that the town was named for holly, the wood witches' wands were made from, so the film industry has occult roots. What the record shows is that Harvey Wilcox filed a subdivision map with the name \"Hollywood\" on February 1, 1887 [17]. His wife, Daeida, got the name from an acquaintance's estate in Illinois, and said she picked it because it sounded nice and she was superstitious that holly brought good luck [18]. The shrub growing on those hills isn't even true holly. It's toyon, nicknamed California holly, and the natural history museum that writes about it says flat out that it isn't how Hollywood got its name [17]. Superstition about luck, sure. A coven, no.",
   "**Hocus pocus.** People like to say it mocks the Catholic Mass, *hoc est corpus*, \"this is my body.\" That theory traces back to John Tillotson, the Archbishop of Canterbury, in 1694, and there's no evidence for it beyond his say-so. He was a Protestant churchman lumping Catholic priests and stage magicians together as tricksters. The likelier answer is that it's just rhyming nonsense patter, and a magic book titled *Hocus Pocus Junior* was already in print in the 1630s [19]. So the \"secret origin\" was a piece of 17th-century religious propaganda. Keep that one in mind the next time a connection feels a little too satisfying.",
   "## The real pagan bits",
   "To be fair to the rumor mill, some of it is real. Your week is full of old gods: Wednesday is Woden's day and Thursday is Thor's [20]. But even that isn't a hidden structure. Germanic peoples took the Roman week, which named its days after gods and planets, and swapped in their own gods as the closest match [21]. That's translation, not conspiracy. And pagan doesn't mean satanic either.",
   "## Rhymes aren't bloodlines",
   "Linguists have a name for one version of this: folk etymology, when people reshape or explain a word by tying it to something more familiar [22]. Gospel getting heard as \"God story\" is one example. Holly wands are another.",
   "## The hero is never wrong",
   "I get it. I really do. These connections are interesting, and part of me lights up every time one clicks. Psychologists even have a name for that click: apophenia, the habit of seeing meaningful patterns between things that aren't actually related [23]. Its cousin is confirmation bias, where we hunt for, read and remember information in ways that back up what we already think, and it mostly runs on automatic, not on purpose [24]. That's what makes it so slippery. Everyone does it, as a reflex, below the level of noticing, and that's exactly why a too-neat connection is so easy to believe.",
   "Here's how I think about why. In its simplest terms, the ego is the hero of your life's story. Joseph Campbell argued in *The Hero with a Thousand Faces* that the world's myths keep telling one basic story, the hero's journey [25]. If you're the hero, the plot says you aren't supposed to be wrong. Being right is what makes the hero not just right but righteous. That's an assumption too.",
   "In my opinion, you only earn either one by reaching a conclusion with checked humility. I don't mean humility that sinks into shame, and I don't mean the other extreme, pride that turns into foolishness. I mean the plain ability to be wrong. Being wrong will teach you more than being right all the time ever will.",
   "The best tool I've found for that is dialectical materialism, or just plain historical context. Instead of asking whether a connection feels true, ask what material conditions produced it. Who wrote it down, when, and who benefited from people believing it? Ask that about *hocus pocus* and you find a 17th-century archbishop with a sectarian axe to grind. Ask it about *glamour* and you find a world where only a few people could read.",
   "Bertrand Russell said something close to this in a 1959 BBC interview, when he was asked what he'd tell people living a thousand years from now. His advice was to ask only \"what are the facts\" and what truth those facts actually support, and never to let yourself get pulled off course by what you wish were true [26]. Not what you believe is true. What is.",
   "## Keep the wonder",
   "\"As above, so below\" says patterns echo across scales. It doesn't say every echo is a family tree. The same habit of mind that sees a coven in Hollywood sees a devil on my shoulder. I'd rather keep the wonder and check the receipts. The true story, that the word for spell came from the word for story and the word for glamour came from grammar, is stranger and more radical than any rumor. The oldest magic was just knowing how to read."
  ].join("\n\n"),
  receipts: [
   { text: "Corpus Hermeticum: dates, authorship, and Ficino's 1463 Latin translation.", src: "encyc.org", url: "https://encyc.org/wiki/Corpus_Hermeticum" },
   { text: "Ficino pulled off translating Plato to do the Hermetic texts first. John Michael Greer, introduction to G.R.S. Mead's Corpus Hermeticum.", src: "universalfreemasonry.org", url: "https://www.universalfreemasonry.org/en/library/corpus-hermeticum/introduction" },
   { text: "Church of Satan founded April 30, 1966.", src: "Britannica", url: "https://www.britannica.com/topic/Church-of-Satan" },
   { text: "Church of Satan as an atheist group; Satan as a symbol.", src: "EBSCO Research Starters", url: "https://www.ebsco.com/research-starters/history/church-satan" },
   { text: "Esotericism as an umbrella term covering Hermeticism through modern Satanism.", src: "World Religions and Spirituality Project", url: "https://wrldrels.org/?p=21553" },
   { text: "Emerald Tablet's earliest Arabic version dated to the late 8th or early 9th century.", src: "Wikipedia: Emerald Tablet", url: "https://en.wikipedia.org/wiki/Emerald_Tablet" },
   { text: "\"As above, so below\" is a paraphrase of the Latin version; the Arabic reads \"from\" rather than \"like.\"", src: "EPFL Graph Search", url: "https://graphsearch.epfl.ch/fr/concept/43789417" },
   { text: "Latin translator transcribed the Arabic word for talisman without understanding it.", src: "Wikipedia: Emerald Tablet", url: "https://www.wikipedia.com/wiki/Emerald_Tablet" },
   { text: "Newton's English translation of the Tablet.", src: "Wikipedia mirror: Emerald Tablet", url: "https://cavac.at/cavacopedia/Emerald%20Tablet" },
   { text: "Grimoire from Old French gramaire, \"grammar\" and \"book of conjuring or magic.\"", src: "Etymonline: grimoire", url: "https://www.etymonline.com/word/grimoire" },
   { text: "Glamour as a Scottish alteration of grammar, popularized by Walter Scott; grammar as \"scholarship, especially occult learning\"; grammar school as a Latin school.", src: "Etymonline: glamour", url: "https://www.etymonline.com/word/glamour" },
   { text: "Scott's 1805 Lay of the Last Minstrel and its footnote explaining the word.", src: "etymologist.ai: glamour", url: "https://etymologist.ai/word/glamour/article" },
   { text: "Gospel from godspel, \"good spell\"; later confused with \"God.\"", src: "Etymonline: gospel", url: "https://www.etymonline.com/word/gospel" },
   { text: "The magic-incantation sense of \"spell\" arose in the 16th century.", src: "Wordorigins.org: gospel", url: "https://www.wordorigins.org/big-list-entries/gospel" },
   { text: "Rune: \"secret, mystery... (secret) council.\"", src: "Etymonline: rune", url: "https://www.etymonline.com/word/rune" },
   { text: "Old English rūn: whisper, rune, mystery, secret.", src: "Kaikki/Wiktionary: Old English rūn", url: "https://kaikki.org/dictionary/Old%20English/meaning/r/ru/run.html" },
   { text: "Wilcox's 1887 map filing; toyon (California holly) is not how Hollywood got its name.", src: "Natural History Museum of LA County", url: "https://live-hart.nhmlac.org/stories/california-holly-how-hollywood-didnt-get-its-name" },
   { text: "Daeida Wilcox's account of choosing the name.", src: "Wikipedia: Hollywood", url: "https://en.wikipedia.org/wiki/Hollywood,_Los_Angeles" },
   { text: "Tillotson's 1694 speculation, the lack of evidence, and Hocus Pocus Junior.", src: "The Phrase Finder", url: "https://www.phrases.org.uk/meanings/hocus-pocus.html" },
   { text: "Wednesday from Woden; Thursday from Thor.", src: "Merriam-Webster", url: "https://www.merriam-webster.com/wordplay/etymologies-for-every-day-of-the-week" },
   { text: "Germanic speakers replaced Roman day names with their own gods.", src: "Starkey Comics", url: "https://starkeycomics.com/2023/04/02/the-etymology-of-english-weekdays/" },
   { text: "Folk etymology defined.", src: "Merriam-Webster", url: "https://www.merriam-webster.com/dictionary/folk%20etymology" },
   { text: "Apophenia defined.", src: "Merriam-Webster", url: "https://www.merriam-webster.com/dictionary/apophenia" },
   { text: "Confirmation bias as an automatic, unintentional habit rather than deliberate deception.", src: "Wikipedia: Confirmation bias", url: "https://en.wikipedia.org/wiki/Confirmation_bias" },
   { text: "Campbell's monomyth, the hero's journey, in The Hero with a Thousand Faces (1949).", src: "Wikipedia", url: "https://en.wikipedia.org/wiki/The_Hero_with_a_Thousand_Faces" },
   { text: "Russell's 1959 Face to Face answer on facts.", src: "Open Culture", url: "https://openculture.com/2018/03/bertrand-russells-advice-to-people-living-1000-years-in-the-future-love-is-wise-hatred-is-foolish.html" }
  ]
 },
 {
  id: "mailman-and-drill-sergeant",
  aisles: ["poetry", "labor", "art", "publish"],
  title: "The Mailman and the Drill Sergeant",
  dek: "Charles Bukowski and Bob Ross, two men nobody hangs side by side, walking the same road.",
  author: "Brandon Rhodes",
  date: "November 2026",
  body: [
   "Nobody hangs Charles Bukowski next to Bob Ross. One's the laureate of cheap rooms, racetracks and hangovers. The other is a soft-voiced man with a perm painting happy little trees on public TV. But follow the paychecks instead of the personas, and they walk the same road.",
   "## The job that made them someone else",
   "Both men spent years drawing a federal paycheck. Bukowski worked for the U.S. Postal Service as a carrier and later as a mail sorter, the years he turned into his first novel [1]. Ross enlisted in the Air Force at 18, in 1961, and stayed 20 years, rising to master sergeant and serving as first sergeant of the clinic at Eielson Air Force Base in Alaska [2].",
   "Neither job fit the man doing it. Ross was the guy whose job was to yell at people, and he hated who that made him. He told the *Orlando Sentinel* in 1990 that once he got out, he'd never raise his voice again [2]. Bukowski spent his post office years mailing poems to little magazines that paid next to nothing [4].",
   "## The cheap way out",
   "Neither of them got in through the front door. Bukowski's break wasn't a university press. It was *Open City*, an underground Los Angeles weekly that peaked at 35,000 copies, where he ran a column called \"Notes of a Dirty Old Man\" [3]. He liked that a column hit the street within days instead of the months poetry journals took. The paper paid him $10 a column, more than those journals usually did, and it put him in front of far more people than a decade of little magazines had [4].",
   "Ross's door was cheap and public too. He picked up the fast wet-on-wet method from Bill Alexander's painting show, then went on the road teaching classes as one of Alexander's instructors [5]. He sold paintings on the side until the painting money beat his Air Force pay [6].",
   "## The money that bought the freedom",
   "Here's where the material conditions show. Bukowski didn't quit the post office on inspiration alone. Publisher John Martin sat down with him and added up his monthly costs: $35 rent, $15 child support, $15 for food and booze, $10 for the car. It came to $100, so Martin offered him $100 a month for life to quit and write full time [7]. That was a fifth of Martin's own salary, and he sold his personal collection of first-edition books to start Black Sparrow Press [8]. (Sources disagree on the year of the offer. The archive of Martin's papers puts it in 1969 [9]; others say 1965.) The first novel that freedom produced was *Post Office*, in 1971 [9].",
   "Ross went the other direction. *The Joy of Painting* ran on PBS from 1983 to 1994, and he did it for free. His living came from how-to books, videotapes and art supplies through Bob Ross Inc. [10][11]. Be honest about what that means: the free show was also an ad for the paint. Bukowski's freedom depended on one man's bet; Ross's depended on selling brushes. Neither got a grant, a fellowship or an academy's blessing. They got around the gate with whatever money the market left lying around.",
   "## \"Don't try\" and \"happy accidents\"",
   "Bukowski's gravestone says \"Don't Try.\" He explained it back in a 1963 letter to John William Corrington: when someone asked how he wrote, his answer was \"You don't try.\" His widow, Linda, later said people misread it as permission to be lazy, when what he meant was to stop straining at it and just do the work [12].",
   "Ross preached the same thing in a gentler voice. He liked to say there are no mistakes, only \"happy accidents\" [13]. Same message underneath: the agonized, credentialed version of art is a performance for gatekeepers. You don't need permission. Sit down and make the thing.",
   "## The gatekeepers",
   "The art world treated Ross as kitsch while he was alive. In 1994, Phil Donahue asked him to admit on air that his work would never hang in a museum. Ross said it might, \"but probably not the Smithsonian\" [14]. In 2019, the Smithsonian's National Museum of American History took in four of his paintings [14][15].",
   "Bukowski's whole career is my argument that his greatness wasn't the poems alone. It was dragging poetry out of the seminar room and into the cheap paper you picked up at the corner. Ross did the same thing to painting. The establishment's complaint about both of them comes down to one sin: they made it look like something anybody could do.",
   "That's not the flaw. That's the point."
  ].join("\n\n"),
  receipts: [
   { text: "Post Office as an account of Bukowski's years as a postal carrier and sorter.", src: "Wikipedia: Post Office (novel)", url: "https://en.wikipedia.org/wiki/Post_Office_(novel)" },
   { text: "Ross's enlistment, 20 years of service, rank, Eielson posting, and his 1990 Orlando Sentinel comments about never raising his voice again.", src: "War History Online", url: "https://www.warhistoryonline.com/instant-articles/bob-ross-drill-sergeant.html" },
   { text: "Open City: underground weekly, peak circulation of 35,000, home of \"Notes of a Dirty Old Man.\"", src: "Wikipedia: Open City (newspaper)", url: "https://en.wikipedia.org/wiki/Open_City_(newspaper)" },
   { text: "Column paid $10, appeared within days, and reached a far larger audience than his little-magazine work. (Press release from a Bukowski bookseller; weaker source.)", src: "Benzinga / EIN Presswire", url: "https://benzinga.com/content/39446209/55-years-on-charles-bukowskis-notes-of-a-dirty-old-man-ages-well" },
   { text: "Ross learned from Bill Alexander's TV show and worked as a traveling instructor for Alexander's company.", src: "War History Online", url: "https://www.warhistoryonline.com/instant-articles/bob-ross-drill-sergeant.html" },
   { text: "Ross's painting income surpassed his military salary.", src: "Wikipedia: Bob Ross", url: "https://en.wikipedia.org/wiki/Bob_Ross" },
   { text: "John Martin's own account of adding up Bukowski's expenses to $100.", src: "Poetry Northwest interview", url: "https://poetrynw.org/?p=11661" },
   { text: "$100 was 20% of Martin's salary; he sold about 2,000 first editions to start Black Sparrow.", src: "University of New Mexico archives", url: "https://nmarchives.unm.edu/repositories/22/resources/1530" },
   { text: "1969 offer and the 1971 publication of Post Office.", src: "Online Archive of California: John K. Martin Collection", url: "https://oac.cdlib.org/findaid/ark:/13030/tf8x0nb6wh" },
   { text: "The Joy of Painting ran on PBS 1983 to 1994; Ross did it for free and earned his income from books, tapes and supplies.", src: "Wikipedia: Bob Ross", url: "https://en.wikipedia.org/wiki/Bob_Ross" },
   { text: "Ross told the Orlando Sentinel in 1990 that PBS didn't pay him.", src: "Deseret News", url: "https://www.deseret.com/entertainment/2025/10/08/bob-ross-art-auction-pbs/" },
   { text: "\"Don't Try\": the 1963 Corrington letter and Linda Bukowski's explanation.", src: "Open Culture", url: "https://www.openculture.com/2013/page/137" },
   { text: "Ross's \"happy accidents\" line.", src: "Everyday Patriot", url: "https://www.everydaypatriot.com/2016/06/sergeant-robert-n-ross.html" },
   { text: "Ross dismissed as kitsch; the 1994 Donahue exchange; Smithsonian donation in 2019.", src: "Smithsonian Magazine", url: "https://www.smithsonianmag.com/smart-news/whatever-happened-all-bob-ross-paintings-180972672/" },
   { text: "Smithsonian's National Museum of American History acquiring Ross paintings.", src: "Artnet News", url: "https://news.artnet.com/art-world/bob-ross-paintings-smithsonian-1634419" }
  ]
 }
];
