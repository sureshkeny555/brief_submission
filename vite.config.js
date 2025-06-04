// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ebriefdev.ckdigital.in', // Your API server URL
        changeOrigin: true, // To ensure the origin header is properly set
        secure: false, // Set to false if using HTTP or self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Rewrite the path if needed
      },
    },
  },
})
