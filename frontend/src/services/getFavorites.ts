import { getShowDetailsById } from '@/services/getShowDetailsById'
import { type TTMDBShow } from '@/types'

/**
 * Fetches the complete details for a list of favorite TV shows.
 * For each ID in the list, it makes a call to get the complete show details.
 *
 * @param favoriteTmdbIds An array of TMDb IDs for the favorite shows.
 * @returns A Promise that resolves to an array of TTMDBShow objects.
 * Shows that fail to be fetched will be omitted from the final array.
 */
export const getFavorites = async (
  favoriteTmdbIds: number[],
): Promise<TTMDBShow[]> => {
  if (!favoriteTmdbIds || favoriteTmdbIds.length === 0) {
    return []
  }

  // Map each ID to a Promise that fetches the show's details.
  // Using Promise.allSettled so that all promises are resolved (either success or failure)
  // and execution doesn't stop if one fails.
  const fetchPromises = favoriteTmdbIds.map((id) => getShowDetailsById(id))

  const results = await Promise.allSettled(fetchPromises)

  // Filter the results to include only shows that were successfully fetched.
  const favoriteShows: TTMDBShow[] = results.reduce(
    (acc: TTMDBShow[], result) => {
      if (result.status === 'fulfilled' && result.value !== null) {
        acc.push(result.value)
      } else if (result.status === 'rejected') {
        console.error(
          'Failed to fetch details for one favorite show:',
          result.reason,
        )
      }
      return acc
    },
    [],
  )

  return favoriteShows
}
