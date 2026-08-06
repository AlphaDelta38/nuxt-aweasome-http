export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'

type CleanRouteParamName<Param extends string> =
  Param extends `${infer Name}?${string}`
    ? Name
    : Param extends `${infer Name}#${string}`
      ? Name
      : Param

export type RouteParamNames<Path extends string> =
  Path extends `${infer Segment}/${infer Rest}`
    ? Segment extends `:${infer Param}`
      ? CleanRouteParamName<Param> | RouteParamNames<Rest>
      : RouteParamNames<Rest>
    : Path extends `:${infer Param}`
      ? CleanRouteParamName<Param>
      : never

export type RouteParams<Path extends string> = {
  [Key in RouteParamNames<Path>]: string | number
}

export type EndpointMethod<Endpoint extends string> =
  Endpoint extends `${infer Method}: ${string}`
    ? Method extends HttpMethod
      ? Method
      : never
    : never

export type EndpointPath<Endpoint extends string> =
  Endpoint extends `${HttpMethod}: ${infer Path}`
    ? Path
    : never

export type ConventionEndpoint = keyof Convention extends never ? string : Extract<keyof Convention, string>

type StrictEmpty<T> = [keyof T] extends [never] ? never : T

export type RequestOptions<T extends string> =
  Omit<RequestInit, 'method'> & {
    params?: StrictEmpty<GetParamsFromConvention<T>>
    query?: StrictEmpty<GetQueryFromConvention<T>>
  }

export type GetQueryFromConvention<T extends string> = T extends keyof Convention ? Convention[T]['query'] : any

export type GetDataFromConvention<T extends string> = T extends keyof Convention ? Convention[T]['data'] : any

export type GetParamsFromConvention<T extends string> = RouteParams<EndpointPath<T>>