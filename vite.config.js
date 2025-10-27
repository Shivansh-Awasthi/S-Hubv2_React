import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Define global variables
    define: {
      'process.env': JSON.stringify(env), // Makes process.env available in your app
    },
    plugins: [react(),
    removeConsole(),
    ],

    // ✅ Add this section:
    preview: {
      host: '0.0.0.0',                  // allow access from outside
      port: 8080,                       // must match your aaPanel config
      allowedHosts: ['toxicgames.in'], // ✅ allow your domain
    },
  }
})
