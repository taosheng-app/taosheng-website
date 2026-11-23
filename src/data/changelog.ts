/**
 * 更新日志：构建时读 App 仓库的 CHANGELOG.md，解析成结构化数据，生成 /changelog 和 /changelog.xml。
 * App 发版后，部署工作流每小时检查一次，有新版就重建，所以这里不需要手动改。
 *
 * 来源顺序：环境变量 CHANGELOG_PATH 指向的本地文件 → 同级目录的 App 仓库 → GitHub 原文。
 * 在 CI 里读不到就让构建失败（线上保留旧版），不发布空的更新日志页。
 */
import { readFile } from 'node:fs/promises';
import { REPO } from './release';

export interface ChangeGroup {
  title: string;
  items: string[]; // 已转成安全的 HTML
}
export interface ChangeEntry {
  version: string;
  date: string; // YYYY-MM-DD
  headline: string; // 纯文本
  groups: ChangeGroup[];
  notes: string[]; // 升级提醒、致谢等，已转成 HTML
}

const RAW = 'https://raw.githubusercontent.com/0xCoach/TaoSheng/main/CHANGELOG.md';
const LOCAL = ['../TaoSheng-main/CHANGELOG.md', '../TaoSheng/CHANGELOG.md'];

async function source(): Promise<string> {
  const paths = [process.env.CHANGELOG_PATH, ...(process.env.CI ? [] : LOCAL)].filter(Boolean) as string[];
  for (const p of paths) {
    try { return await readFile(p, 'utf8'); } catch {}
  }
  let lastError: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(RAW, { signal: AbortSignal.timeout(15000) });
      if (res.ok) return await res.text();
      lastError = new Error(`HTTP ${res.status}`);
    } catch (e) { lastError = e; }
  }
  if (process.env.CI) throw new Error(`[changelog] 读不到 CHANGELOG.md，停止构建：${lastError}`);
  console.warn('[changelog] 读不到 CHANGELOG.md，更新日志页为空', lastError);
  return '';
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 行内格式：`代码`、**加粗**、#63 链到 Issue、@用户 链到 GitHub。先转义再加标签，不会注入 HTML。 */
export function inline(s: string) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w&/])#(\d{1,5})\b/g, `$1<a href="${REPO}/issues/$2" target="_blank" rel="noopener">#$2</a>`)
    .replace(/(^|[^\w.])@([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))/g, '$1<a href="https://github.com/$2" target="_blank" rel="noopener">@$2</a>');
}

const strip = (s: string) => s.replace(/\*\*|`/g, '');
const NOTE = /^(升级提醒|升级|不改数据库|感谢|致谢)/;

export function parse(md: string): ChangeEntry[] {
  const entries: ChangeEntry[] = [];
  let cur: ChangeEntry | null = null;
  let group: ChangeGroup | null = null;
  let noteGroup = false;
  let para: string[] = [];

  const flush = () => {
    if (!cur || !para.length) return void (para = []);
    const text = para.join('');
    para = [];
    if (!cur.headline && !group && !cur.groups.length) cur.headline = strip(text);
    else if (noteGroup || NOTE.test(text)) cur.notes.push(inline(text));
    else if (group) group.items.push(inline(text));
    else cur.notes.push(inline(text));
  };

  for (const raw of md.split('\n')) {
    const line = raw.trim();
    const head = line.match(/^##\s+(\d+\.\d+\.\d+(?:-[\w.]+)?)\s*[·・-]\s*(\d{4}-\d{2}-\d{2})/);
    if (head) {
      flush();
      // 只收正式版；预览版的内容会并进下一个正式版
      cur = head[1].includes('-') ? null : { version: head[1], date: head[2], headline: '', groups: [], notes: [] };
      if (cur) entries.push(cur);
      group = null; noteGroup = false;
      continue;
    }
    if (!cur) continue;
    const g = line.match(/^【(.+)】$/) || line.match(/^#{3,4}\s+(.+)$/);
    if (g) {
      flush();
      noteGroup = /^(升级|升级提醒|致谢|感谢)$/.test(g[1].trim());
      group = noteGroup ? null : { title: strip(g[1].trim()), items: [] };
      if (group) cur.groups.push(group);
      continue;
    }
    const item = line.match(/^(?:[·•]|[-*]|\d+\.)\s+(.+)$/);
    if (item) {
      flush();
      if (noteGroup) { cur.notes.push(inline(item[1])); continue; }
      if (!group) { group = { title: '', items: [] }; cur.groups.push(group); }
      group.items.push(inline(item[1]));
      continue;
    }
    if (!line) { flush(); continue; }
    para.push(line);
  }
  flush();
  for (const e of entries) {
    e.groups = e.groups.filter((g) => g.items.length);
    if (!e.headline) e.headline = e.groups[0]?.title || `涛声 ${e.version}`;
  }
  return entries;
}

let cached: Promise<ChangeEntry[]> | null = null;
export function getChangelog() {
  return (cached ??= source().then(parse));
}

/** 首页提示用的短标题：取标题第一个分句。 */
export const shortHeadline = (h: string) => h.split(/[，；。]/)[0];
