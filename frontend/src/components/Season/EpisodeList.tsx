import React from 'react'

import { type TTMDBEpisode } from '@/types'

import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'

import { formatShortDate } from '@/lib/date'

type EpisodeListProps = {
  episodes: TTMDBEpisode[]
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  return (
    <div className="mt-4">
      <Text variant="h3" as="h3" className="mb-4">
        Episodes{' '}
        <small className="font-jakarta text-muted-foreground">
          ({episodes.length})
        </small>
      </Text>
      {episodes.map((episode) => (
        <div key={episode.id} className="flex space-x-8 mb-8">
          {episode.still_path && (
            <div className="w-1/2">
              <TMDBImage
                path={episode.still_path}
                size="w300"
                alt={`Still from ${episode.name}`}
                className="w-full h-auto rounded-md object-cover aspect-video"
                usage="poster"
                aspect="video"
              />
            </div>
          )}
          <div className="w-1/2">
            <Text variant="h4" as="h4" className="leading-none mb-2">
              <small className="font-jakarta text-muted-foreground mr-2">
                Ep. {episode.episode_number}
              </small>{' '}
              {episode.name}
            </Text>
            <Text color="muted" className="text-sm mb-2">
              {episode.air_date ? formatShortDate(episode.air_date) : 'N/A'}
              {episode.runtime ? ` / Runtime: ${episode.runtime} mins` : ''}
            </Text>
            {episode.overview && episode.overview.length > 0 ? (
              <Text>{episode.overview}</Text>
            ) : (
              <Text>No overview available for this episode.</Text>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EpisodeList
