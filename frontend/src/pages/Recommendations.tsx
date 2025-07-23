import { useEffect, useState } from 'react'

import { useAuth } from '@/context/AuthContext'
import { getRecommendations } from '@/services/getRecommendations'
import { type TRecommendation } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import RecommendationsList from '@/components/Recommendations/RecommendationsList'
import RecommendationsNotFound from '@/components/Recommendations/RecommendationsNotFound'

const Recommendations = () => {
  const { user, token } = useAuth()
  const [recommendations, setRecommendations] = useState<TRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRecommendations = async () => {
      // Fetch recommendations only if user ID and token are available.
      if (user?._id && token) {
        try {
          setLoading(true)
          setError(null)
          const data = await getRecommendations(user._id, token)
          setRecommendations(data)
        } catch (err: any) {
          setError('Failed to load recommendations. Please try again later.')
          console.error('Error fetching recommendations:', err)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setError('Please log in to see your personalized recommendations.')
      }
    }

    fetchUserRecommendations()
  }, [user?._id, token])

  if (loading) {
    return <Loading message="Loading..." />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (recommendations.length === 0) {
    return <RecommendationsNotFound />
  }

  return (
    <PageLayout title="Recommendations" subtitle="Based on your favorites">
      <RecommendationsList recommendations={recommendations} />
    </PageLayout>
  )
}

export default Recommendations
