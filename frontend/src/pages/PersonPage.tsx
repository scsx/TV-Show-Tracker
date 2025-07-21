import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getPersonDetailsById } from '@/services/getPersonDetailsById'
import { type TPerson } from '@/types'

import Loading from '@/components/Loading'

const PersonPage = () => {
  const { id } = useParams<{ id: string }>()
  const personId = Number(id)

  // TODO: CLEAN
  console.log('ID do useParams:', id) // << ADICIONE ESTE LOG
  console.log('ID numérico (personId):', personId) // << ADICIONE ESTE LOG

  const [personData, setPersonData] = useState<TPerson | null>(null)
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
        console.log(data)
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading type="spinner" message="Loading person..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500">
        <p>Erro: {error}</p>
      </div>
    )
  }

  if (!personData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>Nenhum dado de pessoa encontrado.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Detalhes da Pessoa: {personData.bio.name}
      </h1>
      <h2 className="text-xl font-semibold mb-2">Dados da API (JSON):</h2>
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
        {JSON.stringify(personData, null, 2)}
      </pre>
    </div>
  )
}

export default PersonPage
