import { Request, Response, NextFunction } from 'express'
import AccessToken from '../models/AccessToken'
import User from '../models/User'

// Extend the Request object to include a 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        username: string
        email: string
        favoriteShowTmdbIds: number[]
      }
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get token from header
  // Check for token in 'Authorization: Bearer <token>' header
  const authHeader = req.header('Authorization')

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // Check if it's a Bearer token
  const tokenParts = authHeader.split(' ')
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token format is "Bearer <token>"' })
  }

  const token = tokenParts[1]

  try {
    // 2. Verify token against AccessToken model
    const accessTokenDoc = await AccessToken.findOne({ token })

    if (!accessTokenDoc) {
      return res.status(401).json({ msg: 'Token is not valid or expired' })
    }

    // Check if the token is expired (though TTL index should handle this eventually)
    if (accessTokenDoc.expiresAt < new Date()) {
      // Optionally, remove expired token from DB immediately if not handled by TTL cron/index
      await AccessToken.deleteOne({ token })
      return res.status(401).json({ msg: 'Token has expired' })
    }

    // 3. Attach user to request object (for subsequent middleware/routes)
    // Find the user associated with this token
    const user = await User.findById(accessTokenDoc.userId).select('-password') // Exclude password

    if (!user) {
      // This case implies a token exists for a non-existent user, which is an anomaly
      await AccessToken.deleteOne({ token }) // Clean up the orphaned token
      return res.status(401).json({ msg: 'User associated with token not found' })
    }

    // Attach user info to the request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      favoriteShowTmdbIds: user.favoriteShowTmdbIds || []
    } as typeof req.user // Quick fix, wouldn't be used in a real project.

    // 4. Call next middleware/route handler
    next()
  } catch (err: any) {
    console.error('Auth middleware error:', err.message)
    res.status(500).json({ msg: 'Server Error - Token verification failed' })
  }
}

export default authMiddleware
