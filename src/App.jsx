import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Atmosphere from './components/Atmosphere'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import TechStack from './components/TechStack'
import Lab from './components/Lab'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { getLenis, initScroll } from './lib/scroll'

const Scene = lazy(() => import('./components/Scene'))

// If WebGL fails for any reason the site still works — you just lose the 3D.
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const [ready, setReady] = useState(false) // loader finished
  const [gone, setGone] = useState(false) // loader removed
  const [webgl] = useState(hasWebGL)
  const done = useCallback(() => setReady(true), [])

  // Smooth scrolling (skipped for reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return initScroll()
  }, [])

  // No scrolling while the loader is up
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready)
    const l = getLenis()
    if (l) (ready ? l.start() : l.stop())
  }, [ready])

  // Failsafe: never leave the visitor on a stuck loader
  useEffect(() => {
    const id = setTimeout(done, 4000)
    return () => clearTimeout(id)
  }, [done])

  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => setGone(true), 1200)
    return () => clearTimeout(id)
  }, [ready])

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Atmosphere />
      {webgl && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      {!gone && <Loader onDone={done} leaving={ready} />}
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <About />
        <Projects />
        <TechStack />
        <Lab />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
