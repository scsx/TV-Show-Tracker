import { useEffect, useState } from 'react'

import { getOnTheAirShows } from '@/services/getOnTheAirShows'
// Ajusta o caminho se necessário
import { type TTMDBSearchShowResponse } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'

const AiringNow = () => {
  const [allShows, setAllShows] = useState<TTMDBSearchShowResponse['results']>(
    [],
  )
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const shows = await getOnTheAirShows()
        setAllShows(shows)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [])

  if (loading) {
    return <Loading type="skeleton" message="Loading on the air shows" />
  }

  if (error) {
    return <ErrorDisplay error={error} title="Data Loading Issue" />
  }

  if (allShows.length === 0) {
    return (
      <Text className="flex-1 flex items-center justify-center">
        No shows currently on the air found.
      </Text>
    )
  }

  return (
    <PageLayout title="On The Air">
      <div className="grid grid-cols-5 gap-x-8 gap-y-12">
        {allShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </PageLayout>
  )
}

export default AiringNow
