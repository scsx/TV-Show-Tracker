import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { Nav } from '@/components/Header/Nav'

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Nav Component', () => {
  const mockLogout = jest.fn()

  beforeEach(() => {
    ;(useAuth as jest.Mock).mockReturnValue({ logout: mockLogout })
    mockNavigate.mockClear()
    mockLogout.mockClear()
  })

  test('renders "Trending", "Persons", "Shows" links', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /trending/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /persons/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /shows/i })).toBeInTheDocument()
  })

  test('renders "Profile" dropdown label and content is initially present but visually hidden by classes', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    expect(screen.getByText('Profile')).toBeInTheDocument()

    const introDescription = screen.getByText(
      'Manage your account, favorites and get recommendations',
    )
    expect(introDescription).toBeInTheDocument()

    const dropdownContentDiv = introDescription.closest('div.absolute')

    expect(dropdownContentDiv).toBeInTheDocument()
    expect(dropdownContentDiv).toHaveClass('opacity-0')
    expect(dropdownContentDiv).toHaveClass('invisible')
    expect(dropdownContentDiv).toHaveClass('scale-y-0')
  })

  test('calls logout and navigates to login on "Logout" button click', async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    const profileLabel = screen.getByText('Profile')
    fireEvent.mouseEnter(profileLabel)

    const logoutButton = await screen.findByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('Hyperlink components within "Profile" dropdown navigate correctly', async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    const profileLabel = screen.getByText('Profile')
    fireEvent.mouseEnter(profileLabel)

    const favoritesLink = await screen.findByRole('link', {
      name: /favorites/i,
    })
    expect(favoritesLink).toHaveAttribute('href', '/profile/favorites')

    const recommendationsLink = await screen.findByRole('link', {
      name: /recommendations/i,
    })
    expect(recommendationsLink).toHaveAttribute(
      'href',
      '/profile/recommendations',
    )
  })

  test('Profile dropdown label navigates to /profile via href', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    const profileLink = screen.getByRole('link', { name: /profile/i })
    expect(profileLink).toHaveAttribute('href', '/profile')
  })
})
