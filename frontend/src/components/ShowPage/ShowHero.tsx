import React, { useRef } from 'react'

import { type TTMDBShow } from '@/types'

import ShowHeroDetails from '@/components/ShowPage/ShowHeroDetails'
import Text from '@/components/Text'
import ToggleFavorite from '@/components/ToggleFavorite'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

import { useImageDominantColor } from '@/hooks/useImageDominantColor'

type ShowHeroProps = {
  show: TTMDBShow
}

const ShowHero: React.FC<ShowHeroProps> = ({ show }) => {
  const backdropImageSize = 'w1280'
  const posterImageSize = 'w500'

  const backgroundImageUrl = show.backdrop_path
    ? `${TMDB_BASE_IMAGES_URL}/${backdropImageSize}${show.backdrop_path}`
    : show.poster_path
      ? `${TMDB_BASE_IMAGES_URL}/w780${show.poster_path}`
      : '/images/no-poster.png'

  const posterImageUrl = show.poster_path
    ? `${TMDB_BASE_IMAGES_URL}/${posterImageSize}${show.poster_path}`
    : '/images/no-poster.png'

  const imgRef = useRef<HTMLImageElement>(null)

  const dominantColorResult = useImageDominantColor(imgRef.current)

  const overlayColor = dominantColorResult
    ? `rgba(${dominantColorResult.rgb[0]}, ${dominantColorResult.rgb[1]}, ${dominantColorResult.rgb[2]}, 0.7)`
    : 'rgba(0, 0, 0, 0.8)'

  return (
    <div
      className="relative w-full min-h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        ref={imgRef}
        src={backgroundImageUrl}
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: overlayColor,
        }}
      >
        <div className="container flex space-x-16 items-end h-full pb-8">
          <div className="w-1/4 flex-shrink-0">
            <img
              src={posterImageUrl}
              alt={`${show.name} poster`}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-2/4 flex flex-col justify-end">
            <Text variant="h1" as="h1" className="mb-4">
              {show.name}
            </Text>
            {show.tagline && (
              <Text variant="quote" as="h2" className="mb-4">
                {show.tagline}
              </Text>
            )}
            <Text variant="paragraphL">{show.overview}</Text>
          </div>
          <div className="w-1/4 relative h-full flex flex-col justify-end text-right">
            <ToggleFavorite showId={show.id} className="top-12 bg-black/50" />
            <ShowHeroDetails show={show} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowHero
