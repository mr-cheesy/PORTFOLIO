import { ArrowUp } from 'lucide-react'
import { LINKS } from '../data'
import { useReducedMotion } from 'framer-motion'
import { scrollToId } from '../lib/scroll'

export default function Footer() {
  const reduce = useReducedMotion()
  const toTop = () => scrollToId('hero', reduce)

  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div>
          <p className="footer__brand">
            ATHARV<span className="dot">.</span>
          </p>
          <p className="mono footer__tag">DESIGNED &amp; BUILT WITH CURIOSITY.</p>
        </div>

        <nav className="footer__social mono" aria-label="Social">
          <a href={LINKS.github.href} target="_blank" rel="noopener noreferrer">
            GITHUB
          </a>
          <a href={LINKS.linkedin.href} target="_blank" rel="noopener noreferrer">
            LINKEDIN
          </a>
          <a href={LINKS.email.href}>EMAIL</a>
        </nav>

        <div className="footer__end">
          <p className="mono">© 2026 ATHARV</p>
          <button type="button" className="totop mono" onClick={toTop}>
            BACK TO TOP <ArrowUp size={14} strokeWidth={1.75} className="arrow-up" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
