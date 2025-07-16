import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { Nav } from '@/components/Header/Nav'

// Mock the useAuth hook
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Mock the useNavigate hook
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Nav Component - Profile Menu Only', () => {
  const mockLogout = jest.fn()

  beforeEach(() => {
    // Reset mocks before each test
    ;(useAuth as jest.Mock).mockReturnValue({ logout: mockLogout })
    mockNavigate.mockClear()
    mockLogout.mockClear()
  })

  test('renders "Profile" dropdown label', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    // Check for the "Profile" label
    expect(screen.getByText('Profile')).toBeInTheDocument()
    // Initially, dropdown content should not be visible
    expect(
      screen.queryByText('Manage your account and favorites'),
    ).not.toBeVisible()
    expect(screen.queryByRole('link', { name: /account/i })).not.toBeVisible()
  })

  test('displays "Profile" dropdown content on hover', async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    const profileLabel = screen.getByText('Profile')
    fireEvent.mouseEnter(profileLabel) // Simulate hover

    expect(
      await screen.findByText('Manage your account and favorites'),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: /account/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /favorites/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /logout/i })).toBeVisible()
  })

  test('calls logout and navigates to login on "Logout" button click', async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )

    const profileLabel = screen.getByText('Profile')
    fireEvent.mouseEnter(profileLabel) // Show dropdown

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

    const accountLink = await screen.findByRole('link', { name: /account/i })
    expect(accountLink).toHaveAttribute('href', '/profile')

    const favoritesLink = await screen.findByRole('link', {
      name: /favorites/i,
    })
    expect(favoritesLink).toHaveAttribute('href', '/profile/favorites')
  })
})
