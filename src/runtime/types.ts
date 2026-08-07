import type { Ref, ShallowRef } from 'vue'
import type { GetDataFromConvention, RequestOptions } from './utility-types'

export type ResponseInterceptor = (
  response: Response,
) => Response | Promise<Response>

export interface RequestContext {
  url: string
  options: RequestInit
}


export type Settings = {
  baseUrl: string
  interceptors?: {
    request: (request: RequestContext) => RequestContext | Promise<RequestContext>
    response: ResponseInterceptor
  }
}

declare global {
  interface Convention {}
}

export interface ComposableResponse<path extends string> {
  data: Ref<GetDataFromConvention<path> | null>
  isLoading: Ref<boolean>
  isCacheLoading: Ref<boolean>
  isFreshData: Ref<boolean>
  error: Ref<unknown | null>
  fetch: (data?: { options?: RequestOptions<path>, useCache?: boolean }) => Promise<GetDataFromConvention<path>>
}