import React from 'react'

import { type TTMDBPersonCombinedCredit } from '@/types'

import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'

import { getYearFromDateString } from '@/lib/date'

interface PersonCreditMoviesProps {
  movies: TTMDBPersonCombinedCredit[]
}

const PersonCreditMovies: React.FC<PersonCreditMoviesProps> = ({ movies }) => {
  if (movies.length === 0) {
    return (
      <Text variant="paragraphL" as="p">
        No movie credits found.
      </Text>
    )
  }

  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-8">
      {movies
        .sort((a, b) => {
          // Compare dates; use an early date if release_date is null
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0)
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0)

          return dateB.getTime() - dateA.getTime()
        })
        .map((credit) => (
          <article key={credit.credit_id}>
            <TMDBImage
              path={credit.poster_path}
              size="w185"
              alt={credit.title || 'Movie Poster'}
              className="aspect-[2/3] rounded-sm"
              usage="poster"
              aspect="2/3"
            />
            <div>
              <Text variant="h4" as="h4" className="leading-none my-2">
                {credit.title}{' '}
                {credit.release_date && (
                  <small className="text-muted-foreground">
                    ({getYearFromDateString(credit.release_date)})
                  </small>
                )}
              </Text>
              {credit.character && (
                <Text as="p" color="muted">
                  {credit.character}
                </Text>
              )}
            </div>
          </article>
        ))}
    </div>
  )
}

export default React.memo(PersonCreditMovies)
