import { Request, Response } from 'express'
import axios from 'axios'
import { TPerson, TTMDBPersonDetails, TTMDBPersonCombinedCredit } from '@shared/types/person'

/**
 * @route GET /api/tmdb/persons/:id
 * @description Fetches detailed information for a specific person from TMDb by their ID, including combined credits.
 * @access Private (via auth middleware na rota)
 */
export const getPersonDetailsById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ msg: 'A valid TMDB person ID is required.' })
    return
  }

  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL
    const personId = Number(id)

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured in environment variables.')
      res.status(500).json({ msg: 'Server configuration error.' })
      return
    }

    const tmdbUrl = `${TMDB_BASE_URL}/person/${personId}`
    const response = await axios.get(tmdbUrl, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        append_to_response: 'combined_credits'
      }
    })

    const tmdbData = response.data

    // Format data.
    const personResponse: TPerson = {
      bio: {
        adult: tmdbData.adult,
        also_known_as: tmdbData.also_known_as || [],
        biography: tmdbData.biography,
        birthday: tmdbData.birthday,
        deathday: tmdbData.deathday,
        gender: tmdbData.gender,
        homepage: tmdbData.homepage,
        id: tmdbData.id,
        imdb_id: tmdbData.imdb_id,
        known_for_department: tmdbData.known_for_department,
        name: tmdbData.name,
        place_of_birth: tmdbData.place_of_birth,
        popularity: tmdbData.popularity,
        profile_path: tmdbData.profile_path
      },
      credits: {
        cast: (tmdbData.combined_credits?.cast || []) as TTMDBPersonCombinedCredit[],
        crew: (tmdbData.combined_credits?.crew || []) as TTMDBPersonCombinedCredit[]
      }
    }

    res.status(200).json(personResponse)
  } catch (error: any) {
    console.error(`Error fetching person details for TMDB ID ${id}:`, error.message)
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ msg: 'Person not found on TMDb.' })
        return
      }
      res
        .status(error.response.status)
        .json({ msg: error.response.data.status_message || 'Error from external API.' })
      return
    }
    res.status(500).json({ msg: 'Server Error while fetching person details and credits.' })
  }
}
