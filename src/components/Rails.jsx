import { useEffect, useMemo, useRef, useState } from 'react'
import { S } from '../lib/mood'

function useWide() {
  const [wide, setWide] = useState(() => (typeof window === 'undefined' ? true : window.matchMedia('(min-width: 860px)').matches))
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 860px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

/**
 * THE SIGNATURE PATTERN.
 * Two straight vertical rails, joined by many individual diagonal strokes.
 * Every diagonal is a single straight line, runs from the left rail to the right
 * rail, has exactly the same slant, and slants the same way.
 *
 * gap   : distance between the rails in px, or [mobile, desktop]
 * pitch : vertical distance between neighbouring diagonals
 * slant : rise of each diagonal as a fraction of the gap (same for every line)
 * speed : how far the hatch drifts per px of scroll (0 disables)
 */
export default function Rails({ gap = [14, 56], pitch = 14, slant = 0.9, speed = 0.1, fade = true, className = '', style }) {
  const wide = useWide()
  const g = Array.isArray(gap) ? (wide ? gap[1] : gap[0]) : gap
  const rise = Math.round(g * slant)
  const wrap = useRef(null)
  const hatch = useRef(null)
  const [h, setH] = useState(900)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setH(Math.max(100, Math.round(e.contentRect.height))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const d = useMemo(() => {
    const first = -Math.ceil(rise / pitch) - 1
    const last = Math.ceil(h / pitch) + 1
    let s = ''
    for (let k = first; k <= last; k++) {
      const y = k * pitch
      s += `M0.5 ${y + rise}L${g + 0.5} ${y}`
    }
    return s
  }, [g, h, pitch, rise])

  // Drift the hatch with scroll. The pattern repeats every `pitch` px, so
  // wrapping with a modulo is seamless.
  useEffect(() => {
    if (!speed) return
    const fn = (y) => {
      if (hatch.current && !S.reduced) hatch.current.style.transform = `translateY(${(y * speed) % pitch}px)`
    }
    S.subs.add(fn)
    fn(S.y)
    return () => S.subs.delete(fn)
  }, [speed, pitch])

  return (
    <div ref={wrap} className={`rails${fade ? ' rails--fade' : ''} ${className}`} style={{ width: g + 1, ...style }} aria-hidden="true">
      <svg width={g + 1} height={h} viewBox={`0 0 ${g + 1} ${h}`} fill="none" stroke="currentColor">
        <g ref={hatch}>
          <path d={d} strokeOpacity="0.5" strokeWidth="1" />
        </g>
        <path d={`M0.5 0V${h}M${g + 0.5} 0V${h}`} strokeOpacity="0.95" strokeWidth="1" />
      </svg>
    </div>
  )
}
