/**
 * Converts a date string using dots as separators (e.g. "2026.06.22")
 * to a display-friendly format with hyphens ("2026-06-22").
 */
export function formatDisplayDate(date: string): string {
  return date.replaceAll(".", "-");
}

/**
 * Converts a date string to ISO 8601 format.
 * Currently behaves identically to `formatDisplayDate`.
 */
export function formatISODate(date: string): string {
  return date.replaceAll(".", "-");
}

/**
 * Returns `true` if the given meta object exists and `meta.draft` is not truthy,
 * meaning the associated content is published (not a draft).
 *
 * @param meta - An object that may contain a `draft` property, or `null`/`undefined`.
 */
export function isPublished(meta: { draft?: unknown } | null | undefined): boolean {
  if (meta == null) return false;
  return !meta.draft;
}
