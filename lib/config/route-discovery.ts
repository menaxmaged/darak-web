// Client-safe: no Node.js imports. Used by both server and client code.

export interface RoutePageMeta {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export interface RouteConfig {
  label: string;
  icon: string;
  roles: string[];
  sidebar?: boolean;
  order?: number;
  page?: RoutePageMeta;
}

export interface DiscoveredRoute extends RouteConfig {
  path: string;
}

// ─── Path-matching helpers ────────────────────────────────────────────────────

const normalize = (p: string) =>
  p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;

const parsePath = (p: string) => {
  const [pathname, qs] = p.split('?');
  return { pathname: normalize(pathname), query: new URLSearchParams(qs ?? '') };
};

const matchQuery = (required: URLSearchParams, current: URLSearchParams) => {
  for (const [k, v] of required.entries()) {
    if (current.get(k) !== v) return false;
  }
  return true;
};

export function isRouteActive(
  route: DiscoveredRoute,
  pathname: string,
  searchParams: URLSearchParams,
): boolean {
  const current = normalize(pathname);
  const { pathname: rp, query } = parsePath(route.path);

  if (current === rp) return matchQuery(query, searchParams);

  // Sub-page match: /dashboard/students/123 is under /dashboard/students.
  // Skip prefix matching for single-segment routes (e.g. /dashboard) to avoid
  // the root route swallowing every sub-path.
  const depth = rp.split('/').filter(Boolean).length;
  if (depth > 1 && current.startsWith(`${rp}/`)) {
    return matchQuery(query, searchParams);
  }

  return false;
}

export function getActiveRoute(
  routes: DiscoveredRoute[],
  pathname: string,
  searchParams: URLSearchParams,
): DiscoveredRoute | null {
  const matches = routes.filter((r) => isRouteActive(r, pathname, searchParams));
  if (!matches.length) return null;
  return matches.sort(
    (a, b) => parsePath(b.path).pathname.length - parsePath(a.path).pathname.length,
  )[0];
}
