import { useEffect, useMemo, useRef, useState } from 'react'
import { SPIN } from '@/data/spin'
import { addWrapper, rng, sfx, shuffle, reduceMotion } from '@/lib/store'
import { Screen, Sources, Spot, useClock, useToast, Meter } from '@/ui'

type T = { id: string; name: string; color: string; calm: number; hides: number; what: string; ask: string; hides_line: string; origin: string }
type S = { id: string; client: string; fact: string; lines: Record<string, string> }
const TECH: T[] = SPIN.techniques
const SCEN: S[] = SPIN.scenarios
const byId = Object.fromEntries(TECH.map(t => [t.id, t]))
const ROUND = 45

type Seen = { s: S; tid: string; picked: string | null }

export default function SpinCycle() {
  const [phase, setPhase] = useState<'load' | 'spin' | 'release' | 'catch' | 'reveal'>('load')
  const [seed, setSeed] = useState(() => String(Date.now() % 100000))
  const r = useMemo(() => rng('spin|' + seed), [seed])
  const [scen, setScen] = useState<S>(() => SCEN[0])
  useEffect(() => { setScen(SCEN[Math.floor(r() * SCEN.length)]) }, [r])
  const [pods, setPods] = useState<string[]>([])
  const [angle, setAngle] = useState(0)
  const [spun, setSpun] = useState(0)
  const drag = useRef<{ a: number } | null>(null)
  const washer = useRef<HTMLDivElement>(null)
  const [toast, toastNode] = useToast()

  const calm = pods.reduce((n, p) => n + byId[p].calm, 0) * 1.6
  const hid = pods.reduce((n, p) => n + byId[p].hides, 0) * 1.6
  const togglePod = (id: string) => {
    if (phase !== 'load') return
    sfx('tap')
    setPods(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 3 ? [...p, id] : p)
  }

  /* ---------- spin: drag around the door, or hold the button / space bar ---------- */
  const addSpin = (deg: number) => {
    setAngle(a => a + deg)
    setSpun(s => { const n = Math.min(100, s + Math.abs(deg) / 14); if (n >= 100 && s < 100) { sfx('ding'); setTimeout(() => setPhase('release'), 250) } return n })
  }
  const ang = (e: React.PointerEvent) => { const b = washer.current!.getBoundingClientRect(); return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI }
  const onDown = (e: React.PointerEvent) => { if (phase !== 'spin') return; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); drag.current = { a: ang(e) }; sfx('spin') }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const a = ang(e); let d = a - drag.current.a; if (d > 180) d -= 360; if (d < -180) d += 360
    drag.current.a = a; addSpin(d)
  }
  const hold = useRef<number>(0)
  const startHold = () => { if (phase !== 'spin') return; sfx('spin'); clearInterval(hold.current); hold.current = window.setInterval(() => addSpin(24), 40) }
  const stopHold = () => clearInterval(hold.current)
  useEffect(() => () => clearInterval(hold.current), [])

  /* ---------- catch round ---------- */
  const deck = useMemo(() => shuffle(SCEN.flatMap(s => TECH.map(t => ({ s, tid: t.id }))), rng('catch|' + seed)), [seed])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [bump, setBump] = useState(0)
  const [seen, setSeen] = useState<Seen[]>([])
  const [shake, setShake] = useState(false)
  const [left, setLeft] = useClock(ROUND, phase === 'catch', () => { sfx('ding'); setPhase('reveal') })
  const cur = deck[idx % deck.length]
  const answer = (tid: string) => {
    if (phase !== 'catch') return
    const ok = tid === cur.tid
    setSeen(s => [...s, { ...cur, picked: tid }])
    if (ok) {
      setScore(s => s + 10 * combo); setCombo(c => Math.min(5, c + 1)); setBump(b => b + 1); sfx('combo', combo)
      const t = byId[cur.tid]
      if (addWrapper({ id: 'spin-' + t.id, label: t.name, color: t.color, machine: 'Spin Cycle' })) toast('Wrapper: ' + t.name + ' caught')
    } else {
      setCombo(1); sfx('bad'); setShake(true); setTimeout(() => setShake(false), 350); setLeft(l => Math.max(0, l - 2))
      toast('That was ' + byId[cur.tid].name + '  (−2 s)')
    }
    setIdx(i => i + 1)
  }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select,textarea')) return
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= 8) { e.preventDefault(); if (phase === 'catch') answer(TECH[n - 1].id); else togglePod(TECH[n - 1].id) }
      if (e.code === 'Space' && phase === 'spin') { e.preventDefault(); addSpin(90) }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  })

  const startCatch = () => { setIdx(0); setScore(0); setCombo(1); setSeen([]); setLeft(ROUND); setPhase('catch') }
  const again = () => { setPods([]); setSpun(0); setAngle(0); setSeed(String(Math.floor(Math.random() * 100000))); setPhase('load') }
  const step = phase === 'reveal' ? 1 : 0
  const right = seen.filter(x => x.picked === x.tid).length

  return (
    <Screen title="The Spin Cycle" sub="You’re the PR flack. Wash a dirty fact clean, then switch sides and catch someone else’s spin." color="#9fd8ff" step={step} steps={['Play', 'Reveal', 'Learn']}>
      {toastNode}
      {(phase === 'load' || phase === 'spin' || phase === 'release') && (
        <div className="grid2">
          <div>
            <p className="lab">Today’s client</p>
            <h3 style={{ font: '400 1.8rem/1 Anton', margin: '0 0 6px' }}>{scen.client}</h3>
            <p style={{ border: '3px solid #000', background: '#fff', color: '#141214', padding: 12, fontWeight: 700 }}><span className="tag" style={{ ['--tc' as string]: '#ffb3b3' }}>DIRTY FACT</span>{scen.fact}</p>
            <p className="lab" style={{ marginTop: 14 }}>Load three detergents {phase === 'load' && <span className="muted">(tap, or keys 1–8)</span>}</p>
            <div className="pods">
              {TECH.map((t, i) => (
                <button key={t.id} className={'pod' + (pods.includes(t.id) ? ' on' : '')} style={{ ['--tc' as string]: t.color }} onClick={() => togglePod(t.id)} aria-pressed={pods.includes(t.id)} disabled={phase !== 'load'}>
                  {t.name}<small>{t.hides_line}</small><kbd>{i + 1}</kbd>
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
              <Meter label="How calm it sounds" value={calm} color="#2ec4b6" />
              <Meter label="How much it hides" value={hid} color="#c3102f" />
            </div>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn big" disabled={pods.length < 3 || phase !== 'load'} onClick={() => { setPhase('spin'); sfx('good') }}>Load the drum</button>
              <button className="btn ghost" onClick={() => { setScen(SCEN[(SCEN.indexOf(scen) + 1) % SCEN.length]); sfx('tap') }} disabled={phase !== 'load'}>New client</button>
            </div>
          </div>
          <div>
            <div ref={washer} className="washer" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}
              role="slider" aria-label="Spin the drum" aria-valuenow={Math.round(spun)} aria-valuemin={0} aria-valuemax={100} tabIndex={phase === 'spin' ? 0 : -1}>
              <div className="knob"><span>SPIN CYCLE</span><span>{Math.round(spun)}%</span></div>
              <div className="door">
                <div className="drum" style={{ transform: `rotate(${reduceMotion() ? 0 : angle}deg)` }}>
                  {pods.map((p, i) => {
                    const a = (i / 3) * Math.PI * 2 + Math.PI / 2
                    return <div key={p} className="sud" style={{ background: byId[p].color, left: `${31 + Math.cos(a) * 26}%`, top: `${44 + Math.sin(a) * 26}%` }}>{byId[p].name}</div>
                  })}
                </div>
              </div>
            </div>
            {phase === 'spin' && (
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <p style={{ fontWeight: 800 }}>Grab the door and spin it in circles.</p>
                <button className="btn acid" onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold} onKeyDown={e => { if (e.key === 'Enter') addSpin(60) }}>Hold to spin (or Space)</button>
              </div>
            )}
          </div>
        </div>
      )}
      {phase === 'release' && (
        <div style={{ marginTop: 20 }}>
          <div className="release">
            <div className="hd">FOR IMMEDIATE RELEASE · {scen.client.toUpperCase()}</div>
            {pods.map(p => <p key={p} style={{ margin: '0 0 8px' }}>{scen.lines[p]}</p>)}
            <p style={{ margin: 0, fontSize: '.85rem' }} className="muted">What actually happened: <s>{scen.fact}</s></p>
          </div>
          <p style={{ fontWeight: 700, marginTop: 14 }}>Squeaky clean. Now switch sides: other flacks are spinning, and you have {ROUND} seconds to name every trick.</p>
          <div className="row"><button className="btn big" onClick={startCatch}>Catch the spin</button></div>
        </div>
      )}
      {phase === 'catch' && (
        <div className={shake ? 'shake' : ''}>
          <div className="hud" style={{ marginBottom: 12 }}>
            <div>Time<b>{left.toFixed(1)}</b></div>
            <div>Score<b>{score}</b></div>
            <div>Combo<b key={bump} className={'combo' + (bump ? ' bump' : '')}>×{combo}</b></div>
            <div>Caught<b>{right}</b></div>
          </div>
          <p className="lab">{cur.s.client} says:</p>
          <div className="catchline" aria-live="polite">{/^[“"]/.test(cur.s.lines[cur.tid]) ? cur.s.lines[cur.tid] : `“${cur.s.lines[cur.tid]}”`}</div>
          <div className="catchgrid">
            {TECH.map((t, i) => <button key={t.id} className="catch" style={{ ['--tc' as string]: t.color }} onClick={() => answer(t.id)}>{t.name}<kbd>{i + 1}</kbd></button>)}
          </div>
        </div>
      )}
      {phase === 'reveal' && (
        <div>
          <div className="hud"><div>Score<b>{score}</b></div><div>Caught<b>{right}/{seen.length}</b></div></div>
          <div className="xray">
            <h3>X-ray</h3>
            <ol>
              {seen.slice(0, 14).map((x, i) => {
                const t = byId[x.tid]; const ok = x.picked === x.tid
                return <li key={i}><span className="tag" style={{ ['--tc' as string]: t.color }}>{t.name}</span>{ok ? '✓' : '✗ you said ' + byId[x.picked!].name}<br />“{x.s.lines[x.tid]}”<br /><span className="muted">{t.hides_line} Ask: {t.ask}</span></li>
              })}
            </ol>
            <p style={{ fontWeight: 700 }}>What actually happened: {[...new Set(seen.map(x => x.s.id))].map(id => SCEN.find(s => s.id === id)!.fact).join(' ')}</p>
          </div>
          <div className="xray">
            <h3>Learn: the eight detergents</h3>
            <ul>{TECH.map(t => <li key={t.id}><span className="tag" style={{ ['--tc' as string]: t.color }}>{t.name}</span>{t.what} <span className="muted">{t.origin}</span></li>)}</ul>
          </div>
          <Spot>calm words standing in for a hard fact, a flag or a famous face doing the arguing, the one good number on top of the pile.</Spot>
          <div className="row" style={{ marginTop: 14 }}><button className="btn big" onClick={again}>Another load</button><button className="btn" onClick={startCatch}>Catch again</button></div>
          <Sources list={SPIN.sources} />
        </div>
      )}
    </Screen>
  )
}
