export type TUser = {
  username: string
  email: string
  // password: string; // Hashed password is not returned to frontend, so no need here
  createdAt?: Date
  updatedAt?: Date
  favoriteShowTmdbIds?: number[]
}
