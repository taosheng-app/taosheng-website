// 用法：node snap.mjs <url> <out.png> <width> <height> [mobile=1] [full=0] [scrollY=0] [dpr=2] [wait=2500]
// 通过 CDP 真实模拟手机视口截图（桌面 Chrome 窗口不能小于约 500px）
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, out, w = '390', h = '844', mobile = '1', full = '0', scrollY = '0', dpr = '2', wait = '2500'] = process.argv.slice(2);
const CH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(process.env.SNAP_TMP || tmpdir(), 'snap-'));
const chrome = spawn(CH, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const page = list.find((t) => t.type === 'page');
    if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break; }
  } catch {}
  await sleep(150);
}
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: +dpr, mobile: mobile === '1' });
if (mobile === '1') await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 14; 23116PN5BC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36', acceptLanguage: 'zh-CN' });
await send('Page.navigate', { url });
await sleep(+wait);
if (+scrollY) {
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
  await sleep(1600);
}
const overflow = await send('Runtime.evaluate', { expression: `(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > W + 1 && r.width > 0 && getComputedStyle(el).position !== 'fixed') { let p = el.parentElement, clipped = false; while (p) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; } p = p.parentElement; } if (!clipped) bad.push((el.className && el.className.baseVal === undefined ? el.className : el.tagName) + ' ' + Math.round(r.right)); } }); return JSON.stringify({ W, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 8) }); })()`, returnByValue: true });
console.log('overflow', overflow.result?.result?.value);
let shot;
if (full === '1') {
  await send('Runtime.evaluate', { expression: `document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))` }); await sleep(1500);
  const m = await send('Page.getLayoutMetrics');
  const H = Math.ceil(m.result.cssContentSize.height);
  shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: +w, height: H, scale: 1 } });
} else {
  shot = await send('Page.captureScreenshot', { format: 'png' });
}
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close();
chrome.kill();
console.log('saved', out);
