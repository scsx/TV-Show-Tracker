import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import Coverage from '@/pages/Coverage'
import Favorites from '@/pages/Favorites'
import HomePage from '@/pages/HomePage'
import KitchenSink from '@/pages/KitchenSink'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import PersonPage from '@/pages/PersonPage'
import Persons from '@/pages/Persons'
import Profile from '@/pages/Profile'
import Recommendations from '@/pages/Recommendations'
import Register from '@/pages/Register'
import ShowPage from '@/pages/ShowPage'
import Shows from '@/pages/Shows'

import AuthGuard from '@/components/AuthGuard'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import Loading from '@/components/Loading'
import { Toaster } from '@/components/ui/sonner'

import { useAxiosInterceptor } from '@/hooks/useAxiosInterceptor'
import { useDynamicDocumentTitle } from '@/hooks/useDynamicDocumentTitle'
import { useSocketNotifications } from '@/hooks/useSocketNotifications'

// Lazy load the Trending component (heavy)
const Trending = React.lazy(() => import('@/pages/Trending'))

const App = () => {
  useSocketNotifications()
  // Initializes Axios interceptors and gets their readiness status.
  const interceptorsReady = useAxiosInterceptor()
  useDynamicDocumentTitle()

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
              {/* Suspense for trending only */}
              <Route
                path="/trending"
                element={
                  <Suspense
                    fallback={
                      <Loading
                        type="spinner"
                        message="Loading trending shows..."
                      />
                    }
                  >
                    <Trending />
                  </Suspense>
                }
              />
              <Route path="/shows" element={<Shows />} />
              <Route path="/shows/:id" element={<ShowPage />} />
              <Route path="/persons" element={<Persons />} />
              <Route path="/persons/:id" element={<PersonPage />} />
              <Route
                path="/profile/recommendations"
                element={<Recommendations />}
              />
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
