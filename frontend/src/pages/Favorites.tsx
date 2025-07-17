// TODO: CLEAN, COMPLETE
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { getFavorites } from '@/services/getFavorites'
import { type TTMDBShow } from '@/types/index'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import ShowCard from '@/components/ShowCard/ShowCard'

const Favorites: React.FC = () => {
  const { user, token, favoriteShowTmdbIds } = useAuth()
  const [favoriteShowsDetails, setFavoriteShowsDetails] = useState<TTMDBShow[]>(
    [],
  )
  const [loadingDetails, setLoadingDetails] = useState<boolean>(true)
  const [errorFetchingDetails, setErrorFetchingDetails] = useState<
    string | null
  >(null)

  useEffect(() => {
    const fetchAllFavoriteDetails = async () => {
      // If no user, token, or favorite IDs, we don't need to fetch
      if (!user || !token || favoriteShowTmdbIds.length === 0) {
        setFavoriteShowsDetails([]) // Clear any previous details
        setLoadingDetails(false)
        return
      }

      setLoadingDetails(true)
      setErrorFetchingDetails(null)

      try {
        // Call the getFavorites service function
        const fetchedShows = await getFavorites(favoriteShowTmdbIds)

        // TODO: REMOVE
        console.log('Fetched Favorite Shows Details:', fetchedShows)

        setFavoriteShowsDetails(fetchedShows)
      } catch (error: any) {
        console.error(
          'Error fetching all favorite show details:',
          error.message,
        )
        setErrorFetchingDetails(
          'Failed to load favorite show details. Please try again later.',
        )
      } finally {
        setLoadingDetails(false)
      }
    }

    // Trigger the fetch when user, token, or the list of favorite IDs changes
    fetchAllFavoriteDetails()
  }, [user, token, favoriteShowTmdbIds])

  if (loadingDetails) {
    return <Loading message="Favorites" type="skeleton" skeletonCols={4} />
  }

  if (errorFetchingDetails) {
    return <ErrorDisplay error={errorFetchingDetails} />
  }

  return (
    <PageLayout title="My Favorites">
      {favoriteShowsDetails.length === 0 ? (
        <p className="text-gray-400 text-lg text-center mt-8">
          You don't have any favorite shows yet. Start exploring!
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-x-8 gap-y-12">
          {favoriteShowsDetails.map((show) => (
            <>
              <p className="BBBB">{show.tmdbId}</p>
              <ShowCard key={show.tmdbId} show={show} />
            </>
          ))}
        </div>
      )}
    </PageLayout>
  )
}

export default Favorites
