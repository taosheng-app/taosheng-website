// 导出高仿真界面 PNG（1080×2400）和分享卡片 public/og-cover.jpg。
// 用法：先 npm run build && npx astro preview --port 4329，再 npm run shots。需要本机装有 Google Chrome。
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const base = process.env.BASE || 'http://localhost:4329';
const out = 'design/screens';
mkdirSync(out, { recursive: true });
const snap = (url, file, w, h, dpr) => execFileSync('node', ['scripts/snap.mjs', url, file, String(w), String(h), '0', '0', '0', String(dpr), '2500'], { stdio: 'inherit' });
for (const lang of ['zh', 'en'])
  for (const n of ['today', 'ask', 'memory', 'todo', 'night', 'night-light', 'footprint', 'things', 'alarm'])
    snap(`${base}/shots/${lang}-${n}/`, `${out}/${lang}-${n}.png`, 360, 800, 3);
snap(`${base}/shots/og/`, 'design/og-cover.png', 1200, 630, 1);
execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', 'design/og-cover.png', '--out', 'public/og-cover.jpg']);
console.log('done');
