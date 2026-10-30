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

export type SplitMode = 'fan' | 'quad' | 'tri'

/** Every plate is printed in pieces that snap together. */
export const SPLIT: Partial<Record<ActorSpec['shape'], { mode: SplitMode; n: number }>> = {
  disc: { mode: 'fan', n: 4 },
  ring: { mode: 'fan', n: 4 },
  quarter: { mode: 'fan', n: 2 },
  half: { mode: 'fan', n: 3 },
  square: { mode: 'quad', n: 4 },
  bar: { mode: 'quad', n: 2 },
  triangle: { mode: 'tri', n: 3 },
}

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

/** clip path for one piece of the plate, in local (untransformed) coordinates */
function piecePath(ctx: CanvasRenderingContext2D, mode: SplitMode, k: number, n: number, m: number) {
  ctx.beginPath()
  if (mode === 'fan') {
    const a0 = (k / n) * Math.PI * 2
    const a1 = ((k + 1) / n) * Math.PI * 2
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, m * 1.5, a0, a1)
    ctx.closePath()
  } else if (mode === 'quad') {
    if (n === 2) {
      ctx.rect(-m * 1.2, k === 0 ? -m * 1.4 : 0, m * 2.4, m * 1.4)
    } else {
      const x = k % 2 === 0 ? -m : 0
      const y = k < 2 ? -m : 0
      ctx.rect(x, y, m, m)
    }
  } else {
    const rr = m * 0.62
    const pts = [0, 1, 2].map((i) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 3
      return [Math.cos(a) * rr, Math.sin(a) * rr] as const
    })
    const a = pts[k]
    const b = pts[(k + 1) % 3]
    ctx.moveTo(0, 0)
    ctx.lineTo(a[0], a[1])
    ctx.lineTo(b[0], b[1])
    ctx.closePath()
  }
}

/** where a piece sits relative to the assembled plate */
function pieceOffset(mode: SplitMode, k: number, n: number, m: number, away: number) {
  if (mode === 'fan') {
    const mid = ((k + 0.5) / n) * Math.PI * 2
    return {
      dx: Math.cos(mid) * m * 0.16 * away,
      dy: Math.sin(mid) * m * 0.16 * away,
      rot: away * (k % 2 === 0 ? -1 : 1) * 0.55,
    }
  }
  if (mode === 'quad') {
    if (n === 2) {
      return { dx: 0, dy: (k === 0 ? -1 : 1) * m * 0.34 * away, rot: 0 }
    }
    const dx = (k % 2 === 0 ? -1 : 1) * m * 0.3 * away
    const dy = (k < 2 ? -1 : 1) * m * 0.3 * away
    return { dx, dy, rot: away * (k % 2 === 0 ? -0.12 : 0.12) }
  }
  const mid = -Math.PI / 2 + ((k + 0.5) * Math.PI * 2) / 3
  return {
    dx: Math.cos(mid) * m * 0.3 * away,
    dy: Math.sin(mid) * m * 0.3 * away,
    rot: away * (k === 0 ? -0.3 : 0.25),
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
  /** 1 = assembled, 0 = pieces exploded */
  asm?: number
}

export function drawActor(
  ctx: CanvasRenderingContext2D,
  mt: Metrics,
  spec: ActorSpec,
  pose: Pose,
  opt: DrawActorOptions,
) {
  const a = pose.a
  if (a <= 0.002 || pose.s <= 0.002) return
  const m = pose.s * mt.m
  const x = pose.x * mt.w + (opt.parallax?.x ?? 0)
  const y = pose.y * mt.h + (opt.parallax?.y ?? 0)
  const rot = pose.r + detentAngle(spec, opt.clock)
  const away = 1 - clamp(opt.asm ?? 1)
  const split = SPLIT[spec.shape]

  const drawOne = (piece: { k: number; n: number; mode: SplitMode } | null) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = a
    if (piece) {
      const off = pieceOffset(piece.mode, piece.k, piece.n, m, away)
      ctx.translate(off.dx, off.dy)
      ctx.rotate(off.rot)
      piecePath(ctx, piece.mode, piece.k, piece.n, m)
      ctx.clip()
    }
    ctx.fillStyle = INK_COLOR[spec.ink]
    if (spec.ink === 'paper') {
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

  if (!split || away <= 0.002) {
    drawOne(null)
    return
  }
  for (let k = 0; k < split.n; k++) {
    drawOne({ k, n: split.n, mode: split.mode })
  }
}

