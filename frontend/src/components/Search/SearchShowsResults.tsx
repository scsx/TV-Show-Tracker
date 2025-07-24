import React from 'react'

import { type TTMDBShowSearchResult } from '@/types'

import SearchShowsResultsPagination from '@/components/Search/SearchShowsResultsPagination'
import ShowCard from '@/components/ShowCard/ShowCard'

type SearchShowsResultsProps = {
  shows: TTMDBShowSearchResult[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalResults: number
  onPageChange: (newPage: number) => void
  currentQuery: string
  currentGenreIds: string
}

const SearchShowsResults: React.FC<SearchShowsResultsProps> = ({
  shows,
  loading,
  error,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  currentQuery,
  currentGenreIds,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        Loading shows...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-lg">
        Error: {error}
      </div>
    )
  }

  const isSearchEmpty = currentQuery === '' && currentGenreIds === ''
  const noResultsFound = shows.length === 0 && !isSearchEmpty

  if (noResultsFound) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        No results were found.
      </div>
    )
  }

  if (shows.length === 0 && isSearchEmpty) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        Search again!
      </div>
    )
  }

  return (
    <div className="p-4">
      {totalResults > 0 && (
        <p className="text-gray-400 text-sm mb-4 text-center">
          Showing {shows.length} of {totalResults} results.
          {currentQuery && ` para "${currentQuery}"`}
        </p>
      )}

      <div className="grid grid-cols-6 gap-6">
        {shows.map((show) => (
          <div key={show.id}>
            {/* <ShowCard key={show.id} show={show} /> */}
            <p className="whitespace-normal">{JSON.stringify(show.name)}</p>
          </div>
        ))}
      </div>

      <SearchShowsResultsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default SearchShowsResults
