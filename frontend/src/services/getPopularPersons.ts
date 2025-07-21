import api from '@/services/api'
import { type TTMDBPopularPerson } from '@/types'

export const getPopularPersons = async (): Promise<TTMDBPopularPerson[]> => {
  try {
    const response = await api.get<TTMDBPopularPerson[]>(
      '/api/tmdb/persons/popular',
    )
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.msg || 'Failed to fetch popular persons.',
    )
  }
}
