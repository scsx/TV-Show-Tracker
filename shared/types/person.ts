export type TTMDBPersonCredit = {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id?: number
  character?: string
  credit_id: string
  order?: number
  job?: string
  department?: string
}

export type TTMDBGuestStar = {
  character: string
  credit_id: string
  order: number
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
}
