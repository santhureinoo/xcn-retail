import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      // If you have path aliases in your tsconfig.json
      '@': path.resolve(__dirname, './src'),
    },
  },
  // If you need to specify a different port
  server: {
    port: 3000,
    allowedHosts: ['d498-2a09-bac1-6f20-00-277-64.ngrok-free.app'],
  },
});