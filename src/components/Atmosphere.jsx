import { useEffect, useRef } from 'react'
import { S, measure, update } from '../lib/mood'
import { ScrollTrigger } from '../lib/gsap'

/**
 * Fixed atmosphere layers: a pointer-following light, vignette, film grain and
 * the scroll progress line. Also owns the scroll → mood update loop.
 */
export default function Atmosphere() {
  const bar = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    S.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const full = () => {
      measure()
      update(window.scrollY)
    }
    const onScroll = () => update(window.scrollY)
    const onLoad = () => {
      full()
      ScrollTrigger.refresh()
    }

    const sub = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${S.progress})`
    }
    S.subs.add(sub)

    let raf = 0
    const onMove = (e) => {
      S.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      S.mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        root.style.setProperty('--mx', `${S.mouse.x * 50 + 50}%`)
        root.style.setProperty('--my', `${S.mouse.y * 50 + 50}%`)
      })
    }

    full()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', full)
    window.addEventListener('load', onLoad)
    window.addEventListener('pointermove', onMove, { passive: true })
    const ro = new ResizeObserver(full)
    ro.observe(document.body)
    document.fonts?.ready.then(onLoad)

    return () => {
      S.subs.delete(sub)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', full)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
    }
  }, [])

  return (
    <>
      <div className="atmo" aria-hidden="true">
        <div className="atmo__light" />
        <div className="atmo__vignette" />
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="progress" ref={bar} aria-hidden="true" />
    </>
  )
}
