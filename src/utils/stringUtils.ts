/**
 * Normalizes strings for compound key generation.
 * - lowercases
 * - removes accents
 * - replaces non-alphanumeric sequences with hyphens
 * - trims leading/trailing hyphens
 */
export function normalizeKey(key: string): string {
  return key
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
