type Env = Record<string, string | undefined>;

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/** English lives at the site root: its URLs never carry a locale prefix. */
export const defaultLocale: Locale = "en";

/**
 * The Spanish site is opt-in: `/es` is served only when NEXT_PUBLIC_SPANISH_ENABLED is exactly
 * "true". Unset or anything else means every `/es` URL is a 404. Read at build time, and the
 * proxy checks it again at request time, so a build/start mismatch fails closed (404).
 */
export function spanishEnabled(env: Env = process.env): boolean {
  return env.NEXT_PUBLIC_SPANISH_ENABLED === "true";
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Locales that currently serve pages. Drives `generateStaticParams`, so nothing extra is built while off. */
export function enabledLocales(env: Env = process.env): Locale[] {
  return spanishEnabled(env) ? [...locales] : [defaultLocale];
}

/** A locale that currently serves pages (Spanish only while its switch is on). */
export function isEnabledLocale(value: string, env: Env = process.env): value is Locale {
  return isLocale(value) && enabledLocales(env).includes(value);
}

/**
 * Only English may be indexed for now: Spanish pages still carry English copy and must not
 * compete with their English twins. Return true for Spanish once its content is translated.
 */
export function isIndexableLocale(locale: Locale): boolean {
  return locale === defaultLocale;
}
