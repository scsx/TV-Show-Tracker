import { Router } from 'express'
import { getPersonDetailsById } from '../../controllers/person.controller'
import { getPopularPersons } from '../../controllers/person.controller'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

/**
 * @route GET /api/tmdb/persons/popular
 * @description Fetches a list of popular persons from TMDb.
 * @access Private (requires authentication)
 * IMPORTANT: this route needs to come before api/tmdb/persons/:id
 */
router.get('/popular', authMiddleware, getPopularPersons)

/**
 * @route GET /api/tmdb/persons/:id
 * @description Fetches full details for a specific person from TMDb by their ID, including combined credits.
 * @access Private (requires authentication)
 */
router.get('/:id', authMiddleware, getPersonDetailsById)

export default router
