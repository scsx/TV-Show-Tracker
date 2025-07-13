// TODO: Design, use.
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

const NotFound = () => {
  return (
    <PageLayout title="Not found">
      <Text variant="paragraph" className="text-[100px] font-bold">
        404
      </Text>
      <Text variant="paragraph">Something went wrong.</Text>
    </PageLayout>
  )
}

export default NotFound
