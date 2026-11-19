import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { LINKS } from '../data'
import { Reveal, Lines } from './Reveal'
import Rails from './Rails'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email.label)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = LINKS.email.href
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <Rails className="rails--abs rails--left" gap={[18, 120]} pitch={16} slant={0.8} speed={0.1} />
      <Rails className="rails--abs rails--right" gap={[18, 120]} pitch={16} slant={0.8} speed={-0.1} />

      <div className="wrap contact__inner">
        <Reveal as="p" className="mono label">
          05 — GET IN TOUCH
        </Reveal>
        <Lines as="h2" id="contact-title" className="display contact__title" lines={['Have an idea?', { text: 'Let’s make it real.', muted: true }]} />

        <Reveal className="contact__mail" delay={0.1}>
          <a href={LINKS.email.href} className="contact__email">
            {LINKS.email.label}
            <ArrowUpRight className="arrow" size={28} strokeWidth={1.25} aria-hidden="true" />
          </a>
          <button type="button" className="copy mono" onClick={copy} aria-live="polite">
            {copied ? <Check size={14} strokeWidth={2} aria-hidden="true" /> : <Copy size={14} strokeWidth={1.75} aria-hidden="true" />}
            {copied ? 'COPIED' : 'COPY EMAIL'}
          </button>
        </Reveal>

        <ul className="contact__social mono">
          <li>
            <a href={LINKS.github.href} target="_blank" rel="noopener noreferrer">
              GITHUB <ArrowUpRight size={14} strokeWidth={1.5} className="arrow" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={LINKS.linkedin.href} target="_blank" rel="noopener noreferrer">
              LINKEDIN <ArrowUpRight size={14} strokeWidth={1.5} className="arrow" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
