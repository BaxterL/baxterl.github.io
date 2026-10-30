import pathlib
p = pathlib.Path("src/core/poses.ts")
s = p.read_text(encoding="utf-8")
s = s.replace("ringInk: { x: 0.26, y: 0.55, s: 0.9, r: 0, a: 1 },", "ringInk: { x: 0.26, y: 0.62, s: 0.9, r: 0, a: 1 },", 1)
s = s.replace("discYellow: { x: 0.16, y: 0.6, s: 0.4, r: 0, a: 1 },", "discYellow: { x: 0.16, y: 0.67, s: 0.4, r: 0, a: 1 },", 1)
p.write_text(s, encoding="utf-8")
print("nudged")
