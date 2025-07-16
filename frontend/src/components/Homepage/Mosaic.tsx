import { useEffect, useRef, useState } from 'react'

import MosaicContent from '@/components/Homepage/MosaicContent'

import MosaicImageGrid from './MosaicImageGrid'

export type TGridImage = {
  id: string
  src: string
  row: number
  col: number
}

const Mosaic = () => {
  const [posterList, setPosterList] = useState<string[]>([])
  const [gridImages, setGridImages] = useState<TGridImage[]>([])

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

    const initialGridImages: TGridImage[] = []
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
  }, [posterList, gridImages])

  return (
    <div
      className="w-full grid"
      style={{
        height: 'calc(100vh - 70px)',
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
      }}
    >
      <MosaicImageGrid
        gridImages={gridImages}
        numRows={numRows}
        numCols={numCols}
      />
      <MosaicContent emptyCellCoordinates={emptyCellCoordinates} />
    </div>
  )
}

export default Mosaic
