/**
 * Shared date formatting helpers for CV/experience entries.
 *
 * Source data is stored as plain "MM/YYYY" strings (sometimes just "YYYY"),
 * NOT as ISO dates. We must not route these through `new Date(...)` /
 * `Intl.DateTimeFormat`, since `Intl.DateTimeFormat('es-ES', {month: '2-digit'})`
 * does not zero-pad months (yields "1/2026" instead of "01/2026").
 */

import type {Lang} from './i18n'

const FULL_MONTH_YEAR = /^\d{2}\/\d{4}$/
const SHORT_MONTH_YEAR = /^\d{1}\/\d{4}$/
const YEAR_ONLY = /^\d{4}$/

/**
 * Formats a "MM/YYYY" (or "YYYY") string, zero-padding the month when needed.
 * Returns the value as-is if it doesn't match a recognized shape.
 */
export function formatMonthYear(value: string | undefined, _lang: Lang): string {
  if (!value) return ''
  if (FULL_MONTH_YEAR.test(value)) return value
  if (SHORT_MONTH_YEAR.test(value)) {
    const [month, year] = value.split('/')
    return `${month.padStart(2, '0')}/${year}`
  }
  if (YEAR_ONLY.test(value)) return value
  return value
}

/** Formats a "start — end" date range, falling back to `presentLabel` when `end` is missing. */
export function dateRange(
  start: string | undefined,
  end: string | undefined,
  lang: Lang,
  presentLabel: string,
): string {
  const startLabel = formatMonthYear(start, lang)
  const endLabel = end ? formatMonthYear(end, lang) : presentLabel
  return [startLabel, endLabel].filter(Boolean).join(' — ')
}
