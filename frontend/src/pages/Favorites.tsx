import React, { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { getFavorites } from '@/services/getFavorites'
import { type TTMDBShow } from '@/types/index'

import ErrorDisplay from '@/components/ErrorDisplay'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'

const Favorites: React.FC = () => {
  const { user, token, favoriteShowids } = useAuth()
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
      if (!user || !token || favoriteShowids.length === 0) {
        setFavoriteShowsDetails([]) // Clear any previous details
        setLoadingDetails(false)
        return
      }

      setLoadingDetails(true)
      setErrorFetchingDetails(null)

      try {
        // Call the getFavorites service function
        const fetchedShows = await getFavorites(favoriteShowids)

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
  }, [user, token, favoriteShowids])

  if (loadingDetails) {
    return <Loading message="Favorites" type="skeleton" skeletonCols={4} />
  }

  if (errorFetchingDetails) {
    return <ErrorDisplay error={errorFetchingDetails} />
  }

  return (
    <PageLayout title="Favorites" className="pb-48">
      {favoriteShowsDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Text variant="h3" as="h2" className="mb-8">
            You don't have any favorite shows yet. Start exploring!
          </Text>
          <Hyperlink href="/trending" variant="btnYellow">
            See what's trending
          </Hyperlink>
        </div>
      ) : (
        <>
          <Text className="mb-8" color="muted">
            Check{' '}
            <Hyperlink href="/profile/recommendations">
              recommendations
            </Hyperlink>{' '}
            for more like these.
          </Text>
          <div className="grid grid-cols-4 gap-x-8 gap-y-12">
            {favoriteShowsDetails.map((show) => (
              <ShowCard key={show.id} show={show} showHeartAsFavorite={false} />
            ))}
          </div>
        </>
      )}
    </PageLayout>
  )
}

export default Favorites
