/** Layout metrics shared by the canvas plates and the CSS modular grid.
 *  Keep these formulas in sync with the :root variables in styles/index.css. */

export interface Metrics {
  w: number
  h: number
  /** outer margin — CSS: clamp(18px, 4.2vw, 64px) */
  mx: number
  /** outer margin — CSS: clamp(16px, 3.4vh, 44px) */
  my: number
  /** one module: the shortest useful unit of the poster */
  m: number
  cols: number
  rows: number
}

export const METRICS = (w: number, h: number): Metrics => {
  const mx = Math.min(64, Math.max(18, w * 0.042))
  const my = Math.min(44, Math.max(16, h * 0.034))
  // portrait gets a fatter module so the plates still read at phone width
  const m = h > w * 1.02 ? Math.min(w / 10, h / 16) : Math.min(w / 16, h / 9)
  const cols = w <= 768 ? 6 : 12
  const rows = 8
  return { w, h, mx, my, m, cols, rows }
}

/** x positions of the vertical grid lines, left to right */
export const colLines = (mt: Metrics) => {
  const inner = mt.w - mt.mx * 2
  return Array.from({ length: mt.cols + 1 }, (_, i) => mt.mx + (inner * i) / mt.cols)
}

/** y positions of the horizontal grid lines, top to bottom */
export const rowLines = (mt: Metrics) => {
  const inner = mt.h - mt.my * 2
  return Array.from({ length: mt.rows + 1 }, (_, i) => mt.my + (inner * i) / mt.rows)
}

