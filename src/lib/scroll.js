import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis = null

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
export function initScroll() {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (t) => lenis && lenis.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis && lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function scrollToId(id, reduced = false) {
  const el = document.getElementById(id)
  if (!el) return
  const top = id === 'hero' ? 0 : el.getBoundingClientRect().top + window.scrollY - 56
  if (lenis) lenis.scrollTo(top, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
}
