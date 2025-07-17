import api from '@/services/api'
import { type TTMDBShowSummaryModel } from '@/types'

export const getTrendingShows = async (): Promise<TTMDBShowSummaryModel[]> => {
  try {
    const response = await api.get<{
      shows: TTMDBShowSummaryModel[]
      message: string
      count: number
    }>('/api/tmdb/shows')

    return response.data.shows
  } catch (error: any) {
    console.error('Error in getTrendingShows service:', error)

    throw new Error(
      error.response?.data?.error || 'Failed to fetch trending shows.',
    )
  }
}
