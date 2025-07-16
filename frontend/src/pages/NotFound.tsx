// TODO: Design, use.
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

const NotFound = () => {
  return (
    <PageLayout title="Not found" className="pb-0" wide={false}>
      <div className="flex items-center">
        <div className="w-1/2">
          <Text variant="paragraph" className="text-[70px] font-bold">
            404
          </Text>

          <Text variant="quote">We have a situation here...</Text>
        </div>
        <div className="w-1/2">
          <img src="/images/upset-gandolfini.jpg" alt="404 - Not Found" />
        </div>
      </div>
    </PageLayout>
  )
}

export default NotFound
