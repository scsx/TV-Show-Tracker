import { Router } from 'express'
import authMiddleware from '../../middleware/auth.middleware'
import { searchTvShows } from '../../controllers/search.controller'

const router = Router()

/**
 * @route GET /api/search/shows
 * @description Search TV shows with some filters (keywords, genres, sort, pagination) via TMDB discover/tv endpoint.
 * @access Private (auth)
 * !! This route belongs to search, not shows
 */
router.get('/shows', authMiddleware, searchTvShows)

export default router
