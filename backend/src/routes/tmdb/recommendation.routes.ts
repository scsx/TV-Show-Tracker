import { Router } from 'express'
import authMiddleware from 'src/middleware/auth.middleware'
import { getPersonalizedRecommendations } from 'src/controllers/recommendation.controller'

const router = Router()

/**
 * @route GET /api/users/:userId/recommendations
 * @description Gets personalized TV show recommendations based on user's favorite IDs.
 * @access Private (requires authentication)
 */
router.get('/:userId/recommendations', authMiddleware, getPersonalizedRecommendations)

export default router
