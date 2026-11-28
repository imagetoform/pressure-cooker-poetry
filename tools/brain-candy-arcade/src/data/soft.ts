/* S.O.F.T. — the euphemism elevator. Hand-written examples of real softening moves.
 * Floor 1 is the plain word; every floor above applies one named rule.
 * Carlin's chain is his; the others are common corporate and official usage, written for this machine. */

export type Floor = { text: string; rule: string }
export type Chain = { id: string; hard: string; who: string; floors: Floor[]; note?: string }

export const RULES: Record<string, string> = {
  longer: 'Make it longer. More syllables, less sting.',
  latin: 'Go Latin. Swap the blunt Anglo-Saxon word for a cool Latin one.',
  noun: 'Turn the verb into a noun. Actions have doers; nouns just happen.',
  agent: 'Delete who did it. Passive voice, or no person at all.',
  benefit: 'Make it sound like a benefit. The loss becomes an "opportunity".',
  medical: 'Borrow a clinic. Clinical words feel neutral and settled.',
}

export const CHAINS: Chain[] = [
  { id: 'carlin', hard: 'shell shock', who: 'Combat trauma, as traced by George Carlin',
    floors: [
      { text: 'shell shock', rule: '' },
      { text: 'battle fatigue', rule: 'longer' },
      { text: 'operational exhaustion', rule: 'latin' },
      { text: 'post-traumatic stress disorder', rule: 'medical' },
    ],
    note: 'Carlin’s chain, from his stand-up on soft language. The condition stayed the same; the name kept moving away from the pain.' },
  { id: 'fired', hard: 'fired', who: 'What happens to workers',
    floors: [
      { text: 'fired', rule: '' },
      { text: 'let go', rule: 'agent' },
      { text: 'laid off', rule: 'agent' },
      { text: 'downsized', rule: 'latin' },
      { text: 'rightsized', rule: 'benefit' },
      { text: 'a workforce optimization event', rule: 'noun' },
    ] },
  { id: 'killed', hard: 'civilians killed', who: 'What happens in a war',
    floors: [
      { text: 'civilians killed', rule: '' },
      { text: 'civilian deaths', rule: 'noun' },
      { text: 'civilian casualties', rule: 'latin' },
      { text: 'collateral damage', rule: 'agent' },
    ],
    note: '“Collateral damage” is a real military term and a standard example in writing on doublespeak.' },
  { id: 'evicted', hard: 'thrown out of their homes', who: 'What a landlord does',
    floors: [
      { text: 'thrown out of their homes', rule: '' },
      { text: 'evicted', rule: 'latin' },
      { text: 'displaced', rule: 'agent' },
      { text: 'transitioned out of the property', rule: 'longer' },
      { text: 'a tenancy realignment', rule: 'noun' },
    ] },
  { id: 'price', hard: 'we raised prices', who: 'What a company does to your bill',
    floors: [
      { text: 'we raised prices', rule: '' },
      { text: 'prices went up', rule: 'agent' },
      { text: 'a price adjustment', rule: 'noun' },
      { text: 'a pricing realignment', rule: 'latin' },
      { text: 'enhanced value for our valued customers', rule: 'benefit' },
    ] },
  { id: 'spying', hard: 'spying on you', who: 'What an app does with your phone',
    floors: [
      { text: 'spying on you', rule: '' },
      { text: 'tracking your activity', rule: 'longer' },
      { text: 'data collection', rule: 'noun' },
      { text: 'signal processing', rule: 'latin' },
      { text: 'a personalized experience', rule: 'benefit' },
    ] },
  { id: 'lied', hard: 'he lied', who: 'What an official did at the podium',
    floors: [
      { text: 'he lied', rule: '' },
      { text: 'he misspoke', rule: 'longer' },
      { text: 'mistakes were made', rule: 'agent' },
      { text: 'an inaccuracy occurred', rule: 'latin' },
      { text: 'a communications learning opportunity', rule: 'benefit' },
    ],
    note: '“Mistakes were made” is the classic agentless apology; it has been used by presidents of both parties.' },
]

/* Going down: corporate mush back to plain words. One accurate plain reading, two decoys. */
export type Mush = { mush: string; plain: string; decoys: string[] }
export const MUSH: Mush[] = [
  { mush: 'We are rightsizing our human capital footprint to unlock operational synergies.', plain: 'We are firing people to save money.', decoys: ['We are hiring more staff.', 'We are moving to a bigger office.'] },
  { mush: 'Your call is important to us. Due to unprecedented volumes, wait times may be longer than usual.', plain: 'We didn’t hire enough people to answer the phone.', decoys: ['Everyone is calling at once by coincidence.', 'Your call will be answered right away.'] },
  { mush: 'Select legacy features are being sunset to streamline your experience.', plain: 'We took away things you used.', decoys: ['We added new features.', 'Nothing is changing.'] },
  { mush: 'The neighborhood is experiencing a period of revitalization.', plain: 'Rents went up and people who lived there are being pushed out.', decoys: ['The park got new benches.', 'More people moved in because they wanted to.'] },
  { mush: 'We have updated our privacy policy to better reflect how we deliver value.', plain: 'We are selling more of your data.', decoys: ['We now collect less data.', 'We fixed a typo.'] },
  { mush: 'The incident is being reviewed in accordance with established protocols.', plain: 'We are not going to tell you anything yet.', decoys: ['Someone has been fired.', 'The problem is already fixed.'] },
  { mush: 'Pricing has been harmonized across tiers to reflect enhanced value.', plain: 'It costs more now.', decoys: ['It costs less now.', 'You get a free upgrade.'] },
  { mush: 'Due to a reprioritization of resources, the program has been paused indefinitely.', plain: 'The program is cancelled.', decoys: ['The program starts next week.', 'The program got more money.'] },
  { mush: 'Our fulfillment associates are empowered with flexible scheduling opportunities.', plain: 'Workers don’t know their hours until the last minute.', decoys: ['Workers choose their own hours.', 'Workers got a raise.'] },
  { mush: 'Certain inventory experienced shrink-adjacent quality outcomes.', plain: 'Some of the stock went bad.', decoys: ['Sales went up.', 'Someone stole a truck.'] },
]

export const SOFT_SOURCES = [
  { title: 'George Carlin on euphemisms and the shell-shock chain (Propaganda Critic)', url: 'https://propagandacritic.com/previous-version-propaganda-critic/articles/ct.wg.euphemism.html' },
  { title: 'Orwell, “Politics and the English Language” (1946)', url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language' },
  { title: 'Doublespeak and William Lutz', url: 'https://en.wikipedia.org/wiki/Doublespeak' },
]
