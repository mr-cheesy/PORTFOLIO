import { motion, useReducedMotion } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/**
 * Fade/slide-up reveal. Triggers when scrolled into view, or — if a `ready`
 * prop is passed — when `ready` becomes true (used for the hero entrance).
 */
export function Reveal({ children, delay = 0, y = 28, as = 'div', ready, className, ...rest }) {
  const reduce = useReducedMotion()
  if (reduce) {
    const Plain = as
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }
  const Tag = motion[as]
  const common = { initial: { opacity: 0, y }, transition: { duration: 0.9, delay, ease: EASE } }
  const trigger =
    ready === undefined
      ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -12% 0px' } }
      : { animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y } }
  return (
    <Tag className={className} {...common} {...trigger} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Masked line-by-line heading reveal. `lines` items are strings or
 * { text, muted }. Each line slides up from behind its own mask.
 */
export function Lines({ lines, as = 'h2', className = '', delay = 0, stagger = 0.12, ready, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = as
  return (
    <Tag className={className} {...rest}>
      {lines.map((l, i) => {
        const text = typeof l === 'string' ? l : l.text
        const muted = typeof l === 'object' && l.muted
        const cls = `line${muted ? ' is-muted' : ''}`
        if (reduce) {
          return (
            <span key={i} className={cls}>
              <span className="line__inner">{text}</span>
            </span>
          )
        }
        const trigger =
          ready === undefined
            ? { whileInView: { y: '0%' }, viewport: { once: true, margin: '0px 0px -10% 0px' } }
            : { animate: { y: ready ? '0%' : '110%' } }
        return (
          <span key={i} className={cls}>
            <motion.span
              className="line__inner"
              initial={{ y: '110%' }}
              transition={{ duration: 1.1, delay: delay + i * stagger, ease: EASE }}
              {...trigger}
            >
              {text}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}
