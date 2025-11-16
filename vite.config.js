import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: true, // ✅ Active les sourcemaps en dev
    preprocessorOptions: {
      scss: {
        // Pas d'additionalData si vous importez manuellement
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  build: {
    sourcemap: true, // ✅ Active les sourcemaps en production aussi (optionnel)
  },
});