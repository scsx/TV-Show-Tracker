import React from 'react'

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import Mosaic from '@/components/Homepage/Mosaic'

jest.mock('@/components/Homepage/MosaicContent', () => {
  return ({
    emptyCellCoordinates,
  }: {
    emptyCellCoordinates: { row: number; col: number }[]
  }) => (
    <div data-testid="mosaic-content">
      Mosaic Content at{' '}
      {emptyCellCoordinates.map((c) => `(${c.row},${c.col})`).join(', ')}
    </div>
  )
})

jest.mock('@/components/Homepage/MosaicImageGrid', () => {
  return ({
    gridImages,
    numRows,
    numCols,
  }: {
    gridImages: any[]
    numRows: number
    numCols: number
  }) => (
    <div data-testid="mosaic-image-grid">
      Grid ({numRows}x{numCols}) with {gridImages.length} images.
      {gridImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt={`Image ${img.id}`}
          data-testid={`grid-image-${img.id}`}
        />
      ))}
    </div>
  )
})

const mockFetch = jest.fn()
global.fetch = mockFetch

const mockMathRandom = jest.spyOn(Math, 'random')

const spySetInterval = jest.spyOn(global, 'setInterval')
const spyClearInterval = jest.spyOn(global, 'clearInterval')

describe('Mosaic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    spySetInterval.mockClear()
    spyClearInterval.mockClear()

    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          'p1.jpg',
          'p2.jpg',
          'p3.jpg',
          'p4.jpg',
          'p5.jpg',
          'p6.jpg',
          'p7.jpg',
          'p8.jpg',
          'p9.jpg',
          'p10.jpg',
          'p11.jpg',
          'p12.jpg',
          'p13.jpg',
          'p14.jpg',
          'p15.jpg',
          'p16.jpg',
          'p17.jpg',
          'p18.jpg',
          'p19.jpg',
          'p20.jpg',
          'p21.jpg',
          'p22.jpg',
          'p23.jpg',
          'p24.jpg',
        ]),
    })

    mockMathRandom.mockClear()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    mockMathRandom.mockRestore()
  })

  test('fetches poster list on mount', async () => {
    render(<Mosaic />)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith('/images/posters/posters.json')
  })

  test('generates initial grid correctly with unique images and correct positions', async () => {
    const availablePositionsCount = 24

    for (let i = 0; i < availablePositionsCount; i++) {
      mockMathRandom.mockReturnValueOnce(0.0)
    }
    for (let i = 0; i < availablePositionsCount; i++) {
      mockMathRandom.mockReturnValueOnce(0.0)
    }

    render(<Mosaic />)

    await waitFor(() => {
      expect(screen.getByTestId('mosaic-image-grid')).toBeInTheDocument()
      expect(screen.getByTestId('mosaic-content')).toBeInTheDocument()

      expect(screen.getAllByTestId(/grid-image-/)).toHaveLength(24)
    })

    const images = screen.getAllByTestId(/grid-image-/)
    expect(images).toHaveLength(24)

    const renderedImageSrcs = images.map((img) => img.getAttribute('src'))
    const uniqueRenderedImageSrcs = new Set(renderedImageSrcs)
    expect(uniqueRenderedImageSrcs.size).toBe(24)

    expect(screen.getByTestId('mosaic-content')).toHaveTextContent(
      'Mosaic Content at (2,4), (2,5), (2,6)',
    )
  })

  test('renders MosaicContent with correct emptyCellCoordinates', async () => {
    render(<Mosaic />)
    await waitFor(() => {
      expect(screen.getAllByTestId(/grid-image-/)).toHaveLength(24)
      expect(screen.getByTestId('mosaic-content')).toBeInTheDocument()
    })
    expect(screen.getByTestId('mosaic-content')).toHaveTextContent(
      'Mosaic Content at (2,4), (2,5), (2,6)',
    )
  })

  test('renders MosaicImageGrid with correct props', async () => {
    render(<Mosaic />)
    await waitFor(() => {
      const grid = screen.getByTestId('mosaic-image-grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveTextContent('Grid (3x9) with 24 images.')

      expect(screen.getAllByTestId(/grid-image-/)).toHaveLength(24)
    })
  })
})
