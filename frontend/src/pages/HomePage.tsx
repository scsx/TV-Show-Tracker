import Mosaic from '@/components/Homepage/Mosaic'
import Text from '@/components/Text'

const HomePage = () => {
  return (
    <div className="container pt-32">
      <Text variant="h1" className="w-1/2">
        Track films you’ve watched. Save those you want to see. Tell your
        friends what’s good.
      </Text>
      <Mosaic />
      {/* <Text variant="h1" className="w-1/2 mt-6">
        James Gandolfini
      </Text>
      <Text variant="h1" className="w-1/2 mt-6 font-jakarta font-normal">
        Whereas recognition of the inherent dignity
      </Text>
      <Text>Whereas recognition of the inherent dignity</Text>{' '}
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md mt-6">
        Start
      </button> */}
    </div>
  )
}

export default HomePage
