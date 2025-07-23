import React, { useMemo } from 'react'
import { GiFlame } from 'react-icons/gi'

import { type TRecommendation, type TTMDBShowSummary } from '@/types'

import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'

type RecommendationsListProps = {
  recommendations: TRecommendation[]
}

// Function to count duplicate recommendations (as a really good show suggestion).
// Only used here.
const countShowOccurrences = (
  recommendations: TRecommendation[],
): Map<number, number> => {
  const showCounts = new Map<number, number>()

  recommendations.forEach((recGroup) => {
    recGroup.favoriteRecommended.forEach((show) => {
      showCounts.set(show.id, (showCounts.get(show.id) || 0) + 1)
    })
  })

  return showCounts
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  const showOccurrences = useMemo(() => {
    return countShowOccurrences(recommendations)
  }, [recommendations])

  return (
    <section className="space-y-10">
      <Text className="flex items-center">
        <GiFlame className="p-1 rounded-full bg-primary text-red-600 text-2xl mr-2" />
        <span>Hot recommendation, based on multiple favorites.</span>
      </Text>
      {recommendations.map((recGroup) => (
        <div key={recGroup.favoriteId} className="mb-32">
          <Text
            variant="h3"
            as="h3"
            color="primary"
            className="mb-8 font-jakarta font-normal"
          >
            Related to{' '}
            <b>
              <i>{recGroup.favoriteName}</i>
            </b>
          </Text>
          <div className="grid grid-cols-6 gap-8">
            {recGroup.favoriteRecommended.map((show: TTMDBShowSummary) => {
              const isHotRecommendation = showOccurrences.get(show.id)! > 1

              return (
                <ShowCard
                  key={show.id}
                  show={show}
                  showHeartAsFavorite={true}
                  isPersonCredit={false}
                  showAsHot={isHotRecommendation}
                />
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

export default RecommendationsList
