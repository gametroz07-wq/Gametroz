// OSI-approved license families we can recognize from the stored license text, or an explicit
// "open source" statement. Never guessed from the app's name or reputation.
const OPEN_SOURCE_LICENSE = /\b(A?GPL|LGPL|MPL|MIT|Apache|BSD)\b|open[- ]source/i;

/** True only when the stored license names a known open-source license; never guessed. */
export function isOpenSourceLicense(license: string | null | undefined) {
  return Boolean(license && OPEN_SOURCE_LICENSE.test(license));
}

// Words that mean "free, but not for everyone or not forever" (tiers, trials, personal-use limits).
const FREE_WITH_CONDITIONS = /\b(paid|plans?|tiers?|trial|evaluate|subscription|premium|personal use|license required)\b/i;

/** True only when the text states the app is plainly free; freemium and trial wording never counts. */
export function isFreeLicense(license: string | null | undefined) {
  if (!license) return false;
  return /^free\b/i.test(license.trim()) && !FREE_WITH_CONDITIONS.test(license);
}
