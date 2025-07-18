import React from 'react'
import { IoCalendarClearOutline } from 'react-icons/io5'
import { MdOutlineStarOutline } from 'react-icons/md'

import { type TTMDBShow, type TTMDBShowSummaryModel } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import {
  isTTMDBFullShow,
  mapFullShowToSummary,
} from '@/components/ShowCard/mapFullShowToSummary'
import Text from '@/components/Text'
import ToggleFavorite from '@/components/ToggleFavorite'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'
import { getYearFromDateString } from '@/lib/date'

type ShowCardProps = {
  show: TTMDBShow | TTMDBShowSummaryModel
  showHeartAsFavorite?: boolean
}

const ShowCard: React.FC<ShowCardProps> = ({
  show,
  showHeartAsFavorite = true,
}) => {
  let showToDisplay: TTMDBShowSummaryModel
  if (isTTMDBFullShow(show)) {
    showToDisplay = mapFullShowToSummary(show)
  } else {
    showToDisplay = show
  }

  const imageSize = 'w500'
  const imageUrl = showToDisplay.poster_path
    ? `${TMDB_BASE_IMAGES_URL}/${imageSize}${showToDisplay.poster_path}`
    : '/images/no-poster.png'
  const releaseYear = getYearFromDateString(showToDisplay.first_air_date)

  return (
    <Hyperlink
      href={`/shows/${showToDisplay.id}`}
      variant="unstyled"
      className="group"
    >
      <div className="flex flex-col overflow-hidden transform transition duration-300 hover:scale-105">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={showToDisplay.name || 'Show Poster'}
            className="object-cover w-full h-full"
          />
        </div>

        <ToggleFavorite show={showToDisplay} showHeartAsFavorite={showHeartAsFavorite} />

        <div className="flex flex-col flex-grow pt-4">
          <div className="grow">
            <Text
              variant="h3"
              className="mb-2 leading-none transition-colors duration-300 group-hover:text-primary"
            >
              {showToDisplay.name}
            </Text>
            <Text className="truncate">{showToDisplay.overview}</Text>
          </div>
          <div className="flex justify-between items-center pt-4">
            {showToDisplay.vote_average !== undefined &&
              showToDisplay.vote_count !== undefined && (
                <Text className="flex items-center">
                  <MdOutlineStarOutline className="mr-2 text-lg" />{' '}
                  {showToDisplay.vote_average.toFixed(1)} (
                  {showToDisplay.vote_count})
                </Text>
              )}
            {showToDisplay.first_air_date && (
              <Text className="flex items-center">
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

export default ShowCard
