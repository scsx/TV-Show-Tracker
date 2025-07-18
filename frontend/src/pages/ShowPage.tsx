import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getShowDetailsById } from '@/services/getShowDetailsById'
import { type TTMDBShow } from '@/types'

import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

// TODO: TRANSLATE

const ShowPage: React.FC = () => {
  // Use useParams para obter o 'id' da URL
  const { id } = useParams<{ id: string }>() // O ID da URL é sempre uma string
  const [showDetails, setShowDetails] = useState<TTMDBShow | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetailsAndLog = async () => {
      if (!id) {
        console.error('ShowPage Error: ID do show não fornecido na URL.')
        setError('ID do show não fornecido.')
        setLoading(false)
        return
      }

      const showIdNum = Number(id)
      if (isNaN(showIdNum)) {
        console.error(`ShowPage Error: ID do show inválido na URL: ${id}`)
        setError('ID do show inválido.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const details: TTMDBShow = await getShowDetailsById(showIdNum)
        if (details) {
          console.log(
            `ShowPage: Detalhes do show (ID: ${showIdNum}) obtidos com sucesso:`,
            details,
          )
          setShowDetails(details)
        } else {
          console.warn(
            `ShowPage: Nenhum detalhe encontrado para o show com ID: ${showIdNum}`,
          )
          setError('Detalhes do show não encontrados.')
        }
      } catch (err: any) {
        console.error(
          `ShowPage Error: Falha ao carregar detalhes do show (ID: ${showIdNum}):`,
          err.message,
          err,
        )
        setError(
          'Falha ao carregar os detalhes do show. Verifique a consola para mais informações.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDetailsAndLog()
  }, [id]) // O efeito é re-executado se o ID na URL mudar

  // Apenas para mostrar algo na UI enquanto os dados são buscados/logados
  return (
    <PageLayout title="Detalhes do Show" subtitle={`ID: ${id || 'N/A'}`}>
      <div className="p-4 text-center">
        {loading && (
          <Loading
            type="spinner"
            message="A buscar detalhes do show para a consola..."
          />
        )}

        {showDetails && <Text>{JSON.stringify(showDetails)}</Text>}
        {error && <ErrorDisplay error={error} />}
      </div>
    </PageLayout>
  )
}

export default ShowPage
