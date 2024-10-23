/// <reference types="vitest" />

import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import manifest from './src/manifest'

export default defineConfig({
  // @see https://github.com/crxjs/chrome-extension-tools/issues/696
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  // prevent src/ prefix on extension urls
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // see web_accessible_resources in the manifest config
        welcome: join(__dirname, 'src/welcome/welcome.html'),
      },
      external: ['webextension-polyfill'],
      output: {
        chunkFileNames: 'assets/chunk-[hash].js',
      },
    },
  },
  plugins: [react(), crx({ manifest })],
})
