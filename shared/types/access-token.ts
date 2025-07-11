export type TAccessToken = {
  _id?: string // MongoDB's default ID
  token: string
  userId: string // The ID of the user this token belongs to
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}
