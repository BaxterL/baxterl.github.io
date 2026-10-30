import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Book } from './components/Book'
import { Masthead, Nav, Rail } from './components/Chrome'
import { FlipField, type FlipHandle } from './components/FlipField'
import { SectionView } from './components/Sections'
import { SECTION_ORDER, type SectionId } from './core/poses'
import { PosterEngine } from './core/engine'
import type { Gesture } from './core/painter'
import { SoundKit } from './core/sound'

const hashFor = (s: SectionId) => (s === 'home' ? '#/' : `#/${s}`)

/** five mechanical verbs; the flip wall is one of them */
type Verb = Gesture | 'flip'
const GESTURES: Verb[] = ['bars', 'flip', 'disc', 'shutter', 'tiles']

function parseHash(): { book: boolean; section: SectionId } {
  const raw = window.location.hash.replace(/^#\/?/, '').trim()
  if (raw === 'book') return { book: true, section: 'home' }
  const found = SECTION_ORDER.find((id) => id === raw)
  return { book: false, section: found ?? 'home' }
}

export default function App() {
  const initial = useRef(parseHash())
  const [section, setSection] = useState<SectionId>(initial.current.section)
  const [book, setBook] = useState(initial.current.book)
  const [entering, setEntering] = useState(false)

  const kitRef = useRef<SoundKit | null>(null)
  const [soundOn] = useState(() => {
    kitRef.current = new SoundKit()
    return kitRef.current.enabled
  })
  const [soundEnabled, setSoundEnabled] = useState(soundOn)

  const engineRef = useRef<PosterEngine | null>(null)
  const flipRef = useRef<FlipHandle>(null)
  const sectionRef = useRef<SectionId>(initial.current.section)
  const bookRef = useRef(initial.current.book)
  const busyRef = useRef(false)
  const enterTimer = useRef(0)
  const posterRef = useRef<HTMLCanvasElement>(null)
  const curtainRef = useRef<HTMLCanvasElement>(null)
  const gestureRef = useRef(0)

  /* ------------------------------------------------- engine / intro / input */
  useEffect(() => {
    const engine = new PosterEngine({ sound: (cue, gain) => kitRef.current?.play(cue, gain) })
    engineRef.current = engine
    if (posterRef.current && curtainRef.current) engine.attach(posterRef.current, curtainRef.current)

    const onResize = () => engine.resize()
    const onPointer = (e: PointerEvent) => {
      engine.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      )
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    void engine.playIntro(initial.current.section)
    const enter = window.setTimeout(() => setEntering(true), 1020)

    return () => {
      window.clearTimeout(enter)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  /* ------------------------------------------------------------- navigation */
  const navigate = useCallback((next: SectionId) => {
    if (bookRef.current) {
      bookRef.current = false
      setBook(false)
      window.history.replaceState(null, '', hashFor(sectionRef.current))
    }
    if (next === sectionRef.current || busyRef.current) return
    const engine = engineRef.current
    window.clearTimeout(enterTimer.current)
    if (!engine) {
      sectionRef.current = next
      setSection(next)
      return
    }
    engine.finishIntro()
    busyRef.current = true
    kitRef.current?.play('whoosh', 0.8)

    const run = async () => {
      // five mechanical verbs, cycled — never the same transition twice in a row
      const gesture = GESTURES[gestureRef.current++ % GESTURES.length]
      if (gesture === 'flip') await flipRef.current?.cover()
      else await engine.curtainCover(gesture)
      sectionRef.current = next
      setSection(next)
      setEntering(false)
      window.history.replaceState(null, '', hashFor(next))
      engine.morphTo(next)
      kitRef.current?.play('clack')
      const revealed =
        gesture === 'flip' ? flipRef.current?.reveal() : engine.curtainReveal()
      enterTimer.current = window.setTimeout(() => setEntering(true), 170)
      await revealed
      busyRef.current = false
    }
    void run()
  }, [])

  const closeBook = useCallback(() => {
    window.history.replaceState(null, '', hashFor(sectionRef.current))
    bookRef.current = false
    setBook(false)
  }, [])

  const toggleSound = useCallback(() => {
    const kit = kitRef.current
    if (!kit) return
    const next = !kit.enabled
    kit.setEnabled(next)
    setSoundEnabled(next)
  }, [])

  /* --------------------------------------------------------------- keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === 'Escape' && bookRef.current) {
        closeBook()
        return
      }
      if (bookRef.current) return
      const idx = SECTION_ORDER.indexOf(sectionRef.current)
      const down = ['ArrowDown', 'ArrowRight', 'PageDown', ' ']
      const up = ['ArrowUp', 'ArrowLeft', 'PageUp']
      if (down.includes(e.key)) {
        e.preventDefault()
        navigate(SECTION_ORDER[(idx + 1) % SECTION_ORDER.length])
      } else if (up.includes(e.key)) {
        e.preventDefault()
        navigate(SECTION_ORDER[(idx - 1 + SECTION_ORDER.length) % SECTION_ORDER.length])
      } else if (/^[1-5]$/.test(e.key)) {
        navigate(SECTION_ORDER[Number(e.key) - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, closeBook])

  /* ------------------------------------------------------------ hash routes */
  useEffect(() => {
    const onHash = () => {
      const parsed = parseHash()
      if (parsed.book !== bookRef.current) {
        bookRef.current = parsed.book
        setBook(parsed.book)
      }
      if (!parsed.book && parsed.section !== sectionRef.current) navigate(parsed.section)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [navigate])

  /* ------------------------------------------- one page, one viewport: lock */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (bookRef.current) return
      if (Math.abs(e.deltaY) > 0) e.preventDefault()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  /* ------------------------------------------------------------------ swipe */
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null)
  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, t: performance.now() }
  }
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = swipe.current
    swipe.current = null
    if (!start || bookRef.current) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) < 46 && Math.abs(dy) < 46) return
    if (performance.now() - start.t > 900) return
    const idx = SECTION_ORDER.indexOf(sectionRef.current)
    if (Math.abs(dx) > Math.abs(dy)) {
      navigate(SECTION_ORDER[(idx + (dx < 0 ? 1 : SECTION_ORDER.length - 1)) % SECTION_ORDER.length])
    } else {
      navigate(SECTION_ORDER[(idx + (dy < 0 ? 1 : SECTION_ORDER.length - 1)) % SECTION_ORDER.length])
    }
  }

  return (
    <div className="app" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <canvas ref={posterRef} className="plate plate--poster" aria-hidden="true" />
      <canvas ref={curtainRef} className="plate plate--curtain" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <FlipField ref={flipRef} />
      <div className="frame-marks" aria-hidden="true" />
      <div className="vrail vrail--left" aria-hidden="true">
        FORM · FARBE · FUNKTION
      </div>
      <div className="vrail vrail--right" aria-hidden="true">
        平板印刷 · 单屏 · 无滚动
      </div>

      <Masthead soundOn={soundEnabled} onToggleSound={toggleSound} />
      <Nav current={section} go={navigate} onHover={() => kitRef.current?.play('tick', 0.5)} />

      <main className={`stage${entering ? ' is-entering' : ''}`} id="main">
        <SectionView section={section} go={navigate} />
      </main>

      <Rail soundOn={soundEnabled} onToggleSound={toggleSound} />
      {book && <Book onClose={closeBook} />}
    </div>
  )
}



