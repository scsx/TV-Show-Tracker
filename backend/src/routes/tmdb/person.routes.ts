import { Router } from 'express'
import { getPersonDetailsById } from '../../controllers/person.controller'
import authMiddleware from '../../middleware/auth.middleware'

const router = Router()

/**
 * @route GET /api/tmdb/persons/:id
 * @description Fetches full details for a specific person from TMDb by their ID, including combined credits.
 * @access Private (requires authentication)
 */
router.get('/:id', authMiddleware, getPersonDetailsById)

export default router
