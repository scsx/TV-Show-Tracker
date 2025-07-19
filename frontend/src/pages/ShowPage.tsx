import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getShowDetailsById } from '@/services/getShowDetailsById'
import { type TTMDBShow } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import SeasonsList from '@/components/Season/SeasonsList'
import Cast from '@/components/ShowPage/Cast'
import Crew from '@/components/ShowPage/Crew'
import ShowHero from '@/components/ShowPage/ShowHero'

import { useDynamicDocumentTitle } from '@/hooks/useDynamicDocumentTitle'

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

  useDynamicDocumentTitle(showData ? showData.name : null)

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
    <div className="w-full pb-32">
      <ShowHero show={showData} />
      <div className="container">
        <div className="flex space-x-16">
          <div className="w-3/4">
            <Cast cast={showData.cast} />
          </div>
          <div className="w-1/4 bg-orange-600">
            <Crew crew={showData.crew} />
          </div>
        </div>
        <SeasonsList show={showData} />
      </div>
    </div>
  )
}

export default ShowPage
