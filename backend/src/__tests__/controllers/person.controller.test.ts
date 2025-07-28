import { Request, Response } from 'express'
import { getPersonDetailsById, getPopularPersons } from '../../controllers/person.controller'
import { tmdbService } from '../../services/tmdb.service'
import {
  TPerson,
  TTMDBPersonDetails,
  TTMDBPopularPersonsResponse,
  TTMDBPersonCombinedCredit
} from '@shared/types/person'

type MockTmdbPersonResponse = TTMDBPersonDetails & {
  combined_credits?: {
    cast: TTMDBPersonCombinedCredit[]
    crew: TTMDBPersonCombinedCredit[]
  }
}

jest.mock('../../services/tmdb.service', () => ({
  tmdbService: {
    getPersonDetailsAndCredits: jest.fn(),
    getPopularPersons: jest.fn()
  }
}))

const mockedTmdbService = tmdbService as jest.Mocked<typeof tmdbService>

describe('Person Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('getPersonDetailsById', () => {
    const mockTmdbPersonDetails: MockTmdbPersonResponse = {
      adult: false,
      also_known_as: ['John Doe Jr.'],
      biography: 'A famous actor.',
      birthday: '1980-01-01',
      deathday: null,
      gender: 2,
      homepage: null,
      id: 123,
      imdb_id: 'nm0000123',
      known_for_department: 'Acting',
      name: 'John Doe',
      place_of_birth: 'Hollywood, USA',
      popularity: 10.5,
      profile_path: '/path/to/profile.jpg',
      combined_credits: {
        cast: [
          {
            id: 1,
            title: 'Movie A',
            media_type: 'movie',
            character: 'Char A',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            overview: '...',
            popularity: 10,
            poster_path: null,
            vote_average: 7,
            vote_count: 100,
            credit_id: '123'
          },
          {
            id: 2,
            name: 'TV Show B',
            media_type: 'tv',
            character: 'Char B',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            overview: '...',
            popularity: 10,
            poster_path: null,
            vote_average: 7,
            vote_count: 100,
            credit_id: '456'
          }
        ],
        crew: [
          {
            id: 3,
            title: 'Movie C',
            media_type: 'movie',
            job: 'Director',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            overview: '...',
            popularity: 10,
            poster_path: null,
            vote_average: 7,
            vote_count: 100,
            credit_id: '789'
          }
        ]
      }
    }

    const expectedPersonResponse: TPerson = {
      bio: {
        adult: false,
        also_known_as: ['John Doe Jr.'],
        biography: 'A famous actor.',
        birthday: '1980-01-01',
        deathday: null,
        gender: 2,
        homepage: null,
        id: 123,
        imdb_id: 'nm0000123',
        known_for_department: 'Acting',
        name: 'John Doe',
        place_of_birth: 'Hollywood, USA',
        popularity: 10.5,
        profile_path: '/path/to/profile.jpg'
      },
      credits: {
        cast: [
          {
            id: 1,
            title: 'Movie A',
            media_type: 'movie',
            character: 'Char A',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            overview: '...',
            popularity: 10,
            poster_path: null,
            vote_average: 7,
            vote_count: 100,
            credit_id: '123'
          },
          {
            id: 2,
            name: 'TV Show B',
            media_type: 'tv',
            character: 'Char B',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            overview: '...',
            popularity: 10,
            poster_path: null,
            vote_average: 7,
            vote_count: 100,
            credit_id: '456'
          }
        ],
        crew: [
          {
            id: 3,
            title: 'Movie C',
            media_type: 'movie',
            job: 'Director',
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            original_language: 'en',
            overview: '...',
            popularity: 10,
            poster_path: null,
            vote_average: 7,
            vote_count: 100,
            credit_id: '789'
          }
        ]
      }
    }

    test('should return 400 if ID is missing', async () => {
      mockRequest.params = {}

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'A valid TMDB person ID is required.' })
      expect(mockedTmdbService.getPersonDetailsAndCredits).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should return 400 if ID is not a number', async () => {
      mockRequest.params = { id: 'abc' }

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'A valid TMDB person ID is required.' })
      expect(mockedTmdbService.getPersonDetailsAndCredits).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should return 200 with person details for a valid ID', async () => {
      mockRequest.params = { id: '123' }
      mockedTmdbService.getPersonDetailsAndCredits.mockResolvedValueOnce(mockTmdbPersonDetails)

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockedTmdbService.getPersonDetailsAndCredits).toHaveBeenCalledWith(123)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(expectedPersonResponse)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should return 404 if person not found on TMDb', async () => {
      mockRequest.params = { id: '404' }
      mockedTmdbService.getPersonDetailsAndCredits.mockRejectedValueOnce(
        new Error('Person not found on TMDb')
      )

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Person not found on TMDb.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching person details for TMDB ID 404:',
        'Person not found on TMDb'
      )
    })

    test('should return 504 if TMDb request times out', async () => {
      mockRequest.params = { id: '123' }
      mockedTmdbService.getPersonDetailsAndCredits.mockRejectedValueOnce(
        new Error('Request to external API timed out.')
      )

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(504)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Request to external API timed out.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching person details for TMDB ID 123:',
        'Request to external API timed out.'
      )
    })

    test('should return 503 if TMDb service is unavailable', async () => {
      mockRequest.params = { id: '123' }
      mockedTmdbService.getPersonDetailsAndCredits.mockRejectedValueOnce(
        new Error('External API service unavailable.')
      )

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(503)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'External API service unavailable.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching person details for TMDB ID 123:',
        'External API service unavailable.'
      )
    })

    test('should return 500 for a generic server error', async () => {
      mockRequest.params = { id: '123' }
      mockedTmdbService.getPersonDetailsAndCredits.mockRejectedValueOnce(
        new Error('Something unexpected happened')
      )

      await getPersonDetailsById(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: 'Server Error while fetching person details and credits.'
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching person details for TMDB ID 123:',
        'Something unexpected happened'
      )
    })
  })

  describe('getPopularPersons', () => {
    const mockPopularPersonsResponse: TTMDBPopularPersonsResponse = {
      page: 1,
      results: [
        {
          id: 1,
          name: 'Person A',
          adult: false,
          gender: 2,
          original_name: 'Person A',
          profile_path: '/a.jpg',
          popularity: 100,
          known_for_department: 'Acting',
          known_for: []
        },
        {
          id: 2,
          name: 'Person B',
          adult: false,
          gender: 1,
          original_name: 'Person B',
          profile_path: '/b.jpg',
          popularity: 90,
          known_for_department: 'Directing',
          known_for: []
        }
      ],
      total_pages: 1,
      total_results: 2
    }

    test('should return 200 with popular persons results', async () => {
      mockedTmdbService.getPopularPersons.mockResolvedValueOnce(mockPopularPersonsResponse)

      await getPopularPersons(mockRequest as Request, mockResponse as Response)

      expect(mockedTmdbService.getPopularPersons).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(mockPopularPersonsResponse.results)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    test('should return 404 if no popular persons found', async () => {
      mockedTmdbService.getPopularPersons.mockRejectedValueOnce(
        new Error('No popular persons found')
      )

      await getPopularPersons(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'No popular persons found.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching popular persons:',
        'No popular persons found'
      )
    })

    test('should return 504 if TMDb request times out for popular persons', async () => {
      mockedTmdbService.getPopularPersons.mockRejectedValueOnce(
        new Error('Request to external API timed out.')
      )

      await getPopularPersons(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(504)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Request to external API timed out.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching popular persons:',
        'Request to external API timed out.'
      )
    })

    test('should return 503 if TMDb service is unavailable for popular persons', async () => {
      mockedTmdbService.getPopularPersons.mockRejectedValueOnce(
        new Error('External API service unavailable.')
      )

      await getPopularPersons(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(503)
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'External API service unavailable.' })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching popular persons:',
        'External API service unavailable.'
      )
    })

    test('should return 500 for a generic server error fetching popular persons', async () => {
      mockedTmdbService.getPopularPersons.mockRejectedValueOnce(new Error('Generic API error'))

      await getPopularPersons(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({
        msg: 'Server Error while fetching popular persons.'
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching popular persons:',
        'Generic API error'
      )
    })
  })
})
