import type { RouteParams } from '../utility-types'

type QueryValue = string | number | boolean | undefined | null

export function buildUrl<
  Path extends string,
  Query extends Record<string, QueryValue>,
>(
  {path, params, query}: {path: Path, params?: RouteParams<Path>, query?: Query}
): string {
  const resolvedPath = path.replace(
    /:([A-Za-z_][A-Za-z0-9_]*)/g,
    (_, key: string) => {
      const value = params?.[key as keyof typeof params]

      if (value === undefined || value === null) {
        throw new Error(`Missing URL parameter: ${key}`)
      }

      return encodeURIComponent(String(value))
    },
  )

  if (!query) {
    return resolvedPath
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue
    }

    searchParams.append(key, String(value))
  }

  const queryString = searchParams.toString()

  if (!queryString) {
    return resolvedPath
  }

  const separator = resolvedPath.includes('?') ? '&' : '?'

  return `${resolvedPath}${separator}${queryString}`
}