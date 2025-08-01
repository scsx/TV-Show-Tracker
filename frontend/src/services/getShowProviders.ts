import api from '@/services/api'
import { type TTMDBWatchProvidersResponse } from '@/types'

/**
 * Fetches the watch providers for a specific TV show from the backend.
 *
 * @param id The TMDb ID of the TV show.
 * @returns A Promise that resolves to the watch providers response.
 */
export const getShowProviders = async (
  id: number,
): Promise<TTMDBWatchProvidersResponse> => {
  try {
    const response = await api.get<TTMDBWatchProvidersResponse>(
      `/api/tmdb/shows/${id}/providers`,
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching watch providers for TMDb ID ${id}:`, error)
    throw error
  }
}
