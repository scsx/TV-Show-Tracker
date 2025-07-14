import { useAuth } from '@/context/AuthContext'

import { Nav } from '@/components/Header/Nav'
import Hyperlink from '@/components/Hyperlink'
import Logo from '@/components/Logo'

const Header = () => {
  const { isAuthenticated } = useAuth()

  return (
    <header className="py-4 bg-muted">
      <div className="container flex items-center">
        <div className="flex-1">
          <Logo large />
        </div>
        {isAuthenticated ? (
          <Nav />
        ) : (
          <div className="flex items-center space-x-4">
            <Hyperlink href="/login" variant="white">
              Login
            </Hyperlink>
            <Hyperlink href="/register" variant="white">
              Register
            </Hyperlink>{' '}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
