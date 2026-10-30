/** All the words in one editable file. */

export const SITE = {
  name: '凛冬初十',
  latin: 'BAXTERL',
  role: 'MINECRAFT 指令 · 小工具 · AI 应用',
  tagline: '这里什么都没有，只有一面墙、几块颜色和一条网格。',
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
  year: number
  phase: Phase
  title: string
  sub: string
  desc: string
  href?: string
  hrefLabel?: string
  note?: string
}

/** 2020 → 2025，一条时间线，13 个能拿出来的东西。 */
export const WORK: WorkItem[] = [
  {
    id: 'bax',
    year: 2020,
    phase: 'mc',
    title: 'bax',
    sub: '资源包 · 指令',
    desc: '早期的指令与资源包试验田，把原版能拆的东西都拆了一遍，也是后来所有地图的地基。',
    href: 'https://github.com/BaxterL/bax',
    hrefLabel: 'github.com/BaxterL/bax',
  },
  {
    id: 'collect',
    year: 2020,
    phase: 'mc',
    title: 'BaxterL/-',
    sub: '地图 · 数据包',
    desc: '早期地图与数据包合集仓库，杂，但都是自己写的。',
    href: 'https://github.com/BaxterL/-',
    hrefLabel: 'github.com/BaxterL/-',
  },
  {
    id: 'jam',
    year: 2021,
    phase: 'mc',
    title: 'JAM',
    sub: '代表作 · MineBBS',
    desc: '那几年最完整的一次地图作品，发布在 MineBBS，也是被最多人玩过的一个。',
    href: 'https://www.minebbs.com/resources/jam.7386/',
    hrefLabel: 'minebbs.com/resources/jam.7386',
  },
  {
    id: 'gone',
    year: 2021,
    phase: 'mc',
    title: '已消失',
    sub: '随 MCBBS 下线',
    desc: '还有一批作品跟着社区一起消失了，现在只剩记忆和旧截图。',
    note: '已佚失',
  },
  {
    id: 'video',
    year: 2022,
    phase: 'video',
    title: '命令教程',
    sub: 'B 站 · 已停更',
    desc: '把原版命令讲成人话，做了一段时间教程。现在退坑了，视频还在。',
    href: SITE.bilibili,
    hrefLabel: 'space.bilibili.com/437726454',
  },
  {
    id: 'webtool',
    year: 2023,
    phase: 'tool',
    title: 'webtool',
    sub: '小工具集',
    desc: '零散的小工具集合。另外还有很多没开源的小脚本，不一一列了。',
    href: 'https://github.com/BaxterL/webtool',
    hrefLabel: 'github.com/BaxterL/webtool',
  },
  {
    id: 'medical',
    year: 2023,
    phase: 'solo',
    title: 'MedicalSys',
    sub: '独立项目',
    desc: '医疗方向的管理系统：数据模型、接口、界面，一个人从头写完。',
    href: 'https://github.com/BaxterL/MedicalSys',
    hrefLabel: 'github.com/BaxterL/MedicalSys',
  },
  {
    id: 'sts2',
    year: 2024,
    phase: 'solo',
    title: 'STS2 主权之刃',
    sub: '模组系列',
    desc: '杀戮尖塔 2 的模组系列，围绕一套自定义卡牌与机制展开，是系列的总入口。',
    href: 'https://github.com/BaxterL/STS2-re-sovereign-blade',
    hrefLabel: 'STS2-re-sovereign-blade',
  },
  {
    id: 'pvb',
    year: 2024,
    phase: 'solo',
    title: 'PlayerVisibleBlock',
    sub: '模组 · 服务端',
    desc: '玩家可见方块逻辑，客户端渲染与服务端判定必须严格对上。',
    href: 'https://github.com/BaxterL/PlayerVisibleBlock',
    hrefLabel: 'github.com/BaxterL/PlayerVisibleBlock',
  },
  {
    id: 'brief',
    year: 2024,
    phase: 'ai',
    title: 'ai-daily-brief',
    sub: 'AI 应用',
    desc: '把每天的信息源压成一份能读完的简报，剩下的交给模型。',
    href: 'https://github.com/BaxterL/ai-daily-brief',
    hrefLabel: 'github.com/BaxterL/ai-daily-brief',
  },
  {
    id: 'mbti',
    year: 2025,
    phase: 'ai',
    title: 'mbti-web',
    sub: 'mbti.tenflake.cn',
    desc: 'MBTI 测试站，前端、后端、部署一个人全包。',
    href: 'https://mbti.tenflake.cn',
    hrefLabel: 'mbti.tenflake.cn',
  },
  {
    id: 'tuoyu',
    year: 2025,
    phase: 'ai',
    title: 'childcare-agent',
    sub: 'tuoyu.tenflake.cn',
    desc: '托育场景的智能体：问答、流程、记录串在一条线上，给真实业务用。',
    href: 'https://tuoyu.tenflake.cn',
    hrefLabel: 'tuoyu.tenflake.cn',
  },
  {
    id: 'maison',
    year: 2025,
    phase: 'ai',
    title: 'maison-des-mots',
    sub: '文字的房子',
    desc: '给词句住的地方，一个把文本重新组织成结构的小实验。',
    href: 'https://github.com/BaxterL/maison-des-mots',
    hrefLabel: 'github.com/BaxterL/maison-des-mots',
  },
]

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025]

export const ABOUT: string[] = [
  '凛冬初十，网上一般叫 BaxterL。2020 年开始做 Minecraft 原版内容：地图、数据包、资源包，主战场是命令和计分板优化。那几年最完整的一件是 JAM，发在 MineBBS；另外还有一批作品跟着 MCBBS 一起下线了。',
  '2023 年前后开始把重复的活写成工具：计分板树生成器、webtool，还有一堆没开源的小脚本。同一时期也在做独立项目——医疗管理系统 MedicalSys、杀戮尖塔 2 的模组系列「主权之刃」、方块可见性 PlayerVisibleBlock。',
  '2024 年之后主要做 AI 应用：ai-daily-brief 把信息源压成简报，mbti-web 和 childcare-agent 落在 mbti.tenflake.cn、tuoyu.tenflake.cn 上，最近在折腾 maison-des-mots。',
  '技术栈偏杂：C++、JavaScript、Kotlin、Java、Python 都写，日常在 Linux 上，Redis、MySQL、Git 算熟。B 站还留着一批命令教程，已经退坑，视频还在。',
]

export const STACK: string[] = [
  'C++',
  'JavaScript',
  'Kotlin',
  'Java',
  'Python',
  'Linux',
  'Redis',
  'MySQL',
  'Git',
]

export const FACTS: Array<{ k: string; v: string }> = [
  { k: '起点', v: '2020 · Minecraft' },
  { k: '阶段', v: '指令 → 工具 → 独立项目 → AI' },
  { k: '作品', v: '13 件（列出来的）' },
  { k: '坐标', v: 'UTC+8' },
]

export interface LinkItem {
  num: string
  label: string
  note: string
  href: string
  go: string
  external?: boolean
}

export const LINKS: LinkItem[] = [
  { num: 'L.01', label: 'GitHub', note: '@BaxterL', href: SITE.github, go: 'GITHUB', external: true },
  { num: 'L.02', label: '个人网站', note: 'tenflake.cn', href: SITE.site, go: 'VISIT', external: true },
  {
    num: 'L.03',
    label: 'B 站空间',
    note: '命令教程 · 已停更',
    href: SITE.bilibili,
    go: 'BILIBILI',
    external: true,
  },
  { num: 'L.04', label: '命令宝典', note: '旧站收录的指令资料 · 内部页', href: '#/book', go: 'OPEN' },
  {
    num: 'L.05',
    label: 'dsh-code-taste',
    note: 'the whale learns your coding taste',
    href: 'https://github.com/BaxterL/dsh-code-taste',
    go: 'REPO',
    external: true,
  },
  { num: 'L.06', label: '旧版站点', note: 'legacy/v1 分支封存', href: '#/archive', go: 'SEE' },
]

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
