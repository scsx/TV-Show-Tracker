import Hyperlink from '@/components/Hyperlink'
import Logo from '@/components/Logo'
import Text from '@/components/Text'

const Footer = () => {
  return (
    <footer className="py-8 bg-darkblue">
      <div className="container flex">
        <div className="flex-1">
          <Logo />
          <Text variant="h6" className="-mt-1">
            TV Show Tracker
          </Text>
        </div>
        <Text>
          By{' '}
          <Hyperlink href="https://soucasaux.com" external>
            SCSX
          </Hyperlink>
          .{' '}
          <Hyperlink href="https://github.com/scsx/TV-Show-Tracker" external>
            Repo
          </Hyperlink>
          .
        </Text>
      </div>
    </footer>
  )
}

export default Footer
