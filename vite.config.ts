/* ~~/vite.config.ts */

import autoImport from 'unplugin-auto-import/vite'
import autoprefixer from 'autoprefixer'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { gzip } from 'zlib'
import { promisify } from 'node:util'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'
import tailwind from 'tailwindcss'
import topLevelAwait from 'vite-plugin-top-level-await'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/smatt/',
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwind()],
    },
  },
  build: { compilerOptions: { target: 'esnext' } },
  optimizeDeps: { exclude: ['pyodide'] },
  plugins: [
    autoImport({
      dirs: ['./src/stores'],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        {
          '@vueuse/core': ['useColorMode'],
        },
        'pinia',
        'vue',
        'vue-router',
        {
          'vue-sonner': ['toast'],
        },
      ],
    }),
    svgLoader(),
    topLevelAwait(),
    vue(),
    {
      generateBundle: async () => {
        let assetsDir = 'dist/assets'
        await mkdir(assetsDir, { recursive: true })
        let files = ['pyodide-lock.json', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip']
        let gzipAsync = promisify(gzip)
        let modulePath = resolve(__dirname, './static/')
        for (let file of files) {
          let buffer = await readFile(resolve(modulePath, file))
          let compressed = await gzipAsync(buffer)
          await writeFile(resolve(assetsDir, file), compressed)
        }
      },
      name: 'vite-pyodide',
    },
    {
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          next()
        })
      },
      name: 'configure-response-headers',
    },
  ],
  publicDir: fileURLToPath(new URL('./static', import.meta.url)),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  worker: { format: 'es' },
})
