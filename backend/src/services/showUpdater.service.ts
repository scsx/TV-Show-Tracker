import { tmdbService } from './tmdb.service'
import ShowSummary from '../models/ShowSummary'
import { Server as SocketIOServer } from 'socket.io'

/**
 * @description Centralized function to fetch trending TV shows from TMDb and save/update them in the database.
 * This function handles both initial population and periodic updates (cron).
 */
export const showUpdaterTask = async (io?: SocketIOServer) => {
  console.log('--- TASK START: Fetching and saving trending shows... ---')
  try {
    const trendingData = await tmdbService.getTrendingTvShows('week', 1)
    const trendingShowsFromApi = trendingData.results

    if (!trendingShowsFromApi || trendingShowsFromApi.length === 0) {
      console.log('TASK: No trending shows found from TMDb. Skipping save.')
      return
    }

    let newlySavedCount = 0
    let updatedCount = 0
    let errorCount = 0

    for (const showApiData of trendingShowsFromApi) {
      try {
        const existingShow = await ShowSummary.findOne({ id: showApiData.id })

        const showSummaryData = {
          id: showApiData.id,
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
        }

        if (!existingShow) {
          await ShowSummary.create(showSummaryData)
          newlySavedCount++
        } else {
          await ShowSummary.updateOne({ id: showApiData.id }, { $set: showSummaryData })
          updatedCount++
        }
      } catch (saveError: any) {
        console.error(
          `TASK ERROR: Could not save/update show (ID: ${showApiData.id}, Name: ${showApiData.name}):`,
          saveError.message
        )
        errorCount++
      }
    }

    console.log(
      `--- TASK COMPLETE: Newly Saved: ${newlySavedCount}, Updated: ${updatedCount}, Errors: ${errorCount}. ---`
    )

    // Emit Socket.IO event after task.
    if (io) {
      const message = `Shows updated: ${newlySavedCount} new, ${updatedCount} updated.`
      io.emit('showsUpdated', { message, timestamp: new Date().toISOString() })
      console.log(`Socket.IO emitted 'showsUpdated' event: ${message}`)
    }
  } catch (error: any) {
    console.error('--- TASK FAILED: Error in updateShows ---', error.message)
  }
}
