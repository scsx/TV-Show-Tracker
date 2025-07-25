import React from 'react'
import { GiFlame } from 'react-icons/gi'
import { IoCalendarClearOutline } from 'react-icons/io5'
import { MdOutlineStarOutline } from 'react-icons/md'

import {
  type TTMDBPersonCombinedCredit,
  type TTMDBShow,
  type TTMDBShowSummaryModel,
} from '@/types'

import Hyperlink from '@/components/Hyperlink'
import { normalizeShowData } from '@/components/ShowCard/showCardDataUtils'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'
import ToggleFavorite from '@/components/ToggleFavorite'

import { getYearFromDateString } from '@/lib/date'

// Normalized type.
export type TShowCardDisplayData = {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string | undefined
  vote_average: number | undefined
  vote_count: number | undefined
  overview: string | undefined
  character: string | undefined
}

type ShowCardProps = {
  show: TTMDBShow | TTMDBShowSummaryModel | TTMDBPersonCombinedCredit
  showHeartAsFavorite?: boolean
  isPersonCredit?: boolean
  showAsHot?: boolean
}

const ShowCard: React.FC<ShowCardProps> = ({
  show,
  showHeartAsFavorite = true,
  isPersonCredit = false,
  showAsHot = false,
}) => {
  const dataToDisplay: TShowCardDisplayData = normalizeShowData(show)

  const imageSize = isPersonCredit ? 'w185' : 'w500'
  const releaseYear = getYearFromDateString(dataToDisplay.first_air_date)

  return (
    <Hyperlink
      href={`/shows/${dataToDisplay.id}`}
      variant="unstyled"
      className="block group"
    >
      <div className="flex flex-col h-full overflow-hidden transform transition duration-300 hover:scale-105">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <TMDBImage
            path={dataToDisplay.poster_path}
            size={imageSize}
            alt={dataToDisplay.name || 'Show Poster'}
            className="object-cover w-full h-full"
            usage="poster"
            aspect="2/3"
          />
        </div>

        <ToggleFavorite
          showId={dataToDisplay.id}
          showHeartAsFavorite={showHeartAsFavorite}
        />

        {showAsHot && (
          <GiFlame className="absolute right-2 top-16 p-1.5 rounded-full bg-primary text-red-600 text-4xl" />
        )}

        <div className="flex flex-col flex-grow pt-4">
          <div className="flex-grow">
            <Text
              variant={isPersonCredit ? 'h4' : 'h3'}
              className="mb-2 leading-none transition-colors duration-300 group-hover:text-primary"
            >
              {dataToDisplay.name}
              {releaseYear && <small> ({releaseYear})</small>}
            </Text>

            {/* Display character if it's a person credit, otherwise display overview */}
            {isPersonCredit && dataToDisplay.character ? (
              <Text color="muted" className="leading-tight">
                As: {dataToDisplay.character}
              </Text>
            ) : (
              dataToDisplay.overview && (
                <Text variant="small" className="u-clamp-2-lines">
                  {dataToDisplay.overview}
                </Text>
              )
            )}
          </div>
          <div className="flex justify-between items-center pt-1">
            {dataToDisplay.vote_average !== undefined &&
              dataToDisplay.vote_count !== undefined && (
                <Text className="flex items-center" color="muted">
                  <MdOutlineStarOutline className="mr-2 text-lg" />{' '}
                  {dataToDisplay.vote_average.toFixed(1)} (
                  {dataToDisplay.vote_count})
                </Text>
              )}
            {dataToDisplay.first_air_date && (
              <Text className="flex items-center" color="muted">
                <IoCalendarClearOutline className="mr-2 text-sm" />{' '}
                {releaseYear}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Hyperlink>
  )
}

export default React.memo(ShowCard)
