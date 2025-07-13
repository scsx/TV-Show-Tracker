import { Nav } from '@/components/Header/Nav'
import Logo from '@/components/Logo'

const Header = () => {
  return (
    <header className="py-4 bg-muted">
      <div className="container flex">
        <div className="flex-1">
          <Logo large />
        </div>
        <Nav />
      </div>
    </header>
  )
}

export default Header
