import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sitemap } from 'vite-plugin-sitemap'


// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api': {
        target: "https://grokart-2.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    },
  },
  
  plugins: [
    react(),
    sitemap({
      hostname: 'https://grokartapp.com', // replace with your actual domain
      routes: [
        '/',
        '/products',
        '/cart',
        '/about',
        '/contact',
        '/register',
        '/login',
        '/category/:categoryName',
        '/subCategory/:subCategory',
        '/minicategory/:miniCategory',
        '/all-products',
        '/products/:productId',
        '/address',
        '/checkout',
        '/payment',
        '/payment-success',
        '/order-history',
        '/mini',
        '/category',
        '/contact-us',
        '/terms-conditions',
        '/cancellation',
        '/policy',
        '/about',
        '/offers'

        // Add other important routes
      ]
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increases the warning limit
  },
})
