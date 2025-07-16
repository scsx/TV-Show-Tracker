import { Router } from 'express'
import { fetchAndSaveTrendingShows } from '../../controllers/show.controller'

const router = Router()

/**
 * @route GET /api/tmdb/shows/fetch-trending-and-save
 * @description Fetches trending TV show summaries from TMDb and saves them to the database.
 */
router.get('/fetch-trending-and-save', fetchAndSaveTrendingShows)

export default router
