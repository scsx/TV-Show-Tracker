import { Request, Response } from 'express'
import User from '../models/User'

/**
 * @route PATCH /api/users/:userId/favorites/toggle
 * @desc Add or remove a show from a user's favorite list
 * @access Private
 */
export const toggleFavoriteShow = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { tmdbId } = req.body // Expecting tmdbId in the request body

  // Validate incoming TMDB ID
  if (!tmdbId || typeof tmdbId !== 'number') {
    return res.status(400).json({ msg: 'A valid TMDB show ID (tmdbId) is required.' })
  }

  // Ensure the authenticated user matches the user in the URL
  if (req.user?.id !== userId) {
    return res.status(403).json({ msg: 'Unauthorized: User ID mismatch.' })
  }

  try {
    // Fetch the user and ensure favoriteShowTmdbIds is initialized
    const user = await User.findById(userId).select('username favoriteShowTmdbIds')

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' })
    }

    // Ensure the array exists (if not defaulted in the schema or read before being created)
    if (!user.favoriteShowTmdbIds) {
      user.favoriteShowTmdbIds = []
    }

    const tmdbIdNum = Number(tmdbId)

    // Check if the show is currently in favorites based on the DB array
    const isCurrentlyFavorite = user.favoriteShowTmdbIds.includes(tmdbIdNum)

    let updateOperation
    let message: string

    if (isCurrentlyFavorite) {
      // If already a favorite, remove it
      updateOperation = { $pull: { favoriteShowTmdbIds: tmdbIdNum } }
      message = 'Show removed from favorites.'
    } else {
      // If not a favorite, add it (using $addToSet to prevent duplicates)
      updateOperation = { $addToSet: { favoriteShowTmdbIds: tmdbIdNum } }
      message = 'Show added to favorites.'
    }

    // Perform the atomic update in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateOperation,
      { new: true, runValidators: true } // 'new: true' returns the updated document; 'runValidators: true' ensures Mongoose schema validations are run
    ).select('favoriteShowTmdbIds') // Select only the field we want to return, for optimization.

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found after update attempt.' })
    }

    // Return the updated array of TMDB IDs to the frontend
    res.json({ msg: message, favoriteTmdbIds: updatedUser.favoriteShowTmdbIds })
  } catch (error: any) {
    console.error('Error toggling favorite show:', error.message)
    res.status(500).send('Server Error')
  }
}

/**
 * @route GET /api/users/:userId/favorites
 * @desc Get all favorite show TMDB IDs for a user
 * @access Private
 */
export const getUserFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params

  // Ensure the authenticated user matches the user in the URL
  if (req.user?.id !== userId) {
    return res.status(403).json({ msg: 'Unauthorized: User ID mismatch.' })
  }

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' })
    }

    const favoriteTmdbIds = user.favoriteShowTmdbIds || []

    // Return the array of TMDB IDs directly
    res.json({ favoriteTmdbIds: favoriteTmdbIds })
  } catch (error: any) {
    console.error('Error fetching user favorites:', error.message)
    res.status(500).send('Server Error')
  }
}
