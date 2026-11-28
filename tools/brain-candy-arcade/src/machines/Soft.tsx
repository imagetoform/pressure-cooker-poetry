import { useEffect, useMemo, useState } from 'react'
import { CHAINS, MUSH, RULES, SOFT_SOURCES } from '@/data/soft'
import { addWrapper, rng, sfx, shuffle, syllables } from '@/lib/store'
import { Screen, Sources, Spot, useClock, useToast } from '@/ui'

const PER = 12

export default function Soft() {
  const [mode, setMode] = useState<'up' | 'down' | 'reveal'>('up')
  const [chainId, setChainId] = useState(CHAINS[0].id)
  const chain = CHAINS.find(c => c.id === chainId)!
  const [floor, setFloor] = useState(0)
  const [toast, toastNode] = useToast()
  const top = floor === chain.floors.length - 1
  const ride = (d: number) => {
    const n = Math.max(0, Math.min(chain.floors.length - 1, floor + d)); if (n === floor) return
    setFloor(n); sfx('ding')
    if (n === chain.floors.length - 1 && addWrapper({ id: 'soft-up', label: 'Euphemism', color: '#ffb3cb', machine: 'S.O.F.T.' })) toast('Wrapper: Euphemism caught')
  }
  useEffect(() => { setFloor(0) }, [chainId])

  /* going down */
  const [seed, setSeed] = useState('1')
  const deck = useMemo(() => shuffle(MUSH, rng('soft|' + seed)).slice(0, 7), [seed])
  const [i, setI] = useState(0)
  const [cut, setCut] = useState(0)
  const [rightN, setRightN] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const item = deck[i]
  const opts = useMemo(() => item ? shuffle([item.plain, ...item.decoys], rng('o|' + seed + i)) : [], [item, seed, i])
  const next = () => { setPick(null); if (i + 1 >= deck.length) { setMode('reveal'); sfx('ding'); if (rightN >= 5 && addWrapper({ id: 'soft-down', label: 'Doublespeak', color: '#ff2d6f', machine: 'S.O.F.T.' })) toast('Wrapper: Doublespeak caught') } else { setI(i + 1); setLeft(PER) } }
  const [left, setLeft] = useClock(PER, mode === 'down' && pick === null && !!item, () => { setPick('__timeout'); sfx('bad') })
  const choose = (o: string) => {
    if (pick) return; setPick(o)
    if (o === item.plain) { const saved = Math.max(0, syllables(item.mush) - syllables(item.plain)); setCut(c => c + saved); setRightN(n => n + 1); sfx('good') } else sfx('bad')
  }
  const startDown = () => { setSeed(String(Math.floor(Math.random() * 1e5))); setI(0); setCut(0); setRightN(0); setPick(null); setLeft(PER); setMode('down') }

  return (
    <Screen title="S.O.F.T." sub="The euphemism elevator. Ride a hard word up until it stops hurting. Then bring the mush back down to earth." color="#ffb3cb" step={mode === 'reveal' ? 1 : 0} steps={['Play', 'Reveal', 'Learn']}>
      {toastNode}
      {mode === 'up' && (
        <div className="grid2">
          <div>
            <p className="lab">Pick a hard word</p>
            <div className="row">{CHAINS.map(c => <button key={c.id} className={'btn ' + (c.id === chainId ? 'acid' : 'ghost')} onClick={() => { setChainId(c.id); sfx('tap') }}>{c.hard}</button>)}</div>
            <p style={{ marginTop: 14, fontWeight: 700 }}>{chain.who}. Press ▲ to go up a floor. Each floor applies one rule.</p>
            <div className="hud"><div>Syllables<b>{syllables(chain.floors[floor].text)}</b></div><div>Started at<b>{syllables(chain.floors[0].text)}</b></div></div>
            {floor > 0 && <p className="xray" style={{ marginTop: 14 }}><span className="tag" style={{ ['--tc' as string]: '#ffb3cb' }}>Floor {floor + 1} rule</span>{RULES[chain.floors[floor].rule]}</p>}
            {top && <>
              <p style={{ fontWeight: 800 }}>Penthouse. Same thing as the lobby; nobody up here has to feel it.</p>
              {chain.note && <p className="muted">{chain.note}</p>}
              <button className="btn big" onClick={startDown}>Now take it back down</button>
            </>}
          </div>
          <div className="shaft">
            <div className="floors">
              {chain.floors.map((f, n) => (
                <div key={n} className={'floor' + (n === floor ? ' here' : n < floor ? ' past' : '')}>
                  <span className="fn">{n + 1}</span>
                  <span className="ft">{f.text}{f.rule && <span className="fr">{RULES[f.rule].split('.')[0]}</span>}</span>
                </div>
              ))}
            </div>
            <div className="car">
              <span className="disp" aria-live="polite">{floor + 1}</span>
              <button onClick={() => ride(1)} disabled={top} aria-label="Up one floor">▲</button>
              <button onClick={() => ride(-1)} disabled={floor === 0} aria-label="Down one floor">▼</button>
            </div>
          </div>
        </div>
      )}
      {mode === 'down' && item && (
        <div>
          <div className="hud" style={{ marginBottom: 12 }}><div>Memo<b>{i + 1}/{deck.length}</b></div><div>Time<b>{left.toFixed(1)}</b></div><div>Syllables cut<b>{cut}</b></div></div>
          <p className="lab">Corporate says:</p>
          <p className="mush">{item.mush}</p>
          <p className="lab">What does it actually mean?</p>
          {opts.map(o => <button key={o} className={'opt' + (pick ? (o === item.plain ? ' right' : o === pick ? ' wrong' : '') : '')} onClick={() => choose(o)} disabled={!!pick}>{o}</button>)}
          {pick && <div className="row"><p style={{ fontWeight: 800, flex: 1 }}>{pick === item.plain ? `Plain talk: ${syllables(item.mush)} syllables down to ${syllables(item.plain)}.` : pick === '__timeout' ? 'Out of time. The memo wins this one.' : 'The mush got you. That’s its job.'}</p><button className="btn big" onClick={next}>{i + 1 >= deck.length ? 'See the X-ray' : 'Next memo'}</button></div>}
        </div>
      )}
      {mode === 'reveal' && (
        <div>
          <div className="hud"><div>Translated<b>{rightN}/{deck.length}</b></div><div>Syllables cut<b>{cut}</b></div></div>
          <div className="xray">
            <h3>X-ray: the six softening rules</h3>
            <ul>{Object.entries(RULES).map(([k, v]) => <li key={k}><b>{v.split('.')[0]}.</b> {v.split('.').slice(1).join('.')}</li>)}</ul>
          </div>
          <div className="xray">
            <h3>Learn</h3>
            <p>Euphemism is not always a lie. Sometimes it is kindness. The question is <b>who it protects</b>: the person in pain, or the person who caused it. When a sentence loses its doer, ask who did it. When a word gets longer, ask what it got longer to avoid.</p>
            <p className="muted">Orwell warned in 1946 that political language is built to “make lies sound truthful.” William Lutz later named the corporate and government version doublespeak. Carlin did it with jokes.</p>
          </div>
          <Spot>the missing doer, the Latin swap, the loss renamed as an opportunity.</Spot>
          <div className="row" style={{ marginTop: 14 }}><button className="btn big" onClick={startDown}>Another stack of memos</button><button className="btn" onClick={() => setMode('up')}>Back to the elevator</button></div>
          <Sources list={SOFT_SOURCES} />
        </div>
      )}
    </Screen>
  )
}
