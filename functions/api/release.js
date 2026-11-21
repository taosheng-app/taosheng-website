/**
 * GET /api/release —— 最新正式版：以魔搭 update.json 为准（和下载按钮同一来源），发布日期从 GitHub 补。
 * 返回 { version, size, sha256, notes, publishedAt }，边缘缓存 10 分钟。
 */
const MANIFEST = 'https://modelscope.cn/models/OpenRecode/TaoSheng-releases/resolve/master/update.json';
const CACHE_KEY = 'https://taosheng.app/__cache/api/release';

const json = (body, status = 200, maxAge = 600) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${maxAge}` },
  });

export async function onRequestGet(context) {
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const key = new Request(CACHE_KEY);
  try {
    const hit = await cache?.match(key);
    if (hit) return hit;
  } catch {}
  try {
    const res = await fetch(MANIFEST, { signal: AbortSignal.timeout(8000), cf: { cacheTtl: 300 } });
    if (!res.ok) throw new Error(`ModelScope ${res.status}`);
    const m = await res.json();
    if (typeof m.versionName !== 'string' || !/^\d+(\.\d+)+$/.test(m.versionName)) throw new Error('bad manifest');
    let publishedAt = null;
    try {
      const gh = await fetch(`https://api.github.com/repos/0xCoach/TaoSheng/releases/tags/v${m.versionName}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'taosheng-website' },
        signal: AbortSignal.timeout(4000),
        cf: { cacheTtl: 3600 },
      });
      if (gh.ok) publishedAt = (await gh.json()).published_at ?? null;
    } catch {}
    const out = json({ version: m.versionName, size: m.apk.size, sha256: m.apk.sha256, notes: m.notes ?? '', publishedAt });
    try { context.waitUntil(cache?.put(key, out.clone())); } catch {}
    return out;
  } catch (error) {
    return json({ error: String(error?.message || error) }, 502, 30);
  }
}
