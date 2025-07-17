import { useEffect, useState } from 'react'

import { getTrendingShows } from '@/services/getTrendingShows'
import { type TShowSummaryModel } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import ShowCard from '@/components/ShowCard'

const Trending = () => {
  const [shows, setShows] = useState<TShowSummaryModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true)
        setError(null)

        const fetchedShows = await getTrendingShows()
        console.log(fetchedShows[0])
        setShows(fetchedShows)
      } catch (err: any) {
        console.error('Error in Trending component during fetch:', err)
        setError(
          err.message || 'An unexpected error occurred while fetching shows.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [])

  if (loading) {
    return <Loading type="skeleton" message="Loading trending shows" />
  }

  if (error) {
    return <ErrorDisplay error={error} title="Data Loading Issue" />
  }

  if (shows.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
        No trending shows found.
      </div>
    )
  }

  return (
    <PageLayout
      title="Trending"
      subtitle="Trending on TMDB this week"
    >
      <div className="grid grid-cols-5 gap-8">
        {shows.map((show) => (
          <ShowCard key={show._id} show={show} displayDetails={true} />
        ))}
      </div>
    </PageLayout>
  )
}

export default Trending
