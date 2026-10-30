// Smoke test: navigation, command book, keyboard, scroll lock, reduced motion.
import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
const arg = (k, d) => {
  const i = args.indexOf('--' + k)
  return i === -1 ? d : args[i + 1]
}
const baseUrl = arg('url', 'http://localhost:4190')
const width = Number(arg('width', 1440))
const height = Number(arg('height', 900))
const chromePath = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
const port = Number(arg('port', 9600 + Math.floor(Math.random() * 90)))

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--disable-background-timer-throttling',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${process.env.TEMP || '.'}/cdp-smoke-${Date.now()}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let info
for (let i = 0; i < 60 && !info; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/version`)
    if (res.ok) info = await res.json()
  } catch {
    await sleep(200)
  }
}
const ws = new WebSocket(info.webSocketDebuggerUrl)
let id = 1
const pending = new Map()
const errors = []
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id)
    pending.delete(m.id)
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result)
  } else if (m.method === 'Runtime.exceptionThrown') {
    errors.push(m.params.exceptionDetails?.exception?.description ?? m.params.exceptionDetails?.text)
  }
})
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true })
  ws.addEventListener('error', rej, { once: true })
})
const send = (method, params = {}, sessionId) => {
  const n = id++
  ws.send(JSON.stringify({ id: n, method, params, sessionId }))
  return new Promise((resolve, reject) => pending.set(n, { resolve, reject }))
}
const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
await send('Page.enable', {}, sessionId)
await send('Runtime.enable', {}, sessionId)
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId)

const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId)
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}

const results = []
const check = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
}

await send('Page.navigate', { url: baseUrl + '/' }, sessionId)
await sleep(2600)

const scroll = await evaluate(
  `({ doc: document.documentElement.scrollHeight, win: window.innerHeight, body: document.body.scrollHeight })`,
)
check('no page scroll (desktop)', scroll.doc <= scroll.win + 1 && scroll.body <= scroll.win + 1, JSON.stringify(scroll))

const title = await evaluate(`document.querySelector('.section__title')?.innerText.replace(/\\s+/g,' ')`)
check('home title renders', /凛冬初十/.test(title ?? ''), title)

const visible = await evaluate(
  `(() => { const el = document.querySelector('.section__title'); const cs = getComputedStyle(el); return { o: cs.opacity, name: cs.animationName } })()`,
)
check('home title animated in', Number(visible.o) > 0.9, JSON.stringify(visible))

// navigate by clicking 作品
await evaluate(`[...document.querySelectorAll('.index__item')].find(b => b.textContent.includes('作品')).click()`)
await sleep(1400)
const workTitle = await evaluate(`document.querySelector('.section__title')?.innerText.replace(/\\s+/g,' ')`)
check('nav → 作品', /一路做过来/.test(workTitle ?? ''), workTitle)
check('hash updated', (await evaluate('location.hash')) === '#/work', await evaluate('location.hash'))
const cards = await evaluate(`document.querySelectorAll('.tl-card').length`)
check('14 timeline cards', cards === 14, String(cards))

// keyboard → next section (work → repos)
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 }, sessionId)
await sleep(1400)
check('ArrowDown → 仓库', (await evaluate('location.hash')) === '#/repos', await evaluate('location.hash'))
const repos = await evaluate(`document.querySelectorAll('.repo').length`)
check('repo cards rendered', repos > 10, String(repos))

// jump to links via the index
await evaluate(`[...document.querySelectorAll('.index__item')].find(b => b.textContent.includes('联系')).click()`)
await sleep(1400)
check('nav → 联系', (await evaluate('location.hash')) === '#/links', await evaluate('location.hash'))

// command book
await evaluate(`[...document.querySelectorAll('.link-row')].find(a => a.textContent.includes('命令宝典')).click()`)
await sleep(800)
check('book opens', (await evaluate(`!!document.querySelector('.book')`)) === true)
const bookItems = await evaluate(`document.querySelectorAll('.book__item').length`)
check('book has all links', bookItems >= 15, String(bookItems))
const canScroll = await evaluate(
  `(() => { const el = document.querySelector('.book__scroll'); el.scrollTop = 400; return el.scrollTop > 0 })()`,
)
check('book scrolls internally', canScroll === true)

await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, sessionId)
await sleep(400)
check('Escape closes book', (await evaluate(`!document.querySelector('.book')`)) === true)

// legacy pages still alive
const { statusOf } = await import('./http-status.mjs')
for (const path of ['/scbtree.html', '/tool.html', '/dsh-code-taste.html', '/assets/dsh-code-taste/banner.png']) {
  const status = await statusOf(baseUrl + path)
  check(`legacy ${path} 200`, status === 200, String(status))
}

// reduced motion
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId)
await send('Page.navigate', { url: baseUrl + '/#/about' }, sessionId)
await sleep(1200)
const rm = await evaluate(
  `(() => { const el = document.querySelector('.section__title'); return el ? getComputedStyle(el).opacity : 'missing' })()`,
)
check('reduced-motion still shows content', Number(rm) > 0.9, String(rm))

console.log(results.join('\n'))
if (errors.length) console.log('--- exceptions ---\n' + errors.join('\n'))
ws.close()
chrome.kill()
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0)







