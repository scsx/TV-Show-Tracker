import Hyperlink from '@/components/Hyperlink'
import Logo from '@/components/Logo'
import Text from '@/components/Text'

import { getCurrentYear } from '@/lib/date'

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      {
        label: 'Profile',
        href: '/profile',
        external: false,
      },
      {
        label: 'Favorites',
        href: '/profile/favorites',
        external: false,
      },
      {
        label: 'Shows',
        href: '/shows',
        external: false,
      },
      {
        label: 'Breaking Bad',
        href: '/shows/1396',
        external: false,
      },
      {
        label: 'The Simpsons',
        href: '/shows/456',
        external: false,
      },
      // TODO: Keep or delete.
      /* {
        label: 'Login',
        href: '/login',
        external: false,
      },
      {
        label: 'Register',
        href: '/register',
        external: false,
      },
      {
        label: 'Logout',
        href: '/logout',
        external: false,
      }, */
    ],
  },
  {
    title: 'Dev Tools',
    links: [
      {
        label: 'Repo',
        href: 'https://github.com/scsx/TV-Show-Tracker',
        external: true,
      },
      {
        label: 'Backend status',
        href: 'http://localhost:5000',
        external: true,
      },
      { label: 'Kitchen Sink', href: '/kitchen-sink', external: false },
      { label: 'Coverage', href: '/coverage', external: false },
      { label: '404', href: '/not-found', external: false },
    ],
  },
  {
    title: 'The Movie Database',
    links: [
      {
        label: 'themoviedb.org',
        href: 'https://www.themoviedb.org',
        external: true,
      },
      {
        label: 'The Movie Database API',
        href: 'https://developer.themoviedb.org/docs/getting-started',
        external: true,
      },
    ],
  },
]

const Footer = () => {
  const currentYear = getCurrentYear()
  return (
    <footer className="py-4 bg-darkblue">
      <div className="container">
        <div className="flex">
          <div className="w-1/4">
            <Logo />
            <Text variant="h6" className="-mt-1 font-normal">
              TV Show Tracker
            </Text>
          </div>

          {footerLinks.map((col, colIndex) => (
            <div key={colIndex} className="w-1/4 mb-8">
              <Text variant="h5" className="mt-1 mb-4">
                {col.title}
              </Text>
              <div className="flex flex-col space-y-2">
                {col.links.map((link, linkIndex) => (
                  <Text key={linkIndex}>
                    <Hyperlink
                      variant="white"
                      href={link.href}
                      external={link.external}
                    >
                      {link.label}
                    </Hyperlink>
                  </Text>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex pt-4">
          <Text>
            &copy; {currentYear} by{' '}
            <Hyperlink variant="white" href="https://soucasaux.com" external>
              scsx
            </Hyperlink>
          </Text>
        </div>
      </div>
    </footer>
  )
}

export default Footer
