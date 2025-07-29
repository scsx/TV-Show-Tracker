import {
  type TTMDBPersonCombinedCredit,
  type TTMDBShow,
  type TTMDBShowSearchResult,
  type TTMDBShowSummaryModel,
} from '@/types'

import { type TShowCardDisplayData } from '@/components/ShowCard/ShowCard'

// Type guard: Checks if data is a TTMDBPersonCombinedCredit.
export const isTTMDBPersonCombinedCredit = (
  show: any,
): show is TTMDBPersonCombinedCredit => {
  return (
    show &&
    typeof show === 'object' &&
    show.media_type === 'tv' &&
    'character' in show
  )
}

// Type guard: Checks if data is a full TTMDBShow.
export const isTTMDBFullShow = (show: any): show is TTMDBShow => {
  return (
    show &&
    typeof show === 'object' &&
    'genres' in show &&
    'episode_run_time' in show
  )
}

// Maps a TTMDBShow to a TTMDBShowSummaryModel.
export const mapFullShowToSummary = (
  show: TTMDBShow,
): TTMDBShowSummaryModel => {
  return {
    _id: show.id.toString(),
    id: show.id,
    name: show.name,
    poster_path: show.poster_path,
    first_air_date: show.first_air_date,
    vote_average: show.vote_average,
    vote_count: show.vote_count,
    overview: show.overview,
    original_name: show.original_name,
    backdrop_path: show.backdrop_path,
    popularity: show.popularity,
    origin_country: show.origin_country,
    original_language: show.original_language,
    genre_ids: show.genres ? show.genres.map((genre) => genre.id) : [],
    media_type: 'tv',
  }
}

// Normalizes various show input types to a consistent TShowCardDisplayData format.
export const normalizeShowData = (
  show:
    | TTMDBShow
    | TTMDBShowSummaryModel
    | TTMDBPersonCombinedCredit
    | TTMDBShowSearchResult,
): TShowCardDisplayData => {
  if (isTTMDBPersonCombinedCredit(show) && show.media_type === 'tv') {
    return {
      id: show.id,
      name: show.name || '',
      poster_path: show.poster_path || null,
      first_air_date: show.first_air_date || undefined,
      vote_average: show.vote_average,
      vote_count: show.vote_count,
      overview: show.overview || undefined,
      character: show.character,
    }
  } else if (isTTMDBFullShow(show)) {
    const mappedShow = mapFullShowToSummary(show)
    return {
      id: mappedShow.id,
      name: mappedShow.name,
      poster_path: mappedShow.poster_path,
      first_air_date: mappedShow.first_air_date,
      vote_average: mappedShow.vote_average,
      vote_count: mappedShow.vote_count,
      overview: mappedShow.overview,
      character: undefined,
    }
  } else {
    const summaryShow = show as TTMDBShowSummaryModel
    return {
      id: summaryShow.id,
      name: summaryShow.name,
      poster_path: summaryShow.poster_path,
      first_air_date: summaryShow.first_air_date,
      vote_average: summaryShow.vote_average,
      vote_count: summaryShow.vote_count,
      overview: summaryShow.overview,
      character: undefined,
    }
  }
}
