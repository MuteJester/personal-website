/**
 * Prefix a site-relative path with the configured `base` (if any).
 * `import.meta.env.BASE_URL` has no trailing slash, so naive string
 * concatenation would produce `/basecv/`. Always link through this helper.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}
