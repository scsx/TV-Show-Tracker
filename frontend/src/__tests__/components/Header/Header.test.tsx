import { MemoryRouter } from 'react-router-dom'

import { AuthContext } from '@/context/AuthContext'
import { type TUser } from '@/types'
import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'

import Header from '@/components/Header/Header'

type MockAuthContextType = {
  isAuthenticated: boolean
  user: TUser | null
  login: jest.Mock
  logout: jest.Mock
  loading: boolean
  token: string | null
  favoriteShowids: number[]
  fetchUserFavoriteids: jest.Mock
  toggleFavorite: jest.Mock
  isFavorite: jest.Mock
  loginTime: number | null
}

const mockAuthContext = (isAuthenticated: boolean): MockAuthContextType => ({
  isAuthenticated: isAuthenticated,
  user: isAuthenticated
    ? {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        favoriteShowids: [],
      }
    : null,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
  token: isAuthenticated ? 'mock-auth-token' : null,
  favoriteShowids: [],
  fetchUserFavoriteids: jest.fn(),
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn(),
  loginTime: null,
})

describe('Header Component', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders login and register links when not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext(false)}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  test('renders Nav component when authenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    expect(
      screen.queryByRole('link', { name: /login/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /register/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders the Logo when not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext(false)}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    expect(
      screen.getByText((content, element) => {
        const hasText = (node: Element) => node.textContent === 'TVST'
        const elementHasText =
          element?.tagName.toLowerCase() === 'p' && hasText(element)
        return elementHasText
      }),
    ).toBeInTheDocument()
  })

  test('renders the Logo when authenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    expect(
      screen.getByText((content, element) => {
        const hasText = (node: Element) => node.textContent === 'TVST'
        const elementHasText =
          element?.tagName.toLowerCase() === 'p' && hasText(element)
        return elementHasText
      }),
    ).toBeInTheDocument()
  })
})
