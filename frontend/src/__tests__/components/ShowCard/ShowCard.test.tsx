import React from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import ShowCard from '@/components/ShowCard/ShowCard'

jest.mock('@/components/Hyperlink', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a data-testid="hyperlink" href={href}>
      {children}
    </a>
  )
})

jest.mock('@/components/TMDBImage', () => {
  return ({
    path,
    size,
    alt,
    className,
  }: {
    path: string | null
    size: string
    alt: string
    className: string
  }) => (
    <img
      data-testid="tmdb-image"
      src={path ? `mock-image-url/${size}${path}` : 'placeholder.jpg'}
      alt={alt}
      className={className}
    />
  )
})

jest.mock('@/components/ToggleFavorite', () => {
  return ({
    showId,
    showHeartAsFavorite,
  }: {
    showId: number
    showHeartAsFavorite: boolean
  }) => (
    <div data-testid="toggle-favorite">
      {showHeartAsFavorite ? `Favorite Toggle for ID: ${showId}` : 'No Toggle'}
    </div>
  )
})

jest.mock('@/components/ShowCard/showCardDataUtils', () => ({
  normalizeShowData: jest.fn((show) => {
    return {
      id: show.id || 123,
      name: show.name || show.title || 'Mock Show',

      poster_path:
        show.poster_path === null
          ? null
          : show.poster_path || '/mock-poster.jpg',
      first_air_date: show.first_air_date || show.release_date || '2023-01-01',
      vote_average: show.vote_average || 7.5,
      vote_count: show.vote_count || 1000,
      overview: show.overview || 'Mock overview text.',
      character: (show as any).character || undefined,
    }
  }),
}))

jest.mock('@/lib/date', () => ({
  getYearFromDateString: jest.fn((dateString) =>
    dateString ? dateString.substring(0, 4) : undefined,
  ),
}))

const mockShowData = {
  id: 1,
  name: 'Test Show',
  original_name: 'Original Test Show Name',
  poster_path: '/test_poster.jpg',
  first_air_date: '2023-10-26',
  vote_average: 8.5,
  vote_count: 1500,
  overview: 'This is a test show overview.',
  genre_ids: [],
  origin_country: [],
  original_language: '',
  backdrop_path: '',
  popularity: 0,
}

describe('ShowCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders basic show information correctly', () => {
    render(<ShowCard show={mockShowData} />)

    const headingElement = screen.getByRole('heading', {})

    expect(headingElement).toHaveTextContent(/Test Show\s*\(?\s*2023\s*\)?/i)
    expect(screen.getByTestId('tmdb-image')).toHaveAttribute('alt', 'Test Show')
    expect(screen.getByTestId('hyperlink')).toHaveAttribute('href', '/shows/1')
    expect(
      screen.getByText('This is a test show overview.'),
    ).toBeInTheDocument()
  })

  test('displays vote average and count', () => {
    render(<ShowCard show={mockShowData} />)
    expect(screen.getByText('8.5 (1500)')).toBeInTheDocument()
  })

  test('displays release year', () => {
    render(<ShowCard show={mockShowData} />)
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('2023')).toHaveClass('flex items-center')
  })

  test('displays hot icon when showAsHot is true', () => {
    render(<ShowCard show={mockShowData} showAsHot={true} />)
    expect(screen.getByTestId('gi-flame-icon')).toBeInTheDocument()
  })

  test('does not display hot icon when showAsHot is false', () => {
    render(<ShowCard show={mockShowData} showAsHot={false} />)
    expect(screen.queryByTestId('gi-flame-icon')).not.toBeInTheDocument()
  })

  test('displays ToggleFavorite when showHeartAsFavorite is true', () => {
    render(<ShowCard show={mockShowData} showHeartAsFavorite={true} />)
    expect(screen.getByTestId('toggle-favorite')).toHaveTextContent(
      'Favorite Toggle for ID: 1',
    )
  })

  test('does not display ToggleFavorite when showHeartAsFavorite is false', () => {
    render(<ShowCard show={mockShowData} showHeartAsFavorite={false} />)
    expect(screen.getByTestId('toggle-favorite')).toHaveTextContent('No Toggle')
  })

  test('renders a placeholder image if poster_path is null', () => {
    const showWithoutPoster = { ...mockShowData, poster_path: null }
    render(<ShowCard show={showWithoutPoster} />)
    expect(screen.getByTestId('tmdb-image')).toHaveAttribute(
      'src',
      'placeholder.jpg',
    )
    expect(screen.getByTestId('tmdb-image')).toHaveAttribute('alt', 'Test Show')
  })
})
