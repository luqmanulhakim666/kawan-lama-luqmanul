import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  srcDir: 'src/',
  routeRules: {
    '/**': {
      swr: false,
      cache: false
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  buildModules: ['@nuxt/typescript-build'],

  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  pinia: {
    autoImports: ['defineStore'] // Optional: automatically imports defineStore and other Pinia functions
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
}

export default config
