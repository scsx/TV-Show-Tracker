import { useEffect } from 'react'

import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export const useAxiosInterceptor = () => {
  const { token, logout } = useAuth()

  useEffect(() => {
    // Add a request interceptor to inject the authorization token
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Add a response interceptor to handle unauthorized (401) responses
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // If response is 401 and it's not a token refresh attempt,
        // log the error and trigger logout
        if (
          error.response &&
          error.response.status === 401 &&
          error.config.url !== '/api/auth/refresh-token'
        ) {
          console.error(
            'Unauthorized access. Token might be expired or invalid.',
          )
          logout()
        }
        return Promise.reject(error)
      },
    )

    // Cleanup function: eject interceptors when the component unmounts
    // or when dependencies (token, logout) change, to prevent memory leaks
    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [token, logout])
}
