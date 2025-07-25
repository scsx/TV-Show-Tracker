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
import {
  isTTMDBFullShow,
  isTTMDBPersonCombinedCredit,
  mapFullShowToSummary,
} from '@/components/ShowCard/mapFullShowToSummary'
import TMDBImage from '@/components/TMDBImage'
import Text from '@/components/Text'
import ToggleFavorite from '@/components/ToggleFavorite'

import { getYearFromDateString } from '@/lib/date'

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
  // Define the base type for data to be displayed in the card.
  // This helps ensure consistent property access regardless of the 'show' prop's original type.
  let dataToDisplay: {
    id: number
    name: string
    poster_path: string | null
    first_air_date?: string
    vote_average?: number
    vote_count?: number
    overview?: string
    character?: string
  }

  // Handle case for person's TV credit
  if (isTTMDBPersonCombinedCredit(show) && show.media_type === 'tv') {
    dataToDisplay = {
      id: show.id,
      name: show.name || '',
      poster_path: show.poster_path || null,
      first_air_date: show.first_air_date || undefined,
      vote_average: show.vote_average,
      vote_count: show.vote_count,
      overview: show.overview || undefined,
      character: show.character,
    }
  }
  // Handle case for full TTMDBShow object
  else if (isTTMDBFullShow(show)) {
    const mappedShow = mapFullShowToSummary(show)
    dataToDisplay = {
      id: mappedShow.id,
      name: mappedShow.name,
      poster_path: mappedShow.poster_path,
      first_air_date: mappedShow.first_air_date,
      vote_average: mappedShow.vote_average,
      vote_count: mappedShow.vote_count,
      overview: mappedShow.overview,
    }
  }
  // Default case: assume it's already a TTMDBShowSummaryModel
  else {
    const summaryShow = show as TTMDBShowSummaryModel
    dataToDisplay = {
      id: summaryShow.id,
      name: summaryShow.name,
      poster_path: summaryShow.poster_path,
      first_air_date: summaryShow.first_air_date,
      vote_average: summaryShow.vote_average,
      vote_count: summaryShow.vote_count,
      overview: summaryShow.overview,
    }
  }

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

        {showAsHot && <GiFlame className='absolute right-2 top-16 p-1.5 rounded-full bg-primary text-red-600 text-4xl' />}

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
                <Text variant='small' className="u-clamp-2-lines">{dataToDisplay.overview}</Text>
              )
            )}
          </div>
          <div className="flex justify-between items-center pt-1">
            {dataToDisplay.vote_average !== undefined &&
              dataToDisplay.vote_count !== undefined && (
                <Text className="flex items-center" color='muted'>
                  <MdOutlineStarOutline className="mr-2 text-lg" />{' '}
                  {dataToDisplay.vote_average.toFixed(1)} (
                  {dataToDisplay.vote_count})
                </Text>
              )}
            {dataToDisplay.first_air_date && (
              <Text className="flex items-center" color='muted'>
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
