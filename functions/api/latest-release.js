/**
 * GET /api/latest-release
 *
 * Cloudflare Pages Function：在边缘代取 GitHub 最新 release，避免浏览器直连 api.github.com
 * （国内访问 GitHub 不稳定，且匿名调用有每 IP 60 次/小时的限额）。
 *
 * 返回：
 *   { tag, version, publishedAt, releaseUrl, apk: { name, size, url } | null }
 */

const OWNER_REPO = '0xCoach/TaoSheng';
const GITHUB_API = `https://api.github.com/repos/${OWNER_REPO}/releases/latest`;
const CACHE_KEY_URL = 'https://taosheng.app/__cache/api/latest-release';

const json = (body, status = 200, maxAge = 300) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${maxAge}, s-maxage=1800, stale-while-revalidate=86400`,
      'access-control-allow-origin': '*',
    },
  });

export async function onRequestGet(context) {
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const cacheKey = new Request(CACHE_KEY_URL, { method: 'GET' });

  try {
    const cached = await cache?.match(cacheKey);
    if (cached) return cached;
  } catch {
    // Cache API 不可用时继续走实时请求。
  }

  try {
    const res = await fetch(GITHUB_API, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'taosheng-website',
        'x-github-api-version': '2022-11-28',
      },
      cf: { cacheTtl: 600, cacheEverything: true },
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const data = await res.json();
    const assets = Array.isArray(data.assets) ? data.assets : [];
    // 优先 arm64 正式包，其次任意 apk；补丁包（.patch）不会被误取。
    const apk =
      assets.find((a) => /\.apk$/i.test(a.name) && /arm64/i.test(a.name)) ||
      assets.find((a) => /\.apk$/i.test(a.name)) ||
      null;

    const tag = String(data.tag_name || '');
    const payload = {
      tag,
      version: tag.replace(/^v/i, ''),
      publishedAt: data.published_at || null,
      releaseUrl: data.html_url || `https://github.com/${OWNER_REPO}/releases/latest`,
      apk: apk ? { name: apk.name, size: apk.size, url: apk.browser_download_url } : null,
    };

    const out = json(payload, 200, 300);
    try {
      await cache?.put(cacheKey, out.clone());
    } catch {
      // 缓存写失败不影响返回。
    }
    return out;
  } catch (err) {
    // 交给前端显示内置兜底版本号，同时不把失败结果长时间缓存。
    return json({ error: String(err?.message || err) }, 502, 30);
  }
}
