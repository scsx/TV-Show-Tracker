import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getShowDetailsById } from '@/services/getShowDetailsById'
import { type TTMDBShow } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import ShowJSONDelete from '@/components/ShowPage/ShowJSON-DELETE'

// TODO: TRANSLATE

const ShowPage: React.FC = () => {
  // Use useParams to get id
  const { id } = useParams<{ id: string }>()
  const [showDetails, setShowDetails] = useState<TTMDBShow | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetailsAndLog = async () => {
      if (!id) {
        console.error('ShowPage Error: ID not present in URL.')
        setError('Show ID not provided.')
        setLoading(false)
        return
      }

      const showIdNum = Number(id)
      if (isNaN(showIdNum)) {
        console.error(`ShowPage Error: invalid Show ID in URL: ${id}`)
        setError('Invalid Show ID.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const details: TTMDBShow = await getShowDetailsById(showIdNum)
        if (details) {
          setShowDetails(details)
        } else {
          console.warn(`ShowPage: No details for show ID: ${showIdNum}`)
          setError('Show details not found.')
        }
      } catch (err: any) {
        console.error(
          `ShowPage Error: Fail loading details (show ID: ${showIdNum}):`,
          err.message,
          err,
        )
        setError('Check console for error details.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetailsAndLog()
  }, [id])

  return (
    <PageLayout title="Detalhes do Show" subtitle={`ID: ${id || 'N/A'}`}>
      <div className="p-4">
        {loading && (
          <Loading
            type="spinner"
            message="A buscar detalhes do show para a consola..."
          />
        )}

        {showDetails && <ShowJSONDelete />}
        {error && <ErrorDisplay error={error} />}
      </div>
    </PageLayout>
  )
}

export default ShowPage
