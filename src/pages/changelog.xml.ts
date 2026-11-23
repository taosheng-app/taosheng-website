import { getChangelog } from '../data/changelog';

const SITE = 'https://taosheng.app';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 更新日志 RSS：最近 20 个正式版，正文是完整的分组条目。 */
export async function GET() {
  const entries = (await getChangelog()).slice(0, 20);
  const items = entries.map((e) => {
    const link = `${SITE}/changelog#v${e.version}`;
    const body = e.groups.map((g) => `${g.title ? `<h3>${esc(g.title)}</h3>` : ''}<ul>${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>`).join('')
      + e.notes.map((n) => `<p>${n}</p>`).join('');
    return `<item><title>${esc(`涛声 ${e.version}：${e.headline}`)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${new Date(`${e.date}T20:00:00+08:00`).toUTCString()}</pubDate><description>${esc(body)}</description></item>`;
  });
  const updated = entries[0] ? new Date(`${entries[0].date}T20:00:00+08:00`).toUTCString() : new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>涛声更新日志</title><link>${SITE}/changelog</link><atom:link href="${SITE}/changelog.xml" rel="self" type="application/rss+xml"/><description>涛声 TaoSheng 每个正式版的更新内容</description><language>zh-CN</language><lastBuildDate>${updated}</lastBuildDate>${items.join('')}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
