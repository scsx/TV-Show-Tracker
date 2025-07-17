import { Router } from 'express'
import authMiddleware from '../middleware/auth.middleware' // Auth middleware for protected routes
import { toggleFavoriteShow, getUserFavorites } from '../controllers/user.controller' // User-related controllers

const router = Router()

// Route to get a user's favorite shows
// Protected to ensure only authenticated users can access their favorites
router.get('/:userId/favorites', authMiddleware, getUserFavorites)

// Route to add/remove a show from a user's favorites
// Using PATCH for a toggle operation
router.patch('/:userId/favorites/toggle', authMiddleware, toggleFavoriteShow)

export default router
