import { type TTMDBShow, type TTMDBShowSummaryModel } from '@/types'

/**
 * Maps a full TTMDBShow object (from show details API) to a TTMDBShowSummary object,
 * ShowCard expects only TTMDBShowSummary.
 * @param show The complete TTMDBShow object.
 * @returns A TTMDBShowSummary object.
 */
export const mapFullShowToSummary = (
  show: TTMDBShow,
): TTMDBShowSummaryModel => {
  return {
    tmdbId: show.tmdbId,
    name: show.name,
    original_name: show.original_name,
    overview: show.overview,
    poster_path: show.poster_path,
    backdrop_path: show.backdrop_path,
    first_air_date: show.first_air_date,
    popularity: show.popularity,
    vote_average: show.vote_average,
    vote_count: show.vote_count,
    origin_country: show.origin_country,
    original_language: show.original_language,
    genre_ids: show.genres ? show.genres.map((genre) => genre.id) : [],
  }
}

/**
 * Type guard to check if an object is of type TTMDBShow.
 * It checks for a property unique to TTMDBShow that is not present in TTMDBShowSummaryModel.
 * @param show The object to check.
 * @returns True if the object is TTMDBShow, false otherwise.
 */
export const isTTMDBFullShow = (
  show: TTMDBShow | TTMDBShowSummaryModel,
): show is TTMDBShow => {
  // TTMDBShow has 'number_of_seasons' and 'number_of_episodes', which TTMDBShowSummaryModel does not.
  return (
    (show as TTMDBShow).number_of_seasons !== undefined &&
    typeof (show as TTMDBShow).number_of_seasons === 'number' &&
    'genres' in show &&
    Array.isArray(show.genres) &&
    (show.genres.length === 0 ||
      (typeof show.genres[0] === 'object' && 'id' in show.genres[0]))
  )
}
