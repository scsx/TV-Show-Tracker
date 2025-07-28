import { Request, Response } from 'express'
import axios from 'axios'
import { TTMDBShowSummary } from '@shared/types/show'
import { TRecommendation } from '@shared/types/recommendation'

/**
 * @description Helper function to fetch only the ID and Name for a specific TV show from TMDB.
 * @param {number} showId - The TMDB ID of the TV show.
 * @returns {Promise<{ id: number; name: string } | null>} - Resolves to an object with the show's ID and name, or `null` on failure.
 */
const fetchTmdbShowIdAndName = async (
  showId: number
): Promise<{ id: number; name: string } | null> => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured.')
      return null
    }

    const response = await axios.get(`${TMDB_BASE_URL}/tv/${showId}`, {
      params: { api_key: TMDB_API_KEY, language: 'en-US' }
    })
    return { id: response.data.id, name: response.data.name }
  } catch (error: any) {
    console.error(`Error fetching name for TV show ID ${showId} from TMDB:`, error.message)
    return null
  }
}

/**
 * @description Helper function to fetch recommendations for a specific TV show from TMDB.
 * @param {number} showId - The TMDB ID of the TV show for which to fetch recommendations.
 * @returns {Promise<TTMDBShowSummary[]>} - Resolves to an array of TTMDBShowSummary objects, or an empty array on failure.
 */
const fetchTmdbRecommendations = async (showId: number): Promise<TTMDBShowSummary[]> => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured.')
      return []
    }

    const response = await axios.get(`${TMDB_BASE_URL}/tv/${showId}/recommendations`, {
      params: { api_key: TMDB_API_KEY, language: 'en-US' }
    })
    const data = response.data

    // Limit to 6.
    return data.results.slice(0, 6).map((show: any) => ({
      id: show.id,
      name: show.name,
      original_name: show.original_name,
      overview: show.overview,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      first_air_date: show.first_air_date,
      popularity: show.popularity,
      vote_average: show.vote_average,
      vote_count: show.vote_count,
      origin_country: show.origin_country || [],
      original_language: show.original_language,
      genre_ids: show.genre_ids || [],
      media_type: show.media_type || 'tv',
      video: show.video ?? false
    })) as TTMDBShowSummary[]
  } catch (error: any) {
    console.error(
      `Error fetching recommendations for TV show ID ${showId} from TMDB:`,
      error.message
    )
    return []
  }
}

/**
 * @description Gets personalized TV show recommendations based on user's favorite IDs.
 * Aggregates names of favorite shows and their respective recommendations from TMDB.
 * @param {Request} req - Express request object, expecting `userId` in `req.params` and user data (including `favoriteShowids`) in `req.user`.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Resolves when the response is sent.
 * @route GET /api/users/:userId/recommendations
 * @access Private
 */
export const getPersonalizedRecommendations = async (req: Request, res: Response) => {
  const { userId } = req.params

  // Ensures the authenticated user matches the user in the URL for security.
  if (req.user?.id !== userId) {
    return res.status(403).json({ msg: 'Unauthorized: User ID mismatch.' })
  }

  try {
    // User's favorite show IDs are populated in `req.user` by the authentication middleware.
    const favoriteIds: number[] = req.user.favoriteShowids || []

    if (favoriteIds.length === 0) {
      // If there are no favorites, return an empty array. The frontend can then fetch trending shows, for example.
      return res.status(200).json([])
    }

    // Create an array of promises, where each promise fetches the favorite's details and its recommendations in parallel.
    const recommendationsPromises: Promise<TRecommendation | null>[] = favoriteIds.map(
      async (favId) => {
        // Fetch details for the favorite show (to get its name) using the helper function.
        const favoriteDetails = await fetchTmdbShowIdAndName(favId)

        if (!favoriteDetails) {
          console.warn(
            `Could not fetch details for favorite show ID ${favId}. Skipping recommendations for this show.`
          )
          return null
        }

        // Fetch recommendations based on this favorite show using the helper function.
        const recommendedShows = await fetchTmdbRecommendations(favId)

        return {
          favoriteId: favId,
          favoriteName: favoriteDetails.name,
          favoriteRecommended: recommendedShows
        }
      }
    )

    // Resolve all promises in parallel and filter out any null results (shows that failed to process).
    const allRecommendations = (await Promise.all(recommendationsPromises)).filter(
      Boolean
    ) as TRecommendation[]

    res.status(200).json(allRecommendations)
  } catch (error: any) {
    console.error('Error in getPersonalizedRecommendations controller:', error.message)
    res.status(500).json({ message: 'Failed to fetch personalized recommendations.' })
  }
}
