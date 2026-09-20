import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = (env.VITE_API_BASE_URL || 'https://ozven.vercel.app/api/public').trim()

  let proxyTarget = 'https://ozven.vercel.app'
  try {
    // Derive host from VITE_API_BASE_URL (e.g. https://ozven.vercel.app/api/public)
    proxyTarget = new URL(
      /^https?:\/\//i.test(apiBase) ? apiBase : `https://${apiBase}`,
    ).origin
  } catch {
    // keep default
  }

  if (env.VITE_API_PROXY_TARGET) {
    proxyTarget = env.VITE_API_PROXY_TARGET.replace(/\/+$/, '')
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: false,
      // Local UI → remote backend (admin/API on broadband). Avoids browser CORS.
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
