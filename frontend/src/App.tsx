import { Route, Routes } from 'react-router-dom'

import { AuthProvider } from '@/context/AuthContext'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'

import AuthGuard from '@/components/AuthGuard'
import Footer from '@/components/Footer'
import Header from '@/components/Header/Header'

import HomePage from './pages/HomePage'
import KitchenSink from './pages/KitchenSink'

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kitchen-sink" element={<KitchenSink />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<AuthGuard />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
