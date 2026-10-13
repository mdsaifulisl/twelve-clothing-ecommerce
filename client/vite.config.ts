import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // ১. এটি ইম্পোর্ট করুন
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ২. এখানে প্লাগইনটি যুক্ত করুন
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});