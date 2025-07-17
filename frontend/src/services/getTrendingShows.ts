import api from '@/services/api'
import { type TShowSummaryModel } from '@/types'

export const getTrendingShows = async (): Promise<TShowSummaryModel[]> => {
  try {
    const response = await api.get<{
      shows: TShowSummaryModel[]
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
