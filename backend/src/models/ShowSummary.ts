import { Schema, model } from 'mongoose'
import { TTMDBShowSummaryModel } from '@shared/types/show'

/**
 * @description Mongoose schema for summarized TV show data, mapping to TTMDBShowSummaryModel.
 * This schema is used for storing basic trending/popular show information.
 */
const ShowSummarySchema = new Schema<TTMDBShowSummaryModel>(
  {
    id: { type: Number, required: true, unique: true, index: true }, // TMDb ID as unique identifier
    name: { type: String, required: true },
    original_name: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, default: null },
    backdrop_path: { type: String, default: null },
    first_air_date: { type: String, required: true },
    genre_ids: [{ type: Number }], // Store only IDs
    popularity: { type: Number, default: 0 },
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    origin_country: [{ type: String }],
    original_language: { type: String, required: true }
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
  }
)

/**
 * @description Mongoose model for summarized TV shows.
 */
const ShowSummary = model<TTMDBShowSummaryModel>('ShowSummary', ShowSummarySchema)

export default ShowSummary
