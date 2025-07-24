import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { searchTvShows } from '@/services/searchShows'
import { type TTMDBShowSearchResult } from '@/types'

import SearchForm from '@/components/Search/SearchForm'
import SearchShowsResults from '@/components/Search/SearchShowsResults'

const SearchShows: React.FC = () => {
  // Inicialização dos hooks do react-router-dom
  const [searchParams, setSearchParams] = useSearchParams()

  // --- Estados para os dados da API (shows, paginação) ---
  const [shows, setShows] = useState<TTMDBShowSearchResult[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalResults, setTotalResults] = useState<number>(0)

  // --- Estados para o carregamento e erros da UI ---
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  // --- Parâmetros de pesquisa ATUAIS da URL ---
  // Estes são lidos diretamente da URL e usados para a chamada à API
  const currentQueryFromUrl = searchParams.get('query') || ''
  const currentGenreIdsFromUrl = searchParams.get('genreIds') || ''
  const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const currentSortByFromUrl = searchParams.get('sortBy') || 'popularity.desc'

  // --- Função utilitária para construir os query parameters para a URL ---
  // Esta função agora também SETA os parâmetros na URL usando setSearchParams
  const updateSearchParams = useCallback(
    (paramsToUpdate: Record<string, string | number | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString()) // Cria uma cópia dos params atuais

      for (const [name, value] of Object.entries(paramsToUpdate)) {
        if (value !== undefined && value !== '') {
          newSearchParams.set(name, String(value))
        } else {
          newSearchParams.delete(name)
        }
      }
      setSearchParams(newSearchParams) // <--- CORREÇÃO AQUI: Usa setSearchParams do useSearchParams
    },
    [searchParams, setSearchParams], // Dependências para useCallback
  )

  // --- Função para lidar com a submissão do formulário de pesquisa ---
  const handleSearchSubmit = (query: string, genreIds: string) => {
    // Ao submeter, atualizamos a URL com a nova query, gêneros e sempre voltamos para a página 1.
    if (query || genreIds) {
      setHasSearched(true)
    } else {
      setHasSearched(false)
    }

    updateSearchParams({
      query: query,
      genreIds: genreIds,
      page: 1, // Reset para a primeira página em nova pesquisa
    })
    // Não precisa de navigate() aqui, pois setSearchParams já atualiza a URL
  }

  // --- Função para lidar com a mudança de página na paginação ---
  const handlePageChange = (newPage: number) => {
    // Atualiza a URL apenas com o novo número da página, mantendo query e géneros existentes.
    updateSearchParams({ page: newPage })
    // Não precisa de navigate() aqui
  }

  // --- Efeito para buscar os dados da API sempre que os parâmetros da URL mudam ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchTvShows({
          query: currentQueryFromUrl,
          genreIds: currentGenreIdsFromUrl,
          page: currentPageFromUrl,
          sortBy: currentSortByFromUrl,
        })

        setShows(data.shows)
        setPage(data.page)
        setTotalPages(data.totalPages)
        setTotalResults(data.totalResults)
      } catch (err) {
        console.error('Erro ao carregar dados de pesquisa:', err)
        setError(
          'Não foi possível carregar os shows. Tente novamente mais tarde.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [
    currentQueryFromUrl,
    currentGenreIdsFromUrl,
    currentPageFromUrl,
    currentSortByFromUrl,
    updateSearchParams,
  ])

  return (
    <div className="search-shows-container">
      {/* 1. Componente para os Inputs de Pesquisa */}
      <SearchForm // Usando o nome que você definiu
        initialQuery={currentQueryFromUrl}
        initialGenreIds={currentGenreIdsFromUrl}
        onSubmit={handleSearchSubmit}
        hasSearched={hasSearched}
      />

      {/* 2. Componente para exibir os Resultados e Paginação */}
      <SearchShowsResults
        shows={shows}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={handlePageChange}
        currentQuery={currentQueryFromUrl}
        currentGenreIds={currentGenreIdsFromUrl}
      />
    </div>
  )
}

export default SearchShows
