import path from "path"
import { fileURLToPath } from "url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ command, mode }) => {
  // Đơn giản hóa - chỉ check production mode
  // const isProduction = mode === 'production'
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      },
    },
    define: {
      'process.env': {}
    },
    // Base path sẽ được set khi build cho GitHub Pages
    base: '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react']
          }
        }
      }
    },
    server: {
      port: 3000,
      host: true
    },
    preview: {
      port: 4173,
      host: true
    }
  }
})