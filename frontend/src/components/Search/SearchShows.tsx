import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { searchTvShows } from '@/services/searchShows'
import { type TTMDBShowSearchResult } from '@/types'

import SearchForm from '@/components/Search/SearchForm'
import SearchShowsResults from '@/components/Search/SearchShowsResults'

const SearchShows: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [shows, setShows] = useState<TTMDBShowSearchResult[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalResults, setTotalResults] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const currentQueryFromUrl = searchParams.get('query') || ''
  const currentGenreIdsFromUrl = searchParams.get('genreIds') || ''
  const currentPageFromUrl = parseInt(searchParams.get('page') || '1', 10)
  const currentSortByFromUrl = searchParams.get('sortBy') || 'popularity.desc'

  const updateSearchParams = useCallback(
    (paramsToUpdate: Record<string, string | number | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      for (const [name, value] of Object.entries(paramsToUpdate)) {
        if (value !== undefined && value !== '') {
          newSearchParams.set(name, String(value))
        } else {
          newSearchParams.delete(name)
        }
      }
      setSearchParams(newSearchParams)
    },
    [searchParams, setSearchParams],
  )

  const handleSearchSubmit = (query: string, genreIds: string) => {
    updateSearchParams({
      query: query,
      genreIds: genreIds,
      page: 1,
    })
  }

  const handleClearSearch = useCallback(() => {
    updateSearchParams({
      query: undefined,
      genreIds: undefined,
      page: 1,
    })
  }, [updateSearchParams])

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage })
  }

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
        console.error('Error loading search data:', err)
        setError('Could not load shows. Please try again later.')
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
      <SearchForm
        initialQuery={currentQueryFromUrl}
        initialGenreIds={currentGenreIdsFromUrl}
        onSubmit={handleSearchSubmit}
      />

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
        onClearSearch={handleClearSearch}
      />
    </div>
  )
}

export default SearchShows
