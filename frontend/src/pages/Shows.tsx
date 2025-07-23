import { useEffect, useState } from 'react'

import { searchTvShows } from '@/services/searchShows'

// TODO: CLEAN

// Importar useEffect e useState
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

// Importar o seu serviço de pesquisa

const Shows = () => {
  const [testMessage, setTestMessage] = useState('A tentar carregar dados...') // Estado para mostrar feedback

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chamada de teste mínima para o serviço de pesquisa
        // Pode adicionar parâmetros de teste aqui, por exemplo, { query: 'The' }
        const data = await searchTvShows({
          query: 'The',
          page: 1,
          sortBy: 'popularity.desc',
        })

        // --- ADICIONAR ESTE CONSOLE.LOG NO FRONTEND ---
        console.log('--- Dados COMPLETOS recebidos no Frontend: ---', data)
        // ---------------------------------------------

        console.log('Resultados da Pesquisa de TV Shows:', {
          shows: data.shows,
          page: data.page,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
        })
        // Fazer console.log dos resultados da pesquisa
        console.log('Resultados da Pesquisa de TV Shows:', data)

        // Atualizar a mensagem no ecrã com sucesso
        setTestMessage(
          `Dados carregados: ${data.shows.length} shows encontrados. Veja a consola para mais detalhes.`,
        )
      } catch (error) {
        // Fazer console.log de qualquer erro que ocorra
        console.error('Erro ao carregar dados de pesquisa:', error)
        setTestMessage('Erro ao carregar dados. Verifique a consola.')
      }
    }

    fetchData() // Chamar a função de busca de dados
  }, []) // O array vazio [] garante que o useEffect só corre uma vez (ao montar o componente)

  return (
    <PageLayout title="Search Test" className="pb-32">
      {/* Usar o estado para mostrar a mensagem de teste */}
      <Text>{testMessage}</Text>
      <Text className="mt-4">
        Verifique a consola do seu navegador para os resultados.
      </Text>
    </PageLayout>
  )
}

export default Shows
