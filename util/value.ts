import { invariant } from "../exception/invariant";

/**
 * Check if a value is defined (not `null` or `undefined`)
 * @param value some value
 * @returns if the value is defined
 */
export function defined<T extends any>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

/**
 * Assert that a value is defined (not `null` or `undefined`)
 * @param value some value
 */
export function assertDefined<T extends any>(
  value: T,
  exception?: string
): asserts value is NonNullable<T> {
  invariant(
    defined(value),
    exception || `Expected value to be defined, but got ${value}`
  );
}
