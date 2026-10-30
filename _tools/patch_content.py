"""One-off content patch: timeline entries + featured picks."""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src" / "content.ts"
src = CONTENT.read_text(encoding="utf-8")

work = '''export interface WorkItem {
  id: string
  period: string
  phase: Phase
  title: string
  sub: string
  desc: string
  href?: string
  note?: string
  /** 代表作，时间线上打星 */
  pick?: boolean
}

/** 时间线：从 2019 到现在，挑能拿出来的。全部仓库在下一页。 */
export const PERIODS = ['2019—2020', '2021', '2022', '2023', '2024', '2025', '2025—2026']

export const WORK: WorkItem[] = [
  {
    id: 'start',
    period: '2019—2020',
    phase: 'mc',
    title: '起点',
    sub: '地图 · 基岩版教程',
    desc: '从 Minecraft 地图和基岩版命令教程开始，最早的一批东西现在基本只剩 B 站视频。',
    href: SITE.bilibili,
  },
  {
    id: 'bax',
    period: '2021',
    phase: 'mc',
    title: 'bax',
    sub: '数据包',
    desc: 'mcfunction 数据包与开发辅助工具，早期的试验几乎都在这。',
    href: 'https://github.com/BaxterL/bax',
  },
  {
    id: 'mcbbs-arena',
    period: '2022',
    phase: 'mc',
    title: 'MCBBS 擂台赛',
    sub: '参赛作品',
    desc: '参加 MCBBS 擂台赛做的一批地图与命令内容，也是那个社区最后的几年。',
  },
  {
    id: 'underline-goodjob',
    period: '2022',
    phase: 'mc',
    title: 'underline Good Job',
    sub: '参与作品',
    desc: 'underline 团队的 Good Job 活动参与作品，和队友一起做的地图。',
  },
  {
    id: 'yeggs-jam',
    period: '2023',
    phase: 'mc',
    title: 'YEGGS Map Jam',
    sub: '2023 · 优胜作品',
    desc: '2023 YEGGS Map Jam 的优胜作品，完整度最高的一张地图。',
    href: 'https://www.minebbs.com/resources/jam.7386/',
    pick: true,
  },
  {
    id: 'mcc-jam',
    period: '2024',
    phase: 'mc',
    title: 'MCC Game Jam',
    sub: '参赛作品',
    desc: 'Minecraft 社区 Game Jam 的参赛作品，限时命题下做的地图。',
  },
  {
    id: 'pvb',
    period: '2025',
    phase: 'solo',
    title: 'PlayerVisibleBlock',
    sub: 'Spigot 插件',
    desc: 'Kotlin + ProtocolLib：只对指定玩家可见的方块，客户端渲染与服务端判定对齐。',
    href: 'https://github.com/BaxterL/PlayerVisibleBlock',
    pick: true,
  },
  {
    id: 'medical',
    period: '2025',
    phase: 'solo',
    title: 'MedicalSys',
    sub: '医疗数据可视化',
    desc: 'Vue + Neo4j 的医疗数据展示系统，数据、接口、前端一个人写完。',
    href: 'https://github.com/BaxterL/MedicalSys',
    pick: true,
  },
  {
    id: 'webtool',
    period: '2025',
    phase: 'tool',
    title: 'webtool',
    sub: '工具站',
    desc: '工具站与一堆没开源的小脚本，跑在 tool.tenflake.cn 上。',
    href: 'https://github.com/BaxterL/webtool',
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
    id: 'sts2',
    period: '2025—2026',
    phase: 'solo',
    title: '杀戮尖塔 2 模组',
    sub: '君王之刃 · C#',
    desc: '《君王之刃》《孤注一掷》等几个模组与扩展事件包，自定义卡牌与费用机制。',
    href: 'https://github.com/BaxterL/STS2-re-sovereign-blade',
    pick: true,
  },
  {
    id: 'brief',
    period: '2025—2026',
    phase: 'ai',
    title: 'ai-daily-brief',
    sub: 'AI 应用',
    desc: 'Python 多 Agent 流水线，把每天的信息源压成一份能读完的简报。',
    href: 'https://github.com/BaxterL/ai-daily-brief',
    pick: true,
  },
  {
    id: 'maison',
    period: '2025—2026',
    phase: 'ai',
    title: 'maison-des-mots',
    sub: '文字的房子',
    desc: '洛可可拼贴风的文案工作室，React 19 + GSAP，纯前端。',
    href: 'https://github.com/BaxterL/maison-des-mots',
    pick: true,
  },
  {
    id: 'taste',
    period: '2025—2026',
    phase: 'tool',
    title: 'dsh-code-taste',
    sub: 'DeepSeek Harness 插件',
    desc: '把代码偏好蒸馏成可编辑的规则，按会话前缀注入。',
    href: 'https://github.com/BaxterL/dsh-code-taste',
  },
]
'''

pattern = re.compile(r"export interface WorkItem \{.*?\n\]\n", re.S)
if not pattern.search(src):
    raise SystemExit("WORK block not found")

src = pattern.sub(work, src, count=1)

about = '''export const ABOUT: string[] = [
  '凛冬初十，网上一般叫 BaxterL。2019 年开始做 Minecraft 原版内容，最早是地图和基岩版命令教程，后来写数据包、插件和工具。',
  '一路做过 MCBBS 擂台赛、YEGGS Map Jam（2023 优胜）、MCC Game Jam 这些社区活动，也做过独立系统、插件和模组。',
  '现在主要做 AI 应用与网页动效，也在维护自己的 DeepSeek Harness 插件。Minecraft 已经退坑，B 站上的教程停更但还留着。',
  '写代码之外是二次元，看番、玩独立游戏和解谜游戏，最近长泡在《杀戮尖塔 2》里。',
]
'''

pattern2 = re.compile(r"export const ABOUT: string\[\] = \[.*?\n\]\n", re.S)
if not pattern2.search(src):
    raise SystemExit("ABOUT block not found")
src = pattern2.sub(about, src, count=1)

CONTENT.write_text(src, encoding="utf-8")
print("patched WORK (14 entries, picks marked) and ABOUT")
