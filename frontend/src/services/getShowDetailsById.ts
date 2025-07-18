import api from '@/services/api'
import { type TTMDBShow } from '@/types'

/**
 * Fetches the complete details for a specific TV show by its TMDb ID.
 * Makes a call to backend, which in turn fetches from the TMDb API.
 *
 * @param id The TMDb ID of the TV show.
 * @returns A Promise that resolves to the complete TV show details (TTMDBShow)
 * or null if there's an error during the request.
 */
export const getShowDetailsById = async (
  id: number,
): Promise<TTMDBShow | null> => {
  try {
    const response = await api.get<TTMDBShow>(`/api/tmdb/shows/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching show details with TMDb ID ${id}:`, error)
    return null
  }
}
