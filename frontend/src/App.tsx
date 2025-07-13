import { Route, Routes } from 'react-router-dom'

import NotFound from '@/pages/NotFound'

import Footer from '@/components/Footer'
import Header from '@/components/Header/Header'

import HomePage from './pages/HomePage'
import KitchenSink from './pages/KitchenSink'

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kitchen-sink" element={<KitchenSink />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
