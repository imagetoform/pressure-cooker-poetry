import { useEffect, useMemo, useRef, useState } from 'react'
import { SOURCES, type Source } from '@/data/bench'
import { SPEECHES } from '@/data/speeches'
import { addWrapper, sfx, reduceMotion } from '@/lib/store'
import { Screen, Spot, Sources, useToast } from '@/ui'
import { fatChiselMarker as marker, precisionKnife as knife, whiteoutBrushSet as whiteout, glueStick as gluestick } from '@/assets/tools'

/* ---------- tools: the kit's art, tip pivots from its manifest.json ---------- */
type ToolId = 'hand' | 'marker' | 'whiteout' | 'knife' | 'gluestick'
type Tool = { id: ToolId; name: string; key: string; img?: string; w: number; h: number; px: number; py: number; flip?: boolean; does: string }
const TOOLS: Tool[] = [
  { id: 'hand', name: 'Hand', key: 'H', w: 1, h: 1, px: 0, py: 0, does: 'Grab any cut piece and drag it anywhere on the table.' },
  { id: 'knife', name: 'Knife', key: 'K', img: knife, w: 274, h: 320, px: 0.012, py: 0.98, does: 'Tap a word to cut it out, or drag across a line to cut a strip. Tap a loose piece to cut it again; tap the middle of a word to split it.' },
  { id: 'gluestick', name: 'Glue stick', key: 'S', img: gluestick, w: 185, h: 320, px: 0.72, py: 0.015, flip: true, does: 'Tap one piece, then another: the second sticks onto the end of the first. Glue two half-words to make a new one.' },
  { id: 'marker', name: 'Marker', key: 'M', img: marker, w: 320, h: 296, px: 0.03, py: 0.975, does: 'Drag across words to black them out.' },
  { id: 'whiteout', name: 'Wite-Out', key: 'W', img: whiteout, w: 263, h: 320, px: 0.88, py: 0.23, does: 'Drag across words to paint them out to nothing.' },
]

/* ---------- the writing ---------- */
type Writing = { id: string; kind: 'poem' | 'essay'; title: string; book: string; url: string; text: string }
let writingP: Promise<Writing[]> | null = null
const loadWriting = (): Promise<Writing[]> => (writingP ||= fetch('/brain-candy/writing.json').then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() }).catch(() => []))
type Page = { key: string; title: string; head: string; credit: string; font: string; size: number; lh: number; text: string; url?: string }
const fromSource = (s: Source, group: string): Page => ({ key: group + ':' + s.id, title: s.name, head: s.head, credit: s.credit, font: s.font, size: s.size, lh: s.lh, text: s.text })
const fromWriting = (w: Writing): Page => w.kind === 'poem'
  ? { key: 'site:' + w.id, title: w.title, head: (w.book + ' · ' + w.title).toUpperCase(), credit: 'From My Two Cents. The original stays whole at ' + w.url, font: 'IM Fell English', size: 19, lh: 1.5, text: w.text, url: w.url }
  : { key: 'site:' + w.id, title: w.title, head: ('ESSAY · ' + w.title).toUpperCase(), credit: 'From My Two Cents. The original, with its sources, stays whole at ' + w.url, font: 'Archivo', size: 17, lh: 1.6, text: w.text, url: w.url }

type Line = { words: string[]; gap: boolean }
const toLines = (text: string): Line[] => { const out: Line[] = []; let gap = false; text.split('\n').forEach(l => { const w = l.split(/\s+/).filter(Boolean); if (!w.length) { gap = true; return } out.push({ words: w, gap }); gap = false }); return out }
const chunk = (ws: string[], n: number) => { const out: string[][] = []; for (let i = 0; i < ws.length; i += n) out.push(ws.slice(i, i + n)); return out }
const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}']/gu, '')
const MAX_WORDS = 1500

type Mark = 'black' | 'white' | 'cut'
type Scrap = { id: number; text: string; x: number; y: number; half: boolean; rot: number }
type Snap = { lines: Line[]; marks: Record<number, Mark>; scraps: Scrap[] }

export default function CutupBench() {
  const [writing, setWriting] = useState<Writing[] | null>(null)
  const [page, setPage] = useState<Page>(() => fromSource(SOURCES[0], 'classic'))
  const [lines, setLines] = useState<Line[]>(() => toLines(SOURCES[0].text))
  const [marks, setMarks] = useState<Record<number, Mark>>({})
  const [scraps, setScraps] = useState<Scrap[]>([])
  const [hist, setHist] = useState<Snap[]>([])
  const [tool, setTool] = useState<ToolId>('knife')
  const [sel, setSel] = useState<number | null>(null)
  const [hidePage, setHidePage] = useState(false)
  const [flags, setFlags] = useState<Record<string, number>>({})
  const [panel, setPanel] = useState<'' | 'own' | 'link'>('')
  const [own, setOwn] = useState('')
  const [link, setLink] = useState('')
  const [linkMsg, setLinkMsg] = useState('')
  const [caret, setCaret] = useState(0)
  const [kbd, setKbd] = useState(false)
  const [slash, setSlash] = useState('')
  const [toast, toastNode] = useToast()
  const nextId = useRef(1)
  const mat = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const act = useRef<null | { kind: 'paint'; last: { x: number; y: number } } | { kind: 'drag'; id: number; dx: number; dy: number; moved: boolean } | { kind: 'knife'; pts: { x: number; y: number }[]; hits: number[]; start: { i: number; rel: number } | null }>(null)

  const words = useMemo(() => lines.flatMap(l => l.words), [lines])
  const offsets = useMemo(() => { let n = 0; return lines.map(l => { const o = n; n += l.words.length; return o }) }, [lines])
  const sourceWords = useMemo(() => new Set(words.map(clean)), [words])
  const flag = (k: string, n = 1) => setFlags(f => ({ ...f, [k]: (f[k] || 0) + n }))

  /* ---------- loading pages ---------- */
  useEffect(() => { loadWriting().then(w => { setWriting(w); if (w.length) { const poems = w.filter(x => x.kind === 'poem'); open(fromWriting(poems[Math.floor(Math.random() * poems.length)] || w[0]), false) } }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const snap = () => setHist(h => [...h.slice(-40), { lines, marks, scraps }])
  const undo = () => { const last = hist[hist.length - 1]; if (!last) return; setLines(last.lines); setMarks(last.marks); setScraps(last.scraps); setHist(h => h.slice(0, -1)); sfx('tap') }
  function open(p: Page, keep = true) {
    if (keep) snap()
    const all = p.text.split(/\s+/).filter(Boolean).length
    let text = p.text
    if (all > MAX_WORDS) { const out: string[] = []; let n = 0; for (const l of p.text.split('\n')) { const c = l.split(/\s+/).filter(Boolean).length; if (n + c > MAX_WORDS && n > 0) break; out.push(l); n += c } text = out.join('\n') }
    setPage({ ...p, text }); setLines(toLines(text)); setMarks({}); setCaret(0); setHidePage(false)
    if (all > MAX_WORDS) toast('Long page: the bench took the first ' + MAX_WORDS + ' words or so.')
  }
  const options = useMemo(() => {
    const groups: { label: string; items: Page[] }[] = []
    if (writing?.length) {
      const books = [...new Set(writing.filter(w => w.kind === 'poem').map(w => w.book))]
      books.forEach(b => groups.push({ label: 'My Two Cents · ' + b, items: writing.filter(w => w.kind === 'poem' && w.book === b).map(fromWriting) }))
      groups.push({ label: 'My Two Cents · Essays', items: writing.filter(w => w.kind === 'essay').map(fromWriting) })
    }
    groups.push({ label: 'Public-domain speeches', items: SPEECHES.map(s => fromSource(s, 'speech')) })
    groups.push({ label: 'Bench classics', items: SOURCES.map(s => fromSource(s, 'classic')) })
    return groups
  }, [writing])
  const allPages = options.flatMap(g => g.items)
  const pick = (key: string) => { if (key === 'own' || key === 'link') { setPanel(key); return } setPanel(''); const p = allPages.find(x => x.key === key); if (p) { open(p); sfx('tap') } }
  const randomPoem = () => { const ps = allPages.filter(p => p.key.startsWith('site:') && p.font === 'IM Fell English'); const pool = ps.length ? ps : allPages; open(pool[Math.floor(Math.random() * pool.length)]); sfx('spin') }

  /* ---------- pull text from a link ---------- */
  const htmlToText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    doc.querySelectorAll('script,style,nav,header,footer,noscript,sup.reference,.mw-editsection,.reflist,table,figure').forEach(n => n.remove())
    const root = doc.querySelector('article.reading .poem-body, article.reading, .mw-parser-output, article, main') || doc.body
    const blocks = [...root.querySelectorAll('p, li, h2, h3, blockquote, .line')].filter(b => !b.closest('.receipts'))
    const text = (blocks.length ? blocks.map(b => (b as HTMLElement).innerText || b.textContent || '') : [root.textContent || '']).map(t => t.replace(/[ \t]+/g, ' ').trim()).filter(Boolean).join('\n\n')
    return { text, title: (doc.querySelector('h1')?.textContent || doc.title || 'A page from the web').trim() }
  }
  const pull = async () => {
    let url: URL
    try { url = new URL(link.trim(), location.href) } catch { setLinkMsg('That doesn’t look like a link.'); return }
    setLinkMsg('Pulling the page…')
    try {
      let html = ''
      if (url.origin === location.origin || /(^|\.)pressurecookerpoetry\.com$/.test(url.hostname)) {
        html = await (await fetch(url.origin === location.origin ? url.pathname : url.href)).text()
      } else if (/\.(wikisource|wikipedia)\.org$/.test(url.hostname) && url.pathname.startsWith('/wiki/')) {
        const api = `${url.origin}/w/api.php?action=parse&page=${encodeURIComponent(decodeURIComponent(url.pathname.slice(6)))}&prop=text&format=json&origin=*&redirects=1`
        const j = await (await fetch(api)).json(); html = j?.parse?.text?.['*'] || ''
      } else {
        html = await (await fetch(url.href)).text()
      }
      const { text, title } = htmlToText(html)
      if (text.split(/\s+/).length < 5) throw new Error('empty')
      open({ key: 'link:' + url.href, title, head: (url.hostname + ' · ' + title).toUpperCase().slice(0, 90), credit: 'Pulled from ' + url.href + '. Check that page for its author and licence.', font: 'IM Fell English', size: 18, lh: 1.5, text })
      setLinkMsg(''); setPanel(''); sfx('good')
    } catch {
      setLinkMsg('That site won’t hand its page to other sites (most don’t). Open it, copy the text you want, and paste it into “Your own words”. Links from this site and from Wikipedia or Wikisource pull straight in.')
      sfx('bad')
    }
  }

  /* ---------- geometry ---------- */
  const matXY = (x: number, y: number) => { const b = mat.current!.getBoundingClientRect(); return { x: x - b.left, y: y - b.top } }
  const wordAt = (x: number, y: number) => { const el = document.elementFromPoint(x, y)?.closest('[data-i]') as HTMLElement | null; return el ? { i: Number(el.dataset.i), el } : null }
  const sample = (from: { x: number; y: number }, to: { x: number; y: number }) => { const out = new Set<number>(); const dx = to.x - from.x, dy = to.y - from.y, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 5)); for (let s = 0; s <= n; s++) { const h = wordAt(from.x + dx * s / n, from.y + dy * s / n); if (h) out.add(h.i) } return out }
  const rot = (id: number) => (((id * 7919) % 9) - 4) * 0.8
  /* every new piece steps down until it lies clear of the others, so nothing new hides under (or over) an old one */
  const wide = (t: string) => Math.max(44, t.length * Math.min(page.size, 19) * 0.5 + 24)
  const clear = (others: Scrap[], s: Scrap): Scrap => { let y = s.y; for (let n = 0; n < 12 && others.some(o => s.x < o.x + wide(o.text) && o.x < s.x + wide(s.text) && Math.abs(o.y - y) < 32); n++) y += 36; return { ...s, y } }

  const lift = (texts: string[], half: boolean, at: DOMRect) => {
    const p = matXY(at.left, at.top)
    setScraps(list => {
      const placed = [...list]
      texts.forEach((text, k) => { const id = nextId.current++; placed.push(clear(placed, { id, text, x: Math.max(0, p.x + k * (at.width / Math.max(1, texts.length)) + 6 + k * 10), y: Math.max(0, p.y - 16), half, rot: rot(id) })) })
      return placed
    })
  }

  /* ---------- knife ---------- */
  const cutWord = (i: number, rel: number, el: HTMLElement) => {
    if (marks[i] === 'cut') return
    snap(); const w = words[i], r = el.getBoundingClientRect()
    if (w.length >= 4 && rel > 0.25 && rel < 0.75) { const k = Math.min(w.length - 1, Math.max(1, Math.round(rel * w.length))); lift([w.slice(0, k), w.slice(k)], true, r) }
    else lift([w], false, r)
    setMarks(m => ({ ...m, [i]: 'cut' })); sfx('cut'); flag('cuts')
  }
  const cutStrip = (ids: number[]) => {
    const lo = Math.min(...ids), hi = Math.min(Math.max(...ids), lo + 40)
    const range: number[] = []; for (let i = lo; i <= hi; i++) if (marks[i] !== 'cut') range.push(i)
    if (!range.length) return
    snap()
    const first = document.querySelector(`[data-i="${range[0]}"]`) as HTMLElement | null
    lift([range.map(i => words[i]).join(' ')], false, first ? first.getBoundingClientRect() : mat.current!.getBoundingClientRect())
    setMarks(m => { const n = { ...m }; range.forEach(i => (n[i] = 'cut')); return n }); sfx('cut'); flag('cuts'); if (range.length >= 3) flag('strip')
  }
  const cutScrap = (s: Scrap, rel: number) => {
    const t = s.text
    let a: string, b: string, half = s.half
    if (/\s/.test(t)) {
      const target = Math.round(rel * t.length); const spaces = [...t.matchAll(/\s+/g)].map(m => m.index!)
      const at = spaces.reduce((best, x) => Math.abs(x - target) < Math.abs(best - target) ? x : best, spaces[0])
      a = t.slice(0, at).trim(); b = t.slice(at).trim()
    } else {
      if (t.length < 2) return
      const k = Math.min(t.length - 1, Math.max(1, Math.round(rel * t.length))); a = t.slice(0, k); b = t.slice(k); half = true
    }
    snap()
    const id1 = nextId.current++, id2 = nextId.current++
    setScraps(list => { const rest = list.filter(x => x.id !== s.id); const p1 = clear(rest, { id: id1, text: a, x: Math.max(0, s.x - 6), y: s.y, half, rot: rot(id1) }); const p2 = clear([...rest, p1], { id: id2, text: b, x: s.x + wide(a) + 8, y: s.y + 6, half, rot: rot(id2) }); return [...rest, p1, p2] })
    sfx('cut'); flag('cuts')
  }

  /* ---------- glue stick ---------- */
  const glueTap = (s: Scrap) => {
    if (sel === null) { setSel(s.id); sfx('tap'); return }
    if (sel === s.id) { setSel(null); return }
    const a = scraps.find(x => x.id === sel); if (!a) { setSel(null); return }
    snap()
    const join = a.half || s.half
    const text = join ? a.text.replace(/[^\p{L}'’]+$/u, '') + s.text.replace(/^[^\p{L}'’]+/u, '') : a.text + ' ' + s.text
    const id = nextId.current++
    setScraps(list => { const rest = list.filter(x => x.id !== a.id && x.id !== s.id); return [...rest, clear(rest, { id, text, x: a.x, y: a.y, half: false, rot: rot(id) })] }); setSel(null); sfx('glue')
    if (join && !/\s/.test(text) && clean(text).length >= 3 && !sourceWords.has(clean(text))) { flag('coinage'); toast('New word coined: ' + text) }
  }

  /* ---------- one pointer handler for the whole table ---------- */
  const scrapOf = (t: EventTarget) => { const el = (t as HTMLElement).closest('[data-scrap]') as HTMLElement | null; return el ? { s: scraps.find(x => x.id === Number(el.dataset.scrap))!, el } : null }
  const onDown = (e: React.PointerEvent) => {
    setKbd(false)
    const hit = scrapOf(e.target)
    if (hit) {
      e.preventDefault()
      if (tool === 'knife') { const r = hit.el.getBoundingClientRect(); cutScrap(hit.s, (e.clientX - r.left) / r.width); return }
      if (tool === 'gluestick') { glueTap(hit.s); return }
      const p = matXY(e.clientX, e.clientY)
      snap(); act.current = { kind: 'drag', id: hit.s.id, dx: p.x - hit.s.x, dy: p.y - hit.s.y, moved: false }
      mat.current!.setPointerCapture(e.pointerId); sfx('tap'); return
    }
    if (tool === 'marker' || tool === 'whiteout') {
      snap(); act.current = { kind: 'paint', last: { x: e.clientX, y: e.clientY } }; mat.current!.setPointerCapture(e.pointerId)
      const w = wordAt(e.clientX, e.clientY); if (w) paint([w.i]); sfx('marker')
    } else if (tool === 'knife') {
      const w = wordAt(e.clientX, e.clientY)
      act.current = { kind: 'knife', pts: [{ x: e.clientX, y: e.clientY }], hits: w ? [w.i] : [], start: w ? { i: w.i, rel: (e.clientX - w.el.getBoundingClientRect().left) / w.el.getBoundingClientRect().width } : null }
      mat.current!.setPointerCapture(e.pointerId)
    }
  }
  const paint = (ids: Iterable<number>) => { const kind = tool === 'marker' ? 'black' : 'white'; setMarks(m => { const n = { ...m }; for (const i of ids) if (n[i] !== 'cut') n[i] = kind; return n }) }
  const onMove = (e: React.PointerEvent) => {
    const a = act.current; if (!a) return
    if (a.kind === 'drag') {
      const p = matXY(e.clientX, e.clientY), b = mat.current!.getBoundingClientRect()
      a.moved = true
      /* near the top or bottom of the screen, scroll so a piece can travel the whole table */
      const edge = 70; if (e.clientY > innerHeight - edge) scrollBy(0, 14); else if (e.clientY < edge) scrollBy(0, -14)
      setScraps(list => list.map(s => s.id === a.id ? { ...s, x: Math.max(0, Math.min(b.width - 40, p.x - a.dx)), y: Math.max(0, Math.min(b.height - 30, p.y - a.dy)) } : s))
    } else if (a.kind === 'paint') {
      paint(sample(a.last, { x: e.clientX, y: e.clientY })); a.last = { x: e.clientX, y: e.clientY }
    } else if (a.kind === 'knife') {
      const last = a.pts[a.pts.length - 1]; sample(last, { x: e.clientX, y: e.clientY }).forEach(i => a.hits.push(i)); a.pts.push({ x: e.clientX, y: e.clientY })
      const b = mat.current!.getBoundingClientRect(); setSlash(a.pts.map((p, k) => (k ? 'L' : 'M') + (p.x - b.left).toFixed(0) + ' ' + (p.y - b.top).toFixed(0)).join(' '))
    }
  }
  const onUp = () => {
    const a = act.current; act.current = null
    if (!a) return
    if (a.kind === 'drag') { if (a.moved) { flag('moves'); sfx('glue') } else setHist(h => h.slice(0, -1)) }
    if (a.kind === 'knife') {
      const travel = a.pts.length > 1 ? Math.hypot(a.pts[a.pts.length - 1].x - a.pts[0].x, a.pts[a.pts.length - 1].y - a.pts[0].y) : 0
      if (travel < 10 && a.start) { const el = document.querySelector(`[data-i="${a.start.i}"]`) as HTMLElement; if (el) cutWord(a.start.i, a.start.rel, el) }
      else if (a.hits.length) cutStrip([...new Set(a.hits)])
      setTimeout(() => setSlash(''), reduceMotion() ? 0 : 260)
    }
  }

  /* ---------- keyboard ---------- */
  const onPageKey = (e: React.KeyboardEvent) => {
    setKbd(true)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setCaret(c => Math.min(words.length - 1, c + 1)) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setCaret(c => Math.max(0, c - 1)) }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); const el = document.querySelector(`[data-i="${caret}"]`) as HTMLElement | null
      if (tool === 'marker' || tool === 'whiteout') { snap(); paint([caret]); sfx('marker'); setCaret(c => Math.min(words.length - 1, c + 1)) }
      if (tool === 'knife' && el) cutWord(caret, 0, el)
    }
  }
  const onScrapKey = (e: React.KeyboardEvent, s: Scrap) => {
    const d: Record<string, [number, number]> = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }
    if (d[e.key]) { e.preventDefault(); setScraps(l => l.map(x => x.id === s.id ? { ...x, x: Math.max(0, x.x + d[e.key][0]), y: Math.max(0, x.y + d[e.key][1]) } : x)); flag('moves') }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (tool === 'knife') cutScrap(s, 0.5); else if (tool === 'gluestick') glueTap(s) }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); snap(); setScraps(l => l.filter(x => x.id !== s.id)) }
  }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select,textarea')) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = TOOLS.find(t => t.key === e.key.toUpperCase()); if (t) { setTool(t.id); setSel(null); sfx('tap') }
      if (e.key === 'Escape') { setTool('hand'); setSel(null) }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  })

  /* ---------- machines on the bench ---------- */
  const burroughs = () => {
    const lines9 = chunk(words.filter((_, i) => marks[i] !== 'cut'), 9)
    const half = Math.ceil(lines9.length / 2), top = lines9.slice(0, half), bottom = lines9.slice(half)
    const L = (l: string[]) => l.slice(0, Math.ceil(l.length / 2)), R = (l: string[]) => l.slice(Math.ceil(l.length / 2))
    const out: string[][] = []
    top.forEach((l, i) => out.push([...L(l), ...R(bottom[i] || [])]))   // section 1 with section 4
    top.forEach((l, i) => out.push([...R(l), ...L(bottom[i] || [])]))   // section 2 with section 3
    snap(); setLines(out.map(w => ({ words: w, gap: false }))); setMarks({}); sfx('cut'); flag('burroughs')
    toast('Cut in four. Four goes with one, two with three.')
  }
  const foldIn = () => {
    const others = allPages.filter(p => p.key !== page.key); const other = others[Math.floor(Math.random() * others.length)]
    const a = chunk(words, 10), b = chunk(other.text.split(/\s+/).filter(Boolean), 10), n = Math.min(a.length, b.length)
    const out: Line[] = []; for (let i = 0; i < n; i++) out.push({ words: [...a[i].slice(0, 5), ...b[i].slice(5)], gap: false })
    snap(); setLines(out); setMarks({}); sfx('glue'); flag('foldin'); toast('Folded into ' + other.title)
  }

  /* ---------- goals ---------- */
  const counts = useMemo(() => { const c = { black: 0, white: 0, cut: 0 }; Object.values(marks).forEach(m => c[m]++); return c }, [marks])
  const visible = words.length - counts.black - counts.white - counts.cut
  const GOALS = [
    { id: 'cutup', name: 'Cut-up', text: 'Cut at least 5 pieces loose and drag them into an order of your own.', done: (flags.cuts || 0) >= 5 && (flags.moves || 0) >= 3, color: '#e9e2d0' },
    { id: 'strip', name: 'Strip', text: 'Drag the knife across a line to cut a strip of 3 or more words.', done: !!flags.strip, color: '#d9d4c4' },
    { id: 'coinage', name: 'Coinage', text: 'Split two words in half and glue halves into a word that isn’t on the page.', done: !!flags.coinage, color: '#fff3b8' },
    { id: 'blackout', name: 'Blackout', text: 'Black out the page until only a few words are left standing.', done: counts.black >= 8 && visible >= 3 && visible <= Math.max(12, words.length * 0.25), color: '#141214' },
    { id: 'erasure', name: 'Erasure', text: 'Paint out at least 60% of the page with Wite-Out.', done: counts.white >= words.length * 0.6, color: '#ffffff' },
    { id: 'burroughs', name: 'Burroughs ×4', text: 'Run the page through Burroughs ×4.', done: !!flags.burroughs, color: '#9fd8ff' },
    { id: 'foldin', name: 'Fold-in', text: 'Fold this page into another one.', done: !!flags.foldin, color: '#c86bff' },
  ]
  const doneKey = GOALS.filter(g => g.done).map(g => g.id).join(',')
  useEffect(() => { GOALS.filter(g => g.done).forEach(g => { if (addWrapper({ id: 'bench-' + g.id, label: g.name, color: g.color, machine: 'Cut-Up Bench' })) toast('Wrapper: ' + g.name) }) }, [doneKey]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- the tool that follows your hand ---------- */
  const T = TOOLS.find(t => t.id === tool)!
  useEffect(() => {
    const el = overlay.current; if (!el) return
    if (!T.img) { el.style.opacity = '0'; return }
    const H = window.innerWidth < 760 ? 92 : 128, W = H * T.w / T.h
    el.style.width = W + 'px'; el.style.height = H + 'px'
    let lx = 0, down = false, shown = false
    const place = (x: number, y: number) => {
      const tilt = reduceMotion() ? 0 : Math.max(-14, Math.min(14, (x - lx) * 0.6)); lx = x
      el.style.transformOrigin = `${T.px * 100}% ${T.py * 100}%`
      el.style.transform = `translate(${x - T.px * W}px, ${y - T.py * H - (down ? 0 : 24)}px) rotate(${(T.flip ? 180 : 0) + tilt}deg)`
    }
    const inside = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest?.('.mat')
    const move = (e: PointerEvent) => { const ok = inside(e.target) || down; if (ok !== shown) { shown = ok; el.style.opacity = ok ? '1' : '0' } if (ok) place(e.clientX, e.clientY) }
    const dn = (e: PointerEvent) => { if (!inside(e.target)) return; down = true; el.classList.add('down'); shown = true; el.style.opacity = '1'; place(e.clientX, e.clientY) }
    const up = (e: PointerEvent) => { down = false; el.classList.remove('down'); place(e.clientX, e.clientY); if (e.pointerType === 'touch') { shown = false; el.style.opacity = '0' } }
    window.addEventListener('pointermove', move); window.addEventListener('pointerdown', dn); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up)
    el.style.opacity = '0'
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', dn); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up) }
  }, [T])

  /* ---------- what you made ---------- */
  const arranged = useMemo(() => {
    const rows: Scrap[][] = []
    ;[...scraps].sort((a, b) => a.y - b.y).forEach(s => { const r = rows.find(r => Math.abs(r[0].y - s.y) < 22); if (r) r.push(s); else rows.push([s]) })
    return rows.map(r => r.sort((a, b) => a.x - b.x).map(s => s.text).join(' ')).join('\n')
  }, [scraps])
  const survivors = lines.map((l, li) => l.words.filter((_, k) => !marks[offsets[li] + k]).join(' ')).filter(Boolean).join(' / ')
  const copy = () => { const t = [arranged, counts.black + counts.white ? survivors : ''].filter(Boolean).join('\n\n'); navigator.clipboard?.writeText(t).then(() => toast('Copied'), () => toast('Copy blocked. Select the text by hand.')) }
  const pageFont = `${page.size}px/${page.lh} "${page.font}", Georgia, serif`

  return (
    <Screen title="Cut-Up Bench" sub="Take a page apart with real tools. Cut it, move it, glue it, black it out. Whatever survives is yours." color="#f1efe8" step={0} steps={['Play', 'Reveal', 'Learn']}>
      {toastNode}
      <div ref={overlay} className="cursor-tool" aria-hidden="true">{T.img && <img src={T.img} alt="" />}</div>
      <div className="row" style={{ marginBottom: 10 }}>
        <label className="lab" htmlFor="src">Page</label>
        <select id="src" className="src" value={page.key.startsWith('link:') || page.key === 'own' ? '' : page.key} onChange={e => pick(e.target.value)} style={{ maxWidth: '100%' }}>
          {(page.key.startsWith('link:') || page.key === 'own') && <option value="">{page.title}</option>}
          {options.map(g => <optgroup key={g.label} label={g.label}>{g.items.map(p => <option key={p.key} value={p.key}>{p.title}</option>)}</optgroup>)}
          <optgroup label="Bring your own"><option value="own">Your own words…</option><option value="link">Pull from a link…</option></optgroup>
        </select>
        <button className="btn acid" onClick={randomPoem}>Random poem</button>
        <button className="btn ghost" onClick={() => setPanel(panel === 'link' ? '' : 'link')}>Link</button>
        <button className="btn ghost" onClick={() => setPanel(panel === 'own' ? '' : 'own')}>Paste</button>
      </div>
      {writing && !writing.length && <p className="muted" style={{ margin: '0 0 10px' }}>The site’s poems and essays only load on pressurecookerpoetry.com. Speeches and your own words work anywhere.</p>}
      {panel === 'own' && (
        <form className="row" style={{ marginBottom: 12, alignItems: 'stretch' }} onSubmit={e => { e.preventDefault(); if (own.trim()) { open({ key: 'own', title: 'Your own words', head: 'YOUR OWN WORDS', credit: 'Your words stay in this browser tab.', font: 'IM Fell English', size: 18, lh: 1.5, text: own }); setPanel('') } }}>
          <textarea value={own} onChange={e => setOwn(e.target.value)} rows={4} placeholder="Paste anything: a diary page, a text from your landlord, a speech, a song you can’t stop hearing." style={{ flex: '1 1 260px', fontSize: 16, padding: 10, border: '2px solid var(--ink)', background: 'var(--paper)', color: 'var(--ink)' }} aria-label="Your own words" />
          <button className="btn acid" type="submit" disabled={!own.trim()}>Put it on the bench</button>
        </form>
      )}
      {panel === 'link' && (
        <form style={{ marginBottom: 12 }} onSubmit={e => { e.preventDefault(); pull() }}>
          <div className="row">
            <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://pressurecookerpoetry.com/essays/…  or  https://en.wikisource.org/wiki/…" aria-label="Link to a page" style={{ flex: '1 1 260px', minHeight: 48, fontSize: 16, padding: '0 12px', border: '2px solid var(--ink)', background: 'var(--paper)', color: 'var(--ink)' }} />
            <button className="btn acid" type="submit" disabled={!link.trim()}>Pull the text</button>
          </div>
          {linkMsg && <p role="status" style={{ fontWeight: 700, margin: '8px 0 0' }}>{linkMsg}</p>}
        </form>
      )}
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn ghost" onClick={undo} disabled={!hist.length}>Undo</button>
        <button className="btn ghost" onClick={() => { const p = allPages.find(x => x.key === page.key) || page; open(p); setScraps([]) }}>Fresh page</button>
        <button className="btn ghost" onClick={() => setHidePage(h => !h)} aria-pressed={hidePage}>{hidePage ? 'Bring the page back' : 'Put the page away'}</button>
        <button className="btn" onClick={burroughs}>Burroughs ×4</button>
        <button className="btn" onClick={foldIn}>Fold-in</button>
      </div>
      <div className="bench">
        <div className="tray" role="toolbar" aria-label="Tools">
          {TOOLS.map((t, i) => (
            <button key={t.id} className={'tool' + (tool === t.id ? ' on' : '')} style={{ ['--d' as string]: 2.4 + i * 0.45 + 's' }} onClick={() => { setTool(t.id); setSel(null); sfx('tap') }} aria-pressed={tool === t.id} title={t.does}>
              {t.img ? <img src={t.img} alt="" /> : <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true"><path d="M20 34V16a4 4 0 0 1 8 0v14V10a4 4 0 0 1 8 0v20V14a4 4 0 0 1 8 0v18-8a4 4 0 0 1 8 0v18c0 12-8 20-18 20h-4c-6 0-10-3-14-8l-10-13a4 4 0 0 1 6-5l8 8z" fill="#f4ecdc" stroke="#141214" strokeWidth="3" strokeLinejoin="round" /></svg>}
              <span>{t.name}</span><kbd>{t.key}</kbd>
            </button>
          ))}
        </div>
        <div ref={mat} className={'mat' + (tool === 'hand' ? ' handmode' : '')} style={{ cursor: tool === 'hand' ? 'default' : 'none' }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <p className="mat-tip">{T.does} {sel !== null && <b>Now tap the piece to stick onto it.</b>}</p>
          {!hidePage && (
            <div className="page" style={{ font: pageFont }} tabIndex={0} onKeyDown={onPageKey} aria-label="The page. Arrow keys move between words; Enter uses the tool.">
              <div className="head">{page.head}</div>
              {lines.map((l, li) => (
                <p key={li} style={{ margin: l.gap ? '0.9em 0 0' : 0 }}>{l.words.map((w, k) => { const i = offsets[li] + k; return <span key={i}><span data-i={i} className={'wd' + (marks[i] ? ' ' + marks[i] : '')} style={kbd && caret === i ? { outline: '3px solid #ff2d6f' } : undefined}>{w}</span>{' '}</span> })}</p>
              ))}
              <div className="credit">{page.credit}</div>
            </div>
          )}
          <div className="spare" aria-hidden="true">{scraps.length ? 'Spare table' : 'Spare table: cut pieces lift off the page right where you cut them. Grab them with the Hand and arrange them anywhere.'}</div>
          <svg className="slash" aria-hidden="true"><path d={slash} /></svg>
          {scraps.map(s => (
            <span key={s.id} data-scrap={s.id} tabIndex={0} role="button" aria-label={`Piece: ${s.text}`} onKeyDown={e => onScrapKey(e, s)}
              className={'scrap' + (sel === s.id ? ' sel' : '') + (s.half ? ' half' : '')}
              style={{ left: s.x, top: s.y, rotate: s.rot + 'deg', font: `${Math.min(page.size, 19)}px/1.2 "${page.font}", Georgia, serif`, cursor: tool === 'hand' ? 'grab' : 'none' }}>{s.text}</span>
          ))}
        </div>
      </div>
      <div className="grid2" style={{ marginTop: 18 }}>
        <div>
          <h3 style={{ font: '400 1.8rem Anton', margin: '0 0 8px', textTransform: 'uppercase' }}>Commissions</h3>
          <ul className="goals" data-cuts={flags.cuts || 0} data-moves={flags.moves || 0}>{GOALS.map(g => <li key={g.id} className={g.done ? 'done' : ''}><i>{g.done ? '✓' : '○'}</i><span><b>{g.name}.</b> {g.text}</span></li>)}</ul>
        </div>
        <div>
          <h3 style={{ font: '400 1.8rem Anton', margin: '0 0 8px', textTransform: 'uppercase' }}>What you made</h3>
          <div className="found" aria-live="polite" style={{ whiteSpace: 'pre-line' }}>
            {arranged || (counts.black + counts.white ? '' : <span style={{ opacity: .6 }}>Cut pieces read top to bottom, left to right, the way you lay them out. Blackout survivors show up here too.</span>)}
            {counts.black + counts.white > 0 && <>{arranged && '\n\n'}{survivors || '(nothing left standing)'}</>}
          </div>
          <div className="row" style={{ marginTop: 10 }}><button className="btn acid" onClick={copy}>Copy it</button><span className="muted">{scraps.length} pieces on the table · {visible} of {words.length} words still on the page</span></div>
        </div>
      </div>
      <div className="xray">
        <h3>Learn: where these tricks come from</h3>
        <ul>
          <li><b>Cut-up.</b> In 1920 the Dada poet Tristan Tzara wrote instructions for making a poem from newspaper words drawn out of a bag. In 1959 the painter Brion Gysin, slicing through newspapers at the Beat Hotel in Paris, rediscovered it, and William S. Burroughs turned it into a method.</li>
          <li><b>Burroughs ×4.</b> Burroughs’ version: cut a page down the middle and across the middle, swap the four quarters, read the new page. <b>The fold-in</b> is his cousin: fold two pages in half and read straight across both.</li>
          <li><b>Blackout and erasure.</b> Tom Phillips started painting over a Victorian novel in 1966 and kept going for decades: <i>A Humument</i>. Ronald Johnson erased Milton’s <i>Paradise Lost</i> down to <i>Radi os</i> (1977). Austin Kleon’s newspaper blackouts brought the marker to everybody.</li>
          <li><b>Why it matters here.</b> If a few cuts can make a founding speech say something new, every speech, ad and press release is also a choice of which words survive. You just did the editor’s job with the lights on. The originals stay whole; you worked on a copy.</li>
        </ul>
      </div>
      <Spot>the words someone chose to leave standing, and the ones they quietly cut.</Spot>
      <Sources list={[
        { title: 'Cut-up technique (Tzara, Gysin, Burroughs)', url: 'https://en.wikipedia.org/wiki/Cut-up_technique' },
        { title: 'Erasure poetry', url: 'https://en.wikipedia.org/wiki/Erasure_(artform)' },
        { title: 'Tom Phillips, A Humument', url: 'https://en.wikipedia.org/wiki/A_Humument' },
        { title: 'Austin Kleon (Newspaper Blackout)', url: 'https://en.wikipedia.org/wiki/Austin_Kleon' },
        { title: 'Project Gutenberg (speech texts)', url: 'https://www.gutenberg.org/' },
      ]} />
    </Screen>
  )
}
