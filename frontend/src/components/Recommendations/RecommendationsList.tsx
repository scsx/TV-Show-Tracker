import React from 'react'

import { type TRecommendation, type TTMDBShowSummary } from '@/types'

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
    <div className="space-y-10">
      {recommendations.map((recGroup) => (
        <div
          key={recGroup.favoriteId}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Because you like "{recGroup.favoriteName}"
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recGroup.favoriteRecommended.map((show: TTMDBShowSummary) => (
              <div
                key={show.id}
                className="flex flex-col items-center text-center"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                  alt={show.name}
                  className="rounded-lg shadow-md mb-3 w-full max-w-[150px] aspect-[2/3] object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/200x300?text=No+Image'
                    e.currentTarget.alt = 'No image available'
                  }}
                />
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[40px]">
                  {show.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {show.first_air_date
                    ? show.first_air_date.split('-')[0]
                    : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecommendationsList
