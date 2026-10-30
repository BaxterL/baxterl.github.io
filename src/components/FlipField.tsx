import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { gsap } from 'gsap'

export interface FlipHandle {
  cover: (label?: string) => Promise<void>
  reveal: () => Promise<void>
}

/** 5×7 bitmap digits — the wall is a flip-dot board, so the backs spell the
 *  section we are turning to. */
const GLYPH: Record<string, string[]> = {
  '0': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
}

/** A wall of cards that flip away to swap the page underneath.
 *  Front faces are transparent, backs are printed: at 0° the page shows
 *  through, at 180° the wall is solid, and turning on to 360° peels it off. */
export const FlipField = forwardRef<FlipHandle>(function FlipField(_props, ref) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState({ cols: 16, rows: 10, w: 1440, h: 900 })
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const reduceRef = useRef(false)

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compute = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const cols = w < 700 ? 8 : 16
      const size = w / cols
      setGrid({ cols, rows: Math.max(4, Math.ceil(h / size)), w, h })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('resize', compute)
      tlRef.current?.kill()
    }
  }, [])

  const tiles = () =>
    Array.from(fieldRef.current?.querySelectorAll<HTMLElement>('.flipfield__tile') ?? [])

  /** deterministic scatter so neighbouring cards never move in lock-step */
  const jitter = (i: number) => (((i * 2654435761) % 1000) / 1000) * 0.05

  /** alternating turn directions, like a flip-dot board */
  const dirs = (n: number) =>
    Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / grid.cols)
      const col = i % grid.cols
      return (row + col) % 2 === 0 ? 1 : -1
    })

  /** paint the backs: a bitmap section number, everything else ink */
  const paintBacks = (label: string) => {
    const backs = Array.from(
      fieldRef.current?.querySelectorAll<HTMLElement>('.flipfield__face--back') ?? [],
    )
    const wide = grid.cols >= 13 && grid.rows >= 9
    const chars = wide ? label.slice(0, 2).split('') : [label.slice(-1)]
    const pitch = wide ? 6 : 5
    const glyphRows = 7
    const offX = Math.floor((grid.cols - (chars.length * pitch - 1)) / 2)
    const offY = Math.floor((grid.rows - glyphRows) / 2)
    const on = new Set<number>()
    chars.forEach((ch, ci) => {
      const rows = GLYPH[ch] ?? GLYPH['0']
      rows.forEach((rowStr, ry) => {
        rowStr.split('').forEach((bit, rx) => {
          if (bit !== '1') return
          const col = offX + ci * pitch + rx
          const row = offY + ry
          if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return
          on.add(row * grid.cols + col)
        })
      })
    })
    backs.forEach((el, i) => {
      el.style.background = on.has(i) ? 'var(--red)' : 'var(--ink)'
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      cover: (label = '00') =>
        new Promise<void>((resolve) => {
          paintBacks(label)
          if (reduceRef.current) return resolve()
          const els = tiles()
          const dir = dirs(els.length)
          gsap.set(els, { rotateY: 0 })
          tlRef.current?.kill()
          const tl = gsap.timeline({ onComplete: resolve })
          tlRef.current = tl
          tl.to(
            els,
            {
              rotateY: (i: number) => dir[i] * 180,
              transformPerspective: 900,
              duration: 0.42,
              ease: 'power2.inOut',
              delay: (i: number) => jitter(i),
              stagger: { each: 0.001, from: 'center', grid: [grid.rows, grid.cols] },
            },
            0,
          )
        }),
      reveal: () =>
        new Promise<void>((resolve) => {
          if (reduceRef.current) return resolve()
          const els = tiles()
          const dir = dirs(els.length)
          tlRef.current?.kill()
          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(els, { rotateY: 0 })
              resolve()
            },
          })
          tlRef.current = tl
          tl.to(
            els,
            {
              rotateY: (i: number) => dir[i] * 360,
              transformPerspective: 900,
              duration: 0.46,
              ease: 'power2.inOut',
              delay: (i: number) => jitter(i),
              stagger: { each: 0.001, from: 'edges', grid: [grid.rows, grid.cols] },
            },
            0,
          )
        }),
    }),
    [grid],
  )

  return (
    <div
      className="flipfield"
      ref={fieldRef}
      aria-hidden="true"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
      }}
    >
      {Array.from({ length: grid.cols * grid.rows }).map((_, i) => (
        <div className="flipfield__tile" key={`${grid.cols}-${grid.rows}-${i}`}>
          <div className="flipfield__face flipfield__face--front" />
          <div
            className="flipfield__face flipfield__face--back"
            style={{ background: 'var(--ink)' }}
          />
        </div>
      ))}
    </div>
  )
})

