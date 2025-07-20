import React from 'react'

import { type TTMDBShow } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import { getYearFromDateString } from '@/lib/date'

type ShowHeroDetailsProps = {
  show: TTMDBShow
}

const ShowHeroDetails: React.FC<ShowHeroDetailsProps> = ({ show }) => {
  return (
    <div className="space-y-4">
      {show.first_air_date && (
        <div>
          <Text variant="paragraphL">Year</Text>
          <Text variant="h3">{getYearFromDateString(show.first_air_date)}</Text>
        </div>
      )}

      {show.created_by && show.created_by.length > 0 && (
        <div>
          <Text variant="paragraphL">
            {show.created_by.length > 1 ? 'Creators' : 'Creator'}{' '}
          </Text>
          {show.created_by.map((creator) => (
            <Text key={creator.id} variant="h3">
              <Hyperlink href={`/persons/${creator.id}`} variant="white">
                {creator.name}
              </Hyperlink>
            </Text>
          ))}
        </div>
      )}

      {show.genres && (
        <div>
          <Text variant="paragraphL">Genres</Text>
          <div className="flex flex-wrap gap-2 mt-2 justify-end">
            {show.genres.map((genre) => (
              <Badge variant="outline" key={genre.id} className="border-white">
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {show.vote_average !== undefined && show.vote_count !== undefined && (
        <div>
          <Text variant="paragraphL">Rating</Text>
          <Text variant="h4" className="font-normal">
            {show.vote_average.toFixed(1)}{' '}
            <small>({show.vote_count} votes)</small>
          </Text>
          <Progress
            className="mt-2"
            value={show.vote_average ? Math.round(show.vote_average * 10) : 0}
          />
        </div>
      )}
    </div>
  )
}

export default ShowHeroDetails
