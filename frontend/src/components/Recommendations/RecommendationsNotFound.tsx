import Hyperlink from '@/components/Hyperlink'
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

const RecommendationsNotFound = () => {
  return (
    <PageLayout title="Recommendations" className="pb-0">
      <div className="flex items-center">
        <div className="w-1/2">
          <Text as="h2" variant="h2">
            No recommendations yet!
          </Text>

          <Text className="my-8">
            Start by adding some TV shows to your favorites to get personalized
            suggestions.
          </Text>
          <Hyperlink variant="btnYellow" href="/trending">
            Find trending shows
          </Hyperlink>
        </div>
        <div className="w-1/2">
          <img
            src="/images/upset-gandolfini.jpg"
            alt="404 - Not Found"
            className="h-[400px]"
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default RecommendationsNotFound
