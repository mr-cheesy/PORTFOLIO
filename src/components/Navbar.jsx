import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { NAV, LINKS } from '../data'
import { SECTION_IDS } from '../lib/mood'
import { scrollToId } from '../lib/scroll'
import { EASE } from './Reveal'

export default function Navbar({ ready }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    // wait a frame so the mobile menu's scroll lock is released first
    setTimeout(() => scrollToId(id, reduce), open ? 60 : 0)
  }

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id === 'hero' ? '' : e.target.id)),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' is-scrolled' : ''}`}
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={ready || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      >
        <div className="wrap nav__inner">
          <a href="#hero" className="nav__brand" aria-label="Atharv — back to top" onClick={go('hero')}>
            ATHARV<span className="dot">.</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`} onClick={go(id)} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'true' : undefined}>
                {label}
                {active === id && <motion.span layoutId="nav-underline" className="nav__underline" transition={{ duration: 0.5, ease: EASE }} />}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <a href="#contact" onClick={go('contact')} className="btn btn--small">
              Say hello <ArrowUpRight size={14} strokeWidth={1.75} className="arrow" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav className="menu__inner" aria-label="Mobile">
              <ul>
                {[{ id: 'hero', label: 'Home' }, ...NAV].map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: EASE }}
                  >
                    <a href={`#${id}`} onClick={go(id)}>
                      <span className="mono">0{i}</span>
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a className="mono menu__mail" href={LINKS.email.href}>
                {LINKS.email.label}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
