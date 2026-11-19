import { useRef } from 'react'

// Pointer-driven 3D tilt. Sets CSS variables only — no React state, no re-render.
export default function Tilt({ children, className = '', max = 7 }) {
  const ref = useRef(null)
  const move = (e) => {
    if (e.pointerType === 'touch') return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`)
    el.style.setProperty('--px', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--py', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const leave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  )
}
