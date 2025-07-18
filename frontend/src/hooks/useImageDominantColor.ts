// src/hooks/useImageDominantColor.ts
import { useEffect, useState } from 'react'

import ColorThief from 'colorthief'

const colorThief = new ColorThief()

interface DominantColorResult {
  rgb: [number, number, number]
  isDark: boolean
  isLight: boolean
}

/**
 * Hook to extract the dominant color from an image element.
 * @param imgElement The HTMLImageElement to extract color from.
 * @returns An object containing the RGB color array, and boolean flags for isDark/isLight, or null if not loaded/failed.
 */
export const useImageDominantColor = (
  imgElement: HTMLImageElement | null,
): DominantColorResult | null => {
  const [dominantColorResult, setDominantColorResult] =
    useState<DominantColorResult | null>(null)

  useEffect(() => {
    setDominantColorResult(null) // Reset color when image element changes

    // Only proceed if the image element exists and is fully loaded
    if (imgElement && imgElement.complete && imgElement.naturalHeight !== 0) {
      try {
        const rgb = colorThief.getColor(imgElement)
        const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
        const threshold = 128 // Adjust as needed

        setDominantColorResult({
          rgb,
          isDark: luminance < threshold,
          isLight: luminance >= threshold,
        })
      } catch (e) {
        console.error('Failed to extract color from image:', e)
        setDominantColorResult(null)
      }
    } else if (imgElement) {
      // If image is not yet loaded, set up a listener
      const handleLoad = () => {
        try {
          const rgb = colorThief.getColor(imgElement)
          const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
          const threshold = 128

          setDominantColorResult({
            rgb,
            isDark: luminance < threshold,
            isLight: luminance >= threshold,
          })
        } catch (e) {
          console.error('Failed to extract color from loaded image:', e)
          setDominantColorResult(null)
        }
      }

      const handleError = () => {
        console.error(
          'Image failed to load for color extraction:',
          imgElement.src,
        )
        setDominantColorResult(null)
      }

      imgElement.addEventListener('load', handleLoad)
      imgElement.addEventListener('error', handleError)

      // Cleanup listeners
      return () => {
        imgElement.removeEventListener('load', handleLoad)
        imgElement.removeEventListener('error', handleError)
      }
    }
  }, [imgElement])

  return dominantColorResult
}
