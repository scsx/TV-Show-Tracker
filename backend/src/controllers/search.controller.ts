import { Request, Response } from 'express'
import axios from 'axios'
import { TTMDBShowSearchResult } from '@shared/types/show'
import { TTMDBKeywordsResponse, TTMDBSearchShowResponse } from '@shared/types/search'

/**
 * @description Fetches keyword IDs from a text query via TMDB's search/keyword endpoint.
 * @param {string} query - The text query to search for keywords.
 * @returns {Promise<number[]>} - A promise that resolves to an array of keyword IDs, or an empty array on error/no results.
 */
const fetchKeywordIds = async (query: string): Promise<number[]> => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE_URL = process.env.TMDB_BASE_URL

    if (!TMDB_API_KEY || !TMDB_BASE_URL) {
      console.error('TMDB_API_KEY or TMDB_BASE_URL not configured.')
      return []
    }

    const response = await axios.get<TTMDBKeywordsResponse>(`${TMDB_BASE_URL}/search/keyword`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query
      }
    })
    return response.data.results.map((keyword) => keyword.id)
  } catch (error) {
    console.error('Error fetching keyword IDs from TMDB:', error)
    return []
  }
}

/**
 * @description Main controller to search for TV shows using various filters via the TMDB discover/tv endpoint.
 * @param {Request} req - The Express request object, containing query parameters for search (query, genreIds, sortBy, page).
 * @param {Response} res - The Express response object, used to send back the search results or an error.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */

export const searchTvShows = async (req: Request, res: Response) => {
  const userQuery = req.query.query as string | undefined
  const genreIds = req.query.genreIds as string | undefined
  const sortBy = req.query.sortBy as string | undefined
  const page = req.query.page ? parseInt(req.query.page as string) : 1

  const TMDB_API_KEY = process.env.TMDB_API_KEY
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL

  if (!TMDB_API_KEY || !TMDB_BASE_URL) {
    console.error('TMDB_API_KEY or TMDB_BASE_URL not configured.')
    return res.status(500).json({ message: 'TMDB API configuration missing.' })
  }

  const discoverParams: any = {
    // Using 'any' for dynamic parameter addition
    api_key: TMDB_API_KEY,
    language: 'pt-PT',
    page: page,
    sort_by: sortBy || 'popularity.desc',
    include_adult: false
  }

  try {
    if (userQuery) {
      const keywordIds = await fetchKeywordIds(userQuery)
      if (keywordIds.length > 0) {
        discoverParams.with_keywords = keywordIds.join('|') // OR logic for multiple keywords
      }
    }

    if (genreIds) {
      discoverParams.with_genres = genreIds
    }

    const response = await axios.get<TTMDBSearchShowResponse>(`${TMDB_BASE_URL}/discover/tv`, {
      params: discoverParams
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
