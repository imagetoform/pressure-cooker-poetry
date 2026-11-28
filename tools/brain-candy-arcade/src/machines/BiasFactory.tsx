import { useMemo, useState } from 'react'
import { BIAS_SOURCES, QUESTIONS, ZONES } from '@/data/bias'
import { addWrapper, rng, sfx, shuffle } from '@/lib/store'
import { Screen, Sources, Spot, useToast } from '@/ui'

type Ans = { qid: string; anchor: number; high: boolean; guess: number }
const fmt = (n: number) => n.toLocaleString('en-US')

/* Zone shapes for the top-down bomber (viewBox 0 0 600 420). */
const SHAPES: Record<string, string> = {
  wings: 'M40 190 L560 190 L560 236 L40 236 Z',
  fuselage: 'M270 70 L330 70 L336 330 L264 330 Z',
  tail: 'M200 330 L400 330 L400 372 L200 372 Z',
  engines: 'M120 172 h40 v82 h-40 Z M200 172 h40 v82 h-40 Z M360 172 h40 v82 h-40 Z M440 172 h40 v82 h-40 Z',
  cockpit: 'M270 70 Q300 20 330 70 Z',
}
const BOX: Record<string, [number, number, number, number][]> = {
  wings: [[50, 196, 60, 34], [250, 196, 10, 34], [340, 196, 10, 34], [490, 196, 60, 34]],
  fuselage: [[275, 80, 50, 100], [275, 250, 50, 75]],
  tail: [[205, 335, 190, 32]],
  engines: [[125, 180, 30, 66], [445, 180, 30, 66]],
  cockpit: [[288, 48, 24, 18]],
}

export default function BiasFactory() {
  const [stage, setStage] = useState<'belt' | 'graph' | 'wald' | 'reveal'>('belt')
  const [seed, setSeed] = useState(() => String(Date.now() % 1e5))
  const order = useMemo(() => {
    const r = rng('bias|' + seed), qs = shuffle(QUESTIONS, r)
    const highs = new Set(shuffle(qs.map(q => q.id), r).slice(0, qs.length / 2))
    return qs.map(q => ({ q, high: highs.has(q.id), anchor: highs.has(q.id) ? q.highAnchor : q.lowAnchor }))
  }, [seed])
  const [i, setI] = useState(0)
  const [flash, setFlash] = useState(true)
  const [val, setVal] = useState<string>('')
  const [answers, setAnswers] = useState<Ans[]>([])
  const [toast, toastNode] = useToast()
  const cur = order[i]

  const pull = () => { setFlash(false); sfx('tap') }
  const lock = () => {
    const g = Number(val); if (!val || Number.isNaN(g)) return
    const a = [...answers, { qid: cur.q.id, anchor: cur.anchor, high: cur.high, guess: g }]
    setAnswers(a); setVal(''); sfx('good')
    if (i + 1 >= order.length) { setStage('graph'); sfx('ding'); if (addWrapper({ id: 'bias-anchor', label: 'Anchoring', color: '#ffb08f', machine: 'Bias Factory' })) toast('Wrapper: Anchoring caught') }
    else { setI(i + 1); setFlash(true) }
  }
  const lean = (high: boolean) => {
    const xs = answers.filter(a => a.high === high).map(a => Math.log2(Math.max(0.01, a.guess) / QUESTIONS.find(q => q.id === a.qid)!.truth))
    return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0
  }
  const hi = lean(true), lo = lean(false)

  /* wald */
  const holes = useMemo(() => {
    const r = rng('holes'); const out: { x: number; y: number }[] = []
    ZONES.forEach(z => { const boxes = BOX[z.id]; for (let k = 0; k < z.holes; k++) { const b = boxes[k % boxes.length]; out.push({ x: b[0] + r() * b[2], y: b[1] + r() * b[3] }) } })
    return out
  }, [])
  const [armor, setArmor] = useState<string[]>([])
  const toggleArmor = (id: string) => { if (stage !== 'wald') return; sfx('tap'); setArmor(a => a.includes(id) ? a.filter(x => x !== id) : a.length < 2 ? [...a, id] : [a[1], id]) }
  const sendOut = () => { setStage('reveal'); sfx('ding'); if (addWrapper({ id: 'bias-survivor', label: 'Survivorship', color: '#e7c27d', machine: 'Bias Factory' })) toast('Wrapper: Survivorship caught') }
  const wise = armor.filter(a => a === 'engines' || a === 'cockpit').length

  return (
    <Screen title="Bias Factory" sub="A conveyor belt of quick guesses. The belt is rigged. See if it got to you." color="#ffb08f" step={stage === 'belt' || stage === 'wald' ? 0 : 1} steps={['Play', 'Reveal', 'Learn']}>
      {toastNode}
      {stage === 'belt' && cur && (
        <div>
          <div className="hud" style={{ marginBottom: 12 }}><div>Crate<b>{i + 1}/{order.length}</b></div></div>
          <div className={'belt' + (flash ? ' run' : '')}>
            <span className="stamp">TODAY’S LUCKY NUMBER</span>
            {flash ? <span className="crate" aria-live="polite">{fmt(cur.anchor)}</span> : <span className="crate" style={{ opacity: .25 }}>?</span>}
          </div>
          {flash ? (
            <div className="row" style={{ marginTop: 14 }}>
              <p style={{ fontWeight: 700, flex: 1 }}>Is the answer to the next question more or less than {fmt(cur.anchor)}? Think about it, then pull the lever.</p>
              <button className="btn big" onClick={pull} autoFocus>Pull the lever</button>
            </div>
          ) : (
            <form className="guess" onSubmit={e => { e.preventDefault(); lock() }}>
              <label htmlFor="g" style={{ font: '700 1.3rem/1.3 Archivo' }}>{cur.q.ask}</label>
              <input id="g" type="number" inputMode="numeric" value={val} onChange={e => setVal(e.target.value)} placeholder="Your best guess" autoFocus />
              <input type="range" min={cur.q.min} max={cur.q.max} value={val || cur.q.min} onChange={e => setVal(e.target.value)} aria-label="Slide to guess" />
              <div className="row"><button className="btn big" type="submit" disabled={!val}>Lock it in</button><span className="muted">{cur.q.unit}</span></div>
            </form>
          )}
        </div>
      )}
      {stage === 'graph' && (
        <div>
          <h3 style={{ font: '400 2rem Anton', margin: 0 }}>Did the lucky number get into your head?</h3>
          <p>Each row is one of your guesses. The line in the middle is the true answer; left is too low, right is too high.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {answers.map(a => {
              const q = QUESTIONS.find(x => x.id === a.qid)!, ratio = Math.log2(Math.max(0.01, a.guess) / q.truth)
              const pos = 50 + Math.max(-2, Math.min(2, ratio)) * 25
              return (
                <div key={a.qid} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: '.9rem', fontWeight: 600 }}>{q.ask.replace(/^How (many|tall|long) /, '').replace('?', '')}<br /><span className="muted">you: {fmt(a.guess)} · true: {fmt(q.truth)}</span></span>
                  <div style={{ position: 'relative', height: 34, background: 'var(--paper-2)', border: '2px solid var(--ink)' }}>
                    <i style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--ink)' }} />
                    <span title={a.high ? 'high number shown' : 'low number shown'} style={{ position: 'absolute', left: `calc(${pos}% - 14px)`, top: 3, width: 28, height: 24, background: a.high ? '#c3102f' : '#2ec4b6', border: '2px solid #000', color: '#fff', font: '700 .7rem Archivo', display: 'grid', placeItems: 'center' }}>{a.high ? 'HI' : 'LO'}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="lab" style={{ marginTop: 8 }}><span className="tag" style={{ ['--tc' as string]: '#ff8a8a' }}>HI</span>the belt showed a high number first · <span className="tag" style={{ ['--tc' as string]: '#2ec4b6' }}>LO</span>it showed a low one · scale runs from a quarter of the truth to four times it</p>
          <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            {hi > lo + 0.15 ? 'After a high number, your guesses ran higher. The belt got in.' : hi < lo - 0.15 ? 'You leaned the opposite way from the belt. Either you fought it, or eight guesses is just too few to tell.' : 'Your guesses barely moved with the belt this time. Eight guesses is a tiny sample, so try again.'}
          </p>
          <button className="btn big" onClick={() => { setStage('wald'); sfx('tap') }}>Next station: the bombers</button>
        </div>
      )}
      {(stage === 'wald' || stage === 'reveal') && (
        <div className="grid2">
          <div>
            <h3 style={{ font: '400 2rem/1 Anton', margin: '0 0 8px' }}>1943. The bombers that came back.</h3>
            <p>Every dot is a bullet hole counted on a plane that made it home. You can afford armour for <b>two</b> places. Where does it go?</p>
            <div className="row">{ZONES.map(z => <button key={z.id} className={'btn ' + (armor.includes(z.id) ? 'acid' : 'ghost')} onClick={() => toggleArmor(z.id)} aria-pressed={armor.includes(z.id)} disabled={stage === 'reveal'}>{z.name} · {z.holes}</button>)}</div>
            {stage === 'wald' && <div className="row" style={{ marginTop: 14 }}><button className="btn big" disabled={armor.length < 2} onClick={sendOut}>Bolt it on</button></div>}
            {stage === 'reveal' && (
              <div className="xray">
                <h3>{wise === 2 ? 'You armoured the clean spots. Right.' : wise === 1 ? 'Half right.' : 'You armoured the holes. Most people do.'}</h3>
                <p>The holes show where a plane <b>can</b> get hit and still fly home. The planes hit in the engines and the cockpit aren’t in this count: they didn’t come back. So the armour goes where the holes <b>aren’t</b>.</p>
                <p className="muted">This is the famous retelling of the statistician Abraham Wald’s work for the US Statistical Research Group in World War II. The dot diagram is a modern illustration, not his original data.</p>
              </div>
            )}
          </div>
          <svg className="plane" viewBox="0 0 600 420" role="img" aria-label="Top view of a bomber with bullet holes. Most holes are on the wings and body; almost none on the engines and cockpit.">
            {ZONES.map(z => (
              <path key={z.id} d={SHAPES[z.id]} className="zone" tabIndex={stage === 'wald' ? 0 : -1} role="button" aria-label={z.name}
                fill={armor.includes(z.id) ? '#e2ef63' : stage === 'reveal' && (z.id === 'engines' || z.id === 'cockpit') ? '#ffb08f' : '#8d969c'} stroke="#141214" strokeWidth="4"
                onClick={() => toggleArmor(z.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleArmor(z.id) } }} />
            ))}
            {holes.map((h, k) => <circle key={k} cx={h.x} cy={h.y} r="4.5" fill="#c3102f" stroke="#000" strokeWidth="1.5" pointerEvents="none" />)}
          </svg>
          {stage === 'reveal' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="xray">
                <h3>Learn</h3>
                <p><b>Anchoring.</b> In 1974 Amos Tversky and Daniel Kahneman spun a wheel of fortune rigged to land on 10 or 65, then asked people what percentage of African countries were in the UN. People who saw 10 guessed about 25%; people who saw 65 guessed about 45%. A number with nothing to do with the question still pulled the answer. Prices, salary offers and “was $99, now $49” tags use the same pull.</p>
                <p><b>Survivorship bias.</b> Looking only at what made it through (the planes that came home, the businesses still open, the dropout billionaire) and drawing the lesson from them. Ask: what does the pile of failures look like, and why can’t I see it?</p>
              </div>
              <Spot>the number shown first, and the winners standing in for everyone.</Spot>
              <div className="row" style={{ marginTop: 14 }}><button className="btn big" onClick={() => { setSeed(String(Math.floor(Math.random() * 1e5))); setI(0); setAnswers([]); setFlash(true); setArmor([]); setStage('belt') }}>Run the belt again</button></div>
              <Sources list={BIAS_SOURCES} />
            </div>
          )}
        </div>
      )}
    </Screen>
  )
}
