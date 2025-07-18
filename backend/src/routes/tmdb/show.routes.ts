import { Router } from 'express'
import {
  fetchAndSaveTrendingShows,
  getAllShowSummaries,
  getShowDetailsByid
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
   * @route GET /api/tmdb/shows/:id
   * @description Fetches full details for a specific TV show from TMDb by its ID.
   * @access Private (requires authentication)
   */
  router.get('/:id', authMiddleware, getShowDetailsByid)

  return router
}

export default createShowRouter
