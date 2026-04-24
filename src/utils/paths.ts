const SITE_BASE = import.meta.env.PROD ? '/pavel_blog/' : '/';

export const siteBase = SITE_BASE;

export function withBase(path = ''): string {
  if (!path) {
    return SITE_BASE;
  }

  if (
    /^(?:[a-z]+:)?\/\//i.test(path) ||
    path.startsWith('#') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:')
  ) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SITE_BASE}${normalizedPath}`;
}
