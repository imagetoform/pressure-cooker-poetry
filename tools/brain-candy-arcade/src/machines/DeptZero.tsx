import { useState } from 'react'
import { addWrapper, JAR_GOAL, sfx, useJar } from '@/lib/store'
import { FILES } from '@/data/blueprints'
import { Screen, Sources } from '@/ui'

const PLAIN = 'NOTHING IS INEVITABLE'
const shift = (s: string, k: number) => s.replace(/[A-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26) % 26) + 65))
const CIPHER = shift(PLAIN, 13)

export default function DeptZero({ onBack }: { onBack: () => void }) {
  const jar = useJar()
  const [peek, setPeek] = useState(false)
  const [k, setK] = useState(0)
  const open = jar.length >= JAR_GOAL || peek
  const text = shift(CIPHER, k)
  const solved = text === PLAIN
  const turn = (n: number) => {
    const next = (n + 26) % 26; setK(next); sfx('tap')
    if (shift(CIPHER, next) === PLAIN) { sfx('unlock'); addWrapper({ id: 'file-001', label: 'File 001', color: '#8cff8c', machine: 'Department Zero' }) }
  }
  return (
    <Screen title="Department Zero" sub="A full jar opens a file. Every file is a real historical code, and every one decodes to a line of what this place believes." color="#8cff8c" step={solved ? 2 : 0} steps={['Play', 'Reveal', 'Learn']}>
      {!open ? (
        <div>
          <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>File 001 is sealed. Your jar holds {jar.length} of {JAR_GOAL} wrappers.</p>
          <p>Wrappers drop when you <b>catch</b> a trick in one of the machines, not when you read about it.</p>
          <div className="row"><button className="btn big" onClick={onBack}>Back to the machines</button><button className="btn ghost" onClick={() => setPeek(true)}>Can’t wait? Open it anyway</button></div>
        </div>
      ) : (
        <div>
          <p className="lab">FILE 001 · THE SHIFT · intercepted message</p>
          <div className={'cipher' + (solved ? ' solved' : '')} aria-live="polite">{text}</div>
          <div className="dial" style={{ marginTop: 14 }}>
            <button className="btn" onClick={() => turn(k - 1)} aria-label="Shift back one letter">◀</button>
            <input type="range" min={0} max={25} value={k} onChange={e => turn(Number(e.target.value))} aria-label="Shift every letter by" />
            <button className="btn" onClick={() => turn(k + 1)} aria-label="Shift forward one letter">▶</button>
          </div>
          <p className="lab" style={{ marginTop: 6 }}>Shift: {k} {k === 0 ? '(as intercepted)' : ''}</p>
          {solved && (
            <div className="xray">
              <h3>Decoded</h3>
              <p>Every letter was moved 13 places down the alphabet. Move it 13 more and you’re back where you started, because the alphabet has 26 letters. That’s ROT13.</p>
              <p><b>Where it comes from.</b> The Roman historian Suetonius says Julius Caesar wrote private letters with every letter shifted three places. ROT13 is the same trick at 13; in the 1980s Usenet groups used it to hide punchlines and spoilers in plain sight.</p>
              <p><b>Why it’s here.</b> A shift cipher only works on people who don’t know there’s a dial. Most of what gets sold as “just the way things are” is the same: a message with the dial hidden.</p>
            </div>
          )}
          <h3 style={{ font: '400 1.6rem Anton', margin: '20px 0 8px', textTransform: 'uppercase' }}>The files</h3>
          <ul className="goals">{FILES.map(f => <li key={f.n} className={f.built && solved ? 'done' : ''}><i>{f.n}</i><span><b>{f.name}.</b> {f.how} {!f.built && <span className="muted">(blueprint)</span>}</span></li>)}</ul>
          <Sources list={[{ title: 'Caesar cipher (Suetonius’ account)', url: 'https://en.wikipedia.org/wiki/Caesar_cipher' }, { title: 'ROT13 and its Usenet history', url: 'https://en.wikipedia.org/wiki/ROT13' }]} />
        </div>
      )}
    </Screen>
  )
}
