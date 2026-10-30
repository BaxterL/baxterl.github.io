import pathlib
p = pathlib.Path("src/content.ts")
s = p.read_text(encoding="utf-8")
s = s.replace("'2025', '2025—2026']", "'2025', '2026']")
s = s.replace("period: '2025—2026'", "period: '2026'")
p.write_text(s, encoding="utf-8")
print("period 2026")
