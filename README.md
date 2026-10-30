# 凛冬初十 · BAXTERL — 个人索引

[![site](https://img.shields.io/badge/site-baxterl.github.io-111111)](https://baxterl.github.io)
[![stack](https://img.shields.io/badge/stack-React%2019%20%2B%20TS%20%2B%20GSAP%20%2B%20Canvas-E03C31)](package.json)
[![style](https://img.shields.io/badge/style-%E5%87%A0%E4%BD%95%E6%9E%84%E6%88%90%20%2F%20%E5%8C%85%E8%B1%AA%E6%96%AF-F2B705)](https://github.com/Vincentwei1021/mg-styles-15/blob/main/prompts/09-bauhaus.md)

> 这里什么都没有 —— 只有一面墙、几块颜色和一条网格。

旧版（原生 HTML / CSS / JS）原样封存在 [`legacy/v1`](../../tree/legacy/v1) 分支与 `v1-legacy` 标签里，一个字节都没改。
新版是一个**单屏、无滚动**的几何构成 / 包豪斯动效页面：进来就播放落地动画，页面之间靠机械转场切换。

## 站点结构

```
/                       React 单屏主页（5 个索引节 + 命令宝典）
  #/                    00 索引 · POSTER
  #/about               01 关于
  #/work                02 作品
  #/links               03 链接
  #/archive             04 旧版封存
  #/book                命令宝典（唯一可滚动的文档页）

/scbtree.html          计分板树生成器      ← 旧站原文件，URL 不变
/tool.html             URL 编码小工具      ← 旧站原文件，URL 不变
/dsh-code-taste.html   DSH 插件说明页      ← 旧站原文件，URL 不变
/test.html             旧测试页            ← 旧站原文件，URL 不变
/assets/**             图床 / 静态资源     ← 路径与内容都不变
/css/** /js/** /md/**  旧站的样式、脚本、markdown ← 原样保留
```

所有旧文件都放在 `public/` 下，构建时被原封不动复制到 `docs/`，所以旧链接（包括图床的 `/assets/dsh-code-taste/banner.png`）继续可用。

## 开发

```bash
npm install        # 依赖：react / react-dom / gsap / @gsap/react（无 UI 框架）
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build → docs/
npm run preview    # 预览构建产物
```

目录：

```
src/
  App.tsx              路由 / 键盘 / 手势 / 转场编排
  content.ts           全站文案与链接（改字只改这里）
  components/          Masthead · Nav · Rail · Sections · Book · FlipField（翻片墙）
  core/
    engine.ts          海报引擎：零件拼装、版式切换、120BPM 结构时钟
    painter.ts         网格 / 几何图形 / 零件拼装（fan·quad·tri）
    poses.ts           每个节的版式坐标（横屏 + 竖屏两套）
    layout.ts          模块化网格度量
    ease.ts            机械缓动（power2 in/out，禁用回弹）
    sound.ts           WebAudio 合成的印刷机音效（默认静音）
  styles/index.css     版式、印刷质感、响应式
public/                旧站全部静态文件（原样）
docs/                  构建产物（GitHub Pages 从这里发布）
_tools/                截图 / 转场逐帧 / 冒烟测试脚本（headless Chrome + CDP）
```

## 动效与交互

- **入场**：网格线先画出，几何体从**零件状态**拼装起来（圆拆成四瓣、三角拆成三片、方块拆成四格），随后字块从遮罩里升起。
- **转场**：整屏 **16×N 方块翻面**（flip-dot 翻片）：一半正转一半反转、中心向外散开，合上时背面是一块用方块拼出来的目标节编号（00–04），再继续翻 180° 把新页面剥出来；同时新版几何体重新拼装。
- **无滚动**：主页锁定单屏（`overflow: hidden` + 滚轮拦截）；只有 `#/book` 文档页内部可滚。
- **输入**：`↑ ↓` / `← →` / `1–5` / 右侧索引 / 手机左右上下滑；`Esc` 关闭命令宝典。
- **声音**：右下角 `SOUND` 开关（默认关，本地记住选择），落版有印刷机式的 tick / thock。
- **可访问性**：`prefers-reduced-motion` 时跳过全部编排，直接呈现静止海报。

## 发布（GitHub Pages）

构建产物已提交在 `docs/`，无需 Actions：

1. 仓库 **Settings → Pages**；
2. **Source** 选 `Deploy from a branch`；
3. **Branch** 选 `main`，目录选 `/docs`，保存；
4. 等一分钟，访问 https://baxterl.github.io 。

> `docs/.nojekyll` 已存在，避免 Jekyll 改写资源目录。
> 如果以后改回根目录发布，需要把 `vite.config.ts` 的 `outDir` 换成根目录并能接受源码和产物混住——不建议。

## 旧版封存

| 位置 | 内容 |
| --- | --- |
| 分支 `legacy/v1` | 旧站完整快照（含旧 `index.html`、`css/`、`js/`、`md/`、`assets/`） |
| 标签 `v1-legacy` | 只读参照点，不随分支移动 |
| 提交 `dbb0f5b` | 封存时最后一个提交（补回 promo SVG） |

恢复旧站：`git checkout legacy/v1`，或 `git worktree add ../old-site legacy/v1`。

## 鸣谢

动效语言参考了 [mg-styles-15 · 09-bauhaus](https://github.com/Vincentwei1021/mg-styles-15/blob/main/prompts/09-bauhaus.md)（几何构成 / 包豪斯动态海报）：严格模数网格、三原色加黑白、绕轴旋转与节拍驱动、`power2` 缓动且禁止 overshoot。

