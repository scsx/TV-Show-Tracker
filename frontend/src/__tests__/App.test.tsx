import { MemoryRouter } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import { useAxiosInterceptor } from '@/hooks/useAxiosInterceptor'
import { useDynamicDocumentTitle } from '@/hooks/useDynamicDocumentTitle'
import { useSocketNotifications } from '@/hooks/useSocketNotifications'

import App from '../App'

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))
jest.mock('@/hooks/useAxiosInterceptor', () => ({
  useAxiosInterceptor: jest.fn(),
}))
jest.mock('@/hooks/useDynamicDocumentTitle', () => ({
  useDynamicDocumentTitle: jest.fn(),
}))
jest.mock('@/hooks/useSocketNotifications', () => ({
  useSocketNotifications: jest.fn(),
}))

jest.mock('@/components/Loading', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div>Mock Loading: {message}</div>
  ),
}))
jest.mock('@/components/Header/Header', () => ({
  __esModule: true,
  default: () => <div>Mock Header</div>,
}))
jest.mock('@/components/Footer/Footer', () => ({
  __esModule: true,
  default: () => <div>Mock Footer</div>,
}))
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div>Mock Toaster</div>,
}))

jest.mock('@/components/AuthGuard', () => {
  const { Outlet } = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    default: () => <Outlet />,
  }
})

jest.mock('@/pages/Coverage', () => ({
  __esModule: true,
  default: () => <div>Coverage Page</div>,
}))
jest.mock('@/pages/Favorites', () => ({
  __esModule: true,
  default: () => <div>Favorites Page</div>,
}))
jest.mock('@/pages/HomePage', () => ({
  __esModule: true,
  default: () => <div>Home Page</div>,
}))
jest.mock('@/pages/KitchenSink', () => ({
  __esModule: true,
  default: () => <div>Kitchen Sink Page</div>,
}))
jest.mock('@/pages/Login', () => ({
  __esModule: true,
  default: () => <div>Login Page</div>,
}))
jest.mock('@/pages/NotFound', () => ({
  __esModule: true,
  default: () => <div>Not Found Page</div>,
}))
jest.mock('@/pages/PersonPage', () => ({
  __esModule: true,
  default: () => <div>Person Page</div>,
}))
jest.mock('@/pages/Persons', () => ({
  __esModule: true,
  default: () => <div>Persons Page</div>,
}))
jest.mock('@/pages/Profile', () => ({
  __esModule: true,
  default: () => <div>Profile Page</div>,
}))
jest.mock('@/pages/Recommendations', () => ({
  __esModule: true,
  default: () => <div>Recommendations Page</div>,
}))
jest.mock('@/pages/Register', () => ({
  __esModule: true,
  default: () => <div>Register Page</div>,
}))
jest.mock('@/pages/ShowPage', () => ({
  __esModule: true,
  default: () => <div>Show Page</div>,
}))
jest.mock('@/pages/Shows', () => ({
  __esModule: true,
  default: () => <div>Shows Page</div>,
}))
jest.mock('@/pages/Trending', () => ({
  __esModule: true,
  default: () => <div>Trending Page</div>,
}))

describe('App Component', () => {
  const mockUseAuth = useAuth as jest.Mock
  const mockUseAxiosInterceptor = useAxiosInterceptor as jest.Mock
  const mockUseDynamicDocumentTitle = useDynamicDocumentTitle as jest.Mock
  const mockUseSocketNotifications = useSocketNotifications as jest.Mock

  beforeEach(() => {
    mockUseDynamicDocumentTitle.mockClear()
    mockUseSocketNotifications.mockClear()
    mockUseAuth.mockClear()
    mockUseAxiosInterceptor.mockClear()

    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    mockUseAxiosInterceptor.mockReturnValue(true)
  })

  test('renders Header, Footer, and Toaster', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock Footer')).toBeInTheDocument()
    expect(screen.getByText('Mock Toaster')).toBeInTheDocument()
  })

  test('calls global hooks on render', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(mockUseSocketNotifications).toHaveBeenCalledTimes(1)
    expect(mockUseAxiosInterceptor).toHaveBeenCalledTimes(1)
    expect(mockUseDynamicDocumentTitle).toHaveBeenCalledTimes(1)
    expect(mockUseAuth).toHaveBeenCalledTimes(1)
  })

  test('displays Loading component when auth is loading', () => {
    mockUseAuth.mockReturnValue({ loading: true, isAuthenticated: false })

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByText('Mock Loading: Loading content...'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument()
  })

  test('displays Loading component when interceptors are not ready', () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: false })
    mockUseAxiosInterceptor.mockReturnValue(false)

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByText('Mock Loading: Loading content...'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument()
  })

  test('renders main routes when auth and interceptors are ready', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Home Page')).toBeInTheDocument()
    expect(
      screen.queryByText('Mock Loading: Loading content...'),
    ).not.toBeInTheDocument()
  })

  test('renders Login page correctly', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: false })
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  test('renders Register page correctly', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: false })
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Register Page')).toBeInTheDocument()
    })
  })

  test('renders Kitchen Sink page correctly', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/kitchen-sink']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Kitchen Sink Page')).toBeInTheDocument()
    })
  })

  test('renders Coverage page correctly', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/coverage']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Coverage Page')).toBeInTheDocument()
    })
  })

  test('renders Profile page correctly with AuthGuard', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Profile Page')).toBeInTheDocument()
    })
  })

  test('renders Favorites page correctly with AuthGuard', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/profile/favorites']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Favorites Page')).toBeInTheDocument()
    })
  })

  test('renders Shows page correctly with AuthGuard', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/shows']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Shows Page')).toBeInTheDocument()
    })
  })

  test('renders Trending page correctly with AuthGuard', async () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/trending']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Trending Page')).toBeInTheDocument()
    })
  })

  test('renders NotFound page for unmatched routes', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Not Found Page')).toBeInTheDocument()
  })
})
