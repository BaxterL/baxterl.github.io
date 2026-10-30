import { BOOK } from '../content'

export function Book({ onClose }: { onClose: () => void }) {
  return (
    <div className="book" role="dialog" aria-modal="true" aria-label="命令宝典">
      <div className="book__head">
        <h1 className="book__title">
          命令宝典
          <small>THE COMMAND BOOK · 旧站收录 · 链接原样保留</small>
        </h1>
        <button type="button" className="btn" onClick={onClose}>
          <span className="btn__arrow">←</span> 返回索引
        </button>
      </div>
      <div className="book__scroll">
        <p className="book__note">
          这是我收录的一部分关于命令的有用链接。内容来自旧站的 <code>md/link3.md</code>，一个字都没改，只换了一张纸。
        </p>
        <div className="book__grid">
          {BOOK.map((group) => (
            <section className="book__group" key={group.num}>
              <h2>
                <span>{group.num}</span>
                {group.title}
              </h2>
              {group.items.map((item) => (
                <a
                  className="book__item"
                  key={item.title + item.href}
                  href={item.href}
                  {...(item.href.startsWith('/')
                    ? {}
                    : { target: '_blank', rel: 'noreferrer' })}
                >
                  <b>{item.title}</b>
                  {item.note && <small>{item.note}</small>}
                </a>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
