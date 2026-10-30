import { SITE } from '../content'
import { SECTION_META, SECTION_ORDER, type SectionId } from '../core/poses'

export function SoundButton({
  soundOn,
  onToggleSound,
  className = '',
}: {
  soundOn: boolean
  onToggleSound: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`sound${soundOn ? ' is-on' : ''}${className ? ' ' + className : ''}`}
      onClick={onToggleSound}
      aria-pressed={soundOn}
    >
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      SOUND {soundOn ? 'ON' : 'OFF'}
    </button>
  )
}

export function Masthead({
  soundOn,
  onToggleSound,
}: {
  soundOn: boolean
  onToggleSound: () => void
}) {
  return (
    <header className="masthead">
      <div className="masthead__brand">
        <b>{SITE.latin}</b>
        <span className="masthead__cjk">{SITE.name}</span>
      </div>
      <div className="masthead__meta">
        <span>
          INDEX <b>00—05</b>
        </span>
        <span>2019—2026</span>
      </div>
      <SoundButton soundOn={soundOn} onToggleSound={onToggleSound} className="sound--masthead" />
    </header>
  )
}

export function Nav({
  current,
  go,
  onHover,
}: {
  current: SectionId
  go: (next: SectionId) => void
  onHover: () => void
}) {
  return (
    <nav className="index" aria-label="索引">
      {SECTION_ORDER.map((id) => {
        const meta = SECTION_META[id]
        const active = id === current
        return (
          <button
            key={id}
            type="button"
            className={`index__item${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => go(id)}
            onPointerEnter={onHover}
          >
            <span className="index__dot" aria-hidden="true" />
            <span className="index__num">{meta.num}</span>
            <span className="index__label">
              {meta.zh}
              <small>{meta.en}</small>
            </span>
            <span className="index__rule" aria-hidden="true" />
          </button>
        )
      })}
    </nav>
  )
}

export function Rail({
  soundOn,
  onToggleSound,
  autoPlay,
  onToggleAuto,
}: {
  soundOn: boolean
  onToggleSound: () => void
  autoPlay: boolean
  onToggleAuto: () => void
}) {
  return (
    <footer className="rail">
      <span>
        © {SITE.year} {SITE.name} / {SITE.latin}
      </span>
      <span className="rail__hint">
        {autoPlay ? (
          '滚轮切换页面'
        ) : (
          <span className="rail__keys">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span>
          </span>
        )}
      </span>
      <span className="rail__actions">
        <button
          type="button"
          className={`sound play${autoPlay ? ' is-on' : ''}`}
          onClick={onToggleAuto}
          aria-pressed={autoPlay}
          title="开启后可用滚轮切换页面"
        >
          <i className="play__dot" aria-hidden="true" />
          PLAY {autoPlay ? 'ON' : 'OFF'}
        </button>
        <SoundButton soundOn={soundOn} onToggleSound={onToggleSound} className="sound--rail" />
      </span>
    </footer>
  )
}
