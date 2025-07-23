import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// When navigating between pages the scroll starts at the top.
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null // Has no visible render
}

export default ScrollToTop
