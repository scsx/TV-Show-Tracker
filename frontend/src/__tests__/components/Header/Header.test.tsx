import { MemoryRouter } from 'react-router-dom'

import { AuthContext } from '@/context/AuthContext'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Header from '@/components/Header/Header'

const mockAuthContext = (isAuthenticated: boolean) => ({
  isAuthenticated: isAuthenticated,
  user: isAuthenticated
    ? { id: '123', username: 'testuser', email: 'test@example.com' }
    : null,
  login: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
  token: isAuthenticated ? 'mock-auth-token' : null,
})

describe('Header Component', () => {
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

  test('always renders the Logo', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext(false)}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>,
    )
    // Adjust "TV Show Tracker" to the actual text rendered by your Logo component
    expect(screen.getByText(/TV Show Tracker/i)).toBeInTheDocument()

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext(true)}>
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>,
    )
    // Adjust "TV Show Tracker" to the actual text rendered by your Logo component
    expect(screen.getByText(/TV Show Tracker/i)).toBeInTheDocument()
  })
})
