import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Fuente = app.html (referencia /src/main.tsx). El build sale a dist/ como
// single-file autocontenido y el package.json lo renombra a index.html y lo
// copia a la raíz de /prototype/ para que GitHub Pages lo sirva directamente.
// Esto evita que /prototype/ sirva el HTML de desarrollo (roto en producción).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, 'app.html'),
    },
  },
})
