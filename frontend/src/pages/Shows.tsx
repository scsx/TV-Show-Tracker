import PageLayout from '@/components/PageLayout'
import SearchShows from '@/components/Search/SearchShows'

const Shows = () => {
  return (
    <PageLayout
      title="Shows"
      subtitle="Find your next favorite series!"
      className="pb-32"
    >
      <SearchShows />
    </PageLayout>
  )
}

export default Shows
