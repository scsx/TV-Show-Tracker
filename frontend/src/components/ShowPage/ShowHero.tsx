import React, { useEffect, useRef, useState } from 'react'

import { type TTMDBShow } from '@/types'
import { twMerge } from 'tailwind-merge'

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
  const heroRef = useRef<HTMLDivElement>(null)
  const [isHeroHidden, setIsHeroHidden] = useState(false)

  // Sticky header.
  useEffect(() => {
    if (!heroRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroHidden(entry.boundingClientRect.bottom <= 0)
      },
      {
        rootMargin: '0px 0px 0px 0px',
        threshold: 0,
      },
    )

    observer.observe(heroRef.current)

    return () => observer.disconnect()
  }, [])

  // Images and colors.
  const hasBackdrop = !!show.backdrop_path
  const hasPoster = !!show.poster_path

  const backgroundImageUrl = hasBackdrop
    ? `${TMDB_BASE_IMAGES_URL}/${backdropImageSize}${show.backdrop_path}`
    : hasPoster
      ? `${TMDB_BASE_IMAGES_URL}/w780${show.poster_path}`
      : ''

  const posterImageUrl = hasPoster
    ? `${TMDB_BASE_IMAGES_URL}/${posterImageSize}${show.poster_path}`
    : ''

  const imgRef = useRef<HTMLImageElement>(null)

  const dominantColorResult = useImageDominantColor(imgRef.current)

  const overlayColor = dominantColorResult
    ? `rgba(${dominantColorResult.rgb[0]}, ${dominantColorResult.rgb[1]}, ${dominantColorResult.rgb[2]}, 0.7)`
    : 'hsl(var(--darkblue))'

  return (
    <>
      <div
        className={twMerge(
          'fixed top-0 left-0 w-full backdrop-blur-sm z-20 transition-all duration-300 ease-in-out',
          'flex items-center justify-between h-[60px]',
          isHeroHidden
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none',
        )}
        style={{
          background: overlayColor,
        }}
      >
        <div className="container relative">
          <Text
            variant="h3"
            as="h2"
            className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(100%-100px)]"
          >
            {show.name}
          </Text>
          <ToggleFavorite
            showId={show.id}
            className="bg-black/50 top-0 right-0 -mt-1"
          />
        </div>
      </div>

      <div
        ref={heroRef}
        className="relative w-full min-h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url('${backgroundImageUrl}')`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {backgroundImageUrl && (
          <img
            ref={imgRef}
            src={backgroundImageUrl}
            crossOrigin="anonymous"
            style={{ display: 'none' }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: overlayColor,
          }}
        >
          <div className="container flex space-x-16 items-end h-full pb-8">
            {posterImageUrl && (
              <div className="w-1/4 flex-shrink-0">
                <img
                  src={posterImageUrl}
                  alt={`${show.name} poster`}
                  className="w-full h-auto rounded-lg shadow-lg aspect-[2/3]"
                />
              </div>
            )}
            <div
              className={twMerge(
                'flex flex-col justify-end',
                posterImageUrl ? 'w-2/4' : 'w-3/4',
              )}
            >
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
    </>
  )
}

export default ShowHero
