const paths = ['/', '/guide', '/download', '/about', '/privacy', '/terms'];
const SITE = 'https://taosheng.app';
export function GET() {
  const urls = paths.flatMap((p) => {
    const zh = SITE + p, en = SITE + (p === '/' ? '/en/' : `/en${p}`);
    const alt = `<xhtml:link rel="alternate" hreflang="zh-CN" href="${zh}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/>`;
    return [`<url><loc>${zh}</loc>${alt}</url>`, `<url><loc>${en}</loc>${alt}</url>`];
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`, { headers: { 'content-type': 'application/xml' } });
}
