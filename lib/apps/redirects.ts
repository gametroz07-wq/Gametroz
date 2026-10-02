/**
 * Permanent redirects for app URLs that no longer exist. The `browser` platform became `web`
 * (renamed in place by `npm run apps:sync`), so the old listing URL keeps its ranking signals.
 * Spread into `redirects()` in next.config.ts.
 */
export const appRedirects = [{ source: "/apps/browser", destination: "/apps/web", permanent: true }];
