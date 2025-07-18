import { Request, Response } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import { showUpdaterTask } from '../services/showUpdater.service'
import axios from 'axios'
import ShowSummary from '../models/ShowSummary'

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
export const getShowDetailsByid = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ msg: 'A valid TMDB show ID is required.' })
  }

  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL
    const idNum = Number(id)

    const response = await axios.get(`${TMDB_BASE_URL}/tv/${idNum}`, {
      params: {
        api_key: TMDB_API_KEY
      }
    })

    const showDetails = response.data

    res.json(showDetails)
  } catch (error: any) {
    console.error(`Error fetching TV show details for TMDB ID ${id}:`, error.message)
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ msg: 'TV show not found on TMDb.' })
    }
    res.status(500).send('Server Error while fetching TV show details.')
  }
}
