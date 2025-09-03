import { defineConfig } from 'vite'
import inject from '@rollup/plugin-inject';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    inject({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
})
