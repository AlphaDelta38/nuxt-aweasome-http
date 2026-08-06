// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    './src/module',
    'nuxt-i18n-micro'
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', dir: 'ltr' },
      { code: 'uk', iso: 'uk-UA', dir: 'ltr' }
    ],
    defaultLocale: 'uk',
    translationDir: 'locales',
    meta: true,
    strategy: 'no_prefix',
    localeCookie: 'user-locale'
  }
})
