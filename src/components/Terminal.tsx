import { useEffect, useMemo, useRef, useState } from 'react'
import { TERMINAL } from '../content'

interface Row {
  kind: 'cmd' | 'out'
  text: string
}

export function TerminalView() {
  const rows = useMemo<Row[]>(
    () =>
      TERMINAL.flatMap((t) => [
        { kind: 'cmd' as const, text: t.cmd },
        ...t.out.map((o) => ({ kind: 'out' as const, text: o })),
      ]),
    [],
  )
  const [count, setCount] = useState(0)
  const [typing, setTyping] = useState('')
  const timer = useRef(0)

  useEffect(() => {
    let alive = true
    let row = 0
    let ch = 0
    const tick = () => {
      if (!alive) return
      const r = rows[row]
      if (!r) return
      if (r.kind === 'cmd') {
        ch += 1
        setTyping(r.text.slice(0, ch))
        if (ch >= r.text.length) {
          setCount(row + 1)
          setTyping('')
          row += 1
          ch = 0
          timer.current = window.setTimeout(tick, 180)
        } else {
          timer.current = window.setTimeout(tick, 26)
        }
      } else {
        setCount(row + 1)
        row += 1
        timer.current = window.setTimeout(tick, 70)
      }
    }
    timer.current = window.setTimeout(tick, 320)
    return () => {
      alive = false
      window.clearTimeout(timer.current)
    }
  }, [rows])

  return (
    <div className="term">
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">baxterl@tenflake: ~</span>
        <span className="term__meta">tty0</span>
      </div>
      <div className="term__body">
        {rows.slice(0, count).map((r, i) => (
          <div className={`term__line term__line--${r.kind}`} key={`${r.kind}-${i}`}>
            {r.kind === 'cmd' && <span className="term__prompt">$</span>}
            <span>{r.text}</span>
          </div>
        ))}
        {typing && (
          <div className="term__line term__line--cmd">
            <span className="term__prompt">$</span>
            <span>{typing}</span>
            <i className="term__caret" />
          </div>
        )}
        {!typing && count >= rows.length && (
          <div className="term__line term__line--cmd">
            <span className="term__prompt">$</span>
            <i className="term__caret" />
          </div>
        )}
      </div>
    </div>
  )
}
