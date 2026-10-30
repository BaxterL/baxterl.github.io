import { gsap } from 'gsap'
import { METRICS, type Metrics } from './layout'
import { drawActor, drawCurtain, drawGrid, type CurtainState, type Gesture } from './painter'
import { ACTORS, POSES, POSES_M, type ActorSpec, type Pose, type SectionId } from './poses'

interface ActorState {
  spec: ActorSpec
  pose: Pose
  /** 1 = assembled, 0 = pieces exploded */
  asm: number
}

type Cue = 'tick' | 'thock' | 'clack' | 'blip' | 'click' | 'whoosh' | 'flap' | 'impact'

const HIDDEN: Pose = { x: 0.5, y: 0.5, s: 0.001, r: 0, a: 0 }

/** Owns the poster plate and the mechanical clock. */
export class PosterEngine {
  private posterEl: HTMLCanvasElement | null = null
  private curtainEl: HTMLCanvasElement | null = null
  private pctx: CanvasRenderingContext2D | null = null
  private cctx: CanvasRenderingContext2D | null = null
  private curtain: CurtainState = { p: 0, gesture: 'bars', revealing: false }
  private curtainTl: gsap.core.Animation | null = null
  private dpr = 1
  private mt: Metrics = METRICS(1440, 900)
  private portrait = false
  private current: SectionId = 'home'
  private actors: ActorState[] = ACTORS.map((spec) => ({
    spec,
    pose: { ...POSES.home[spec.id] },
    asm: 1,
  }))
  private order: number[] = []
  private clock = 0
  private raf = 0
  private last = 0
  private running = false
  private pointer = { x: 0, y: 0 }
  private drift = { x: 0, y: 0 }
  private grid = { v: 0 }
  private morphTl: gsap.core.Timeline | null = null
  private introTl: gsap.core.Timeline | null = null
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

  /** One of the mechanical plates: close, then peel. */
  curtainCover(gesture: Gesture): Promise<void> {
    this.curtainTl?.kill()
    this.curtain.gesture = gesture
    this.curtain.revealing = false
    return new Promise((resolve) => {
      this.curtainTl = gsap.fromTo(
        this.curtain,
        { p: 0 },
        { p: 1, duration: 0.46, ease: 'power2.in', onComplete: resolve },
      )
    })
  }

  curtainReveal(): Promise<void> {
    this.curtainTl?.kill()
    this.curtain.revealing = true
    return new Promise((resolve) => {
      this.curtainTl = gsap.to(this.curtain, {
        p: 0,
        duration: 0.54,
        ease: 'power2.inOut',
        onComplete: () => {
          this.curtain.revealing = false
          this.curtain.p = 0
          resolve()
        },
      })
    })
  }

  resize() {
    if (!this.posterEl) return
    const rect = this.posterEl.getBoundingClientRect()
    const w = Math.max(320, Math.round(rect.width))
    const h = Math.max(320, Math.round(rect.height))
    this.mt = METRICS(w, h)
    const portrait = h > w * 1.02
    const flipped = portrait !== this.portrait
    this.portrait = portrait
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    for (const el of [this.posterEl, this.curtainEl]) {
      if (!el) continue
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
    if (!ctx) return
    const { w, h } = this.mt
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    if (this.cctx) {
      this.cctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
      this.cctx.clearRect(0, 0, w, h)
      drawCurtain(this.cctx, this.mt, this.curtain)
    }
    drawGrid(ctx, this.mt, this.grid.v)
    for (const i of this.order) {
      const { spec, pose, asm } = this.actors[i]
      drawActor(ctx, this.mt, spec, pose, {
        clock: this.clock,
        parallax: { x: this.drift.x, y: this.drift.y },
        asm,
      })
    }
  }

  /** Landing choreography: the grid draws, then the plates are assembled piece by piece. */
  playIntro(start: SectionId = 'home'): Promise<void> {
    this.introTl?.kill()
    this.current = start
    if (this.reduce) {
      this.grid.v = 1
      this.actors.forEach((a) => (a.asm = 1))
      this.snapTo(start)
      return Promise.resolve()
    }
    const tl = gsap.timeline()
    this.introTl = tl
    tl.fromTo(this.grid, { v: 0 }, { v: 1, duration: 1.1, ease: 'power2.out' }, 0)
    this.actors.forEach((actor, i) => {
      const { spec, pose } = actor
      const target = this.poseOf(start, spec.id)
      pose.x = target.x
      pose.y = target.y + 0.1
      pose.s = target.s
      pose.r = target.r
      pose.a = 0
      actor.asm = 0
      const at = 0.12 + i * 0.045
      tl.to(pose, { y: target.y, duration: 0.7, ease: 'power2.in' }, at)
      tl.to(pose, { a: target.a, duration: 0.2, ease: 'power2.out' }, at)
      tl.to(actor, { asm: 1, duration: 0.72, ease: 'power2.out' }, at + 0.06)
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
    this.actors.forEach((a) => (a.asm = 1))
    this.snapTo(this.current)
  }

  /** Re-print the poster for a new section: pieces scatter, then snap together. */
  morphTo(next: SectionId) {
    this.morphTl?.kill()
    this.current = next
    const tl = gsap.timeline()
    this.morphTl = tl
    this.actors.forEach((actor, i) => {
      const { spec, pose } = actor
      const t = this.poseOf(next, spec.id)
      if (this.reduce) {
        Object.assign(pose, t)
        actor.asm = 1
        return
      }
      tl.set(actor, { asm: 0.15 }, 0.01 * i)
      tl.to(
        pose,
        { x: t.x, y: t.y, s: t.s, r: t.r, a: t.a, duration: 0.6, ease: 'power2.inOut' },
        0.01 * i,
      )
      tl.to(actor, { asm: 1, duration: 0.72, ease: 'power2.out' }, 0.06 + 0.012 * i)
    })
  }

  dispose() {
    this.stop()
    this.introTl?.kill()
    this.morphTl?.kill()
    this.curtainTl?.kill()
    gsap.killTweensOf(this.grid)
    this.actors.forEach((actor) => {
      gsap.killTweensOf(actor.pose)
      gsap.killTweensOf(actor)
    })
  }
}





