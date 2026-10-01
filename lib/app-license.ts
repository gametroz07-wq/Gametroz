// OSI-approved license families we can recognize from the stored license text.
const OPEN_SOURCE_LICENSE = /\b(A?GPL|LGPL|MPL|MIT|Apache|BSD)\b/i;

/** True only when the stored license names a known open-source license; never guessed. */
export function isOpenSourceLicense(license: string | null | undefined) {
  return Boolean(license && OPEN_SOURCE_LICENSE.test(license));
}
