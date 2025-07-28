import { Request, Response } from 'express'
import User from '../models/User'

/**
 * @route PATCH /api/users/:userId/favorites/toggle
 * @desc Add or remove a show from a user's favorite list
 * @access Private
 */
export const toggleFavoriteShow = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { id } = req.body // Expecting id in the request body

  // Validate incoming TMDB ID
  if (!id || typeof id !== 'number') {
    return res.status(400).json({ msg: 'A valid TMDB show ID (id) is required.' })
  }

  // Ensure the authenticated user matches the user in the URL
  if (req.user?.id !== userId) {
    return res.status(403).json({ msg: 'Unauthorized: User ID mismatch.' })
  }

  try {
    // Fetch the user and ensure favoriteShowids is initialized
    const user = await User.findById(userId).select('username favoriteShowids').exec()

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' })
    }

    // Ensure the array exists (if not defaulted in the schema or read before being created)
    if (!user.favoriteShowids) {
      user.favoriteShowids = []
    }

    const idNum = Number(id)

    // Check if the show is currently in favorites based on the DB array
    const isCurrentlyFavorite = user.favoriteShowids.includes(idNum)

    let updateOperation
    let message: string

    if (isCurrentlyFavorite) {
      // If already a favorite, remove it
      updateOperation = { $pull: { favoriteShowids: idNum } }
      message = 'Show removed from favorites.'
    } else {
      // If not a favorite, add it (using $addToSet to prevent duplicates)
      updateOperation = { $addToSet: { favoriteShowids: idNum } }
      message = 'Show added to favorites.'
    }

    // Perform the atomic update in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateOperation,
      { new: true, runValidators: true } // 'new: true' returns the updated document; 'runValidators: true' ensures Mongoose schema validations are run
    )
      .select('favoriteShowids')
      .exec() // Select only the field we want to return, for optimization.

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found after update attempt.' })
    }

    // Return the updated array of TMDB IDs to the frontend
    res.json({ msg: message, favoriteids: updatedUser.favoriteShowids })
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

    const favoriteids = user.favoriteShowids || []

    // Return the array of TMDB IDs directly
    res.json({ favoriteids: favoriteids })
  } catch (error: any) {
    console.error('Error fetching user favorites:', error.message)
    res.status(500).send('Server Error')
  }
}
