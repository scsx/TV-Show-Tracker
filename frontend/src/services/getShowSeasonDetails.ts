import api from '@/services/api'
import { type TTMDBShowSeasonDetails } from '@/types'

/**
 * Fetches the complete details for a specific season of a TV show
 * by its series ID and season number.
 * Makes a call to backend, which in turn fetches from the TMDb API.
 *
 * @param seriesId The TMDb ID of the TV series.
 * @param seasonNumber The number of the season.
 * @returns A Promise that resolves to the complete season details (TTMDBSeasonDetails).
 * @throws {Error} If there's an error during the request (e.g., network error, backend error, or TMDB error).
 */
export const getShowSeasonDetails = async (
  seriesId: number,
  seasonNumber: number,
): Promise<TTMDBShowSeasonDetails> => {
  try {
    const response = await api.get<TTMDBShowSeasonDetails>(
      `/api/tmdb/shows/${seriesId}/season/${seasonNumber}`,
    )
    return response.data
  } catch (error) {
    console.error(
      `Error fetching season ${seasonNumber} details for series ${seriesId}:`,
      error,
    )
    throw error
  }
}
