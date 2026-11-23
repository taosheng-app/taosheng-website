#!/usr/bin/env node
/**
 * 部署工作流用：判断要不要重建官网，并在 App 发了新正式版时开一个“核对官网”Issue。
 *
 *   node scripts/release-check.mjs decide   # 写 need/version/new_release 到 $GITHUB_OUTPUT
 *   node scripts/release-check.mjs issue <version>
 *
 * 判断规则：GitHub 最新正式版或 CHANGELOG.md 顶部版本，和线上 /build.json 记录的不一样就重建。
 * 这样 App 一发版，最多一小时内官网的版本号、更新日志就跟上；没变化时不白跑部署。
 */
import { appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const APP_REPO = '0xCoach/TaoSheng';
const SITE = 'https://taosheng.app';
const RAW = `https://raw.githubusercontent.com/${APP_REPO}/main/CHANGELOG.md`;

const out = (k, v) => {
  console.log(`${k}=${v}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
};

async function get(url, init = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res;
}

async function latestRelease() {
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'taosheng-website-ci' };
  if (process.env.GH_TOKEN) headers.authorization = `Bearer ${process.env.GH_TOKEN}`;
  const r = await (await get(`https://api.github.com/repos/${APP_REPO}/releases/latest`, { headers })).json();
  return String(r.tag_name).replace(/^v/, '');
}

const changelogText = async () => (await get(RAW)).text();
const topVersion = (md) => md.match(/^##\s+(\d+\.\d+\.\d+)\s/m)?.[1] ?? '';

async function decide() {
  const [release, md] = await Promise.all([latestRelease(), changelogText()]);
  const log = topVersion(md);
  let live = {};
  try { live = await (await get(`${SITE}/build.json?t=${Date.now()}`, { cache: 'no-store' })).json(); } catch (e) {
    console.log('读不到线上 build.json，按需要重建处理：', e.message);
  }
  console.log(`GitHub 最新版 ${release}，CHANGELOG 顶部 ${log}；线上 release=${live.release ?? '-'} changelog=${live.changelog ?? '-'}`);
  const newRelease = live.release !== undefined && live.release !== release;
  out('need', String(live.release !== release || live.changelog !== log));
  out('version', release);
  out('new_release', String(newRelease));
}

/** 中文条目 → 可能要改的官网位置 */
const PLACES = [
  [/备份|恢复/, '指南「推送、备份与智能体」、首页功能卡「加密增量备份」'],
  [/转写|识别|NPU|SenseVoice|热词/, '指南「转写和大模型怎么选」、安装页「需要什么」'],
  [/整理|大模型|模型|思考/, '指南「转写和大模型怎么选」'],
  [/录音输入|麦克风|蓝牙|USB|有线|外接|大疆|D3200/, '首页「硬件」一节、常见问题「需要买录音硬件吗」'],
  [/夜里|睡眠|鼾声|咳嗽|梦话|醒/, '指南「夜间睡眠」、首页夜里一节'],
  [/待办|提醒|日历|小组件/, '指南「待办与提醒」、首页待办一节'],
  [/足迹|位置|地点/, '指南「位置足迹」、首页足迹一节'],
  [/寻物|东西/, '指南「寻物」'],
  [/通话/, '指南「通话录音」'],
  [/声纹|说话人/, '指南「声纹认人」'],
  [/专题|会议|纪要|打点/, '指南「专题录音与打点」'],
  [/推送|Notion|Webhook|坚果云/, '指南「推送、备份与智能体」'],
  [/保活|后台|耗电|省电/, '指南「让它一直在后台」、常见问题「费电吗」'],
  [/向导|开箱|权限/, '指南「安装与开箱」'],
];
// 会让说明过时的改动：默认值、入口、开关、新功能
const KEY = /默认|设置 ?→|改名|改成|改为|新增|不再|开关|只有一个|入口|移到|去掉/;

async function issue(version) {
  if (!version) throw new Error('缺版本号');
  const title = `核对官网：v${version} 发版后指南和首页要不要改`;
  const existing = execFileSync('gh', ['issue', 'list', '--state', 'all', '--search', `"v${version}" in:title 核对官网`, '--json', 'title', '--jq', '.[].title'], { encoding: 'utf8' });
  if (existing.split('\n').includes(title)) return console.log('已经开过：', title);

  const md = await changelogText();
  const start = md.search(new RegExp(`^## ${version.replace(/\./g, '\\.')}\\s`, 'm'));
  if (start < 0) return console.log(`CHANGELOG 里还没有 ${version}，下次再开`);
  const rest = md.slice(start);
  const next = rest.slice(3).search(/^## /m);
  const section = next < 0 ? rest : rest.slice(0, next + 3);

  const lines = [];
  let group = '';
  for (const raw of section.split('\n').slice(1)) {
    const line = raw.trim();
    const g = line.match(/^【(.+)】$/) || line.match(/^###\s+(.+)$/);
    if (g) { group = g[1]; continue; }
    const it = line.match(/^(?:[·•]|[-*])\s+(.+)$/);
    if (!it) continue;
    const text = it[1];
    const places = [...new Set(PLACES.filter(([re]) => re.test(group + text)).map(([, p]) => p))];
    const key = KEY.test(text);
    lines.push(`- [ ] ${key ? '**重点** ' : ''}${group ? `【${group}】` : ''}${text}${places.length ? `\n  - 可能涉及：${places.join('；')}` : ''}`);
  }

  const body = [
    `App 发了 v${version}，官网的版本号和[更新日志](${SITE}/changelog#v${version})已经自动更新。`,
    '',
    '下面是这一版的改动。标了**重点**的改了默认值、入口或开关，最容易让官网说明过时。逐条看一下 `src/data/guide.ts`、`src/data/home.ts` 和高仿真界面要不要跟着改；不用改的直接勾掉。',
    '',
    ...lines,
    '',
    '改完推 main 会自动部署；全部勾完就关掉这个 Issue。',
  ].join('\n');
  const url = execFileSync('gh', ['issue', 'create', '--title', title, '--body', body], { encoding: 'utf8' }).trim();
  console.log('已开 Issue：', url);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'decide') await decide();
else if (cmd === 'issue') await issue(arg);
else { console.error('用法：release-check.mjs decide | issue <version>'); process.exit(2); }
