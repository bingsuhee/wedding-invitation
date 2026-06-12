import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const concept = process.env.CONCEPT || 'classic'

export default defineConfig({
  plugins: [react()],
  base: './',
  root: resolve(__dirname, concept),
  publicDir: resolve(__dirname, concept, 'public'),
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist', concept),
    emptyOutDir: true,
  },
})
