// Common BE/FE.
export type TCommonUser = {
  username: string
  email: string
  // password: string; // Hashed password is not returned to frontend, so no need here
  createdAt?: Date
  updatedAt?: Date
  favoriteShowids?: number[]
}

// Frontend only.
export type TUser = TCommonUser & {
  _id: string
  favoriteShowids: number[]
}
