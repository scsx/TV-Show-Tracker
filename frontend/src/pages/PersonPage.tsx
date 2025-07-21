import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPersonDetailsById } from '@/services/getPersonDetailsById'
import { type TPerson } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import PersonBio from '@/components/Person/PersonBio'

import { getYearFromDateString } from '@/lib/date'

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
        console.log(data.credits.cast)
        console.log(data.credits.crew)
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

  if (loading) {
    return <Loading type="spinner" message="Loading person..." />
  }

  if (error) {
    return <ErrorDisplay error={error} title="Error loading person" />
  }

  if (!personData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>No person found.</p>
      </div>
    )
  }

  return (
    <PageLayout title={personData.bio.name} subtitle={years}>
      <PersonBio bio={personData.bio} />
      {/* <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
        {JSON.stringify(personData.bio, null, 2)}
      </pre> */}
    </PageLayout>
  )
}

export default PersonPage
