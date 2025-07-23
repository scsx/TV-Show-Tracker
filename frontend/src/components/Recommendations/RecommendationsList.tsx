import React from 'react'

import { type TRecommendation, type TTMDBShowSummary } from '@/types'

import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'

type RecommendationsListProps = {
  recommendations: TRecommendation[]
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return <p>No recommendations to display.</p>
  }

  return (
    <section className="space-y-10">
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
            {recGroup.favoriteRecommended.map((show: TTMDBShowSummary) => (
              <ShowCard
                key={show.id}
                show={show}
                showHeartAsFavorite={true}
                isPersonCredit={false}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default RecommendationsList
