import type {
  ConventionEndpoint,
  RequestOptions,
  GetDataFromConvention,
} from '../utility-types'

import { buildUrl } from '../utility/query-builder'
import { resolveEndpoint } from '../utility/resolve-endpoint'

const DB_NAME = 'vue-awesome-http'

const DB_VERSION = 1

const STORE_NAME = 'http-cache'
const CREATED_AT_INDEX = 'created-at'

const QUOTA_CLEANUP_BATCH_SIZE = 20

type CacheRequestOptions<
  T extends ConventionEndpoint,
> = Pick<RequestOptions<T>, 'params' | 'query'>

type SetCacheOptions<
  T extends ConventionEndpoint,
> = CacheRequestOptions<T> & {
  ttl?: number | null
}

interface CacheEntry<T> {
  data: T
  createdAt: number
  expiresAt: number | null
}

let databasePromise: Promise<IDBDatabase> | null = null

function isIndexedDbAvailable(): boolean {
  return typeof globalThis.indexedDB !== 'undefined'
}

function assertIndexedDbAvailable(): void {
  if (!isIndexedDbAvailable()) {
    throw new Error(
      'IndexedDB is not available in the current environment',
    )
  }
}

function requestToPromise<T>(
  request: IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(
        request.error ??
          new Error('IndexedDB request failed'),
      )
    }
  })
}

function transactionToPromise(
  transaction: IDBTransaction,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false

    const resolveOnce = (): void => {
      if (settled) {
        return
      }

      settled = true
      resolve()
    }

    const rejectOnce = (error: unknown): void => {
      if (settled) {
        return
      }

      settled = true
      reject(error)
    }

    transaction.oncomplete = () => {
      resolveOnce()
    }

    transaction.onerror = () => {
      rejectOnce(
        transaction.error ??
          new Error('IndexedDB transaction failed'),
      )
    }

    transaction.onabort = () => {
      rejectOnce(
        transaction.error ??
          new Error('IndexedDB transaction aborted'),
      )
    }
  })
}

function isQuotaExceededError(
  error: unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name === 'QuotaExceededError'
  )
}

function openDatabase(): Promise<IDBDatabase> {
  assertIndexedDbAvailable()

  if (databasePromise) {
    return databasePromise
  }

  databasePromise = new Promise((resolve, reject) => {
    const openRequest = globalThis.indexedDB.open(
      DB_NAME,
      DB_VERSION,
    )

    openRequest.onupgradeneeded = () => {
      const database = openRequest.result
      const upgradeTransaction =
        openRequest.transaction

      let store: IDBObjectStore

      if (
        !database.objectStoreNames.contains(STORE_NAME)
      ) {
        store = database.createObjectStore(
          STORE_NAME,
        )
      } else {
        if (!upgradeTransaction) {
          throw new Error(
            'IndexedDB upgrade transaction is unavailable',
          )
        }

        store = upgradeTransaction.objectStore(
          STORE_NAME,
        )
      }

      if (
        !store.indexNames.contains(CREATED_AT_INDEX)
      ) {
        store.createIndex(
          CREATED_AT_INDEX,
          'createdAt',
          {
            unique: false,
          },
        )
      }
    }

    openRequest.onsuccess = () => {
      const database = openRequest.result

      database.onversionchange = () => {
        database.close()
        databasePromise = null
      }

      resolve(database)
    }

    openRequest.onerror = () => {
      databasePromise = null

      reject(
        openRequest.error ??
          new Error('Failed to open IndexedDB'),
      )
    }

    openRequest.onblocked = () => {
      console.warn(
        `IndexedDB "${DB_NAME}" is blocked by another tab`,
      )
    }
  })

  return databasePromise
}

type StoreTransactionMode =
  | 'readonly'
  | 'readwrite'

async function getStore(
  mode: StoreTransactionMode,
): Promise<{
  store: IDBObjectStore
  transaction: IDBTransaction
}> {
  const database = await openDatabase()

  const transaction = database.transaction(
    STORE_NAME,
    mode,
  )

  return {
    transaction,
    store: transaction.objectStore(STORE_NAME),
  }
}

function sortQuery<T extends object | undefined>(
  query: T,
): T {
  if (!query) {
    return query
  }

  return Object.fromEntries(
    Object.entries(query).sort(
      ([firstKey], [secondKey]) =>
        firstKey.localeCompare(secondKey),
    ),
  ) as T
}

function createCacheKey<
  T extends ConventionEndpoint,
>(
  endpoint: T,
  {
    params,
    query,
  }: CacheRequestOptions<T> = {},
): string {
  const { method, path } = resolveEndpoint(endpoint)

  const resolvedUrl = buildUrl({
    path,
    params,
    query: sortQuery(query),
  })

  return `${method}:${path}::${resolvedUrl}`
}

async function writeCacheEntry<T>(
  key: string,
  entry: CacheEntry<T>,
): Promise<void> {
  const { store, transaction } =
    await getStore('readwrite')

  const transactionPromise =
    transactionToPromise(transaction)

  try {
    store.put(entry, key)
  } catch (error) {

    try {
      transaction.abort()
    } catch {
    }

    void transactionPromise.catch(() => {})

    throw error
  }

  await transactionPromise
}

async function deleteOldestCacheEntries(
  limit = QUOTA_CLEANUP_BATCH_SIZE,
): Promise<number> {
  if (limit <= 0) {
    return 0
  }

  const { store, transaction } =
    await getStore('readwrite')

  const transactionPromise =
    transactionToPromise(transaction)

  const createdAtIndex =
    store.index(CREATED_AT_INDEX)

  const cursorRequest =
    createdAtIndex.openCursor()

  let removedCount = 0

  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result

    if (
      !cursor ||
      removedCount >= limit
    ) {
      return
    }

    cursor.delete()
    removedCount += 1

    if (removedCount < limit) {
      cursor.continue()
    }
  }

  await transactionPromise

  return removedCount
}

export async function setCache<
  T extends ConventionEndpoint,
>(
  endpoint: T,
  data: GetDataFromConvention<T>,
  {
    params,
    query,
    ttl,
  }: SetCacheOptions<T> = {},
): Promise<void> {
  const key = createCacheKey(endpoint, {
    params,
    query,
  })

  const createdAt = Date.now()

  const entry: CacheEntry<GetDataFromConvention<T>> = {
    data,
    createdAt,

    expiresAt:
      ttl === undefined || ttl === null
        ? null
        : createdAt + Math.max(0, ttl),
  }

  while (true) {
    try {
      await writeCacheEntry(key, entry)

      return
    } catch (error) {
      if (!isQuotaExceededError(error)) {
        throw error
      }

      const removedCount =
        await deleteOldestCacheEntries(
          QUOTA_CLEANUP_BATCH_SIZE,
        )

      if (removedCount === 0) {
        throw new DOMException(
          'Cannot save cache: storage quota is exceeded and no cache entries remain to delete',
          'QuotaExceededError',
        )
      }
    }
  }
}

export async function getCache<
  T extends ConventionEndpoint,
>(
  endpoint: T,
  options: CacheRequestOptions<T> = {},
): Promise<GetDataFromConvention<T> | undefined> {
  const key = createCacheKey(endpoint, options)

  const { store } = await getStore('readonly')

  const entry = await requestToPromise<
    CacheEntry<GetDataFromConvention<T>> | undefined
  >(
    store.get(key),
  )

  if (!entry) {
    return undefined
  }

  const isExpired =
    entry.expiresAt !== null &&
    Date.now() >= entry.expiresAt

  if (isExpired) {
    await deleteCache(endpoint, options)

    return undefined
  }

  return entry.data
}

async function deleteCache<
  T extends ConventionEndpoint,
>(
  endpoint: T,
  options: CacheRequestOptions<T> = {},
): Promise<void> {
  const key = createCacheKey(endpoint, options)

  const { store, transaction } =
    await getStore('readwrite')

  const transactionPromise =
    transactionToPromise(transaction)

  store.delete(key)

  await transactionPromise
}

export async function clearCache(): Promise<void> {
  const { store, transaction } =
    await getStore('readwrite')

  const transactionPromise =
    transactionToPromise(transaction)

  store.clear()

  await transactionPromise
}
