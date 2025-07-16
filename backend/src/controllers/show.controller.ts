import { Request, Response } from 'express'
import { tmdbService } from '../services/tmdb.service'
import ShowSummary from '../models/ShowSummary'
import { TTMDBShowSummary, TShowSummaryModel } from '@shared/types/show'

/**
 * @description Fetches trending TV shows from TMDb and saves their summary to the database.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const fetchAndSaveTrendingShows = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Fetch data from TMDb. The service returns a structure matching TTMDBShowSummary[]
    const trendingData = await tmdbService.getTrendingTvShows('week', 1)
    const trendingShowsFromApi: TTMDBShowSummary[] = trendingData.results

    if (!trendingShowsFromApi || trendingShowsFromApi.length === 0) {
      res.status(404).json({ message: 'No trending shows found from TMDb.' })
      return
    }

    const savedShowSummaries: { tmdbId: number; name: string }[] = []
    const errorsEncountered: { tmdbId: number; error: string }[] = []

    // Use Promise.allSettled to process shows concurrently and handle individual failures
    const promises = trendingShowsFromApi.map(async (showApiData) => {
      try {
        // 2. Check for existing show in DB using the TMDb ID
        const existingShow = await ShowSummary.findOne({ tmdbId: showApiData.id })

        if (!existingShow) {
          // 3. Map TTMDBShowSummary (from API) to TShowSummaryModel (for DB)
          const newShowSummary: TShowSummaryModel = {
            tmdbId: showApiData.id, // Map 'id' from API to 'tmdbId' for DB
            name: showApiData.name,
            original_name: showApiData.original_name,
            overview: showApiData.overview,
            poster_path: showApiData.poster_path,
            backdrop_path: showApiData.backdrop_path,
            first_air_date: showApiData.first_air_date,
            genre_ids: showApiData.genre_ids || [],
            popularity: showApiData.popularity,
            vote_average: showApiData.vote_average,
            vote_count: showApiData.vote_count,
            origin_country: showApiData.origin_country || [],
            original_language: showApiData.original_language
            // createdAt and updatedAt will be handled by timestamps: true in the schema
          }

          // 4. Save to MongoDB
          const savedShow = await ShowSummary.create(newShowSummary)
          savedShowSummaries.push({ tmdbId: savedShow.tmdbId, name: savedShow.name })
        } else {
          console.log(
            `Show Summary with TMDb ID ${showApiData.id} (${showApiData.name}) already exists. Skipping.`
          )
        }
      } catch (mapOrSaveError: any) {
        console.error(
          `Error processing Show Summary for ID ${showApiData.id}:`,
          mapOrSaveError.message
        )
        errorsEncountered.push({ tmdbId: showApiData.id, error: mapOrSaveError.message })
      }
    })

    await Promise.allSettled(promises) // Wait for all individual show operations to complete

    if (
      savedShowSummaries.length === 0 &&
      errorsEncountered.length === trendingShowsFromApi.length
    ) {
      // If all failed or all existed, and nothing new was saved
      res.status(200).json({
        message:
          'No new trending show summaries were saved or all failed. Check existing data or errors.',
        newlySavedCount: 0,
        errors: errorsEncountered
      })
    } else {
      res.status(200).json({
        message: 'Finished processing trending show summaries.',
        newlySavedCount: savedShowSummaries.length,
        newlySavedShows: savedShowSummaries,
        errors: errorsEncountered
      })
    }
  } catch (error: any) {
    console.error('Error in fetchAndSaveTrendingShows controller:', error.message)
    res.status(500).json({ error: error.message || 'Internal server error.' })
  }
}
