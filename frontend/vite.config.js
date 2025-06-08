// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy hanya untuk permintaan API, bukan semua file
      '/api': 'http://localhost:5000',
    },
  },
})
