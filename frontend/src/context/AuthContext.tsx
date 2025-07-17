import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { TShowSummaryModel, TUser } from '@/types'

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
  toggleFavorite: (show: TShowSummaryModel) => Promise<void>
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

  // Auth.
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
          console.log('Token and user loaded from localStorage.')
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error)
          // If parsing fails, clear invalid data
          logout()
        }
      }
      setLoading(false)
    }

    loadAuthData()
  }, [])

  // Fetch user's favorite TMDB IDs from the backend.
  const fetchUserFavoriteTmdbIds = useCallback(async () => {
    if (!user || !token || !user._id) {
      // Ensure user and token exist
      setFavoriteShowTmdbIds([]) // Clear favorites if no user
      return
    }

    try {
      const response = await fetch(`/api/users/${user._id}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use stored token for auth
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFavoriteShowTmdbIds(data.favoriteTmdbIds || []) // Backend now sends { favoriteTmdbIds: [...] }
      } else {
        console.error(
          'Failed to fetch user favorite TMDB IDs:',
          response.statusText,
        )
        setFavoriteShowTmdbIds([])
      }
    } catch (error) {
      console.error('Error fetching user favorite TMDB IDs:', error)
      setFavoriteShowTmdbIds([])
    }
  }, [user, token])

  // Toggle a show's favorite status
  const toggleFavorite = useCallback(
    async (show: TShowSummaryModel) => {
      if (!user || !token || !user._id) {
        alert('You need to be logged in to favorite shows!')
        return
      }

      const { tmdbId } = show // Get tmdbId from the show object

      // Optimistic UI update: immediately update frontend state
      setFavoriteShowTmdbIds((prevIds) => {
        if (prevIds.includes(tmdbId)) {
          return prevIds.filter((id) => id !== tmdbId) // Remove if already favorite
        } else {
          return [...prevIds, tmdbId] // Add if not favorite
        }
      })

      try {
        const response = await fetch(
          `/api/users/${user._id}/favorites/toggle`,
          {
            method: 'PATCH', // Use PATCH as defined in your backend route
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tmdbId }), // Send only the tmdbId to backend
          },
        )

        if (!response.ok) {
          console.error(
            'Failed to toggle favorite on backend:',
            response.statusText,
          )
          // Revert optimistic update if backend call fails
          setFavoriteShowTmdbIds((prevIds) => {
            if (prevIds.includes(tmdbId)) {
              return prevIds.filter((id) => id !== tmdbId)
            } else {
              return [...prevIds, tmdbId]
            }
          })
          alert('Failed to update favorites. Please try again.')
        }
        // If response is OK, state is already updated optimistically.
        // No need to fetch again unless you want to ensure perfect sync (might cause flicker).
      } catch (error) {
        console.error('Error toggling favorite:', error)
        // Revert optimistic update on network error
        setFavoriteShowTmdbIds((prevIds) => {
          if (prevIds.includes(tmdbId)) {
            return prevIds.filter((id) => id !== tmdbId)
          } else {
            return [...prevIds, tmdbId]
          }
        })
        alert('Network error. Failed to update favorites. Please try again.')
      }
    },
    [user, token],
  )

  // Check if a show is favorite
  const isFavorite = useCallback(
    (tmdbId: number): boolean => {
      return favoriteShowTmdbIds.includes(tmdbId)
    },
    [favoriteShowTmdbIds],
  )

  // Login function: stores token and user in state and localStorage.
  const login = (newToken: string, newUser: TUser) => {
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    console.log('User logged in. Token and user data saved to localStorage.')
  }

  // Logout function: clears token and user from state and localStorage.
  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

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
