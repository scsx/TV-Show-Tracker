import React, { useCallback, useEffect, useState } from 'react'
import { MdErrorOutline } from 'react-icons/md'

import { getShowSeasonDetails } from '@/services/getShowSeasonDetails'
import { type TTMDBShowSeason, type TTMDBShowSeasonDetails } from '@/types'

import EpisodeList from '@/components/Season/EpisodeList'
import Text from '@/components/Text'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from '@/components/ui/sheet'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

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

  console.log(season)

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
        <SheetContent className="w-[33.33%] sm:max-w-[33.33%] flex items-center justify-center">
          <p>Loading season details...</p>
        </SheetContent>
      </Sheet>
    )
  }

  if (error || !seasonToDisplay) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[33.33%] sm:max-w-[33.33%] flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">
            <MdErrorOutline />
          </div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Season</h2>
          <pre className="mb-4 whitespace-pre-wrap">
            {error || 'Could not retrieve season information.'}
          </pre>
          <Text variant="paragraph">
            Please check your internet connection or try again.
          </Text>
          <button onClick={handleRefreshClick} className="mt-6">
            Try Again
          </button>
        </SheetContent>
      </Sheet>
    )
  }

  const posterUrl = seasonToDisplay.poster_path
    ? `${TMDB_BASE_IMAGES_URL}/w300${seasonToDisplay.poster_path}`
    : '/images/no-poster.png'

  const airDate = seasonToDisplay.air_date
    ? new Date(seasonToDisplay.air_date).toDateString()
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-1/2 sm:max-w-1/2 overflow-y-auto">
        <SheetHeader>
          <Text variant="h2" as="h2">
            {seasonToDisplay.name}
            <small className='pl-4 text-muted-foreground text-sm'>{airDate}</small>
          </Text>
          <SheetDescription>
            <div className="flex pt-8 space-x-8">
              <div className="w-1/3">
                <img
                  src={posterUrl}
                  alt={seasonToDisplay.name}
                  className="w-full h-auto"
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
          </SheetDescription>
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
