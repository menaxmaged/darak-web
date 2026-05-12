// Server-only: uses Node.js `fs`. Never import this in client components.
import fs from 'fs';
import path from 'path';
import type { DiscoveredRoute, RouteConfig } from './route-discovery';

interface ScanOptions {
  /** Path relative to cwd, e.g. 'app/dashboard' */
  appDir?: string;
  /** URL prefix matching appDir, e.g. '/dashboard' */
  routePrefix?: string;
}

/**
 * Scans `appDir` for `route.json` sidecar files and returns typed route configs.
 * Call only from Server Components or layouts — never from client components.
 *
 * Adding a page to the sidebar: drop a `route.json` next to `page.tsx`. Done.
 */
export function discoverRoutes({
  appDir = 'app/dashboard',
  routePrefix = '/dashboard',
}: ScanOptions = {}): DiscoveredRoute[] {
  const root = path.join(process.cwd(), appDir);
  const routes: DiscoveredRoute[] = [];

  const tryRead = (filePath: string, routePath: string) => {
    try {
      const meta = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RouteConfig;
      routes.push({ ...meta, path: routePath });
    } catch (e) {
      console.warn(`[route-scanner] Failed to parse ${filePath}:`, e);
    }
  };

  // Root page (e.g. /dashboard itself)
  const rootMeta = path.join(root, 'route.json');
  if (fs.existsSync(rootMeta)) tryRead(rootMeta, routePrefix);

  // One level of subdirectories — skip Next.js special folders
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return routes;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip route groups (parentheses), private (_), and dynamic ([) segments
    if (
      entry.name.startsWith('(') ||
      entry.name.startsWith('_') ||
      entry.name.startsWith('[')
    ) continue;

    const metaPath = path.join(root, entry.name, 'route.json');
    if (fs.existsSync(metaPath)) {
      tryRead(metaPath, `${routePrefix}/${entry.name}`);
    }
  }

  return routes.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
