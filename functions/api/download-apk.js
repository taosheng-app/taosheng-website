const RELEASE_BASE =
  'https://modelscope.cn/models/OpenRecode/TaoSheng-releases/resolve/master/';
const STABLE_VERSION = /^\d+(?:\.\d+)+$/;
const HEADERS = { 'cache-control': 'no-store' };

// 下载计数：绑定了 KV（STATS）才记，没绑定时直接跳过，不影响下载。
// 键：dl:total、dl:YYYY-MM-DD、dl:YYYY-MM-DD:wechat、dl:YYYY-MM-DD:en（北京时间）
async function count(env, request) {
  const kv = env.STATS;
  if (!kv) return;
  const day = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const ua = request.headers.get('user-agent') || '';
  const ref = request.headers.get('referer') || '';
  const keys = ['dl:total', `dl:${day}`];
  if (/MicroMessenger/i.test(ua)) keys.push(`dl:${day}:wechat`);
  let path = '';
  try { path = new URL(ref).pathname; } catch {}
  if (/^\/en(\/|$)/.test(path)) keys.push(`dl:${day}:en`);
  await Promise.all(keys.map(async (k) => {
    const n = Number(await kv.get(k)) || 0;
    await kv.put(k, String(n + 1));
  }));
}

export async function onRequestGet({ request, env, waitUntil }) {
  try {
    const response = await fetch(new URL('update.json', RELEASE_BASE), {
      signal: AbortSignal.timeout(8000),
      cf: { cacheTtl: 0 },
    });
    if (!response.ok) throw new Error('ModelScope manifest unavailable');

    const { versionName, apk } = await response.json();
    const filename = `TaoSheng-v${versionName}-arm64.apk`;
    if (typeof versionName !== 'string' || !STABLE_VERSION.test(versionName) ||
        apk?.file !== filename) {
      throw new Error('Invalid stable APK in ModelScope manifest');
    }

    try { waitUntil(count(env, request).catch(() => {})); } catch {}
    return new Response(null, {
      status: 302,
      headers: { ...HEADERS, location: new URL(filename, RELEASE_BASE).href },
    });
  } catch {
    return new Response(
      '魔搭下载暂时不可用，请稍后重试。ModelScope download unavailable. Please try again later.',
      {
        status: 503,
        headers: { ...HEADERS, 'content-type': 'text/plain; charset=utf-8' },
      },
    );
  }
}
