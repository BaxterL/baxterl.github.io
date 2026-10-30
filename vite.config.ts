import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages (user site) serves the contents of docs/.
// `static/` keeps Vite's hashed bundles away from the preserved /assets/ tree.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    assetsDir: 'static',
    emptyOutDir: true,
    target: 'es2020',
  },
  server: {
    port: 5179,
    strictPort: false,
  },
})

