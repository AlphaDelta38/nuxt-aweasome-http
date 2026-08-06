import { onServerPrefetch, onUnmounted, ref, shallowRef, useId } from 'vue'
import { useState, clearNuxtState } from '#imports'

import { request } from './fetct'

import type {
  ConventionEndpoint,
  GetDataFromConvention,
  GetParamsFromConvention,
  GetQueryFromConvention,
  RequestOptions,
} from './utility-types'
import { getCache, setCache } from './indexDB'
import type { ComposableResponse } from './types'

type UseAweasomeHttpOptions<T extends ConventionEndpoint> = {
  initOptions?: RequestOptions<T>
  lazy?: boolean
  ssr?: boolean
  cache?: boolean
  ttl?: number
  componentKey?: string
  effect?: (data: GetDataFromConvention<T>, config: {
    cache: boolean,
    query?: GetQueryFromConvention<T>
    params?: GetParamsFromConvention<T>
    isServer: boolean
  }) => void
}

const useAweasomeHttp = <T extends ConventionEndpoint>(
  url: T,
  {
    initOptions,
    lazy = false,
    ssr = false,
    cache = false,
    ttl = 60 * 60 * 24,
    componentKey,
    effect,
  }: UseAweasomeHttpOptions<T> = {},
): ComposableResponse<T> => {
  const componentId = useId()
  const stateKey = `awesome-http:${componentKey ?? componentId}:${url}`

  const isServer = typeof window === 'undefined'
  const shouldFetch = !lazy && (!isServer || ssr)

  const isLoading = ref(false)
  const isCacheLoading = ref(cache && !ssr)
  const isFreshData = ref(false)

  const error = shallowRef<unknown>(null)
  const data = useState<GetDataFromConvention<T> | null>(
    stateKey,
    () => null,
  )

  const initialize = async (): Promise<void> => {
    if (!isServer && cache && !ssr) {
      const cachedData = await getCache(url, {params: initOptions?.params, query: initOptions?.query })
      isCacheLoading.value = false
      if (cachedData != null ) {
        data.value = cachedData
        
        effect?.(cachedData, {
          isServer: false,
          cache: true,
          params: initOptions?.params,
          query: initOptions?.query,
        })
      }
    }
  
    await execute()
  }

  const execute = async (
    options?: RequestOptions<T>,
  ): Promise<GetDataFromConvention<T>> => {
    isLoading.value = true

    try {
      const result = await request(
        url,
        options ?? initOptions,
      )

      data.value = result

      const requestParams = options?.params ?? initOptions?.params
      const requestQuery = options?.query ?? initOptions?.query 

      effect?.(result, {
        cache: false,
        isServer,
        params: requestParams,
        query: requestQuery
      })

      if (cache && !isServer) {
        void setCache(url, result, {ttl, params: requestParams, query: requestQuery })
      }

      isFreshData.value = true
      return result
    } catch (requestError) {
      error.value = requestError
      throw requestError
    } finally {
      isLoading.value = false
    }
  }

  if (shouldFetch) {
    if (isServer && ssr) {
      onServerPrefetch(initialize)
    } else if (data.value === null) {
      void initialize().catch((requestError) => {
        error.value = requestError
      })
    } else {
      effect?.(data.value, {
        isServer: true,
        cache: false,
        params: initOptions?.params,
        query: initOptions?.query,
      })
    }
  }

  onUnmounted(() => {
    clearNuxtState(stateKey)
  })

  return {
    isLoading,
    isCacheLoading,
    isFreshData,
    data,
    fetch: execute,
    error,
  }
}

export default useAweasomeHttp
