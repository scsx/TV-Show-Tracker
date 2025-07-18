import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const APP_BASE_TITLE = 'TV Show Tracker'

/**
 * Manages the document title dynamically based on the current route,
 * with an option to override it with a specific page title.
 */
export const useDynamicDocumentTitle = (pageTitle?: string | null) => {
  const location = useLocation()
  const [currentTitle, setCurrentTitle] = useState(APP_BASE_TITLE)

  useEffect(() => {
    if (pageTitle) {
      setCurrentTitle(`${pageTitle} | ${APP_BASE_TITLE}`)
      return
    }

    const pathSegments = location.pathname.split('/').filter(Boolean)
    let generatedTitle = APP_BASE_TITLE

    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      let formattedSegment = lastSegment
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      if (!/^\d+$/.test(formattedSegment)) {
        generatedTitle = `${formattedSegment} | ${APP_BASE_TITLE}`
      } else if (pathSegments.length > 1) {
        const parentSegment = pathSegments[pathSegments.length - 2]
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        generatedTitle = `${parentSegment} | ${APP_BASE_TITLE}`
      } else {
        generatedTitle = APP_BASE_TITLE
      }
    } else {
      generatedTitle = `Home | ${APP_BASE_TITLE}`
    }

    setCurrentTitle(generatedTitle)
  }, [pageTitle, location.pathname])

  useEffect(() => {
    document.title = currentTitle

    return () => {
      document.title = APP_BASE_TITLE
    }
  }, [currentTitle])
}
