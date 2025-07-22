import { type TTMDBShowSummary } from './show'

// TRecommendation will be based on saved favorites.
// https://api.themoviedb.org/3/tv/{series_id}/recommendations returns an array of TTMDBShowSummary.
export type TRecommendation = {
  favoriteId: number
  favoriteName: string
  favoriteReccommended: TTMDBShowSummary[]
}
