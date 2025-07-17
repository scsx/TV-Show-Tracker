import { Route, Routes } from 'react-router-dom'

import Coverage from '@/pages/Coverage'
import Favorites from '@/pages/Favorites'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import Recommendations from '@/pages/Recommendations'
import Register from '@/pages/Register'
import Shows from '@/pages/Shows'
import Trending from '@/pages/Trending'

import AuthGuard from '@/components/AuthGuard'
import Footer from '@/components/Footer'
import Header from '@/components/Header/Header'
import { Toaster } from '@/components/ui/sonner'

import { useAxiosInterceptor } from '@/hooks/useAxiosInterceptor'
import { useSocketNotifications } from '@/hooks/useSocketNotifications'

import HomePage from './pages/HomePage'
import KitchenSink from './pages/KitchenSink'

const App = () => {
  useSocketNotifications()
  useAxiosInterceptor()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kitchen-sink" element={<KitchenSink />} />
          <Route path="/coverage" element={<Coverage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<AuthGuard />}>
            <Route path="/trending" element={<Trending />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/favorites" element={<Favorites />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* Notifications using https://ui.shadcn.com/docs/components/sonner */}
      <Toaster position="top-center" />
      <Footer />
    </div>
  )
}

export default App
