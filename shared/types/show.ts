import { type TTMDBGenre } from './genre'
import { type TTMDBProductionCompany } from './production-company'

export type TTMDBShowSeason = {
  air_date: string | null
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export type TTMDBShow = {
  _id?: string
  tmdbId: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genres: TTMDBGenre[]
  episode_run_time: number[]
  origin_country: string[]
  original_language: string
  homepage: string
  in_production: boolean
  number_of_episodes: number
  number_of_seasons: number
  status: string
  type: string
  tagline: string | null
  production_companies: TTMDBProductionCompany[]
  seasons: TTMDBShowSeason[]
  updatedAt?: Date
  createdAt?: Date
}

// Type for the reponse of https://api.themoviedb.org/3/trending/tv/{time_window}
export type TTMDBShowSummary = Pick<
  TTMDBShow,
  | 'name'
  | 'tmdbId'
  | 'original_name'
  | 'overview'
  | 'poster_path'
  | 'backdrop_path'
  | 'first_air_date'
  | 'popularity'
  | 'vote_average'
  | 'vote_count'
  | 'origin_country'
  | 'original_language'
> & {
  // Overrides and additions for fields specific to the summary API response
  id: number // TMDb's 'id' field, which will be mapped to 'tmdbId' for DB
  genre_ids: number[] // Trending/Popular endpoints return only genre IDs, not full genre objects
}

// Type for the DB (Mongo)
export type TShowSummaryModel = Omit<TTMDBShowSummary, 'id'> & {
  _id?: string
  tmdbId: number
  updatedAt?: Date
  createdAt?: Date
}
