import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// Plugin to copy sql-wasm.wasm to build output
function copySqlWasm() {
  return {
    name: 'copy-sql-wasm',
    buildStart() {
      try {
        mkdirSync('public', { recursive: true })
        copyFileSync(
          resolve('node_modules/sql.js/dist/sql-wasm.wasm'),
          resolve('public/sql-wasm.wasm')
        )
      } catch (e) {
        console.warn('Could not copy sql-wasm.wasm:', e.message)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copySqlWasm()],
  optimizeDeps: {
    exclude: ['sql.js'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
})
