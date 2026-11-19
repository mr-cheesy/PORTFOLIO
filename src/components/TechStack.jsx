import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { S } from '../lib/mood'
import { STACK } from '../data'
import { Reveal, Lines } from './Reveal'

/**
 * The toolkit as an orbital system: three rings (languages, frameworks,
 * tools). The rings turn with scroll; labels counter-rotate to stay upright.
 */
export default function TechStack() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.orbit__ring').forEach((ring) => {
        const total = Number(ring.dataset.speed)
        ring.style.setProperty('--rot', 0)
        if (S.reduced) return
        const o = { v: 0 }
        gsap.to(o, {
          v: total,
          ease: 'none',
          onUpdate: () => ring.style.setProperty('--rot', o.v.toFixed(2)),
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="stack" className="section stack" aria-labelledby="stack-title" ref={ref}>
      <div className="wrap">
        <Reveal as="p" className="mono label">
          03 — THE TOOLKIT
        </Reveal>
        <Lines as="h2" id="stack-title" className="h2" lines={['Tools I use.', 'Things I’m learning.']} />
      </div>

      <div className="orbit" aria-hidden="true">
        <span className="orbit__core mono">
          TOOL
          <br />
          KIT
        </span>
        {STACK.map((g) => (
          <div key={g.title} className="orbit__ring" data-speed={g.speed} style={{ '--k': g.k }}>
            {g.items.map((it, i) => (
              <span key={it} className="orbit__node" style={{ '--a': (360 / g.items.length) * i + (g.k > 0.3 ? 28 : 0) }}>
                <span className="orbit__in">
                  <i />
                  <b className="mono">{it}</b>
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Same content as plain lists — readable without the diagram, and for screen readers */}
      <div className="wrap stack__legend">
        {STACK.map((g) => (
          <Reveal key={g.title} className="stack__group">
            <h3 className="mono stack__head">
              {g.title.toUpperCase()} <span>({String(g.items.length).padStart(2, '0')})</span>
            </h3>
            <ul>
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
