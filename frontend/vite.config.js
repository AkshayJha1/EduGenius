import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",  // Ensure build output is in "dist"
    assetsDir: "assets",  // Keep assets in "assets" folder
  },
  server: {
    historyApiFallback: true, // Important for React Router
  }
})
