// Single source of truth for database URLs. No URL is ever hardcoded: values come only from the
// environment (locally from .env via dotenv, in production from the hosting provider).

type Env = Record<string, string | undefined>;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]);

const clean = (value: string | undefined) => value?.trim() || undefined;

/** Render sets RENDER=true and most CI providers set CI=true. Locally neither is set. */
function isHostedEnvironment(env: Env) {
  return env.RENDER === "true" || env.CI === "true";
}

function pointsToLocalhost(url: string) {
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

/** Fails fast when a hosted build/runtime would talk to a developer database. Never prints the URL. */
function assertNotLocalOnHost(env: Env, variable: string, url: string) {
  if (isHostedEnvironment(env) && pointsToLocalhost(url)) {
    throw new Error(
      `${variable} points to localhost in a hosted environment. Set ${variable} to the managed database URL ` +
        `in the service environment (or remove it). Check also for a .env secret file shipped with the service.`,
    );
  }
}

/**
 * URL for the Prisma CLI (migrate deploy, db seed): DIRECT_URL when set (an unpooled/session
 * connection for migrations), otherwise DATABASE_URL. Blank values are ignored. Returns "" when
 * nothing is set so `prisma generate` keeps working without a database.
 */
export function resolveCliDatabaseUrl(env: Env = process.env) {
  const direct = clean(env.DIRECT_URL);
  const pooled = clean(env.DATABASE_URL);
  const url = direct ?? pooled;
  if (!url) return "";
  assertNotLocalOnHost(env, direct ? "DIRECT_URL" : "DATABASE_URL", url);
  return url;
}

/** URL for the application at runtime: DATABASE_URL only. */
export function resolveRuntimeDatabaseUrl(env: Env = process.env) {
  const url = clean(env.DATABASE_URL);
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env locally (see .env.example) or to the service environment in production.",
    );
  }
  assertNotLocalOnHost(env, "DATABASE_URL", url);
  return url;
}

const BUILD_POOL_MAX = 2;
const RUNTIME_POOL_MAX = 5;

/**
 * Connections per process. Poolers in session mode cap total clients (Supabase: 15), and
 * `next build` runs several workers that each open their own pool, so the build uses a tiny pool.
 * Budget: build 4 workers (next.config experimental.cpus) × 2 = 8, runtime 1 × 5 = 5 → 13 while
 * a redeploy builds next to the running instance. DATABASE_POOL_MAX overrides both.
 */
export function resolvePoolMax(env: Env = process.env) {
  const override = Number.parseInt(env.DATABASE_POOL_MAX ?? "", 10);
  if (Number.isInteger(override) && override > 0) return override;
  return env.NEXT_PHASE === "phase-production-build" ? BUILD_POOL_MAX : RUNTIME_POOL_MAX;
}
