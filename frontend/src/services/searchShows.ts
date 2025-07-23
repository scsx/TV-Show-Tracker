import api from '@/services/api'
import { type TTMDBShowSearchResult } from '@/types'

/**
 * @description Defines the parameters for searching TV shows.
 */
type SearchShowsParams = {
  query?: string
  genreIds?: string
  sortBy?: string
  page?: number
}

/**
 * @description Defines the structure of the TV show search response as returned by your backend.
 */
type SearchShowsResponse = {
  shows: TTMDBShowSearchResult[]
  page: number
  totalPages: number // camelCase
  totalResults: number // camelCase
}

/**
 * @description Fetches TV show search results from the backend API.
 * This function calls your custom backend endpoint, which in turn
 * fetches data from the TMDB discover/tv endpoint.
 * @param {SearchShowsParams} params - The search parameters including query, genre IDs, sort order, and page number.
 * @returns {Promise<SearchShowsResponse>} A promise that resolves to an object containing the search results,
 * current page, total pages, and total results.
 * @throws {Error} If there's an error during the API request.
 */
export const searchTvShows = async (
  params: SearchShowsParams,
): Promise<SearchShowsResponse> => {
  try {
    const response = await api.get<SearchShowsResponse>('/api/search/shows', {
      params: params,
    })

    return response.data
  } catch (error) {
    console.error('Error fetching TV show search results:', error)
    throw error
  }
}
