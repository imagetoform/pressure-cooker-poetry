import { useEffect, useState } from 'react'
import { JAR_GOAL, resetJar, setMuted, sfx, useJar, useMuted } from '@/lib/store'
import { BLUEPRINTS } from '@/data/blueprints'
import SpinCycle from '@/machines/SpinCycle'
import Soft from '@/machines/Soft'
import BiasFactory from '@/machines/BiasFactory'
import CutupBench from '@/machines/CutupBench'
import DeptZero from '@/machines/DeptZero'
import Blueprints from '@/machines/Blueprints'
import { fatChiselMarker as marker } from '@/assets/tools'
import { precisionKnife as knife } from '@/assets/tools'
import { schoolGlue as glue } from '@/assets/tools'

const ROUTES = ['spin-cycle', 'soft', 'bias-factory', 'cutup-bench', 'department-zero', 'blueprints'] as const
type Route = typeof ROUTES[number] | ''
const readHash = (): Route => { const h = location.hash.slice(1); return (ROUTES as readonly string[]).includes(h) ? (h as Route) : '' }

const MACHINES = [
  { id: 'spin-cycle', num: '01', name: 'The Spin Cycle', tag: 'Wash a dirty fact clean. Then catch everyone else doing it, against the clock.', cls: 'blue', state: 'Revised', art: 'spin' },
  { id: 'soft', num: '02', name: 'S.O.F.T.', tag: 'The euphemism elevator. Ride a hard word up until it stops hurting.', cls: 'pink', state: 'New', art: 'soft' },
  { id: 'bias-factory', num: '03', name: 'Bias Factory', tag: 'A rigged conveyor belt of guesses, and the bombers that came home.', cls: 'orange', state: 'New', art: 'bias' },
  { id: 'cutup-bench', num: '04', name: 'Cut-Up Bench', tag: 'Knife, glue stick, marker, Wite-Out. Take a poem or a speech apart and put it back wrong.', cls: 'paper', state: 'Revised', art: 'bench' },
] as const

function CabArt({ kind }: { kind: string }) {
  if (kind === 'spin') return <svg viewBox="0 0 200 92" width="100%" height="92" aria-hidden="true"><rect x="60" y="2" width="88" height="88" rx="10" fill="#e9eef2" stroke="#000" strokeWidth="3" /><circle cx="104" cy="50" r="30" fill="#5f88b5" stroke="#9aa7b1" strokeWidth="7" /><rect x="88" y="36" width="24" height="12" fill="#ffd23f" stroke="#000" strokeWidth="2" transform="rotate(-20 100 42)" /><rect x="98" y="54" width="22" height="11" fill="#ff5a4e" stroke="#000" strokeWidth="2" transform="rotate(30 109 60)" /></svg>
  if (kind === 'soft') return <svg viewBox="0 0 200 92" width="100%" height="92" aria-hidden="true">{[0, 1, 2, 3].map(i => <rect key={i} x={20 + i * 40} y={70 - i * 20} width="40" height={20 + i * 20} fill={i % 2 ? '#fff' : '#ffd0de'} stroke="#000" strokeWidth="3" />)}<text x="178" y="20" fontFamily="Anton" fontSize="22">▲</text></svg>
  if (kind === 'bias') return <svg viewBox="0 0 200 92" width="100%" height="92" aria-hidden="true"><rect x="4" y="60" width="192" height="22" fill="#333" stroke="#000" strokeWidth="3" />{[0, 1, 2, 3, 4, 5, 6, 7].map(i => <rect key={i} x={8 + i * 24} y="64" width="12" height="14" fill="#555" />)}<rect x="66" y="16" width="70" height="44" fill="#e7c27d" stroke="#000" strokeWidth="3" /><text x="101" y="49" textAnchor="middle" fontFamily="Anton" fontSize="26">65</text></svg>
  return <div style={{ position: 'relative', height: 92 }} aria-hidden="true"><img src={marker} alt="" style={{ position: 'absolute', left: 0, top: -4, height: 96, transform: 'rotate(-8deg)' }} /><img src={knife} alt="" style={{ position: 'absolute', left: 90, top: 0, height: 92 }} /><img src={glue} alt="" style={{ position: 'absolute', right: 6, top: 0, height: 88, transform: 'rotate(10deg)' }} /></div>
}

export default function App() {
  const [route, setRoute] = useState<Route>(readHash)
  const jar = useJar()
  const muted = useMuted()
  const [bpStart, setBpStart] = useState<string | undefined>()
  useEffect(() => { const f = () => { setRoute(readHash()); window.scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const go = (r: Route) => { sfx('tap'); if (r) location.hash = r; else { history.pushState(null, '', location.pathname + location.search); setRoute(''); window.scrollTo(0, 0) } }

  return (
    <>
      <header className="bar">
        <a className="logo" href="#" onClick={e => { e.preventDefault(); go('') }}>BRAIN CANDY <small>Pressure Cooker Poetry · the arcade</small></a>
        <span className="grow" />
        <button className="chip jarchip" onClick={() => go('department-zero')} aria-label={`Wrapper jar: ${jar.length} of ${JAR_GOAL}`}>Jar <b>{jar.length >= JAR_GOAL ? jar.length + ' · full' : jar.length + '/' + JAR_GOAL}</b></button>
        <button className="chip" onClick={() => setMuted(!muted)} aria-pressed={!muted}>{muted ? 'Sound off' : 'Sound on'}</button>
      </header>
      {route === '' && (
        <main>
          <section className="band"><div className="wrap">
            <div className="marquee">
              <h1>Brain<span>Candy</span></h1>
              <div>
                <p>Every machine in here does a trick <b>to</b> you, then opens itself up so you can see the gears. The tricks are real. The companies are made up. The jokes point up.</p>
                <div className="rule3"><span style={{ ['--r' as string]: '-2deg' }}>1 · Play the trick</span><span style={{ ['--r' as string]: '1deg' }}>2 · X-ray it</span><span style={{ ['--r' as string]: '-1deg' }}>3 · Learn its name</span></div>
              </div>
            </div>
            <div className="sheet">
              {MACHINES.map(m => (
                <button key={m.id} className={'cab ' + m.cls} onClick={() => go(m.id)}>
                  <div className="crimp" /><span className="num">{m.num}</span>
                  <h3>{m.name}</h3><div className="art"><CabArt kind={m.art} /></div><p>{m.tag}</p>
                  <div className="foot"><span>{m.state}</span><span>Play ▸</span></div>
                </button>
              ))}
              {BLUEPRINTS.slice(0, 2).map(b => (
                <button key={b.id} className="cab blueprint" onClick={() => { setBpStart(b.id); go('blueprints') }}>
                  <div className="crimp" /><span className="num">{b.num}</span>
                  <h3>{b.name}</h3><p style={{ marginTop: 10 }}>{b.tag}</p>
                  <div className="foot"><span>Blueprint</span><span>Read ▸</span></div>
                </button>
              ))}
            </div>
            <div className="row" style={{ marginTop: 16 }}><button className="btn acid" onClick={() => { setBpStart(undefined); go('blueprints') }}>All {BLUEPRINTS.length} blueprints</button></div>
          </div></section>
          <section className="band" style={{ background: 'var(--red-deep)' }}><div className="wrap jarband">
            <div className="jar" aria-hidden="true">
              <div className="lvl" style={{ height: Math.min(100, jar.length / JAR_GOAL * 100) + '%' }} />
              {jar.map((w, i) => <span key={w.id} className="w" style={{ ['--wc' as string]: w.color, left: 12 + ((i * 53) % 160), bottom: 8 + Math.floor(i / 4) * 20, rotate: ((i * 37) % 50 - 25) + 'deg' }} />)}
            </div>
            <div>
              <h2>The wrapper jar</h2>
              <p>Catch a trick in any machine and its wrapper drops in here. Fill the jar ({JAR_GOAL}) to open <b>Department Zero</b>: real historical codes, each hiding a line of what this place believes.</p>
              <div className="wlist">{jar.length ? jar.map(w => <span key={w.id} style={{ ['--wc' as string]: w.color }}>{w.label}</span>) : <span style={{ ['--wc' as string]: '#fff' }}>Empty. Go catch something.</span>}</div>
              <div className="row"><button className="btn acid" onClick={() => go('department-zero')}>{jar.length >= JAR_GOAL ? 'Open File 001' : 'Department Zero'}</button>{jar.length > 0 && <button className="btn ghost" style={{ color: '#fff', borderColor: '#fff' }} onClick={resetJar}>Empty the jar</button>}</div>
              <p style={{ fontSize: '.85rem', opacity: .85, marginTop: 10 }}>The jar lives only in this browser. No account, no tracking.</p>
            </div>
          </div></section>
          <section className="band"><div className="wrap" style={{ maxWidth: 820 }}>
            <p style={{ fontSize: '.9rem' }}><b>Still being built.</b> Four machines are open and Department Zero File 001 is waiting for a full jar. The rest are blueprints: they open when they’re ready, not before. Sound is made live in your browser and can be switched off up top. Reduced-motion settings are respected.</p>
          </div></section>
        </main>
      )}
      {route !== '' && (
        <main className="band">
          <div className="wrap" style={{ marginBottom: 14 }}><button className="chip" onClick={() => go('')}>◂ All machines</button></div>
          {route === 'spin-cycle' && <SpinCycle />}
          {route === 'soft' && <Soft />}
          {route === 'bias-factory' && <BiasFactory />}
          {route === 'cutup-bench' && <CutupBench />}
          {route === 'department-zero' && <DeptZero onBack={() => go('')} />}
          {route === 'blueprints' && <Blueprints start={bpStart} />}
        </main>
      )}
    </>
  )
}
