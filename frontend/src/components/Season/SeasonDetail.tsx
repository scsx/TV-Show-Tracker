import React, { useCallback, useEffect, useState } from 'react'

import { getShowSeasonDetails } from '@/services/getShowSeasonDetails'
import { type TTMDBShowSeason, type TTMDBShowSeasonDetails } from '@/types'

import EpisodeList from '@/components/Season/EpisodeList'
import SeasonDetailError from '@/components/Season/SeasonDetailError'
import SeasonDetailLoading from '@/components/Season/SeasonDetailLoading'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { formatShortDate } from '@/lib/date'

type SeasonDetailsProps = {
  seriesId: number
  season: TTMDBShowSeason | null
  isOpen: boolean
  onClose: () => void
}

const SeasonDetails: React.FC<SeasonDetailsProps> = ({
  seriesId,
  season,
  isOpen,
  onClose,
}) => {
  const [fullSeasonDetails, setFullSeasonDetails] =
    useState<TTMDBShowSeasonDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Tracks the season number currently being displayed/fetched to prevent redundant API calls.
  const [currentSeasonNumber, setCurrentSeasonNumber] = useState<number | null>(
    null,
  )

  // Memoized function to fetch season details.
  const fetchSeasonDetails = useCallback(async () => {
    // Prevents fetch if no season/series ID or if the same season is already loaded/loading.
    if (!season || !seriesId || season.season_number === currentSeasonNumber) {
      return
    }

    setLoading(true)
    setError(null)
    setFullSeasonDetails(null) // Clear previous details before new fetch.
    setCurrentSeasonNumber(season.season_number) // Store the season being fetched.

    try {
      const data = await getShowSeasonDetails(seriesId, season.season_number)
      setFullSeasonDetails(data)
    } catch (err: any) {
      console.error('Failed to fetch season details:', err)
      setError(err.message || 'Failed to load season details.')
      setFullSeasonDetails(null)
    } finally {
      setLoading(false)
    }
  }, [seriesId, season, currentSeasonNumber])

  // Manages data fetching and state reset based on sheet visibility and selected season.
  useEffect(() => {
    if (isOpen && season) {
      fetchSeasonDetails()
    } else if (!isOpen) {
      // Reset states when the sheet closes.
      setFullSeasonDetails(null)
      setError(null)
      setLoading(false)
      setCurrentSeasonNumber(null)
    }
  }, [isOpen, season, fetchSeasonDetails])

  // Handles retry mechanism for fetching details after an error.
  const handleRefreshClick = () => {
    if (season) {
      setCurrentSeasonNumber(null) // Force re-fetch by clearing current season number.
      fetchSeasonDetails()
    }
  }

  // Prioritize full details if available, otherwise use initial season prop.
  const seasonToDisplay = fullSeasonDetails || season

  if (!isOpen) {
    return null // Render nothing if sheet is closed.
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-1/2 sm:max-w-1/2 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Text variant="h2" as="span">
              {seasonToDisplay?.name}
              {seasonToDisplay?.air_date && (
                <small className="pl-4 text-muted-foreground font-jakarta font-normal text-sm">
                  {formatShortDate(seasonToDisplay.air_date)}
                </small>
              )}
            </Text>
          </SheetTitle>

          {/* Conditionally renders loading, error, or content based on fetch status. */}
          {loading && !fullSeasonDetails ? (
            <SeasonDetailLoading onClose={onClose} />
          ) : error ? (
            <SeasonDetailError
              errorMessage={error}
              onRefresh={handleRefreshClick}
            />
          ) : (
            <>
              <div className="flex pt-8 space-x-8">
                <div className="w-1/3">
                  {/* Season poster with fallback. */}
                  <TMDBImage
                    path={fullSeasonDetails?.poster_path || season?.poster_path}
                    size="w300"
                    alt={fullSeasonDetails?.name || season?.name || ''}
                    className="w-full h-auto"
                    usage="poster"
                    aspect={
                      fullSeasonDetails?.poster_path || season?.poster_path
                        ? '2/3'
                        : 'square'
                    }
                  />
                </div>
                <div className="w-2/3">
                  {/* Season overview with fallback. */}
                  {fullSeasonDetails?.overview ? (
                    <Text variant="paragraphL">
                      {fullSeasonDetails.overview}
                    </Text>
                  ) : season?.overview ? (
                    <Text variant="paragraphL">{season.overview}</Text>
                  ) : (
                    <Text variant="paragraphL">
                      No overview available for this season.
                    </Text>
                  )}
                </div>
              </div>
              <div className="py-8">
                {/* Episodes list. */}
                {fullSeasonDetails?.episodes &&
                  fullSeasonDetails.episodes.length > 0 && (
                    <EpisodeList episodes={fullSeasonDetails.episodes} />
                  )}

                {/* Guest stars list. */}
                {fullSeasonDetails?.guest_stars &&
                  fullSeasonDetails.guest_stars.length > 0 && (
                    <div>
                      <Text variant="h3" as="h3">
                        Guest Stars
                      </Text>
                      <ul>
                        {fullSeasonDetails.guest_stars
                          .slice(0, 10)
                          .map((person) => (
                            <li key={person.credit_id}>
                              <span>{person.name}</span> (as {person.character})
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </div>
            </>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default SeasonDetails
