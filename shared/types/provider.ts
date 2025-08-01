export type TTMDBProvider = {
  display_priority: number
  logo_path: string
  provider_name: string
  provider_id: number
}

export type TTMDBProvidersByCountry = {
  link: string
  flatrate: TTMDBProvider[]
  rent: TTMDBProvider[]
  buy: TTMDBProvider[]
  free: TTMDBProvider[]
}

export type TTMDBWatchProvidersResponse = {
  id: number
  results: {
    [countryCode: string]: TTMDBProvidersByCountry
  }
}
