import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export function Screen({ title, sub, color, step, steps, children }: { title: string; sub: string; color: string; step: number; steps: string[]; children: ReactNode }) {
  return (
    <section className="screen" style={{ ['--c' as string]: color }}>
      <header className="screen-h">
        <div><h2>{title}</h2><p>{sub}</p></div>
        <div className="steps" aria-label="Play, reveal, learn">
          {steps.map((s, i) => <span key={s} className={i === step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>{s}</span>)}
        </div>
      </header>
      <div className="body">{children}</div>
    </section>
  )
}

export function Sources({ list }: { list: { title: string; url: string }[] }) {
  return (
    <details className="sources" style={{ marginTop: 16 }}>
      <summary className="lab" style={{ minHeight: 44, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>Sources</summary>
      <ul>{list.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.title}</a></li>)}</ul>
    </details>
  )
}

export function Spot({ children }: { children: ReactNode }) {
  return <p className="spot"><b>Now you can spot it:</b> {children} Including when it’s us doing it.</p>
}

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const t = useRef<number>(0)
  const show = useCallback((m: string) => { setMsg(m); clearTimeout(t.current); t.current = window.setTimeout(() => setMsg(null), 2200) }, [])
  const node = msg ? <div className="toast" role="status">{msg}</div> : null
  return [show, node] as const
}

/* A countdown that ticks every 100 ms while running. */
export function useClock(seconds: number, running: boolean, onEnd: () => void) {
  const [left, setLeft] = useState(seconds)
  const end = useRef(onEnd); end.current = onEnd
  useEffect(() => { if (!running) return; const id = setInterval(() => setLeft(l => { const n = +(l - 0.1).toFixed(1); if (n <= 0) { clearInterval(id); end.current(); return 0 } return n }), 100); return () => clearInterval(id) }, [running])
  return [left, setLeft] as const
}

export function Meter({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div>
      <div className="lab" style={{ display: 'flex', justifyContent: 'space-between' }}><span>{label}</span><span>{Math.round(value)}%</span></div>
      <div className="meter" style={{ ['--mc' as string]: color }} role="meter" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: Math.min(100, value) + '%' }} /></div>
    </div>
  )
}
