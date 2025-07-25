import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { TUser } from '@/types'

import { usePushNotification } from '@/hooks/usePushNotification'

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
  favoriteShowids: number[]
  fetchUserFavoriteids: () => Promise<void>
  toggleFavorite: (showId: number) => Promise<void>
  isFavorite: (id: number) => boolean
  loginTime: number | null
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
  const [favoriteShowids, setFavoriteShowids] = useState<number[]>([])
  const [loginTime, setLoginTime] = useState<number | null>(null)
  const { showToast } = usePushNotification()

  // Fetch user's favorite TMDB IDs from the backend.
  const fetchUserFavoriteids = useCallback(async () => {
    if (!user || !token || !user._id) {
      setFavoriteShowids([]) // Clear favorites if no user
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
        setFavoriteShowids(data.favoriteids || []) // Backend now sends { favoriteids: [...] }
      } else {
        setFavoriteShowids([])
      }
    } catch (error) {
      setFavoriteShowids([])
    }
  }, [user, token, BACKEND_BASE_URL])

  // Auth.
  // Initial user data from localStorage.
  useEffect(() => {
    const loadAuthData = () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      const storedLoginTime = localStorage.getItem('loginTime')

      if (storedToken && storedUser) {
        try {
          const parsedUser: TUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          setIsAuthenticated(true)
          if (storedLoginTime) {
            setLoginTime(parseInt(storedLoginTime, 10))
          }
        } catch (error) {
          // If parsing fails, clear invalid data
          logout()
        }
      }
      setLoading(false)
    }

    loadAuthData()
  }, [])

  // useEffect for fetchUserFavoriteids if valid user.
  useEffect(() => {
    if (isAuthenticated && user?._id && token) {
      fetchUserFavoriteids()
    } else {
      setFavoriteShowids([])
    }
  }, [isAuthenticated, user?._id, token, fetchUserFavoriteids])

  // Toggle a show's favorite status
  const toggleFavorite = useCallback(
    async (showId: number) => {
      if (!user || !token) {
        alert('You need to be logged in to favorite shows!')
        return
      }

      // Feedback.
      const isCurrentlyFavorite = favoriteShowids.includes(showId)
      const optimisticMessageTitle = isCurrentlyFavorite
        ? 'Removed from favorites'
        : 'Added to favoritos'

      // Optimistic update.
      // Save state if error.
      const originalFavoriteShowids = [...favoriteShowids]
      setFavoriteShowids((prevIds) => {
        if (prevIds.includes(showId)) {
          return prevIds.filter((id) => id !== showId)
        } else {
          return [...prevIds, showId]
        }
      })

      showToast({
        title: optimisticMessageTitle,
        description: 'Confirm at Profile > Favorites',
      })

      try {
        const url = `${BACKEND_BASE_URL}/api/users/${user._id}/favorites/toggle`
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: showId }),
        })

        if (response.ok) {
          const data = await response.json()
          setFavoriteShowids(data.favoriteids || [])
        } else {
          // Revert if req fails
          setFavoriteShowids(originalFavoriteShowids)
          alert('Failed to update favorites. Please try again.')
        }
      } catch (error) {
        // Revert if error
        setFavoriteShowids(originalFavoriteShowids)
        alert('Network error. Failed to update favorites. Please try again.')
      }
    },
    [user, token, favoriteShowids, BACKEND_BASE_URL],
  )

  // Check if a show is favorite
  const isFavorite = useCallback(
    (id: number): boolean => {
      return favoriteShowids.includes(id)
    },
    [favoriteShowids],
  )

  // Login function: stores token and user in state and localStorage.
  const login = useCallback((newToken: string, newUser: TUser) => {
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
    const currentTime = Date.now()
    setLoginTime(currentTime)

    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('loginTime', currentTime.toString())
  }, [])

  // Logout function: clears token and user from state and localStorage.
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setFavoriteShowids([])
    setLoginTime(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')
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
      favoriteShowids,
      fetchUserFavoriteids,
      toggleFavorite,
      isFavorite,
      loginTime,
    }),
    [
      user,
      token,
      isAuthenticated,
      loading,
      login,
      logout,
      favoriteShowids,
      fetchUserFavoriteids,
      toggleFavorite,
      isFavorite,
      loginTime,
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
