import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Fichiers statiques servis avant React Router
    fs: {
      strict: false,
    },
  },
  // Assure que public/ est bien la racine des assets statiques
  publicDir: 'public',
})