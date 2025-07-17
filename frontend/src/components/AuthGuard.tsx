import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

const AuthGuard = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-xl text-gray-500">
        Checking authentication status
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AuthGuard
