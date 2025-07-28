import { Request, Response } from 'express'
import { toggleFavoriteShow } from '../../controllers/user.controller'
import User from '../../models/User'
import { Query } from 'mongoose'

interface MockUserDocument {
  _id: string
  username?: string
  email?: string
  favoriteShowids: number[]
}

jest.mock('../../models/User', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
}))

const mockedUser = User as jest.Mocked<typeof User>

describe('toggleFavoriteShow', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {
      params: { userId: 'user123' },
      body: { id: 123 },
      user: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: []
      }
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    }

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  test('should add a show to favorites if not already present', async () => {
    const userBeforeUpdate: MockUserDocument = {
      _id: 'user123',
      username: 'testuser',
      favoriteShowids: [456, 789]
    }

    const userAfterUpdate: MockUserDocument = {
      _id: 'user123',
      favoriteShowids: [456, 789, 123]
    }

    const mockFindByIdQuery = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(userBeforeUpdate)
    }
    const mockFindByIdAndUpdateQuery = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(userAfterUpdate)
    }

    mockedUser.findById.mockReturnValueOnce(
      mockFindByIdQuery as unknown as Query<any, any, any, any, any>
    )
    mockedUser.findByIdAndUpdate.mockReturnValueOnce(
      mockFindByIdAndUpdateQuery as unknown as Query<any, any, any, any, any>
    )

    await toggleFavoriteShow(mockRequest as Request, mockResponse as Response)

    expect(mockedUser.findById).toHaveBeenCalledWith('user123')
    expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      { $addToSet: { favoriteShowids: 123 } },
      { new: true, runValidators: true }
    )

    expect(mockFindByIdQuery.select).toHaveBeenCalledWith('username favoriteShowids')
    expect(mockFindByIdQuery.exec).toHaveBeenCalledTimes(1)

    expect(mockFindByIdAndUpdateQuery.select).toHaveBeenCalledWith('favoriteShowids')
    expect(mockFindByIdAndUpdateQuery.exec).toHaveBeenCalledTimes(1)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledTimes(1)
    expect(mockResponse.json).toHaveBeenCalledWith({
      msg: 'Show added to favorites.',
      favoriteids: [456, 789, 123]
    })
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should remove a show from favorites if already present', async () => {
    const userBeforeUpdate: MockUserDocument = {
      _id: 'user123',
      username: 'testuser',
      favoriteShowids: [456, 123, 789]
    }

    const userAfterUpdate: MockUserDocument = {
      _id: 'user123',
      favoriteShowids: [456, 789]
    }

    const mockFindByIdQuery = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(userBeforeUpdate)
    }
    const mockFindByIdAndUpdateQuery = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(userAfterUpdate)
    }

    mockedUser.findById.mockReturnValueOnce(
      mockFindByIdQuery as unknown as Query<any, any, any, any, any>
    )
    mockedUser.findByIdAndUpdate.mockReturnValueOnce(
      mockFindByIdAndUpdateQuery as unknown as Query<any, any, any, any, any>
    )

    await toggleFavoriteShow(mockRequest as Request, mockResponse as Response)

    expect(mockedUser.findById).toHaveBeenCalledWith('user123')
    expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledTimes(1)
    expect(mockedUser.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      { $pull: { favoriteShowids: 123 } },
      { new: true, runValidators: true }
    )

    expect(mockFindByIdQuery.select).toHaveBeenCalledWith('username favoriteShowids')
    expect(mockFindByIdQuery.exec).toHaveBeenCalledTimes(1)

    expect(mockFindByIdAndUpdateQuery.select).toHaveBeenCalledWith('favoriteShowids')
    expect(mockFindByIdAndUpdateQuery.exec).toHaveBeenCalledTimes(1)

    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalledTimes(1)
    expect(mockResponse.json).toHaveBeenCalledWith({
      msg: 'Show removed from favorites.',
      favoriteids: [456, 789]
    })
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})
