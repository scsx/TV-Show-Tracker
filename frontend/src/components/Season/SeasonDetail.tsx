import React from 'react'

import { type TTMDBShowSeason } from '@/types'

import Text from '@/components/Text'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

interface SeasonDetailsProps {
  season: TTMDBShowSeason | null
  isOpen: boolean
  onClose: () => void
}

const SeasonDetails: React.FC<SeasonDetailsProps> = ({
  season,
  isOpen,
  onClose,
}) => {
  if (!season || !isOpen) {
    return null
  }

  const posterUrl = season.poster_path
    ? `${TMDB_BASE_IMAGES_URL}/w300${season.poster_path}`
    : '/images/no-poster.png'

  const airDate = season.air_date
    ? new Date(season.air_date).toDateString()
    : 'N/A'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[33.33%] sm:max-w-[33.33%]">
        <SheetHeader>
          <SheetTitle>{season.name}</SheetTitle>
          <SheetDescription>
            {season.episode_count} Episodes - Aired: {airDate}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <img
            src={posterUrl}
            alt={season.name}
            className="w-full h-auto rounded-lg mb-4 object-cover"
          />
          {season.overview ? (
            <Text variant="paragraph" as="p">
              {season.overview}
            </Text>
          ) : (
            <Text variant="paragraph" as="p" color="muted">
              No overview available for this season.
            </Text>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SeasonDetails
