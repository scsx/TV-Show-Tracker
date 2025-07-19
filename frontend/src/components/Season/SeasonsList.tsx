import React from 'react'

// Certifique-se de que TTMDBShow está importado corretamente
import { type TTMDBShow, type TTMDBShowSeason } from '@/types'

// Importe TTMDBShow e TMDBSeason
import Text from '@/components/Text'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

interface SeasonsListProps {
  show: TTMDBShow // Agora recebe o objeto show completo
}

const SeasonsList: React.FC<SeasonsListProps> = ({ show }) => {
  // Acessa as temporadas através de show.seasons
  const mainSeasons = show.seasons.filter(
    (season) => season.season_number !== 0,
  )

  if (!mainSeasons || mainSeasons.length === 0) {
    return (
      <p className="mt-4 text-center text-gray-600">
        No main seasons available for this show.
      </p>
    )
  }

  // Você pode usar show.number_of_seasons e show.number_of_episodes aqui
  const totalSeasons = show.number_of_seasons
  const totalEpisodes = show.number_of_episodes

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

      <div className="grid grid-cols-8 gap-4">
        {mainSeasons.map((season: TTMDBShowSeason) => {
          const posterUrl = season.poster_path
            ? `${TMDB_BASE_IMAGES_URL}/w185${season.poster_path}`
            : '/images/no-poster.png'

          const airDate = season.air_date
            ? new Date(season.air_date).getFullYear()
            : 'N/A'

          return (
            <div
              key={season.id}
              className="bg-card-background rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:scale-105"
            >
              <img
                src={posterUrl}
                alt={season.name}
                className="w-full h-auto object-cover"
              />
              <div className="p-3 flex flex-col flex-grow">
                <Text
                  variant="h5"
                  as="h3"
                  className="font-semibold mb-1 leading-tight"
                >
                  {season.name}
                </Text>
                <Text
                  variant="paragraph"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  {season.episode_count} Episodes
                </Text>
                <Text
                  variant="paragraph"
                  as="p"
                  className="text-sm text-muted-foreground"
                >
                  {airDate}
                </Text>
                {season.overview && (
                  <Text
                    variant="paragraph"
                    as="p"
                    className="text-xs mt-2 text-foreground line-clamp-3"
                  >
                    {season.overview}
                  </Text>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SeasonsList
