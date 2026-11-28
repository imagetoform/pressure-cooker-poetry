/* Blueprints: machines designed but not built yet. Every one follows Play → Reveal → Learn. */
export type Blueprint = {
  id: string; num: string; name: string; tag: string; color: string
  play: string[]; reveal: string; learn: string; feel: string; wrappers: string; risk?: string
}

export const BLUEPRINTS: Blueprint[] = [
  { id: 'red-string', num: '05', name: 'Red-String Machine', tag: 'Make a conspiracy theory. Watch it hold up.', color: '#ed5c43',
    play: [
      'A corkboard deals you four random, true, boring facts (a bridge opened, a CEO changed, a bird migrated, a stock dipped).',
      'Drag red string between pins. Each string asks you to pick a connector: “coincidence?”, “follow the money”, “they don’t want you to know”, “just asking questions”.',
      'A credibility meter rises with every connector, never with evidence. Beat the clock to hit 100%.',
      'Bonus round: a friend’s theory slides in. Cut its strings with scissors before it reaches 100%.',
    ],
    reveal: 'The board flips to X-ray: each string labelled by move (coincidence-as-pattern, unfalsifiable claim, moving the goalposts, the burden flipped onto you). The meter shows what it measured: confidence, not truth.',
    learn: 'Apophenia: seeing patterns in noise. Connection is not evidence. Beside it, a separate shelf of conspiracies that were real and documented (COINTELPRO, the tobacco industry’s research memos, the Tuskegee study), each with sources, so the lesson is “check the evidence”, not “never suspect power”.',
    feel: 'String twangs on connect, pins push in with a click, the board shakes as the meter climbs.',
    wrappers: 'One per connector you catch in someone else’s theory.',
    risk: 'Biggest research job: the real-conspiracies shelf must be sourced item by item before it ships.' },
  { id: 'hall-of-mirrors', num: '06', name: 'Hall of Mirrors', tag: 'One event. Four mirrors. Watch the facts tilt.', color: '#2ec4b6',
    play: [
      'A fictional event (a protest at the Hoard & Co. warehouse) is reported by four invented outlets.',
      'A slider walks you through the mirrors. You have 60 seconds to tag what moved: who is the subject, which verb, which photo, what came first, who got quoted.',
      'Then build your own mirror: drag the same five facts into an order and pick a headline verb. The machine scores how far you tilted it.',
    ],
    reveal: 'The sentence diff: every word that changed between mirrors highlighted, and the passive verbs that made people vanish (“shots were fired”, “clashes erupted”).',
    learn: 'Framing and agenda-setting; active vs passive headlines. Notes on how wire services write neutral leads, and why the photo is part of the frame.',
    feel: 'Funhouse warp when you slide between mirrors; a camera shutter on each tag.',
    wrappers: 'One for each kind of tilt you tag: subject, verb, photo, order, quote.' },
  { id: 'ransom-note', num: '07', name: 'Ransom Note Studio', tag: 'Done taking things apart? Put something together.', color: '#ff2d6f',
    play: [
      'Type a counter-slogan. The studio deals it out as letters cut from the site’s cutout library and old print.',
      'Tap any letter to re-cut it from a different source; drag to tilt; tape and staples from the bench kit hold it down.',
      'Finish to stamp it as a one-page zine you can copy as an image.',
    ],
    reveal: 'Your page, credited: every letter lists the scrap it came from.',
    learn: 'Zines, samizdat and broadsides: how people without printing presses published anyway. Links to the cutout library and to the Learning Curve’s Act step.',
    feel: 'Scissor snips, tape pulls; the page shakes a little when you stamp it.',
    wrappers: 'One for your first finished page.' },
  { id: 'chart-crimes', num: '08', name: 'Chart Crimes', tag: 'Make a 2% change look like the end of the world.', color: '#e2ef63',
    play: [
      'You get a real, boring dataset and a client brief: “make it look like a crisis” or “make it look like nothing”.',
      'Grab the chart’s handles: chop the y-axis, stretch the scale, cherry-pick the date range, switch to 3D pie, add a scary red.',
      'A focus group of tiny faces reacts live. Then the other side: spot the crime in five charts against the clock.',
    ],
    reveal: 'The honest chart slides in under yours, at full scale, same data.',
    learn: 'Truncated axes, cherry-picked ranges, dual axes and area tricks. Darrell Huff, How to Lie with Statistics (1954), plus the modern checklist: start at zero for bars, show the whole range, label the source.',
    feel: 'The axis snaps like a ruler; the faces gasp.',
    wrappers: 'One for each kind of chart crime you catch.' },
  { id: 'but-wait', num: '09', name: 'But Wait, There’s More', tag: 'An infomercial you can take apart while it sells to you.', color: '#ffd23f',
    play: [
      'A fake late-night product (the Thought-O-Matic, a gadget that thinks for you) runs on a loop with a countdown clock.',
      'Hit the brakes every time it pulls a trick: fake scarcity, fake discount, fake authority, the free gift, the countdown.',
      'Too slow and you “buy” it: the order form fills itself in.',
    ],
    reveal: 'The commercial replays with every trick stamped on screen and its real-world name.',
    learn: 'Scarcity, anchoring prices, urgency and social proof as sales techniques, with the consumer-protection rules about fake “was” prices. Ties the site’s fake-abundance joke to the real thing.',
    feel: 'Studio-audience applause, a cash-register on every fall, a siren on the countdown.',
    wrappers: 'One per sales trick braked.' },
  { id: 'telephone', num: '10', name: 'Meme Telephone', tag: 'Pass a fact through ten sharers. See what comes out.', color: '#c86bff',
    play: [
      'A true sentence enters a line of ten cartoon sharers. Each one changes it a little: drops a number, adds an emoji, swaps a word, crops the context.',
      'You can stop the line at any point and fix the sentence, but every fix costs time.',
      'Score: how close the tenth version is to the first.',
    ],
    reveal: 'All ten versions stacked, the changes highlighted like a diff.',
    learn: 'How rumors drift (Allport & Postman’s 1947 serial-reproduction studies) and the habit of finding the original source before sharing.',
    feel: 'Each sharer’s phone buzzes as the message passes.',
    wrappers: 'One for each kind of drift you fix.' },
]

/* Department Zero: the cipher files a full jar unlocks. */
export const FILES = [
  { n: '001', name: 'The Shift', how: 'Caesar shift / ROT13. Turn the dial until the file reads.', built: true },
  { n: '002', name: 'The Dots', how: 'Morse code, hidden in a machine’s sound effects. Listen back and tap it out.', built: false },
  { n: '003', name: 'The Pen', how: 'Pigpen cipher, scratched into a cutout. Match the shapes to the grid.', built: false },
  { n: '004', name: 'The Book', how: 'A book cipher keyed to one of the poems (read only, never changed): page, line, word.', built: false },
  { n: '005', name: 'The Pixels', how: 'A message hidden in an image’s pixels. Turn up the contrast slider until it surfaces.', built: false },
]
