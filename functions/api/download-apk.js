const RELEASE_BASE =
  'https://modelscope.cn/models/OpenRecode/TaoSheng-releases/resolve/master/';
const STABLE_VERSION = /^\d+(?:\.\d+)+$/;
const HEADERS = { 'cache-control': 'no-store' };

export async function onRequestGet() {
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
