/** Build-time facts about a package, fetched once during `astro build`. Every field is optional; failures degrade to nothing. */
export interface RepoMeta {
  version?: string;
  requiresPython?: string;
  license?: string;
  language?: string;
  updated?: Date;
}

async function getJson(url: string, headers: Record<string, string> = {}): Promise<any | undefined> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'thomaskon.com build', ...headers }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function fetchRepoMeta(repoUrl: string, pypi?: string): Promise<RepoMeta> {
  const meta: RepoMeta = {};
  // Only fetch during production builds; the dev server would repeat these lookups on every request.
  if (import.meta.env.DEV || process.env.SKIP_REPO_META) return meta;
  const m = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (m) {
    const gh = await getJson(`https://api.github.com/repos/${m[1]}/${m[2]}`, { Accept: 'application/vnd.github+json' });
    if (gh) {
      meta.license = gh.license?.spdx_id && gh.license.spdx_id !== 'NOASSERTION' ? gh.license.spdx_id : undefined;
      meta.language = gh.language ?? undefined;
      meta.updated = gh.pushed_at ? new Date(gh.pushed_at) : undefined;
    }
  }
  if (pypi) {
    const py = await getJson(`https://pypi.org/pypi/${pypi}/json`);
    if (py?.info) {
      meta.version = py.info.version ?? undefined;
      meta.requiresPython = py.info.requires_python ?? undefined;
    }
  }
  return meta;
}
