import { AuthProvider, useAuth } from '@/context/AuthContext'
import { type TUser } from '@/types'
import { act, renderHook } from '@testing-library/react'

import { usePushNotification } from '@/hooks/usePushNotification'

jest.mock('@/hooks/usePushNotification', () => ({
  usePushNotification: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}))

global.fetch = jest.fn()

const BACKEND_BASE_URL = 'http://localhost:5000'

describe('AuthContext', () => {
  let mockShowToast: jest.Mock
  const originalLocalStorage = global.localStorage

  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    mockShowToast = (usePushNotification as jest.Mock)().showToast
  })

  afterEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
    })
    ;(window.alert as jest.Mock).mockRestore()
  })

  test('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.loading).toBe(false)
    expect(result.current.favoriteShowids).toEqual([])
    expect(result.current.loginTime).toBeNull()
  })

  test('should handle login, set user/token, and store in localStorage', async () => {
    const mockUser: TUser = {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
      favoriteShowids: [],
    }
    const mockToken = 'mock-test-token'

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      result.current.login(mockToken, mockUser)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.loginTime).not.toBeNull()
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockUser),
    )
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'loginTime',
      expect.any(String),
    )
  })

  test('should handle logout, clear state, and remove from localStorage', async () => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'token') return 'existing-token'
          if (key === 'user')
            return JSON.stringify({ _id: '123', username: 'olduser' })
          if (key === 'loginTime') return '123456789'
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })

    const { result, rerender } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {})

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(expect.objectContaining({ _id: '123' }))

    await act(async () => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.favoriteShowids).toEqual([])
    expect(result.current.loginTime).toBeNull()
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    expect(localStorage.removeItem).toHaveBeenCalledWith('loginTime')
  })

  test('should load auth data from localStorage on initial render', async () => {
    const mockUser: TUser = {
      _id: '456',
      username: 'storeduser',
      email: 'stored@example.com',
      favoriteShowids: [],
    }
    const mockToken = 'stored-token-xyz'
    const mockLoginTime = '1678886400000'

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'token') return mockToken
          if (key === 'user') return JSON.stringify(mockUser)
          if (key === 'loginTime') return mockLoginTime
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {})

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.loginTime).toBe(parseInt(mockLoginTime, 10))
    expect(result.current.loading).toBe(false)
  })

  test('should handle invalid user data in localStorage and logout', async () => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'token') return 'some-token'
          if (key === 'user') return 'invalid json'
          if (key === 'loginTime') return '123456789'
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    await act(async () => {})

    expect(localStorage.getItem).toHaveBeenCalledWith('token')
    expect(localStorage.getItem).toHaveBeenCalledWith('user')

    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    expect(localStorage.removeItem).toHaveBeenCalledWith('loginTime')
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  test('should fetch user favorite IDs successfully', async () => {
    const mockUser: TUser = {
      _id: 'user42',
      username: 'favuser',
      email: 'fav@example.com',
      favoriteShowids: [],
    }
    const mockToken = 'fav-token'
    const mockFavorites = [100, 200, 300]

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'token') return mockToken
          if (key === 'user') return JSON.stringify(mockUser)
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favoriteids: mockFavorites }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {})

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_BASE_URL}/api/users/${mockUser._id}/favorites`,
      expect.objectContaining({
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
      }),
    )
    expect(result.current.favoriteShowids).toEqual(mockFavorites)
  })

  test('should handle error when fetching user favorite IDs', async () => {
    const mockUser: TUser = {
      _id: 'user43',
      username: 'erroruser',
      email: 'error@example.com',
      favoriteShowids: [],
    }
    const mockToken = 'error-token'

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'token') return mockToken
          if (key === 'user') return JSON.stringify(mockUser)
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {})

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(result.current.favoriteShowids).toEqual([])
  })

  test('isFavorite should return true if showId is in favoriteShowids', async () => {
    const mockUser: TUser = {
      _id: 'user50',
      username: 'testuser',
      email: 'test@example.com',
      favoriteShowids: [],
    }
    const mockToken = 'test-token'
    const initialFavorites = [10, 20, 30]

    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => {
          if (key === 'token') return mockToken
          if (key === 'user') return JSON.stringify(mockUser)
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favoriteids: initialFavorites }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {})

    expect(result.current.isFavorite(20)).toBe(true)
    expect(result.current.isFavorite(40)).toBe(false)
  })
})
