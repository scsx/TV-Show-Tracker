import Logo from '@/components/Logo'

const Header = () => {
  return (
    <header className="py-4 bg-muted">
      <div className="container flex">
        <Logo large />
      </div>
    </header>
  )
}

export default Header
