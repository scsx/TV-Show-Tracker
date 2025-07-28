import { type TTMDBGenre } from './genre'
import { type TTMDBProductionCompany } from './production-company'
import { type TTMDBCreator } from './creator'
import { type TTMDBPersonCredit, type TTMDBGuestStar } from './person'

export type TTMDBEpisode = {
  air_date: string | null
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string | null
  runtime: number | null
  season_number: number
  show_id: number
  still_path: string | null
  vote_average: number
  vote_count: number
}

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

export type TTMDBShowSeasonDetails = {
  object_id?: string
  air_date: string | null
  episodes: TTMDBEpisode[]
  crew: TTMDBPersonCredit[]
  guest_stars: TTMDBGuestStar[]
  name: string
  overview: string
  id: number
  poster_path: string | null
  season_number: number
  vote_average: number
}

export type TTMDBShowLanguage = {
  name: string | null
  english_name: string | null
  iso_639_1: string
}

export type TTMDBShow = {
  _id?: string // MongoDB only
  // From https://api.themoviedb.org/3/tv/{series_id}
  id: number // TMDB
  name: string
  original_name: string
  created_by: TTMDBCreator[]
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
  spoken_languages?: TTMDBShowLanguage[]
  // From https://api.themoviedb.org/3/tv/{series_id}/credits
  cast: TTMDBPersonCredit[]
  crew: TTMDBPersonCredit[]
}

export type TTMDBShowCredits = Pick<TTMDBShow, 'cast' | 'crew'> & {
  id: number
}

// Type for the reponse of https://api.themoviedb.org/3/trending/tv/{time_window}
export type TTMDBShowSummary = Pick<
  TTMDBShow,
  | 'name'
  | 'id'
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
  genre_ids: number[] // Trending/Popular endpoints return only genre IDs, not full genre objects
  media_type: 'tv' | 'movie'
  video?: boolean
}

// Type for the format from DB (Mongo)
export type TTMDBShowSummaryModel = TTMDBShowSummary & {
  _id?: string // MongoDB only
  updatedAt?: Date
  createdAt?: Date
}

// Type for the search (discover) format: https://api.themoviedb.org/3/discover/tv
export type TTMDBShowSearchResult = Pick<
  TTMDBShow,
  | 'name'
  | 'id'
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
  genre_ids: number[]
}
