import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ['animejs'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  server: {
    host: true, 
    port: 3000,
    open: true, 
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    // --- TAMBAHKAN BAGIAN INI ---
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    // ----------------------------
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },

  assetsInclude: ['**/*.json'],
});

