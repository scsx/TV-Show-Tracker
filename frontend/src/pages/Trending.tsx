import { useEffect, useState } from 'react'

import { getTrendingShows } from '@/services/getTrendingShows'
import { type TTMDBShowSummaryModel } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'
import TrendingPagination from '@/components/Trending/TrendingPagination'

const Trending = () => {
  const [allShows, setAllShows] = useState<TTMDBShowSummaryModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const ITEMS_PER_PAGE = 15

  // Fetch shows.
  useEffect(() => {
    const fetchAllShows = async () => {
      try {
        setLoading(true)
        setError(null)

        const fetchedShows = await getTrendingShows()
        setAllShows(fetchedShows)
      } catch (err: any) {
        console.error('Error in Trending component during fetch:', err)
        setError(
          err.message || 'An unexpected error occurred while fetching shows.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAllShows()
  }, [])

  // Pagination.
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const showsOnCurrentPage = allShows.slice(startIndex, endIndex)

  const totalPages = Math.ceil(allShows.length / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return <Loading type="skeleton" message="Loading trending shows" />
  }

  if (error) {
    return <ErrorDisplay error={error} title="Data Loading Issue" />
  }

  if (allShows.length === 0) {
    return (
      <Text className="flex-1 flex items-center justify-center">
        No trending shows found.
      </Text>
    )
  }

  return (
    <PageLayout title="Trending" subtitle="Trending on TMDB this week">
      <div className="grid grid-cols-5 gap-x-8 gap-y-12">
        {showsOnCurrentPage.map((show) => (
          <ShowCard key={show._id} show={show} showHeartAsFavorite={true} />
        ))}
      </div>

      <TrendingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </PageLayout>
  )
}

export default Trending
