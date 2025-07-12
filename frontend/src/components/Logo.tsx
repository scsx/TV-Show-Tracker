import { twMerge } from 'tailwind-merge'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

interface LogoProps {
  large?: boolean
}

const Logo = ({ large = false }: LogoProps) => {
  return (
    <Hyperlink href="/" className="group hover:no-underline">
      <Text className={twMerge('font-[900]', large ? 'text-3xl' : 'text-lg')}>
        <span className="text-primary group-hover:text-white">TV</span>
        <span className="text-secondary group-hover:text-white">S</span>
        <span className="group-hover:text-white">T</span>
      </Text>
    </Hyperlink>
  )
}

export default Logo
