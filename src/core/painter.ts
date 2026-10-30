import { clamp, DEG, detent, io2 } from './ease'
import { colLines, type Metrics, rowLines } from './layout'
import type { ActorSpec, Ink, Pose } from './poses'

export const INK_COLOR: Record<Ink, string> = {
  red: '#E03C31',
  yellow: '#F2B705',
  blue: '#1E4FA3',
  ink: '#111111',
  paper: '#F1E9DA',
}

export type Gesture = 'bars' | 'disc' | 'tiles' | 'shutter'

export interface CurtainState {
  /** 0 = page visible, 1 = plate fully closed */
  p: number
  gesture: Gesture
  /** true while the plate is being pulled off again */
  revealing: boolean
}

/* ------------------------------------------------------------------ grid */

/** Hairline modular grid. Lines draw outward from the centre axis. */
export function drawGrid(ctx: CanvasRenderingContext2D, mt: Metrics, p: number) {
  if (p <= 0) return
  const e = io2(clamp(p))
  ctx.save()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(17,17,17,0.13)'
  ctx.beginPath()
  const xs = colLines(mt)
  const ys = rowLines(mt)
  const cy = mt.h / 2
  const cx = mt.w / 2
  xs.forEach((x, i) => {
    if (i === 0 || i === xs.length - 1) return
    const half = (mt.h / 2 - mt.my) * e
    ctx.moveTo(Math.round(x) + 0.5, cy - half)
    ctx.lineTo(Math.round(x) + 0.5, cy + half)
  })
  ys.forEach((y, i) => {
    if (i === 0 || i === ys.length - 1) return
    const half = (mt.w / 2 - mt.mx) * e
    ctx.moveTo(cx - half, Math.round(y) + 0.5)
    ctx.lineTo(cx + half, Math.round(y) + 0.5)
  })
  ctx.stroke()

  // construction targets — the off-beat crosses that pre-announce a landing
  const markAlpha = 0.32 * e
  const picks: Array<[number, number]> = [
    [xs[2], ys[2]],
    [xs[mt.cols - 2], ys[2]],
    [xs[2], ys[mt.rows - 2]],
    [xs[mt.cols - 2], ys[mt.rows - 2]],
  ]
  ctx.strokeStyle = `rgba(17,17,17,${markAlpha})`
  ctx.fillStyle = `rgba(17,17,17,${markAlpha})`
  for (const [x, y] of picks) drawTarget(ctx, x, y)
  ctx.restore()
}

function drawTarget(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const r = 9
  const arm = 22
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - arm, y)
  ctx.lineTo(x - r - 3, y)
  ctx.moveTo(x + r + 3, y)
  ctx.lineTo(x + arm, y)
  ctx.moveTo(x, y - arm)
  ctx.lineTo(x, y - r - 3)
  ctx.moveTo(x, y + r + 3)
  ctx.lineTo(x, y + arm)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y, 2, 0, Math.PI * 2)
  ctx.fill()
}

/* ---------------------------------------------------------------- actors */

function pathFor(ctx: CanvasRenderingContext2D, shape: ActorSpec['shape'], m: number) {
  ctx.beginPath()
  switch (shape) {
    case 'disc':
      ctx.arc(0, 0, m / 2, 0, Math.PI * 2)
      break
    case 'quarter':
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, m, 0, Math.PI / 2)
      ctx.closePath()
      break
    case 'half':
      ctx.moveTo(m / 2, 0)
      ctx.arc(0, 0, m / 2, 0, Math.PI)
      ctx.closePath()
      break
    case 'triangle': {
      const rr = m * 0.62
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 3
        const x = Math.cos(a) * rr
        const y = Math.sin(a) * rr
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      break
    }
    case 'square':
      ctx.rect(-m / 2, -m / 2, m, m)
      break
    case 'bar':
      ctx.rect(-m * 0.11, -m * 1.2, m * 0.22, m * 2.4)
      break
    case 'ring':
      ctx.arc(0, 0, m / 2, 0, Math.PI * 2)
      break
    case 'cross':
      ctx.rect(-m * 0.5, -m * 0.06, m, m * 0.12)
      ctx.rect(-m * 0.06, -m * 0.5, m * 0.12, m)
      break
    case 'dots':
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
          const x = (i - 1) * m * 0.5
          const y = (j - 1) * m * 0.5
          ctx.moveTo(x + m * 0.06, y)
          ctx.arc(x, y, m * 0.06, 0, Math.PI * 2)
        }
      break
  }
}

/** The escapement: a held beat, then a quarter turn that stops dead. */
function detentAngle(spec: ActorSpec, clock: number) {
  if (!spec.detent) return 0
  const { every, phase, turns } = spec.detent
  const u = Math.max(0, (clock - phase) / every)
  const k = Math.floor(u)
  return turns * (k + detent(u - k)) * 90 * DEG
}

export interface DrawActorOptions {
  clock: number
  parallax?: { x: number; y: number }
  /** fade the whole plate (used while the curtain is closed) */
  alpha?: number
}

export function drawActor(
  ctx: CanvasRenderingContext2D,
  mt: Metrics,
  spec: ActorSpec,
  pose: Pose,
  opt: DrawActorOptions,
) {
  const a = pose.a * (opt.alpha ?? 1)
  if (a <= 0.002 || pose.s <= 0.002) return
  const m = pose.s * mt.m
  const x = pose.x * mt.w + (opt.parallax?.x ?? 0)
  const y = pose.y * mt.h + (opt.parallax?.y ?? 0)
  const rot = pose.r + detentAngle(spec, opt.clock)

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.globalAlpha = a
  ctx.fillStyle = INK_COLOR[spec.ink]

  if (spec.ink === 'paper') {
    // a paper shape is a knockout punched through the black plate
    ctx.globalCompositeOperation = 'source-over'
    pathFor(ctx, spec.shape, m)
    if (spec.shape === 'ring') {
      ctx.lineWidth = Math.max(1.5, m * 0.075)
      ctx.strokeStyle = INK_COLOR.paper
      ctx.stroke()
    } else {
      ctx.fill()
    }
  } else {
    // ink overprints multiply into the paper — and into each other
    ctx.globalCompositeOperation = 'multiply'
    pathFor(ctx, spec.shape, m)
    if (spec.shape === 'ring') {
      ctx.lineWidth = Math.max(1.5, m * 0.075)
      ctx.strokeStyle = INK_COLOR[spec.ink]
      ctx.stroke()
    } else {
      // slight plate misregistration: a second strike a hair off the first
      ctx.globalAlpha = a * 0.16
      ctx.translate(1.4, -1.1)
      ctx.fill()
      ctx.translate(-1.4, 1.1)
      ctx.globalAlpha = a
      ctx.fill()
    }
  }
  ctx.restore()
}

/* --------------------------------------------------------------- curtain */

const BARS = 12
const TILE_COLS = 8
const TILE_ROWS = 5
const SHUTTER = 6

/** The plate that closes over the page: every navigation is one mechanical verb. */
export function drawCurtain(ctx: CanvasRenderingContext2D, mt: Metrics, s: CurtainState) {
  const p = clamp(s.p)
  if (p <= 0.0005) return
  const q = s.revealing ? 1 - p : p

  ctx.save()
  ctx.fillStyle = INK_COLOR.ink

  /** staggered local progress: 0 = open, 1 = this part of the plate has landed */
  const local = (base: number, index: number, count: number, step: number, reverse: boolean) => {
    const maxOff = (count - 1) * step
    const i = reverse ? count - 1 - index : index
    return io2(clamp((base - i * step) / (1 - maxOff)))
  }

  if (s.gesture === 'bars') {
    // twelve columns, exactly on the modular grid, printed left to right
    const bw = mt.w / BARS + 0.5
    for (let i = 0; i < BARS; i++) {
      const l = s.revealing ? 1 - local(q, i, BARS, 0.032, true) : local(q, i, BARS, 0.032, false)
      if (l <= 0.001) continue
      ctx.fillStyle = i === 5 ? INK_COLOR.red : i === 9 ? INK_COLOR.blue : INK_COLOR.ink
      const hh = mt.h * l
      ctx.fillRect(i * bw, s.revealing ? 0 : mt.h - hh, bw, hh)
    }
  } else if (s.gesture === 'shutter') {
    const bh = mt.h / SHUTTER + 0.5
    for (let i = 0; i < SHUTTER; i++) {
      const l = s.revealing
        ? 1 - local(q, i, SHUTTER, 0.07, true)
        : local(q, i, SHUTTER, 0.07, false)
      if (l <= 0.001) continue
      const ww = mt.w * l
      const x = i % 2 === 0 ? 0 : mt.w - ww
      ctx.fillStyle = i === 2 ? INK_COLOR.blue : INK_COLOR.ink
      ctx.fillRect(x, i * bh, ww, bh)
    }
  } else if (s.gesture === 'tiles') {
    const cw = mt.w / TILE_COLS
    const ch = mt.h / TILE_ROWS
    const rows = TILE_COLS + TILE_ROWS - 1
    for (let r = 0; r < TILE_ROWS; r++) {
      for (let c = 0; c < TILE_COLS; c++) {
        const rank = c + r
        const l = s.revealing
          ? 1 - local(q, rank, rows, 0.045, true)
          : local(q, rank, rows, 0.045, false)
        if (l <= 0.001) continue
        ctx.fillStyle = (c * 3 + r) % 11 === 0 ? INK_COLOR.yellow : INK_COLOR.ink
        const hh = ch * l
        ctx.fillRect(c * cw, r * ch + (ch - hh) / 2, cw + 0.5, hh)
      }
    }
  } else {
    // two quarter-plates sweeping from opposite corners
    const e = io2(q)
    const r = Math.hypot(mt.w, mt.h) * 1.02
    const swing = s.revealing ? e : 1 - e
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, r, 90 * DEG * swing, 90 * DEG * swing + Math.PI / 2)
    ctx.closePath()
    ctx.fillStyle = INK_COLOR.ink
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.translate(mt.w, mt.h)
    const b0 = Math.PI + 90 * DEG * swing
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, r, b0, b0 + Math.PI / 2)
    ctx.closePath()
    ctx.fillStyle = INK_COLOR.ink
    ctx.fill()
    ctx.restore()
    const accent = s.revealing ? 1 - e : e
    if (accent > 0.12) {
      // a red plate rides underneath for one beat
      ctx.save()
      ctx.globalAlpha = clamp((accent - 0.12) * 2.4) * 0.92
      ctx.fillStyle = INK_COLOR.red
      ctx.beginPath()
      ctx.moveTo(mt.w, 0)
      ctx.arc(mt.w, 0, r * 0.5, Math.PI * 0.78, Math.PI * 1.22)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
  }

  if (p > 0.965) {
    ctx.globalAlpha = 1
    ctx.fillStyle = INK_COLOR.ink
    ctx.fillRect(0, 0, mt.w, mt.h)
  }
  ctx.restore()
}
