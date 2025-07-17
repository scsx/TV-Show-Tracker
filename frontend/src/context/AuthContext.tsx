import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { TUser } from '@/types'

type AuthContextType = {
  user: TUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string, user: TUser) => void
  logout: () => void
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

  const authContextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  }

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
