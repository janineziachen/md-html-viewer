import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/mobile-md-html/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'MobileMD',
        short_name: 'MobileMD',
        description: '在手机上预览 md/json/html/pdf 与粘贴文本',
        lang: 'zh-CN',
        theme_color: '#1a1a1a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/mobile-md-html/',
        scope: '/mobile-md-html/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
})
