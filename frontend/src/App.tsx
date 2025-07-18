import { Route, Routes } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import Coverage from '@/pages/Coverage'
import Favorites from '@/pages/Favorites'
import HomePage from '@/pages/HomePage'
import KitchenSink from '@/pages/KitchenSink'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import Recommendations from '@/pages/Recommendations'
import Register from '@/pages/Register'
import ShowPage from '@/pages/ShowPage'
import Shows from '@/pages/Shows'
import Trending from '@/pages/Trending'

import AuthGuard from '@/components/AuthGuard'
import Footer from '@/components/Footer'
import Header from '@/components/Header/Header'
import Loading from '@/components/Loading'
import { Toaster } from '@/components/ui/sonner'

import { useAxiosInterceptor } from '@/hooks/useAxiosInterceptor'
import { useSocketNotifications } from '@/hooks/useSocketNotifications'

const App = () => {
  useSocketNotifications()
  // Initializes Axios interceptors and gets their readiness status.
  const interceptorsReady = useAxiosInterceptor()

  // Authentication loading state from AuthContext.
  const { loading: authLoading } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        {/* Displays a loading spinner in the main content area
            until both the authentication context and Axios interceptors
            are fully initialized and ready. */}
        {authLoading || !interceptorsReady ? (
          <Loading type="spinner" message="Loading content..." />
        ) : (
          // Renders the main application routes once auth and interceptors are ready.
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/kitchen-sink" element={<KitchenSink />} />
            <Route path="/coverage" element={<Coverage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/trending" element={<Trending />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/shows/:id" element={<ShowPage />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/favorites" element={<Favorites />} />
            </Route>

            {/* Unmatched paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
      <Toaster position="top-center" />
      <Footer />
    </div>
  )
}

export default App
