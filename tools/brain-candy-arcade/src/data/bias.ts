/* BIAS FACTORY — content. Every answer is a checkable fact; sources listed below. */

export type Q = { id: string; ask: string; unit: string; truth: number; min: number; max: number; lowAnchor: number; highAnchor: number; note: string }

export const QUESTIONS: Q[] = [
  { id: 'piano', ask: 'How many keys are on a standard piano?', unit: 'keys', truth: 88, min: 0, max: 300, lowAnchor: 12, highAnchor: 260, note: '52 white, 36 black.' },
  { id: 'bones', ask: 'How many bones are in an adult human body?', unit: 'bones', truth: 206, min: 0, max: 800, lowAnchor: 40, highAnchor: 700, note: 'Babies start with more; some fuse as you grow.' },
  { id: 'africa', ask: 'How many countries in Africa are members of the United Nations?', unit: 'countries', truth: 54, min: 0, max: 150, lowAnchor: 10, highAnchor: 130, note: 'This is the question Tversky and Kahneman used (as a percentage) in 1974.' },
  { id: 'everest', ask: 'How tall is Mount Everest, in feet?', unit: 'feet', truth: 29032, min: 0, max: 80000, lowAnchor: 6000, highAnchor: 70000, note: 'The 2020 China–Nepal survey: 8,848.86 m.' },
  { id: 'mississippi', ask: 'How long is the Mississippi River, in miles?', unit: 'miles', truth: 2340, min: 0, max: 8000, lowAnchor: 400, highAnchor: 7000, note: 'The US Geological Survey figure. Other agencies measure a little differently.' },
  { id: 'gutenberg', ask: 'Around what year did Gutenberg finish his printed Bible?', unit: '', truth: 1455, min: 800, max: 2000, lowAnchor: 900, highAnchor: 1900, note: 'About 1454–1455, in Mainz.' },
  { id: 'teeth', ask: 'How many teeth are in a full adult set, wisdom teeth included?', unit: 'teeth', truth: 32, min: 0, max: 120, lowAnchor: 6, highAnchor: 100, note: '20 baby teeth come first.' },
  { id: 'chess', ask: 'How many squares are on a chessboard?', unit: 'squares', truth: 64, min: 0, max: 300, lowAnchor: 9, highAnchor: 250, note: 'Eight by eight. Count them if you don’t trust the belt.' },
]

/* Wald's bombers: where the returning planes were hit. Zones are drawn on an SVG plane. */
export type Zone = { id: string; name: string; holes: number }
export const ZONES: Zone[] = [
  { id: 'wings', name: 'Wings', holes: 34 },
  { id: 'fuselage', name: 'Body', holes: 28 },
  { id: 'tail', name: 'Tail', holes: 15 },
  { id: 'engines', name: 'Engines', holes: 3 },
  { id: 'cockpit', name: 'Cockpit', holes: 2 },
]

export const BIAS_SOURCES = [
  { title: 'Tversky & Kahneman, “Judgment under Uncertainty: Heuristics and Biases”, Science (1974)', url: 'https://www.science.org/doi/10.1126/science.185.4157.1124' },
  { title: 'Anchoring (overview with the wheel-of-fortune experiment)', url: 'https://en.wikipedia.org/wiki/Anchoring_effect' },
  { title: 'Abraham Wald and survivorship bias', url: 'https://en.wikipedia.org/wiki/Survivorship_bias' },
  { title: 'Mount Everest height, 2020 survey', url: 'https://en.wikipedia.org/wiki/Mount_Everest' },
  { title: 'Mississippi River length (USGS figure)', url: 'https://en.wikipedia.org/wiki/Mississippi_River' },
]
