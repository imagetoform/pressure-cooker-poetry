import { useEffect, useState } from 'react'

/* ---------- The wrapper jar: one per visitor, kept only in this browser ---------- */
export type Wrapper = { id: string; label: string; color: string; machine: string }
const KEY = 'pcp-bc-jar-v2'
export const JAR_GOAL = 8

function read(): Wrapper[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
let jar: Wrapper[] = read()
const subs = new Set<() => void>()

export function addWrapper(w: Wrapper): boolean {
  if (jar.some(x => x.id === w.id)) return false
  jar = [...jar, w]
  try { localStorage.setItem(KEY, JSON.stringify(jar)) } catch { /* storage blocked: keep it for this visit */ }
  subs.forEach(f => f())
  sfx('wrapper')
  return true
}
export function resetJar() {
  jar = []
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  subs.forEach(f => f())
}
export function useJar() {
  const [, force] = useState(0)
  useEffect(() => { const f = () => force(n => n + 1); subs.add(f); return () => { subs.delete(f) } }, [])
  return jar
}

/* ---------- Sound: synthesized live, never recorded, mutable ---------- */
let ctx: AudioContext | null = null
let muted = (() => { try { return localStorage.getItem('pcp-bc-mute') === '1' } catch { return false } })()
const muteSubs = new Set<() => void>()
export function setMuted(m: boolean) {
  muted = m
  try { localStorage.setItem('pcp-bc-mute', m ? '1' : '0') } catch { /* ignore */ }
  muteSubs.forEach(f => f())
}
export function useMuted() {
  const [, force] = useState(0)
  useEffect(() => { const f = () => force(n => n + 1); muteSubs.add(f); return () => { muteSubs.delete(f) } }, [])
  return muted
}
function tone(freq: number, dur: number, type: OscillatorType = 'square', gain = 0.05, when = 0, slide = 0) {
  if (!ctx) return
  const t = ctx.currentTime + when
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = type; o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur)
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02)
}
function noise(dur: number, gain = 0.04, hp = 800) {
  if (!ctx) return
  const n = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain()
  f.type = 'highpass'; f.frequency.value = hp; g.gain.value = gain
  s.buffer = n; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start()
}
export type Sfx = 'tap' | 'good' | 'bad' | 'combo' | 'ding' | 'wrapper' | 'spin' | 'cut' | 'marker' | 'glue' | 'unlock'
export function sfx(kind: Sfx, level = 0) {
  if (muted) return
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
  } catch { return }
  switch (kind) {
    case 'tap': tone(520, 0.05, 'square', 0.03); break
    case 'good': tone(660, 0.08, 'square', 0.04); tone(990, 0.12, 'square', 0.04, 0.07); break
    case 'bad': tone(180, 0.22, 'sawtooth', 0.04, 0, -80); break
    case 'combo': tone(660 + level * 90, 0.07, 'square', 0.04); tone(880 + level * 110, 0.1, 'triangle', 0.05, 0.06); break
    case 'ding': tone(1320, 0.5, 'sine', 0.08); tone(1760, 0.6, 'sine', 0.04, 0.02); break
    case 'wrapper': noise(0.18, 0.05, 2500); tone(1046, 0.08, 'triangle', 0.05, 0.1); tone(1568, 0.14, 'triangle', 0.05, 0.18); break
    case 'spin': tone(90, 0.7, 'sawtooth', 0.03, 0, 140); noise(0.6, 0.02, 400); break
    case 'cut': noise(0.07, 0.07, 3000); break
    case 'marker': noise(0.12, 0.03, 1200); break
    case 'glue': tone(140, 0.12, 'sine', 0.05, 0, -50); break
    case 'unlock': [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'square', 0.04, i * 0.09)); break
  }
}

/* ---------- Seeded randomness, so a round can be replayed ---------- */
export function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) }
  let a = h >>> 0
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
export function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a
}
export const reduceMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
export const syllables = (s: string) =>
  s.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean)
    .reduce((n, w) => n + Math.max(1, (w.replace(/e$/, '').match(/[aeiouy]+/g) || []).length), 0)
