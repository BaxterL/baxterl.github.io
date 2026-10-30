import pathlib, re

p = pathlib.Path("src/content.ts")
s = p.read_text(encoding="utf-8")

start = s.index("  {\n    id: 'pvb',")
end = s.index("]\n\nexport const ABOUT")
new = """  {
    id: 'plugins',
    period: '2025',
    phase: 'solo',
    title: 'Minecraft 服务端插件',
    sub: 'Spigot · Kotlin · 协议层',
    desc: '给服务器写的一批插件：可见性控制、协议处理、世界与玩家逻辑，不止一个。',
    pick: true,
  },
  {
    id: 'systems',
    period: '2025',
    phase: 'solo',
    title: '独立系统',
    sub: 'Vue · Neo4j · 后端',
    desc: '数据可视化与后台系统，数据模型、接口、界面一个人写完。',
  },
  {
    id: 'scripts',
    period: '2025',
    phase: 'tool',
    title: '小工具与脚本',
    sub: '工具站 · 自动化',
    desc: '工具站加一堆没开源的小脚本：自动化、批处理、临时小工具。',
  },
  {
    id: 'goodjob',
    period: '2025',
    phase: 'mc',
    title: 'Minecraft Good Job',
    sub: '参与作品',
    desc: 'Minecraft Good Job 的参与作品。',
  },
  {
    id: 'ai',
    period: '2025—2026',
    phase: 'ai',
    title: 'AI 应用',
    sub: 'LLM · RAG · Agent',
    desc: '多 Agent 流水线、知识问答、内容生成，从原型做到能上线用。',
    pick: true,
  },
  {
    id: 'web',
    period: '2025—2026',
    phase: 'ai',
    title: '网页与动效',
    sub: 'React · GSAP · Canvas',
    desc: '从静态页面到手写动效引擎，网格、排版和转场都自己写。',
  },
  {
    id: 'sts2',
    period: '2025—2026',
    phase: 'solo',
    title: '杀戮尖塔 2 模组',
    sub: 'C# 模组系列',
    desc: '《君王之刃》《孤注一掷》等几个模组与扩展事件包，自定义卡牌与费用机制。',
    href: 'https://github.com/BaxterL/STS2-re-sovereign-blade',
  },
  {
    id: 'devtools',
    period: '2025—2026',
    phase: 'tool',
    title: 'DeepSeek Harness 插件',
    sub: '开发者工具',
    desc: '偏好蒸馏、规则注入这类开发者工具，给 AI 编码环境用。',
    href: 'https://github.com/BaxterL/dsh-code-taste',
  },
"""

s = s[:start] + new + s[end:]
p.write_text(s, encoding="utf-8")
print("2025 / 2025-2026 generalised")
