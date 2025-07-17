import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { TTMDBShowSummaryModel, TUser } from '@/types'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL

type AuthContextType = {
  // Auth & login
  user: TUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string, user: TUser) => void
  logout: () => void
  // Favorites
  favoriteShowTmdbIds: number[]
  fetchUserFavoriteTmdbIds: () => Promise<void>
  toggleFavorite: (show: TTMDBShowSummaryModel) => Promise<void>
  isFavorite: (tmdbId: number) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [favoriteShowTmdbIds, setFavoriteShowTmdbIds] = useState<number[]>([])

  // Fetch user's favorite TMDB IDs from the backend.
  const fetchUserFavoriteTmdbIds = useCallback(async () => {
    if (!user || !token || !user._id) {
      setFavoriteShowTmdbIds([]) // Clear favorites if no user
      return
    }

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/users/${user._id}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use stored token for auth
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setFavoriteShowTmdbIds(data.favoriteTmdbIds || []) // Backend now sends { favoriteTmdbIds: [...] }
      } else {
        setFavoriteShowTmdbIds([])
      }
    } catch (error) {
      setFavoriteShowTmdbIds([])
    }
  }, [user, token, BACKEND_BASE_URL])

  // Auth.
  // Initial user data from localStorage.
  useEffect(() => {
    const loadAuthData = () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const parsedUser: TUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          // If parsing fails, clear invalid data
          logout()
        }
      }
      setLoading(false)
    }

    loadAuthData()
  }, [])

  // useEffect for fetchUserFavoriteTmdbIds if valid user.
  useEffect(() => {
    if (isAuthenticated && user?._id && token) {
      fetchUserFavoriteTmdbIds()
    } else {
      setFavoriteShowTmdbIds([])
    }
  }, [isAuthenticated, user?._id, token, fetchUserFavoriteTmdbIds])

  // Toggle a show's favorite status
  const toggleFavorite = useCallback(
    async (show: TTMDBShowSummaryModel) => {
      if (!user || !token) {
        alert('You need to be logged in to favorite shows!')
        return
      }

      const { tmdbId } = show

      // Optimistic update.
      // Save state if error.
      const originalFavoriteShowTmdbIds = [...favoriteShowTmdbIds]
      setFavoriteShowTmdbIds((prevIds) => {
        if (prevIds.includes(tmdbId)) {
          return prevIds.filter((id) => id !== tmdbId)
        } else {
          return [...prevIds, tmdbId]
        }
      })

      try {
        const url = `${BACKEND_BASE_URL}/api/users/${user._id}/favorites/toggle`
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tmdbId }),
        })

        if (response.ok) {
          const data = await response.json()
          setFavoriteShowTmdbIds(data.favoriteTmdbIds || [])
        } else {
          // Revert if req fails
          setFavoriteShowTmdbIds(originalFavoriteShowTmdbIds)
          alert('Failed to update favorites. Please try again.')
        }
      } catch (error) {
        // Revert if error
        setFavoriteShowTmdbIds(originalFavoriteShowTmdbIds)
        alert('Network error. Failed to update favorites. Please try again.')
      }
    },
    [user, token, favoriteShowTmdbIds, BACKEND_BASE_URL],
  )

  // Check if a show is favorite
  const isFavorite = useCallback(
    (tmdbId: number): boolean => {
      return favoriteShowTmdbIds.includes(tmdbId)
    },
    [favoriteShowTmdbIds],
  )

  // Login function: stores token and user in state and localStorage.
  const login = useCallback((newToken: string, newUser: TUser) => {
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }, [])

  // Logout function: clears token and user from state and localStorage.
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setFavoriteShowTmdbIds([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  // useMemo for context value to prevent unnecessary re-renders
  const authContextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      favoriteShowTmdbIds,
      fetchUserFavoriteTmdbIds,
      toggleFavorite,
      isFavorite,
    }),
    [
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      favoriteShowTmdbIds,
      fetchUserFavoriteTmdbIds,
      toggleFavorite,
      isFavorite,
    ],
  )

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook.
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
