import { defineNuxtModule, addImports, createResolver, addTypeTemplate } from '@nuxt/kit'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

export interface ModuleOptions {
  autoGenerateConventions?: boolean
  conventionsDir?: string
  conventionsDepth?: number
}

function findConventionFiles(dir: string, currentDepth: number, maxDepth: number): string[] {
  if (!existsSync(dir) || currentDepth > maxDepth) return []
  
  let results: string[] = []
  const list = readdirSync(dir)
  
  for (const file of list) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      results = results.concat(findConventionFiles(filePath, currentDepth + 1, maxDepth))
    } else if (file.endsWith('.convention.ts')) {
      results.push(filePath)
    }
  }
  
  return results
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-aweasome-http',
    configKey: 'aweasomeHttp',
  },

  defaults: {
    autoGenerateConventions: true,
    conventionsDir: 'conventions',
    conventionsDepth: 1
  },
  setup(options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    _nuxt.options.alias['#aweasome-http'] = resolver.resolve('./runtime')

    addImports([
      {
        name: 'default',
        as: 'useHttp',
        from: resolver.resolve('./runtime/index'),
      },
      {
        name: 'request',
        as: 'request',
        from: resolver.resolve('./runtime/fetct'),
      },
      {
        name: 'initAweasomeHttp',
        as: 'initAweasomeHttp',
        from: resolver.resolve('./runtime/init'),
      },
      {
        name: 'clearCache',
        as: 'clearCache',
        from: resolver.resolve('./runtime/clearCache'),
      }
    ])

    if (options.autoGenerateConventions !== false) {
      const conventionsDir = resolve(_nuxt.options.rootDir, options.conventionsDir || 'conventions')
      const maxDepth = options.conventionsDepth || 1

      addTypeTemplate({
        filename: 'nuxt-aweasome-http.d.ts',
        getContents: () => {
          const files = findConventionFiles(conventionsDir, 1, maxDepth)
          
          if (files.length === 0) {
            return `export {}`
          }

          let imports = ''
          let types: string[] = []
          
          files.forEach((file, index) => {
            const relativePath = file.replace(_nuxt.options.rootDir, '~~').replace(/\\/g, '/').replace(/\.ts$/, '')
            imports += `import type Endpoints_${index} from '${relativePath}'\n`
            types.push(`Endpoints_${index}`)
          })
          
          return `${imports}
  
  declare global {
    interface Convention extends ${types.join(', ')} {}
  }
  
  export {}`
        }
      })
    }
  },
})
