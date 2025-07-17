import { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { getTrendingShows } from '@/services/getTrendingShows'
import { type TShowSummaryModel } from '@/types'

import PageLayout from '@/components/PageLayout'

const Trending = () => {
  const { user } = useAuth()
  const [shows, setShows] = useState<TShowSummaryModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true) // Start loading state
        setError(null) // Clear any previous errors

        // Call the service function to fetch the shows
        const fetchedShows = await getTrendingShows()
        setShows(fetchedShows) // Update component state with fetched data
      } catch (err: any) {
        // Handle errors from the service
        console.error('Error in Trending component during fetch:', err)
        setError(
          err.message || 'An unexpected error occurred while fetching shows.',
        )
      } finally {
        setLoading(false) // Always set loading to false when done
      }
    }

    fetchShows() // Execute the fetch operation when the component mounts
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
        Loading trending shows...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-xl text-red-600">
        Error: {error}
      </div>
    )
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
      subtitle="Trending TV shows on TMDB for the past week"
    >
      <p className="text-center text-gray-600 mb-8">
        Hello, {user ? user.email : 'Guest'}! Here are the latest trending
        shows.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shows.map((show) => (
          <div
            key={show._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105"
          >
            {show.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                No Poster
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{show.name}</h2>
              <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                {show.overview}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  ⭐ {show.vote_average.toFixed(1)} ({show.vote_count})
                </span>
                <span>📅 {show.first_air_date?.split('-')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default Trending
