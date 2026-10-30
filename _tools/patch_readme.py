import pathlib
p = pathlib.Path("README.md")
s = p.read_text(encoding="utf-8")
old = """/                       React 单屏主页（5 个索引节 + 命令宝典）
  #/                    00 索引 · POSTER
  #/about               01 关于
  #/work                02 作品
  #/links               03 链接
  #/archive             04 旧版封存
  #/book                命令宝典（唯一可滚动的文档页）"""
new = """/                       React 单屏作品集（6 节 + 命令宝典）
  #/                    00 首页 · INDEX
  #/work                01 作品 · 时间线 2019—2026
  #/repos               02 仓库 · 24 个公开仓库（数据来自 GitHub API）
  #/about               03 关于 · 简介 / 技术栈 / 兴趣
  #/links               04 联系 · 链接与友链
  #/terminal            05 终端 · whoami（结尾页）
  #/book                命令宝典（唯一可滚动的文档页）"""
if old not in s:
    raise SystemExit("route block not found")
s = s.replace(old, new, 1)

marker = "## 开发"
extra = """## 仓库数据

`src/data/repos.ts` 由 GitHub API 生成，不要手改：

```bash
# 1. 拉取仓库列表（一次性缓存到 ../_ref）
curl -s "https://api.github.com/users/BaxterL/repos?per_page=100&sort=pushed" -o ../_ref/gh-repos.json
# 2. 生成
python _tools/gen_repos.py
```

页面上的中文技术简介在 `src/content.ts` 的 `REPO_DESC` 里覆盖（缺省回落到 GitHub 原文）。

"""
if marker in s:
    s = s.replace(marker, extra + marker, 1)
p.write_text(s, encoding="utf-8")
print("readme updated")
