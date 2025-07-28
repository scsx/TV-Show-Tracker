import { Schema, model } from 'mongoose'
// Some imports are implicitly used.
import { TTMDBShow } from '@shared/types/show'

/**
 * @description Mongoose schema for detailed TV show data, mapping to TTMDBShow.
 */
const ShowSchema = new Schema<TTMDBShow>(
  {
    id: { type: Number, required: true, unique: true, index: true }, // TMDb ID as unique identifier
    name: { type: String, required: true },
    original_name: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, default: null },
    backdrop_path: { type: String, default: null },
    first_air_date: { type: String, required: true },
    last_air_date: { type: String, default: null },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    genres: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true }
      }
    ],
    episode_run_time: [{ type: Number }],
    origin_country: [{ type: String }],
    original_language: { type: String, required: true },
    homepage: { type: String, default: null },
    in_production: { type: Boolean, default: false },
    number_of_episodes: { type: Number, default: 0 },
    number_of_seasons: { type: Number, default: 0 },
    status: { type: String, default: null },
    type: { type: String, default: null },
    tagline: { type: String, default: null },
    production_companies: [
      {
        id: { type: Number, required: true },
        logo_path: { type: String, default: null },
        name: { type: String, required: true },
        origin_country: { type: String, required: true }
      }
    ],
    seasons: [
      {
        air_date: { type: String, default: null },
        episode_count: { type: Number, required: true },
        id: { type: Number, required: true },
        name: { type: String, required: true },
        overview: { type: String, required: true },
        poster_path: { type: String, default: null },
        season_number: { type: Number, required: true },
        vote_average: { type: Number, default: 0 }
      }
    ]
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
  }
)

/**
 * @description Mongoose model for detailed TV shows.
 */
const Show = model<TTMDBShow>('Show', ShowSchema)

export default Show
