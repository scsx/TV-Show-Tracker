import { Request, Response } from 'express'
import axios from 'axios'
import { getPersonalizedRecommendations } from '../../controllers/recommendation.controller'
import { TTMDBShowSummary } from '@shared/types/show'
import { TRecommendation } from '@shared/types/recommendation'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

let consoleErrorSpy: jest.SpyInstance
let consoleWarnSpy: jest.SpyInstance

describe('Recommendation Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeAll(() => {
    process.env.TMDB_API_KEY = 'test_api_key'
    process.env.TMDB_BASE_URL = 'http://api.themoviedb.org/3'
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {
      params: { userId: 'user123' },
      user: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: []
      }
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  afterAll(() => {
    delete process.env.TMDB_API_KEY
    delete process.env.TMDB_BASE_URL
  })

  describe('getPersonalizedRecommendations', () => {
    test('should return 403 if user ID in params does not match authenticated user ID', async () => {
      mockRequest.params = { userId: 'user456' }
      mockRequest.user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: []
      }

      await getPersonalizedRecommendations(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Unauthorized: User ID mismatch.' })
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })

    test('should return 200 with an empty array if user has no favorite shows', async () => {
      mockRequest.user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: []
      }

      await getPersonalizedRecommendations(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith([])
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })

    test('should return personalized recommendations for favorite shows', async () => {
      mockRequest.user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: [100, 200]
      }

      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('/tv/100/recommendations')) {
          return Promise.resolve({
            data: {
              results: [
                {
                  id: 101,
                  name: 'Rec One A',
                  media_type: 'tv',
                  original_name: 'Rec One A',
                  overview: '...',
                  poster_path: null,
                  backdrop_path: null,
                  first_air_date: '2020-01-01',
                  popularity: 10,
                  vote_average: 7,
                  vote_count: 100,
                  origin_country: ['US'],
                  original_language: 'en',
                  genre_ids: [],
                  video: false
                } as TTMDBShowSummary,
                {
                  id: 102,
                  name: 'Rec One B',
                  media_type: 'tv',
                  original_name: 'Rec One B',
                  overview: '...',
                  poster_path: null,
                  backdrop_path: null,
                  first_air_date: '2020-01-02',
                  popularity: 9,
                  vote_average: 6,
                  vote_count: 90,
                  origin_country: ['US'],
                  original_language: 'en',
                  genre_ids: [],
                  video: false
                } as TTMDBShowSummary
              ]
            }
          })
        } else if (url.includes('/tv/200/recommendations')) {
          return Promise.resolve({
            data: {
              results: [
                {
                  id: 201,
                  name: 'Rec Two A',
                  media_type: 'tv',
                  original_name: 'Rec Two A',
                  overview: '...',
                  poster_path: null,
                  backdrop_path: null,
                  first_air_date: '2021-01-01',
                  popularity: 11,
                  vote_average: 8,
                  vote_count: 110,
                  origin_country: ['US'],
                  original_language: 'en',
                  genre_ids: [],
                  video: false
                } as TTMDBShowSummary
              ]
            }
          })
        } else if (url.includes('/tv/100')) {
          return Promise.resolve({ data: { id: 100, name: 'Favorite Show One' } })
        } else if (url.includes('/tv/200')) {
          return Promise.resolve({ data: { id: 200, name: 'Favorite Show Two' } })
        }
        return Promise.reject(new Error('URL not mocked: ' + url))
      })

      await getPersonalizedRecommendations(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(4)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          favoriteId: 100,
          favoriteName: 'Favorite Show One',
          favoriteRecommended: [
            {
              id: 101,
              name: 'Rec One A',
              media_type: 'tv',
              original_name: 'Rec One A',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              first_air_date: '2020-01-01',
              popularity: 10,
              vote_average: 7,
              vote_count: 100,
              origin_country: ['US'],
              original_language: 'en',
              genre_ids: [],
              video: false
            },
            {
              id: 102,
              name: 'Rec One B',
              media_type: 'tv',
              original_name: 'Rec One B',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              first_air_date: '2020-01-02',
              popularity: 9,
              vote_average: 6,
              vote_count: 90,
              origin_country: ['US'],
              original_language: 'en',
              genre_ids: [],
              video: false
            }
          ]
        },
        {
          favoriteId: 200,
          favoriteName: 'Favorite Show Two',
          favoriteRecommended: [
            {
              id: 201,
              name: 'Rec Two A',
              media_type: 'tv',
              original_name: 'Rec Two A',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              first_air_date: '2021-01-01',
              popularity: 11,
              vote_average: 8,
              vote_count: 110,
              origin_country: ['US'],
              original_language: 'en',
              genre_ids: [],
              video: false
            }
          ]
        }
      ] as TRecommendation[])
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    test('should handle individual show detail fetch failures gracefully', async () => {
      mockRequest.user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: [100, 200]
      }

      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { id: 200, name: 'Favorite Show Two' } })
        .mockResolvedValueOnce({
          data: {
            results: [
              {
                id: 201,
                name: 'Rec Two A',
                media_type: 'tv',
                original_name: 'Rec Two A',
                overview: '...',
                poster_path: null,
                backdrop_path: null,
                first_air_date: '2021-01-01',
                popularity: 11,
                vote_average: 8,
                vote_count: 110,
                origin_country: ['US'],
                original_language: 'en',
                genre_ids: [],
                video: false
              } as TTMDBShowSummary
            ]
          }
        })

      await getPersonalizedRecommendations(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(3)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          favoriteId: 200,
          favoriteName: 'Favorite Show Two',
          favoriteRecommended: [
            {
              id: 201,
              name: 'Rec Two A',
              media_type: 'tv',
              original_name: 'Rec Two A',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              first_air_date: '2021-01-01',
              popularity: 11,
              vote_average: 8,
              vote_count: 110,
              origin_country: ['US'],
              original_language: 'en',
              genre_ids: [],
              video: false
            }
          ]
        }
      ] as TRecommendation[])
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Could not fetch details for favorite show ID 100. Skipping recommendations for this show.'
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching name for TV show ID 100 from TMDB:',
        'Network error'
      )
    })

    test('should handle individual show recommendations fetch failures gracefully', async () => {
      mockRequest.user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: [100, 200]
      }

      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('/tv/100/recommendations')) {
          return Promise.reject(new Error('Recommendations not found'))
        } else if (url.includes('/tv/200/recommendations')) {
          return Promise.resolve({
            data: {
              results: [
                {
                  id: 201,
                  name: 'Rec Two A',
                  media_type: 'tv',
                  original_name: 'Rec Two A',
                  overview: '...',
                  poster_path: null,
                  backdrop_path: null,
                  first_air_date: '2021-01-01',
                  popularity: 11,
                  vote_average: 8,
                  vote_count: 110,
                  origin_country: ['US'],
                  original_language: 'en',
                  genre_ids: [],
                  video: false
                } as TTMDBShowSummary
              ]
            }
          })
        } else if (url.includes('/tv/100')) {
          return Promise.resolve({ data: { id: 100, name: 'Favorite Show One' } })
        } else if (url.includes('/tv/200')) {
          return Promise.resolve({ data: { id: 200, name: 'Favorite Show Two' } })
        }
        return Promise.reject(new Error('URL not mocked: ' + url))
      })

      await getPersonalizedRecommendations(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(4)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith([
        {
          favoriteId: 100,
          favoriteName: 'Favorite Show One',
          favoriteRecommended: []
        },
        {
          favoriteId: 200,
          favoriteName: 'Favorite Show Two',
          favoriteRecommended: [
            {
              id: 201,
              name: 'Rec Two A',
              media_type: 'tv',
              original_name: 'Rec Two A',
              overview: '...',
              poster_path: null,
              backdrop_path: null,
              first_air_date: '2021-01-01',
              popularity: 11,
              vote_average: 8,
              vote_count: 110,
              origin_country: ['US'],
              original_language: 'en',
              genre_ids: [],
              video: false
            }
          ]
        }
      ] as TRecommendation[])
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching recommendations for TV show ID 100 from TMDB:',
        'Recommendations not found'
      )
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    test('should handle missing TMDB_API_KEY/TMDB_BASE_URL', async () => {
      const originalApiKey = process.env.TMDB_API_KEY
      const originalBaseUrl = process.env.TMDB_BASE_URL
      delete process.env.TMDB_API_KEY
      delete process.env.TMDB_BASE_URL

      mockRequest.user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: [100]
      }

      await getPersonalizedRecommendations(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith([])
      expect(consoleErrorSpy).toHaveBeenCalledWith('TMDB_API_KEY or TMDB_BASE_URL not configured.')
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Could not fetch details for favorite show ID 100. Skipping recommendations for this show.`
      )
      expect(mockedAxios.get).not.toHaveBeenCalled()

      process.env.TMDB_API_KEY = originalApiKey
      process.env.TMDB_BASE_URL = originalBaseUrl
    })
  })
})
