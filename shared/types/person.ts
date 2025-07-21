export type TTMDBPersonCredit = {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id?: number
  character?: string
  credit_id: string
  order?: number
  job?: string
  department?: string
}

export type TTMDBGuestStar = {
  character: string
  credit_id: string
  order: number
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
}

export type TTMDBPersonCombinedCredit = {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  overview: string
  popularity: number
  poster_path: string | null
  vote_average: number
  vote_count: number
  media_type: 'movie' | 'tv'
  title?: string
  original_title?: string
  release_date?: string
  video?: boolean
  name?: string
  first_air_date?: string
  character?: string
  cast_id?: number
  order?: number
  job?: string
  department?: string
  credit_id: string
}

export type TTMDBPersonDetails = {
  adult: boolean
  also_known_as: string[]
  biography: string
  birthday: string | null
  deathday: string | null
  gender: number
  homepage: string | null
  id: number
  imdb_id: string | null
  known_for_department: string
  name: string
  place_of_birth: string | null
  popularity: number
  profile_path: string | null
}

// For https://api.themoviedb.org/3/person/popular
export type TTMDBPopularPerson = Pick<
  TTMDBPersonDetails,
  'adult' | 'gender' | 'id' | 'known_for_department' | 'name' | 'popularity' | 'profile_path'
> & {
  known_for: TTMDBPersonCombinedCredit[]
  original_name: string
}

export type TTMDBPopularPersonsResponse = {
  page: number
  results: TTMDBPopularPerson[]
  total_pages: number
  total_results: number
}

// API will return a combined response with these types.
// This will be the concern of frontend.
export type TPerson = {
  bio: TTMDBPersonDetails
  credits: {
    cast: TTMDBPersonCombinedCredit[]
    crew: TTMDBPersonCombinedCredit[]
  }
}
