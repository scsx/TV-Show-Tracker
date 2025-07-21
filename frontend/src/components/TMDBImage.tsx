import React from 'react'
import { FiUserX } from 'react-icons/fi'
import { LuImageOff } from 'react-icons/lu'

import { twMerge } from 'tailwind-merge'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

type TMDBImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  path: string | null | undefined
  size:
    | 'w45'
    | 'w92'
    | 'w154'
    | 'w185'
    | 'w300'
    | 'w500'
    | 'w780'
    | 'h632'
    | 'original'
  alt?: string
  className?: string
  usage?: 'person' | 'poster'
  aspect?: '2/3' | 'square' | 'video'
}

const TMDBImage: React.FC<TMDBImageProps> = ({
  path,
  size,
  alt = '',
  className = '',
  usage = 'poster',
  aspect = '2/3',
  ...rest
}) => {
  const imageUrl = path ? `${TMDB_BASE_IMAGES_URL}/${size}${path}` : null
  let aspectRatioClass = ''
  if (aspect === '2/3') {
    aspectRatioClass = 'aspect-[2/3]'
  } else if (aspect === 'square') {
    aspectRatioClass = 'aspect-square'
  } else if (aspect === 'video') {
    aspectRatioClass = 'aspect-video'
  }

  if (!imageUrl) {
    const IconComponent = usage === 'person' ? FiUserX : LuImageOff
    const iconSizeClass = ['w45', 'w92', 'w154', 'w185'].includes(size)
      ? 'text-4xl'
      : 'text-[100px]'

    return (
      <div
        className={twMerge(
          'flex items-center justify-center bg-black/10',
          className,
          aspectRatioClass,
        )}
      >
        <IconComponent className={twMerge('text-white/10', iconSizeClass)} />
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={twMerge(className, aspectRatioClass, 'object-cover')}
      {...rest}
    />
  )
}

export default TMDBImage
