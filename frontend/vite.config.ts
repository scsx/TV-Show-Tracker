import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tmdb-image-proxy': {
        target: 'https://image.tmdb.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/tmdb-image-proxy/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared/types': path.resolve(__dirname, '../../shared/types'),
    },
  },
})
