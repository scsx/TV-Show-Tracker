import { Router, Request, Response } from 'express'
import User from '../models/User'
import AccessToken from '../models/AccessToken'
import crypto from 'crypto' // For generating secure tokens

const router = Router()

// Utility function to generate a secure random token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex') // 32 bytes = 64 hex characters
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'User with that email already exists' })
    }

    user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({ msg: 'Username already taken' })
    }

    // 2. Create new user instance (password hashing handled by pre-save hook in User model)
    user = new User({
      username,
      email,
      password // Mongoose pre-save hook will hash this
    })

    // 3. Save user to database
    await user.save()

    // 4. Generate and save an access token for immediate login
    const tokenValue = generateToken()
    const accessToken = new AccessToken({
      token: tokenValue,
      userId: user._id, // User's ID from MongoDB
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Token expires in 7 days
    })
    await accessToken.save()

    // 5. Return success response (don't send password)
    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token: accessToken.token // Send the token for immediate use
    })
  } catch (error: any) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    }

    // 2. Compare password (using method defined in User model)
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    }

    // 3. Generate and save a new access token for the user
    // You might want to revoke old tokens here or use a more sophisticated session management
    const tokenValue = generateToken()
    const accessToken = new AccessToken({
      token: tokenValue,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Token expires in 7 days
    })
    await accessToken.save()

    // 4. Return token and user info
    res.json({
      msg: 'Logged in successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token: accessToken.token
    })
  } catch (error: any) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

export default router
