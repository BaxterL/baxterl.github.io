import { gsap } from 'gsap'
import { METRICS, type Metrics } from './layout'
import { drawActor, drawCurtain, drawGrid, type CurtainState, type Gesture } from './painter'
import { ACTORS, POSES, POSES_M, type ActorSpec, type Pose, type SectionId } from './poses'

interface ActorState {
  spec: ActorSpec
  pose: Pose
}

type Cue = 'tick' | 'thock' | 'clack' | 'blip' | 'click' | 'whoosh' | 'flap' | 'impact'

const GESTURES: Gesture[] = ['bars', 'disc', 'tiles', 'shutter']
const HIDDEN: Pose = { x: 0.5, y: 0.5, s: 0.001, r: 0, a: 0 }

/** Owns the two canvas plates and the mechanical clock. */
export class PosterEngine {
  private posterEl: HTMLCanvasElement | null = null
  private curtainEl: HTMLCanvasElement | null = null
  private pctx: CanvasRenderingContext2D | null = null
  private cctx: CanvasRenderingContext2D | null = null
  private dpr = 1
  private mt: Metrics = METRICS(1440, 900)
  private portrait = false
  private current: SectionId = 'home'
  private actors: ActorState[] = ACTORS.map((spec) => ({ spec, pose: { ...POSES.home[spec.id] } }))
  private order: number[] = []
  private clock = 0
  private raf = 0
  private last = 0
  private running = false
  private pointer = { x: 0, y: 0 }
  private drift = { x: 0, y: 0 }
  private grid = { v: 0 }
  private curtain: CurtainState = { p: 0, gesture: 'bars', revealing: false }
  private morphTl: gsap.core.Timeline | null = null
  private introTl: gsap.core.Timeline | null = null
  private transitionTl: gsap.core.Timeline | null = null
  private gestureIndex = 0
  private sound: (cue: Cue, gain?: number) => void
  private reduce: boolean

  constructor(opts: { sound?: (cue: Cue, gain?: number) => void } = {}) {
    this.sound = opts.sound ?? (() => {})
    this.reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // paint order: black plate first, ink and colour over it, paper knockouts last
    const z = (spec: ActorSpec) => (spec.id === 'blockInk' ? 0 : spec.ink === 'paper' ? 2 : 1)
    this.order = ACTORS.map((_, i) => i).sort((a, b) => z(ACTORS[a]) - z(ACTORS[b]))
  }

  attach(poster: HTMLCanvasElement, curtain: HTMLCanvasElement) {
    this.posterEl = poster
    this.curtainEl = curtain
    this.pctx = poster.getContext('2d')
    this.cctx = curtain.getContext('2d')
    this.resize()
    this.start()
  }

  resize() {
    if (!this.posterEl || !this.curtainEl) return
    const rect = this.posterEl.getBoundingClientRect()
    const w = Math.max(320, Math.round(rect.width))
    const h = Math.max(320, Math.round(rect.height))
    this.mt = METRICS(w, h)
    const portrait = h > w * 1.02
    const flipped = portrait !== this.portrait
    this.portrait = portrait
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    for (const el of [this.posterEl, this.curtainEl]) {
      el.width = Math.round(w * this.dpr)
      el.height = Math.round(h * this.dpr)
    }
    if (flipped) this.snapTo(this.current)
    this.render()
  }

  private posesFor(id: SectionId) {
    return this.portrait ? POSES_M[id] : POSES[id]
  }

  private poseOf(section: SectionId, actorId: string): Pose {
    return this.posesFor(section)[actorId] ?? HIDDEN
  }

  private snapTo(section: SectionId) {
    this.actors.forEach(({ spec, pose }) => {
      const t = this.poseOf(section, spec.id)
      pose.x = t.x
      pose.y = t.y
      pose.s = t.s
      pose.r = t.r
      pose.a = t.a
    })
    this.current = section
    this.render()
  }

  setPointer(nx: number, ny: number) {
    this.pointer.x = Math.max(-1, Math.min(1, nx))
    this.pointer.y = Math.max(-1, Math.min(1, ny))
  }

  start() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    const tick = () => {
      if (!this.running) return
      const now = performance.now()
      const dt = Math.min(0.05, (now - this.last) / 1000)
      this.last = now
      this.clock += dt
      const k = this.reduce ? 0 : Math.min(1, dt * 5)
      this.drift.x += (this.pointer.x * 9 - this.drift.x) * k
      this.drift.y += (this.pointer.y * 9 - this.drift.y) * k
      this.render()
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private render() {
    const ctx = this.pctx
    const cctx = this.cctx
    if (!ctx || !cctx) return
    const { w, h } = this.mt
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    cctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    cctx.clearRect(0, 0, w, h)

    drawGrid(ctx, this.mt, this.grid.v)
    for (const i of this.order) {
      const { spec, pose } = this.actors[i]
      drawActor(ctx, this.mt, spec, pose, {
        clock: this.clock,
        parallax: { x: this.drift.x, y: this.drift.y },
      })
    }
    drawCurtain(cctx, this.mt, this.curtain)
  }

  /** Landing choreography: the grid draws, then the plates drop dead on the line. */
  playIntro(): Promise<void> {
    this.introTl?.kill()
    this.current = 'home'
    if (this.reduce) {
      this.grid.v = 1
      this.snapTo('home')
      return Promise.resolve()
    }
    const tl = gsap.timeline()
    this.introTl = tl
    tl.fromTo(this.grid, { v: 0 }, { v: 1, duration: 1.15, ease: 'power2.out' }, 0)
    this.actors.forEach(({ spec, pose }, i) => {
      const target = this.poseOf('home', spec.id)
      pose.x = target.x
      pose.y = target.y + 0.13
      pose.s = target.s * 1.04
      pose.r = target.r
      pose.a = 0
      const at = 0.1 + i * 0.046
      tl.to(pose, { y: target.y, s: target.s, duration: 0.74, ease: 'power2.in' }, at)
      tl.to(pose, { a: target.a, duration: 0.24, ease: 'power2.out' }, at)
    })
    tl.call(() => this.sound('thock', 0.9), [], 0.16)
    tl.call(() => this.sound('clack', 0.8), [], 0.32)
    tl.call(() => this.sound('impact', 0.7), [], 0.62)
    tl.call(() => this.sound('tick', 0.7), [], 1.02)
    return new Promise((resolve) => tl.eventCallback('onComplete', resolve))
  }

  /** Skip the landing choreography and set the poster at once. */
  finishIntro() {
    if (!this.introTl) return
    this.introTl.kill()
    this.introTl = null
    this.grid.v = 1
    this.snapTo('home')
  }

  private morphTo(next: SectionId) {
    this.morphTl?.kill()
    this.current = next
    const tl = gsap.timeline()
    this.morphTl = tl
    this.actors.forEach(({ spec, pose }, i) => {
      const t = this.poseOf(next, spec.id)
      tl.to(
        pose,
        { x: t.x, y: t.y, s: t.s, r: t.r, a: t.a, duration: 0.68, ease: 'power2.inOut' },
        0.012 * i,
      )
    })
  }

  /** Close the plate, swap the page underneath, pull the plate off. */
  go(next: SectionId, onSwap: () => void): Promise<void> {
    this.transitionTl?.kill()
    const gesture = GESTURES[this.gestureIndex++ % GESTURES.length]
    if (this.reduce) {
      this.curtain.p = 0
      onSwap()
      this.snapTo(next)
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          this.curtain.p = 0
          this.curtain.revealing = false
          resolve()
        },
      })
      this.transitionTl = tl
      this.sound('whoosh', 0.85)
      tl.set(this.curtain, { gesture, revealing: false, p: 0 }, 0)
      tl.to(this.curtain, { p: 1, duration: 0.42, ease: 'power2.in' }, 0)
      tl.call(
        () => {
          onSwap()
          this.morphTo(next)
          this.sound('clack', 1)
        },
        [],
        0.43,
      )
      tl.set(this.curtain, { revealing: true }, 0.46)
      tl.to(this.curtain, { p: 0, duration: 0.52, ease: 'power2.inOut' }, 0.48)
    })
  }

  dispose() {
    this.stop()
    this.introTl?.kill()
    this.morphTl?.kill()
    this.transitionTl?.kill()
    gsap.killTweensOf(this.grid)
    this.actors.forEach(({ pose }) => gsap.killTweensOf(pose))
  }
}
