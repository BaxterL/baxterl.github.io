import pathlib
p = pathlib.Path("src/components/Sections.tsx")
s = p.read_text(encoding="utf-8")
s = s.replace(
  """                    style={{ '--c': PHASES[w.phase].color } as CSSProperties}
                  >
                    <i className="tl-card__dot" />""",
  """                    style={{ '--c': PHASES[w.phase].color } as CSSProperties}
                  >
                    <i className="tl-card__dot" />
                    {w.pick && (
                      <i className="tl-card__pick" title="代表作">
                        ★
                      </i>
                    )}""",
  1,
)
s = s.replace(
  "'悬停查看细节，点击打开 · 全部仓库在下一页'",
  "'★ 代表作 · 悬停查看细节，点击打开 · 全部仓库在下一页'",
  1,
)
s = s.replace("kicker=\"WORK · 时间线 2019—2026\"", "kicker=\"WORK · 时间线 2019—2026 · ★ 代表作\"", 1)
p.write_text(s, encoding="utf-8")
print("sections patched")
