/**
 * 站点里跟发布相关的常量。
 *
 * 版本号与发布日期是「兜底值」：页面首屏用它们做 SSR 文本，
 * 浏览器拿到 /api/latest-release 后会就地替换成 GitHub 上的最新版本。
 * 兜底值只在边缘取不到 GitHub 时才会被看到，所以不必每次发版都改。
 */
export const FALLBACK_RELEASE = {
  version: '0.2.20',
  publishedAt: '2026-11-10T00:12:00Z',
};

/** 魔搭（ModelScope）上的发布仓，国内直连比 GitHub 快。 */
export const MODELSCOPE_RELEASES =
  'https://modelscope.cn/models/OpenRecode/TaoSheng-releases';

/** 把 ISO 时间格式化成站点两种语言下的日期。 */
export function formatReleaseDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  if (lang === 'en') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
