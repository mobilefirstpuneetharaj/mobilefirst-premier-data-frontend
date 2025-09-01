import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true // Allow external access
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    // Add this for better SPA handling
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Important for client-side routing
  base: './'
})