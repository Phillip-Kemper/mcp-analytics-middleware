import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'web-viewer',
  build: {
    outDir: '../dist/web-viewer/public',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'web-viewer/src')
    }
  }
}); 
