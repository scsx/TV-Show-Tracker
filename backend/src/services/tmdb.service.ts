import axios from 'axios'

const TMDB_BASE_URL = process.env.TMDB_BASE_URL
const TMDB_API_KEY = process.env.TMDB_API_KEY

if (!TMDB_API_KEY) {
  console.error('TMDB_API_KEY is not defined in environment variables.')
  process.exit(1)
}

if (!TMDB_BASE_URL) {
  console.error('TMDB_BASE_URL is not defined in environment variables.')
  process.exit(1)
}

/**
 * @description Service for interacting with TheMovieDB (TMDb) API.
 */
class TmdbService {
  /**
   * @description Fetches trending TV shows from TMDb for a given time window.
   * @param {'day' | 'week'} timeWindow - The time window for trending shows (e.g., 'day' or 'week').
   * @param {number} page - The page number to fetch.
   * @returns {Promise<any>} - A promise that resolves to the TMDb response.
   */
  public async getTrendingTvShows(
    timeWindow: 'day' | 'week' = 'week',
    page: number = 1
  ): Promise<any> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/${timeWindow}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: page
        }
      })
      return response.data
    } catch (error: any) {
      console.error(`Error fetching trending TV shows for ${timeWindow} from TMDb:`, error.message)
      throw new Error(`Failed to fetch trending TV shows for ${timeWindow}: ${error.message}`)
    }
  }

  /**
   * @description Fetches details for a specific TV show from TMDb.
   * @param {number} tvId - The ID of the TV show.
   * @returns {Promise<any>} - A promise that resolves to the TMDb TV show details.
   */
  public async getTvShowDetails(tvId: number): Promise<any> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          append_to_response: 'credits,videos,external_ids,content_ratings'
        }
      })
      return response.data
    } catch (error: any) {
      console.error(`Error fetching TV show details for ID ${tvId} from TMDb:`, error.message)
      throw new Error(`Failed to fetch TV show details for ID ${tvId}: ${error.message}`)
    }
  }
}

export const tmdbService = new TmdbService()
