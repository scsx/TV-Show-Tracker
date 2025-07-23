import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPersonDetailsById } from '@/services/getPersonDetailsById'
import { type TPerson } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import PersonCredits from '@/components/Person/PersonCredits'
import PersonDetails from '@/components/Person/PersonDetails'
import Text from '@/components/Text'

import { getYearFromDateString } from '@/lib/date'

import { useDynamicDocumentTitle } from '@/hooks/useDynamicDocumentTitle'

const PersonPage = () => {
  const { id } = useParams<{ id: string }>()
  const personId = Number(id)
  const [personData, setPersonData] = useState<TPerson | null>(null)
  const [years, setYears] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || isNaN(personId)) {
      setError('ID de pessoa inválido na URL.')
      setLoading(false)
      return
    }

    const fetchPerson = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPersonDetailsById(personId)
        setPersonData(data)
      } catch (err: any) {
        setError(
          err.response?.data?.msg ||
            err.message ||
            'Erro ao carregar detalhes da pessoa.',
        )
        console.error('Erro ao buscar detalhes da pessoa:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPerson()
  }, [id, personId])

  useEffect(() => {
    if (personData) {
      const birthYear = personData.bio.birthday
        ? getYearFromDateString(personData.bio.birthday)
        : ''
      const deathYear = personData.bio.deathday
        ? getYearFromDateString(personData.bio.deathday)
        : ''

      let yearsString = ''
      if (birthYear) {
        yearsString = birthYear
        if (deathYear) {
          yearsString += ` - ${deathYear}`
        } else {
          yearsString += ` - `
        }
      } else if (deathYear) {
        yearsString = ` - ${deathYear}`
      }

      setYears(yearsString)
    }
  }, [personData])

  useDynamicDocumentTitle(personData ? personData.bio.name : null)

  if (loading) {
    return <Loading type="spinner" message="Loading person..." />
  }

  if (error) {
    return <ErrorDisplay error={error} title="Error loading person" />
  }

  if (!personData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Text>No person found.</Text>
      </div>
    )
  }

  return (
    <PageLayout title={personData.bio.name} subtitle={years}>
      <section className="flex space-x-16">
        <div className="w-1/4">
          <PersonDetails bio={personData.bio} />
        </div>

        <div className="w-3/4">
          {personData.bio.biography && (
            <>
              <Text variant="h2" as="h2">
                Biography
              </Text>
              <Text variant="paragraphL" className="mt-8 mb-16">
                {personData.bio.biography}
              </Text>
            </>
          )}
          <Text variant="h2" as="h2" className="mb-8">
            Work
          </Text>
          <PersonCredits credits={personData.credits} />
        </div>
      </section>
    </PageLayout>
  )
}

export default PersonPage
