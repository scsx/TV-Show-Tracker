import Hyperlink from '@/components/Hyperlink'
import Logo from '@/components/Logo'
import Text from '@/components/Text'

import { getCurrentYear } from '@/lib/date'

const Footer = () => {
  const currentYear = getCurrentYear()
  return (
    <footer className="py-4 bg-darkblue">
      <div className="container">
        <div className="flex">
          <div className="w-1/4">
            <Logo />
            <Text variant="h6" className="-mt-1">
              TV Show Tracker
            </Text>
          </div>
          <div className="w-1/4">
            <Text variant="h5" className="mt-1 mb-2">
              Quick Links
            </Text>
            <Text>
              <Hyperlink
                variant="white"
                href="https://www.themoviedb.org"
                external
              >
                themoviedb.org
              </Hyperlink>
            </Text>
            <Text>
              <Hyperlink
                variant="white"
                href="https://developer.themoviedb.org/docs/getting-started"
                external
              >
                TMDB API
              </Hyperlink>
            </Text>
          </div>
          <div className="w-1/4">
            <Text variant="h5" className="mt-1 mb-2">
              The Movie Database
            </Text>
            <Text>
              <Hyperlink
                variant="white"
                href="https://www.themoviedb.org"
                external
              >
                themoviedb.org
              </Hyperlink>
            </Text>
            <Text>
              <Hyperlink
                variant="white"
                href="https://developer.themoviedb.org/docs/getting-started"
                external
              >
                TMDB API
              </Hyperlink>
            </Text>
          </div>
          <div className="w-1/4">
            <Text variant="h5" className="mt-1 mb-2">
              Dev Tools
            </Text>
            <Text>
              <Hyperlink
                variant="white"
                href="https://github.com/scsx/TV-Show-Tracker"
                external
              >
                Repo
              </Hyperlink>
            </Text>
          </div>
        </div>
        <div className="flex pt-16">
          <Text>
            &copy; {currentYear} by{' '}
            <Hyperlink variant="white" href="https://soucasaux.com" external>
              SCSX
            </Hyperlink>
          </Text>
        </div>
      </div>
    </footer>
  )
}

export default Footer
