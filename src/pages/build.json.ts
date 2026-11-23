import { getRelease } from '../data/release';
import { getChangelog } from '../data/changelog';

/** 这次构建用的版本。部署工作流每小时拿它和 GitHub 最新版对比，不一样才重建。 */
export async function GET() {
  const [r, log] = await Promise.all([getRelease(), getChangelog()]);
  return new Response(JSON.stringify({ release: r.version, changelog: log[0]?.version ?? '', builtAt: new Date().toISOString() }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
