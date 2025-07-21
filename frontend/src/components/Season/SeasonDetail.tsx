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
  const [refreshTrigger, setRefreshTrigger] = useState(0) // State to force refresh

  const fetchSeasonDetails = useCallback(async () => {
    if (!season || !seriesId) {
      setError('Series ID or Season data is missing.')
      setFullSeasonDetails(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getShowSeasonDetails(seriesId, season.season_number)
      setFullSeasonDetails(data)
    } catch (err: any) {
      console.error('Failed to fetch season details:', err)
      setError(
        err.message || 'Failed to load season details. Please try again.',
      )
      setFullSeasonDetails(null)
    } finally {
      setLoading(false)
    }
  }, [seriesId, season])

  useEffect(() => {
    const shouldFetch =
      isOpen &&
      season &&
      seriesId &&
      (!fullSeasonDetails || fullSeasonDetails.id !== season.id)

    if (shouldFetch) {
      fetchSeasonDetails()
    } else if (!isOpen) {
      setFullSeasonDetails(null)
      setError(null)
      setRefreshTrigger(0) // Reset trigger when sheet closes
    }
  }, [
    isOpen,
    season,
    seriesId,
    fullSeasonDetails,
    refreshTrigger,
    fetchSeasonDetails,
  ])

  const handleRefreshClick = () => {
    setRefreshTrigger((prev) => prev + 1)
    setError(null)
    setFullSeasonDetails(null)
  }

  const seasonToDisplay = fullSeasonDetails || season

  if (!isOpen) {
    return null
  }

  if (loading && !fullSeasonDetails) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SeasonDetailLoading onClose={onClose} />
      </Sheet>
    )
  }

  if (error || !seasonToDisplay) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SeasonDetailError
          errorMessage={error}
          onRefresh={handleRefreshClick}
        />
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-1/2 sm:max-w-1/2 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Text variant="h2" as="span">
              {seasonToDisplay.name}
              {seasonToDisplay.air_date && (
                <small className="pl-4 text-muted-foreground font-jakarta font-normal text-sm">
                  {formatShortDate(seasonToDisplay.air_date)}
                </small>
              )}
            </Text>
          </SheetTitle>

          <div className="flex pt-8 space-x-8">
            <div className="w-1/3">
              <TMDBImage
                path={seasonToDisplay.poster_path}
                size="w300"
                alt={seasonToDisplay.name}
                className="w-full h-auto"
                usage="poster"
                aspect={seasonToDisplay.poster_path ? '2/3' : 'square'}
              />
            </div>
            <div className="w-2/3">
              {seasonToDisplay.overview ? (
                <Text variant="paragraphL">{seasonToDisplay.overview}</Text>
              ) : (
                <Text variant="paragraphL">
                  No overview available for this season.
                </Text>
              )}
            </div>
          </div>
        </SheetHeader>
        <div className="py-8">
          {fullSeasonDetails?.episodes &&
            fullSeasonDetails.episodes.length > 0 && (
              <EpisodeList episodes={fullSeasonDetails?.episodes} />
            )}

          {fullSeasonDetails?.guest_stars &&
            fullSeasonDetails.guest_stars.length > 0 && (
              <div>
                <Text variant="h3" as="h3">
                  Guest Stars
                </Text>
                <ul>
                  {fullSeasonDetails.guest_stars.slice(0, 10).map((person) => (
                    <li key={person.credit_id}>
                      <span>{person.name}</span> (as {person.character})
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SeasonDetails
