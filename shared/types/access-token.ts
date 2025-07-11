export type TAccessToken = {
  token: string
  userId: string // The ID of the user this token belongs to
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}
