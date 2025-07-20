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
import ShowInfo from '@/components/ShowPage/ShowInfo'

import { useDynamicDocumentTitle } from '@/hooks/useDynamicDocumentTitle'

// TODO: Hero sticky

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
    return <Loading type="spinner" message="Loading..." />
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
        <div className="grid grid-cols-4 gap-x-16">
          <div className="col-span-3">
            <Cast cast={showData.cast} />
            <SeasonsList show={showData} />
          </div>
          <aside className="col-span-1">
            <Crew crew={showData.crew} />
            <ShowInfo show={showData} />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ShowPage
