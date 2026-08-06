import { EndpointMethod, EndpointPath, HttpMethod } from "../utility-types"

type ResolvedEndpoint<Endpoint extends string> = {
  method: EndpointMethod<Endpoint>
  path: EndpointPath<Endpoint>
}

const HTTP_METHODS: readonly HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
]

function isHttpMethod(value: string): value is HttpMethod {
  return HTTP_METHODS.includes(value as HttpMethod)
}

export function resolveEndpoint<
  Endpoint extends `${HttpMethod}: ${string}`,
>(
  endpoint: Endpoint,
): ResolvedEndpoint<Endpoint> {
  const separatorIndex = endpoint.indexOf(':')

  const method = endpoint
    .slice(0, separatorIndex)
    .trim()

  const path = endpoint
    .slice(separatorIndex + 1)
    .trim()

  if (!isHttpMethod(method)) {
    throw new Error(`Invalid HTTP method: ${method}`)
  }

  if (!path) {
    throw new Error(`Endpoint path is empty: ${endpoint}`)
  }

  return {
    method: method as EndpointMethod<Endpoint>,
    path: path as EndpointPath<Endpoint>,
  }
}