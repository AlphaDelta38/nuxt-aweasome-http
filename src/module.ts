import { defineNuxtModule, addImports, createResolver } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-aweasome-http',
    configKey: 'aweasomeHttp',
  },

  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addImports([
      {
        name: 'useHttp',
        as: 'useHttp',
        from: resolver.resolve('./runtime/exports'),
      },
      {
        name: 'initAweasomeHttp',
        as: 'initAweasomeHttp',
        from: resolver.resolve('./runtime/exports'),
      },
      {
        name: 'request',
        as: 'request',
        from: resolver.resolve('./runtime/exports'),
      },
      {
        name: 'clearCache',
        as: 'clearCache',
        from: resolver.resolve('./runtime/exports'),
      }
    ])
  },
})
