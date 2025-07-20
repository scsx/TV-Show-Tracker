// Use for all Date methods.

/**
 * Returns the current year.
 * @returns {number} The current year.
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * Extracts the year from a date string in 'YYYY-MM-DD' format (expand for other formats).
 * @param {string} dateString - The date string (e.g., '2023-10-26').
 * @returns {string | null} The year as a string (e.g., '2023'), or null if the input is invalid.
 */
export function getYearFromDateString(
  dateString: string | null | undefined,
): string | null {
  if (!dateString) {
    return null
  }
  const parts = dateString.split('-')
  if (parts.length > 0) {
    return parts[0]
  }
  return null
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
