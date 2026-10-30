import { DEG } from './ease'

/** The poster vocabulary: three primaries, one black, one paper, five honest shapes. */
export type ShapeKind =
  | 'disc'
  | 'quarter'
  | 'half'
  | 'triangle'
  | 'square'
  | 'bar'
  | 'ring'
  | 'cross'
  | 'dots'

export type Ink = 'red' | 'yellow' | 'blue' | 'ink' | 'paper'

export type SectionId = 'home' | 'about' | 'work' | 'links' | 'archive'

/** Normalised frame coordinates (0-1), size in modules, rotation in radians. */
export interface Pose {
  x: number
  y: number
  s: number
  r: number
  a: number
}

export interface ActorSpec {
  id: string
  shape: ShapeKind
  ink: Ink
  /** mechanical micro-motion: one detent turn every `every` seconds */
  detent?: { every: number; phase: number; turns: number }
}

export const ACTORS: ActorSpec[] = [
  { id: 'discRed', shape: 'disc', ink: 'red', detent: { every: 9, phase: 1.6, turns: 1 } },
  { id: 'triYellow', shape: 'triangle', ink: 'yellow' },
  { id: 'quadBlue', shape: 'quarter', ink: 'blue' },
  { id: 'barInk', shape: 'bar', ink: 'ink' },
  { id: 'ringInk', shape: 'ring', ink: 'ink', detent: { every: 7, phase: 0.4, turns: 1 } },
  { id: 'discYellow', shape: 'disc', ink: 'yellow' },
  { id: 'sqBlue', shape: 'square', ink: 'blue', detent: { every: 6, phase: 2.2, turns: 1 } },
  { id: 'halfRed', shape: 'half', ink: 'red' },
  { id: 'quadYellow', shape: 'quarter', ink: 'yellow' },
  { id: 'dotsInk', shape: 'dots', ink: 'ink' },
  { id: 'blockInk', shape: 'square', ink: 'ink' },
  { id: 'discPaper', shape: 'disc', ink: 'paper' },
  { id: 'triPaper', shape: 'triangle', ink: 'paper' },
  { id: 'quadRed', shape: 'quarter', ink: 'red' },
  { id: 'ringPaper', shape: 'ring', ink: 'paper' },
]

const off = (x: number, y: number): Pose => ({ x, y, s: 0.001, r: 0, a: 0 })

/**
 * Poster zone: x 0.52-0.86, y 0.08-0.92. The type column owns the left half and
 * the index owns the right rail — plates never print over either.
 */
export const POSES: Record<SectionId, Record<string, Pose>> = {
  /* 00 — the poster: a Kandinsky triad, everything on the grid */
  home: {
    discRed: { x: 0.655, y: 0.31, s: 2.9, r: 0, a: 1 },
    ringInk: { x: 0.548, y: 0.235, s: 1.0, r: 0, a: 1 },
    discYellow: { x: 0.792, y: 0.135, s: 0.45, r: 0, a: 1 },
    barInk: { x: 0.845, y: 0.17, s: 0.85, r: 0, a: 1 },
    triYellow: { x: 0.615, y: 0.79, s: 2.6, r: 0, a: 1 },
    quadBlue: { x: 0.865, y: 0.62, s: 2.2, r: 180 * DEG, a: 1 },
    dotsInk: { x: 0.72, y: 0.5, s: 0.42, r: 0, a: 0.55 },
    sqBlue: { x: 0.522, y: 0.6, s: 0.36, r: 0, a: 1 },
    halfRed: off(0.02, 0.72),
    quadYellow: off(0.345, 0.1),
    blockInk: off(0.8, 0.5),
    discPaper: off(0.72, 0.35),
    triPaper: off(0.86, 0.68),
    quadRed: off(0.9, 0.2),
    ringPaper: off(0.62, 0.76),
  },

  /* 01 — about: a target, a small red disc, one blue plate */
  about: {
    ringInk: { x: 0.66, y: 0.33, s: 1.8, r: 0, a: 1 },
    discRed: { x: 0.762, y: 0.52, s: 0.85, r: 0, a: 1 },
    sqBlue: { x: 0.575, y: 0.215, s: 0.62, r: 0, a: 1 },
    quadYellow: { x: 0.855, y: 0.3, s: 1.5, r: 180 * DEG, a: 1 },
    barInk: { x: 0.845, y: 0.66, s: 0.8, r: 0, a: 1 },
    triYellow: { x: 0.635, y: 0.7, s: 1.3, r: 35 * DEG, a: 0.95 },
    dotsInk: { x: 0.7, y: 0.6, s: 0.4, r: 0, a: 0.5 },
    discYellow: off(0.875, 0.2),
    halfRed: off(0.02, 0.63),
    quadBlue: off(0.585, 0.9),
    blockInk: off(0.8, 0.5),
    discPaper: off(0.72, 0.35),
    triPaper: off(0.86, 0.68),
    quadRed: off(0.9, 0.2),
    ringPaper: off(0.62, 0.76),
  },

  /* 02 — work: three plates stacked like a legend for the three cards */
  work: {
    sqBlue: { x: 0.78, y: 0.25, s: 0.9, r: 0, a: 1 },
    quadYellow: { x: 0.78, y: 0.43, s: 1.0, r: 0, a: 1 },
    discRed: { x: 0.78, y: 0.63, s: 0.8, r: 0, a: 1 },
    ringInk: { x: 0.62, y: 0.3, s: 0.9, r: 0, a: 0.9 },
    triYellow: { x: 0.6, y: 0.86, s: 1.3, r: 0, a: 0.95 },
    barInk: { x: 0.845, y: 0.66, s: 0.8, r: 0, a: 1 },
    dotsInk: { x: 0.69, y: 0.52, s: 0.38, r: 0, a: 0.5 },
    discYellow: off(0.865, 0.42),
    halfRed: off(0.02, 0.66),
    quadBlue: off(0.74, 0.56),
    blockInk: off(0.8, 0.5),
    discPaper: off(0.72, 0.35),
    triPaper: off(0.86, 0.68),
    quadRed: off(0.9, 0.2),
    ringPaper: off(0.62, 0.76),
  },

  /* 03 — links: discs as ports, one plate sweeping out of the corner */
  links: {
    discRed: { x: 0.705, y: 0.24, s: 1.2, r: 0, a: 1 },
    ringInk: { x: 0.805, y: 0.375, s: 1.45, r: 0, a: 1 },
    triYellow: { x: 0.675, y: 0.855, s: 1.6, r: 0, a: 0.95 },
    quadBlue: { x: 0.865, y: 0.62, s: 2.2, r: 180 * DEG, a: 1 },
    sqBlue: { x: 0.545, y: 0.3, s: 0.5, r: 0, a: 1 },
    barInk: { x: 0.845, y: 0.16, s: 0.7, r: 0, a: 1 },
    discYellow: { x: 0.7, y: 0.66, s: 0.4, r: 0, a: 1 },
    dotsInk: { x: 0.66, y: 0.47, s: 0.38, r: 0, a: 0.5 },
    halfRed: off(0.02, 0.7),
    quadYellow: off(0.345, 0.1),
    blockInk: off(0.8, 0.5),
    discPaper: off(0.72, 0.35),
    triPaper: off(0.86, 0.68),
    quadRed: off(0.9, 0.2),
    ringPaper: off(0.62, 0.76),
  },

  /* 04 — archive: one black plate, paper knockouts printed on it */
  archive: {
    blockInk: { x: 0.7, y: 0.5, s: 3.6, r: 0, a: 1 },
    discPaper: { x: 0.665, y: 0.395, s: 1.0, r: 0, a: 1 },
    triPaper: { x: 0.735, y: 0.6, s: 1.15, r: 0, a: 1 },
    quadRed: { x: 0.8, y: 0.3, s: 1.0, r: 0, a: 1 },
    ringPaper: { x: 0.625, y: 0.585, s: 0.8, r: 0, a: 0.85 },
    barInk: { x: 0.845, y: 0.75, s: 0.7, r: 0, a: 1 },
    discRed: off(0.7, 0.3),
    triYellow: off(0.545, 0.87),
    quadBlue: off(0.9, 0.75),
    ringInk: off(0.6, 0.235),
    discYellow: off(0.845, 0.145),
    sqBlue: off(0.475, 0.9),
    halfRed: off(0.02, 0.72),
    quadYellow: off(0.345, 0.1),
    dotsInk: off(0.645, 0.55),
  },
}

export const SECTION_ORDER: SectionId[] = ['home', 'about', 'work', 'links', 'archive']

export const SECTION_META: Record<SectionId, { num: string; zh: string; en: string }> = {
  home: { num: '00', zh: '索引', en: 'POSTER' },
  about: { num: '01', zh: '关于', en: 'ABOUT' },
  work: { num: '02', zh: '作品', en: 'WORK' },
  links: { num: '03', zh: '链接', en: 'LINKS' },
  archive: { num: '04', zh: '旧版', en: 'ARCHIVE' },
}


/** Portrait poster: the plates stack under the type instead of beside it. */
export const POSES_M: Record<SectionId, Record<string, Pose>> = {
  home: {
    discRed: { x: 0.58, y: 0.56, s: 3.2, r: 0, a: 1 },
    ringInk: { x: 0.3, y: 0.47, s: 1.0, r: 0, a: 1 },
    triYellow: { x: 0.62, y: 0.8, s: 2.8, r: 0, a: 1 },
    quadBlue: { x: 0.93, y: 0.7, s: 2.6, r: 90 * DEG, a: 1 },
    barInk: { x: 0.06, y: 0.62, s: 0.8, r: 0, a: 1 },
    discYellow: { x: 0.18, y: 0.52, s: 0.45, r: 0, a: 1 },
    dotsInk: { x: 0.12, y: 0.75, s: 0.4, r: 0, a: 0.5 },
    sqBlue: { x: 0.38, y: 0.68, s: 0.4, r: 0, a: 1 },
  },
  about: {
    ringInk: { x: 0.55, y: 0.58, s: 2.0, r: 0, a: 1 },
    discRed: { x: 0.78, y: 0.72, s: 0.9, r: 0, a: 1 },
    sqBlue: { x: 0.28, y: 0.52, s: 0.6, r: 0, a: 1 },
    quadYellow: { x: 0.95, y: 0.88, s: 1.8, r: 90 * DEG, a: 1 },
    barInk: { x: 0.08, y: 0.8, s: 0.8, r: 0, a: 1 },
    triYellow: { x: 0.38, y: 0.74, s: 1.3, r: 35 * DEG, a: 0.95 },
    dotsInk: { x: 0.7, y: 0.5, s: 0.4, r: 0, a: 0.45 },
  },
  work: {
    sqBlue: { x: 0.7, y: 0.5, s: 0.8, r: 0, a: 1 },
    quadYellow: { x: 0.72, y: 0.66, s: 0.9, r: 0, a: 1 },
    discRed: { x: 0.68, y: 0.82, s: 0.7, r: 0, a: 1 },
    ringInk: { x: 0.3, y: 0.58, s: 0.9, r: 0, a: 0.85 },
    triYellow: { x: 0.88, y: 0.9, s: 1.2, r: 0, a: 0.9 },
    barInk: { x: 0.06, y: 0.7, s: 0.7, r: 0, a: 1 },
    dotsInk: { x: 0.18, y: 0.48, s: 0.36, r: 0, a: 0.45 },
  },
  links: {
    discRed: { x: 0.6, y: 0.5, s: 1.1, r: 0, a: 1 },
    ringInk: { x: 0.78, y: 0.64, s: 1.4, r: 0, a: 1 },
    triYellow: { x: 0.3, y: 0.88, s: 1.8, r: 0, a: 0.95 },
    quadBlue: { x: 0.95, y: 0.8, s: 2.4, r: 90 * DEG, a: 1 },
    sqBlue: { x: 0.18, y: 0.58, s: 0.45, r: 0, a: 1 },
    barInk: { x: 0.06, y: 0.48, s: 0.6, r: 0, a: 1 },
    discYellow: { x: 0.45, y: 0.72, s: 0.4, r: 0, a: 1 },
    dotsInk: { x: 0.55, y: 0.86, s: 0.36, r: 0, a: 0.45 },
  },
  archive: {
    blockInk: { x: 0.6, y: 0.62, s: 4.0, r: 0, a: 1 },
    discPaper: { x: 0.5, y: 0.55, s: 1.0, r: 0, a: 1 },
    triPaper: { x: 0.66, y: 0.7, s: 1.0, r: 0, a: 1 },
    quadRed: { x: 0.86, y: 0.5, s: 1.0, r: 0, a: 1 },
    ringPaper: { x: 0.42, y: 0.71, s: 0.7, r: 0, a: 0.9 },
    barInk: { x: 0.06, y: 0.58, s: 0.6, r: 0, a: 1 },
  },
}

