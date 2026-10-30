/** Mechanical easing vocabulary — matches the 09-bauhaus film: power2 in/out,
 *  no overshoot, no bounce. Everything lands on a grid line and stops dead. */

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))

export const lerp = (a: number, b: number, u: number) => a + (b - a) * u

/** power2.inOut — the default travel curve */
export const io2 = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)

/** power2.in — a plate dropping onto the paper: fast, then dead stop */
export const in2 = (u: number) => u * u

/** power2.out — a plate being pulled off the press */
export const out2 = (u: number) => 1 - (1 - u) * (1 - u)

/** escapement: hold for 60 % of the beat, then snap through the remaining turn */
export const detent = (u: number) => io2(clamp((u - 0.6) / 0.4))

export const DEG = Math.PI / 180
