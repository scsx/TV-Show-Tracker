import request from 'supertest'
import express from 'express'
import userRoutes from '../../routes/user.routes'
import authMiddleware from '../../middleware/auth.middleware'
import * as userController from '../../controllers/user.controller'

jest.mock('../../middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((req, res, next) => next())
}))

jest.mock('../../controllers/user.controller', () => ({
  toggleFavoriteShow: jest.fn((req, res) => res.status(200).json({ message: 'Toggle successful' })),
  getUserFavorites: jest.fn((req, res) => res.status(200).json({ favorites: [] }))
}))

const app = express()
app.use(express.json())
app.use('/users', userRoutes)

const mockedAuthMiddleware = authMiddleware as jest.Mock
const mockedToggleFavoriteShow = userController.toggleFavoriteShow as jest.Mock
const mockedGetUserFavorites = userController.getUserFavorites as jest.Mock

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedAuthMiddleware.mockImplementation((req, res, next) => next())
  })

  describe('GET /users/:userId/favorites', () => {
    test('should call authMiddleware and getUserFavorites', async () => {
      const userId = 'testUserId'
      await request(app).get(`/users/${userId}/favorites`)

      expect(mockedAuthMiddleware).toHaveBeenCalledTimes(1)
      expect(mockedGetUserFavorites).toHaveBeenCalledTimes(1)
    })

    test('should return 401 if authMiddleware rejects', async () => {
      mockedAuthMiddleware.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' })
      })

      const userId = 'testUserId'
      const response = await request(app).get(`/users/${userId}/favorites`)

      expect(mockedAuthMiddleware).toHaveBeenCalledTimes(1)
      expect(mockedGetUserFavorites).not.toHaveBeenCalled()
      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual({ message: 'Unauthorized' })
    })
  })

  describe('PATCH /users/:userId/favorites/toggle', () => {
    test('should call authMiddleware and toggleFavoriteShow', async () => {
      const userId = 'testUserId'
      const showId = 'show123'
      await request(app).patch(`/users/${userId}/favorites/toggle`).send({ showId })

      expect(mockedAuthMiddleware).toHaveBeenCalledTimes(1)
      expect(mockedToggleFavoriteShow).toHaveBeenCalledTimes(1)
      expect(mockedToggleFavoriteShow).toHaveBeenCalledWith(
        expect.objectContaining({ params: { userId } }),
        expect.anything(),
        expect.anything()
      )
    })

    test('should return 401 if authMiddleware rejects', async () => {
      mockedAuthMiddleware.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' })
      })

      const userId = 'testUserId'
      const showId = 'show123'
      const response = await request(app)
        .patch(`/users/${userId}/favorites/toggle`)
        .send({ showId })

      expect(mockedAuthMiddleware).toHaveBeenCalledTimes(1)
      expect(mockedToggleFavoriteShow).not.toHaveBeenCalled()
      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual({ message: 'Unauthorized' })
    })
  })
})
