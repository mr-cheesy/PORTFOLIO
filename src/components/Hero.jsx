import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, Lines, EASE } from './Reveal'
import Rails from './Rails'

const istTime = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date())

function useIST() {
  const [t, setT] = useState(istTime)
  useEffect(() => {
    const id = setInterval(() => setT(istTime()), 20000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Hero({ ready }) {
  const time = useIST()
  const reduce = useReducedMotion()

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      {/* Signature pattern: a wide pair of rails on the right, a slim pair on the left */}
      <Rails className="rails--abs rails--right" gap={[34, 150]} pitch={16} slant={0.8} speed={0.12} />
      <Rails className="rails--abs rails--left" gap={[12, 34]} pitch={12} slant={0.9} speed={0.08} />

      <div className="wrap hero__inner">

        <Lines
          as="h1"
          id="hero-title"
          className="display hero__title"
          ready={ready}
          delay={0.45}
          stagger={0.14}
          lines={['Atharv Rana.']}
        />

        <div className="hero__bottom">
          <Reveal as="p" className="hero__desc" ready={ready} delay={1.0}>
            A student, developer and curious mind exploring technology, solving problems and turning ideas into reality.
          </Reveal>

          <Reveal as="div" className="hero__meta mono" ready={ready} delay={1.15} y={14}>
            <span className="status">
              <span className="status__dot" aria-hidden="true" />
              AVAILABLE FOR NEW IDEAS
            </span>
            <span>
              INDIA · IST <span className="hero__time">{time}</span>
            </span>
          </Reveal>
        </div>

        <motion.a
          href="#about"
          className="scroll-cue mono"
          aria-label="Scroll to about section"
          initial={reduce ? false : { opacity: 0 }}
          animate={ready || reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: EASE }}
        >
          <span>SCROLL</span>
          <span className="scroll-cue__line" aria-hidden="true" />
        </motion.a>
      </div>
    </section>
  )
}
