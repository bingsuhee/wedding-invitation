import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 빌드할 컨셉 디렉토리: CONCEPT 환경변수로 지정 (기본값 'a')
const concept = process.env.CONCEPT || 'a'

export default defineConfig({
  plugins: [react()],
  base: './',
  root: resolve(__dirname, concept),
  publicDir: resolve(__dirname, concept, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist', concept),
    emptyOutDir: true,
  },
})
