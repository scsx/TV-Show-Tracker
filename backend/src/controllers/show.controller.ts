import { Request, Response } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import { showUpdaterTask } from '../services/showUpdater.service'
import axios from 'axios'
import ShowSummary from '../models/ShowSummary'
import { TTMDBShow } from '@shared/types/show'

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
    const showSummaries = await ShowSummary.find({})
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
