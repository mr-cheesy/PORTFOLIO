import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { S } from '../lib/mood'
import { LAB } from '../data'
import { Reveal, Lines } from './Reveal'
import Rails from './Rails'
import Tilt from './Tilt'

const ROW = 'EXPLORING · BUILDING · LEARNING · BREAKING THINGS · '

export default function Lab() {
  const ref = useRef(null)

  useEffect(() => {
    if (S.reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.marquee__track').forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? -28 : 0 },
          { xPercent: i % 2 ? 0 : -28, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 } }
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="lab" className="section lab" aria-labelledby="lab-title" ref={ref}>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">{ROW.repeat(4)}</div>
        <div className="marquee__track is-outline">{ROW.repeat(4)}</div>
      </div>

      <div className="wrap">
        <Reveal as="p" className="mono label">
          04 — THE LAB
        </Reveal>
        <Lines as="h2" id="lab-title" className="h2" lines={['Currently', 'exploring.']} />
        <Reveal as="p" className="lead lab__lead" delay={0.1}>
          Technology is one part of the picture. These are the things I&apos;m poking at, learning and trying out right now.
        </Reveal>

        <ul className="lab__grid">
          {LAB.map((it, i) => (
            <Reveal as="li" key={it.n} delay={0.06 * i} y={24}>
              <Tilt className="lab__tile" max={9}>
                <Rails className="rails--abs rails--right lab__rails" gap={[18, 40]} pitch={9} slant={0.9} speed={0} fade={false} />
                <span className="lab__spot" aria-hidden="true" />
                <p className="mono lab__n">LAB {it.n}</p>
                <h3 className="lab__title">{it.title}</h3>
                <p className="lab__desc">{it.desc}</p>
              </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
