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
    devSourcemap: true, 
    preprocessorOptions: {
      scss: {},
    },
  },
  server: {
    open: true,
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    sourcemap: true, 
  },
});