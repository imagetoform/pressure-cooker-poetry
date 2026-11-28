import { useState } from 'react'
import { BLUEPRINTS } from '@/data/blueprints'
import { sfx } from '@/lib/store'

export default function Blueprints({ start }: { start?: string }) {
  const [id, setId] = useState(start || BLUEPRINTS[0].id)
  const b = BLUEPRINTS.find(x => x.id === id) || BLUEPRINTS[0]
  return (
    <section className="wrap">
      <h2 style={{ font: '400 clamp(2.2rem,6vw,3.6rem)/1 Anton', margin: '0 0 6px', textTransform: 'uppercase' }}>Blueprints</h2>
      <p style={{ maxWidth: '44rem', fontWeight: 600 }}>Machines on the drawing board. Each one is worked out as Play → Reveal → Learn so it can be built the same way as the four on the floor. Pick one.</p>
      <div className="bplist" role="tablist" aria-label="Blueprints">
        {BLUEPRINTS.map(x => (
          <button key={x.id} role="tab" aria-selected={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => { setId(x.id); sfx('tap') }}>
            <span className="lab">No. {x.num}</span><b>{x.name}</b>{x.tag}
          </button>
        ))}
      </div>
      <article className="bp" role="tabpanel" aria-label={b.name}>
        <span className="lab">MACHINE {b.num} · BLUEPRINT</span>
        <h3>{b.name}</h3>
        <p style={{ fontWeight: 700 }}>{b.tag}</p>
        <h4><span className="k">PLAY</span>the toy</h4>
        <ol>{b.play.map((p, i) => <li key={i}>{p}</li>)}</ol>
        <h4><span className="k">REVEAL</span>the X-ray</h4><p>{b.reveal}</p>
        <h4><span className="k">LEARN</span>the labels</h4><p>{b.learn}</p>
        <h4><span className="k">FEEL</span>sound and motion</h4><p>{b.feel}</p>
        <h4><span className="k">JAR</span>what drops a wrapper</h4><p>{b.wrappers}</p>
        {b.risk && <><h4><span className="k">WATCH OUT</span></h4><p>{b.risk}</p></>}
      </article>
    </section>
  )
}
