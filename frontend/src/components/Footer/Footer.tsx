import { footerLinks } from '@/components/Footer/footer-navigation'
import Hyperlink from '@/components/Hyperlink'
import Logo from '@/components/Logo'
import Text from '@/components/Text'

import { getCurrentYear } from '@/lib/date'

const Footer = () => {
  const currentYear = getCurrentYear()
  return (
    <footer className="pt-8 pb-4 bg-darkblue">
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
