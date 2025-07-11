import { Schema, model, Document, Types } from 'mongoose'
import { TAccessToken } from '@shared/types/access-token'

// Define a specific interface for the Mongoose AccessToken Document
// Use Omit<TAccessToken, 'userId'> to exclude 'userId' from TAccessToken,
// then add the Mongoose-specific userId: Types.ObjectId
export interface IAccessTokenMongooseDocument extends Omit<TAccessToken, 'userId'>, Document {
  userId: Types.ObjectId
}

const AccessTokenSchema = new Schema<IAccessTokenMongooseDocument>(
  {
    token: {
      type: String,
      required: true,
      unique: true // Ensure tokens are unique
    },
    userId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type for referencing a User
      ref: 'User', // Reference to the 'User' model
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index: This makes MongoDB automatically delete documents from this collection
      // after the 'expiresAt' date. 'expires: 0' means it expires exactly
      // at the 'expiresAt' timestamp.
      expires: 0
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
)

const AccessToken = model<IAccessTokenMongooseDocument>('AccessToken', AccessTokenSchema)
export default AccessToken
