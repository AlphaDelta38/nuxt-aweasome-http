import type { Settings } from './types'
import type {
  ConventionEndpoint,
  RequestOptions,
  GetDataFromConvention,
} from './utility-types'

import { resolveUrl } from './utility/base-url'
import { buildUrl } from './utility/query-builder'
import { resolveEndpoint } from './utility/resolve-endpoint'

const settings: Settings = {
  baseUrl: '',
}

export async function request<T extends ConventionEndpoint>(
  endpoint: T,
  options: RequestOptions<T> = {},
): Promise<GetDataFromConvention<T>> {
  const {
    params,
    query,
    ...requestInit
  } = options

  const { method, path } = resolveEndpoint(endpoint)

  const builtUrl = buildUrl({
    path: resolveUrl(settings.baseUrl, path),
    params,
    query,
  })

  const initialContext = {
    url: builtUrl,
    options: {
      ...requestInit,
      method,
    },
  }

  const interceptedContext =
    await settings.interceptors?.request?.(initialContext)
    ?? initialContext

  const response = await fetch(
    interceptedContext.url,
    interceptedContext.options,
  )

  const interceptedResponse =
    await settings.interceptors?.response?.(response)
    ?? response

  if (!interceptedResponse.ok) {
    throw new Error(
      `HTTP ${interceptedResponse.status}: ${interceptedResponse.statusText}`,
    )
  }

  return interceptedResponse.json() as Promise<
    GetDataFromConvention<T>
  >
}


export function initAweasomeHttp(newSettings: Settings) {
  Object.assign(settings, newSettings)
}