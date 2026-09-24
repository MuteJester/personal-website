/**
 * Prefix a site-relative path with Astro's configured `base`.
 * `import.meta.env.BASE_URL` has no trailing slash, so naive string
 * concatenation produces `/basecv/`. Always link through this helper.
 *
 *   withBase('/')            -> '/'
 *   withBase('cv/')          -> '/personal-website/cv/'
 *   withBase('/favicon.svg') -> '/personal-website/favicon.svg'
 *
 * Once the custom domain is configured and `base` is removed, this becomes a no-op.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}
