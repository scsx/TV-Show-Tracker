import React from 'react'

import { type TTMDBPersonCombinedCredit } from '@/types'

import Text from '@/components/Text'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'
import { getYearFromDateString } from '@/lib/date'

interface PersonCreditMoviesProps {
  movies: TTMDBPersonCombinedCredit[]
}

const PersonCreditMovies: React.FC<PersonCreditMoviesProps> = ({ movies }) => {
  if (movies.length === 0) {
    return <Text as="p">No movie credits found.</Text>
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
            <img
              src={
                credit.poster_path
                  ? `${TMDB_BASE_IMAGES_URL}/w185${credit.poster_path}`
                  : '/images/no-poster.png'
              }
              className="aspect-[2/3] rounded-sm"
              alt={credit.title || 'Movie Poster'}
            />
            <div>
              <Text variant="h4" as="h4" className="leading-none my-2">
                {credit.title}{' '}
                {credit.release_date && ( 
                  <small className='text-muted-foreground'>({getYearFromDateString(credit.release_date)})</small>
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
