import pathlib
p = pathlib.Path("src/core/poses.ts")
s = p.read_text(encoding="utf-8")
old = """  home: {
    discRed: { x: 0.58, y: 0.56, s: 3.2, r: 0, a: 1 },
    ringInk: { x: 0.3, y: 0.47, s: 1.0, r: 0, a: 1 },
    triYellow: { x: 0.62, y: 0.8, s: 2.8, r: 0, a: 1 },
    quadBlue: { x: 0.93, y: 0.7, s: 2.6, r: 90 * DEG, a: 1 },
    barInk: { x: 0.06, y: 0.62, s: 0.8, r: 0, a: 1 },
    discYellow: { x: 0.18, y: 0.52, s: 0.45, r: 0, a: 1 },
    dotsInk: { x: 0.12, y: 0.75, s: 0.4, r: 0, a: 0.5 },
    sqBlue: { x: 0.38, y: 0.68, s: 0.4, r: 0, a: 1 },
  },"""
new = """  home: {
    discRed: { x: 0.58, y: 0.64, s: 3.0, r: 0, a: 1 },
    ringInk: { x: 0.26, y: 0.55, s: 0.9, r: 0, a: 1 },
    triYellow: { x: 0.6, y: 0.88, s: 2.6, r: 0, a: 1 },
    quadBlue: { x: 0.95, y: 0.82, s: 2.4, r: 90 * DEG, a: 1 },
    barInk: { x: 0.05, y: 0.72, s: 0.8, r: 0, a: 1 },
    discYellow: { x: 0.16, y: 0.6, s: 0.4, r: 0, a: 1 },
    dotsInk: { x: 0.1, y: 0.83, s: 0.38, r: 0, a: 0.5 },
    sqBlue: { x: 0.36, y: 0.76, s: 0.38, r: 0, a: 1 },
  },"""
if old not in s:
    raise SystemExit("mobile home poses not found")
s = s.replace(old, new, 1)
p.write_text(s, encoding="utf-8")
print("mobile home poses lowered")
