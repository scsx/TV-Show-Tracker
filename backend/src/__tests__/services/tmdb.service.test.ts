import { TmdbService } from '../../services/tmdb.service'
import axios from 'axios'

jest.mock('axios')
const mockedAxiosGet = axios.get as jest.Mock

describe('TmdbService', () => {
  let serviceInstance: TmdbService
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    serviceInstance = new TmdbService()

    delete process.env.TMDB_API_KEY
    delete process.env.TMDB_BASE_URL

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedAxiosGet.mockClear()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  test('should initialize successfully with environment variables', () => {
    process.env.TMDB_API_KEY = 'test_api_key'
    process.env.TMDB_BASE_URL = 'http://test.com'
    serviceInstance.initialize()
    expect(serviceInstance['TMDB_API_KEY']).toBe('test_api_key')
    expect(serviceInstance['TMDB_BASE_URL']).toBe('http://test.com')
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('should throw error if TMDB_API_KEY is not defined', () => {
    process.env.TMDB_BASE_URL = 'http://test.com'

    expect(() => serviceInstance.initialize()).toThrow('TMDB_API_KEY is not defined')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'TMDB_API_KEY is not defined in environment variables. (from TmdbService.initialize)'
    )
  })

  test('should throw error if TMDB_BASE_URL is not defined', () => {
    process.env.TMDB_API_KEY = 'test_api_key'

    expect(() => serviceInstance.initialize()).toThrow('TMDB_BASE_URL is not defined')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'TMDB_BASE_URL is not defined in environment variables. (from TmdbService.initialize)'
    )
  })

  describe('getTrendingTvShows', () => {
    beforeEach(() => {
      process.env.TMDB_API_KEY = 'mock_api_key'
      process.env.TMDB_BASE_URL = 'http://mockapi.com'
      serviceInstance.initialize()
    })

    test('should fetch trending TV shows successfully', async () => {
      const mockResponseData = {
        page: 1,
        results: [
          { id: 101, name: 'Sample Show 1' },
          { id: 102, name: 'Sample Show 2' }
        ],
        total_pages: 1,
        total_results: 2
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockResponseData })

      const timeWindow = 'day'
      const page = 1
      const result = await serviceInstance.getTrendingTvShows(timeWindow, page)

      expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
      expect(mockedAxiosGet).toHaveBeenCalledWith(`http://mockapi.com/trending/tv/${timeWindow}`, {
        params: {
          api_key: 'mock_api_key',
          language: 'en-US',
          page: page
        }
      })
      expect(result).toEqual(mockResponseData)
    })

    test('should use default timeWindow and page if not provided', async () => {
      const mockResponseData = { page: 1, results: [], total_pages: 0, total_results: 0 }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockResponseData })

      await serviceInstance.getTrendingTvShows()

      expect(mockedAxiosGet).toHaveBeenCalledTimes(1)
      expect(mockedAxiosGet).toHaveBeenCalledWith(`http://mockapi.com/trending/tv/week`, {
        params: {
          api_key: 'mock_api_key',
          language: 'en-US',
          page: 1
        }
      })
    })

    test('should throw error if service is not initialized before calling', async () => {
      const uninitializedServiceInstance = new TmdbService()

      await expect(uninitializedServiceInstance.getTrendingTvShows('day', 1)).rejects.toThrow(
        'TmdbService not initialized. Call initialize() first.'
      )
      expect(mockedAxiosGet).not.toHaveBeenCalled()
    })
  })
})
