import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { S } from '../lib/mood'
import { Reveal, Lines } from './Reveal'
import Rails from './Rails'

const WORDS = ['Student.', 'Developer.', 'Problem-solver.']

export default function About() {
  const ref = useRef(null)

  // Big typographic words drift sideways against each other as you scroll
  useEffect(() => {
    if (S.reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.about__word').forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: i % 2 ? -12 : 12 },
          { xPercent: i % 2 ? 12 : -12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section about" aria-labelledby="about-title" ref={ref}>
      <Rails className="rails--abs rails--left" gap={[12, 34]} pitch={12} slant={0.9} speed={0.08} />
      <div className="wrap about__grid">
        <div className="about__head">
          <Reveal as="p" className="mono label">
            01 — ABOUT
          </Reveal>
          <Lines as="h2" id="about-title" className="h2" lines={['A little about the', 'person behind', 'the screen.']} />
        </div>

        <div className="about__copy">
          <Reveal as="p" className="lead">
            I&apos;m a student who builds. Technology, engineering, coding and design all pull me in — and the fastest way I&apos;ve found to learn any of them is
            to make something real.
          </Reveal>
          <Reveal as="p" className="body" delay={0.1}>
            Maps fed by live data, tools for students, experiments in the browser. Each project is a way of finding out what I don&apos;t know yet — and I&apos;m
            always working out what to make next.
          </Reveal>
        </div>
      </div>

      <div className="about__type" aria-hidden="true">
        {WORDS.map((w, i) => (
          <span key={w} className={`about__word${i % 2 === 0 ? ' is-outline' : ''}`}>
            {w}
          </span>
        ))}
      </div>
    </section>
  )
}
