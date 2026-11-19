import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS } from '../data'
import { Reveal, Lines, EASE } from './Reveal'
import Rails from './Rails'
import Tilt from './Tilt'

/* ── Abstract visuals. They are illustrations, not screenshots, and say so. ── */

function OsintVisual() {
  const reduce = useReducedMotion()
  const arcs = ['M92 236 Q 190 90 338 152', 'M136 280 Q 262 150 392 238', 'M80 178 Q 214 50 368 112']
  const dots = [[92, 236], [338, 152], [136, 280], [392, 238], [80, 178], [368, 112]]
  return (
    <svg viewBox="0 0 480 360" role="img" aria-label="Abstract globe with flight paths" fill="none" stroke="currentColor">
      <defs>
        <clipPath id="globe">
          <circle cx="240" cy="180" r="160" />
        </clipPath>
      </defs>
      <circle cx="240" cy="180" r="160" strokeOpacity=".55" />
      <g clipPath="url(#globe)" strokeOpacity=".22">
        {[-100, -50, 0, 50, 100].map((dy) => (
          <ellipse key={dy} cx="240" cy={180 + dy} rx="160" ry={Math.max(6, 28 - Math.abs(dy) * 0.12)} />
        ))}
        {[40, 90, 135].map((rx) => (
          <ellipse key={rx} cx="240" cy="180" rx={rx} ry="160" />
        ))}
        <line x1="240" y1="20" x2="240" y2="340" />
      </g>
      {arcs.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="var(--accent)"
          strokeWidth="1.5"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.8, delay: 0.3 + i * 0.25, ease: EASE }}
        />
      ))}
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="var(--accent)" stroke="none" />
      ))}
    </svg>
  )
}

function LockinVisual() {
  return (
    <svg viewBox="0 0 480 360" role="img" aria-label="Abstract workspace panels" fill="none" stroke="currentColor">
      <rect x="60" y="50" width="360" height="260" strokeOpacity=".55" />
      <line x1="60" y1="92" x2="420" y2="92" strokeOpacity=".4" />
      <circle cx="80" cy="71" r="3" fill="currentColor" stroke="none" fillOpacity=".5" />
      <circle cx="94" cy="71" r="3" fill="currentColor" stroke="none" fillOpacity=".3" />
      <line x1="150" y1="92" x2="150" y2="310" strokeOpacity=".3" />
      {[118, 148, 178, 208].map((y, i) => (
        <g key={y}>
          <rect x="76" y={y} width="58" height="8" strokeOpacity=".35" />
          {i === 1 && <rect x="76" y={y} width="58" height="8" fill="var(--accent)" stroke="none" fillOpacity=".35" />}
        </g>
      ))}
      <rect x="172" y="114" width="226" height="70" strokeOpacity=".5" />
      <line x1="190" y1="136" x2="330" y2="136" strokeOpacity=".4" />
      <line x1="190" y1="154" x2="290" y2="154" strokeOpacity=".25" />
      <rect x="172" y="202" width="106" height="88" strokeOpacity=".4" />
      <circle cx="225" cy="246" r="26" strokeOpacity=".3" />
      <path d="M225 220 A26 26 0 1 1 199 246" stroke="var(--accent)" strokeWidth="2" />
      <rect x="292" y="202" width="106" height="88" strokeOpacity=".4" />
      {[222, 240, 258, 276].map((y) => (
        <line key={y} x1="308" y1={y} x2={y === 276 ? 350 : 380} y2={y} strokeOpacity=".3" />
      ))}
    </svg>
  )
}

function SpaceVisual() {
  const stars = [[90, 80], [150, 300], [410, 60], [440, 250], [60, 220], [300, 40], [380, 320], [220, 330]]
  return (
    <svg viewBox="0 0 480 360" role="img" aria-label="Abstract orbits around a planet" fill="none" stroke="currentColor">
      <ellipse cx="240" cy="180" rx="200" ry="70" transform="rotate(-18 240 180)" strokeOpacity=".4" />
      <ellipse cx="240" cy="180" rx="150" ry="48" transform="rotate(-18 240 180)" strokeOpacity=".25" />
      <circle cx="240" cy="180" r="54" strokeOpacity=".7" />
      <path d="M200 160 Q240 140 284 166" strokeOpacity=".25" />
      <path d="M192 190 Q240 170 290 196" strokeOpacity=".25" />
      <circle cx="402" cy="128" r="5" fill="var(--accent)" stroke="none" />
      {stars.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" stroke="none" fillOpacity=".6" />
      ))}
    </svg>
  )
}

const VISUALS = { osint: OsintVisual, lockin: LockinVisual, space: SpaceVisual }

function Project({ p, i }) {
  const live = Boolean(p.href)
  const Visual = VISUALS[p.id]
  return (
    <Reveal as="article" className={`project${live ? ' is-live' : ' is-soon'}${i % 2 ? ' is-flip' : ''}`}>
      <div className="project__info">
        <div className="project__head mono">
          <span className="project__num">{p.n}</span>
          <span className="project__cat">{p.category}</span>
        </div>

        <h3 className="project__title">
          {live ? (
            <a href={p.href} target="_blank" rel="noopener noreferrer">
              {p.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            p.title
          )}
        </h3>
        <p className="project__desc">{p.desc}</p>

        {p.tags.length > 0 && (
          <ul className="tags" aria-label="Technologies">
            {p.tags.map((t) => (
              <li key={t} className="mono">
                {t}
              </li>
            ))}
          </ul>
        )}

        <p className="mono project__link">
          {p.cta} {live && <ArrowUpRight size={16} strokeWidth={1.5} className="arrow" aria-hidden="true" />}
        </p>
      </div>

      <div className="project__stage">
        <Rails className="rails--abs rails--left" gap={[10, 22]} pitch={10} slant={0.9} speed={0} fade={false} />
        <Rails className="rails--abs rails--right" gap={[10, 22]} pitch={10} slant={0.9} speed={0} fade={false} />
        <Tilt className="project__tilt">
          <div className="project__visual">
            <span className="project__corner mono" aria-hidden="true">
              {p.n} / 03
            </span>
            <Visual />
            <span className="project__cap mono">ABSTRACT PREVIEW — NOT A SCREENSHOT</span>
          </div>
        </Tilt>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="work__grid" aria-hidden="true" />
      <div className="wrap">
        <Reveal as="p" className="mono label">
          02 — SELECTED WORK
        </Reveal>
        <Lines as="h2" id="work-title" className="h2" lines={['Some things I’ve', 'put into the world.']} />

        <div className="projects">
          {PROJECTS.map((p, i) => (
            <Project key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
