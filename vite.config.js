import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { weddingInfo } from './shared/data/info.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const concept = process.env.CONCEPT || 'classic'
const siteBaseUrl = (process.env.VITE_SITE_URL || 'https://bingsuhee.github.io/wedding-invitation').replace(/\/$/, '')
const sharePageUrl = `${siteBaseUrl}/${concept}/`
const shareImage = 'images/og-cover.png'

const shareMeta = {
  title: `${weddingInfo.groom.name.slice(1)}이와 ${weddingInfo.bride.name.slice(1)}의 결혼식에 초대드립니다.`,
  description: `${weddingInfo.dateLabel} ${weddingInfo.timeLabel} ${weddingInfo.location.name}`,
  image: `${sharePageUrl}${shareImage}`,
  url: sharePageUrl,
}

function weddingMetaPlugin() {
  return {
    name: 'wedding-meta',
    transformIndexHtml(html) {
      return html
        .replaceAll('__WEDDING_SHARE_TITLE__', shareMeta.title)
        .replaceAll('__WEDDING_SHARE_DESCRIPTION__', shareMeta.description)
        .replaceAll('__WEDDING_SHARE_IMAGE__', shareMeta.image)
        .replaceAll('__WEDDING_SHARE_URL__', shareMeta.url)
    },
  }
}

export default defineConfig({
  plugins: [react(), weddingMetaPlugin()],
  base: './',
  root: resolve(__dirname, concept),
  publicDir: resolve(__dirname, 'shared', 'public'),
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
