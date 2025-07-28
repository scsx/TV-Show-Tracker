// src/__tests__/controllers/show.controller.test.ts

import { Request, Response } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import {
  fetchAndSaveTrendingShows,
  getAllShowSummaries,
  getShowDetailsByid,
  getSeasonDetailsBySeriesIdAndSeasonNumber
} from '../../controllers/show.controller'

import * as showUpdaterService from '../../services/showUpdater.service'
import axios from 'axios'
import ShowSummary from '../../models/ShowSummary'
import { Query } from 'mongoose'

jest.mock('../../models/ShowSummary', () => ({
  find: jest.fn()
}))

jest.mock('../../services/showUpdater.service', () => ({
  showUpdaterTask: jest.fn()
}))

jest.mock('axios')

const mockedShowSummary = ShowSummary as jest.Mocked<typeof ShowSummary>
const mockedShowUpdaterTask = showUpdaterService.showUpdaterTask as jest.Mock
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Show Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockIo: Partial<SocketIOServer>
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    }
    mockIo = {
      emit: jest.fn()
    }

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    process.env.TMDB_API_KEY = 'test_api_key'
    process.env.TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    ;(axios.isAxiosError as unknown as jest.Mock).mockImplementation(
      (payload: any) => payload && payload.isAxiosError === true
    )
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    delete process.env.TMDB_API_KEY
    delete process.env.TMDB_BASE_URL
  })

  describe('fetchAndSaveTrendingShows', () => {
    test('should successfully trigger showUpdaterTask and return 200', async () => {
      mockedShowUpdaterTask.mockResolvedValueOnce(undefined)

      await fetchAndSaveTrendingShows(
        mockRequest as Request,
        mockResponse as Response,
        mockIo as SocketIOServer
      )

      expect(mockedShowUpdaterTask).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Finished processing trending show summaries via manual trigger.'
      })
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should handle errors from showUpdaterTask and return 500', async () => {
      const errorMessage = 'Failed to update shows!'
      mockedShowUpdaterTask.mockRejectedValueOnce(new Error(errorMessage))

      await fetchAndSaveTrendingShows(
        mockRequest as Request,
        mockResponse as Response,
        mockIo as SocketIOServer
      )

      expect(mockedShowUpdaterTask).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to process trending show summaries.'
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in manual fetchAndSaveTrendingShows trigger:',
        errorMessage
      )
    })
  })

  describe('getAllShowSummaries', () => {
    test('should return all show summaries with status 200', async () => {
      const mockSummaries = [
        { tmdbId: 1, title: 'Show 1' },
        { tmdbId: 2, title: 'Show 2' }
      ]
      const mockFindQuery = {
        exec: jest.fn().mockResolvedValueOnce(mockSummaries)
      }
      mockedShowSummary.find.mockReturnValueOnce(
        mockFindQuery as unknown as Query<any, any, any, any, any>
      )

      await getAllShowSummaries(mockRequest as Request, mockResponse as Response)

      expect(mockedShowSummary.find).toHaveBeenCalledWith({})
      expect(mockFindQuery.exec).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully retrieved all show summaries from the database.',
        count: mockSummaries.length,
        shows: mockSummaries
      })
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should return an empty array if no summaries are found', async () => {
      const mockSummaries: any[] = []
      const mockFindQuery = {
        exec: jest.fn().mockResolvedValueOnce(mockSummaries)
      }
      mockedShowSummary.find.mockReturnValueOnce(
        mockFindQuery as unknown as Query<any, any, any, any, any>
      )

      await getAllShowSummaries(mockRequest as Request, mockResponse as Response)

      expect(mockedShowSummary.find).toHaveBeenCalledWith({})
      expect(mockFindQuery.exec).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successfully retrieved all show summaries from the database.',
        count: 0,
        shows: []
      })
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should handle database errors and return 500', async () => {
      const errorMessage = 'Database connection failed!'
      const mockFindQuery = {
        exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage))
      }
      mockedShowSummary.find.mockReturnValueOnce(
        mockFindQuery as unknown as Query<any, any, any, any, any>
      )

      await getAllShowSummaries(mockRequest as Request, mockResponse as Response)

      expect(mockedShowSummary.find).toHaveBeenCalledWith({})
      expect(mockFindQuery.exec).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve show summaries.'
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching all show summaries:',
        errorMessage
      )
    })
  })

  describe('getShowDetailsByid', () => {
    beforeEach(() => {
      mockRequest.params = { id: '123' }
    })

    test('should return 400 if ID is missing or invalid', async () => {
      mockRequest.params = { id: undefined as any }
      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'A valid TMDB show ID is required.' })

      jest.clearAllMocks()
      mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }
      mockRequest.params = { id: 'abc' }
      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'A valid TMDB show ID is required.' })
    })

    test('should return 500 if TMDB API keys are not configured', async () => {
      delete process.env.TMDB_API_KEY
      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Server configuration error.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'TMDB_API_KEY or TMDB_BASE_URL not configured in environment variables.'
      )
    })

    test('should fetch and return show details and credits from TMDb', async () => {
      const mockShowDetails = { id: 123, title: 'Test Show', overview: '...', seasons: [] }
      const mockShowCredits = { cast: [{ name: 'Actor 1' }], crew: [{ name: 'Director' }] }
      const expectedCombinedData = {
        ...mockShowDetails,
        cast: mockShowCredits.cast,
        crew: mockShowCredits.crew
      }

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockShowDetails })
        .mockResolvedValueOnce({ data: mockShowCredits })

      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
      expect(mockedAxios.get).toHaveBeenNthCalledWith(1, `${process.env.TMDB_BASE_URL}/tv/123`, {
        params: { api_key: process.env.TMDB_API_KEY }
      })
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        2,
        `${process.env.TMDB_BASE_URL}/tv/123/credits`,
        { params: { api_key: process.env.TMDB_API_KEY } }
      )
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(expectedCombinedData)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should handle 404 from TMDb API', async () => {
      const axiosError = new Error('Not Found') as any
      axiosError.isAxiosError = true
      axiosError.response = {
        status: 404,
        data: { status_message: 'The resource you requested could not be found.' }
      }

      mockedAxios.get
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce({ data: { cast: [], crew: [] } })

      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'TV show not found on TMDb.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error fetching TV show details and credits for TMDB ID 123:`,
        axiosError.message
      )
    })

    test('should handle generic Axios error from TMDb API', async () => {
      const axiosError = new Error('Network error') as any
      axiosError.isAxiosError = true
      axiosError.response = { status: 503, data: { status_message: 'Service Unavailable' } }

      mockedAxios.get
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce({ data: { cast: [], crew: [] } })

      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
      expect(mockResponse.status).toHaveBeenCalledWith(503)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Service Unavailable' })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    test('should handle non-Axios errors', async () => {
      const genericError = new Error('Something went wrong')
      mockedAxios.get
        .mockRejectedValueOnce(genericError)
        .mockResolvedValueOnce({ data: { cast: [], crew: [] } })

      await getShowDetailsByid(mockRequest as Request, mockResponse as Response)

      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: 'Server Error while fetching TV show details and credits.'
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Error fetching TV show details and credits for TMDB ID 123:`,
        genericError.message
      )
    })
  })

  describe('getSeasonDetailsBySeriesIdAndSeasonNumber', () => {
    beforeEach(() => {
      mockRequest.params = { seriesId: '456', seasonNumber: '1' }
    })

    test('should return 400 if seriesId or seasonNumber are missing', async () => {
      mockRequest.params = { seriesId: undefined as any, seasonNumber: undefined as any }
      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Series ID and Season Number are required.'
      })
    })

    test('should return 400 if seriesId or seasonNumber are invalid', async () => {
      mockRequest.params = { seriesId: 'abc', seasonNumber: '1' }
      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid Series ID or Season Number.'
      })

      jest.clearAllMocks()
      mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() }
      mockRequest.params = { seriesId: '456', seasonNumber: 'xyz' }
      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid Series ID or Season Number.'
      })
    })

    test('should return 500 if TMDB API keys are not configured', async () => {
      delete process.env.TMDB_API_KEY
      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )
      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Server configuration error.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'TMDB_API_KEY or TMDB_BASE_URL not configured in environment variables.'
      )
    })

    test('should fetch and return season details from TMDb', async () => {
      const mockSeasonDetails = {
        id: 1,
        season_number: 1,
        name: 'Season 1',
        episodes: [],
        credits: {},
        videos: {}
      }
      mockedAxios.get.mockResolvedValueOnce({ data: mockSeasonDetails })

      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      const expectedUrl = `${process.env.TMDB_BASE_URL}/tv/456/season/1?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,episodes`
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockSeasonDetails)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should handle Axios errors from TMDb API', async () => {
      const axiosError = new Error('Rate Limit Exceeded') as any
      axiosError.isAxiosError = true
      axiosError.response = { status: 429, data: { status_message: 'Too Many Requests' } }

      mockedAxios.get.mockRejectedValueOnce(axiosError)

      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(429)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Too Many Requests' })
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    test('should handle non-Axios errors', async () => {
      const genericError = new Error('Unexpected error')
      mockedAxios.get.mockRejectedValueOnce(genericError)

      await getSeasonDetailsBySeriesIdAndSeasonNumber(
        mockRequest as Request,
        mockResponse as Response
      )

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching season details from TMDB:',
        genericError.message
      )
    })
  })
})
