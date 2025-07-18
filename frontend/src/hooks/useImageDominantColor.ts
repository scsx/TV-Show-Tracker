import { useEffect, useState } from 'react'

import ColorThief from 'colorthief'

const colorThief = new ColorThief()

interface DominantColorResult {
  rgb: [number, number, number]
  isDark: boolean
  isLight: boolean
}

/**
 * Calculates the perceived luminance (Luma BT.709) of an RGB color.
 * @param rgb An array of [r, g, b] values.
 * @returns The luminance value.
 */
const getLuminance = (rgb: [number, number, number]): number => {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

/**
 * Extract a suitable background overlay color (preferably dark) from an image element.
 * @param imgElement The HTMLImageElement to extract color from.
 * @returns An object containing the RGB color array, and boolean flags for isDark/isLight, or null if not loaded/failed.
 */
export const useImageDominantColor = (
  imgElement: HTMLImageElement | null,
): DominantColorResult | null => {
  const [dominantColorResult, setDominantColorResult] =
    useState<DominantColorResult | null>(null)

  useEffect(() => {
    setDominantColorResult(null)

    // Helper function to process the image and extract/find color
    const processImage = (image: HTMLImageElement) => {
      try {
        const threshold = 128 // Luminance threshold for dark/light

        // 1. Try to get the dominant color
        const mainRgb = colorThief.getColor(image)
        const mainLuminance = getLuminance(mainRgb)

        if (mainLuminance < threshold) {
          // If dominant color is already dark enough, use it
          setDominantColorResult({
            rgb: mainRgb,
            isDark: true,
            isLight: false,
          })
          return
        }

        // 2. If dominant color is light, try to find a darker color in the palette
        const palette = colorThief.getPalette(image, 10) // Get up to 10 colors
        let foundDarkColor: [number, number, number] | null = null

        for (const rgb of palette) {
          const luminance = getLuminance(rgb as [number, number, number])
          if (luminance < threshold) {
            foundDarkColor = rgb as [number, number, number]
            break // Found a dark color, use it
          }
        }

        if (foundDarkColor) {
          setDominantColorResult({
            rgb: foundDarkColor,
            isDark: true,
            isLight: false,
          })
        } else {
          // 3. Fallback: If no dark color found in palette, use the main dominant color
          //    but classify it based on its actual luminance.
          setDominantColorResult({
            rgb: mainRgb,
            isDark: mainLuminance < threshold,
            isLight: mainLuminance >= threshold,
          })
        }
      } catch (e) {
        console.error('Failed to extract or find suitable color from image:', e)
        setDominantColorResult(null)
      }
    }

    if (imgElement && imgElement.complete && imgElement.naturalHeight !== 0) {
      // Image already loaded
      processImage(imgElement)
    } else if (imgElement) {
      // Image not yet loaded, set up listeners
      const handleLoad = () => processImage(imgElement)
      const handleError = () => {
        console.error(
          'Image failed to load for color extraction:',
          imgElement.src,
        )
        setDominantColorResult(null)
      }

      imgElement.addEventListener('load', handleLoad)
      imgElement.addEventListener('error', handleError)

      return () => {
        imgElement.removeEventListener('load', handleLoad)
        imgElement.removeEventListener('error', handleError)
      }
    }
  }, [imgElement]) // Dependency on the image element

  return dominantColorResult
}
