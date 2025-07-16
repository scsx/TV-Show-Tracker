import { useEffect, useRef, useState } from 'react'

import Text from '@/components/Text'
import { Button } from '@/components/ui/button'

type GridImage = {
  id: string
  src: string
  row: number
  col: number
}

const Mosaic = () => {
  const [posterList, setPosterList] = useState<string[]>([])
  const [gridImages, setGridImages] = useState<GridImage[]>([])

  const numRows = 3
  const numCols = 9
  const emptyCellCoordinates = [
    { row: 2, col: 4 },
    { row: 2, col: 5 },
    { row: 2, col: 6 },
  ]

  const availableImagePositionsRef = useRef<{ row: number; col: number }[]>([])

  useEffect(() => {
    const fetchPosterList = async () => {
      try {
        const response = await fetch('/images/posters/posters.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: string[] = await response.json()
        setPosterList(data)
      } catch (error) {
        console.error('Failed to load poster list:', error)
      }
    }

    fetchPosterList()
  }, [])

  // Effect for initial grid generation
  useEffect(() => {
    if (posterList.length === 0) return

    const initialGridImages: GridImage[] = []
    const allPossiblePositions: { row: number; col: number }[] = []

    for (let r = 1; r <= numRows; r++) {
      for (let c = 1; c <= numCols; c++) {
        const isExcluded = emptyCellCoordinates.some(
          (coord) => coord.row === r && coord.col === c,
        )
        if (!isExcluded) {
          allPossiblePositions.push({ row: r, col: c })
        }
      }
    }

    // Shuffle available positions to fill initially
    for (let i = allPossiblePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allPossiblePositions[i], allPossiblePositions[j]] = [
        allPossiblePositions[j],
        allPossiblePositions[i],
      ]
    }

    // Store available positions for later rotation
    availableImagePositionsRef.current = allPossiblePositions

    // Make a copy of posterList to pick unique images from
    let tempPosterList = [...posterList]
    const numToFill = Math.min(
      allPossiblePositions.length,
      tempPosterList.length,
    )

    for (let i = 0; i < numToFill; i++) {
      const { row, col } = allPossiblePositions[i]

      // Pick a random image from the remaining tempPosterList
      const randomIndex = Math.floor(Math.random() * tempPosterList.length)
      const randomPosterName = tempPosterList[randomIndex]

      // Remove the chosen image from tempPosterList to avoid repetition
      tempPosterList.splice(randomIndex, 1)

      initialGridImages.push({
        id: `${row}-${col}`,
        src: randomPosterName,
        row: row,
        col: col,
      })
    }
    setGridImages(initialGridImages)
  }, [posterList])

  // Effect for single image rotation every second
  useEffect(() => {
    if (posterList.length === 0 || gridImages.length === 0) return

    const interval = setInterval(() => {
      // Get currently used image sources
      const currentImageSources = new Set(gridImages.map((img) => img.src))

      // Filter posterList to find sources not currently in use
      const unusedPosterSources = posterList.filter(
        (src) => !currentImageSources.has(src),
      )

      if (unusedPosterSources.length === 0) {
        const newRandomPosterName =
          posterList[Math.floor(Math.random() * posterList.length)]

        const randomIndexInGrid = Math.floor(Math.random() * gridImages.length)
        const cellToUpdate = gridImages[randomIndexInGrid]

        setGridImages((prevImages) => {
          return prevImages.map((img) =>
            img.id === cellToUpdate.id
              ? { ...img, src: newRandomPosterName }
              : img,
          )
        })
      } else {
        // Pick a random unused poster
        const newRandomPosterName =
          unusedPosterSources[
            Math.floor(Math.random() * unusedPosterSources.length)
          ]

        // Select a random occupied cell to change
        const randomIndexInGrid = Math.floor(Math.random() * gridImages.length)
        const cellToUpdate = gridImages[randomIndexInGrid]

        setGridImages((prevImages) => {
          return prevImages.map((img) =>
            img.id === cellToUpdate.id
              ? { ...img, src: newRandomPosterName }
              : img,
          )
        })
      }
    }, 1000) // Change one image every 1 second

    return () => clearInterval(interval)
  }, [posterList, gridImages]) // Depend on gridImages so the interval updates correctly

  return (
    <div
      className="w-full grid"
      style={{
        height: 'calc(100vh - 70px)',
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
      }}
    >
      {gridImages.length > 0 ? (
        gridImages.map((image) => (
          <img
            key={image.id}
            src={`/images/posters/${image.src}`}
            alt="TV Show Poster"
            className="w-full h-full object-cover"
            style={{
              gridRow: `${image.row} / span 1`,
              gridColumn: `${image.col} / span 1`,
            }}
          />
        ))
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 col-span-full row-span-full">
          Loading posters...
        </div>
      )}

      <div
        className="flex flex-col items-center justify-center p-4 bg-black bg-opacity-70 text-white z-10"
        style={{
          gridRow: `${emptyCellCoordinates[0].row} / span 1`,
          gridColumn: `${emptyCellCoordinates[0].col} / span ${emptyCellCoordinates.length}`,
          pointerEvents: 'auto',
        }}
      >
        <Text
          variant="h2"
          as="h2"
          className="text-center text-5xl font-bold mb-4"
        >
          Discover Your Next Obsession!
        </Text>
        <Text variant="paragraph" className="text-center text-lg">
          Start exploring series and managing your watchlists.
        </Text>
        <a className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary font-bold text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8">TODO: Button</a>
      </div>
    </div>
  )
}

export default Mosaic
