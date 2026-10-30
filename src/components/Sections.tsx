import { useMemo, useState, type CSSProperties } from 'react'
import {
  ABOUT,
  FACTS,
  FINAL,
  FRIENDS,
  INTERESTS,
  LINKS,
  PERIODS,
  PHASES,
  REPO_DESC,
  SITE,
  STACK,
  WORK,
} from '../content'
import { REPOS } from '../data/repos'
import type { SectionId } from '../core/poses'
import { TerminalView } from './Terminal'

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
        {section === 'work' && <Work go={go} />}
        {section === 'repos' && <Repos />}
        {section === 'about' && <About go={go} />}
        {section === 'links' && <Links go={go} />}
        {section === 'terminal' && <TerminalScreen />}
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
        <b>PORTFOLIO</b>
        <span>2019 — 2026</span>
      </div>
      <Head meta="00" kicker="INDEX · 作品集" />
      <Title zh={SITE.name} latin={SITE.latin} />
      <p className="section__lead reveal" style={r(4)}>
        {SITE.tagline}
      </p>
      <dl className="facts reveal" style={r(5)}>
        {FACTS.map((f) => (
          <div key={f.k}>
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
      <div className="section__foot reveal" style={r(6)}>
        <button className="btn btn--solid" onClick={() => go('work')}>
          查看作品 <span className="btn__arrow">→</span>
        </button>
        <button className="btn" onClick={() => go('links')}>
          联系方式 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

function Work({ go }: { go: (s: SectionId) => void }) {
  const [hover, setHover] = useState<string | null>(null)
  const current = WORK.find((w) => w.id === hover)
  return (
    <>
      <Head meta="01" kicker="WORK · 时间线 2019—2026 · ★ 代表作" />
      <Title zh="一路做过来" />
      <div className="timeline reveal" style={r(2)} onPointerLeave={() => setHover(null)}>
        {PERIODS.map((period) => (
          <div className="tl-col" key={period}>
            <div className="tl-tick">
              <i />
              {period}
            </div>
            <div className="tl-stack">
              {WORK.filter((w) => w.period === period).map((w) => {
                const Tag = w.href ? 'a' : 'div'
                return (
                  <Tag
                    key={w.id}
                    className={`tl-card${hover === w.id ? ' is-hot' : ''}${
                      w.href ? '' : ' is-flat'
                    }`}
                    href={w.href}
                    {...(w.href?.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {})}
                    onPointerEnter={() => setHover(w.id)}
                    onFocus={() => setHover(w.id)}
                    style={{ '--c': PHASES[w.phase].color } as CSSProperties}
                  >
                    <i className="tl-card__dot" />
                    {w.pick && (
                      <i className="tl-card__pick" title="代表作">
                        ★
                      </i>
                    )}
                    <span className="tl-card__title">{w.title}</span>
                    <span className="tl-card__sub">{w.sub}</span>
                  </Tag>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="tl-caption reveal" style={r(5)}>
        <span className="tl-caption__tag">
          {current ? `${current.period} · ${PHASES[current.phase].zh}` : '2019 → 2026'}
        </span>
        <span className="tl-caption__desc">
          {current ? current.desc : '★ 代表作 · 悬停查看细节，点击打开 · 全部仓库在下一页'}
        </span>
      </div>
      <div className="section__foot reveal" style={r(6)}>
        <button className="btn" onClick={() => go('repos')}>
          全部仓库 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

function Repos() {
  const [lang, setLang] = useState('全部')
  const langs = useMemo(() => {
    const map = new Map<string, number>()
    REPOS.forEach((repo) => {
      const key = repo.lang || '其他'
      map.set(key, (map.get(key) ?? 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [])
  const list = lang === '全部' ? REPOS : REPOS.filter((repo) => (repo.lang || '其他') === lang)

  return (
    <>
      <Head meta="02" kicker={`REPOS · ${REPOS.length} 个公开仓库`} />
      <Title zh="仓库" latin="REPOS" />
      <div className="chips reveal" style={r(2)}>
        <button
          type="button"
          className={`chip${lang === '全部' ? ' is-on' : ''}`}
          onClick={() => setLang('全部')}
        >
          全部 <b>{REPOS.length}</b>
        </button>
        {langs.map(([name, count]) => (
          <button
            type="button"
            key={name}
            className={`chip${lang === name ? ' is-on' : ''}`}
            onClick={() => setLang(name)}
          >
            {name} <b>{count}</b>
          </button>
        ))}
      </div>
      <div className="repo-list reveal" style={r(3)}>
        {list.map((repo) => (
          <a className="repo" key={repo.name} href={repo.url} target="_blank" rel="noreferrer">
            <span className="repo__name">{repo.name}</span>
            <span className="repo__desc">{REPO_DESC[repo.name] ?? repo.desc}</span>
            <span className="repo__lang">{repo.lang || '—'}</span>
            <span className="repo__date">{repo.pushed}</span>
            <span className="repo__go">↗</span>
          </a>
        ))}
      </div>
      <div className="tl-caption reveal" style={r(4)}>
        <span className="tl-caption__tag">GITHUB</span>
        <span className="tl-caption__desc">按最近提交排序 · 语言来自 GitHub 统计 · 点击打开</span>
      </div>
    </>
  )
}

function About({ go }: { go: (s: SectionId) => void }) {
  return (
    <>
      <Head meta="03" kicker="ABOUT · 关于" />
      <Title zh="做东西的人" latin="ABOUT" />
      <div className="section__body reveal" style={r(3)}>
        {ABOUT.map((p) => (
          <p key={p.slice(0, 8)}>{p}</p>
        ))}
      </div>
      <div className="stack-groups reveal" style={r(4)} aria-label="技术栈">
        {STACK.map((group) => (
          <div className="stack-row" key={group.label}>
            <span className="pills__label">{group.label}</span>
            <span className="pills">
              {group.items.map((item) => (
                <span className="pill" key={item}>
                  {item}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <p className="likes reveal" style={r(5)}>
        <span className="pills__label">ALSO INTO</span>
        {INTERESTS.join(' · ')}
      </p>
      <div className="section__foot reveal" style={r(6)}>
        <button className="btn" onClick={() => go('terminal')}>
          在终端里看 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

function Links({ go }: { go: (s: SectionId) => void }) {
  return (
    <>
      <Head meta="04" kicker="LINKS · 联系" />
      <Title zh="从这里出去" />
      <div className="links">
        {LINKS.map((l, i) => (
          <a
            className="link-row reveal"
            key={l.num}
            href={l.href}
            style={r(2 + i)}
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
      <div className="friends reveal" style={r(6)}>
        <span className="pills__label">FRIENDS</span>
        {FRIENDS.map((f) => (
          <a className="friend" key={f.href} href={f.href} target="_blank" rel="noreferrer">
            {f.label}
            <small>{f.note}</small>
          </a>
        ))}
      </div>
      <div className="section__foot reveal" style={r(7)}>
        <button className="btn" onClick={() => go('terminal')}>
          最后，终端 <span className="btn__arrow">→</span>
        </button>
      </div>
    </>
  )
}

function TerminalScreen() {
  return (
    <>
      <Head meta="05" kicker="TERMINAL · WHOAMI" />
      <div className="final">
        <div className="final__main">
          <p className="final__prompt reveal" style={r(1)}>
            $ whoami
          </p>
          <p className="final__name reveal" style={r(2)}>
            baxterl
          </p>
          <p className="final__sub reveal" style={r(3)}>
            写代码、做视觉、偶尔做模组。这台机器上还剩 24 个公开仓库。
          </p>
          <TerminalView />
        </div>
        <aside className="final__spec reveal" style={r(4)}>
          <div>
            <span>NODE</span>
            <b>{FINAL.node}</b>
          </div>
          <div>
            <span>BUILD</span>
            <b>{FINAL.build}</b>
          </div>
          <div>
            <span>STATUS</span>
            <b>{FINAL.status}</b>
          </div>
          <div>
            <span>SIGNAL</span>
            <b>{FINAL.signal.join(' / ')}</b>
          </div>
        </aside>
      </div>
    </>
  )
}
