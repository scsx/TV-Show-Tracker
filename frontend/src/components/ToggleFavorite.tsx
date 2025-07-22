import React from 'react'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { IoMdClose } from 'react-icons/io'

import { useAuth } from '@/context/AuthContext'
import { twMerge } from 'tailwind-merge'

type ToggleFavoriteProps = {
  showId: number
  showHeartAsFavorite?: boolean
  className?: string
}

const ToggleFavorite: React.FC<ToggleFavoriteProps> = ({
  showId,
  showHeartAsFavorite = true,
  className,
}) => {
  const {
    isAuthenticated,
    isFavorite,
    toggleFavorite,
    loading: authLoading,
  } = useAuth()

  const isShowFavorite = isFavorite(showId)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (authLoading) return

    await toggleFavorite(showId)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={twMerge(
        'absolute top-2 right-2 p-2 bg-black/30 rounded-full text-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200',
        className,
      )}
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
