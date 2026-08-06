export function resolveUrl(baseUrl: string, path: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')

  if (!baseUrl) {
    return normalizedPath
  }

  return `${normalizedBaseUrl}/${normalizedPath}`
}