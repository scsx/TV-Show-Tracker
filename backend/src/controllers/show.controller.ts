import { Request, Response } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import { showUpdaterTask } from '../services/showUpdater.service'
import axios from 'axios'
import { tmdbService } from '../services/tmdb.service'
import ShowSummary from '../models/ShowSummary'
import { TTMDBShow, TTMDBShowSeasonDetails } from '@shared/types/show'
import { TTMDBWatchProvidersResponse } from '@shared/types/provider'

/**
 * @description Fetches trending TV shows from TMDb and saves them (summaries) to the database.
 * This is the manual trigger for the update process.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {SocketIOServer} io - The Socket.IO server instance.
 */
export const fetchAndSaveTrendingShows = async (
  req: Request,
  res: Response,
  io: SocketIOServer
): Promise<void> => {
  try {
    console.log('Manual trigger: Initiating fetch and save of trending shows...')
    await showUpdaterTask(io)
    res
      .status(200)
      .json({ message: 'Finished processing trending show summaries via manual trigger.' })
  } catch (error: any) {
    console.error('Error in manual fetchAndSaveTrendingShows trigger:', error.message)
    res.status(500).json({ error: 'Failed to process trending show summaries.' })
  }
}

/**
 * @description Fetches all saved TV show summaries from the database.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const getAllShowSummaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const showSummaries = await ShowSummary.find({}).exec()
    res.status(200).json({
      message: 'Successfully retrieved all show summaries from the database.',
      count: showSummaries.length,
      shows: showSummaries
    })
  } catch (error: any) {
    console.error('Error fetching all show summaries:', error.message)
    res.status(500).json({ error: 'Failed to retrieve show summaries.' })
  }
}

/**
 * @route GET /api/tmdb/shows/:id
 * @description Fetches detailed information for a specific TV show from TMDb by its ID.
 * @access Private (via auth middleware na rota)
 */
export const getShowDetailsByid = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ msg: 'A valid TMDB show ID is required.' })
    return
  }

  try {
    // Globally was causing timing errors.
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL
    const idNum = Number(id)

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured in environment variables.')
      res.status(500).json({ msg: 'Server configuration error.' })
      return
    }

    const [tmdbShowDetailsResponse, tmdbShowCreditsResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/tv/${idNum}`, { params: { api_key: TMDB_API_KEY } }),
      axios.get(`${TMDB_BASE_URL}/tv/${idNum}/credits`, { params: { api_key: TMDB_API_KEY } })
    ])

    const combinedShowData: TTMDBShow = {
      ...tmdbShowDetailsResponse.data,
      cast: tmdbShowCreditsResponse.data.cast,
      crew: tmdbShowCreditsResponse.data.crew
    }

    res.status(200).json(combinedShowData)
  } catch (error: any) {
    console.error(`Error fetching TV show details and credits for TMDB ID ${id}:`, error.message)
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ msg: 'TV show not found on TMDb.' })
        return
      }
      res
        .status(error.response.status)
        .json({ msg: error.response.data.status_message || 'Error from external API.' })
      return
    }
    res.status(500).json({ msg: 'Server Error while fetching TV show details and credits.' })
  }
}

/**
 * @route GET /api/tmdb/shows/:id
 * @description Fetches detailed information for a specific TV show from TMDb by its ID.
 * @access Private (via auth middleware on route)
 */
export const getSeasonDetailsBySeriesIdAndSeasonNumber = async (req: Request, res: Response) => {
  try {
    const { seriesId, seasonNumber } = req.params
    // Globally was causing timing errors.
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured in environment variables.')
      res.status(500).json({ message: 'Server configuration error.' })
      return
    }

    if (!seriesId || !seasonNumber) {
      return res.status(400).json({ message: 'Series ID and Season Number are required.' })
    }

    const parsedSeriesId = Number(seriesId)
    const parsedSeasonNumber = Number(seasonNumber)

    if (isNaN(parsedSeriesId) || isNaN(parsedSeasonNumber)) {
      return res.status(400).json({ message: 'Invalid Series ID or Season Number.' })
    }

    const tmdbUrl = `${TMDB_BASE_URL}/tv/${parsedSeriesId}/season/${parsedSeasonNumber}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,episodes`

    const response = await axios.get(tmdbUrl)
    const seasonDetails: TTMDBShowSeasonDetails = response.data

    res.status(200).json(seasonDetails)
  } catch (error: any) {
    console.error('Error fetching season details from TMDB:', error.message)
    if (axios.isAxiosError(error) && error.response) {
      res
        .status(error.response.status)
        .json({ message: error.response.data.status_message || 'Error from TMDB API' })
    } else {
      res.status(500).json({ message: 'Internal server error.' })
    }
  }
}

/**
 * @route GET /api/shows/:id/providers
 * @description Fetches watch providers for a specific TV series from TMDb, filtering for desired countries.
 * @access Private (via auth middleware on the route)
 *
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves once the response is sent.
 */
export const getShowProviders = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ msg: 'A valid TMDB show ID is required.' })
    return
  }

  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured in environment variables.')
      res.status(500).json({ msg: 'Server configuration error.' })
      return
    }

    const seriesId = Number(id)
    const tmdbUrl = `${TMDB_BASE_URL}/tv/${seriesId}/watch/providers`

    const response = await axios.get(tmdbUrl, {
      params: { api_key: TMDB_API_KEY, language: 'en-US' }
    })

    // Supported countries for filtering - this should be dynamic in a real app.
    const supportedCountries = ['PT', 'US']

    // PT and US are always sent, even if empty.
    const finalResults = supportedCountries.reduce(
      (acc, countryCode) => {
        const countryData = response.data.results[countryCode] || {}
        const link = countryData.link || null

        acc[countryCode] = {
          link,
          flatrate: countryData.flatrate || [],
          buy: countryData.buy || [],
          rent: countryData.rent || [],
          free: countryData.free || []
        }
        return acc
      },
      {} as { [key: string]: any }
    )

    const tmdbResponse = {
      ...response.data,
      results: finalResults
    }

    res.status(200).json(tmdbResponse)
  } catch (error: any) {
    console.error(`Error fetching watch providers for TMDB ID ${id}:`, error.message)

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        res.status(404).json({ msg: 'Watch providers not found for this show.' })
        return
      }
      res
        .status(error.response.status)
        .json({ msg: error.response.data.status_message || 'Error from external API.' })
      return
    }
    res.status(500).json({ msg: 'Server Error while fetching watch providers.' })
  }
}
