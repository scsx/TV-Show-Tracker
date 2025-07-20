export function cleanUrl(url: string): string {
  const cleanedProtocol = url.replace(/^(https?:\/\/)?(www\.)?/, '')

  const cleanedTrailingSlash = cleanedProtocol.replace(/\/$/, '')

  return cleanedTrailingSlash
}
