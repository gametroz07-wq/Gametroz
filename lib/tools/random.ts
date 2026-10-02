// Unbiased random integers from a cryptographic source, shared by the password, UUID-adjacent and
// random number tools. A plain `value % max` favors small results whenever 2^32 is not a multiple of
// `max`, so draws from the incomplete last block are thrown away and redrawn (rejection sampling).

/** Same shape as crypto.getRandomValues for a Uint32Array; injectable so tests can be deterministic. */
export type RandomSource = (array: Uint32Array) => Uint32Array;

const TWO_32 = 2 ** 32;

export const cryptoSource: RandomSource = (array) => globalThis.crypto.getRandomValues(array);

/** Uniform integer in [0, max). `max` must be a whole number from 1 to 2^32. */
export function randomIntBelow(max: number, source: RandomSource = cryptoSource): number {
  if (!Number.isInteger(max) || max < 1 || max > TWO_32) {
    throw new RangeError(`max must be a whole number from 1 to ${TWO_32}`);
  }
  const limit = TWO_32 - (TWO_32 % max);
  const buffer = new Uint32Array(1);
  for (;;) {
    const value = source(buffer)[0];
    if (value < limit) return value % max;
  }
}

/** Fisher-Yates shuffle in place, returning the same array. */
export function shuffleInPlace<T>(items: T[], source: RandomSource = cryptoSource): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const other = randomIntBelow(index + 1, source);
    [items[index], items[other]] = [items[other], items[index]];
  }
  return items;
}
