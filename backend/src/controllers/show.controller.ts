import { Request, Response } from 'express'
import { showUpdaterTask } from '../services/showUpdater.service'
import ShowSummary from '../models/ShowSummary'

/**
 * @description Fetches trending TV shows from TMDb and saves them (summaries) to the database.
 * This is the manual trigger for the update process.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const fetchAndSaveTrendingShows = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Manual trigger: Initiating fetch and save of trending shows...')
    await showUpdaterTask()
    res
      .status(200)
      .json({ message: 'Finished processing trending show summaries via manual trigger.' })
  } catch (error: any) {
    console.error('Error in manual fetchAndSaveTrendingShows trigger:', error.message)
    res.status(500).json({ error: 'Failed to process trending show summaries.' })
  }
}

/**
 * @description Fetches all saved TV show summaries from the database.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const getAllShowSummaries = async (req: Request, res: Response): Promise<void> => {
  try {
    const showSummaries = await ShowSummary.find({})
    res.status(200).json({
      message: 'Successfully retrieved all show summaries from the database.',
      count: showSummaries.length,
      shows: showSummaries
    })
  } catch (error: any) {
    console.error('Error fetching all show summaries:', error.message)
    res.status(500).json({ error: 'Failed to retrieve show summaries.' })
  }
}
