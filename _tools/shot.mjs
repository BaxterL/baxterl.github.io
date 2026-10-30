// Screenshot harness for the site preview (headless Chrome over CDP).
// Usage:
//   node _tools/shot.mjs --url http://localhost:4190 --out ../_shots --width 1440 --height 900 \
//        --shots home,about,work,links,archive,book --wait 2400
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const arg = (k, d) => {
  const i = args.indexOf('--' + k)
  return i === -1 ? d : args[i + 1]
}

const baseUrl = arg('url', 'http://localhost:4190')
const outDir = path.resolve(arg('out', '_shots'))
const width = Number(arg('width', 1440))
const height = Number(arg('height', 900))
const wait = Number(arg('wait', 2400))
const shots = arg('shots', 'home').split(',').map((s) => s.trim()).filter(Boolean)
const chromePath = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
const port = Number(arg('port', 9400 + Math.floor(Math.random() * 200)))
const prefix = arg('prefix', '')

await mkdir(outDir, { recursive: true })

const profile = path.join(process.env.TEMP || process.env.TMP || '.', `cdp-shot-${Date.now()}`)
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
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

async function versionInfo() {
  for (let i = 0; i < 60; i++) {
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

const info = await versionInfo()
const ws = new WebSocket(info.webSocketDebuggerUrl)

let nextId = 1
const pending = new Map()
const events = []
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    if (msg.error) reject(new Error(JSON.stringify(msg.error)))
    else resolve(msg.result)
  } else if (msg.method) {
    events.push(msg)
  }
})

await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true })
  ws.addEventListener('error', reject, { once: true })
})

function send(method, params = {}, sessionId) {
  const id = nextId++
  const payload = { id, method, params }
  if (sessionId) payload.sessionId = sessionId
  ws.send(JSON.stringify(payload))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })

await send('Page.enable', {}, sessionId)
await send('Runtime.enable', {}, sessionId)
await send('Log.enable', {}, sessionId)
await send(
  'Emulation.setDeviceMetricsOverride',
  { width, height, deviceScaleFactor: Number(arg('dpr', 1)), mobile: width < 700 },
  sessionId,
)

const problems = []
for (const shot of shots) {
  const hash = shot === 'home' ? '#/' : `#/${shot}`
  await send('Page.navigate', { url: baseUrl + hash }, sessionId)
  await sleep(wait)
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId)
  const file = path.join(outDir, `${prefix}${shot}.png`)
  await writeFile(file, Buffer.from(data, 'base64'))
  console.log(`shot ${file}`)
  for (const e of events) {
    if (e.method === 'Runtime.exceptionThrown') {
      problems.push(`exception: ${JSON.stringify(e.params.exceptionDetails?.exception?.description ?? e.params.exceptionDetails?.text)}`)
    }
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      problems.push(`log: ${e.params.entry.text}`)
    }
  }
  events.length = 0
}

if (problems.length) {
  console.log('--- page errors ---')
  for (const p of problems) console.log(p)
} else {
  console.log('no page errors')
}

ws.close()
chrome.kill()
process.exit(0)
