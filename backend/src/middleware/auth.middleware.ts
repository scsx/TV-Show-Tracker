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
        favoriteShowids: number[]
      }
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const accessTokenDoc = await AccessToken.findOne({ token })

    if (!accessTokenDoc) {
      return res.status(401).json({ msg: 'Token is not valid or expired' })
    }

    if (accessTokenDoc.expiresAt < new Date()) {
      await AccessToken.deleteOne({ token })
      return res.status(401).json({ msg: 'Token has expired' })
    }

    const user = await User.findById(accessTokenDoc.userId).select('-password')

    if (!user) {
      await AccessToken.deleteOne({ token })
      return res.status(401).json({ msg: 'User associated with token not found' })
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      favoriteShowids: user.favoriteShowids || []
    }
    next()
  } catch (err: any) {
    // Keep error logging for unexpected issues
    console.error('Authentication Error:', err.message)
    res.status(500).json({ msg: 'Server Error - Token verification failed' })
  }
}

export default authMiddleware
