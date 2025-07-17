import React from 'react'
import { FaHeart } from 'react-icons/fa'
import { IoCalendarClearOutline } from 'react-icons/io5'
import { MdOutlineStarOutline } from 'react-icons/md'

import { useAuth } from '@/context/AuthContext'
import { type TShowSummaryModel } from '@/types'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { getYearFromDateString } from '@/lib/date'

type ShowCardProps = {
  show: TShowSummaryModel
  displayDetails?: boolean
}

const ShowCard: React.FC<ShowCardProps> = ({ show, displayDetails = true }) => {
  const {
    isAuthenticated,
    isFavorite,
    toggleFavorite,
    loading: authLoading,
  } = useAuth()
  const imageUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster'
  const releaseYear = getYearFromDateString(show.first_air_date)

  const isShowFavorite = isFavorite(show.tmdbId)

  // Handle click on the favorite icon
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigating to the show detail page
    e.stopPropagation() // Stop event propagation to avoid triggering parent clicks

    // Do nothing if auth context is still loading
    if (authLoading) return

    await toggleFavorite(show)
  }

  console.log(isShowFavorite)

  return (
    <Hyperlink
      href={`/shows/${show.tmdbId}`}
      variant="unstyled"
      className="group"
    >
      <div className="flex flex-col overflow-hidden transform transition duration-300 hover:scale-105">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={show.name || 'Show Poster'}
            className="object-cover w-full h-full"
          />
        </div>

        {isAuthenticated && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-60 rounded-full text-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
            aria-label={
              isShowFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            {isShowFavorite ? (
              <FaHeart className="h-6 w-6 text-red-500" />
            ) : (
              <FaHeart className="h-6 w-6" />
            )}
          </button>
        )}

        {displayDetails && (
          <div className="flex flex-col flex-grow pt-4">
            <div className="grow">
              <Text
                variant="h3"
                className="mb-2 leading-none transition-colors duration-300 group-hover:text-primary"
              >
                {show.name}
              </Text>
              <Text className="truncate">{show.overview}</Text>
            </div>
            <div className="flex justify-between items-center pt-4">
              {show.vote_average !== undefined &&
                show.vote_count !== undefined && (
                  <Text className="flex items-center">
                    <MdOutlineStarOutline className="mr-2 text-lg" />{' '}
                    {show.vote_average.toFixed(1)} ({show.vote_count})
                  </Text>
                )}
              {show.first_air_date && (
                <Text className="flex items-center">
                  <IoCalendarClearOutline className="mr-2 text-sm" />{' '}
                  {releaseYear}
                </Text>
              )}
            </div>
          </div>
        )}
      </div>
    </Hyperlink>
  )
}

export default ShowCard
