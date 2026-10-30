// Record a transition as a frame sequence (Page.startScreencast), so timing can
// be judged without screenshot latency.
//   node _tools/recast.mjs --url http://localhost:4190 --out ../_shots/recast --click 关于 --ms 2200
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const arg = (k, d) => {
  const i = args.indexOf('--' + k)
  return i === -1 ? d : args[i + 1]
}
const baseUrl = arg('url', 'http://localhost:4190')
const outDir = path.resolve(arg('out', '_shots/recast'))
const width = Number(arg('width', 1440))
const height = Number(arg('height', 900))
const clickText = arg('click', '关于')
const ms = Number(arg('ms', 2200))
const every = Number(arg('every', 3))
const chromePath = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
const port = Number(arg('port', 9700 + Math.floor(Math.random() * 90)))

await mkdir(outDir, { recursive: true })
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-background-timer-throttling',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${process.env.TEMP || '.'}/cdp-recast-${Date.now()}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const sleep = (r) => new Promise((res) => setTimeout(res, r))
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
const frames = []
let sessionId = null
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id)
    pending.delete(m.id)
    m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result)
  } else if (m.method === 'Page.screencastFrame') {
    frames.push({ t: m.params.metadata.timestamp, data: m.params.data })
    ws.send(JSON.stringify({ id: id++, method: 'Page.screencastFrameAck', params: { sessionId: m.params.sessionId }, sessionId }))
  }
})
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true })
  ws.addEventListener('error', rej, { once: true })
})
const send = (method, params = {}, sid) => {
  const n = id++
  ws.send(JSON.stringify({ id: n, method, params, sessionId: sid }))
  return new Promise((resolve, reject) => pending.set(n, { resolve, reject }))
}
const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const attached = await send('Target.attachToTarget', { targetId, flatten: true })
sessionId = attached.sessionId
await send('Page.enable', {}, sessionId)
await send('Runtime.enable', {}, sessionId)
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false }, sessionId)
if (clickText === 'none') {
  await send('Page.startScreencast', { format: 'png', maxWidth: width, maxHeight: height, everyNthFrame: 1 }, sessionId)
  await send('Page.navigate', { url: baseUrl + '/?t=' + Date.now() }, sessionId)
} else {
  await send('Page.navigate', { url: baseUrl + '/' }, sessionId)
  await sleep(2600)
  await send(
    'Runtime.evaluate',
    {
      expression: `[...document.querySelectorAll('.index__item')].find(b => b.textContent.includes(${JSON.stringify(clickText)})).click()`,
    },
    sessionId,
  )
  await send('Page.startScreencast', { format: 'png', maxWidth: width, maxHeight: height, everyNthFrame: 1 }, sessionId)
}
await sleep(ms)
await send('Page.stopScreencast', {}, sessionId)
await sleep(300)

let kept = 0
for (let i = 0; i < frames.length; i += every) {
  const f = frames[i]
  const name = path.join(outDir, `f${String(i).padStart(3, '0')}.png`)
  await writeFile(name, Buffer.from(f.data, 'base64'))
  kept++
}
console.log(`frames ${frames.length}, kept ${kept} → ${outDir}`)
ws.close()
chrome.kill()
process.exit(0)

