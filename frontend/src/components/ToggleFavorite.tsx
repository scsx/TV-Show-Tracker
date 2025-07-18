import React from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { IoMdClose } from 'react-icons/io'

import { useAuth } from '@/context/AuthContext'
import { type TTMDBShowSummaryModel } from '@/types'

type ToggleFavoriteProps = {
  show: TTMDBShowSummaryModel
  showHeartAsFavorite?: boolean
}

const ToggleFavorite: React.FC<ToggleFavoriteProps> = ({
  show,
  showHeartAsFavorite = true,
}) => {
  const {
    isAuthenticated,
    isFavorite,
    toggleFavorite,
    loading: authLoading,
  } = useAuth()

  const isShowFavorite = isFavorite(show.id)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (authLoading) return

    await toggleFavorite(show)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className="absolute top-2 right-2 p-2 bg-black bg-opacity-60 rounded-full text-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
      aria-label={isShowFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {showHeartAsFavorite ? (
        isShowFavorite ? (
          <GoHeartFill className="h-6 w-6 text-red-500 hover:text-white" />
        ) : (
          <GoHeart className="h-6 w-6" />
        )
      ) : (
        // showHeartAsFavorite = false shows a close icon (e.g. Favorites page)
        <IoMdClose className="h-6 w-6 text-white hover:text-red-500" />
      )}
    </button>
  )
}

export default ToggleFavorite
