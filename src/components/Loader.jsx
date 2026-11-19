import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const WORD = 'ATHARV.'.split('')
const TICKS = 20
const PHASES = [
  { at: 0, text: 'WAKING UP' },
  { at: 25, text: 'LOADING IDEAS' },
  { at: 55, text: 'COMPILING CURIOSITY' },
  { at: 85, text: 'ALMOST THERE' },
  { at: 100, text: 'READY' },
]

// Quick start, a brief hesitation, then a smooth finish.
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const curve = (p) => (p < 0.6 ? 0.62 * easeOut(p / 0.6) : 0.62 + 0.38 * easeInOut((p - 0.6) / 0.4))

// Timing uses plain timers and CSS animations (not requestAnimationFrame),
// so it always finishes, even if the tab is in the background or throttled.
export default function Loader({ onDone, leaving }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (reduce) {
      onDone()
      return
    }
    const start = Date.now()
    const dur = 2600
    let finish
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur)
      setN(Math.round(curve(p) * 100))
      if (p >= 1) {
        clearInterval(id)
        finish = setTimeout(onDone, 300)
      }
    }, 30)
    return () => {
      clearInterval(id)
      clearTimeout(finish)
    }
  }, [reduce, onDone])

  const phase = [...PHASES].reverse().find((p) => n >= p.at)
  const lit = Math.floor((n / 100) * TICKS)

  return (
    <div className={`loader${leaving ? ' is-leaving' : ''}`} role="status" aria-label="Loading">
      <div className="loader__top mono" aria-hidden="true">
        <span>PORTFOLIO — 2026</span>
        <span>INDIA · IST</span>
      </div>

      <div className="loader__center" aria-hidden="true">
        <div className="loader__word">
          {WORD.map((c, i) => (
            <span key={i} className="loader__mask">
              <span className={n >= ((i + 1) / WORD.length) * 100 ? 'on' : ''} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                {c}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="loader__bottom">
        <div className="loader__meta mono">
          <span className="loader__phase">
            <span key={phase.text}>{phase.text}</span>
          </span>
          <span className="loader__count">
            {String(n).padStart(3, '0')}
            <i>%</i>
          </span>
        </div>

        <div className="loader__bar" aria-hidden="true">
          <span className="loader__fill" style={{ transform: `scaleX(${n / 100})` }} />
          <span className="loader__head" style={{ left: `${n}%` }} />
        </div>

        <div className="loader__ticks" aria-hidden="true">
          {Array.from({ length: TICKS + 1 }, (_, i) => (
            <span key={i} className={i <= lit ? 'on' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}
