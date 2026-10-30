/** All the words in one editable file. */

export const SITE = {
  name: '凛冬初十',
  latin: 'BAXTERL',
  role: 'MINECRAFT 指令 · 小工具 · 网页动效',
  tagline: '这里什么都没有，只有一面墙、几块颜色和一条网格。',
  location: 'UTC+8',
  year: '2026',
  github: 'https://github.com/BaxterL',
  repo: 'https://github.com/BaxterL/BaxterL.github.io',
  site: 'http://tenflake.cn',
}

export interface WorkItem {
  num: string
  title: string
  desc: string
  href: string
  cta: string
  color: string
  external?: boolean
}

export const WORK: WorkItem[] = [
  {
    num: 'W.01',
    title: '计分板树生成器',
    desc: '把分数区间穷举成一棵命令树，直接打成数据包。',
    href: '/scbtree.html',
    cta: '打开工具',
    color: '#E03C31',
  },
  {
    num: 'W.02',
    title: 'URL 编码小工具',
    desc: '一个普通的 url 编码转换小工具，够用就行。',
    href: '/tool.html',
    cta: '打开工具',
    color: '#F2B705',
  },
  {
    num: 'W.03',
    title: 'dsh-code-taste',
    desc: '让鲸鱼持续学习你的代码品味的 DeepSeek Harness 插件。',
    href: '/dsh-code-taste.html',
    cta: '查看说明',
    color: '#1E4FA3',
  },
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
  {
    num: 'L.01',
    label: 'GitHub',
    note: '@BaxterL',
    href: SITE.github,
    go: 'GITHUB',
    external: true,
  },
  {
    num: 'L.02',
    label: '个人网站',
    note: 'tenflake.cn',
    href: SITE.site,
    go: 'VISIT',
    external: true,
  },
  {
    num: 'L.03',
    label: '命令宝典',
    note: '旧站收录的指令资料 · 内部页',
    href: '#/book',
    go: 'OPEN',
  },
  {
    num: 'L.04',
    label: 'dsh-code-taste',
    note: 'the whale learns your coding taste',
    href: 'https://github.com/BaxterL/dsh-code-taste',
    go: 'REPO',
    external: true,
  },
  {
    num: 'L.05',
    label: '旧版站点',
    note: 'legacy/v1 分支封存',
    href: '#/archive',
    go: 'SEE',
  },
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
      {
        title: '字体艺术',
        href: 'https://www.mcbbs.net/thread-835539-1-1.html',
        note: 'mcbbs',
      },
      {
        title: '去除文字阴影',
        href: 'https://github.com/PuckiSilver/NoShadow',
        note: 'NoShadow',
      },
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
