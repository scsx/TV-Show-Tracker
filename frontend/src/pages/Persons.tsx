import { useEffect, useState } from 'react'
import { TfiNewWindow } from 'react-icons/tfi'

import { getPopularPersons } from '@/services/getPopularPersons'
import { type TTMDBPopularPerson } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import PersonFullCard from '@/components/Person/PersonFullCard/PersonFullCard'
import Text from '@/components/Text'

const Persons = () => {
  const [persons, setPersons] = useState<TTMDBPopularPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPersonsData = async () => {
      try {
        const fetchedPersons = await getPopularPersons()
        setPersons(fetchedPersons)
        console.log(fetchedPersons)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch popular persons.')
      } finally {
        setLoading(false)
      }
    }

    fetchPersonsData()
  }, [])

  if (loading) {
    return <Loading type="spinner" message="Loading..." />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <PageLayout title="Persons" subtitle="Most popular now on TMDB">
      <Text className="flex items-center italic mb-8" color='muted'>
        Movies open a google search <TfiNewWindow className='ml-2' />
      </Text>
      <div className="grid grid-cols-4 gap-12">
        {persons.map((person) => (
          <PersonFullCard key={person.id} person={person} />
        ))}
      </div>
    </PageLayout>
  )
}

export default Persons
