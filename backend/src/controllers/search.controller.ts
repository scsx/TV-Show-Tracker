import { Request, Response } from 'express'
import axios from 'axios'
import { TTMDBShowSearchResult } from '@shared/types/show'
import { TTMDBSearchShowResponse } from '@shared/types/search'

/**
 * @description Main controller to search for TV shows using various filters via the TMDB discover/tv endpoint.
 * @param {Request} req - The Express request object, containing query parameters for search (query, genreIds, sortBy, page).
 * @param {Response} res - The Express response object, used to send back the search results or an error.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const searchTvShows = async (req: Request, res: Response) => {
  const userQuery = req.query.query as string | undefined
  const genreIdsParam = req.query.genreIds as string | undefined // Renamed to avoid local var collision
  const sortBy = req.query.sortBy as string | undefined
  const page = req.query.page ? parseInt(req.query.page as string) : 1

  const TMDB_API_KEY = process.env.TMDB_API_KEY
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL

  if (!TMDB_API_KEY || !TMDB_BASE_URL) {
    console.error('TMDB_API_KEY or TMDB_BASE_URL not configured.')
    return res.status(500).json({ message: 'TMDB API configuration missing.' })
  }

  try {
    let apiUrl: string
    const requestParams: any = {
      api_key: TMDB_API_KEY,
      language: 'pt-PT',
      page: page,
      include_adult: false
    }

    if (userQuery && userQuery.trim() !== '') {
      apiUrl = `${TMDB_BASE_URL}/search/tv`
      requestParams.query = userQuery

      const cleanGenreIds = genreIdsParam ? genreIdsParam.split(',').filter(Boolean).join(',') : ''
      if (cleanGenreIds) {
        requestParams.with_genres = cleanGenreIds
      }
    } else {
      apiUrl = `${TMDB_BASE_URL}/discover/tv`
      requestParams.sort_by = sortBy || 'popularity.desc'

      const cleanGenreIds = genreIdsParam ? genreIdsParam.split(',').filter(Boolean).join(',') : ''
      if (cleanGenreIds) {
        requestParams.with_genres = cleanGenreIds
      }
    }

    if (!apiUrl) {
      apiUrl = `${TMDB_BASE_URL}/discover/tv`
      requestParams.sort_by = sortBy || 'popularity.desc'
    }

    const response = await axios.get<TTMDBSearchShowResponse>(apiUrl, {
      params: requestParams
    })

    const searchResults: TTMDBShowSearchResult[] = response.data.results || []
    const totalPages: number = response.data.total_pages || 1
    const totalResults: number = response.data.total_results || 0

    res.json({
      shows: searchResults,
      page: response.data.page,
      totalPages: totalPages,
      totalResults: totalResults
    })
  } catch (error: any) {
    console.error('Error searching TV shows on TMDB:', error.response?.data || error.message)
    res.status(500).json({
      message: 'Failed to search TV shows.',
      error: error.response?.data || error.message
    })
  }
}
