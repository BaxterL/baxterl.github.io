// Measure layout metrics of a section over CDP (headless Chrome).
// Usage: node _tools/measure.mjs --url http://localhost:5179 --hash /terminal --width 1440 --height 900
import { spawn } from 'node:child_process'
import path from 'node:path'

const args = process.argv.slice(2)
const arg = (k, d) => {
  const i = args.indexOf('--' + k)
  return i === -1 ? d : args[i + 1]
}

const baseUrl = arg('url', 'http://localhost:5179')
const hash = arg('hash', '/terminal')
const width = Number(arg('width', 1440))
const height = Number(arg('height', 900))
const wait = Number(arg('wait', 7000))
const chromePath = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
const port = Number(arg('port', 9600 + Math.floor(Math.random() * 200)))

const profile = path.join(process.env.TEMP || process.env.TMP || '.', `cdp-measure-${Date.now()}`)
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--force-color-profile=srgb',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function versionInfo() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (res.ok) return res.json()
    } catch {
      /* not up yet */
    }
    await sleep(250)
  }
  throw new Error('chrome devtools endpoint did not appear')
}

class Cdp {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }))
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails))
    return res.result.value
  }
}

await versionInfo()
let target = null
for (let i = 0; i < 40; i++) {
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  target = list.find((t) => t.type === 'page')
  if (target) break
  await sleep(200)
}
if (!target) throw new Error('no page target')
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true })
  ws.addEventListener('error', reject, { once: true })
})
const cdp = new Cdp(ws)
await cdp.send('Page.enable')
await cdp.send('Runtime.enable')
await cdp.send('Page.navigate', { url: `${baseUrl}/#${hash}` })
await sleep(wait)

const script = arg('eval', '')
if (script) {
  const value = await cdp.eval(script)
  console.log(JSON.stringify(value, null, 2))
}

ws.close()
chrome.kill()
process.exit(0)
