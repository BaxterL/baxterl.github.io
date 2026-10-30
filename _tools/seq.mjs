// Capture a transition: settle the page, click an index item, then screenshot at
// a series of offsets so the curtain gesture can be reviewed frame by frame.
//   node _tools/seq.mjs --url http://localhost:4190 --out ../_shots/seq --click 关于 \
//        --at 120,300,520,760,1100 --wait 2600
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const arg = (k, d) => {
  const i = args.indexOf('--' + k)
  return i === -1 ? d : args[i + 1]
}

const baseUrl = arg('url', 'http://localhost:4190')
const outDir = path.resolve(arg('out', '_shots/seq'))
const width = Number(arg('width', 1440))
const height = Number(arg('height', 900))
const wait = Number(arg('wait', 2600))
const clickText = arg('click', '关于')
const startHash = arg('hash', '#/')
const at = arg('at', '120,300,520,760,1100').split(',').map(Number)
const chromePath = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
const port = Number(arg('port', 9600 + Math.floor(Math.random() * 200)))

await mkdir(outDir, { recursive: true })
const profile = path.join(process.env.TEMP || '.', `cdp-seq-${Date.now()}`)
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--force-color-profile=srgb',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
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
    await sleep(250)
  }
}
if (!info) throw new Error('no devtools')

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

const shot = async (name) => {
  const { data } = await send('Page.captureScreenshot', { format: 'png' }, sessionId)
  await writeFile(path.join(outDir, `${name}.png`), Buffer.from(data, 'base64'))
  console.log('shot', name)
}
if (clickText !== 'none') {
  await send('Page.navigate', { url: baseUrl + startHash }, sessionId)
  await sleep(wait)
  await shot('00-settled')
  const click = await send(
  'Runtime.evaluate',
  {
    expression: `(() => { const sel = ${JSON.stringify(clickText)}; const el = sel.startsWith('.') ? document.querySelector(sel) : [...document.querySelectorAll('.index__item')].find(b => b.textContent.includes(sel)); if (!el) return 'missing'; el.click(); return 'ok' })()`,
    returnByValue: true,
  },
    sessionId,
  )
  console.log('click', click.result.value)
} else {
  await send('Page.navigate', { url: baseUrl + startHash }, sessionId)
}

const t0 = Date.now()
for (const ms of at) {
  const remain = ms - (Date.now() - t0)
  if (remain > 0) await sleep(remain)
  await shot(`t${String(ms).padStart(4, '0')}`)
}
await sleep(1200)
await shot('99-after')

if (errors.length) console.log('errors:', errors)
ws.close()
chrome.kill()
process.exit(0)

