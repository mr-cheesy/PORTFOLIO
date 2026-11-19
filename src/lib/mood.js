// Shared scroll state + the "mood" system.
// Every section has a mood (accent colour + background tone). The page colour,
// the accent, and the 3D scene all read from ONE continuous value, S.s, which
// runs 0 → 5 as you scroll from the hero to the contact section.

export const SECTION_IDS = ['hero', 'about', 'work', 'stack', 'lab', 'contact']

const hex = (h) => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const MOODS = [
  { accent: '#9db8ff', bg: '#040405' }, // hero    — cold silver-blue
  { accent: '#b9a2ff', bg: '#06050b' }, // about   — quiet violet
  { accent: '#6fe0cc', bg: '#040708' }, // work    — technical teal
  { accent: '#ffc27a', bg: '#080604' }, // stack   — warm amber
  { accent: '#ff7d9e', bg: '#0a0509' }, // lab     — experimental rose
  { accent: '#f2f2f2', bg: '#000000' }, // contact — pure black, white light
].map((m) => ({ accent: hex(m.accent), bg: hex(m.bg) }))

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10)
const shape = (t) => smoother(clamp((t - 0.1) / 0.8))
const rgb = (c) => c.map(Math.round).join(' ')

export const S = {
  y: 0,
  s: 0, // continuous section index, 0..5
  progress: 0,
  anchors: SECTION_IDS.map((_, i) => i * 1000),
  accent: [...MOODS[0].accent],
  bg: [...MOODS[0].bg],
  mouse: { x: 0, y: 0 }, // -1..1
  reduced: false,
  subs: new Set(), // callbacks (y) => void, called on every scroll update
}

// Scroll positions at which each section is centred in the viewport.
export function measure() {
  const vh = window.innerHeight
  const max = Math.max(0, document.documentElement.scrollHeight - vh)
  const sy = window.scrollY
  const next = []
  let prev = -1
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id)
    let x
    if (i === 0) x = 0
    else if (!el) x = prev + 1
    else {
      const r = el.getBoundingClientRect()
      x = r.top + sy + r.height / 2 - vh / 2
    }
    if (i === SECTION_IDS.length - 1) x = Math.min(x, max)
    x = Math.max(x, prev + 1)
    next.push(x)
    prev = x
  })
  S.anchors = next
}

export function update(y = window.scrollY) {
  S.y = y
  const a = S.anchors
  let i = 0
  while (i < a.length - 2 && y >= a[i + 1]) i++
  const t = clamp((y - a[i]) / Math.max(1, a[i + 1] - a[i]))
  const e = shape(t)
  S.s = i + e
  S.accent = mix(MOODS[i].accent, MOODS[i + 1].accent, e)
  S.bg = mix(MOODS[i].bg, MOODS[i + 1].bg, e)
  const max = document.documentElement.scrollHeight - window.innerHeight
  S.progress = max > 0 ? clamp(y / max) : 0

  const root = document.documentElement.style
  root.setProperty('--bg', `rgb(${rgb(S.bg)})`)
  root.setProperty('--accent', `rgb(${rgb(S.accent)})`)
  root.setProperty('--accent-rgb', rgb(S.accent).replace(/ /g, ','))
  S.subs.forEach((fn) => fn(y))
}
