import React, { useState } from 'react'

import { type TTMDBShow, type TTMDBShowSeason } from '@/types'

import SeasonDetail from '@/components/Season/SeasonDetail'
import Text from '@/components/Text'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

type SeasonsListProps = {
  show: TTMDBShow
}

const SeasonsList: React.FC<SeasonsListProps> = ({ show }) => {
  const [selectedSeason, setSelectedSeason] = useState<TTMDBShowSeason | null>(
    null,
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const mainSeasons = show.seasons.filter(
    (season) => season.season_number !== 0,
  )

  if (!mainSeasons || mainSeasons.length === 0) {
    return <Text>No main seasons available for this show.</Text>
  }

  const totalSeasons = show.number_of_seasons
  const totalEpisodes = show.number_of_episodes

  const handleSeasonClick = (season: TTMDBShowSeason) => {
    setSelectedSeason(season)
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setSelectedSeason(null)
  }

  return (
    <section className="mt-16">
      <Text variant="h2" as="h2" className="mb-2">
        Seasons
      </Text>
      {(totalSeasons > 0 || totalEpisodes > 0) && (
        <Text
          variant="paragraph"
          as="p"
          className="text-sm text-muted-foreground mb-4"
        >
          {totalSeasons} seasons / {totalEpisodes} episodes
        </Text>
      )}

      <div className="grid grid-cols-6 gap-8">
        {mainSeasons.map((season: TTMDBShowSeason) => {
          const posterUrl = season.poster_path
            ? `${TMDB_BASE_IMAGES_URL}/w185${season.poster_path}`
            : '/images/no-poster.png'

          const airDate = season.air_date
            ? new Date(season.air_date).getFullYear()
            : 'N/A'

          return (
            <article
              key={season.id}
              className="overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => handleSeasonClick(season)}
            >
              <img
                src={posterUrl}
                alt={season.name}
                className="w-full h-auto rounded-lg object-cover"
              />
              <div className="flex pt-2 flex-col flex-grow">
                <Text
                  variant="h5"
                  as="h5"
                  className="font-semibold mb-1 leading-tight"
                >
                  {season.name}
                </Text>
                <Text variant="paragraph" as="p" color="muted">
                  {airDate} / {season.episode_count} Episodes
                </Text>
                {season.overview && (
                  <Text variant="small" as="p" className="mt-2 line-clamp-2">
                    {season.overview}
                  </Text>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <SeasonDetail
        season={selectedSeason}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        seriesId={show.id}
      />
    </section>
  )
}

export default SeasonsList
