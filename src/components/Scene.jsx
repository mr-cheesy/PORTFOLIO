import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { S } from '../lib/mood'

const damp = THREE.MathUtils.damp
const lerp = THREE.MathUtils.lerp

// Where the artifact sits in each section (index = section). Desktop keeps it
// beside the text; narrow screens park it above or behind.
const KF_WIDE = [
  { x: 2.6, y: 0.0, z: -0.6, s: 0.92 }, // hero    — right, dramatic
  { x: -2.6, y: -0.2, z: -2.4, s: 0.85 }, // about   — left, receding
  { x: 3.8, y: 1.1, z: -7.5, s: 0.6 }, // work    — far top-right, small and dim
  { x: 4.2, y: 0.9, z: -9, s: 1.0 }, // stack   — off to the right of the orbit
  { x: 3.3, y: 0.6, z: -3.2, s: 0.95 }, // lab     — right, spins faster
  { x: 3.6, y: 0.0, z: -6.5, s: 1.3 }, // contact — right, behind the rails
]
const KF_NARROW = [
  { x: 0, y: 1.25, z: -0.5, s: 0.62 },
  { x: 0, y: 1.7, z: -7, s: 0.6 },
  { x: 0, y: 1.6, z: -13, s: 0.55 },
  { x: 0, y: 0, z: -13, s: 1 },
  { x: 0, y: 1.6, z: -9, s: 0.6 },
  { x: 0, y: 0, z: -7, s: 1.2 },
]

function Environment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    // Built-in studio environment: gives the metal and glass something to
    // reflect without downloading any image from the network.
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.85
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

function Artifact() {
  const group = useRef()
  const spin = useRef()
  const knot = useRef()
  const shell = useRef()
  const wire = useRef()
  const ringA = useRef()
  const ringB = useRef()
  const light = useRef()
  const mats = useRef([])
  const spinAcc = useRef(0)
  const smooth = useRef(0)
  const { size, scene } = useThree()
  const color = useMemo(() => new THREE.Color(), [])
  const reg = (m) => m && !mats.current.includes(m) && mats.current.push(m)

  useFrame((state, dt) => {
    const narrow = size.width / size.height < 0.85
    const kf = narrow ? KF_NARROW : KF_WIDE
    const i = Math.min(kf.length - 2, Math.floor(S.s))
    const t = S.s - i
    const a = kf[i]
    const b = kf[i + 1]
    const k = S.reduced ? 100 : 3.2
    const g = group.current
    g.position.x = damp(g.position.x, lerp(a.x, b.x, t), k, dt)
    g.position.y = damp(g.position.y, lerp(a.y, b.y, t), k, dt)
    g.position.z = damp(g.position.z, lerp(a.z, b.z, t), k, dt)
    g.scale.setScalar(damp(g.scale.x, lerp(a.s, b.s, t), k, dt))

    // Pointer parallax
    g.rotation.x = damp(g.rotation.x, S.reduced ? 0 : -S.mouse.y * 0.28, 3, dt)
    g.rotation.y = damp(g.rotation.y, S.reduced ? 0 : S.mouse.x * 0.4, 3, dt)

    // Idle motion + scroll-linked rotation
        const time = S.reduced ? 0 : state.clock.elapsedTime
    // Smoothed scroll value, so a fast scroll can't whip the object around
    smooth.current = damp(smooth.current, S.y * 0.0011, S.reduced ? 100 : 4, dt)
    const scroll = smooth.current
    // The knot's idle spin is ACCUMULATED frame by frame. (Multiplying the clock
    // by a changing speed made the angle sweep wildly as the speed changed.)
    const labBoost = 1 + Math.max(0, 1 - Math.abs(S.s - 4)) * 0.8 // a little faster in the lab
    if (!S.reduced) spinAcc.current += Math.min(dt, 0.05) * labBoost
    const spinT = spinAcc.current
    knot.current.rotation.set(spinT * 0.13 + scroll * 0.6, spinT * 0.2 + scroll, scroll * 0.4)
    shell.current.rotation.set(-time * 0.07 - scroll * 0.3, time * 0.09 + scroll * 0.5, 0)
    wire.current.rotation.set(time * 0.05 + scroll * 0.4, -time * 0.08 - scroll * 0.7, 0)
    ringA.current.rotation.set(Math.PI / 2.4 + scroll * 0.5, time * 0.1, scroll * 0.3)
    ringB.current.rotation.set(Math.PI / 1.7 - scroll * 0.4, -time * 0.14, -scroll * 0.2)
    spin.current.rotation.y = scroll * 0.25

    // Mood colour
    color.setRGB(S.accent[0] / 255, S.accent[1] / 255, S.accent[2] / 255)
    mats.current.forEach((m) => m.color.copy(color))
    light.current.color.copy(color)
    if (scene.fog) scene.fog.color.setRGB(S.bg[0] / 255, S.bg[1] / 255, S.bg[2] / 255)
  })

  return (
    <group ref={group}>
      <group ref={spin}>
        {/* Metallic core */}
        <mesh ref={knot}>
          <torusKnotGeometry args={[0.85, 0.27, 240, 36, 2, 3]} />
          <meshStandardMaterial color="#cfd3da" metalness={1} roughness={0.17} envMapIntensity={1.25} />
        </mesh>
        {/* Glass shell */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshPhysicalMaterial
            color="#aab8ff"
            metalness={0}
            roughness={0.04}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.13}
            side={THREE.DoubleSide}
            depthWrite={false}
            envMapIntensity={1.6}
          />
        </mesh>
        {/* Technical wireframe */}
        <mesh ref={wire}>
          <icosahedronGeometry args={[2.1, 1]} />
          <meshBasicMaterial ref={reg} wireframe transparent opacity={0.2} color="#9db8ff" />
        </mesh>
        {/* Orbit rings */}
        <mesh ref={ringA}>
          <torusGeometry args={[2.65, 0.007, 8, 200]} />
          <meshBasicMaterial ref={reg} transparent opacity={0.7} color="#9db8ff" />
        </mesh>
        <mesh ref={ringB}>
          <torusGeometry args={[3.05, 0.006, 8, 200]} />
          <meshBasicMaterial ref={reg} transparent opacity={0.4} color="#9db8ff" />
        </mesh>
      </group>
      <pointLight ref={light} position={[2.5, 2.5, 3.5]} intensity={60} distance={14} decay={2} color="#9db8ff" />
    </group>
  )
}

function Particles({ count }) {
  const ref = useRef()
  const matRef = useRef()
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 26
      p[i * 3 + 1] = (Math.random() - 0.5) * 30
      p[i * 3 + 2] = -Math.random() * 16 + 3
    }
    return p
  }, [count])
  const color = useMemo(() => new THREE.Color(), [])

  useFrame((state, dt) => {
    const g = ref.current
    const time = S.reduced ? 0 : state.clock.elapsedTime
    g.position.y = S.y * 0.0015 // slower than the page → depth parallax
    g.rotation.y = time * 0.012 + S.y * 0.00008
    g.position.x = damp(g.position.x, S.reduced ? 0 : -S.mouse.x * 0.5, 2, dt)
    color.setRGB(S.accent[0] / 255, S.accent[1] / 255, S.accent[2] / 255).lerp(new THREE.Color(1, 1, 1), 0.55)
    matRef.current.color.copy(color)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} size={0.035} sizeAttenuation transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Rig() {
  useFrame((state, dt) => {
    state.camera.position.x = damp(state.camera.position.x, S.reduced ? 0 : S.mouse.x * 0.35, 2.5, dt)
    state.camera.position.y = damp(state.camera.position.y, S.reduced ? 0 : -S.mouse.y * 0.2, 2.5, dt)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

// With reduced motion we don't animate continuously; just redraw on scroll.
function DemandRedraw() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (!S.reduced) return
    const fn = () => invalidate()
    S.subs.add(fn)
    window.addEventListener('resize', fn)
    fn()
    return () => {
      S.subs.delete(fn)
      window.removeEventListener('resize', fn)
    }
  }, [invalidate])
  return null
}

export default function Scene() {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 859px)').matches
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 60 }}
        gl={{ antialias: !mobile, powerPreference: 'high-performance' }}
        frameloop={S.reduced ? 'demand' : 'always'}
      >
        <fog attach="fog" args={['#040405', 7, 19]} />
        <ambientLight intensity={0.15} />
        <Environment />
        <Artifact />
        <Particles count={mobile ? 600 : 1700} />
        <Rig />
        <DemandRedraw />
      </Canvas>
    </div>
  )
}
