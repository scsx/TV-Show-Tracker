import React, { useRef } from 'react'

import { type TTMDBShow } from '@/types'

import { TMDB_BASE_IMAGES_URL } from '@/lib/constants'

import { useImageDominantColor } from '@/hooks/useImageDominantColor'

type ShowHeroProps = {
  show: TTMDBShow
}

const ShowHero: React.FC<ShowHeroProps> = ({ show }) => {
  const backdropImageSize = 'w1280'

  const backgroundImageUrl = show.backdrop_path
    ? `${TMDB_BASE_IMAGES_URL}/${backdropImageSize}${show.backdrop_path}`
    : show.poster_path
      ? `${TMDB_BASE_IMAGES_URL}/w780${show.poster_path}`
      : '/images/no-poster.png'

  // Create a ref for the hidden image element
  const imgRef = useRef<HTMLImageElement>(null)

  // Use the hook with the image element reference
  const dominantColorResult = useImageDominantColor(imgRef.current)

  // Determine the overlay color and text color based on dominant color
  const overlayColor = dominantColorResult
    ? `rgba(${dominantColorResult.rgb[0]}, ${dominantColorResult.rgb[1]}, ${dominantColorResult.rgb[2]}, 0.8)` // 80% opacity
    : 'rgba(0, 0, 0, 0.8)' // Default to semi-transparent black if color not available

  const textColorClass = dominantColorResult?.isDark
    ? 'text-white'
    : 'text-black'

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Hidden image element used for color extraction */}
      <img
        ref={imgRef}
        src={backgroundImageUrl} // Use the same URL as the background
        crossOrigin="anonymous" // IMPORTANT: Allows CORS access for Canvas
        alt=""
        style={{ display: 'none' }} // Hide it from the DOM
      />
      {/* Content that goes over the hero image (e.g., title, overview) */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
        style={{
          background: `linear-gradient(to top, ${overlayColor} 0%, transparent 100%)`,
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{show.name}</h1>
        <p className="text-lg md:text-xl max-w-2xl line-clamp-3">
          {show.overview}
        </p>
        {/* Add more details here if needed */}
      </div>
    </div>
  )
}

export default ShowHero
