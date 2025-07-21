import { Request, Response } from 'express'
import { tmdbService } from '../services/tmdb.service'
import {
  TPerson,
  TTMDBPersonCombinedCredit,
  TTMDBPopularPersonsResponse
} from '@shared/types/person'

/**
 * @route GET /api/tmdb/persons/:id
 * @description Fetches detailed information for a specific person from TMDb by their ID, including combined credits.
 * @access Private (via auth middleware)
 */
export const getPersonDetailsById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ msg: 'A valid TMDB person ID is required.' })
    return
  }

  try {
    const personId = Number(id)
    const tmdbData = await tmdbService.getPersonDetailsAndCredits(personId)

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

    if (error.message.includes('Person not found on TMDb')) {
      res.status(404).json({ msg: 'Person not found on TMDb.' })
    } else if (error.message.includes('timed out')) {
      res.status(504).json({ msg: 'Request to external API timed out.' })
    } else if (error.message.includes('service unavailable')) {
      res.status(503).json({ msg: 'External API service unavailable.' })
    } else {
      res.status(500).json({ msg: 'Server Error while fetching person details and credits.' })
    }
  }
}

/**
 * @route GET /api/tmdb/persons/popular
 * @description Fetches a list of popular persons from TMDb.
 * @access Private (via auth middleware)
 */
export const getPopularPersons = async (req: Request, res: Response): Promise<void> => {
  try {
    // Chama o serviço TMDb para obter pessoas populares
    const tmdbResponse: TTMDBPopularPersonsResponse = await tmdbService.getPopularPersons()

    // Envia apenas a lista de resultados para o frontend
    res.status(200).json(tmdbResponse.results)
  } catch (error: any) {
    console.error('Error fetching popular persons:', error.message)

    if (error.message.includes('No popular persons found')) {
      // Mensagem de erro personalizada do serviço TMDb
      res.status(404).json({ msg: 'No popular persons found.' })
    } else if (error.message.includes('timed out')) {
      res.status(504).json({ msg: 'Request to external API timed out.' })
    } else if (error.message.includes('service unavailable')) {
      res.status(503).json({ msg: 'External API service unavailable.' })
    } else {
      res.status(500).json({ msg: 'Server Error while fetching popular persons.' })
    }
  }
}
