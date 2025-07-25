import React from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type SearchShowsResultsPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

const SearchShowsResultsPagination: React.FC<
  SearchShowsResultsPaginationProps
> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null
  }

  // Logic to generate visible page numbers with ellipsis handling
  const getPageNumbers = () => {
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      const diff = maxVisiblePages - (endPage - startPage + 1)
      const newStartPage = Math.max(1, startPage - diff)
      return Array.from(
        { length: endPage - newStartPage + 1 },
        (_, i) => newStartPage + i,
      )
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    )
  }

  const visiblePageNumbers = getPageNumbers()

  return (
    <div className="mt-24 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              }}
              aria-disabled={currentPage <= 1}
              className={
                currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {visiblePageNumbers[0] > 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {visiblePageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(pageNumber)
                }}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              }}
              aria-disabled={currentPage >= totalPages}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default SearchShowsResultsPagination
