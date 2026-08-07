<template>
  <div class="demo-page">
    <header class="hero">
      <div class="hero-badge">⚡ {{ t('interactiveDocs') }}</div>
      <h1>useAweasomeHttp</h1>
      <p>{{ t('description') }}</p>
    </header>

    <section class="section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="section-title" style="margin: 0;"><span class="icon">🚀</span> {{ t('liveDemo') }}</h2>
        <div class="lang-switcher">
          <button 
            :class="['btn btn-ghost', { 'active': getLocale() === 'uk' }]" 
            @click="switchLocale('uk')"
          >UK</button>
          <button 
            :class="['btn btn-ghost', { 'active': getLocale() === 'en' }]" 
            @click="switchLocale('en')"
          >EN</button>
        </div>
      </div>
      <p class="section-desc">
        {{ t('liveDemoDesc') }}
      </p>

      <div class="card">
        <div class="controls-grid">
          <div class="control-item">
            <div class="control-label">
              <span>{{ t('ssr') }}</span>
              <span>{{ t('ssrDesc') }}</span>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                :checked="ssrEnabled"
                @change="handleSsrToggle"
              />
              <span class="toggle-track" />
            </label>
          </div>

          <div class="control-item">
            <div class="control-label">
              <span>{{ t('cache') }}</span>
              <span>{{ t('cacheDesc') }}</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="cacheEnabled" />
              <span class="toggle-track" />
            </label>
          </div>
          
          <div class="control-item">
            <div class="control-label">
              <span>{{ t('lazy') }}</span>
              <span>{{ t('lazyDesc') }}</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="lazyEnabled" />
              <span class="toggle-track" />
            </label>
          </div>
        </div>

        <div class="controls-grid">
          <div class="delay-input-group">
            <label for="delay-input">⏱ {{ t('delay') }}</label>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input
                id="delay-input"
                type="number"
                class="delay-input"
                v-model.lazy.number="delayMs"
                min="0"
                max="10000"
                step="500"
                placeholder="0"
              />
              <span class="delay-unit">{{ t('delayUnit') }}</span>
            </div>
          </div>
          
          <div class="delay-input-group">
            <label>📄 {{ t('page') }}</label>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-ghost" @click="currentPage--" :disabled="currentPage <= 1">◀</button>
              <input type="number" class="delay-input" v-model.lazy.number="currentPage" min="1" style="width: 60px; text-align: center;" />
              <button class="btn btn-ghost" @click="currentPage++">▶</button>
            </div>
          </div>
        </div>

        <TodoFetcher
          :ssr="ssrEnabled"
          :cache="cacheEnabled"
          :lazy="lazyEnabled"
          :delay="delayMs"
          :page="currentPage"
          :fetch-key="fetchKey"
          :key="fetchKey"
          ref="fetcherRef"
        />

        <div class="actions-row">
          <button class="btn btn-primary" @click="remount">
            🔄 {{ t('retryMount') }}
          </button>
          
          <button v-if="lazyEnabled" class="btn btn-primary" style="background: var(--primary); color: #000;" @click="fetcherRef?.triggerFetch()">
            📥 {{ t('loadLazy') }}
          </button>
          
          <button v-if="lazyEnabled" class="btn btn-ghost" style="color: var(--danger);" @click="fetcherRef?.clearData()">
            🗑 {{ t('clearElements') }}
          </button>
          
          <button class="btn btn-ghost" @click="clearAllCache">
            🗑 {{ t('clearCache') }}
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">
        <span class="icon">⚙️</span> {{ t('howItWorks') }}
      </h2>

      <div class="info-box">
        <span class="info-box-icon">💡</span>
        <div class="info-box-content">
          {{ t('ssrInfo') }}
        </div>
      </div>

      <div class="info-box tip">
        <span class="info-box-icon">🗄</span>
        <div class="info-box-content">
          {{ t('cacheInfo') }}
        </div>
      </div>

      <div class="info-box warning">
        <span class="info-box-icon">⏱</span>
        <div class="info-box-content">
          {{ t('delayInfo') }}
        </div>
      </div>
    </section>

    <div class="divider" />

    <section class="section">
      <h2 class="section-title">
        <span class="icon">📖</span> {{ t('usage') }}
      </h2>

      <div class="code-block">
        <pre><span class="keyword">import</span> useAweasomeHttp <span class="keyword">from</span> <span class="string">'vue-aweasome-http'</span>

<span class="keyword">const</span> { data, isLoading, isCacheLoading, isFreshData, error, fetch } =
  <span class="func">useAweasomeHttp</span>(<span class="string">'GET: https://jsonplaceholder.typicode.com/todos'</span>, {
    initOptions: {
      query: { _limit: <span class="type">10</span> },
      params: { id: <span class="type">1</span> },
    },
    ssr: <span class="type">true</span>,
    cache: <span class="type">true</span>,
    ttl: <span class="type">86400</span>,
    lazy: <span class="type">false</span>,
    componentKey: <span class="string">'my-list'</span>,
    <span class="func">effect</span>(data, config) {
      console.log(config.cache, config.isServer)
    },
  })</pre>
      </div>
    </section>

    <div class="divider" />

    <section class="section">
      <h2 class="section-title">
        <span class="icon">🪄</span> {{ t('typesTitle') }}
      </h2>
      <p class="section-desc" style="margin-bottom: 16px;">
        {{ t('typesDesc') }}
      </p>

      <div class="code-block">
        <pre><span class="comment">// domains/users/entities/users.convention.ts</span>
<span class="keyword">export default interface</span> <span class="type">UserEndpoints</span> {
  <span class="string">'GET: /users'</span>: {
    query: { _limit?: <span class="type">number</span> }
    data: <span class="type">User</span>[]
  }
}</pre>
      </div>

      <div class="info-box tip" style="margin-top: 16px;">
        <span class="info-box-icon">💡</span>
        <div class="info-box-content">
          {{ t('typesNote') }}
        </div>
      </div>

      <div class="info-box warning" style="margin-top: 16px;">
        <span class="info-box-icon">⚠️</span>
        <div class="info-box-content">
          {{ t('typesWarning') }}
        </div>
      </div>
    </section>

    <div class="divider" />

    <section class="section">
      <h2 class="section-title">
        <span class="icon">🎛</span> {{ t('options') }}
      </h2>

      <div class="props-table-wrap">
        <table class="props-table">
          <thead>
            <tr>
              <th v-for="(header, i) in getArray('optionsHeaders')" :key="i">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="prop-name">initOptions</span></td>
              <td><span class="prop-type">RequestOptions&lt;T&gt;</span></td>
              <td><span class="prop-default">undefined</span></td>
              <td class="prop-desc">{{ t('optInitDesc') }}</td>
            </tr>
            <tr>
              <td><span class="prop-name">ssr</span></td>
              <td><span class="prop-type">boolean</span></td>
              <td><span class="prop-default">false</span></td>
              <td class="prop-desc">{{ t('optSsrDesc') }}</td>
            </tr>
            <tr>
              <td><span class="prop-name">cache</span></td>
              <td><span class="prop-type">boolean</span></td>
              <td><span class="prop-default">false</span></td>
              <td class="prop-desc">{{ t('optCacheDesc') }}</td>
            </tr>
            <tr>
              <td><span class="prop-name">ttl</span></td>
              <td><span class="prop-type">number</span></td>
              <td><span class="prop-default">86400000</span></td>
              <td class="prop-desc">{{ t('optTtlDesc') }}</td>
            </tr>
            <tr>
              <td><span class="prop-name">lazy</span></td>
              <td><span class="prop-type">boolean</span></td>
              <td><span class="prop-default">false</span></td>
              <td class="prop-desc">{{ t('optLazyDesc') }}</td>
            </tr>
            <tr>
              <td><span class="prop-name">componentKey</span></td>
              <td><span class="prop-type">string</span></td>
              <td><span class="prop-default">useId()</span></td>
              <td class="prop-desc">{{ t('optKeyDesc') }}</td>
            </tr>
            <tr>
              <td><span class="prop-name">effect</span></td>
              <td>
                <span class="prop-type">(data, config) =&gt; void</span>
              </td>
              <td><span class="prop-default">undefined</span></td>
              <td class="prop-desc">{{ t('optEffectDesc') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="divider" />

    <section class="section">
      <h2 class="section-title">
        <span class="icon">📤</span> {{ t('returns') }}
      </h2>

      <div class="return-grid">
        <div class="return-item">
          <div class="return-name">data</div>
          <div class="return-type">Ref&lt;T | null&gt;</div>
          <div class="return-desc">{{ t('retDataDesc') }}</div>
        </div>
        <div class="return-item">
          <div class="return-name">isLoading</div>
          <div class="return-type">Ref&lt;boolean&gt;</div>
          <div class="return-desc">{{ t('retLoadingDesc') }}</div>
        </div>
        <div class="return-item">
          <div class="return-name">isCacheLoading</div>
          <div class="return-type">Ref&lt;boolean&gt;</div>
          <div class="return-desc">{{ t('retCacheDesc') }}</div>
        </div>
        <div class="return-item">
          <div class="return-name">isFreshData</div>
          <div class="return-type">Ref&lt;boolean&gt;</div>
          <div class="return-desc">{{ t('retFreshDesc') }}</div>
        </div>
        <div class="return-item">
          <div class="return-name">error</div>
          <div class="return-type">Ref&lt;unknown&gt;</div>
          <div class="return-desc">{{ t('retErrorDesc') }}</div>
        </div>
        <div class="return-item">
          <div class="return-name">fetch</div>
          <div class="return-type">(opts?) =&gt; Promise&lt;T&gt;</div>
          <div class="return-desc">{{ t('retFetchDesc') }}</div>
        </div>
      </div>
    </section>

    <div class="divider" />

    <section class="section">
      <h2 class="section-title">
        <span class="icon">🔀</span> {{ t('behavior') }}
      </h2>

      <div class="props-table-wrap">
        <table class="props-table">
          <thead>
            <tr>
              <th v-for="(header, i) in getArray('behaviorHeaders')" :key="i">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="prop-default">false</span></td>
              <td><span class="prop-default">false</span></td>
              <td class="prop-desc">{{ t('behavior1') }}</td>
            </tr>
            <tr>
              <td><span class="prop-default">false</span></td>
              <td><span class="prop-default">true</span></td>
              <td class="prop-desc">{{ t('behavior2') }}</td>
            </tr>
            <tr>
              <td><span class="prop-default">true</span></td>
              <td><span class="prop-default">false</span></td>
              <td class="prop-desc">{{ t('behavior3') }}</td>
            </tr>
            <tr>
              <td><span class="prop-default">true</span></td>
              <td><span class="prop-default">true</span></td>
              <td class="prop-desc">{{ t('behavior4') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const { getLocale, switchLocale, t } = useI18n()
const getArray = (key: string) => t(key as any) as unknown as string[]
const route = useRoute()

const ssrEnabled = ref(route.query.ssr === 'true')
const cacheEnabled = ref(route.query.cache === 'true')
const lazyEnabled = ref(route.query.lazy === 'true')
const delayMs = ref(Number(route.query.delay) || 1500)
const currentPage = ref(Number(route.query.page) || 1)

const fetchKey = ref(0)
const fetcherRef = ref<any>(null)

function handleSsrToggle() {
  if (!import.meta.client) return

  const newSsr = !ssrEnabled.value
  const url = new URL(window.location.href)

  if (newSsr) url.searchParams.set('ssr', 'true')
  else url.searchParams.delete('ssr')

  if (cacheEnabled.value) url.searchParams.set('cache', 'true')
  else url.searchParams.delete('cache')
  
  if (lazyEnabled.value) url.searchParams.set('lazy', 'true')
  else url.searchParams.delete('lazy')

  if (delayMs.value > 0) url.searchParams.set('delay', String(delayMs.value))
  else url.searchParams.delete('delay')
  
  if (currentPage.value > 1) url.searchParams.set('page', String(currentPage.value))
  else url.searchParams.delete('page')

  window.location.href = url.toString()
}

watch([cacheEnabled, lazyEnabled], () => {
  remount()
  updateUrl()
})

watch(currentPage, () => {
  updateUrl()
})

watch(delayMs, () => {
  updateUrl()
})

function remount() {
  fetchKey.value++
}

function updateUrl() {
  if (!import.meta.client) return

  const url = new URL(window.location.href)

  if (ssrEnabled.value) url.searchParams.set('ssr', 'true')
  else url.searchParams.delete('ssr')

  if (cacheEnabled.value) url.searchParams.set('cache', 'true')
  else url.searchParams.delete('cache')
  
  if (lazyEnabled.value) url.searchParams.set('lazy', 'true')
  else url.searchParams.delete('lazy')

  if (delayMs.value > 0) url.searchParams.set('delay', String(delayMs.value))
  else url.searchParams.delete('delay')
  
  if (currentPage.value > 1) url.searchParams.set('page', String(currentPage.value))
  else url.searchParams.delete('page')

  window.history.replaceState({}, '', url.toString())
}

async function clearAllCache() {
  await clearCache()
  remount()
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #16161f;
  --bg-card-hover: #1c1c28;
  --bg-code: #1a1a25;
  --bg-input: #1a1a25;

  --text-primary: #e8e8f0;
  --text-secondary: #8888a0;
  --text-muted: #55556a;
  --text-accent: #a78bfa;

  --border-primary: #2a2a3a;
  --border-subtle: #1f1f2e;

  --accent-violet: #8b5cf6;
  --accent-violet-dim: rgba(139, 92, 246, 0.15);
  --accent-violet-glow: rgba(139, 92, 246, 0.3);
  --accent-emerald: #34d399;
  --accent-emerald-dim: rgba(52, 211, 153, 0.12);
  --accent-amber: #fbbf24;
  --accent-amber-dim: rgba(251, 191, 36, 0.12);
  --accent-rose: #f472b6;
  --accent-rose-dim: rgba(244, 114, 182, 0.12);
  --accent-sky: #38bdf8;
  --accent-sky-dim: rgba(56, 189, 248, 0.12);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--border-subtle);
  --shadow-glow: 0 0 30px var(--accent-violet-dim);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* ── Layout ── */
.demo-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 24px 120px;
}

/* ── Hero ── */
.hero {
  text-align: center;
  margin-bottom: 56px;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, var(--accent-violet-dim) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--accent-violet-dim);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-violet);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #fff 30%, var(--accent-violet) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-top: 14px;
  position: relative;
  z-index: 1;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* ── Section ── */
.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title .icon {
  font-size: 1.1rem;
}

.section-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.65;
}

/* ── Card ── */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-card);
  transition: border-color 0.25s ease;
}

.card:hover {
  border-color: rgba(139, 92, 246, 0.2);
}

.card + .card {
  margin-top: 16px;
}

/* ── Controls ── */
.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  gap: 12px;
}

.control-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.control-label span:first-child {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.control-label span:last-child {
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* ── Toggle Switch ── */
.toggle {
  position: relative;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: var(--text-muted);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle input:checked + .toggle-track {
  background: var(--accent-violet);
  border-color: var(--accent-violet);
  box-shadow: 0 0 12px var(--accent-violet-glow);
}

.toggle input:checked + .toggle-track::after {
  transform: translateX(22px);
  background: #fff;
}

/* ── Delay Input ── */
.delay-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.delay-input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.delay-input {
  width: 90px;
  padding: 8px 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.delay-input:focus {
  border-color: var(--accent-violet);
  box-shadow: 0 0 0 3px var(--accent-violet-dim);
}

.delay-unit {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-sm);
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--accent-violet);
  color: #fff;
  box-shadow: 0 2px 12px var(--accent-violet-glow);
}

.btn-primary:hover {
  background: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px var(--accent-violet-glow);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.btn-ghost:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.actions-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

/* ── Status badges ── */
.status-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
}

.status-chip.active {
  background: var(--accent-emerald-dim);
  color: var(--accent-emerald);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.status-chip.inactive {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}

.status-chip.loading {
  background: var(--accent-amber-dim);
  color: var(--accent-amber);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.status-chip.cache-hit {
  background: var(--accent-sky-dim);
  color: var(--accent-sky);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.status-chip.error {
  background: var(--accent-rose-dim);
  color: var(--accent-rose);
  border: 1px solid rgba(244, 114, 182, 0.2);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.dot.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ── Skeleton ── */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.skeleton-box {
  background: linear-gradient(
    90deg,
    var(--bg-primary) 25%,
    rgba(139, 92, 246, 0.06) 50%,
    var(--bg-primary) 75%
  );
  background-size: 400% 100%;
  animation: shimmer 2s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;
}

.skeleton-text {
  height: 14px;
  flex: 1;
}

.skeleton-text.short {
  width: 40%;
  flex: none;
}

.skeleton-id {
  width: 28px;
  height: 14px;
  flex-shrink: 0;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Todo List ── */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  transition: all 0.2s;
  animation: fadeInUp 0.35s ease both;
}

.todo-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-primary);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item:nth-child(1) { animation-delay: 0.02s; }
.todo-item:nth-child(2) { animation-delay: 0.06s; }
.todo-item:nth-child(3) { animation-delay: 0.10s; }
.todo-item:nth-child(4) { animation-delay: 0.14s; }
.todo-item:nth-child(5) { animation-delay: 0.18s; }

.todo-check {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.todo-check.done {
  background: var(--accent-emerald);
  border-color: var(--accent-emerald);
}

.todo-check.done svg {
  display: block;
}

.todo-check svg {
  display: none;
  width: 12px;
  height: 12px;
  stroke: #fff;
  stroke-width: 3;
  fill: none;
}

.todo-title {
  flex: 1;
  font-size: 0.88rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.todo-title.completed {
  color: var(--text-muted);
  text-decoration: line-through;
}

.todo-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--text-muted);
  background: var(--bg-primary);
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* ── Timer ── */
.timer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--text-muted);
  padding: 6px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.timer-value {
  color: var(--accent-amber);
  font-weight: 600;
}

/* ── Props Table ── */
.props-table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.props-table th {
  text-align: left;
  padding: 12px 16px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border-primary);
}

.props-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
}

.props-table tr:last-child td {
  border-bottom: none;
}

.props-table tr:hover td {
  background: rgba(139, 92, 246, 0.02);
}

.prop-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--accent-violet);
  font-weight: 500;
}

.prop-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent-emerald);
  background: var(--accent-emerald-dim);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.prop-default {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent-amber);
}

.prop-desc {
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ── Code Block ── */
.code-block {
  background: var(--bg-code);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  overflow-x: auto;
  margin: 12px 0;
}

.code-block pre {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.code-block .keyword { color: var(--accent-violet); }
.code-block .string { color: var(--accent-emerald); }
.code-block .comment { color: var(--text-muted); font-style: italic; }
.code-block .func { color: var(--accent-sky); }
.code-block .type { color: var(--accent-amber); }
.code-block .punct { color: var(--text-muted); }

/* ── Info Box ── */
.info-box {
  display: flex;
  gap: 12px;
  padding: 16px 18px;
  background: var(--accent-violet-dim);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.info-box.tip {
  background: var(--accent-emerald-dim);
  border-color: rgba(52, 211, 153, 0.2);
}

.info-box.warning {
  background: var(--accent-amber-dim);
  border-color: rgba(251, 191, 36, 0.2);
}

.info-box-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.info-box-content {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.info-box-content strong {
  color: var(--text-primary);
}

/* ── Return Values ── */
.return-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
}

.return-item {
  padding: 14px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.return-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-sky);
  margin-bottom: 4px;
}

.return-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.return-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.empty-state .icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

/* ── Divider ── */
.divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 32px 0;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .demo-page {
    padding: 32px 16px 80px;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .return-grid {
    grid-template-columns: 1fr;
  }
}

</style>