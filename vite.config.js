import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import postcssPxToViewport from 'postcss-px-to-viewport'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToViewport({
          viewportWidth: 375,
          viewportHeight: 667,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore', '.hairlines'],
          minPixelValue: 1,
          mediaQuery: false,
          exclude: [/node_modules/]
        }),
        autoprefixer({
          overrideBrowserslist: ['Android >= 4.0', 'iOS >= 8']
        })
      ]
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true
  }
})
