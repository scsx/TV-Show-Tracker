import { useEffect, useState } from 'react'
import { MdOutlineTvOff } from 'react-icons/md'

import { getShowProviders } from '@/services/getShowProviders'
import { type TTMDBWatchProvidersResponse } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import ProvidersByCountry from '@/components/ShowPage/ShowProviders/ProvidersByCountry'
import Text from '@/components/Text'

const ShowProviders = ({ showId }: { showId: number }) => {
  const [providers, setProviders] =
    useState<TTMDBWatchProvidersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noProvidersFoundAnywhere, setNoProvidersFoundAnywhere] =
    useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      if (!showId) return

      setLoading(true)
      setError(null)
      setNoProvidersFoundAnywhere(false)

      try {
        const data = await getShowProviders(showId)
        if (Object.keys(data.results).length === 0) {
          setNoProvidersFoundAnywhere(true)
        }
        setProviders(data)
      } catch (err: any) {
        setError('Failed to fetch watch providers.')
        console.error('Failed to fetch watch providers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [showId])

  return (
    <section>
      <Text variant="h3" as="h3" className="mb-4">
        Where to watch
      </Text>

      {loading ? (
        <Text color="muted">Loading platforms</Text>
      ) : error ? (
        <ErrorDisplay error={error} />
      ) : noProvidersFoundAnywhere ? (
        <div className="flex">
          <MdOutlineTvOff className="text-4xl mr-4 text-muted-foreground" />
          <Text className="italic leading-tight" color="muted">
            No watch providers found anywhere for this series.
          </Text>
        </div>
      ) : providers ? (
        <ProvidersByCountry providers={providers} />
      ) : null}
    </section>
  )
}

export default ShowProviders
