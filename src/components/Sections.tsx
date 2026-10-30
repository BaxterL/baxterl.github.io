import type { CSSProperties } from 'react'
import { LEGACY, LINKS, SITE, WORK } from '../content'
import type { SectionId } from '../core/poses'

const r = (i: number): CSSProperties => ({ '--i': i } as CSSProperties)

export function SectionView({
  section,
  go,
}: {
  section: SectionId
  go: (next: SectionId) => void
}) {
  return (
    <div className={`section section--${section}`}>
      <div className="section__wash" />
      <div className="stack">
        {section === 'home' && <Home go={go} />}
        {section === 'about' && <About go={go} />}
        {section === 'work' && <Work go={go} />}
        {section === 'links' && <Links />}
        {section === 'archive' && <Archive go={go} />}
      </div>
    </div>
  )
}

function Head({ meta, kicker }: { meta: string; kicker: string }) {
  return (
    <div className="section__head reveal" style={r(0)}>
      <span className="section__num">{meta}</span>
      <span className="section__kicker">{kicker}</span>
    </div>
  )
}

function Title({ zh, latin }: { zh: string; latin?: string }) {
  return (
    <h1 className="section__title">
      <span className="wordmark-line" style={r(1)}>
        <span>{zh}</span>
      </span>
      {latin && (
        <span className="latin wordmark-line" style={r(2)}>
          <span className="outline">{latin}</span>
        </span>
      )}
    </h1>
  )
}

function Home({ go }: { go: (s: SectionId) => void }) {
  return (
    <>
      <div className="stamp reveal" style={r(0)}>
        <b>PERSONAL INDEX</b>
        <span>REV. 2026 — 单屏 · 无滚动</span>
      </div>
      <Head meta="00" kicker="POSTER · 索引" />
      <Title zh={SITE.name} latin={SITE.latin} />
      <p className="section__lead reveal" style={r(4)}>
        {SITE.tagline}
      </p>
      <div className="section__foot reveal" style={r(5)}>
        <button className="btn btn--solid" onClick={() => go('about')}>
          进入索引 <span className="btn__arrow">→</span>
        </button>
        <span className="micro">按 ↑ ↓ 或右侧编号切换</span>
      </div>
    </>
  )
}

function About({ go }: { go: (s: SectionId) => void }) {
  return (
    <>
      <Head meta="01" kicker="ABOUT · 关于" />
      <Title zh="做指令的人" />
      <div className="section__body reveal" style={r(3)}>
        <p>
          在 Minecraft 里写命令、做计分板优化、给地图写逻辑。遇到重复的活就顺手写成工具，比如那棵
          <a className="ink-link" href="/scbtree.html">
            计分板树
          </a>
          。
        </p>
        <p>
          也折腾网页动效和 DeepSeek Harness 插件。喜欢包豪斯的那套规矩：东西都要落在线上，颜色只留三种，动效不许回弹。
        </p>
      </div>
      <dl className="facts reveal" style={r(4)}>
        <div>
          <dt>现在</dt>
          <dd>计分板树生成器 · dsh-code-taste</dd>
        </div>
        <div>
          <dt>工具</dt>
          <dd>TypeScript / Python / Canvas / GSAP</dd>
        </div>
        <div>
          <dt>坐标</dt>
          <dd>UTC+8</dd>
        </div>
      </dl>
      <blockquote className="quote reveal" style={r(5)}>
        “我没有说过这句话。” <cite>— 旧站第二个页面</cite>
      </blockquote>
      <div className="section__foot reveal" style={r(6)}>
        <button className="btn" onClick={() => go('work')}>
          看看做了什么 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

function Work({ go }: { go: (s: SectionId) => void }) {
  return (
    <>
      <Head meta="02" kicker="WORK · 作品" />
      <Title zh="三个小东西" />
      <div className="cards">
        {WORK.map((w, i) => (
          <a
            className="card reveal"
            key={w.num}
            href={w.href}
            style={{ ...r(3 + i), '--card-color': w.color } as CSSProperties}
          >
            <div className="card__top">
              <span>{w.num}</span>
              <span>{w.cta}</span>
            </div>
            <h2 className="card__title">{w.title}</h2>
            <p className="card__desc">{w.desc}</p>
            <div className="card__foot">
              <span>打开</span>
              <span className="arrow">→</span>
            </div>
          </a>
        ))}
      </div>
      <div className="section__foot reveal" style={r(6)}>
        <button className="btn" onClick={() => go('links')}>
          还有别的入口 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

function Links() {
  return (
    <>
      <Head meta="03" kicker="LINKS · 链接" />
      <Title zh="从这里出去" />
      <div className="links">
        {LINKS.map((l, i) => (
          <a
            className="link-row reveal"
            key={l.num}
            href={l.href}
            style={r(3 + i)}
            {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <span className="link-row__num">{l.num}</span>
            <span className="link-row__label">
              {l.label}
              <small>{l.note}</small>
            </span>
            <span className="link-row__go">
              {l.go} <span className="arrow">{l.external ? '↗' : '→'}</span>
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

function Archive({ go }: { go: (s: SectionId) => void }) {
  return (
    <>
      <Head meta="04" kicker="ARCHIVE · 旧版" />
      <Title zh="旧版封存" />
      <div className="section__body reveal" style={r(2)}>
        <p>
          旧站（原生 HTML / CSS / JS）一个字节都没改，整体封存在 <b>{LEGACY.branch}</b> 分支和{' '}
          <b>{LEGACY.tag}</b> 标签里。新站只换了门口那面墙。
        </p>
      </div>
      <div className="sheet">
        <div className="sheet__block reveal" style={r(3)}>
          <h3>封存方案 / SNAPSHOT</h3>
          <ul>
            <li>分支 {LEGACY.branch}：完整旧站快照</li>
            <li>标签 {LEGACY.tag}：只读参照点</li>
            <li>首页、样式、脚本全部原样保留</li>
          </ul>
        </div>
        <div className="sheet__block reveal" style={r(4)}>
          <h3>仍然可用 / STILL LIVE</h3>
          <ul>
            <li>
              <a className="ink-link" href="/scbtree.html">
                /scbtree.html
              </a>{' '}
              计分板树
            </li>
            <li>
              <a className="ink-link" href="/tool.html">
                /tool.html
              </a>{' '}
              URL 编码
            </li>
            <li>
              <a className="ink-link" href="/dsh-code-taste.html">
                /dsh-code-taste.html
              </a>{' '}
              插件说明
            </li>
            <li>/assets/** 图床与静态资源路径不变</li>
          </ul>
        </div>
      </div>
      <div className="section__foot reveal" style={r(5)}>
        <a className="btn btn--solid" href={LEGACY.branchUrl} target="_blank" rel="noreferrer">
          打开 {LEGACY.branch} <span className="btn__arrow">↗</span>
        </a>
        <button className="btn" onClick={() => go('home')}>
          回到首页 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

