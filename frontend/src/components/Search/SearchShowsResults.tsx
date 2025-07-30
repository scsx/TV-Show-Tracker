import React from 'react'

import { type TTMDBShowSearchResult } from '@/types'

import SearchShowsResultsPagination from '@/components/Search/SearchShowsResultsPagination'
import ShowCard from '@/components/ShowCard/ShowCard'
import Text from '@/components/Text'
import { Button } from '@/components/ui/button'

type SearchShowsResultsProps = {
  shows: TTMDBShowSearchResult[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalResults: number
  currentQuery: string
  currentGenreIds: string
  onPageChange: (newPage: number) => void
  onClearSearch: () => void
}

const SearchShowsResults: React.FC<SearchShowsResultsProps> = ({
  shows,
  loading,
  error,
  currentPage,
  totalPages,
  totalResults,
  currentQuery,
  currentGenreIds,
  onPageChange,
  onClearSearch,
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
  const hasResults = shows.length > 0 && !isSearchEmpty

  if (shows.length === 0 && isSearchEmpty) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        Search again!
      </div>
    )
  }

  return (
    <div className="pt-4">
      {!isSearchEmpty && (
        <div className="flex items-center pb-8">
          <div className="grow">
            {hasResults && (
              <Text color="muted">
                Showing {shows.length} of {totalResults} results
                {currentQuery && (
                  <>
                    {' for "'}
                    <span className="text-primary">{currentQuery}</span>
                    {'"'}
                  </>
                )}
              </Text>
            )}
            {noResultsFound && (
              <Text color="muted">
                0 results for
                {currentQuery && (
                  <>
                    {' "'}
                    <span className="text-primary">{currentQuery}</span>
                    {'"'}
                  </>
                )}
              </Text>
            )}
          </div>
          <Button variant="ghost" onClick={onClearSearch}>
            Clear search
          </Button>
        </div>
      )}

      {hasResults && (
        <div className="grid grid-cols-5 gap-6">
          {shows.map((show) => (
            <div key={show.id}>
              <ShowCard key={show.id} show={show} />
            </div>
          ))}
        </div>
      )}

      {noResultsFound && (
        <Text variant='paragraphL' className='mt-16 mb-32 text-center'>
          Please check your spelling or try simpler terms.
        </Text>
      )}

      {hasResults && (
        <SearchShowsResultsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

export default SearchShowsResults
