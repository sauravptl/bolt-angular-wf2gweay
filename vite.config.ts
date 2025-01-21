import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['pdfjs-dist', '@supabase/supabase-js']
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/pdfjs-dist/, /node_modules/],
      transformMixedEsModules: true
    },
    sourcemap: true
  }
});