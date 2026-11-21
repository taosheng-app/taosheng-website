/**
 * 最新正式版信息。构建时从魔搭 update.json 读取写进页面；浏览器打开后再请求 /api/release 就地刷新，
 * 所以 App 发版后即使官网没重新构建，按钮上的版本和大小也是新的。读不到时用下面的兜底值。
 */
export interface Release {
  version: string;
  size: number;
  sha256: string;
  notes: string;
  publishedAt: string | null;
}

export const MS_BASE = 'https://modelscope.cn/models/OpenRecode/TaoSheng-releases/resolve/master/';
export const REPO = 'https://github.com/0xCoach/TaoSheng';
export const RELEASES = `${REPO}/releases/latest`;
export const APK_DOWNLOAD = '/api/download-apk';
export const CERT_SHA256 = '7c11f9afc2cdfc8ba334a7bba69b005aecc609d81fcd12d01bcec2752f496b07';

const FALLBACK: Release = {
  version: '0.5.5',
  size: 109655909,
  sha256: 'c9ec62ec6428e280ed260881017f290dc25e1aa1f7e947b59f7fc29b1a656447',
  notes: '',
  publishedAt: '2026-11-21T14:42:44Z',
};

let cached: Promise<Release> | null = null;

async function load(): Promise<Release> {
  try {
    const res = await fetch(MS_BASE + 'update.json', { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(String(res.status));
    const m = await res.json();
    let publishedAt: string | null = null;
    try {
      const gh = await fetch(`https://api.github.com/repos/0xCoach/TaoSheng/releases/tags/v${m.versionName}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'taosheng-website' },
        signal: AbortSignal.timeout(8000),
      });
      if (gh.ok) publishedAt = (await gh.json()).published_at ?? null;
    } catch {}
    return { version: m.versionName, size: m.apk.size, sha256: m.apk.sha256, notes: m.notes ?? '', publishedAt };
  } catch (error) {
    console.warn('[release] 读取魔搭版本失败，使用兜底值', error);
    return FALLBACK;
  }
}

export function getRelease() {
  return (cached ??= load());
}

export const mb = (bytes: number) => `${Math.round(bytes / 1048576)} MB`;

export function releaseDate(iso: string | null, lang: 'zh' | 'en') {
  if (!iso) return '';
  const d = new Date(iso);
  if (lang === 'en') return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Shanghai' });
  const p = (n: number) => String(n).padStart(2, '0');
  const local = new Date(d.getTime() + 8 * 3600_000);
  return `${local.getUTCFullYear()}-${p(local.getUTCMonth() + 1)}-${p(local.getUTCDate())}`;
}
