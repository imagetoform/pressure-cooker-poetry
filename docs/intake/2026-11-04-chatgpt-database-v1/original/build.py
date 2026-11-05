import json,re,collections,math,pathlib
P=pathlib.Path('/mnt/data/pcp-database-expansion')
raw={
'food':'''a bruised peach|rice at midnight|the last diner pancake|union-hall chili|cold coffee in a thermos|a stolen office donut|a grandmother's soup|salt on tomato slices|the communal potluck|toast with too much butter|a dented tin of sardines|the midnight vending-machine pretzel|a peach pit in a pocket|the first strawberry of June|a worker's lunchbox orange|burnt toast at dawn|a can of discount beans|the factory-break sandwich|a lemon sucked for courage|a birthday cake after layoffs|the free sample tray|a kettle of weak tea|a pickle from the barrel|the last piece of cornbread|a melting ice-pop|stale crackers in a drawer|a communal loaf|a bruised grocery-store apple|a jar of preserved cherries|the diner counter's blue plate|leftover wedding cake|a bowl of plain noodles|the pepper in the stew|a moon-shaped biscuit|a bitter grapefruit|bread crusts for birds|a fistful of sunflower seeds|a paper cup of cocoa|the cafeteria's mystery gravy|a vending-machine dinner|a pot of lentils|the coffee at a night shift|a plum with a wormhole|the last spoon of honey|a chipped bowl of oatmeal|a lemon meringue collapse|a wedge of stale cheese|a street-cart chestnut|the birthday candle in the soup|a tomato grown through concrete''',
'object':'''a key with no door|the secondhand typewriter|a cracked pocket mirror|a bent coat hanger|the office shredder|a safety pin in velvet|a shoe full of rain|an unplugged alarm clock|the chipped coffee mug|a brass doorbell|a paperclip chain|the library return stamp|a telephone with no dial tone|the missing screw|a cracked record sleeve|the stubborn zipper|a bus transfer ticket|a fountain pen with no ink|a wrench in a flowerpot|the empty picture frame|a whistle under glass|a rusted bicycle bell|a stack of carbon paper|a broken umbrella rib|a yard-sale telescope|a battery-less flashlight|a dented lunch pail|the forgotten house key|a blinking cursor|a dusty cassette deck|a cardboard crown|a ruler snapped in half|the revolving-door handle|a safety vest on a hook|a notebook full of arrows|a chipped ceramic swan|the red emergency button|a receipt as long as winter|a crooked picture nail|a shoebox of ticket stubs|a lamp with one eye|a tiny folding chair|a postage stamp of a bird|a melted plastic spoon|the elevator's lonely button|a window latch in the dark|a spool of red thread|a paper crown from the dentist|a loudspeaker with no voice|a turnstile that only counts''',
'memory':'''the smell of wet pavement|a porch light left on|the first day after school ends|a voice on an old answering machine|waiting for the late bus|a hand waving from a train|the street before sunrise|a backyard full of fireflies|the song through apartment walls|the empty seat at supper|snow inside a wool glove|a summer storm over the field|the chalk dust after class|the creek behind the houses|a laugh from the next room|the day the factory closed|a map drawn on a napkin|the night the power failed|the scent of a library basement|a goodbye through a car window|the first warm night in spring|the familiar creak of stairs|a letter never mailed|a name in a schoolbook|the river after the flood|a birthday nobody remembered|the last dance in the gym|the long walk home from work|the day the picket line held|a lost mitten in the snow|the sound of an ice-cream truck|the kitchen before the argument|the neighbor who shared tomatoes|a small hand in a large one|the bus station at three a.m.|the light through dusty blinds|an empty playground at dusk|the moment the sirens stopped|a photograph without a date|a song played on the wrong speed|a childhood hiding place|the first applause in a basement|the long silence after bad news|the garden before demolition|the smell of sharpened pencils|an old friend's handwriting|a tree gone from the corner|the sun through a hospital curtain|the morning after the strike|the last light in the old house''',
'institution':'''the ministry of reasonable expectations|a landlord's security-deposit museum|the office of permanent temporary work|the boardroom's emergency parachutes|a billionaire's empathy consultant|the department of cheerful austerity|a think tank funded by the problem|the committee on strategic crumbs|the executive bonus sanctuary|the landlord appreciation hotline|a patent on public sunlight|the bureau of approved dissent|a press release about compassion|the shareholder's prayer breakfast|a lobbyist's revolving door|the wage-theft customer service desk|the corporation's family-values manual|the school of monetized wonder|the privatized public fountain|a museum of unpaid internships|the algorithmic rent tribunal|the royal order of middle managers|the crisis branding department|the austerity ribbon-cutting|the price-gouging task force's luncheon|the nonprofit executive throne|the monopoly's competitive spirit award|the board's inclusive golden parachute|the quarterly humanity audit|the chamber of outsourced conscience|the tax haven welcome center|the ministry of productivity smiles|the insurance denial choir|a bank's community-hug initiative|the investor-relations confessional|the privatization parade committee|the national council of excess packaging|the department of approved grief|the property-speculation chapel|the executives-only lifeboat|the corporate apology generator|the ministry of mandatory gratitude|the consulting firm's common-sense tax|the billionaire spaceport subsidy|the bureaucracy of invisible workers|the think tank of convenient data|the legislative gift-basket exchange|the company-town nostalgia board|the commission for affordable yachts|the office of trickle-down rain''',
'concept':'''a promise with fingerprints|the mathematics of longing|a silence with teeth|the right to be difficult|the economics of a hug|tomorrow written in pencil|a border drawn in chalk|the shape of forgiveness|the price of a minute|the freedom to be unfinished|the memory of a future|the gravity of a rumor|solidarity without a logo|the distance between two apologies|an archive of almosts|a revolution in lowercase|the patience of rust|a contract with the moon|the difference between enough and more|an unpaid debt to the living|a map of ordinary courage|the weight of an unanswered question|hope with its sleeves rolled up|the architecture of a whisper|the grammar of resistance|a future without a trademark|the politics of the kitchen table|a taxonomy of lost hours|the labor of tenderness|the noise inside a promise|a democracy of small things|the weather of regret|an apology without a signature|the strange dignity of boredom|a monument to repair|the right to change one's mind|a mirror made of rumors|the geometry of trust|an unfinished collective sentence|the ethics of an open door|a calendar without deadlines|the opposite of a pedestal|a quiet refusal to disappear|the texture of uncertainty|a machine for remembering names|the holiness of ordinary bread|the possibility of another ending|the invisible work of listening|a blueprint for belonging|a future that says please''',
'absurdity':'''a moon with a barcode|the capitalism-flavored popsicle|a pigeon wearing a necktie|the annual parade of lost passwords|a vending machine selling permission|a rubber duck elected treasurer|an iceberg in a briefcase|the human-resources octopus|the emperor's reusable tote|a tax-deductible rainbow|a haunted spreadsheet|the customer-service oracle|a banana conducting traffic|the world's smallest executive ladder|a televised apology to a stapler|the planet's subscription renewal|an inflatable statue of a sigh|a fish applying for a mortgage|the coupon for eternal life|a self-help book for statues|a committee of invisible hats|the espresso-powered guillotine|a cloud in business casual|the portable emergency horizon|a bureaucratic séance|the world's first luxury pothole|a pigeon with a shareholder vote|the doomsday coupon code|the velvet-lined suggestion box|a toaster negotiating peace|the astronaut's parking ticket|a goose with a five-year plan|a corporate-sponsored eclipse|the algorithm's imaginary friend|the boss battle at the post office|a wheelbarrow full of applause|the deluxe edition of nothing|a fax machine predicting rain|an artisanal panic button|the trophy for best unpaid labor|the silk parachute for a brick|a neon sign reading maybe|a cactus with a podcast|the international league of missing socks|a submarine made of receipts|a chandelier of plastic forks|a talking head made of coupons|an accordion in the elevator shaft|a clearance sale on gravity|a black hole with a loyalty card'''
}
for k,v in raw.items():
 a=v.split('|');assert len(a)==50,(k,len(a))

movements=[
('surrealism','abstract','Surrealism','cutup','float','scan',['amazement','awe','pensiveness'],['#161925','#d0bfa8','#e55d35'],'1920s onward. André Breton’s 1924 manifesto formalized a movement of dreams, automatism, and uncanny juxtapositions that challenged rational convention.'),
('expressionism','abstract','Expressionism','reliquary','pulse',None,['grief','terror','admiration'],['#24202c','#e5a827','#b73138'],'c. 1905–1920s. German Expressionist groups such as Die Brücke and Der Blaue Reiter distorted form and color for emotional rather than naturalistic truth.'),
('memphis','excess','Memphis','cutup','pop','benday',['ecstasy','distraction','optimism'],['#ffdf44','#00a8ac','#f17baf','#1a175a'],'1981–late 1980s. Ettore Sottsass and the Milan-based Memphis group used exuberant pattern, plastic laminate, and ironic forms to resist sober modernist functionalism.'),
('zine-diy','revolt','Zine / DIY','xerox','jitter','toner',['interest','annoyance','acceptance'],['#171717','#f0ece3','#fa3a70'],'1970s onward, with older fanzine roots. Photocopied punk and independent zines turned cheap reproduction into a participatory, anti-gatekeeping publishing practice.'),
('afrofuturism','future','Afrofuturism','reliquary','rise','dots',['vigilance','awe','admiration'],['#241345','#e99d22','#31c6b4'],'Mid-20th-century roots; named in 1994 by Mark Dery. Afrofuturism connects Black cultural imagination, science fiction, music, technology, and visions of liberation; it is not a single formal art movement.'),
('gothic-revival','ornament','Gothic Revival','reliquary','grow',None,['awe','apprehension','pensiveness'],['#17182b','#834753','#decda0'],'Mid-18th–19th centuries and beyond. Gothic Revival renewed pointed arches, tracery, and medievalizing ornament in architecture and decorative arts, often amid debates over faith and industry.'),
('ukiyo-e','ornament','Ukiyo-e','whisper','slide',None,['serenity','interest','pensiveness'],['#243c57','#e3c9a2','#bd6248'],'17th–19th-century Japan. Ukiyo-e woodblock prints and paintings depicted actors, landscapes, and urban pleasures through flattened shapes and finely controlled line.'),
('situationism','revolt','Situationism','ledger','smear','scan',['contempt','interest','aggressiveness'],['#111111','#eae5d8','#d42f24'],'1957–1972. The Situationist International used détournement, urban dérive, and critiques of the spectacle to attack consumer capitalism and habitual urban life.'),
('grunge-design','revolt','Grunge Design','xerox','smear','toner',['loathing','annoyance','pensiveness'],['#272920','#aba18b','#cf632e'],'Late 1980s–1990s. Grunge graphics, especially in music and experimental typography, favored distressed surfaces, fractured lettering, and imperfect reproduction.'),
('y2k','future','Y2K Aesthetic','manifesto','flicker','grid',['anticipation','amusement' if False else 'amazement','interest'],['#d9e4f1','#7b8cc6','#24b4cb','#39314d'],'Late 1990s–early 2000s. Y2K-era techno-optimism, translucent plastics, metallic effects, and digital interface motifs imagined a glossy new millennium; the label is retrospective and broad.'),
]
existing=[('art-nouveau','ornament','Art Nouveau'),('art-deco','ornament','Art Deco'),('psychedelia','ornament','Psychedelia'),('minimalism','order','Minimalism'),('swiss-international','order','Swiss / International'),('bauhaus','order','Bauhaus'),('brutalism','order','Brutalism'),('constructivism','revolt','Constructivism'),('dada','revolt','Dada'),('punk','revolt','Punk'),('futurism','future','Futurism'),('cyberpunk','future','Cyberpunk'),('vaporwave','future','Vaporwave'),('maximalism','excess','Maximalism'),('pop-art','excess','Pop Art'),('abstract-expressionism','abstract','Abstract Expressionism'),('geometric-abstraction','abstract','Geometric Abstraction'),('op-art','abstract','Op Art')]
# Eight distinct acquisition ideas for each movement, ordered to deliberately vary emotional tone.
ideas={
'art-nouveau':'iris-stem-window|hair-and-vine-silhouette|dragonfly-wing-panel|curling-iron-gate|moonlit-lily-poster|thistle-border|serpentine-river-map|peacock-tail-fan',
'art-deco':'sunburst-elevator-door|stepped-skyscraper|fan-shaped-theater-light|chrome-train-nose|geometric-cocktail-glass|golden-ticket-booth|marquee-corner|zigzag-city-skyline',
'psychedelia':'melting-eye-flower|spiral-hand-lettering|radiating-mushroom-cap|liquid-rainbow-pool|interlocking-faces|vibrating-sun-disk|swirling-paisley-serpent|breathing-poster-frame',
'minimalism':'single-red-square|off-center-black-line|empty-chair-outline|one-small-window|narrow-light-beam|two-spaced-circles|white-field-shadow|floating-paper-dot',
'swiss-international':'asymmetric-grid-rule|oversized-cropped-numeral|transit-wayfinding-arrow|modular-clock-face|red-information-circle|diagonal-baseline|negative-space-poster|strict-typographic-column',
'bauhaus':'nested-primary-triangles|steel-tube-chair|modular-lamp-shade|red-blue-balance|geometric-dancer|workshop-stamp|circle-square-study|colored-glass-grid',
'brutalism':'cast-concrete-stairwell|raw-cement-bunker|monolithic-service-tower|board-formed-wall|heavy-shadow-overhang|exposed-conduit-knot|blocky-entrance-sign|stark-civic-ramp',
'constructivism':'red-wedge-through-circle|worker-with-megaphone|diagonal-crane-arm|gear-and-banner|staircase-photomontage|five-point-industrial-star|angled-factory-chimney|bold-propaganda-rays',
'dada':'upside-down-bowler-hat|newspaper-mouth|collaged-pocket-watch|dislocated-porcelain-eye|cutout-type-sentence|mustached-portrait-frame|receipt-winged-bird|impossible-office-stamp',
'punk':'safety-pin-heart|ripped-gig-ticket|stenciled-fist|photocopied-bootprint|ransom-note-title|barbed-wire-flower|spray-painted-stop-sign|torn-anti-authority-badge',
'futurism':'speed-lines-locomotive|fragmented-running-legs|propeller-sun|motorcar-in-motion|diagonal-city-towers|mechanical-horse|rotating-gear-cloud|metallic-noise-burst',
'cyberpunk':'neon-rain-alley|broken-surveillance-lens|fiber-optic-spine|corporate-skyscraper-glyph|hacked-turnstile|glitched-billboard-face|wires-and-roots|midnight-data-market',
'vaporwave':'pastel-classical-bust|sunset-grid-horizon|pixelated-palm-tree|outdated-software-window|marble-arcade-arch|pink-floppy-disk|floating-dolphin-outline|abandoned-mall-fountain',
'maximalism':'stacked-gilded-frames|flower-on-flower-wallpaper|chandelier-of-icons|overlapping-victorian-labels|ornate-cabinet-of-curiosities|ribbon-and-rosette-swarm|crowded-souvenir-shelf|exploding-decorative-border',
'pop-art':'halftone-soup-can|comic-speech-burst|oversized-price-tag|repeat-lip-print|bright-telephone-handset|shopping-bag-halo|mass-produced-rose|four-panel-celebrity-silhouette',
'abstract-expressionism':'wild-black-brushstroke|paint-drip-horizon|scraped-ochre-field|torn-canvas-edge|gestural-red-swipe|dense-charcoal-knot|thrown-ink-splash|unfinished-color-block',
'geometric-abstraction':'floating-triangle-cluster|nested-rectangular-planes|offset-color-disks|interlocking-grid-cells|diagonal-rhythm-bars|balanced-color-tiles|spiral-square-module|fractured-circle-study',
'op-art':'undulating-stripe-field|impossible-checkerboard|pulsing-concentric-rings|staggered-dot-tunnel|folded-zigzag-moire|rotating-radial-lines|warped-parallel-grid|vibrating-diamond-stack',
'surrealism':'eye-inside-keyhole|clock-rooted-in-soil|floating-fish-drawer|doorway-into-cloud|hand-holding-a-horizon|bird-with-book-wings|faceless-mirror-witness|rainfall-of-teacups',
'expressionism':'angular-city-walker|screaming-red-sky|black-woodcut-hands|distorted-church-spire|yellow-face-in-shadow|crowded-tenement-street|blue-horse-outline|jagged-mountain-portrait',
'memphis':'squiggle-laminate-panel|stacked-ceramic-shapes|confetti-lightning-bolt|clashing-pattern-vase|zigzag-side-table|polka-dot-column|pastel-geometry-party|striped-lamp-dome',
'zine-diy':'hand-lettered-page-margin|xeroxed-local-flyer|tape-hinged-photo|stapled-mini-booklet|scanned-fingerprint|cut-and-paste-manifesto|hand-drawn-distribution-map|photocopied-music-lineup',
'afrofuturism':'cosmic-record-grooves|ancestral-star-chart|interstellar-community-garden|solar-powered-braid-pattern|synthesizer-constellation|afrocentric-future-city|space-helmet-reflection|orbiting-story-symbols',
'gothic-revival':'pointed-arch-window|tracery-rose-window|gargoyle-water-spout|illuminated-manuscript-vine|buttress-silhouette|shadowed-cloister|stone-carved-leaf|tall-candle-niche',
'ukiyo-e':'great-curving-wave|kabuki-fan-profile|falling-cherry-petals|rain-on-bridge|paper-lantern-street|mountain-through-clouds|woodblock-theater-curtain|crane-over-river',
'situationism':'reworked-advertising-slogan|reversed-city-map|wandering-route-arrows|spectacle-television-head|shopping-cart-maze|graffiti-over-billboard|cutup-commuter-ticket|detourned-luxury-logo',
'grunge-design':'distressed-type-scrap|stained-concert-flyer|scratched-negative-strip|torn-corrugated-layer|bleeding-ink-handprint|rusted-photocopy-border|crossed-out-brand-label|weathered-poster-wall',
'y2k':'translucent-orb-button|chrome-liquid-star|pixel-sparkle-icon|bubble-interface-tab|futuristic-flip-phone|iridescent-cd-disc|rounded-progress-ring|wireframe-millennium-flower'
}
assert set(ideas)=={m[0] for m in existing}|{m[0] for m in movements}
# Emotional palettes for each style are creative tagging suggestions, not objective historical claims.
emo={
'art-nouveau':['serenity','love','admiration','pensiveness','acceptance','interest','awe','ecstasy'],
'art-deco':['admiration','vigilance','ecstasy','optimism','interest','contempt','amazement','trust'],
'psychedelia':['amazement','overwhelm','awe','ecstasy','distraction','apprehension','love','interest'],
'minimalism':['serenity','pensiveness','acceptance','boredom','trust','apprehension','interest','sadness'],
'swiss-international':['trust','vigilance','acceptance','interest','admiration','boredom','anticipation','serenity'],
'bauhaus':['anticipation','trust','interest','optimism','admiration','acceptance','joy','vigilance'],
'brutalism':['apprehension','grief','admiration','contempt','terror','annoyance','vigilance','pensiveness'],
'constructivism':['aggressiveness','vigilance','admiration','rage','trust','optimism','anticipation','overwhelm'],
'dada':['distraction','contempt','amazement','awe','annoyance','loathing','remorse','overwhelm'],
'punk':['aggressiveness','anger','vigilance','annoyance','contempt','love','rage','overwhelm'],
'futurism':['anticipation','aggressiveness','amazement','vigilance','terror','admiration','rage','overwhelm'],
'cyberpunk':['apprehension','contempt','terror','vigilance','aggressiveness','distraction','pensiveness','overwhelm'],
'vaporwave':['pensiveness','serenity','interest','remorse','distraction','boredom','love','sadness'],
'maximalism':['overwhelm','ecstasy','amazement','distraction','admiration','interest','joy','awe'],
'pop-art':['ecstasy','contempt','distraction','joy','annoyance','optimism','amazement','overwhelm'],
'abstract-expressionism':['rage','grief','annoyance','remorse','aggressiveness','loathing','amazement','overwhelm'],
'geometric-abstraction':['interest','trust','vigilance','acceptance','optimism','serenity','amazement','distraction'],
'op-art':['amazement','apprehension','overwhelm','distraction','interest','terror','awe','vigilance'],
'surrealism':['awe','pensiveness','amazement','apprehension','interest','love','terror','distraction'],
'expressionism':['grief','terror','rage','remorse','apprehension','loathing','admiration','sadness'],
'memphis':['joy','amazement','ecstasy','distraction','optimism','interest','love','overwhelm'],
'zine-diy':['interest','annoyance','vigilance','aggressiveness','acceptance','contempt','trust','optimism'],
'afrofuturism':['awe','admiration','optimism','vigilance','trust','ecstasy','interest','love'],
'gothic-revival':['awe','apprehension','terror','admiration','pensiveness','grief','serenity','trust'],
'ukiyo-e':['amazement','interest','serenity','pensiveness','love','awe','admiration','acceptance'],
'situationism':['contempt','interest','aggressiveness','disapproval','boredom','vigilance','annoyance','amazement'],
'grunge-design':['annoyance','pensiveness','loathing','grief','rage','remorse','contempt','overwhelm'],
'y2k':['optimism','amazement','interest','anticipation','admiration','distraction','joy','awe']}

# Six tastes, three designed recipe categories. Every 4 rows in each category cycle through type.
tastes=['sweet','umami','sour','bitter','spicy','salty']
abbr={'sweet':'sw','sour':'so','salty':'sa','bitter':'bi','umami':'um','spicy':'sp'}
# Pairs are metaphorically compatible, not necessarily geometrically adjacent on this bespoke board.
pair={'sweet':'salty','umami':'sweet','sour':'umami','bitter':'sour','spicy':'salty','salty':'sweet'}
ingredients=[]
for cat,txt in raw.items():
 for i,name in enumerate(txt.split('|')):
  idx=len(ingredients); dominant=tastes[(idx+idx//6)%6]
  # Exactly 75 dominant, 150 agreeing, 75 muddled across 300.
  mode=('dominant' if idx%4==0 else 'muddled' if idx%4==3 else 'agreeing')
  if mode=='dominant': parts=[(dominant,9),(pair[dominant],2)]
  elif mode=='agreeing': parts=[(dominant,6),(pair[dominant],5)]
  else:
   other=tastes[(tastes.index(dominant)+2)%6];third=tastes[(tastes.index(dominant)+4)%6]
   parts=[(dominant,4),(other,3),(third,3)]
  slug=re.sub('-+','-',re.sub('[^a-z0-9]+','-',name.lower())).strip('-')
  ingredients.append([slug,name,cat,' '.join(abbr[a]+str(v) for a,v in parts)])

# Generative acquisition records: src paths intentionally unpopulated, because this is a shopping list.
# Category associations are suggestions, and no source image is claimed to exist.
cutouts=[]
catcycles=[['object'],['concept'],['memory'],['institution'],['absurdity'],['food'],['concept','object'],[]]
blends=['love','submission','awe','disapproval','remorse','contempt','aggressiveness','optimism']
# Inject additional blend variety systematically across all 28 movements.
for family,branch,name in existing+[(x[0],x[1],x[2]) for x in movements]:
 labels=ideas[family].split('|');assert len(labels)==8
 e=emo[family]
 for i,subject in enumerate(labels):
  proposed=f'{family}-{subject}'
  second=blends[(i+list(ideas).index(family))%8]
  tags=list(dict.fromkeys([e[i],second,e[(i+3)%8]]))
  if len(tags)<2: tags.append('interest')
  cutouts.append({'id':proposed,'suggested_filename':proposed+'.png','label':subject.replace('-',' '),'family':family,'emo':tags[:4],'cats':catcycles[i], 'status':'proposed','source_hint':'Create original artwork or locate rights-cleared archival material; verify attribution and license before importing.'})

movrecs=[{'id':i,'branch':b,'name':n,'layout':l,'motion':mo,'texture':tx,'emo':e,'colors':c,'blurb':bl} for i,b,n,l,mo,tx,e,c,bl in movements]
words=set('ecstasy joy serenity admiration trust acceptance terror fear apprehension amazement surprise distraction grief sadness pensiveness loathing disgust boredom rage anger annoyance vigilance anticipation interest love submission awe disapproval remorse contempt aggressiveness optimism overwhelm'.split())
assert len(words)==33
assert len(ingredients)==300 and len(movrecs)==10 and len(cutouts)==224
assert len({x[0] for x in ingredients})==300
assert len({x['id'] for x in cutouts})==224
assert len({x['id'] for x in movrecs})==10
assert all(set(x['emo'])<=words and len(x['emo'])==3 for x in movrecs)
assert all(set(x['emo'])<=words and 2<=len(x['emo'])<=4 for x in cutouts)
assert all(x[2] in raw and 2<=len(x[3].split())<=4 and 8<=sum(int(re.search(r'\d+',q).group()) for q in x[3].split())<=12 for x in ingredients)

(P/'ingredients-new.json').write_text(json.dumps(ingredients,ensure_ascii=False,indent=2)+'\n')
(P/'movements-new.json').write_text(json.dumps(movrecs,ensure_ascii=False,indent=2)+'\n')
(P/'cutout-shopping-list.json').write_text(json.dumps(cutouts,ensure_ascii=False,indent=2)+'\n')
for filename,var,obj in [('ingredients-new.js','newIngredients',ingredients),('movements-new.js','newMovements',movrecs),('cutout-shopping-list.js','cutoutShoppingList',cutouts)]:
 (P/filename).write_text('// Pressure Cooker Poetry | generated expansion | candidate records, do not overwrite existing tables\nexport const '+var+' = '+json.dumps(obj,ensure_ascii=False,indent=2)+';\n')
# Coverage is cumulative across the specific new set; core family buckets include any tag from ring.
wedge={'joy':['ecstasy','joy','serenity'],'trust':['admiration','trust','acceptance'],'fear':['terror','fear','apprehension'],'surprise':['amazement','surprise','distraction'],'sadness':['grief','sadness','pensiveness'],'disgust':['loathing','disgust','boredom'],'anger':['rage','anger','annoyance'],'anticipation':['vigilance','anticipation','interest']}
def coverage(items):
 return {w:sum(any(t in ts for t in x['emo']) for x in items) for w,ts in wedge.items()}|{b:sum(b in x['emo'] for x in items) for b in blends}|{'overwhelm':sum('overwhelm' in x['emo'] for x in items)}
cm=coverage(movrecs);cc=coverage(cutouts)
print("COVERAGE PRECHECK",cc)
assert all(cc[k]>=6 for k in wedge) and all(cc[b]>=2 for b in blends)
modecounts=collections.Counter('dominant' if i%4==0 else 'muddled' if i%4==3 else 'agreeing' for i in range(300))
report=['# PCP database expansion: coverage report','', '## Status','', '- 300 new ingredient proposals, 10 new movements, 224 cutout acquisition concepts (8 per each of 28 movements).','- Cutout entries are **not** imported image assets: no `src` exists yet. Map `suggested_filename` to real, verified files after sourcing.','- Existing pantry IDs were not supplied. Internal uniqueness checked; collisions with the actual site pantry are **not** checked.','- The existing 18 movements were provided as names and branch assignments, not complete records. The 10 new movements are full records; 28-movement coverage here refers to cutout concepts only.','- Emotion coverage counts below are tag matches, **not** simulated dartboard selection probabilities.','', '## Ingredient pattern counts','', '| Recipe pattern | Count |','|---|---:|']
report += [f'| {k} | {modecounts[k]} |' for k in ['dominant','agreeing','muddled']]
report += ['','These are construction-pattern classes, not measured dart radii. The recipe taste vectors need a simulation to prove the promised intense/core/mild landing distribution.','','## Movement coverage (10 new movements only)','','| Emotion wedge / blend | New movements | Cutout concepts | Target for cutouts |','|---|---:|---:|---:|']
for k in list(wedge)+blends+['overwhelm']:
 report.append(f'| {k} | {cm[k]} | {cc[k]} | {6 if k in wedge else 2 if k in blends else "n/a"} |')
report += ['','## Cutout concepts by movement','','| Movement | Branch | Concepts |','|---|---|---:|']
for fid,b,n in existing+[(x[0],x[1],x[2]) for x in movements]:
 report.append(f'| {n} | {b} | {sum(x["family"]==fid for x in cutouts)} |')
report+=['','## Important distinctions','', 'The specification defines selection weights, but does not define the exact hashing, seeded random generator, or default house-stock flavor. This package does not invent replacements for these implementation details.','', 'The `cutout-shopping-list.json` file is **not** directly compatible with the runtime cutout table: it contains `suggested_filename`, `status`, and `source_hint` instead of `src`, `fallback`, and `source`. Do not load it into the renderer until real assets exist and those fields are added.','', 'Historical blurbs are concise editorial summaries, not a full provenance audit. Verify any archive licenses and creators before publication.','']
(P/'COVERAGE_REPORT.md').write_text('\n'.join(report))
(P/'README.md').write_text('''# Pressure Cooker Poetry: expansion pack\n\nThis package follows `DATABASE_SPEC.md` sections 6–9. It **adds candidates**, not edits to the current production site.\n\n## Files\n\n- `ingredients-new.js` and `.json`: 300 new compact ingredient tuples.\n- `movements-new.js` and `.json`: 10 new complete movement records.\n- `cutout-shopping-list.js` and `.json`: 224 **proposals**, 8 for each of 28 movement families. These are descriptions, not downloaded images.\n- `COVERAGE_REPORT.md`: counts and limitations.\n- `HANDOFF_FOR_CLAUDE.md`: integration protocol and acceptance checks.\n- `build.py`: reproducible source generator for these files.\n\n## Non-negotiables\n\nVisitors pick only ingredients; no exposed emotion mechanics. Never modify poems. Same recipe and same deployment data should produce same room. Cutouts and movements use **word** emotion tags only. Satire targets institutional power, not its victims.\n''')
(P/'HANDOFF_FOR_CLAUDE.md').write_text('''# Claude handoff: PCP database expansion\n\nUse the original `DATABASE_SPEC.md` as the authoritative specification. The generated files are candidate additions, not replacements. **Do not pretend 224 cutout images have been created.**\n\n1. Read the real current site pantry and extract all existing IDs. Report collisions with `ingredients-new.json`; rename conflicts before merging and preserve an old-to-new map.\n2. Validate six-category values, unique slugs, taste abbreviations (`sw so sa bi um sp`), 2–4 nonzero tastes, total 8–12. Do not change hidden dartboard behavior.\n3. Merge ten movements without overwriting the 18 existing records. Check branches, layouts, motions, textures, color formats, and tags against the source spec.\n4. Treat `cutout-shopping-list.json` as an acquisition backlog. Once each artwork is sourced or drawn, convert the record to the runtime section 7 schema: `id,src,fallback,label,family,emo,cats,source,notes`. Store only actual image paths. Record rights and provenance.\n5. Build a visual kit for each movement: CSS variables/colors, font stacks (with licensing/fallbacks), button skin, edge-only texture, layout grammar, and motion mapping. These components are NOT supplied as coded UI in this package; do not claim that they are.\n6. Add stable tests: same recipe => same room; only hidden controls; poems remain byte-for-byte identical; absent assets use fallback; reduced-motion behaves; Android responsive rendering works.\n7. Run seeded tests across thousands of ingredient combinations; audit dartboard ring/wedge distributions, too-frequent overrides, family dominance, duplicate cutouts, and whether `overwhelm` is reachable.\n8. Report wedge and blend coverage after merging into the actual production catalog. Compare proposed tags to real art before committing.\n\n## Open items\n\n- Existing ingredient IDs and full existing movement records were not in the supplied spec.\n- The spec lists no seed PRNG implementation and no canonical house-stock flavor; preserve existing source implementation.\n- Cutout art, fonts, CSS kits, button code, and animations are next-stage implementation tasks.\n''')
print('files built',len(ingredients),len(movrecs),len(cutouts));print('cutout coverage',cc);print('movement coverage',cm)
