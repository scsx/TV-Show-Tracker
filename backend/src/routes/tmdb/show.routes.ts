import { Router } from 'express'
import {
  fetchAndSaveTrendingShows,
  getAllShowSummaries,
  getShowDetailsByTmdbId
} from '../../controllers/show.controller'
import { Server as SocketIOServer } from 'socket.io'
import authMiddleware from '../../middleware/auth.middleware'

const createShowRouter = (io: SocketIOServer) => {
  const router = Router()

  /**
   * @route GET /api/tmdb/shows/fetch-trending-and-save
   * @description Fetches trending TV show summaries from TMDb and saves them to the database.
   */
  router.get('/fetch-trending-and-save', (req, res) => fetchAndSaveTrendingShows(req, res, io))

  /**
   * @route GET /api/tmdb/shows
   * @description Fetches all saved TV show summaries from the database.
   */
  router.get('/', getAllShowSummaries)

  /**
   * @route GET /api/tmdb/shows/:tmdbId
   * @description Fetches full details for a specific TV show from TMDb by its ID.
   * @access Private (requires authentication)
   */
  router.get('/:tmdbId', authMiddleware, getShowDetailsByTmdbId)

  return router
}

export default createShowRouter
