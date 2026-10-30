/** All the words in one editable file. */

export const SITE = {
  name: '凛冬初十',
  latin: 'BAXTERL',
  role: 'MINECRAFT 指令 · 小工具 · AI 应用',
  tagline:
    '2019 年开始做 Minecraft 原版内容，后来写过工具、系统和模组，现在主要做 AI 应用与网页动效。基本都是从零写完，然后把能开的都开源了。',
  location: 'UTC+8',
  year: '2026',
  github: 'https://github.com/BaxterL',
  repo: 'https://github.com/BaxterL/BaxterL.github.io',
  site: 'https://tenflake.cn',
  bilibili: 'https://space.bilibili.com/437726454',
}

export type Phase = 'mc' | 'tool' | 'solo' | 'ai' | 'video'

export const PHASES: Record<Phase, { zh: string; en: string; color: string }> = {
  mc: { zh: '我的世界', en: 'MINECRAFT', color: '#E03C31' },
  tool: { zh: '工具', en: 'TOOLS', color: '#1E4FA3' },
  solo: { zh: '独立项目', en: 'SOLO', color: '#8A7A55' },
  ai: { zh: 'AI 应用', en: 'AI', color: '#111111' },
  video: { zh: '影像', en: 'VIDEO', color: '#F2B705' },
}

export interface WorkItem {
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
export const PERIODS = ['2019—2020', '2021', '2022', '2023', '2024', '2025', '2026']

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
    period: '2026',
    phase: 'ai',
    title: 'AI 应用',
    sub: 'LLM · RAG · Agent',
    desc: '多 Agent 流水线、知识问答、内容生成，从原型做到能上线用。',
    pick: true,
  },
  {
    id: 'web',
    period: '2026',
    phase: 'ai',
    title: '网页与动效',
    sub: 'React · GSAP · Canvas',
    desc: '从静态页面到手写动效引擎，网格、排版和转场都自己写。',
  },
  {
    id: 'sts2',
    period: '2026',
    phase: 'solo',
    title: '杀戮尖塔 2 模组',
    sub: 'C# 模组系列',
    desc: '《君王之刃》《孤注一掷》等几个模组与扩展事件包，自定义卡牌与费用机制。',
    href: 'https://github.com/BaxterL/STS2-re-sovereign-blade',
  },
  {
    id: 'devtools',
    period: '2026',
    phase: 'tool',
    title: 'DeepSeek Harness 插件',
    sub: '开发者工具',
    desc: '偏好蒸馏、规则注入这类开发者工具，给 AI 编码环境用。',
    href: 'https://github.com/BaxterL/dsh-code-taste',
  },
]

export const ABOUT: string[] = [
  '凛冬初十，网上一般叫 BaxterL。2019 年开始做 Minecraft 原版内容，最早是地图和基岩版命令教程，后来写数据包、插件和工具。',
  '一路做过 MCBBS 擂台赛、YEGGS Map Jam（2023 优胜）、MCC Game Jam 这些社区活动，也做过独立系统、插件和模组。',
  '现在主要做 AI 应用与网页动效，也在维护自己的 DeepSeek Harness 插件。Minecraft 已经退坑，B 站上的教程停更但还留着。',
  '写代码之外是二次元，看番、玩独立游戏和解谜游戏，最近长泡在《杀戮尖塔 2》里。',
]

export const INTERESTS: string[] = ['番剧', '独立游戏', '解谜游戏', 'Minecraft']

export interface StackGroup {
  label: string
  items: string[]
}

export const STACK: StackGroup[] = [
  { label: 'CODE', items: ['JavaScript', 'Python', 'Java', 'Kotlin', 'C++', 'mcfunction'] },
  { label: 'SYSTEM', items: ['Linux', 'MySQL', 'Redis', 'Git'] },
  { label: 'VISUAL', items: ['视觉设计', '像素艺术', 'Blockbench 建模'] },
]

export const FACTS: Array<{ k: string; v: string }> = [
  { k: '起点', v: '2019 · Minecraft' },
  { k: '公开仓库', v: '24 个' },
  { k: '位置', v: 'UTC+8' },
  { k: '状态', v: '独立开发中' },
]

/** 仓库简介改写成技术视角（GitHub 上的原文见仓库页 title）。 */
export const REPO_DESC: Record<string, string> = {
  'maison-des-mots': 'React 19 + Vite + GSAP 的纯前端拼贴风写作站，纸感与转场都是手写的',
  'maison-des-mots-skill': 'SKILL.md 形态的视觉规范：把项目的艺术方向抽成可复用提示词',
  'dsh-code-taste': 'DeepSeek Harness 插件：偏好蒸馏 + 会话前缀注入，规则是可直接编辑的 markdown',
  'childcare-agent': 'TypeScript 知识问答：RAG 检索 + 出处标注，面向托育政策与指南',
  joinus: '单页 HTML 活动页，没有构建工具的静态实现',
  campus_food: '校园外卖的后端逻辑：PostgreSQL + PLpgSQL 存储过程',
  'baxterl.github.io': '本仓库：React + TS + GSAP，双 canvas 海报与翻片转场',
  'ai-daily-brief': 'Python 多 Agent 流水线，4 个 LLM 并行汇总每日信息',
  lightjump: 'GDScript 平台跳跃原型，Godot 期末作业',
  NeonStriker: 'Go 写的小游戏原型与规则服务',
  'STS2-MoreEvent': 'C# 杀戮尖塔 2 模组：向事件池注入更多事件',
  'STS2-ExtraEventPack': 'C# 模组：额外事件包，配置驱动的卡牌与事件扩展',
  'STS2-TheGambitMod': 'C# 模组：孤注一掷系列卡牌与费用机制',
  'STS2-re-sovereign-blade': 'C# 模组：君王之刃，自定义卡牌与一费机制',
  MedicalSys: 'Vue + Neo4j：医疗知识图谱的可视化展示',
  auto_watch: 'Python 自动化脚本：定时任务与页面操作',
  webtool: '工具站后端与前端小工具集合，部署在 tool.tenflake.cn',
  PlayerVisibleBlock: 'Kotlin + Spigot 1.12.2 + ProtocolLib：仅指定玩家可见的方块',
  bax: 'mcfunction 数据包与开发辅助工具',
  'Command-note': 'Minecraft 命令笔记与可运行示例',
  cmdhelper_bot: 'Python 小栗子机器人：命令问答与检索',
  '-': 'Command-note 的教学示例数据包',
  bax_lib: '数据包基础库与常用函数封装',
  vercel: 'Vercel 部署配置与边缘函数实验',
}

export interface LinkItem {
  num: string
  label: string
  note: string
  href: string
  go: string
  external?: boolean
}

export const LINKS: LinkItem[] = [
  {
    num: 'L.01',
    label: 'GitHub',
    note: '@BaxterL · 24 个公开仓库',
    href: SITE.github,
    go: 'GITHUB',
    external: true,
  },
  { num: 'L.02', label: '个人网站', note: 'tenflake.cn', href: SITE.site, go: 'VISIT', external: true },
  {
    num: 'L.03',
    label: 'B 站空间',
    note: '命令教程 · 已停更',
    href: SITE.bilibili,
    go: 'BILIBILI',
    external: true,
  },
  {
    num: 'L.04',
    label: '旧站 · 命令宝典',
    note: 'legacy/v1 已封存 · 旧站收录的指令资料',
    href: '#/book',
    go: 'OPEN',
  },
]

export interface FriendItem {
  label: string
  note: string
  href: string
}

export const FRIENDS: FriendItem[] = [
  { label: 'underline.icu', note: 'underline 团队', href: 'http://underline.icu/' },
  { label: '蓝天工作室', note: 'bsc.meteormc.cn', href: 'https://bsc.meteormc.cn/' },
  { label: 'ovo7.cc', note: 'shiroha7z · 终端式个人站', href: 'https://ovo7.cc/' },
]

export interface TermLine {
  cmd: string
  out: string[]
}

/** The console on the last page: a real `whoami` read-out. */
export const TERMINAL: TermLine[] = [
  { cmd: 'whoami', out: ['baxterl'] },
  { cmd: 'uname -sr', out: ['Linux 6.8.0-kali1-amd64'] },
  { cmd: 'cat /etc/os-release', out: ['PRETTY_NAME="Kali GNU/Linux Rolling"'] },
  { cmd: 'ls ~/ctf', out: ['crypto/  misc/  pwn/  rev/  web/'] },
  { cmd: 'cat ~/.stack', out: ['js python java kotlin c++ mcfunction'] },
  { cmd: 'uptime', out: ['6 years · 24 public repos · UTC+8'] },
]

export const FINAL = {
  node: 'TENFLAKE-01',
  build: '2026.10',
  status: 'OPEN',
  system: 'kali-rolling',
  signal: ['WEB', 'MC', 'AI'],
}

export interface BookItem {
  title: string
  href: string
  note?: string
}

export interface BookGroup {
  num: string
  title: string
  items: BookItem[]
}

/** cmd 宝典 — transcribed from the old md/link3.md, links untouched. */
export const BOOK: BookGroup[] = [
  {
    num: '01',
    title: '有用脚本',
    items: [
      {
        title: '1.19.3- → 1.19.4+ 材质包兼容脚本',
        href: 'https://github.com/Dominexis/Atlas-Logger',
        note: 'Atlas-Logger',
      },
      {
        title: '碰撞箱计算器',
        href: 'https://tsbread.github.io/hitbox_calc.html',
        note: 'execute as @s[dx=0,dy=0,dz=] 的碰撞箱检测；游戏内 F3+B 可看实体碰撞箱',
      },
      {
        title: '计分板树生成器',
        href: '/scbtree.html',
        note: '优化穷举，提高穷举执行速度 · 本站内部',
      },
      {
        title: '展示实体 transformation 变换',
        href: 'https://misode.github.io/transformation/',
        note: 'misode',
      },
      {
        title: 'UUID 转换',
        href: 'https://www.soltoder.com/mc-uuid-converter/',
        note: 'soltoder',
      },
    ],
  },
  {
    num: '02',
    title: '命令查阅文档',
    items: [
      {
        title: '命令返回值',
        href: 'https://spgoding.com/command/2021/03/26/command-result-value.html',
        note: '相当于编程里的 return；用 execute store result ... run 获取',
      },
      {
        title: '数据包体系结构索引',
        href: 'https://www.mcbbs.net/thread-1246776-1-1.html',
        note: 'mcbbs',
      },
    ],
  },
  {
    num: '03',
    title: '地图制作指南',
    items: [
      { title: '字体艺术', href: 'https://www.mcbbs.net/thread-835539-1-1.html', note: 'mcbbs' },
      { title: '去除文字阴影', href: 'https://github.com/PuckiSilver/NoShadow', note: 'NoShadow' },
    ],
  },
  {
    num: '04',
    title: '命令基础',
    items: [
      { title: '检测玩家移动', href: 'https://www.mcbbs.net/thread-1038074-308025-1.html' },
      { title: '多彩 dust 粒子', href: 'https://www.mcbbs.net/thread-1356904-1-1.html' },
      { title: '平面扇形检测', href: 'https://www.mcbbs.net/thread-1361859-1-1.html' },
      { title: '容器 UI 制作教程', href: 'https://www.mcbbs.net/thread-1304648-1-1.html' },
      {
        title: '负空格黑科技',
        href: 'https://www.mcbbs.net/thread-1052254-1-1.html',
        note: '新版可以自己手搓一个，有兴趣的可以去自己了解',
      },
      {
        title: '免穷举修改背包',
        href: 'https://www.mcbbs.net/thread-860954-1-1.html',
        note: '新版需要修改部分代码',
      },
    ],
  },
]

export const LEGACY = {
  branch: 'legacy/v1',
  tag: 'v1-legacy',
  branchUrl: `${SITE.repo}/tree/legacy/v1`,
  tagUrl: `${SITE.repo}/releases/tag/v1-legacy`,
}
