import { type TTMDBShowSearchResult } from './show'

export type TTMDBKeyword = {
  id: number
  name: string
}

export type TTMDBKeywordsResponse = {
  page: number
  results: TTMDBKeyword[]
  total_pages: number
  total_results: number
}

// Complete respoonse from https://api.themoviedb.org/3/discover/tv
export type TTMDBDiscoverTVResponse = {
  page: number
  results: TTMDBShowSearchResult[]
  total_pages: number
  total_results: number
}
