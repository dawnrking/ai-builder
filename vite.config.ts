import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { writeFileSync, readFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        // 复制 index.html 到 404.html，支持 GitHub Pages SPA 路由
        const indexPath = resolve(__dirname, 'docs/index.html')
        const notFoundPath = resolve(__dirname, 'docs/404.html')
        writeFileSync(notFoundPath, readFileSync(indexPath))
      }
    }
  ],
  base: '/ai-builder/',
  build: {
    outDir: 'docs'
  }
})
