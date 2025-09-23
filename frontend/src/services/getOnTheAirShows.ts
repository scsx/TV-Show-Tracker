import api from '@/services/api'
import { type TTMDBSearchShowResponse } from '@/types'

export const getOnTheAirShows = async (
  page: number = 1,
): Promise<TTMDBSearchShowResponse['results']> => {
  try {
    const response = await api.get<TTMDBSearchShowResponse>(
      `/api/tmdb/shows/on-the-air?page=${page}`,
    )

    return response.data.results
  } catch (error: any) {
    console.error('Error in getOnTheAirShows service:', error)

    throw new Error(
      error.response?.data?.msg || 'Failed to fetch on the air shows.',
    )
  }
}
