import React from 'react'

import { type TTMDBPersonCombinedCredit } from '@/types'

import Text from '@/components/Text'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'
import { getYearFromDateString } from '@/lib/date'

interface PersonCreditCrewProps {
  crew: TTMDBPersonCombinedCredit[]
}

const PersonCreditCrew: React.FC<PersonCreditCrewProps> = ({ crew }) => {
  if (crew.length === 0) {
    return <Text as="p">No crew credits found.</Text>
  }

  // Group by id so that multiple jobs or departments for the same media are combined
  const groupedCredits = crew.reduce(
    (acc, credit) => {
      const mediaId = credit.id

      if (!acc[mediaId]) {
        acc[mediaId] = {
          credit: credit,
          jobs: new Set<string>(),
          departments: new Set<string>(),
          sortDate:
            credit.media_type === 'movie'
              ? credit.release_date
                ? new Date(credit.release_date).getTime()
                : 0
              : credit.first_air_date
                ? new Date(credit.first_air_date).getTime()
                : 0,
        }
      }
      if (credit.job) acc[mediaId].jobs.add(credit.job)
      if (credit.department) acc[mediaId].departments.add(credit.department)

      return acc
    },
    {} as Record<
      number,
      {
        credit: TTMDBPersonCombinedCredit
        jobs: Set<string>
        departments: Set<string>
        sortDate: number
      }
    >,
  )

  const sortedGroupedCredits = Object.values(groupedCredits).sort(
    (a, b) => b.sortDate - a.sortDate,
  )

  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-8">
      {sortedGroupedCredits.map((group) => (
        <article key={group.credit.id}>
          <img
            className="aspect-[2/3] rounded-sm"
            src={
              group.credit.poster_path
                ? `${TMDB_BASE_IMAGES_URL}/w185${group.credit.poster_path}`
                : '/images/no-poster.png'
            }
            alt={group.credit.title || group.credit.name || 'Poster'}
          />
          <div>
            <Text variant="h4" as="h4" className="leading-none mt-2 mb-4">
              {group.credit.title || group.credit.name}{' '}
              {(group.credit.release_date || group.credit.first_air_date) && (
                <small className="text-muted-foreground">
                  (
                  {getYearFromDateString(
                    group.credit.release_date || group.credit.first_air_date!,
                  )}
                  )
                </small>
              )}
            </Text>
            {group.jobs.size > 0 && (
              <Text className="mb-2">
                <b>Jobs: </b>
                {Array.from(group.jobs).join(', ')}
              </Text>
            )}
            {group.departments.size > 0 && (
              <Text className="mb-2">
                <b>Departments: </b>
                {Array.from(group.departments).join(', ')}
              </Text>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

export default React.memo(PersonCreditCrew)
