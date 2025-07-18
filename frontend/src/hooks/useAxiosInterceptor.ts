import { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export const useAxiosInterceptor = () => {
  const { token, logout, loading: authContextLoading } = useAuth()
  const [interceptorsReady, setInterceptorsReady] = useState(false)

  useEffect(() => {
    // Clear existing Axios interceptors to prevent duplicates and stale configurations.
    api.interceptors.request.clear()
    api.interceptors.response.clear()

    // Configure interceptors only when AuthContext has finished loading its state.
    if (!authContextLoading) {
      // Request interceptor: Add Authorization header if a token is present.
      api.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
          } else {
            delete config.headers.Authorization
          }
          return config
        },
        (error) => Promise.reject(error),
      )

      // Response interceptor: Handle 401 Unauthorized errors (e.g., expired token).
      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (
            error.response?.status === 401 &&
            error.config.url !== '/api/auth/login'
          ) {
            logout() // Log out the user on 401
          }
          return Promise.reject(error)
        },
      )

      setInterceptorsReady(true) // Signal that interceptors are configured.
    } else {
      setInterceptorsReady(false) // Interceptors are not ready while AuthContext loads.
    }

    // Cleanup function: Ensures interceptors are managed correctly on unmount/dependency change.
    return () => {} // No explicit ejects needed with api.interceptors.clear() in current Axios versions.
  }, [token, logout, authContextLoading])

  // Return readiness state for conditional rendering in parent components.
  return interceptorsReady
}
