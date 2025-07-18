import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getShowDetailsById } from '@/services/getShowDetailsById'
import { type TTMDBShow } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import ShowHero from '@/components/ShowPage/ShowHero'
// TODO: DELETE
import ShowJSONDelete from '@/components/ShowPage/ShowJSON-DELETE'

const ShowPage = () => {
  const { id } = useParams<{ id: string }>()
  const [showData, setShowData] = useState<TTMDBShow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShowData = async () => {
      if (!id) {
        setError('Show ID is missing.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const data = await getShowDetailsById(Number(id))
        setShowData(data)
      } catch (err) {
        console.error('Error fetching show details:', err)
        setError('Failed to load show details.')
      } finally {
        setLoading(false)
      }
    }

    fetchShowData()
  }, [id])

  if (loading) {
    return <Loading type="spinner" message="Loading show details..." />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!showData) {
    return <ErrorDisplay error="No show data found." />
  }

  return (
    <div className="show-page-container">
      <ShowHero show={showData} />
      {/* <ShowHero data={showData} />
      <ShowOverview data={showData} /> 
      <ShowSeasons data={showData} />*/}
      <ShowJSONDelete data={showData} />
    </div>
  )
}

export default ShowPage
