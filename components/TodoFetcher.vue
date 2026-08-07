<template>
  <div class="status-bar">
    <span v-if="showSkeleton" class="status-chip loading">
      <span class="dot pulse" /> {{ t('statusLoading') }}
    </span>

    <span v-if="cacheElapsed !== null" class="status-chip cache-hit">
      <span class="dot" /> {{ t('statusCache')?.toString().replace('{ms}', cacheElapsed.toString()) }}
    </span>

    <span v-if="isLoading && gotCacheData" class="status-chip loading">
      <span class="dot pulse" /> {{ t('statusBgUpdate') }}
    </span>

    <span v-if="networkElapsed !== null" class="status-chip active">
      <span class="dot" /> {{ t('statusNetwork')?.toString().replace('{ms}', networkElapsed.toString()) }}
    </span>

    <span v-if="ssrRendered" class="status-chip active">
      <span class="dot" /> {{ t('statusSsr') }}
    </span>

    <span
      v-if="props.lazy && !data && !isLoading && !isCacheLoading && !error"
      class="status-chip inactive"
    >
      <span class="dot" /> {{ t('statusWait') }}
    </span>

    <span v-if="error" class="status-chip error">
      <span class="dot" /> {{ t('statusError') }}
    </span>
  </div>

  <div v-if="data && !showSkeleton" class="todo-list">
    <div v-for="todo in data" :key="todo.id" class="todo-item">
      <div class="todo-check" :class="{ done: todo.completed }">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span class="todo-title" :class="{ completed: todo.completed }">
        {{ todo.title }}
      </span>
      <span class="todo-id">#{{ todo.id }}</span>
    </div>
  </div>

  <div v-else-if="showSkeleton" class="skeleton-list">
    <div
      v-for="(w, i) in ['75%', '55%', '85%', '45%', '65%']"
      :key="i"
      class="skeleton-item"
    >
      <div class="skeleton-box skeleton-checkbox" />
      <div class="skeleton-box skeleton-text" :style="{ width: w }" />
      <div class="skeleton-box skeleton-id" />
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="icon">{{ error ? '⚠️' : '📭' }}</div>
    <div>
      {{
        error
          ? t('errorLoading')
          : props.lazy
            ? t('pressToLoad')
            : t('noData')
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import { ref, computed, watch, onMounted, watchEffect } from 'vue'

type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

const props = defineProps<{
  ssr: boolean
  cache: boolean
  lazy: boolean
  delay: number
  page: number
  fetchKey: number
}>()

watchEffect(() => {
  if (import.meta.client) {
    initAweasomeHttp({
      baseUrl: '',
      interceptors: {
        request: async (ctx) => {
          if (ctx.url.includes('jsonplaceholder') && props.delay > 0) {
            await new Promise(r => setTimeout(r, props.delay))
          }
          return ctx
        },
        response: (r) => r
      }
    })
  }
})

let setupTime = props.lazy ? 0 : Date.now()
const cacheElapsed = ref<number | null>(null)
const networkElapsed = ref<number | null>(null)
const gotCacheData = ref(false)
const ssrRendered = ref(false)

const {
  data,
  isLoading,
  isCacheLoading,
  isFreshData,
  error,
  fetch: refetch,
} = useHttp('GET: https://jsonplaceholder.typicode.com/todos', {
  ssr: props.ssr,
  cache: props.cache,
  lazy: props.lazy,
  ttl: 3600000,
  initOptions: {
    query: {
      _start: (props.page - 1) * 5,
      _limit: 5,
    },
  },
  effect(_data, config) {
    if (config.cache) {
      gotCacheData.value = true
      if (cacheElapsed.value === null) {
        cacheElapsed.value = Date.now() - setupTime
      }
    }
    if (config.isServer) {
      ssrRendered.value = true
    }
  },
})

const showSkeleton = computed(() => {
  if (gotCacheData.value && data.value) return false
  if (ssrRendered.value && data.value) return false
  if (props.lazy && !isLoading.value && !isCacheLoading.value) return false
  
  if (isLoading.value || isCacheLoading.value) return true
  if (!data.value) return true
  return false
})


watch(isFreshData, (val) => {
  if (val && networkElapsed.value === null) {
    networkElapsed.value = Date.now() - setupTime
  }
})

onMounted(() => {
  if (props.ssr && data.value && !isLoading.value) {
    ssrRendered.value = true
    networkElapsed.value = Date.now() - setupTime
  }
  
  if (isFreshData.value && networkElapsed.value === null) {
    networkElapsed.value = Date.now() - setupTime
  }
})

async function triggerFetch(page?: number) {
  setupTime = Date.now()
  cacheElapsed.value = null
  networkElapsed.value = null
  gotCacheData.value = false
  ssrRendered.value = false
  isFreshData.value = false

  return refetch({
    useCache: true,
    options: {
      query: {
        _start: ((page ?? props.page) - 1) * 5,
        _limit: 5,
      },
    },
  })
}

watch(() => props.page, (newPage) => {
  triggerFetch(newPage)
})

function clearData() {
  data.value = null
  cacheElapsed.value = null
  networkElapsed.value = null
  gotCacheData.value = false
  ssrRendered.value = false
}

defineExpose({ triggerFetch, clearData })
</script>
