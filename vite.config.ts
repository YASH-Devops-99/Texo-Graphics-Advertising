import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This must match your GitHub repository name exactly, surrounded by slashes.
  base: '/Texo-Graphics-Advertising/', 
  build: {
    outDir: 'dist',
  },
});