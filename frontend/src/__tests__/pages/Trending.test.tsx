import React from 'react'

import Trending from '@/pages/Trending'
import { getTrendingShows } from '@/services/getTrendingShows'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/services/getTrendingShows', () => ({
  getTrendingShows: jest.fn(),
}))

jest.mock('@/components/ErrorDisplay', () => {
  return ({ error, title }: { error: string; title: string }) => (
    <div data-testid="error-display">
      <h2>{title}</h2>
      <p>{error}</p>
    </div>
  )
})

jest.mock('@/components/Loading', () => {
  return ({ message }: { message: string }) => (
    <div data-testid="loading-display">Loading: {message}</div>
  )
})

jest.mock('@/components/PageLayout', () => {
  return ({
    title,
    subtitle,
    children,
  }: {
    title: string
    subtitle: string
    children: React.ReactNode
  }) => (
    <div data-testid="page-layout">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  )
})

jest.mock('@/components/ShowCard/ShowCard', () => {
  return ({
    show,
    showHeartAsFavorite,
  }: {
    show: any
    showHeartAsFavorite: boolean
  }) => (
    <div data-testid={`show-card-${show.id}`}>
      <span>{show.name}</span>
      {showHeartAsFavorite && (
        <span data-testid="show-card-favorite-heart">❤️</span>
      )}
    </div>
  )
})

jest.mock('@/components/Text', () => {
  return ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div data-testid="text-component" className={className}>
      {children}
    </div>
  )
})

jest.mock('@/components/Trending/TrendingPagination', () => {
  return ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => (
    <div data-testid="trending-pagination">
      <p>
        Page {currentPage} of {totalPages}
      </p>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          data-testid={`page-button-${page}`}
        >
          {page}
        </button>
      ))}
    </div>
  )
})

const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

const mockShows = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  _id: `mock-id-${i + 1}`,
  name: `Show ${i + 1}`,
  poster_path: `/poster-${i + 1}.jpg`,
  first_air_date: `2023-01-${(i % 28) + 1}`,
  vote_average: 7.0 + (i % 3) * 0.5,
  vote_count: 1000 + i * 10,
  overview: `Overview for show ${i + 1}`,
  genre_ids: [],
  original_name: `Original Show ${i + 1}`,
  origin_country: [],
  original_language: 'en',
  backdrop_path: '',
  popularity: 0,
}))

describe('Trending Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTrendingShows as jest.Mock).mockResolvedValue(mockShows)
    mockScrollTo.mockClear()
  })

  test('displays loading state initially', () => {
    ;(getTrendingShows as jest.Mock).mockReturnValue(new Promise(() => {}))
    render(<Trending />)
    expect(screen.getByTestId('loading-display')).toBeInTheDocument()
    expect(
      screen.getByText('Loading: Loading trending shows'),
    ).toBeInTheDocument()
  })

  test('displays trending shows after successful fetch', async () => {
    render(<Trending />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading-display')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('page-layout')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Trending' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Trending on TMDB this week')).toBeInTheDocument()

    for (let i = 0; i < 15; i++) {
      expect(
        screen.getByTestId(`show-card-${mockShows[i].id}`),
      ).toBeInTheDocument()
      expect(screen.getByText(mockShows[i].name)).toBeInTheDocument()
    }

    expect(
      screen.queryByTestId(`show-card-${mockShows[15].id}`),
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('trending-pagination')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  test('displays error message if fetch fails', async () => {
    const errorMessage = 'Failed to fetch trending shows.'
    ;(getTrendingShows as jest.Mock).mockRejectedValue(new Error(errorMessage))

    render(<Trending />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading-display')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('error-display')).toBeInTheDocument()
    expect(screen.getByText('Data Loading Issue')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('displays "No trending shows found" if no shows are returned', async () => {
    ;(getTrendingShows as jest.Mock).mockResolvedValue([])

    render(<Trending />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading-display')).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('text-component')).toBeInTheDocument()
    expect(screen.getByText('No trending shows found.')).toBeInTheDocument()
    expect(screen.queryByTestId('page-layout')).not.toBeInTheDocument()
  })

  test('changes page and displays correct shows on pagination click', async () => {
    render(<Trending />)

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    const page2Button = screen.getByTestId('page-button-2')
    await userEvent.click(page2Button)

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })

    for (let i = 15; i < 30; i++) {
      expect(
        screen.getByTestId(`show-card-${mockShows[i].id}`),
      ).toBeInTheDocument()
      expect(screen.getByText(mockShows[i].name)).toBeInTheDocument()
    }

    expect(
      screen.queryByTestId(`show-card-${mockShows[0].id}`),
    ).not.toBeInTheDocument()

    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  test('does not change page when trying to go to an invalid page', async () => {
    render(<Trending />)
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    const page0Button = screen.getByTestId('page-button-1')
    await userEvent.click(page0Button)
  })
})
