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

/**
 * Calculates the duration from a given timestamp to the current time and returns it in a human-readable format.
 * It prioritizes larger units (days, then hours, minutes, seconds).
 *
 * @param {number | null | undefined} timestamp - The starting timestamp in milliseconds (e.g., from Date.now()).
 * @returns {string} A string representing the duration (e.g., "5 days", "3 hours", "10 minutes"),
 * or "unknown" if the timestamp is null or undefined.
 */
export function countSinceDate(timestamp: number | null | undefined): string {
  if (timestamp === null || timestamp === undefined) {
    return 'unknown'
  }

  const now = Date.now()
  const durationMs = now - timestamp

  // Convert milliseconds to days, hours, minutes, seconds
  const seconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}`
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  // Fallback to seconds, ensuring it doesn't show negative if timestamp is in the future
  return `${Math.max(0, seconds)} second${seconds !== 1 ? 's' : ''}`
}
