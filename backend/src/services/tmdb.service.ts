import axios from 'axios'
import { TTMDBPersonDetails, TTMDBPersonCombinedCredit } from '@shared/types/person'

/**
 * @description Service for interacting with TheMovieDB (TMDb) API.
 */
class TmdbService {
  private TMDB_BASE_URL: string | undefined
  private TMDB_API_KEY: string | undefined

  constructor() {
    // Avoid reading environment variables here as dotenv might not have loaded them yet.
    // Using the 'initialize' method.
  }

  // Initialize method.
  public initialize() {
    this.TMDB_BASE_URL = process.env.TMDB_BASE_URL
    this.TMDB_API_KEY = process.env.TMDB_API_KEY

    if (!this.TMDB_API_KEY) {
      console.error(
        'TMDB_API_KEY is not defined in environment variables. (from TmdbService.initialize)'
      )
      throw new Error('TMDB_API_KEY is not defined')
    }
    if (!this.TMDB_BASE_URL) {
      console.error(
        'TMDB_BASE_URL is not defined in environment variables. (from TmdbService.initialize)'
      )
      throw new Error('TMDB_BASE_URL is not defined')
    }
  }

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
    if (!this.TMDB_API_KEY || !this.TMDB_BASE_URL) {
      throw new Error('TmdbService not initialized. Call initialize() first.')
    }
    try {
      const response = await axios.get(`${this.TMDB_BASE_URL}/trending/tv/${timeWindow}`, {
        params: {
          api_key: this.TMDB_API_KEY,
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
    if (!this.TMDB_API_KEY || !this.TMDB_BASE_URL) {
      throw new Error('TmdbService not initialized. Call initialize() first.')
    }
    try {
      const response = await axios.get(`${this.TMDB_BASE_URL}/tv/${tvId}`, {
        params: {
          api_key: this.TMDB_API_KEY,
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

  /**
   * @description Fetches detailed information for a specific person, including their combined movie and TV credits.
   * @param {number} personId - The ID of the person.
   * @returns {Promise<TTMDBPersonDetailsAPI & { combined_credits?: { cast: TTMDBPersonCombinedCredit[]; crew: TTMDBPersonCombinedCredit[]; } }>} - A promise that resolves to the TMDb person details with combined credits.
   */
  public async getPersonDetailsAndCredits(personId: number): Promise<
    TTMDBPersonDetails & {
      combined_credits?: { cast: TTMDBPersonCombinedCredit[]; crew: TTMDBPersonCombinedCredit[] }
    }
  > {
    if (!this.TMDB_API_KEY || !this.TMDB_BASE_URL) {
      throw new Error('TmdbService not initialized. Call initialize() first.')
    }
    try {
      const response = await axios.get(`${this.TMDB_BASE_URL}/person/${personId}`, {
        params: {
          api_key: this.TMDB_API_KEY,
          language: 'en-US',
          append_to_response: 'combined_credits'
        }
      })
      return response.data
    } catch (error: any) {
      console.error(`Error fetching person details for ID ${personId} from TMDb:`, error.message)
      throw new Error(`Failed to fetch person details for ID ${personId}: ${error.message}`)
    }
  }
}

export const tmdbService = new TmdbService()
